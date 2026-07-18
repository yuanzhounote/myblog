import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

// 强制走动态函数，不缓存结果
export const dynamic = 'force-dynamic';

const ATTACHMENTS_DIR = path.join(process.cwd(), 'public', 'attachments');

// 仅允许下载这些扩展名，避免误流出其它文件
const ALLOWED_EXT = new Set([
  'md',
  'txt',
  'pdf',
  'doc',
  'docx',
  'csv',
  'json',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'zip',
]);

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get('file');
  if (!file) {
    return new NextResponse('缺少 file 参数', { status: 400 });
  }

  // 防目录穿越：拒绝任何路径分隔符、上级引用与隐藏文件
  if (
    file.includes('/') ||
    file.includes('\\') ||
    file.includes('..') ||
    file.startsWith('.')
  ) {
    return new NextResponse('非法文件名', { status: 400 });
  }

  const ext = file.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXT.has(ext)) {
    return new NextResponse('不支持的文件类型', { status: 415 });
  }

  const fullPath = path.join(ATTACHMENTS_DIR, file);

  // 二次确认：解析后的真实路径必须仍位于 attachments 目录内
  if (
    fullPath !== ATTACHMENTS_DIR &&
    !fullPath.startsWith(ATTACHMENTS_DIR + path.sep)
  ) {
    return new NextResponse('非法路径', { status: 400 });
  }

  // 优先本地读取；Vercel 等 serverless 环境下函数进程可能访问不到
  // public 文件系统，此时 fallback 到同源静态资源 URL 读取。
  let data: Buffer;
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    data = fs.readFileSync(fullPath);
  } else {
    const staticUrl = `${request.nextUrl.origin}/attachments/${encodeURIComponent(file)}`;
    const fileRes = await fetch(staticUrl, { cache: 'no-store' });
    if (!fileRes.ok) {
      return new NextResponse('文件不存在', { status: 404 });
    }
    data = Buffer.from(await fileRes.arrayBuffer());
  }

  const encodedName = encodeURIComponent(file);
  // HTTP 响应头的 filename 参数只能含 ASCII，否则 Node 会抛 Invalid character；
  // 中文交给 filename*=UTF-8''，这里用 ASCII 兜底名（非 ASCII 替换成 _）
  const asciiFallback = file.replace(/[^\x20-\x7E]/g, '_');

  return new NextResponse(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodedName}`,
      'Content-Length': String(data.length),
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
