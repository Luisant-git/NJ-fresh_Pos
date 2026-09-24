const fs = require('fs');

function patch(basePath) {
  const entryPath = basePath + '/frontend/src/pages/purchase/PurchaseEntry.tsx';
  let content = fs.readFileSync(entryPath, 'utf8');

  // Normalize line endings
  content = content.replace(/\r\n/g, '\n');

  if (!content.includes("queryKey: ['purchase', editId]")) {
    const toReplace = `  const { data: suppliers = [] } = useQuery({ queryKey: ['suppliers'], queryFn: async () => (await api.get('/suppliers')).data });`;
    
    const replacement = `  // Fetch existing purchase if editing
  const { data: existingPurchase, isLoading: isLoadingPurchase } = useQuery({
    queryKey: ['purchase', editId],
    queryFn: async () => {
      const res = await api.get(\`/purchases/\${editId}\`);
      return res.data;
    },
    enabled: !!editId
  });

  useEffect(() => {
    if (existingPurchase) {
      reset({
        entryNo: existingPurchase.invoiceNo,
        invoiceNo: existingPurchase.supplierInvoiceNo || '',
        invoiceDate: existingPurchase.invoiceDate ? existingPurchase.invoiceDate.split('T')[0] : '',
        supplierId: existingPurchase.supplierId,
        date: existingPurchase.date ? existingPurchase.date.split('T')[0] : '',
        paymentModeId: existingPurchase.paymentModeId,
        items: existingPurchase.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unit: item.product?.unit?.shortCode || item.product?.unit?.name || 'Nos',
          pRate: item.rate,
          wRate: item.product?.wholesaleRate || 0,
          sRate: item.product?.sellingRate || 0,
          mrp: item.product?.mrp || 0,
          discPercent: 0,
          discAmt: 0,
          total: item.amount
        })),
        totalAmount: existingPurchase.subtotal,
        totalDiscount: existingPurchase.discount,
        totalDiscountPercent: '',
        roundOff: existingPurchase.grandTotal - (existingPurchase.subtotal - existingPurchase.discount),
        netAmount: existingPurchase.grandTotal
      });
    }
  }, [existingPurchase, reset]);

  const { data: suppliers = [] } = useQuery({ queryKey: ['suppliers'], queryFn: async () => (await api.get('/suppliers')).data });`;

    content = content.replace(toReplace, replacement);
    fs.writeFileSync(entryPath, content, 'utf8');
    console.log('Fixed PurchaseEntry in ' + basePath);
  } else {
    console.log('Already fixed in ' + basePath);
  }
}

patch('d:/NJ fresh_Pos');
patch('d:/Pos-Nasa Fresh Mart');
