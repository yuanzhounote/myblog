import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'content/posts');
const publicDir = path.join(process.cwd(), 'public');
const BASE_URL = 'https://myblog-umber-nine.vercel.app';

function getPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir)
    .filter(name => name.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fileContents = fs.readFileSync(path.join(postsDir, fileName), 'utf8');
      const { data, content } = matter(fileContents);
      const title = data.title || content.match(/^#\s+(.+)$/m)?.[1]?.trim() || slug;
      let date = data.date;
      if (!date) {
        date = fs.statSync(path.join(postsDir, fileName)).mtime.toISOString().split('T')[0];
      }
      const excerpt = data.description || content.replace(/^#{1,6}\s+.+$/gm, '').replace(/```[\s\S]*?```/g, '').trim().slice(0, 200);
      return { slug, title, date, excerpt };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateSitemap(posts) {
  const postUrls = posts.map(p => `  <url>\n    <loc>${BASE_URL}/blog/${encodeURI(p.slug)}</loc>\n    <lastmod>${p.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${BASE_URL}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>${BASE_URL}/blog</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n  <url>\n    <loc>${BASE_URL}/about</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n${postUrls}\n</urlset>`;
}

function generateRSS(posts) {
  const items = posts.map(p => `    <item>\n      <title>${p.title}</title>\n      <link>${BASE_URL}/blog/${encodeURIComponent(p.slug)}</link>\n      <guid>${BASE_URL}/blog/${encodeURIComponent(p.slug)}</guid>\n      <pubDate>${new Date(p.date).toUTCString()}</pubDate>\n      <description><![CDATA[${p.excerpt}]]></description>\n    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>远舟笔记</title>\n    <link>${BASE_URL}</link>\n    <description>一个文案从业者的学习笔记，关于AI工具、知识管理与个人成长。</description>\n    <language>zh-CN</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n${items}\n  </channel>\n</rss>`;
}

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
const posts = getPosts();
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), generateSitemap(posts));
fs.writeFileSync(path.join(publicDir, 'rss.xml'), generateRSS(posts));
console.log(`Generated sitemap.xml and rss.xml (${posts.length} posts)`);
