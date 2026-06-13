import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/lib/blog';

export default function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <section className="mb-12">
            <h1 className="text-4xl font-bold mb-4">远舟笔记</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              一个文案从业者的学习笔记，关于AI工具、知识管理与个人成长。
            </p>
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              查看所有文章
            </Link>
          </section>

          {recentPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6">最新文章</h2>
              <div className="space-y-8">
                {recentPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="border-b border-gray-200 dark:border-gray-800 pb-8 last:border-0"
                  >
                    <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="group">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {post.date}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${encodeURIComponent(tag)}`}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
