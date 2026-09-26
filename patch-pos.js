const fs = require('fs');

function patchPOS(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update useEffect for auto-syncing customer rates
  const useEffectRegex = /if \(targetRate !== '' && Number\(item\.rate\) !== Number\(targetRate\)\) \{\s*setValue\(`items\.\$\{index\}\.rate`, targetRate\);\s*\}/;
  if (useEffectRegex.test(content)) {
    content = content.replace(useEffectRegex, `if (targetRate !== '' && Number(item.rate) !== Number(targetRate)) {
            if (targetRate <= Number(prod.purchaseRate)) {
              setValue(\`items.\${index}.rate\`, '' as any);
              toast.error(\`Customer fixed rate for \${prod.name} is lower than purchase rate. Rate cleared.\`, { id: 'cust-rate-err' });
            } else {
              setValue(\`items.\${index}.rate\`, targetRate);
            }
          }`);
  }

  // 2. Update handleProductChange
  const handleProductChangeRegex = /setValue\(`items\.\$\{index\}\.rate`, rateToUse\);(\s*\})/g;
  if (handleProductChangeRegex.test(content)) {
    // Only replace the one inside handleProductChange by finding the function context
    // Actually, we can just replace the specific block inside handleProductChange
    const productChangeBlockRegex = /let rateToUse: any = product\.sellingRate \? parseFloat\(Number\(product\.sellingRate\)\.toFixed\(2\)\) : '';[\s\S]*?setValue\(`items\.\$\{index\}\.rate`, rateToUse\);/;
    
    content = content.replace(productChangeBlockRegex, (match) => {
      return match.replace(/setValue\(`items\.\$\{index\}\.rate`, rateToUse\);/, `if (rateToUse !== '' && rateToUse <= Number(product.purchaseRate)) {
            toast.error(\`Configured rate for \${product.name} is lower than purchase rate. Rate cleared.\`);
            rateToUse = '';
        }
        setValue(\`items.\${index}.rate\`, rateToUse);`);
    });
  }

  // 3. Update onSubmit to prevent save if rate is low
  const onSubmitRegex = /const hasLowRate = validItems\.some[\s\S]*?if \(hasLowRate\) \{[\s\S]*?setShowLossWarning\(true\);\s*return;\s*\}/;
  if (onSubmitRegex.test(content)) {
    content = content.replace(onSubmitRegex, `const hasLowRate = validItems.some(item => {
      const p = products.find((prod: any) => prod.id === Number(item.productId));
      return p && Number(item.rate) > 0 && Number(item.rate) <= Number(p.purchaseRate);
    });

    if (hasLowRate) {
      toast.error('Validation Error: Sales rate must be higher than the purchase rate for all items.');
      return;
    }`);
  }

  // 4. Update onBlur in the rate input
  const onBlurRegex = /onBlur=\{\(e\) => \{[\s\S]*?const enteredRate = Number\(e\.target\.value\);[\s\S]*?if \(product && enteredRate > 0 && enteredRate <= Number\(product\.purchaseRate\)\) \{[\s\S]*?toast\.error\(`Loss Warning: Selling below purchase rate[\s\S]*?\}\s*register\(`items\.\$\{index\}\.rate`\)\.onBlur\(e\);\s*\}\}/;
  if (onBlurRegex.test(content)) {
    content = content.replace(onBlurRegex, `onBlur={(e) => {
                          const enteredRate = Number(e.target.value);
                          const pId = watch(\`items.\${index}.productId\`);
                          const product = products.find((p: any) => p.id === Number(pId));
                          if (product && enteredRate > 0 && enteredRate <= Number(product.purchaseRate)) {
                            toast.error(\`Validation Error: Sales rate cannot be less than or equal to purchase rate (\${formatCurrency(product.purchaseRate)})!\`, { duration: 4000 });
                            setValue(\`items.\${index}.rate\`, '' as any);
                          }
                          register(\`items.\${index}.rate\`).onBlur(e);
                        }}`);
  }

  fs.writeFileSync(filePath, content);
  console.log('Patched ' + filePath);
}

patchPOS('d:/NJ fresh_Pos/frontend/src/pages/sales/POS.tsx');
patchPOS('d:/Pos-Nasa Fresh Mart/frontend/src/pages/sales/POS.tsx');
