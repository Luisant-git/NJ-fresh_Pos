const fs = require('fs');

function patch(basePath) {
  const entryPath = basePath + '/frontend/src/pages/purchase/PurchaseEntry.tsx';
  let content = fs.readFileSync(entryPath, 'utf8');

  // Normalize line endings
  content = content.replace(/\r\n/g, '\n');

  // 1. Remove isLoadingPurchase
  content = content.replace(
    'const { data: existingPurchase, isLoading: isLoadingPurchase } = useQuery({',
    'const { data: existingPurchase } = useQuery({'
  );

  // 2. Fix type error: totalDiscountPercent: '' -> totalDiscountPercent: 0 as any
  content = content.replace(
    "totalDiscountPercent: '',",
    "totalDiscountPercent: 0 as any,"
  );

  fs.writeFileSync(entryPath, content, 'utf8');
  console.log('Fixed PurchaseEntry in ' + basePath);
}

patch('d:/NJ fresh_Pos');
patch('d:/Pos-Nasa Fresh Mart');
