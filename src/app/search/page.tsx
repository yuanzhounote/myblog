import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SearchBox from '@/components/SearchBox';
import { generateSearchIndex } from '@/lib/search';

export const metadata = {
  title: '搜索 | 远舟笔记',
  description: '搜索文章',
};

export default function SearchPage() {
  const posts = generateSearchIndex();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">搜索</h1>
          <SearchBox posts={posts} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
