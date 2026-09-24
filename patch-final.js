const fs = require('fs');

function patch(basePath) {
  // 1. Fix Settings Service Backend
  const settingsPath = basePath + '/backend/src/settings/settings.service.ts';
  let settingsContent = fs.readFileSync(settingsPath, 'utf8');
  if (!settingsContent.includes('allowEditPurchaseInvoice: data.allowEditPurchaseInvoice')) {
    settingsContent = settingsContent.replace(
      'allowEditSaleInvoice: data.allowEditSaleInvoice,',
      'allowEditSaleInvoice: data.allowEditSaleInvoice,\n        allowEditPurchaseInvoice: data.allowEditPurchaseInvoice,'
    );
    settingsContent = settingsContent.replace(
      'allowEditSaleInvoice: data.allowEditSaleInvoice || false,',
      'allowEditSaleInvoice: data.allowEditSaleInvoice || false,\n        allowEditPurchaseInvoice: data.allowEditPurchaseInvoice || false,'
    );
    fs.writeFileSync(settingsPath, settingsContent, 'utf8');
    console.log('Fixed SettingsService in ' + basePath);
  }

  // 2. Fix HTML Expenses in ProfitLossReport
  const pnlPath = basePath + '/frontend/src/pages/reports/ProfitLossReport.tsx';
  let pnlContent = fs.readFileSync(pnlPath, 'utf8');
  // normalize line endings to do simple string replacement or use regex
  pnlContent = pnlContent.replace(/\r\n/g, '\n');

  const htmlToReplace = `                {safePnl.itemizedExpenses.length === 0 ? (
                  <div className="py-1 text-black font-bold italic text-[11px] border-b border-[#F3F4F6] mb-1 shrink-0">
                    No operating expenses recorded for this period
                    <span className="float-right font-normal text-black font-bold">{formatCurrency(0)}</span>
                  </div>
                ) : (
                  <div className="mb-1 border-b border-[#F3F4F6] pb-1 overflow-y-auto min-h-0">
                    {safePnl.itemizedExpenses.map((exp: any, idx: number) => (
                      <div key={idx} className="flex justify-between py-0.5 text-black font-bold hover:bg-[#F9FAFB] px-2 rounded">
                        <span>{exp.name}</span>
                        <span className="font-bold text-black font-bold">{formatCurrency(exp.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}`;
  
  if (pnlContent.includes(htmlToReplace)) {
    pnlContent = pnlContent.replace(htmlToReplace, '');
    
    // Also remove the (ITEMIZED) tag if it's there
    pnlContent = pnlContent.replace('<span>III. OPERATING EXPENSES (ITEMIZED)</span>', '<span>III. OPERATING EXPENSES</span>');
    fs.writeFileSync(pnlPath, pnlContent, 'utf8');
    console.log('Fixed ProfitLossReport in ' + basePath);
  } else {
    console.log('Warning: HTML replacement block not found in ' + basePath);
  }
}

patch('d:/NJ fresh_Pos');
patch('d:/Pos-Nasa Fresh Mart');
