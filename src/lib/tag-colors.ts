// 标签配色：由标签名做确定性哈希自动分配，新增标签无需手动登记。
// 调色板中的完整类名以字面量形式出现，确保始终被 Tailwind 扫描收录。

const TAG_PALETTE: string[] = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-indigo-100 text-indigo-700',
  'bg-cyan-100 text-cyan-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-red-100 text-red-700',
  'bg-violet-100 text-violet-700',
  'bg-orange-100 text-orange-700',
  'bg-emerald-100 text-emerald-700',
  'bg-slate-100 text-slate-700',
  'bg-sky-100 text-sky-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-lime-100 text-lime-700',
  'bg-yellow-100 text-yellow-700',
  'bg-gray-100 text-gray-700',
];

// FNV-1a 32 位哈希：稳定且分布均匀
function hashString(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function getTagColor(tag: string): string {
  const key = tag.trim().toLowerCase();
  return TAG_PALETTE[hashString(key) % TAG_PALETTE.length];
}
