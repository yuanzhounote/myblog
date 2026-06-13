import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Blog | 技术博客",
  description: "一个关于 Web 开发、编程和技术的个人博客",
  keywords: ["博客", "技术", "Web 开发", "Next.js", "React", "TypeScript"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tQ2/19NoQrHokVg0E3Y4KeIwMvT4i5S4K5I5t6K5I5t6K5I5t6K5I5"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
        {children}
      </body>
    </html>
  );
}
