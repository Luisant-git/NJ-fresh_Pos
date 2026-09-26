const fs = require('fs');

// 1. POS.tsx
let posPath = 'd:/NJ fresh_Pos/frontend/src/pages/sales/POS.tsx';
let posContent = fs.readFileSync(posPath, 'utf8');

// Header
posContent = posContent.replace(
  /<th className="px-2 py-2 text-center text-\[12px\] font-bold border border-\[#334155\] w-16">Birds<\/th>\n\s*/g,
  ''
);

// Cell
const cellRegex = /<td data-label="Birds" className="px-2 py-1 border-r border-\[#E5E7EB\]">[\s\S]*?<input\s+\{\.\.\.register\(`items\.\$\{index\}\.noOfBirds`\)\}[\s\S]*?<\/td>\n\s*/g;
posContent = posContent.replace(cellRegex, '');

fs.writeFileSync(posPath, posContent);
console.log('POS.tsx patched');

// 2. InvoicePrintModal.tsx
let invPath = 'd:/NJ fresh_Pos/frontend/src/components/InvoicePrintModal.tsx';
let invContent = fs.readFileSync(invPath, 'utf8');

invContent = invContent.replace(
  /<th className="py-2 px-1 text-center font-bold w-12 border-b border-black border-dashed">Birds<\/th>\n\s*/g,
  ''
);
invContent = invContent.replace(
  /<td className="py-1 text-center font-bold">\{Number\(item\.noOfBirds\) \|\| '-'}<\/td>\n\s*/g,
  ''
);
invContent = invContent.replace(
  /<div className="flex justify-between font-bold">\n\s*<span>Total Birds:<\/span>\n\s*<span>\{totalBirds}<\/span>\n\s*<\/div>\n\s*/g,
  ''
);

fs.writeFileSync(invPath, invContent);
console.log('InvoicePrintModal.tsx patched');

// 3. SalesReport.tsx
let salesPath = 'd:/NJ fresh_Pos/frontend/src/pages/reports/SalesReport.tsx';
let salesContent = fs.readFileSync(salesPath, 'utf8');

// Header
salesContent = salesContent.replace(
  /<th className="px-4 py-3 border-r border-\[#1E293B\] text-right">Birds<\/th>\n\s*/g,
  ''
);

// Cell
salesContent = salesContent.replace(
  /<td className="px-4 py-3 border-r border-\[#E2E8F0\] text-right font-bold text-black font-bold">\{s\.totalBirds\}<\/td>\n\s*/g,
  ''
);

// Map
// We can leave `totalBirds` in the map, it won't hurt if it's not rendered.
// Let's also check if it's in the PDF/Excel columns.
salesContent = salesContent.replace(
  /\{ header: 'Total Birds', dataKey: 'totalBirds' \},\n\s*/g,
  ''
);
salesContent = salesContent.replace(
  /'Total Birds': s\.totalBirds,\n\s*/g,
  ''
);
salesContent = salesContent.replace(
  /totalBirds: '',\n\s*/g,
  ''
);
salesContent = salesContent.replace(
  /'Total Birds': '',\n\s*/g,
  ''
);


fs.writeFileSync(salesPath, salesContent);
console.log('SalesReport.tsx patched');
