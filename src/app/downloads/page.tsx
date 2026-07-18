import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { getAllAttachments, type Attachment } from '@/lib/blog';
import AttachmentList from '@/components/AttachmentList';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '资料下载',
  description: '远舟笔记各篇文章配套的附件下载，主要是 Markdown 源文档，方便你下载到本地学习、二次整理。',
  alternates: { canonical: '/downloads' },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/downloads',
    siteName: '远舟笔记',
    title: '资料下载 | 远舟笔记',
    description: '各篇文章配套的附件下载，主要是 Markdown 源文档。',
  },
};

export default function DownloadsPage() {
  const groups = getAllAttachments();

  // 列出 public/attachments 中尚未被任何文章引用的「独立附件」，
  // 方便临时存放/测试，也避免文件放了却无处可下。
  const referenced = new Set(groups.flatMap((g) => g.attachments.map((a) => a.file)));
  const attachmentsDir = path.join(process.cwd(), 'public', 'attachments');
  let standalone: Attachment[] = [];
  if (fs.existsSync(attachmentsDir)) {
    standalone = fs
      .readdirSync(attachmentsDir)
      .filter(
        (f) =>
          !f.startsWith('.') &&
          f !== 'README.md' &&
          !referenced.has(f)
      )
      .map((f) => ({ file: f, label: f.replace(/\.md$/i, '') }));
  }

  const hasContent = groups.length > 0 || standalone.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">资料下载</h1>
          <p className="text-gray-500 mb-8">
            这里汇集了各篇文章配套的附件，主要是 Markdown 源文档，方便你下载到本地学习、二次整理。
          </p>

          {!hasContent ? (
            <p className="text-gray-400">暂时还没有上传附件，敬请期待。</p>
          ) : (
            <div className="space-y-10">
              {groups.map((g) => (
                <section key={g.slug}>
                  <div className="flex items-baseline justify-between gap-3 mb-3">
                    <h2 className="text-xl font-semibold">
                      <Link
                        href={`/blog/${encodeURIComponent(g.slug)}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {g.title}
                      </Link>
                    </h2>
                    <time className="text-sm text-gray-400 shrink-0">{g.date}</time>
                  </div>
                  <AttachmentList attachments={g.attachments} />
                </section>
              ))}

              {standalone.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">其它附件</h2>
                  <p className="text-sm text-gray-500 mb-3">
                    这些附件还没关联到具体文章，先放在这里供下载。
                  </p>
                  <AttachmentList attachments={standalone} />
                </section>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
