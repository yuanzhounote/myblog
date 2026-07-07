'use client';

import { useEffect } from 'react';

/**
 * 客户端挂载后，对文章中所有 <div class="mermaid"> 执行 mermaid 渲染。
 * mermaid 仅在浏览器动态加载，不影响 SSR / 服务端 bundle。
 */
export default function Mermaid() {
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        if (!active) return;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'strict',
          fontFamily: 'inherit',
        });

        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>('.mermaid')
        );
        if (nodes.length === 0) return;

        await mermaid.run({ nodes });
      } catch (err) {
        console.error('[Mermaid] 渲染失败:', err);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return null;
}
