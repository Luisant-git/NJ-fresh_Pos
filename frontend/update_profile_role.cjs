const fs = require('fs');
const files = [
  'D:/NJ fresh_Pos/frontend/src/layouts/MainLayout.tsx',
  'D:/Pos-Nasa Fresh Mart/frontend/src/layouts/MainLayout.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace <span className="text-[10px] text-blue-200 font-bold">Admin</span>
  content = content.replace(/<span className="text-\[10px\] text-blue-200 font-bold">Admin<\/span>/g, '<span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">{user?.role?.name || \'User\'}</span>');
  
  // Replace <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mt-1">Administrator</p>
  content = content.replace(/<p className="text-xs font-bold text-blue-600 uppercase tracking-wide mt-1">Administrator<\/p>/g, '<p className="text-xs font-bold text-blue-600 uppercase tracking-wide mt-1">{user?.role?.name || \'User\'}</p>');

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Profile roles updated');
