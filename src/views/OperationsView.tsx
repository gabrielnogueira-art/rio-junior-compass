import { useState, useEffect, useCallback } from 'react';
import { 
  DollarSign, 
  BarChart3, 
  Building2, 
  FileText, 
  LayoutDashboard, 
  Loader2, 
  Plus, 
  ArrowRightLeft, 
  RefreshCw, 
  Download,
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import { 
  MovimentacaoRioJunior, 
  TaxonomyRioJunior, 
  FinancialSummaryRioJunior, 
  BankAccountsViewData, 
  DFCReport 
} from '@/types';

import { movimentacoesService } from '@/services/movimentacoesService';
import { MovimentacoesDashboard } from '@/components/operations/MovimentacoesDashboard';
import { MovimentacoesTable } from '@/components/operations/MovimentacoesTable';
import { BankAccountsView } from '@/components/operations/BankAccountsView';
import { DFCReportsView } from '@/components/operations/DFCReportsView';
import { TransactionModal } from '@/components/operations/TransactionModal';
import { TransferModal } from '@/components/operations/TransferModal';
import { TransactionDetailsModal } from '@/components/operations/TransactionDetailsModal';
import FinancialProjectionChart from '@/components/operations/FinancialProjectionChart';

interface OperationsViewProps {
  selectedYear: number;
}

const OperationsView = ({ selectedYear }: OperationsViewProps) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);

  // Data states
  const [summary, setSummary] = useState<FinancialSummaryRioJunior | null>(null);
  const [taxonomy, setTaxonomy] = useState<TaxonomyRioJunior>(movimentacoesService.getTaxonomy());
  const [bankData, setBankData] = useState<BankAccountsViewData | null>(null);
  const [dfcData, setDfcData] = useState<DFCReport | null>(null);

  // Table & Filters state
  const [transactions, setTransactions] = useState<MovimentacaoRioJunior[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredReceitas, setFilteredReceitas] = useState(0);
  const [filteredDespesas, setFilteredDespesas] = useState(0);
  const [filteredSaldo, setFilteredSaldo] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [filters, setFilters] = useState({
    search: '',
    tipo: 'ALL',
    conta: 'ALL',
    mes: 'ALL',
    centroCusto: 'ALL',
    categoria: 'ALL',
    projeto: 'ALL'
  });

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<MovimentacaoRioJunior | null>(null);
  const [txToEdit, setTxToEdit] = useState<MovimentacaoRioJunior | null>(null);

  // Load all initial data
  const loadData = useCallback(async () => {
    try {
      const isOnline = await movimentacoesService.checkBackend();
      setBackendConnected(isOnline);

      const [sum, bank, dfc] = await Promise.all([
        movimentacoesService.getSummary(),
        movimentacoesService.getBankAccountsView(),
        movimentacoesService.getDFCReport()
      ]);

      setSummary(sum);
      setBankData(bank);
      setDfcData(dfc);
    } catch (err) {
      console.error('Error loading operations data:', err);
      toast.error('Erro ao carregar dados financeiros.');
    }
  }, []);

  // Load filtered transactions
  const loadTransactions = useCallback(async () => {
    try {
      const res = await movimentacoesService.getTransactions({
        search: filters.search,
        tipo: filters.tipo,
        conta: filters.conta,
        mes: filters.mes,
        centroCusto: filters.centroCusto,
        categoria: filters.categoria,
        projeto: filters.projeto,
        page,
        limit,
        sortBy: 'dataEfetiva',
        sortOrder: 'desc'
      });

      setTransactions(res.data);
      setTotalCount(res.total);
      setFilteredReceitas(res.filteredReceitas);
      setFilteredDespesas(res.filteredDespesas);
      setFilteredSaldo(res.filteredSaldo);
    } catch (err) {
      console.error('Error loading transactions:', err);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadData();
      await loadTransactions();
      setLoading(false);
    };
    init();
  }, [loadData, loadTransactions]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      tipo: 'ALL',
      conta: 'ALL',
      mes: 'ALL',
      centroCusto: 'ALL',
      categoria: 'ALL',
      projeto: 'ALL'
    });
    setPage(1);
  };

  const handleSelectAccountFilter = (acc: string) => {
    setFilters(prev => ({ ...prev, conta: acc }));
    setActiveSubTab('extrato');
  };

  // Transaction CRUD handlers
  const handleSaveTransaction = async (data: Partial<MovimentacaoRioJunior>) => {
    try {
      if (txToEdit && txToEdit.id) {
        await movimentacoesService.updateTransaction(txToEdit.id, data);
        toast.success('Movimentação atualizada com sucesso!');
      } else {
        await movimentacoesService.createTransaction(data);
        toast.success('Movimentação registrada com sucesso!');
      }
      setTxToEdit(null);
      await loadData();
      await loadTransactions();
    } catch (err: any) {
      toast.error('Erro ao salvar movimentação: ' + err.message);
      throw err;
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await movimentacoesService.deleteTransaction(id);
      toast.success('Movimentação excluída!');
      await loadData();
      await loadTransactions();
    } catch (err: any) {
      toast.error('Erro ao excluir movimentação: ' + err.message);
    }
  };

  const handleDuplicateTransaction = (tx: MovimentacaoRioJunior) => {
    setTxToEdit({
      ...tx,
      id: '',
      dataEfetiva: new Date().toISOString().split('T')[0],
      documento: ''
    });
    setIsTxModalOpen(true);
  };

  const handleTransfer = async (transferData: {
    contaOrigem: string;
    contaDestino: string;
    valorEfetivo: number;
    dataEfetiva: string;
    observacoes?: string;
  }) => {
    try {
      await movimentacoesService.createTransfer(transferData);
      toast.success(`Transferência de ${transferData.contaOrigem} para ${transferData.contaDestino} realizada com sucesso!`);
      await loadData();
      await loadTransactions();
    } catch (err: any) {
      toast.error('Erro ao processar transferência: ' + err.message);
      throw err;
    }
  };

  const handleSyncExcel = async () => {
    const toastId = toast.loading('Sincronizando dados com o arquivo Excel...');
    try {
      const res = await movimentacoesService.syncToExcel();
      if (res.ok) {
        toast.success('Planilha Excel [2026] Movimentações - RioJunior.xlsx atualizada com sucesso no disco!', { id: toastId });
      } else {
        toast.error(res.message || 'Erro ao sincronizar com o Excel.', { id: toastId });
      }
    } catch (err: any) {
      toast.error('Erro na sincronização: ' + err.message, { id: toastId });
    }
  };

  const handleExportCSV = () => {
    movimentacoesService.exportCSV(transactions);
    toast.success('Download da planilha CSV iniciado!');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Carregando dados financeiros da RioJunior...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Operações — Gestão Financeira</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Exercício {selectedYear}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Fluxo de caixa, conciliação bancária, lançamentos contábeis e demonstrativos analíticos da Federação.
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 lg:w-auto lg:inline-grid p-1 bg-muted/60 rounded-xl">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 text-xs font-bold">
            <LayoutDashboard size={15} /> Visão Geral
          </TabsTrigger>

          <TabsTrigger value="extrato" className="flex items-center gap-2 text-xs font-bold">
            <DollarSign size={15} /> 
            <span>Extrato</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/20 text-primary font-extrabold">
              {summary?.totalMovimentacoes?.toLocaleString('pt-BR') || 0}
            </span>
          </TabsTrigger>

          <TabsTrigger value="bancario" className="flex items-center gap-2 text-xs font-bold">
            <Building2 size={15} /> Visão Bancária (Pág. 94)
          </TabsTrigger>

          <TabsTrigger value="dfc" className="flex items-center gap-2 text-xs font-bold">
            <FileText size={15} /> DFC & Relatórios
          </TabsTrigger>

          <TabsTrigger value="projecao" className="flex items-center gap-2 text-xs font-bold">
            <BarChart3 size={15} /> Projeção
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Dashboard & KPIs */}
        <TabsContent value="dashboard" className="space-y-6">
          <MovimentacoesDashboard
            summary={summary}
            recentTransactions={transactions}
            backendConnected={backendConnected}
            onOpenNewTx={() => {
              setTxToEdit(null);
              setIsTxModalOpen(true);
            }}
            onOpenTransfer={() => setIsTransferModalOpen(true)}
            onSyncExcel={handleSyncExcel}
            onExportCSV={handleExportCSV}
            onSelectAccountFilter={handleSelectAccountFilter}
            onViewAllTx={() => setActiveSubTab('extrato')}
          />
        </TabsContent>

        {/* Tab 2: Extrato / Movimentações */}
        <TabsContent value="extrato" className="space-y-6">
          <MovimentacoesTable
            transactions={transactions}
            total={totalCount}
            filteredReceitas={filteredReceitas}
            filteredDespesas={filteredDespesas}
            filteredSaldo={filteredSaldo}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            taxonomy={taxonomy}
            onViewDetails={tx => {
              setSelectedTx(tx);
              setIsDetailsModalOpen(true);
            }}
            onEdit={tx => {
              setTxToEdit(tx);
              setIsTxModalOpen(true);
            }}
            onDuplicate={handleDuplicateTransaction}
            onDelete={handleDeleteTransaction}
            onExportCSV={handleExportCSV}
            onOpenNewTx={() => {
              setTxToEdit(null);
              setIsTxModalOpen(true);
            }}
            onOpenTransfer={() => setIsTransferModalOpen(true)}
          />
        </TabsContent>

        {/* Tab 3: Visão Bancária (Página 94) */}
        <TabsContent value="bancario" className="space-y-6">
          <BankAccountsView data={bankData} />
        </TabsContent>

        {/* Tab 4: DFC & Relatórios */}
        <TabsContent value="dfc" className="space-y-6">
          <DFCReportsView dfc={dfcData} summary={summary} />
        </TabsContent>

        {/* Tab 5: Projeção Financeira Original */}
        <TabsContent value="projecao" className="space-y-6">
          <FinancialProjectionChart />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setTxToEdit(null);
        }}
        onSave={handleSaveTransaction}
        transactionToEdit={txToEdit}
        taxonomy={taxonomy}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onTransfer={handleTransfer}
        taxonomy={taxonomy}
      />

      <TransactionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
        onEdit={tx => {
          setTxToEdit(tx);
          setIsTxModalOpen(true);
        }}
      />
    </div>
  );
};

export default OperationsView;
