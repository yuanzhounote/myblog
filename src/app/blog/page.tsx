import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { getTagColor } from '@/lib/tag-colors';

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
                  className={`px-3 py-1.5 text-sm rounded-full hover:opacity-80 transition-opacity ${getTagColor(tag)}`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* 文章列表 */}
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.slug} className="blog-card">
                <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="group block">
                  <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm text-gray-500">
                    {post.date}
                  </span>
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
                <p className="text-gray-600">
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
