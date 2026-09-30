const fs = require('fs');
const files = [
  'D:/NJ fresh_Pos/frontend/src/layouts/MainLayout.tsx',
  'D:/Pos-Nasa Fresh Mart/frontend/src/layouts/MainLayout.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Purchase List
  content = content.replace(/hasPerm\('purchase_entry'\) && <MobileDropdownItem to="\/purchase"/g, 'hasPerm(\'purchase_list\') && <MobileDropdownItem to="/purchase"');
  
  // Sales List
  content = content.replace(/hasPerm\('sales_pos'\) && <MobileDropdownItem to="\/sales"/g, 'hasPerm(\'sales_list\') && <MobileDropdownItem to="/sales"');

  // Reports (Mobile with onClick)
  content = content.replace(/hasPerm\('reports_sales'\) && <MobileDropdownItem to="\/reports\/sales-return"/g, 'hasPerm(\'reports_sales_return\') && <MobileDropdownItem to="/reports/sales-return"');
  content = content.replace(/hasPerm\('reports_sales'\) && <MobileDropdownItem to="\/reports\/product-wise-sales"/g, 'hasPerm(\'reports_product_wise_sales\') && <MobileDropdownItem to="/reports/product-wise-sales"');
  content = content.replace(/hasPerm\('reports_purchase'\) && <MobileDropdownItem to="\/reports\/purchase-return"/g, 'hasPerm(\'reports_purchase_return\') && <MobileDropdownItem to="/reports/purchase-return"');
  content = content.replace(/hasPerm\('reports_financial'\) && <MobileDropdownItem to="\/reports\/stock"/g, 'hasPerm(\'reports_stock\') && <MobileDropdownItem to="/reports/stock"');
  content = content.replace(/hasPerm\('reports_financial'\) && <MobileDropdownItem to="\/reports\/profit-ledger"/g, 'hasPerm(\'reports_profit_ledger\') && <MobileDropdownItem to="/reports/profit-ledger"');
  content = content.replace(/hasPerm\('reports_financial'\) && <MobileDropdownItem to="\/reports\/expenses"/g, 'hasPerm(\'reports_expense\') && <MobileDropdownItem to="/reports/expenses"');
  content = content.replace(/hasPerm\('reports_financial'\) && <MobileDropdownItem to="\/reports\/customer-receipts"/g, 'hasPerm(\'reports_customer_receipts\') && <MobileDropdownItem to="/reports/customer-receipts"');
  content = content.replace(/hasPerm\('reports_financial'\) && <MobileDropdownItem to="\/reports\/supplier-payments"/g, 'hasPerm(\'reports_supplier_payments\') && <MobileDropdownItem to="/reports/supplier-payments"');

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Mobile permissions updated');
