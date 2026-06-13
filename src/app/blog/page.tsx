import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllPosts, getAllTags } from '@/lib/blog';

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">博客</h1>

          {/* 标签筛选 */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">按标签筛选</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors"
              >
                全部
              </Link>
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* 文章列表 */}
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border-b border-gray-200 dark:border-gray-800 pb-8 last:border-0"
              >
                <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="group">
                  <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {post.date}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
