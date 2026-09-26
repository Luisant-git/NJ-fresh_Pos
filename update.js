const fs = require('fs');

function updatePurchaseList(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace lucide-react import
  content = content.replace(
    "import { Plus, Eye, Edit } from 'lucide-react';",
    "import { Plus, Eye, Edit, Trash2 } from 'lucide-react';"
  );
  
  // Replace react-query import
  content = content.replace(
    "import { useQuery } from '@tanstack/react-query';",
    "import { useQuery, useQueryClient } from '@tanstack/react-query';"
  );
  
  // Add queryClient
  if (!content.includes('const queryClient = useQueryClient();')) {
    content = content.replace(
      "const navigate = useNavigate();",
      "const navigate = useNavigate();\n  const queryClient = useQueryClient();"
    );
  }

  // Add handleDelete
  if (!content.includes('const handleDelete')) {
    const fetchPurchases = "  // Fetch Purchases\n  const { data: purchases = [], isLoading } = useQuery({\n    queryKey: ['purchases'],\n    queryFn: async () => {\n      const { data } = await api.get('/purchases');\n      return data;\n    },\n  });";
    
    // Normalize newlines in case it's CRLF
    const rx = /\/\/ Fetch Purchases[\s\S]*?\}\);/;
    
    const handler = `
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this purchase invoice? This action cannot be undone and stock levels will be reverted.')) {
      try {
        await api.delete(\`/purchases/\${id}\`);
        queryClient.invalidateQueries({ queryKey: ['purchases'] });
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting purchase invoice');
      }
    }
  };`;

    content = content.replace(rx, match => match + "\n" + handler);
  }

  // Add delete button
  const editButtonRx = /(<Edit size=\{14\} \/>\s*<\/button>\s*\)\})/;
  const deleteButton = `
                        <button type="button" 
                          onClick={() => handleDelete(purchase.id)}
                          className="text-rose-500 border border-rose-500 rounded p-1 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Delete Purchase Invoice"
                        >
                          <Trash2 size={14} />
                        </button>`;
  
  content = content.replace(editButtonRx, match => match + deleteButton);

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

function updateSalesList(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace lucide-react import
  content = content.replace(
    "import { Plus, Eye, Printer, Edit } from 'lucide-react';",
    "import { Plus, Eye, Printer, Edit, Trash2 } from 'lucide-react';"
  );
  
  // Replace react-query import
  content = content.replace(
    "import { useQuery } from '@tanstack/react-query';",
    "import { useQuery, useQueryClient } from '@tanstack/react-query';"
  );
  
  // Add queryClient
  if (!content.includes('const queryClient = useQueryClient();')) {
    content = content.replace(
      "const navigate = useNavigate();",
      "const navigate = useNavigate();\n  const queryClient = useQueryClient();"
    );
  }

  // Add handleDelete
  if (!content.includes('const handleDelete')) {
    const rx = /\/\/ Fetch Sales from API[\s\S]*?\}\);/;
    
    const handler = `
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sales invoice? This action cannot be undone and stock levels will be reverted.')) {
      try {
        await api.delete(\`/sales/\${id}\`);
        queryClient.invalidateQueries({ queryKey: ['sales'] });
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting sales invoice');
      }
    }
  };`;

    content = content.replace(rx, match => match + "\n" + handler);
  }

  // Add delete button
  const editButtonRx = /(<Edit size=\{14\} \/>\s*<\/button>\s*\)\})/;
  const deleteButton = `
                        <button type="button" 
                          onClick={() => handleDelete(sale.id)}
                          className="text-rose-500 border border-rose-500 rounded p-1 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Delete Sales Invoice"
                        >
                          <Trash2 size={14} />
                        </button>`;
  
  content = content.replace(editButtonRx, match => match + deleteButton);

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

const purchaseFiles = [
  'd:/NJ fresh_Pos/frontend/src/pages/purchase/PurchaseList.tsx',
  'd:/Pos-Nasa Fresh Mart/frontend/src/pages/purchase/PurchaseList.tsx'
];

const salesFiles = [
  'd:/NJ fresh_Pos/frontend/src/pages/sales/SalesList.tsx',
  'd:/Pos-Nasa Fresh Mart/frontend/src/pages/sales/SalesList.tsx'
];

purchaseFiles.forEach(updatePurchaseList);
salesFiles.forEach(updateSalesList);
