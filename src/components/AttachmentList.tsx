import type { Attachment } from '@/lib/blog';

function fileExt(file: string): string {
  return file.split('.').pop()?.toUpperCase() ?? '';
}

export default function AttachmentList({
  attachments,
}: {
  attachments: Attachment[];
}) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <section className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-1">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
        本文附件
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        点击即可下载（主要是 Markdown 源文档，方便你存到本地二次整理）。
      </p>
      <ul className="space-y-2">
        {attachments.map((a) => (
          <li key={a.file}>
            <a
              href={`/api/download?file=${encodeURIComponent(a.file)}`}
              className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  {fileExt(a.file)}
                </span>
                <span className="truncate font-medium text-gray-800 group-hover:text-blue-700">
                  {a.label}
                </span>
              </span>
              <span className="flex items-center gap-1 text-sm text-blue-600 shrink-0">
                下载
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
