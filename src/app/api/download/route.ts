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

  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
    return new NextResponse('文件不存在', { status: 404 });
  }

  const data = fs.readFileSync(fullPath);
  const encodedName = encodeURIComponent(file);

  return new NextResponse(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      // filename*=UTF-8'' 让中文文件名正确显示；filename 作为兜底
      'Content-Disposition': `attachment; filename="${file}"; filename*=UTF-8''${encodedName}`,
      'Content-Length': String(data.length),
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
