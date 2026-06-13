import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: '关于 | My Blog',
  description: '关于我',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">关于</h1>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2>个人简介</h2>
              <p>
                你好！我是一名热爱技术的开发者，专注于 Web 开发和前端技术。
                这个博客是我分享技术知识、学习心得和项目经验的地方。
              </p>
            </section>

            <section className="mb-8">
              <h2>技术栈</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">⚛️</div>
                  <div className="font-medium">React</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">▲</div>
                  <div className="font-medium">Next.js</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">📘</div>
                  <div className="font-medium">TypeScript</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="font-medium">Tailwind CSS</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">🟢</div>
                  <div className="font-medium">Node.js</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">🐍</div>
                  <div className="font-medium">Python</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">🐹</div>
                  <div className="font-medium">Go</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">🦀</div>
                  <div className="font-medium">Rust</div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2>社交链接</h2>
              <ul>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@example.com">Email</a>
                </li>
              </ul>
            </section>

            <section>
              <h2>关于本站</h2>
              <p>
                这个博客使用以下技术构建：
              </p>
              <ul>
                <li>
                  <strong>Next.js 16</strong> - React 框架，支持 SSR 和 SSG
                </li>
                <li>
                  <strong>TypeScript</strong> - 类型安全的 JavaScript
                </li>
                <li>
                  <strong>Tailwind CSS</strong> - 实用优先的 CSS 框架
                </li>
                <li>
                  <strong>Vercel</strong> - 部署平台
                </li>
              </ul>
              <p>
                文章使用 Markdown 编写，支持代码高亮、数学公式等功能。
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
