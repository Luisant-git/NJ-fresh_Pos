const fs = require('fs');

function fixFiles(basePath) {
  // 1. Fix PurchaseEntry.tsx
  const entryPath = basePath + '/frontend/src/pages/purchase/PurchaseEntry.tsx';
  let entryContent = fs.readFileSync(entryPath, 'utf8');

  // Add editId definition if it's missing
  if (!entryContent.includes('const editId =')) {
    entryContent = entryContent.replace(
      '  const navigate = useNavigate();',
      "  const navigate = useNavigate();\n  const location = useLocation();\n  const searchParams = new URLSearchParams(location.search);\n  const editId = searchParams.get('edit');"
    );
  }

  // Check if updateMutation is missing
  if (!entryContent.includes('const updateMutation = useMutation')) {
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
  });`;
    entryContent = entryContent.replace(targetMutation, replacementMutation);
  }

  fs.writeFileSync(entryPath, entryContent, 'utf8');
  console.log('Fixed ' + entryPath);

  // 2. Fix PurchaseList.tsx
  const listPath = basePath + '/frontend/src/pages/purchase/PurchaseList.tsx';
  let listContent = fs.readFileSync(listPath, 'utf8');

  if (!listContent.includes("import { useSettings }")) {
    listContent = listContent.replace(
      "import { useNavigate } from 'react-router-dom';",
      "import { useNavigate } from 'react-router-dom';\nimport { useSettings } from '../../contexts/SettingsContext';"
    );
  }

  if (!listContent.includes("const { settings } = useSettings();")) {
    listContent = listContent.replace(
      "const navigate = useNavigate();",
      "const navigate = useNavigate();\n  const { settings } = useSettings();"
    );
  }

  fs.writeFileSync(listPath, listContent, 'utf8');
  console.log('Fixed ' + listPath);
}

fixFiles('d:/NJ fresh_Pos');
fixFiles('d:/Pos-Nasa Fresh Mart');
