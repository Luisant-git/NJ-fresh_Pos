const fs = require('fs');

function patch(basePath) {
  // 1. SettingsContext.tsx
  const settingsPath = basePath + '/frontend/src/contexts/SettingsContext.tsx';
  let settingsContent = fs.readFileSync(settingsPath, 'utf8');
  if (!settingsContent.includes('allowEditPurchaseInvoice?: boolean;')) {
    settingsContent = settingsContent.replace(
      'allowEditSaleInvoice?: boolean;',
      'allowEditSaleInvoice?: boolean;\n  allowEditPurchaseInvoice?: boolean;'
    );
    fs.writeFileSync(settingsPath, settingsContent, 'utf8');
    console.log('Fixed SettingsContext.tsx in ' + basePath);
  }

  // 2. PurchaseEntry.tsx
  const entryPath = basePath + '/frontend/src/pages/purchase/PurchaseEntry.tsx';
  let entryContent = fs.readFileSync(entryPath, 'utf8');
  
  if (!entryContent.includes('const updateMutation = useMutation')) {
    entryContent = entryContent.replace(
      `    onError: (error) => {
      console.error(error);
      toast.error('Failed to record purchase. Please check your inputs.');
    }
  });`,
      `    onError: (error) => {
      console.error(error);
      toast.error('Failed to record purchase. Please check your inputs.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.put(\`/purchases/\${editId}\`, data),
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
  });`
    );

    entryContent = entryContent.replace(
      `  const handleConfirmSave = (print: boolean) => {
    printAfterSaveRef.current = print;
    setIsSaveModalOpen(false);
    if (pendingSavePayload) {
      createMutation.mutate(pendingSavePayload as any);
      setPendingSavePayload(null);
    }
  };`,
      `  const handleConfirmSave = (print: boolean) => {
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
  };`
    );

    fs.writeFileSync(entryPath, entryContent, 'utf8');
    console.log('Fixed PurchaseEntry.tsx in ' + basePath);
  }
}

patch('d:/NJ fresh_Pos');
patch('d:/Pos-Nasa Fresh Mart');
