const fs = require('fs');
let content = fs.readFileSync('d:/NJ fresh_Pos/frontend/src/pages/sales/POS.tsx', 'utf8');

// Normalize to LF
content = content.replace(/\r\n/g, '\n');
const oldContent = content;

// 1.
const useEffectRegex = /if \(targetRate !== '' && Number\(item\.rate\) !== Number\(targetRate\)\) \{\n\s*setValue\(`items\.\$\{index\}\.rate`, targetRate\);\n\s*\}/;
content = content.replace(useEffectRegex, `if (targetRate !== '' && Number(item.rate) !== Number(targetRate)) {
            if (targetRate <= Number(prod.purchaseRate)) {
              setValue(\`items.\${index}.rate\`, '' as any);
              toast.error(\`Customer fixed rate for \${prod.name} is lower than purchase rate. Rate cleared.\`, { id: 'cust-rate-err' });
            } else {
              setValue(\`items.\${index}.rate\`, targetRate);
            }
          }`);
console.log('1 replaced:', content !== oldContent);
let t1 = content;

// 2. Already done, but let's check
const productChangeBlockRegex = /let rateToUse: any = product\.sellingRate \? parseFloat\(Number\(product\.sellingRate\)\.toFixed\(2\)\) : '';[\s\S]*?setValue\(`items\.\$\{index\}\.rate`, rateToUse\);/;
content = content.replace(productChangeBlockRegex, (match) => {
  return match.replace(/setValue\(`items\.\$\{index\}\.rate`, rateToUse\);/, `if (rateToUse !== '' && rateToUse <= Number(product.purchaseRate)) {
            toast.error(\`Configured rate for \${product.name} is lower than purchase rate. Rate cleared.\`);
            rateToUse = '';
        }
        setValue(\`items.\${index}.rate\`, rateToUse);`);
});
console.log('2 replaced:', content !== t1);
let t2 = content;

// 3.
const onSubmitRegex = /const hasLowRate = validItems\.some[\s\S]*?if \(hasLowRate\) \{[\s\S]*?setShowLossWarning\(true\);\s*return;\s*\}/;
content = content.replace(onSubmitRegex, `const hasLowRate = validItems.some(item => {
      const p = products.find((prod: any) => prod.id === Number(item.productId));
      return p && Number(item.rate) > 0 && Number(item.rate) <= Number(p.purchaseRate);
    });

    if (hasLowRate) {
      toast.error('Validation Error: Sales rate must be higher than the purchase rate for all items.');
      return;
    }`);
console.log('3 replaced:', content !== t2);
let t3 = content;

// 4.
const onBlurRegex = /onBlur=\{\(e\) => \{[\s\S]*?const enteredRate = Number\(e\.target\.value\);[\s\S]*?if \(product && enteredRate > 0 && enteredRate <= Number\(product\.purchaseRate\)\) \{[\s\S]*?toast\.error\(`Loss Warning: Selling below purchase rate[\s\S]*?\}\n\s*register\(`items\.\$\{index\}\.rate`\)\.onBlur\(e\);\s*\}\}/;
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
console.log('4 replaced:', content !== t3);

if (content !== oldContent) {
  fs.writeFileSync('d:/NJ fresh_Pos/frontend/src/pages/sales/POS.tsx', content);
  fs.writeFileSync('d:/Pos-Nasa Fresh Mart/frontend/src/pages/sales/POS.tsx', content);
  console.log('Saved to both repos');
}
