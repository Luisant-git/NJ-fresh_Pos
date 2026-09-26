const fs = require('fs');

const purchaseFiles = [
  'd:/NJ fresh_Pos/frontend/src/pages/purchase/PurchaseList.tsx',
  'd:/Pos-Nasa Fresh Mart/frontend/src/pages/purchase/PurchaseList.tsx'
];

const salesFiles = [
  'd:/NJ fresh_Pos/frontend/src/pages/sales/SalesList.tsx',
  'd:/Pos-Nasa Fresh Mart/frontend/src/pages/sales/SalesList.tsx'
];

function deduplicate(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  let oldLength = content.length;
  // Use simple string replacement for the duplicated button
  const duplicatePurchases = `                        <button type="button" 
                          onClick={() => handleDelete(purchase.id)}
                          className="text-rose-500 border border-rose-500 rounded p-1 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Delete Purchase Invoice"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button type="button" 
                          onClick={() => handleDelete(purchase.id)}
                          className="text-rose-500 border border-rose-500 rounded p-1 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Delete Purchase Invoice"
                        >
                          <Trash2 size={14} />
                        </button>`;
  
  const singlePurchase = `                        <button type="button" 
                          onClick={() => handleDelete(purchase.id)}
                          className="text-rose-500 border border-rose-500 rounded p-1 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Delete Purchase Invoice"
                        >
                          <Trash2 size={14} />
                        </button>`;

  content = content.replace(duplicatePurchases, singlePurchase);

  const duplicateSales = `                        <button type="button" 
                          onClick={() => handleDelete(sale.id)}
                          className="text-rose-500 border border-rose-500 rounded p-1 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Delete Sales Invoice"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button type="button" 
                          onClick={() => handleDelete(sale.id)}
                          className="text-rose-500 border border-rose-500 rounded p-1 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Delete Sales Invoice"
                        >
                          <Trash2 size={14} />
                        </button>`;

  const singleSale = `                        <button type="button" 
                          onClick={() => handleDelete(sale.id)}
                          className="text-rose-500 border border-rose-500 rounded p-1 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Delete Sales Invoice"
                        >
                          <Trash2 size={14} />
                        </button>`;

  content = content.replace(duplicateSales, singleSale);

  if (content.length !== oldLength) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + filePath);
  }
}

purchaseFiles.forEach(deduplicate);
salesFiles.forEach(deduplicate);
