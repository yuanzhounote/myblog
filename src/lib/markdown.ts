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

function rehypeRewriteImages() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === 'element' && node.tagName === 'img') {
        const src = node.properties?.src;
        if (src && !src.startsWith('http') && !src.startsWith('/')) {
          node.properties.src = `/content/assets/${src}`;
        }
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
  const collectText = (node: any): string => {
    if (node.type === 'text') return node.value;
    if (!node.children) return '';
    return node.children.map(collectText).join('');
  };

  const visit = (node: any, parent: any, index: number) => {
    if (
      node.type === 'element' &&
      node.tagName === 'pre' &&
      parent &&
      Array.isArray(parent.children)
    ) {
      const code = node.children.find(
        (c: any) => c.type === 'element' && c.tagName === 'code'
      );
      const className: string[] = code?.properties?.className || [];
      if (className.includes('language-mermaid')) {
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
      node.children.forEach((child: any, i: number) => visit(child, node, i));
    }
  };

  return (tree: any) => visit(tree, null, 0);
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
    .use(rehypeRewriteImages)
    .use(rehypeStringify)
    .process(content);

  let html = String(result);
  if (html.includes('<pre')) {
    html += COPY_SCRIPT;
  }
  return html;
}
