import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllPosts, getAllTags } from '@/lib/blog';

const TAG_COLORS: Record<string, string> = {
  'Obsidian': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'AI助手': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'AI知识库': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'IMA': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'DeepSeek': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  '知识管理': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'AI写作': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'AI绘图': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'AI科普': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  '视频号': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  '语音日记': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  '信息收集': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'GPT': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Mac': 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  'Windows': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
};

const DEFAULT_COLOR = 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';

function getTagColor(tag: string): string {
  return TAG_COLORS[tag] || DEFAULT_COLOR;
}

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
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
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
                <p className="text-gray-600 dark:text-gray-300">
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
