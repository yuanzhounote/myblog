import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HomeSearch from '@/components/HomeSearch';
import { getAllPosts } from '@/lib/blog';
import { getTagColor } from '@/lib/tag-colors';
import { generateSearchIndex } from '@/lib/search';

export default function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 6);
  const searchIndex = generateSearchIndex();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <section className="mb-20 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight text-gray-900">
              远舟笔记
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              一个文案从业者的学习笔记，关于AI工具、知识管理与个人成长。
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
            >
              查看所有文章
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </section>

          <HomeSearch posts={searchIndex} />

          {recentPosts.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-8 text-center">
                最新文章
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${encodeURIComponent(post.slug)}`}
                    className="group block p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="flex flex-col h-full">
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-500 transition-colors leading-snug line-clamp-2 mb-3">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <time className="text-xs text-gray-400">
                          {post.date}
                        </time>
                        <div className="flex gap-1.5">
                          {post.tags.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-0.5 text-xs rounded-full ${getTagColor(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
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
