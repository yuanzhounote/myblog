import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CopyButton from '@/components/CopyButton';
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '@/lib/blog';
import { renderMarkdown } from '@/lib/markdown';

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
    title: `${post.title} | My Blog`,
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
  const readingTime = Math.ceil(post.content.trim().split(/\s+/).length / 200);

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
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <time>{post.date}</time>
                <span>·</span>
                <span>{readingTime} 分钟阅读</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
                  href={`/blog/${prev.slug}`}
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
                  href={`/blog/${next.slug}`}
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
