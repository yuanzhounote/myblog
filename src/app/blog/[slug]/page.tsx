import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '@/lib/blog';
import { renderMarkdown } from '@/lib/markdown';

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

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return { title: '文章未找到' };
  }

  return {
    title: `${post.title} | 远舟笔记`,
    description: post.description || post.excerpt,
    keywords: post.tags,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getAdjacentPosts(slug);
  const contentHtml = await renderMarkdown(post.content);
  const chineseChars = (post.content.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = post.content.replace(/[\u4e00-\u9fff]/g, '').trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil((chineseChars + englishWords) / 400));

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8"
          >
            ← 返回博客
          </Link>

          <article className="animate-fade-in">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <time className="text-sm text-gray-500 dark:text-gray-400">{post.date}</time>
                <span className="text-gray-400">·</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{readingTime} 分钟阅读</span>
                <span className="text-gray-400">·</span>
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
            </header>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>

          {/* 上一篇/下一篇导航 */}
          <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between gap-4">
              {prev ? (
                <Link
                  href={`/blog/${encodeURIComponent(prev.slug)}`}
                  className="flex-1 group"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    ← 上一篇
                  </div>
                  <div className="text-lg font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {prev.title}
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              
              {next ? (
                <Link
                  href={`/blog/${encodeURIComponent(next.slug)}`}
                  className="flex-1 text-right group"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    下一篇 →
                  </div>
                  <div className="text-lg font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {next.title}
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
}
