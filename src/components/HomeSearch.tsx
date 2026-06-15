'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getTagColor } from '@/lib/tag-colors';
import type { SearchIndex } from '@/lib/search';

export default function HomeSearch({ posts }: { posts: SearchIndex[] }) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'title' | 'full'>('title');

  const results = query.trim()
    ? posts.filter((post) => {
        const q = query.toLowerCase();
        if (mode === 'title') {
          return post.title.toLowerCase().includes(q);
        }
        return (
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          post.content.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <section className="mb-16">
      <div className="relative max-w-lg mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章..."
          className="w-full px-5 py-3.5 pl-11 text-sm border border-gray-200 rounded-full bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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

      <div className="flex justify-center gap-1 mt-3">
        <button
          onClick={() => setMode('title')}
          className={`px-3 py-1 text-xs rounded-full transition-all ${
            mode === 'title'
              ? 'bg-gray-900 text-white'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          搜标题
        </button>
        <button
          onClick={() => setMode('full')}
          className={`px-3 py-1 text-xs rounded-full transition-all ${
            mode === 'full'
              ? 'bg-gray-900 text-white'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          搜全文
        </button>
      </div>

      {query.trim() && results.length > 0 && (
        <div className="mt-6 max-w-lg mx-auto">
          <p className="text-xs text-gray-400 mb-3 text-center">
            找到 {results.length} 篇文章
          </p>
          <div className="space-y-2">
            {results.slice(0, 5).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${encodeURIComponent(post.slug)}`}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all duration-200"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <time className="text-xs text-gray-400">
                      {post.date}
                    </time>
                    {post.tags.slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className={`px-1.5 py-0.5 text-xs rounded-full ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-gray-300 ml-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          {results.length > 5 && (
            <Link
              href={`/blog`}
              className="block text-center text-xs text-gray-400 mt-3 hover:text-blue-500 transition-colors"
            >
              查看全部 {results.length} 篇 →
            </Link>
          )}
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          没有找到相关文章
        </p>
      )}
    </section>
  );
}
