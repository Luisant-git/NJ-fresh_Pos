const fs = require('fs');

const path = 'd:/NJ fresh_Pos/frontend/src/pages/purchase/PurchaseEntry.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. imports
content = content.replace(
  "import { useNavigate } from 'react-router-dom';",
  "import { useNavigate, useLocation } from 'react-router-dom';"
);

// 2. Add useLocation and editId
content = content.replace(
  "  const navigate = useNavigate();\n  const queryClient = useQueryClient();",
  "  const navigate = useNavigate();\n  const location = useLocation();\n  const searchParams = new URLSearchParams(location.search);\n  const editId = searchParams.get('edit');\n  const queryClient = useQueryClient();"
);

// 3. Add edit queries
const targetQueries = `  // Fetch Masters & Next Entry No
  const { data: suppliers = [] } = useQuery({ queryKey: ['suppliers'], queryFn: async () => (await api.get('/suppliers')).data });
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: async () => (await api.get('/products')).data });
  const { data: paymentModes = [] } = useQuery({ queryKey: ['paymentModes'], queryFn: async () => (await api.get('/payment-modes')).data });
  const { data: nextEntryData } = useQuery({ queryKey: ['nextEntryNo'], queryFn: async () => (await api.get('/purchases/next-entry-no')).data });

  // Update default entry no
  useEffect(() => {
    if (nextEntryData?.entryNo) {
      setValue('entryNo', nextEntryData.entryNo);
    }
  }, [nextEntryData, setValue]);`;

const replacementQueries = `  // Fetch Masters & Next Entry No
  const { data: suppliers = [] } = useQuery({ queryKey: ['suppliers'], queryFn: async () => (await api.get('/suppliers')).data });
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: async () => (await api.get('/products')).data });
  const { data: paymentModes = [] } = useQuery({ queryKey: ['paymentModes'], queryFn: async () => (await api.get('/payment-modes')).data });
  const { data: nextEntryData } = useQuery({ queryKey: ['nextEntryNo'], queryFn: async () => (await api.get('/purchases/next-entry-no')).data, enabled: !editId });

  const { data: editPurchase } = useQuery({
    queryKey: ['purchases', editId],
    queryFn: async () => (await api.get(\`/purchases/\${editId}\`)).data,
    enabled: !!editId,
  });

  useEffect(() => {
    if (editPurchase && editId) {
      const itemsList = editPurchase.items?.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        unit: item.product?.unit?.shortCode || item.product?.unit?.name || 'Nos',
        pRate: item.rate,
        wRate: item.product?.wholesaleRate || 0,
        sRate: item.product?.sellingRate || 0,
        mrp: item.product?.mrp || 0,
        discPercent: 0,
        discAmt: 0,
        total: item.amount,
      })) || [];

      reset({
        entryNo: editPurchase.invoiceNo,
        invoiceNo: editPurchase.supplierInvoiceNo || '',
        invoiceDate: editPurchase.invoiceDate ? new Date(editPurchase.invoiceDate).toISOString().split('T')[0] : '',
        supplierId: editPurchase.supplierId,
        date: editPurchase.date ? new Date(editPurchase.date).toISOString().split('T')[0] : new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Kuala_Lumpur' }),
        paymentModeId: editPurchase.paymentModeId,
        items: itemsList.length > 0 ? itemsList : [{ productId: 0, quantity: '' as any, unit: 'Nos', pRate: '' as any, wRate: '' as any, sRate: '' as any, mrp: '' as any, discPercent: '' as any, discAmt: '' as any, total: 0 }],
        totalAmount: editPurchase.subtotal,
        totalDiscountPercent: '' as any,
        totalDiscount: editPurchase.discount,
        roundOff: '' as any,
        netAmount: editPurchase.grandTotal
      });
    }
  }, [editPurchase, reset, editId]);

  // Update default entry no
  useEffect(() => {
    if (!editId && nextEntryData?.entryNo) {
      setValue('entryNo', nextEntryData.entryNo);
    }
  }, [nextEntryData, setValue, editId]);`;

content = content.replace(targetQueries, replacementQueries);

// 4. Update mutation
const targetMutation = `    onError: (error) => {
      console.error(error);
      toast.error('Failed to record purchase. Please check your inputs.');
    }
  });`;

const replacementMutation = `    onError: (error) => {
      console.error(error);
      toast.error('Failed to record purchase. Please check your inputs.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: PurchaseFormValues) => api.put(\`/purchases/\${editId}\`, data),
    onSuccess: () => {
      toast.success('Purchase updated successfully!');
      
      setTimeout(() => {
        if (printAfterSaveRef.current) {
          window.print();
        }
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['purchases'] });
        reset();
        navigate('/purchase');
      }, 100);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update purchase. Please check your inputs.');
    }
  });`;

content = content.replace(targetMutation, replacementMutation);

// 5. handleConfirmSave
const targetHandleConfirmSave = `  const handleConfirmSave = (print: boolean) => {
    printAfterSaveRef.current = print;
    setIsSaveModalOpen(false);
    if (pendingSavePayload) {
      createMutation.mutate(pendingSavePayload as any);
      setPendingSavePayload(null);
    }
  };`;

const replacementHandleConfirmSave = `  const handleConfirmSave = (print: boolean) => {
    printAfterSaveRef.current = print;
    setIsSaveModalOpen(false);
    if (pendingSavePayload) {
      if (editId) {
        updateMutation.mutate(pendingSavePayload as any);
      } else {
        createMutation.mutate(pendingSavePayload as any);
      }
      setPendingSavePayload(null);
    }
  };`;

content = content.replace(targetHandleConfirmSave, replacementHandleConfirmSave);

// 6. buttons
content = content.replace(
  '<CheckCircle size={16} /> SAVE PURCHASE (F10)',
  '<CheckCircle size={16} /> {editId ? \'UPDATE PURCHASE (F10)\' : \'SAVE PURCHASE (F10)\'}'
);

content = content.replace(
  'disabled={createMutation.isPending}',
  'disabled={createMutation.isPending || updateMutation.isPending}'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched ' + path);
