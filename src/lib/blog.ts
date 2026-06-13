import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  description?: string;
  tags: string[];
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 400;
  // 中文按字符数估算，英文按空格分词
  const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = content.replace(/[\u4e00-\u9fff]/g, '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil((chineseChars + englishWords) / wordsPerMinute));
}

function extractFirstHeading(content: string): string | null {
  // 先去掉代码块内容，避免代码注释被误判为标题
  const withoutCode = content.replace(/```[\s\S]*?```/g, '');
  const match = withoutCode.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function extractExcerpt(content: string): string {
  const cleaned = content
    .replace(/^#{1,6}\s+.+$/gm, '')        // 去除标题
    .replace(/```[\s\S]*?```/g, '')         // 去除代码块
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 去除图片
    .replace(/^>\s*/gm, '')                  // 去除引用前缀
    .replace(/^---+$/gm, '')                // 去除水平分隔线
    .replace(/[*_~`]/g, '')                 // 去除行内格式
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')// 去除链接保留文字
    .trim();
  
  const lines = cleaned.split('\n').filter(line => line.trim().length > 0);
  const excerpt = lines.slice(0, 3).join(' ').slice(0, 200);
  return excerpt.length < cleaned.length ? excerpt + '...' : excerpt;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const title = data.title || extractFirstHeading(content) || slug;
      // 优先 frontmatter 的 date，否则用文件修改时间
      let date = data.date;
      if (!date) {
        const stats = fs.statSync(fullPath);
        date = stats.mtime.toISOString().split('T')[0];
      }
      const tags = data.tags || [];
      const description = data.description || '';
      const excerpt = data.description || extractExcerpt(content);
      
      return {
        slug,
        title,
        date,
        excerpt,
        description,
        content,
        tags,
      };
    });
    
  return posts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  // 处理浏览器编码过的 slug
  const decodedSlug = decodeURIComponent(slug);
  const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const title = data.title || extractFirstHeading(content) || decodedSlug;
  let date = data.date;
  if (!date) {
    const stats = fs.statSync(fullPath);
    date = stats.mtime.toISOString().split('T')[0];
  }
  const tags = data.tags || [];
  const description = data.description || '';
  const excerpt = data.description || extractExcerpt(content);
  
  return {
    slug: decodedSlug,
    title,
    date,
    excerpt,
    description,
    content,
    tags,
  };
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) => 
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAdjacentPosts(slug: string): { prev: BlogPost | null; next: BlogPost | null } {
  const posts = getAllPosts();
  const decodedSlug = decodeURIComponent(slug);
  const index = posts.findIndex((post) => post.slug === decodedSlug);
  
  if (index === -1) {
    return { prev: null, next: null };
  }
  
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}
