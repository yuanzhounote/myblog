import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllTags } from '@/lib/blog';

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
          
          <div className="flex flex-wrap gap-4">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-lg"
              >
                {tag}
              </Link>
            ))}
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
