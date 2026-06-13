---
title: "TypeScript 高级类型技巧"
date: "2026-06-12"
tags: ["TypeScript", "前端开发", "编程技巧"]
description: "深入探讨 TypeScript 的高级类型系统，包括条件类型、映射类型、模板字面量类型等实用技巧。"
---

# TypeScript 高级类型技巧

## 前言

TypeScript 的类型系统非常强大，掌握高级类型技巧可以让你写出更安全、更优雅的代码。

## 1. 条件类型

条件类型允许我们根据条件选择不同的类型：

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>;  // true
type B = IsString<42>;       // false
```

### 实用示例：提取函数返回值类型

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: 'Alice' };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string }
```

## 2. 映射类型

映射类型允许我们基于现有类型创建新类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
```

## 3. 模板字面量类型

TypeScript 4.1 引入了模板字面量类型：

```typescript
type EventName = 'click' | 'focus' | 'blur';
type HandlerName = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'

type CSSProperty = 'margin' | 'padding';
type CSSDirection = 'top' | 'right' | 'bottom' | 'left';
type CSSSpacing = `${CSSProperty}-${CSSDirection}`;
// 'margin-top' | 'margin-right' | ... | 'padding-left'
```

## 4. 递归类型

TypeScript 支持递归类型定义：

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

type NestedObject = {
  a: {
    b: {
      c: number;
    };
  };
};

type ReadonlyNested = DeepReadonly<NestedObject>;
```

## 5. 类型守卫

使用类型守卫可以安全地收窄类型：

```typescript
interface Cat {
  meow(): void;
  type: 'cat';
}

interface Dog {
  bark(): void;
  type: 'dog';
}

type Pet = Cat | Dog;

function isCat(pet: Pet): pet is Cat {
  return pet.type === 'cat';
}

function makeSound(pet: Pet) {
  if (isCat(pet)) {
    pet.meow();  // TypeScript 知道这里是 Cat
  } else {
    pet.bark();  // TypeScript 知道这里是 Dog
  }
}
```

## 6. 实用工具类型

### Partial - 所有属性可选

```typescript
type UpdateUser = Partial<User>;
// { id?: number; name?: string; email?: string; }
```

### Pick - 选取部分属性

```typescript
type UserBasic = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }
```

### Omit - 排除部分属性

```typescript
type UserWithoutEmail = Omit<User, 'email'>;
// { id: number; name: string; }
```

## 总结

掌握这些高级类型技巧可以：

1. **提高代码安全性** - 编译时捕获错误
2. **增强代码可读性** - 类型即文档
3. **减少重复代码** - 泛型和工具类型
4. **改善开发体验** - 智能提示和重构支持

建议多练习这些技巧，在实际项目中应用它们。
