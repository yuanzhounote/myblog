import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

const COPY_SCRIPT = `
<script>
(function(){
  document.querySelectorAll('pre').forEach(function(pre){
    if(pre.querySelector('.copy-button')) return;
    var btn=document.createElement('button');
    btn.className='copy-button';
    btn.textContent='复制';
    btn.setAttribute('aria-label','复制代码');
    btn.onclick=function(){
      var code=pre.querySelector('code');
      var text=code?code.textContent:pre.textContent;
      navigator.clipboard.writeText(text).then(function(){
        btn.textContent='已复制!';
        setTimeout(function(){btn.textContent='复制';},2000);
      });
    };
    pre.appendChild(btn);
  });
})();
</script>`;

// hast 节点最小类型（仅为消除 any，覆盖本文件用到的字段）
interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

// 为所有图片补充原生懒加载与异步解码（不再重写图片路径：
// 全站图片均使用 /images/ 绝对路径，/content/assets 重写历史逻辑已废弃）
function rehypeImgAttributes() {
  return (tree: HastNode) => {
    const visit = (node: HastNode) => {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties = node.properties || {};
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

// 将 ```mermaid 代码块转换为 <div class="mermaid"> 原始图表源码 </div>，
// 供客户端 mermaid.run() 渲染。保留纯文本内容，由 rehype-stringify 负责转义。
function rehypeMermaid() {
  const collectText = (node: HastNode): string => {
    if (node.type === 'text') return node.value ?? '';
    if (!node.children) return '';
    return node.children.map(collectText).join('');
  };

  const visit = (node: HastNode, parent: HastNode | null, index: number) => {
    if (
      node.type === 'element' &&
      node.tagName === 'pre' &&
      parent &&
      Array.isArray(parent.children)
    ) {
      const code = node.children?.find(
        (c) => c.type === 'element' && c.tagName === 'code'
      );
      const className: string[] =
        (code?.properties?.className as string[] | undefined) || [];
      if (code && className.includes('language-mermaid')) {
        const source = collectText(code);
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['mermaid'] },
          children: [{ type: 'text', value: source }],
        };
        return;
      }
    }
    if (node.children) {
      node.children.forEach((child, i) => visit(child, node, i));
    }
  };

  return (tree: HastNode) => visit(tree, null, 0);
}

export async function renderMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkBreaks)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeMermaid)
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
    })
    .use(rehypeImgAttributes)
    .use(rehypeStringify)
    .process(content);

  let html = String(result);
  if (html.includes('<pre')) {
    html += COPY_SCRIPT;
  }
  return html;
}
