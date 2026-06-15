'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { SearchIndex } from '@/lib/search';

export default function SearchBox({ posts }: { posts: SearchIndex[] }) {
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? posts.filter((post) => {
        const q = query.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          post.content.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div>
      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入关键词搜索文章..."
          className="w-full px-4 py-3 pl-12 text-lg border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          autoFocus
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {query.trim() && (
        <div className="text-sm text-gray-500 mb-4">
          找到 {results.length} 篇文章
        </div>
      )}

      <div className="space-y-4">
        {results.map((post) => (
          <article key={post.slug} className="blog-card">
            <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="group block">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>
            <div className="text-sm text-gray-500 mb-2">
              {post.date}
            </div>
            <p className="text-gray-600 mb-3 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>

      {query.trim() && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            没有找到相关文章
          </p>
          <p className="text-gray-400 text-sm mt-2">
            试试其他关键词？
          </p>
        </div>
      )}
    </div>
  );
}
