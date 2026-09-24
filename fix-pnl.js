const fs = require('fs');

function patch(basePath) {
  const pnlPath = basePath + '/backend/src/reports/reports.service.ts';
  let content = fs.readFileSync(pnlPath, 'utf8');

  // Find the COGS calculation section and replace it
  const cogsSectionRegex = /\/\/ --- COGS CALCULATION: OPENING STOCK \+ PURCHASES - CLOSING STOCK ---[\s\S]*?const netCogs = openingStockValue \+ grossPurchases - totalPurchaseReturns - closingStockValue;/g;

  if (cogsSectionRegex.test(content)) {
    content = content.replace(cogsSectionRegex, `// --- COGS CALCULATION: PURCHASES ONLY ---
    
    // B. Purchases during period
    const purchases = await this.prisma.purchase.aggregate({
      where: whereDate,
      _sum: { grandTotal: true },
    });
    const grossPurchases = Number(purchases._sum.grandTotal || 0);

    // C. Purchase Returns during period
    const purchaseReturns = await this.prisma.purchaseReturn.aggregate({
      where: whereDate,
      _sum: { totalAmount: true },
    });
    const totalPurchaseReturns = Number(purchaseReturns._sum.totalAmount || 0);

    const netCogs = grossPurchases - totalPurchaseReturns;
    const openingStockValue = 0;
    const closingStockValue = 0;`);
    
    fs.writeFileSync(pnlPath, content, 'utf8');
    console.log('Fixed PNL formula in ' + basePath);
  } else {
    console.log('Could not find COGS section in ' + basePath);
  }
}

patch('d:/NJ fresh_Pos');
patch('d:/Pos-Nasa Fresh Mart');
