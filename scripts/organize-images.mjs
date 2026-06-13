import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'content/posts');
const assetsDir = path.join(process.cwd(), 'content/assets');

// 确保 assets 目录存在
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 读取所有 md 文件
const mdFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

mdFiles.forEach(mdFile => {
  const slug = mdFile.replace(/\.md$/, '');
  const mdPath = path.join(postsDir, mdFile);
  let content = fs.readFileSync(mdPath, 'utf8');
  
  // 提取图片引用
  const imgRefs = [...content.matchAll(/!\[.*?\]\(([^)]+)\)/g)];
  
  if (imgRefs.length === 0) return;
  
  // 创建文章对应的 assets 目录
  const imgDir = path.join(assetsDir, slug);
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
  }
  
  let modified = false;
  
  imgRefs.forEach(match => {
    const originalPath = match[1];
    const decodedPath = decodeURIComponent(originalPath);
    
    let srcFile = null;
    let fileName = null;
    
    if (decodedPath.startsWith('assets/')) {
      // assets/远舟笔记10-.../file-xxx.jpg 格式
      fileName = decodedPath.split('/').pop();
      srcFile = path.join(postsDir, fileName);
    } else {
      // 直接引用 file-xxx.jpg 格式
      fileName = decodedPath;
      srcFile = path.join(postsDir, fileName);
    }
    
    if (fs.existsSync(srcFile)) {
      // 复制图片到 assets/{slug}/
      const destFile = path.join(imgDir, fileName);
      if (!fs.existsSync(destFile)) {
        fs.copyFileSync(srcFile, destFile);
      }
      
      // 更新 md 文件中的路径
      const newPath = `assets/${slug}/${fileName}`;
      content = content.replace(originalPath, newPath);
      modified = true;
    }
  });
  
  // 保存修改后的 md 文件
  if (modified) {
    fs.writeFileSync(mdPath, content, 'utf8');
    console.log(`Updated: ${mdFile}`);
  }
});

// 删除 content/posts 下的图片文件（已移动到 assets）
const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
fs.readdirSync(postsDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (imageExts.includes(ext)) {
    fs.unlinkSync(path.join(postsDir, file));
    console.log(`Removed: ${file}`);
  }
});

console.log('Images organized successfully!');
