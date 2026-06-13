import fs from 'fs';
import path from 'path';
import { getAllPosts } from './blog';

const BASE_URL = 'https://myblog-umber-nine.vercel.app';

export function generateSitemap(): string {
  const posts = getAllPosts();
  
  const postUrls = posts
    .map(
      (post) => `  <url>
    <loc>${BASE_URL}/blog/${encodeURI(post.slug)}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
${postUrls}
</urlset>`;
}

export function generateRSS(): string {
  const posts = getAllPosts();
  
  const items = posts
    .map(
      (post) => `    <item>
      <title>${post.title}</title>
      <link>${BASE_URL}/blog/${encodeURIComponent(post.slug)}</link>
      <guid>${BASE_URL}/blog/${encodeURIComponent(post.slug)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>远舟笔记</title>
    <link>${BASE_URL}</link>
    <description>一个文案从业者的学习笔记，关于AI工具、知识管理与个人成长。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

export function writeSitemapAndRSS() {
  const publicDir = path.join(process.cwd(), 'public');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), generateSitemap());
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), generateRSS());
  
  console.log('Generated sitemap.xml and rss.xml');
}
