const fs = require('fs');
const path = require('path');
const dirs = [
  'D:/NJ fresh_Pos/frontend/src/pages/reports',
  'D:/NJ fresh_Pos/frontend/src/pages/sales',
  'D:/NJ fresh_Pos/frontend/src/pages/purchase',
  'D:/NJ fresh_Pos/frontend/src/pages/expenses',
  'D:/NJ fresh_Pos/frontend/src/pages/master'
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  for (const file of files) {
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');
    let original = content;

    // Replace <Filter size={14} /> Filter with <Filter size={16} />
    content = content.replace(/<Filter\s+size=\{14\}\s*\/>\s*Filter/g, '<Filter size={16} />');

    if (content !== original) {
      fs.writeFileSync(p, content, 'utf8');
      console.log('Updated', p);
    }
  }
}
console.log('Done NJ');
