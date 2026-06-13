import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '@/lib/blog';
import { renderMarkdown } from '@/lib/markdown';
import { getTagColor } from '@/lib/tag-colors';

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
                {post.tags.length > 0 && <span className="text-gray-400">·</span>}
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
