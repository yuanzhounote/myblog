import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              首页
            </Link>
            <Link
              href="/blog"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              博客
            </Link>
            <Link
              href="/tags"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              标签
            </Link>
            <Link
              href="/about"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              关于
            </Link>
          </div>

          <div className="text-sm text-gray-400 text-center">
            <span>© {new Date().getFullYear()} 远舟笔记</span>
            <span className="mx-2">·</span>
            <span>
              总访问 <span id="busuanzi_value_site_pv" className="font-medium text-gray-500" /> 次
            </span>
            <span className="mx-2">·</span>
            <span>
              今日访客 <span id="busuanzi_value_site_uv" className="font-medium text-gray-500" /> 人
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
