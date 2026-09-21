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

dirs.forEach(srcDir => {
  if (!fs.existsSync(srcDir)) return;
  const files = walk(srcDir);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace standard Tailwind gray texts
    let newContent = content.replace(/(?:([a-z0-9-]+):)?text-(?:gray|slate|zinc|neutral|stone)-\d+/g, (match, p1) => {
      if (p1) return `${p1}:text-black ${p1}:font-bold`;
      return 'text-black font-bold';
    });
    
    // Replace hex grays commonly used
    newContent = newContent.replace(/(?:([a-z0-9-]+):)?text-\[#(1F2937|374151|4B5563|6B7280|9CA3AF|D1D5DB|E5E7EB|F3F4F6|F9FAFB|666|777|888|999|ccc|CCC)\]/gi, (match, p1) => {
      if (p1) return `${p1}:text-black ${p1}:font-bold`;
      return 'text-black font-bold';
    });

    // Clean up duplicate font-bold
    newContent = newContent.replace(/\bfont-bold(\s+font-bold)+\b/g, 'font-bold');
    // Replace font-medium or font-semibold with font-bold just in case they were used alongside the old gray
    newContent = newContent.replace(/\b(font-medium|font-semibold)\b/g, 'font-bold');
    // Clean up multiple spaces inside className
    newContent = newContent.replace(/className="([^"]+)"/g, (match, p1) => {
      return `className="${p1.replace(/\s+/g, ' ').trim()}"`;
    });

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated:', file);
    }
  });
});
console.log('Done replacing gray fonts.');
