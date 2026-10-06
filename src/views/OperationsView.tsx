import { useState, useEffect, useCallback } from 'react';
import { 
  DollarSign, 
  BarChart3, 
  Building2, 
  FileText, 
  LayoutDashboard, 
  Loader2, 
  Target,
  ShieldCheck,
  BookOpen,
  FolderTree,
  Settings2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import { 
  MovimentacaoRioJunior, 
  TaxonomyRioJunior, 
  FinancialSummaryRioJunior, 
  BankAccountsViewData, 
  DFCReport,
  IniciativaMetrica,
  CaixaMinimoMonth,
  AnaliseGeralData,
  PlanoContaItem
} from '@/types';

import { movimentacoesService } from '@/services/movimentacoesService';
import { MovimentacoesDashboard } from '@/components/operations/MovimentacoesDashboard';
import { MovimentacoesTable } from '@/components/operations/MovimentacoesTable';
import { BankAccountsView } from '@/components/operations/BankAccountsView';
import { DFCReportsView } from '@/components/operations/DFCReportsView';
import { IniciativasView } from '@/components/operations/IniciativasView';
import { CaixaMinimoView } from '@/components/operations/CaixaMinimoView';
import { PlanoContasView } from '@/components/operations/PlanoContasView';
import { TransactionModal } from '@/components/operations/TransactionModal';
import { BankStatementImportModal } from '@/components/operations/BankStatementImportModal';
import { ManageTaxonomyModal } from '@/components/operations/ManageTaxonomyModal';
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

  // Data states from updated spreadsheets
  const [summary, setSummary] = useState<FinancialSummaryRioJunior | null>(null);
  const [analiseGeral, setAnaliseGeral] = useState<AnaliseGeralData | null>(null);
  const [iniciativas, setIniciativas] = useState<IniciativaMetrica[]>([]);
  const [caixaMinimo, setCaixaMinimo] = useState<CaixaMinimoMonth[]>([]);
  const [planoContas, setPlanoContas] = useState<PlanoContaItem[]>([]);
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
    iniciativa: 'ALL',
    tipoIniciativa: 'ALL',
    categoriaCaixaMinimo: 'ALL'
  });

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isManageTaxonomyOpen, setIsManageTaxonomyOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<MovimentacaoRioJunior | null>(null);
  const [txToEdit, setTxToEdit] = useState<MovimentacaoRioJunior | null>(null);

  // Load all data from service
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
      setAnaliseGeral(movimentacoesService.getAnaliseGeral());
      setIniciativas(movimentacoesService.getIniciativas());
      setCaixaMinimo(movimentacoesService.getCaixaMinimo());
      setPlanoContas(movimentacoesService.getPlanoContas());
      setTaxonomy(movimentacoesService.getTaxonomy());
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
        iniciativa: filters.iniciativa,
        tipoIniciativa: filters.tipoIniciativa,
        categoriaCaixaMinimo: filters.categoriaCaixaMinimo,
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
      iniciativa: 'ALL',
      tipoIniciativa: 'ALL',
      categoriaCaixaMinimo: 'ALL'
    });
    setPage(1);
  };

  const handleSelectAccountFilter = (acc: string) => {
    setFilters(prev => ({ ...prev, conta: acc }));
    setActiveSubTab('extrato');
  };

  // Taxonomy handlers
  const handleSaveTaxonomy = (updatedTax: TaxonomyRioJunior) => {
    const saved = movimentacoesService.updateTaxonomy(updatedTax);
    setTaxonomy({ ...saved });
    toast.success('Opções de categorias e subcategorias atualizadas com sucesso!');
  };

  const handleResetTaxonomy = () => {
    const reset = movimentacoesService.resetTaxonomy();
    setTaxonomy({ ...reset });
    toast.success('Categorias restauradas para o padrão oficial da planilha!');
  };

  // Transaction CRUD handlers
  const handleImportBankStatement = async (newTransactions: Partial<MovimentacaoRioJunior>[]) => {
    try {
      const created = await movimentacoesService.createBatchTransactions(newTransactions);
      toast.success(`${created.length} movimentações importadas e reconciliadas com sucesso!`);
      await loadData();
      await loadTransactions();
    } catch (err: any) {
      toast.error('Erro ao importar movimentações do extrato: ' + (err.message || 'Falha desconhecida'));
      throw err;
    }
  };


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

  const handleExportCSV = () => {
    movimentacoesService.exportCSV(transactions);
    toast.success('Download da planilha CSV iniciado!');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Carregando dados financeiros da RioJunior 2026...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Operações - Gestão Financeira</h2>
            <button
              onClick={() => setIsManageTaxonomyOpen(true)}
              className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Gerenciar categorias e subcategorias (adicionar, editar ou excluir)"
            >
              <Settings2 size={13} className="text-primary" />
              <span>Gerenciar Categorias</span>
            </button>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Exercício {selectedYear}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Classificações oficiais, análise de iniciativas, relatórios de caixa mínimo e fluxo de caixa consolidado.
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="inline-flex h-auto p-1 bg-muted/60 rounded-xl space-x-1 whitespace-nowrap">
            <TabsTrigger value="dashboard" className="flex items-center gap-1.5 text-xs font-bold py-2 px-3">
              <LayoutDashboard size={14} /> Visão Geral
            </TabsTrigger>

            <TabsTrigger value="extrato" className="flex items-center gap-1.5 text-xs font-bold py-2 px-3">
              <DollarSign size={14} /> 
              <span>Extrato</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/20 text-primary font-extrabold">
                {summary?.totalMovimentacoes?.toLocaleString('pt-BR') || 0}
              </span>
            </TabsTrigger>

            <TabsTrigger value="iniciativas" className="flex items-center gap-1.5 text-xs font-bold py-2 px-3">
              <Target size={14} /> Iniciativas & Eventos
            </TabsTrigger>

            <TabsTrigger value="caixaMinimo" className="flex items-center gap-1.5 text-xs font-bold py-2 px-3">
              <ShieldCheck size={14} /> Caixa Mínimo
            </TabsTrigger>

            <TabsTrigger value="bancario" className="flex items-center gap-1.5 text-xs font-bold py-2 px-3">
              <Building2 size={14} /> Visão Bancária
            </TabsTrigger>

            <TabsTrigger value="planoContas" className="flex items-center gap-1.5 text-xs font-bold py-2 px-3">
              <BookOpen size={14} /> Plano de Contas
            </TabsTrigger>

            <TabsTrigger value="dfc" className="flex items-center gap-1.5 text-xs font-bold py-2 px-3">
              <FileText size={14} /> DFC
            </TabsTrigger>

            <TabsTrigger value="projecao" className="flex items-center gap-1.5 text-xs font-bold py-2 px-3">
              <BarChart3 size={14} /> Projeção
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Dashboard & KPIs */}
        <TabsContent value="dashboard" className="space-y-6">
          <MovimentacoesDashboard
            summary={summary}
            analiseGeral={analiseGeral}
            recentTransactions={transactions}
            backendConnected={backendConnected}
            onOpenNewTx={() => {
              setTxToEdit(null);
              setIsTxModalOpen(true);
            }}
            onOpenTransfer={() => setIsTransferModalOpen(true)}
            onOpenImportStatement={() => setIsImportModalOpen(true)}
            onSyncExcel={() => {}}
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
            onOpenImportStatement={() => setIsImportModalOpen(true)}
          />
        </TabsContent>

        {/* Tab 3: Análise das Iniciativas */}
        <TabsContent value="iniciativas" className="space-y-6">
          <IniciativasView iniciativas={iniciativas} />
        </TabsContent>

        {/* Tab 4: Relatório de Caixa Mínimo */}
        <TabsContent value="caixaMinimo" className="space-y-6">
          <CaixaMinimoView months={caixaMinimo} />
        </TabsContent>

        {/* Tab 5: Visão Bancária */}
        <TabsContent value="bancario" className="space-y-6">
          <BankAccountsView data={bankData} />
        </TabsContent>

        {/* Tab 6: Plano de Contas */}
        <TabsContent value="planoContas" className="space-y-6">
          <PlanoContasView planoContas={planoContas} />
        </TabsContent>

        {/* Tab 7: DFC & Relatórios */}
        <TabsContent value="dfc" className="space-y-6">
          <DFCReportsView dfc={dfcData} summary={summary} />
        </TabsContent>

        {/* Tab 8: Projeção Financeira Original */}
        <TabsContent value="projecao" className="space-y-6">
          <FinancialProjectionChart />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <BankStatementImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportConfirmed={handleImportBankStatement}
        existingTransactions={movimentacoesService.getAllTransactions()}
        taxonomy={taxonomy}
        planoContas={planoContas}
      />

      <ManageTaxonomyModal
        isOpen={isManageTaxonomyOpen}
        onClose={() => setIsManageTaxonomyOpen(false)}
        taxonomy={taxonomy}
        onSaveTaxonomy={handleSaveTaxonomy}
        onResetTaxonomy={handleResetTaxonomy}
      />

      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setTxToEdit(null);
        }}
        onSave={handleSaveTransaction}
        transactionToEdit={txToEdit}
        taxonomy={taxonomy}
        onManageTaxonomy={() => setIsManageTaxonomyOpen(true)}
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
