import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Attachment {
  /** 文件名，对应 public/attachments 下的文件，如 "note.md" */
  file: string;
  /** 展示名称，缺省时取文件名（去掉 .md 后缀） */
  label: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  description?: string;
  tags: string[];
  attachments?: Attachment[];
}

/**
 * 解析 frontmatter 里的 attachments 字段。
 * 支持两种写法：
 *   attachments: ["note.md"]                       → 字符串数组
 *   attachments:                                  → 对象数组
 *     - file: note.md
 *       label: 我的笔记
 */
function parseAttachments(raw: unknown): Attachment[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item): Attachment | null => {
      if (typeof item === 'string' && item.trim()) {
        const file = item.trim();
        return { file, label: file.replace(/\.md$/i, '') };
      }
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;
        const file = typeof obj.file === 'string' ? obj.file.trim() : '';
        if (!file) return null;
        const label =
          typeof obj.label === 'string' && obj.label.trim()
            ? obj.label.trim()
            : file.replace(/\.md$/i, '');
        return { file, label };
      }
      return null;
    })
    .filter((a): a is Attachment => a !== null);
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 400;
  // 中文按字符数估算，英文按空格分词
  const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = content.replace(/[\u4e00-\u9fff]/g, '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil((chineseChars + englishWords) / wordsPerMinute));
}

// gray-matter/js-yaml 会把裸写的 `date: 2026-06-26` 解析成 Date 对象，
// 直接渲染到 React 会抛 "Objects are not valid as a React child"。
// 这里统一转成 YYYY-MM-DD 字符串。
function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    // js-yaml 把裸日期解析为 UTC 零点，toISOString 再截日期即可还原
    return value.toISOString().split('T')[0];
  }
  if (value === undefined || value === null || value === '') {
    return '';
  }
  return String(value);
}

function extractFirstHeading(content: string): string | null {
  // 先去掉代码块内容，避免代码注释被误判为标题
  const withoutCode = content.replace(/```[\s\S]*?```/g, '');
  const match = withoutCode.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * 从 slug（文件名）中提取文章编号，用于排序。
 * 例如 "远舟笔记25-怎么让Obsidian..." → 25。
 * 取文件名中第一组连续数字；无数字则记为 0（排在最前/最后由比较方向决定）。
 */
function extractPostNumber(slug: string): number {
  const m = slug.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
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
      let date = normalizeDate(data.date);
      if (!date) {
        const stats = fs.statSync(fullPath);
        date = stats.mtime.toISOString().split('T')[0];
      }
      const tags = data.tags || [];
      const description = data.description || '';
      const excerpt = data.description || extractExcerpt(content);
      const attachments = parseAttachments(data.attachments);
      
      return {
        slug,
        title,
        date,
        excerpt,
        description,
        content,
        tags,
        attachments,
      };
    });
    
  // 按文章编号降序排列（25 → 1）。
  // 说明：原先按 frontmatter 的 date 降序，但多数文章未写 date，
  // Vercel 构建时文件修改时间相同导致排序退化成文件名字典序。
  // 改用文件名中的「远舟笔记N」编号作为稳定排序键， newest-first 且不受 mtime 影响。
  return posts.sort((a, b) =>
    extractPostNumber(b.slug) - extractPostNumber(a.slug)
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
  let date = normalizeDate(data.date);
  if (!date) {
    const stats = fs.statSync(fullPath);
    date = stats.mtime.toISOString().split('T')[0];
  }
  const tags = data.tags || [];
  const description = data.description || '';
  const excerpt = data.description || extractExcerpt(content);
  const attachments = parseAttachments(data.attachments);
  
  return {
    slug: decodedSlug,
    title,
    date,
    excerpt,
    description,
    content,
    tags,
    attachments,
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

export interface AttachmentGroup {
  slug: string;
  title: string;
  date: string;
  attachments: Attachment[];
}

/** 聚合所有带附件的文章，供「资料下载」页使用 */
export function getAllAttachments(): AttachmentGroup[] {
  return getAllPosts()
    .filter((post) => post.attachments && post.attachments.length > 0)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      attachments: post.attachments!,
    }));
}
