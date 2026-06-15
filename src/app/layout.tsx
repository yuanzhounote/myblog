import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "远舟笔记",
  description: "一个文案从业者的学习笔记，关于AI工具、知识管理与个人成长。",
  keywords: ["博客", "AI", "知识管理", "个人成长", "效率工具", "Obsidian", "文案"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full" suppressHydrationWarning>
      <head>
        <script async src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tQ2/19NoQrHokVg0E3Y4KeIwMvT4i5S4K5I5t6K5I5t6K5I5t6K5I5"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
