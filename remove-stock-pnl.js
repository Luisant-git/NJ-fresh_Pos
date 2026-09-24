const fs = require('fs');

function patchFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Remove from hardcoded defaults
  content = content.replace(/openingStockValue:\s*0,\s*/g, '');
  content = content.replace(/closingStockValue:\s*0,\s*/g, '');

  // Remove from CSV
  content = content.replace(/\['Opening Stock Value', safePnl\.openingStockValue\],\s*/g, '');
  content = content.replace(/\['Less: Closing Stock Value', `-\$\{safePnl\.closingStockValue\}`\],\s*/g, '');

  // Remove from PDF
  content = content.replace(/\{\s*label:\s*'Opening Stock Value',\s*value:\s*formatCurrency\(safePnl\.openingStockValue\)\s*\},\s*/g, '');
  content = content.replace(/\{\s*label:\s*'Less: Closing Stock Value',\s*value:\s*`-\$\{formatCurrency\(safePnl\.closingStockValue\)\}`\s*\},\s*/g, '');

  // Remove from HTML table
  const openingRegex = /<div className="flex justify-between py-1 text-black font-bold shrink-0">\s*<span>Opening Stock Value<\/span>[\s\S]*?<\/div>\s*<\/div>\s*/g;
  content = content.replace(openingRegex, '');

  const closingRegex = /<div className="flex justify-between py-1 text-\[#EF4444\] border-b border-\[#F3F4F6\] mb-1 shrink-0">\s*<span>Less: Closing Stock Value<\/span>[\s\S]*?<\/div>\s*<\/div>\s*/g;
  content = content.replace(closingRegex, '');

  fs.writeFileSync(path, content, 'utf8');
  console.log('Patched ' + path);
}

patchFile('d:/NJ fresh_Pos/frontend/src/pages/reports/ProfitLossReport.tsx');
patchFile('d:/Pos-Nasa Fresh Mart/frontend/src/pages/reports/ProfitLossReport.tsx');
