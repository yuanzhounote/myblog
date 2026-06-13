import { getAllPosts } from './blog';

export interface SearchIndex {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export function generateSearchIndex(): SearchIndex[] {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    tags: post.tags,
    content: post.content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/[*_~`]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .slice(0, 500),
  }));
}
