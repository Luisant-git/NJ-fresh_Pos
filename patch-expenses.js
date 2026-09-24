const fs = require('fs');

function patchFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // CSV
  content = content.replace(
    /\[\'III\. OPERATING EXPENSES\', \'AMOUNT\'\],\s*\.\.\.safePnl\.itemizedExpenses\.map\(\(exp: any\) => \[exp\.name, exp\.amount\]\),\s*\[\'TOTAL OPERATING EXPENSES\', safePnl\.totalExpenses\],/g,
    `['III. OPERATING EXPENSES', 'AMOUNT'],\n      ['TOTAL OPERATING EXPENSES', safePnl.totalExpenses],`
  );

  // PDF
  content = content.replace(
    /\{\s*label:\s*'III\. OPERATING EXPENSES',\s*value:\s*''\s*\},\s*\.\.\.safePnl\.itemizedExpenses\.map\(\(exp: any\) => \(\{\s*label:\s*exp\.name,\s*value:\s*formatCurrency\(exp\.amount\)\s*\}\)\),\s*\{\s*label:\s*'TOTAL OPERATING EXPENSES',\s*value:\s*formatCurrency\(safePnl\.totalExpenses\)\s*\},\s*/g,
    `{ label: 'III. OPERATING EXPENSES', value: '' },\n                { label: 'TOTAL OPERATING EXPENSES', value: formatCurrency(safePnl.totalExpenses) },\n                `
  );

  // HTML UI
  const htmlToReplace = `                {/* 3. Operating Expenses */}
                <div className="flex justify-between font-bold text-black font-bold border-b border-[#E5E7EB] pb-1 mb-1 shrink-0">
                  <div className="flex items-center gap-2"><span>III. OPERATING EXPENSES (ITEMIZED)</span></div>
                  <div>AMOUNT</div>
                </div>
                
                {safePnl.itemizedExpenses.length === 0 ? (
                  <div className="text-center py-2 text-[11px] text-black font-bold font-bold italic opacity-60">No operating expenses recorded for this period</div>
                ) : (
                  <div className="flex flex-col gap-1 mb-2 shrink-0">
                    {safePnl.itemizedExpenses.map((exp: any, idx: number) => (
                      <div key={idx} className="flex justify-between py-0.5 text-[12px] px-2 text-black font-bold">
                        <span>{exp.name}</span>
                        <span className="font-bold text-black font-bold">{formatCurrency(exp.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between py-1 font-bold text-[13px] px-2 mt-auto text-black font-bold shrink-0">
                  <span>TOTAL OPERATING EXPENSES</span>
                  <span className="text-[#EF4444]">{formatCurrency(safePnl.totalExpenses)}</span>
                </div>`;

  const htmlReplacement = `                {/* 3. Operating Expenses */}
                <div className="flex justify-between font-bold text-black font-bold border-b border-[#E5E7EB] pb-1 mb-1 shrink-0">
                  <div className="flex items-center gap-2"><span>III. OPERATING EXPENSES</span></div>
                  <div>AMOUNT</div>
                </div>

                <div className="flex justify-between py-1 font-bold text-[13px] px-2 mt-auto text-black font-bold shrink-0">
                  <span>TOTAL OPERATING EXPENSES</span>
                  <span className="text-[#EF4444]">{formatCurrency(safePnl.totalExpenses)}</span>
                </div>`;

  content = content.replace(htmlToReplace, htmlReplacement);

  fs.writeFileSync(path, content, 'utf8');
  console.log('Patched ' + path);
}

patchFile('d:/NJ fresh_Pos/frontend/src/pages/reports/ProfitLossReport.tsx');
patchFile('d:/Pos-Nasa Fresh Mart/frontend/src/pages/reports/ProfitLossReport.tsx');
