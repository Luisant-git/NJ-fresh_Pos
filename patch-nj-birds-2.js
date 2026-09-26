const fs = require('fs');

// 1. InvoicePrintModal.tsx
let invPath = 'd:/NJ fresh_Pos/frontend/src/components/InvoicePrintModal.tsx';
let invContent = fs.readFileSync(invPath, 'utf8');

invContent = invContent.replace(
  /\{totalBirds > 0 && \(\s*<div className="flex justify-between font-bold text-\[13px\]">\s*<span>Total Birds:<\/span>\s*<span className="min-w-\[100px\] text-right inline-block">\{totalBirds\}<\/span>\s*<\/div>\s*\)\}/g,
  ''
);

fs.writeFileSync(invPath, invContent);
console.log('InvoicePrintModal.tsx patched properly');


// 2. SalesReport.tsx
let salesPath = 'd:/NJ fresh_Pos/frontend/src/pages/reports/SalesReport.tsx';
let salesContent = fs.readFileSync(salesPath, 'utf8');

salesContent = salesContent.replace(
  /<td className="px-4 py-3 border-r border-\[#E2E8F0\] text-center font-bold">\{s\.totalBirds > 0 \? s\.totalBirds : '-'\}<\/td>\n/g,
  ''
);

// also remove header in SalesReport if not caught earlier
salesContent = salesContent.replace(
  /<th className="px-4 py-3 border-r border-\[#1E293B\] text-center">Birds<\/th>\n/g,
  ''
);

fs.writeFileSync(salesPath, salesContent);
console.log('SalesReport.tsx patched properly');
