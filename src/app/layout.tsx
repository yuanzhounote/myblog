import type { Metadata } from "next";
import BackToTop from "@/components/BackToTop";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yuanzhounote.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "远舟笔记",
    template: "%s | 远舟笔记",
  },
  description: "一个文案从业者的学习笔记，关于AI工具、知识管理与个人成长。",
  keywords: ["博客", "AI", "知识管理", "个人成长", "效率工具", "Obsidian", "文案"],
  authors: [{ name: "远舟" }],
  creator: "远舟",
  applicationName: "远舟笔记",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "远舟笔记",
    title: "远舟笔记",
    description: "一个文案从业者的学习笔记，关于AI工具、知识管理与个人成长。",
  },
  twitter: {
    card: "summary_large_image",
    title: "远舟笔记",
    description: "一个文案从业者的学习笔记，关于AI工具、知识管理与个人成长。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
