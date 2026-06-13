import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: '关于 | 远舟笔记',
  description: '一个文案从业者的学习笔记，关于AI工具、知识管理与个人成长。',
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
                你好，我是远舟。一个文案从业者，在日常工作中不断尝试用 AI 工具提升效率，
                用知识管理方法整理思绪。这个博客是我记录学习过程的地方——
                关于 AI 工具、知识管理与个人成长。
              </p>
            </section>

            <section className="mb-8">
              <h2>关注方向</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-medium">AI 工具</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="font-medium">知识管理</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">🌱</div>
                  <div className="font-medium">个人成长</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-medium">文案写作</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">💎</div>
                  <div className="font-medium">Obsidian</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="font-medium">效率工具</div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2>微信公众号</h2>
              <div className="not-prose p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                    远
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">远舟笔记</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">订阅号</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  一个文案从业者的学习笔记，关于AI工具、知识管理与个人成长。
                  在微信搜索「远舟笔记」即可关注。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2>联系我</h2>
              <ul>
                <li>
                  <a href="https://github.com/yuanzhounote" target="_blank" rel="noopener noreferrer">
                    GitHub: @yuanzhounote
                  </a>
                </li>
                <li>
                  微信公众号：远舟笔记
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
                  <strong>Next.js</strong> - React 框架，支持静态生成
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
                文章使用 Markdown 编写，支持代码高亮等功能。由 MiMo Code 辅助开发完成。
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
