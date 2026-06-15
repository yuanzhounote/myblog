'use client';

import { useState, useEffect } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function ArticleTOC({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile TOC */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          目录
        </button>
        {isOpen && (
          <nav className="mt-3 pl-2 border-l-2 border-gray-200">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className={`block py-1 text-sm transition-colors ${
                  h.level === 3 ? 'pl-4' : ''
                } ${
                  activeId === h.id
                    ? 'text-blue-500 font-medium'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop TOC */}
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
                className={`block py-1 text-sm transition-colors ${
                  h.level === 3 ? 'pl-4' : ''
                } ${
                  activeId === h.id
                    ? 'text-blue-500 font-medium border-l-2 border-blue-500 -ml-[14px] pl-[12px]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {h.text}
              </a>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
