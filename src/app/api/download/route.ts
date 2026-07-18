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
  try {
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
      try {
        const origin = request.nextUrl.origin;
        const staticUrl = `${origin}/attachments/${encodeURIComponent(file)}`;
        const fileRes = await fetch(staticUrl, { cache: 'no-store' });
        if (!fileRes.ok) {
          return new NextResponse('文件不存在(静态)', { status: 404 });
        }
        data = Buffer.from(await fileRes.arrayBuffer());
      } catch (e) {
        return new NextResponse(
          '文件读取失败: ' + (e instanceof Error ? e.message : String(e)),
          { status: 502 }
        );
      }
    }

    const encodedName = encodeURIComponent(file);
    // filename 参数只保留最安全的 ASCII 字符（字母数字 . _ -），
    // 其余（含 #、空格、中文）一律替换成 _，避免 undici 写响应头时校验失败；
    // 中文显示交给 filename*=UTF-8''（标准 percent-encoding）。
    const asciiFallback = file.replace(/[^A-Za-z0-9._-]/g, '_');

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${asciiFallback}"`,
        'Content-Length': String(data.length),
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? (err.stack || err.message) : String(err);
    return new NextResponse('DEBUG ERR: ' + msg, { status: 500 });
  }
}
