import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllTags, getPostsByTag } from '@/lib/blog';
import { getTagColor } from '@/lib/tag-colors';

export const metadata = {
  title: '标签 | 远舟笔记',
  description: '浏览所有文章标签',
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">标签</h1>
          
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => {
              const count = getPostsByTag(tag).length;
              return (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity ${getTagColor(tag)}`}
                >
                  {tag}
                  <span className="opacity-60">({count})</span>
                </Link>
              );
            })}
          </div>

          {tags.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              暂无标签
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
