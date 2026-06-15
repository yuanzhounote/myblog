import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold mb-4">页面未找到</h2>
          <p className="text-gray-500 mb-8">
            你访问的页面不存在或已被移除
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
