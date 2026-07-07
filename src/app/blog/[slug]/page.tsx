import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ReadingProgress from '@/components/ReadingProgress';
import { getAllPosts, getPostBySlug, getAdjacentPosts, calculateReadingTime } from '@/lib/blog';
import { renderMarkdown } from '@/lib/markdown';
import { getTagColor } from '@/lib/tag-colors';
import Mermaid from '@/components/Mermaid';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: '文章未找到' };
  }

  const url = `/blog/${encodeURIComponent(post.slug)}`;
  const description = post.description || post.excerpt;

  return {
    title: post.title,
    description,
    keywords: post.tags,
    authors: [{ name: '远舟' }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'zh_CN',
      url,
      siteName: '远舟笔记',
      title: post.title,
      description,
      publishedTime: post.date,
      authors: ['远舟'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
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
  const hasMermaid = contentHtml.includes('class="mermaid"');
  const readingTime = calculateReadingTime(post.content);

  const headings: { id: string; text: string; level: number }[] = [];
  const headingRegex = /<h([23])\s+id="([^"]+)"[^>]*>(.*?)<\/h[23]>/g;
  let match;
  while ((match = headingRegex.exec(contentHtml)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, ''),
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgress />
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回博客
          </Link>

          <div className="lg:flex lg:gap-10">
            <article className="animate-fade-in flex-1 min-w-0">
              <header className="mb-8 rounded-xl bg-gray-50 p-6 -mx-6">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <time className="text-sm text-gray-500">{post.date}</time>
                  <span className="text-gray-400">·</span>
                  <span className="text-sm text-gray-500">{readingTime} 分钟阅读</span>
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
              {hasMermaid && <Mermaid />}
            </article>

            <aside className="hidden lg:block w-56 flex-shrink-0">
              <nav className="sticky top-24">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                  目录
                </h4>
                <div className="pl-3 border-l-2 border-gray-200">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block py-1 text-sm text-gray-500 hover:text-gray-900 transition-colors ${
                        h.level === 3 ? 'pl-4' : ''
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </div>
              </nav>
            </aside>
          </div>

          {/* 上一篇/下一篇导航 */}
          <nav className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between gap-4">
              {prev ? (
                <Link
                  href={`/blog/${encodeURIComponent(prev.slug)}`}
                  className="flex-1 group"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    ← 上一篇
                  </div>
                  <div className="text-lg font-medium group-hover:text-blue-600 transition-colors">
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
                  <div className="text-sm text-gray-500 mb-1">
                    下一篇 →
                  </div>
                  <div className="text-lg font-medium group-hover:text-blue-600 transition-colors">
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
