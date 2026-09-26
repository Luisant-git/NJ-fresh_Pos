const fs = require('fs');

let invPath = 'd:/NJ fresh_Pos/frontend/src/components/InvoicePrintModal.tsx';
let invContent = fs.readFileSync(invPath, 'utf8');

invContent = invContent.replace(
  /<th className="py-2 w-\[10%\] text-center font-bold">Birds<\/th>/g,
  ''
);
fs.writeFileSync(invPath, invContent);

console.log('Fixed Birds headers');
