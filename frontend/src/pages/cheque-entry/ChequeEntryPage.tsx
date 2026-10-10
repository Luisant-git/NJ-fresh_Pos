import { useState } from 'react';
import { CreditCard, PlusSquare, Filter, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import TableLoader from '../../components/TableLoader';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const ChequeEntryPage = () => {
  const { formatCurrency, settings } = useSettings();
  const queryClient = useQueryClient();

  // Helper for Malaysia date string (YYYY-MM-DD)
  const getMalaysiaDateStr = (date = new Date()) => {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  };

  // Helper for Malaysia display date (DD/MM/YYYY)
  const formatMalaysiaDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(dateString));
  };

  // New Cheque Form State
  const [chequeDate, setChequeDate] = useState(getMalaysiaDateStr());
  const [amount, setAmount] = useState('');
  const [chequeFrom, setChequeFrom] = useState('');
  const [chequeTo, setChequeTo] = useState('');
  
  // Date-wise Filter & Search State for History
  const [filterStartDate, setFilterStartDate] = useState(() => {
    return getMalaysiaDateStr().substring(0, 8) + '01';
  });
  const [filterEndDate, setFilterEndDate] = useState(() => getMalaysiaDateStr());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chequeToDelete, setChequeToDelete] = useState<number | null>(null);

  // Fetch Cheques List with date filter
  const { data: cheques = [], isLoading: historyLoading } = useQuery({
    queryKey: ['chequeEntries', filterStartDate, filterEndDate, searchQuery],
    queryFn: async () => {
      const res = await api.get('/cheque-entries', {
        params: {
          startDate: filterStartDate || undefined,
          endDate: filterEndDate || undefined,
          search: searchQuery || undefined,
        }
      });
      return res.data;
    }
  });

  const totalChequeAmount = cheques.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/cheque-entries', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chequeEntries'] });
      toast.success('Cheque Entry saved successfully!');
      setAmount('');
      setChequeFrom('');
      setChequeTo('');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(`Failed to save cheque entry: ${err.message}`);
    }
  });

  const handleSave = () => {
    if (!amount || !chequeFrom || !chequeTo) {
      toast.error('Please fill all fields');
      return;
    }
    createMutation.mutate({
      chequeDate,
      amount: Number(amount),
      chequeFrom,
      chequeTo
    });
  };

  const setQuickDate = (type: 'today' | 'thisMonth' | 'all') => {
    const todayStr = getMalaysiaDateStr();
    if (type === 'today') {
      setFilterStartDate(todayStr);
      setFilterEndDate(todayStr);
    } else if (type === 'thisMonth') {
      const start = todayStr.substring(0, 8) + '01';
      setFilterStartDate(start);
      setFilterEndDate(todayStr);
    } else {
      setFilterStartDate('');
      setFilterEndDate('');
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cheque-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chequeEntries'] });
      toast.success('Cheque entry deleted successfully');
      setDeleteModalOpen(false);
      setChequeToDelete(null);
    },
    onError: (err: any) => {
      toast.error('Failed to delete cheque entry');
      console.error(err);
      setDeleteModalOpen(false);
      setChequeToDelete(null);
    }
  });

  const handleDeleteClick = (id: number) => {
    setChequeToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (chequeToDelete !== null) {
      deleteMutation.mutate(chequeToDelete);
    }
  };

  const todayStr = getMalaysiaDateStr();
  const startOfMonthStr = todayStr.substring(0, 8) + '01';
  
  const isAllTime = !filterStartDate && !filterEndDate;
  const isToday = filterStartDate === todayStr && filterEndDate === todayStr;
  const isThisMonth = filterStartDate === startOfMonthStr && filterEndDate === todayStr && !isToday;

  return (
    <div className="absolute inset-0 bg-[#F8FAFC] flex flex-col font-sans overflow-hidden z-10">
      
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0 flex items-center justify-between z-10 shadow-sm relative h-[60px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 flex items-center justify-center rounded-lg shadow-inner">
            <CreditCard className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 tracking-wide uppercase">CHEQUE ENTRY</h2>
            <p className="text-[11px] text-gray-500 font-medium">Record and manage cheques</p>
          </div>
        </div>
      </div>

      {/* Main Content split */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Side: Entry Form */}
        <div className="w-full md:w-[350px] lg:w-[400px] bg-white border-r border-gray-200 flex flex-col shrink-0 relative z-10 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="p-4 bg-gray-50/50 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <PlusSquare className="w-4 h-4 text-indigo-600" /> NEW CHEQUE
            </h3>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1">Cheque Date</label>
              <input
                type="date"
                value={chequeDate}
                onChange={(e) => setChequeDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-bold bg-white"
              />
            </div>
            
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 font-bold">{settings?.currencySymbol || 'RM'}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-bold bg-white"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1">Cheque From</label>
              <input
                type="text"
                value={chequeFrom}
                onChange={(e) => setChequeFrom(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-bold bg-white"
                placeholder="e.g. Customer Name / Bank"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1">Cheque To</label>
              <input
                type="text"
                value={chequeTo}
                onChange={(e) => setChequeTo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-bold bg-white"
                placeholder="e.g. Supplier Name / Bank"
              />
            </div>

          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleSave}
              disabled={createMutation.isPending}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold shadow transition-colors flex items-center justify-center gap-2"
            >
              {createMutation.isPending ? 'Saving...' : 'SAVE CHEQUE'}
            </button>
          </div>
        </div>

        {/* Right Side: Recent Cheques & Filters */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
          {/* Quick Filters */}
          <div className="p-2 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 shadow-sm shrink-0">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setQuickDate('today')} 
                className={`px-3 py-1 rounded text-[11px] font-bold transition-colors shadow-sm border ${isToday ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-900'}`}
              >Today</button>
              <button 
                onClick={() => setQuickDate('thisMonth')} 
                className={`px-3 py-1 rounded text-[11px] font-bold transition-colors shadow-sm border ${isThisMonth ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-900'}`}
              >This Month</button>
              <button 
                onClick={() => setQuickDate('all')} 
                className={`px-3 py-1 rounded text-[11px] font-bold transition-colors shadow-sm border ${isAllTime ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-900'}`}
              >All Time</button>
            </div>
            
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Search from/to..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="p-1.5 border border-gray-300 rounded text-[11px] font-bold" />
              <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="p-1.5 border border-gray-300 rounded text-[11px] font-bold" title="From Date" />
              <span className="text-gray-400 font-medium text-[11px]">to</span>
              <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="p-1.5 border border-gray-300 rounded text-[11px] font-bold" title="To Date" />
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-white rounded shadow-sm border border-gray-200 flex flex-col h-full">
              <div className="p-2 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" /> CHEQUE HISTORY
                </h3>
                <span className="text-xs font-bold text-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">{cheques.length} Records</span>
              </div>
              
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-[#1E293B] text-white sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="p-2 font-bold uppercase tracking-wider text-[11px] border-r border-[#334155] w-12 text-center">#</th>
                      <th className="p-2 font-bold uppercase tracking-wider text-[11px] border-r border-[#334155]">Cheque Date</th>
                      <th className="p-2 font-bold uppercase tracking-wider text-[11px] border-r border-[#334155]">From</th>
                      <th className="p-2 font-bold uppercase tracking-wider text-[11px] border-r border-[#334155]">To</th>
                      <th className="p-2 font-bold uppercase tracking-wider text-[11px] border-r border-[#334155] text-right">Amount</th>
                      <th className="p-2 font-bold uppercase tracking-wider text-[11px] text-center w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyLoading ? (
                      <TableLoader columns={6} />
                    ) : cheques.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center p-8 text-gray-500 font-bold bg-gray-50/50">
                          <div className="flex flex-col items-center justify-center">
                            <CreditCard className="w-8 h-8 text-gray-300 mb-2" />
                            No cheques found for selected criteria.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      cheques.map((cheque: any, idx: number) => (
                        <tr key={cheque.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-2 text-center text-gray-500 border-r border-gray-100 text-xs font-bold">{idx + 1}</td>
                          <td className="p-2 border-r border-gray-100 text-gray-800 font-bold">{formatMalaysiaDate(cheque.chequeDate)}</td>
                          <td className="p-2 border-r border-gray-100 text-gray-800 font-bold">{cheque.chequeFrom}</td>
                          <td className="p-2 border-r border-gray-100 text-gray-800 font-bold">{cheque.chequeTo}</td>
                          <td className="p-2 border-r border-gray-100 text-right text-black font-bold text-sm">
                            {formatCurrency(cheque.amount)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleDeleteClick(cheque.id)}
                              className="w-6 h-6 inline-flex items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                              title="Delete Cheque"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Summary Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center shrink-0">
                <span className="font-bold text-[13px] text-gray-600 uppercase">Total Amount</span>
                <span className="font-bold text-[18px] text-indigo-600">{formatCurrency(totalChequeAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen}
        title="Delete Cheque Entry"
        message="Are you sure you want to delete this cheque entry? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setChequeToDelete(null);
        }}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default ChequeEntryPage;
