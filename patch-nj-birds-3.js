const fs = require('fs');

let posPath = 'd:/NJ fresh_Pos/frontend/src/pages/sales/POS.tsx';
let posContent = fs.readFileSync(posPath, 'utf8');

posContent = posContent.replace(
  /<th className="px-2 py-2 text-center text-\[12px\] font-bold border border-\[#334155\] w-20">Birds<\/th>\n/g,
  ''
);
fs.writeFileSync(posPath, posContent);

let invPath = 'd:/NJ fresh_Pos/frontend/src/components/InvoicePrintModal.tsx';
let invContent = fs.readFileSync(invPath, 'utf8');

invContent = invContent.replace(
  /<th className="py-2 w-\[10%\] text-center font-bold">Birds<\/th>\n/g,
  ''
);
fs.writeFileSync(invPath, invContent);

console.log('Fixed Birds headers');
