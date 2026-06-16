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
        node.properties.className = 'lazy-image';
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
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
  if (html.includes('lazy-image')) {
    html += `<script>
(function(){
  document.querySelectorAll('.lazy-image').forEach(function(img){
    if(img.complete){img.classList.add('loaded');}
    else{img.onload=function(){img.classList.add('loaded');};}
  });
})();
</script>`;
  }
  return html;
}
