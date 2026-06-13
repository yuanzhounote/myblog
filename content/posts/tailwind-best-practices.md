---
title: "Tailwind CSS 最佳实践"
date: "2026-06-11"
tags: ["Tailwind CSS", "CSS", "前端开发"]
description: "分享使用 Tailwind CSS 的最佳实践，包括项目配置、组件设计和性能优化。"
---

# Tailwind CSS 最佳实践

## 为什么选择 Tailwind CSS

Tailwind CSS 是一个实用优先的 CSS 框架，它提供了大量的原子类，让你可以直接在 HTML 中构建自定义设计。

### 优势

- **快速开发** - 不需要写自定义 CSS
- **一致性** - 设计系统内置
- **小体积** - 生产环境只包含使用的类
- **响应式** - 内置响应式设计支持

## 1. 项目配置

### 安装

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
```

### 配置文件

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'PingFang SC',
          'Noto Sans SC',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
```

## 2. 暗色模式实现

### CSS 变量方式

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1f2937;
}

.dark {
  --bg-primary: #111827;
  --text-primary: #f9fafb;
}
```

### 组件中使用

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 
                    text-gray-900 dark:text-gray-100 
                    rounded-lg shadow-md p-6">
      {children}
    </div>
  );
}
```

## 3. 响应式设计

### 断点使用

```tsx
<div className="
  grid 
  grid-cols-1        /* 手机：1列 */
  md:grid-cols-2     /* 平板：2列 */
  lg:grid-cols-3     /* 桌面：3列 */
  gap-4
">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>
```

### 隐藏/显示元素

```tsx
{/* 手机端隐藏，桌面端显示 */}
<div className="hidden md:block">
  仅桌面端显示
</div>

{/* 手机端显示，桌面端隐藏 */}
<div className="block md:hidden">
  仅手机端显示
</div>
```

## 4. 组件设计模式

### 基础组件

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </button>
  );
}
```

### 卡片组件

```tsx
interface CardProps {
  title: string;
  description: string;
  image?: string;
  tags?: string[];
}

function Card({ title, description, image, tags }: CardProps) {
  return (
    <article className="
      bg-white dark:bg-gray-800 
      rounded-xl shadow-md overflow-hidden
      hover:shadow-lg transition-shadow
    ">
      {image && (
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        {tags && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 
                           text-sm rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
```

## 5. 性能优化

### 使用 @apply 提取公共样式

```css
/* globals.css */
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white font-medium rounded-lg 
           px-4 py-2 hover:bg-blue-700 transition-colors;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-md p-6;
  }
}
```

### 使用 clsx 合并类名

```bash
npm install clsx
```

```tsx
import clsx from 'clsx';

function Badge({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span className={clsx(
      'px-2 py-1 text-sm rounded',
      active 
        ? 'bg-blue-100 text-blue-800' 
        : 'bg-gray-100 text-gray-600'
    )}>
      {children}
    </span>
  );
}
```

## 6. 常用技巧

### 焦点状态

```tsx
<input 
  className="
    border border-gray-300 rounded-lg px-4 py-2
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
  "
/>
```

### 动画

```tsx
<div className="animate-pulse bg-gray-200 rounded h-4 w-full" />
```

### 渐变背景

```tsx
<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
  渐变背景
</div>
```

## 总结

Tailwind CSS 的最佳实践包括：

1. **合理配置** - 自定义主题、启用暗色模式
2. **组件化** - 提取可复用的组件
3. **响应式优先** - 移动端优先的设计思路
4. **性能优化** - 使用 @apply 和 clsx

掌握这些技巧可以让你的开发效率大幅提升！
