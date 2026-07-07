import type { NextConfig } from "next";

// 内容安全策略：允许同域资源、KaTeX CDN（样式+字体）、busuanzi 统计脚本；
// mermaid 由同域打包，其内联 SVG 样式依赖 style-src 'unsafe-inline'。
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://busuanzi.ibruce.info;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  font-src 'self' https://cdn.jsdelivr.net;
  img-src 'self' data: https:;
  connect-src 'self';
  base-uri 'self';
  form-action 'self';
`
  .replace(/\s+/g, " ")
  .trim();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Content-Security-Policy", value: ContentSecurityPolicy },
        ],
      },
    ];
  },
};

export default nextConfig;
