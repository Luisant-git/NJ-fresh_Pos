const fs = require('fs');

function patch(basePath) {
  const entryPath = basePath + '/frontend/src/pages/purchase/PurchaseEntry.tsx';
  let entryContent = fs.readFileSync(entryPath, 'utf8');
  
  // Normalize line endings to LF for easy replacement
  entryContent = entryContent.replace(/\r\n/g, '\n');

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

    // Save with native line endings
    fs.writeFileSync(entryPath, entryContent, 'utf8');
    console.log('Fixed PurchaseEntry.tsx in ' + basePath);
  }
}

patch('d:/NJ fresh_Pos');
patch('d:/Pos-Nasa Fresh Mart');
