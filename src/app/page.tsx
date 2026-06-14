import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/lib/blog';
import { getTagColor } from '@/lib/tag-colors';

export default function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <section className="mb-12">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 mb-8">
              <h1 className="text-4xl font-bold mb-4">远舟笔记</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                一个文案从业者的学习笔记，关于AI工具、知识管理与个人成长。
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                查看所有文章
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </section>

          {recentPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6">最新文章</h2>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <article key={post.slug} className="blog-card">
                    <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="group block">
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
                          className={`px-2 py-0.5 text-xs rounded-full hover:opacity-80 transition-opacity ${getTagColor(tag)}`}
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
