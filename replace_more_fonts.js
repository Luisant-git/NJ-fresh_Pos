const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const dirs = ['d:\\NJ fresh_Pos\\frontend\\src', 'd:\\Pos-Nasa Fresh Mart\\frontend\\src'];

const moreGrayHexes = [
  '1E293B', '334155', '475569', '64748B', '94A3B8', 'CBD5E1', 'E2E8F0', 'F1F5F9', 'F8FAFC', // Slate
  '18181B', '27272A', '3F3F46', '52525B', '71717A', 'A1A1AA', 'E4E4E7', 'F4F4F5', 'FAFAFA', // Zinc
  '171717', '262626', '404040', '525252', '737373', 'A3A3A3', 'D4D4D4', 'E5E5E5', 'F5F5F5', // Neutral
  '1C1917', '292524', '44403C', '57534E', '78716C', 'A8A29E', 'D6D3D1', 'E7E5E4', 'F5F5F4', // Stone
  '111827' // gray-900
];

const hexRegexStr = moreGrayHexes.join('|');
const regex = new RegExp(`(?:([a-z0-9-]+):)?text-\\[#(${hexRegexStr})\\]`, 'gi');

dirs.forEach(srcDir => {
  if (!fs.existsSync(srcDir)) return;
  const files = walk(srcDir);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    let newContent = content.replace(regex, (match, p1) => {
      if (p1) return `${p1}:text-black ${p1}:font-bold`;
      return 'text-black font-bold';
    });

    // Clean up duplicate font-bold
    newContent = newContent.replace(/\bfont-bold(\s+font-bold)+\b/g, 'font-bold');

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated:', file);
    }
  });
});
console.log('Done replacing more gray fonts.');
