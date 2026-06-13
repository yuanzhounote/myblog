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
    .use(rehypeStringify)
    .process(content);

  let html = String(result);
  if (html.includes('<pre')) {
    html += COPY_SCRIPT;
  }
  return html;
}
