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
  Settings2,
  HandCoins,
  MapPin,
  Users,
  Sparkles,
  Workflow,
  Wallet,
  CheckCircle2,
  Clock,
  Lock,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  PlanoContaItem,
} from '@/types';

import { movimentacoesService } from '@/services/movimentacoesService';
import { membrosCartoesService } from '@/services/membrosCartoesService';
import { processoSeletivoService } from '@/services/processoSeletivoService';
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
import AnuidadesSection from '@/components/operations/AnuidadesSection';
import VisitasGuardioesSection from '@/components/shared/VisitasGuardioesSection';
import GestaoTimeOverviewTab from '@/components/operations/GestaoTimeOverviewTab';
import ProcessoSeletivoTab from '@/components/operations/ProcessoSeletivoTab';
import { useAuth } from '@/hooks/useAuth';
import { DirectorateAccessGuard } from '@/components/DirectorateAccessGuard';

interface OperationsViewProps {
  selectedYear: number;
}

type MacroPillarType = 'time' | 'processoSeletivo' | 'financeiro' | 'processos';

const OperationsView = ({ selectedYear }: OperationsViewProps) => {
  const { canEditOP, canViewGestaoTimeOP } = useAuth();

  // Macro-Pilar ativo no Nível 1 (Gente/Time restrito aos ADMs; demais abas acessíveis a todo o time)
  const [activeMacroPillar, setActiveMacroPillar] = useState<MacroPillarType>(() =>
    canViewGestaoTimeOP ? 'time' : 'processoSeletivo'
  );
  // Sub-aba ativa dentro do Pilar Financeiro
  const [activeFinanceSubTab, setActiveFinanceSubTab] = useState<string>('dashboard');
  // Sub-aba ativa dentro do Pilar de Processos
  const [activeProcessSubTab, setActiveProcessSubTab] = useState<string>('visitas');

  useEffect(() => {
    if (!canViewGestaoTimeOP && activeMacroPillar === 'time') {
      setActiveMacroPillar('processoSeletivo');
    }
  }, [canViewGestaoTimeOP, activeMacroPillar]);

  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);

  // Contadores rápidos para os cards dos 4 Macro-Pilares
  const [membrosCount, setMembrosCount] = useState(
    () => membrosCartoesService.getMembros().filter((m) => m.status !== 'desligado').length
  );
  const [candidatosCount, setCandidatosCount] = useState(
    () => processoSeletivoService.getState().candidatos.length
  );

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
    categoriaCaixaMinimo: 'ALL',
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
        movimentacoesService.getDFCReport(),
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
        sortOrder: 'desc',
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

  useEffect(() => {
    const refresh = () => {
      loadData();
      loadTransactions();
    };
    window.addEventListener('rio-finance-updated', refresh);
    const unsubMembros = membrosCartoesService.subscribe(() => {
      setMembrosCount(
        membrosCartoesService.getMembros().filter((m) => m.status !== 'desligado').length
      );
    });
    const unsubPS = processoSeletivoService.subscribe(() => {
      setCandidatosCount(processoSeletivoService.getState().candidatos.length);
    });
    return () => {
      window.removeEventListener('rio-finance-updated', refresh);
      unsubMembros();
      unsubPS();
    };
  }, [loadData, loadTransactions]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
      categoriaCaixaMinimo: 'ALL',
    });
    setPage(1);
  };

  const handleSelectAccountFilter = (acc: string) => {
    setFilters((prev) => ({ ...prev, conta: acc }));
    setActiveMacroPillar('financeiro');
    setActiveFinanceSubTab('extrato');
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
      toast.error(
        'Erro ao importar movimentações do extrato: ' + (err.message || 'Falha desconhecida')
      );
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
      documento: '',
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
      toast.success(
        `Transferência de ${transferData.contaOrigem} para ${transferData.contaDestino} realizada com sucesso!`
      );
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
        <p className="text-sm font-medium text-muted-foreground">
          Carregando Painel de Operações (Gente, Processo Seletivo, Finanças & Processos)...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              Diretoria de Operações (OP)
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Exercício {selectedYear}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight mt-1">
            Painel Estratégico de Operações — Gente, Cultura, Processos & Finanças
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Navegue abaixo pelos 4 Macro-Pilares da Guilda de Operações: Gestão Incisiva de Time, Processo Seletivo Gamificado, Gestão Financeira Consolidada e Processos da Rede.
          </p>
        </div>

        {activeMacroPillar === 'financeiro' && canEditOP && (
          <button
            onClick={() => setIsManageTaxonomyOpen(true)}
            className="px-3 py-2 rounded-xl border border-border bg-secondary hover:bg-muted text-foreground font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
            title="Gerenciar categorias e subcategorias financeiras"
          >
            <Settings2 size={14} className="text-primary" />
            <span>Gerenciar Categorias</span>
          </button>
        )}
      </div>

      {/* ================================================================= */}
      {/* NÍVEL 1: OS 4 MACRO-PILARES DE OPERAÇÕES (SEM ROLAGEM EXCESSIVA)  */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Pilar 1: Gestão de Time & Cultura (Restrito aos ADMs por hora) */}
        <button
          type="button"
          onClick={() => {
            if (!canViewGestaoTimeOP) {
              toast.error(
                'A seção de Gestão de Time e Jornada em Operações está restrita aos Administradores (ADMs) por hora.'
              );
              return;
            }
            setActiveMacroPillar('time');
          }}
          className={`text-left p-4 rounded-2xl border transition-all space-y-2 ${
            !canViewGestaoTimeOP
              ? 'border-border bg-muted/40 opacity-60 cursor-not-allowed'
              : activeMacroPillar === 'time'
              ? 'border-2 border-cyan-500 bg-cyan-500/5 shadow-sm'
              : 'border-border bg-card hover:border-cyan-500/40 opacity-85 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              Pilar 1 • Gente & Cultura
            </span>
            {canViewGestaoTimeOP ? (
              <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                {membrosCount} ativos
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Lock size={10} /> Restrito ADMs
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-cyan-500 shrink-0" />
            <h3 className="text-sm font-extrabold text-foreground">Gestão de Time & Jornada</h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {canViewGestaoTimeOP
              ? 'Termômetro das 6 Guildas, retenção, alocação das 26 frentes e sistema de cartões.'
              : 'Acesso restrito aos Administradores (ADMs) por hora.'}
          </p>
        </button>

        {/* Pilar 2: Processo Seletivo & Aditivo Gamificado */}
        <button
          type="button"
          onClick={() => setActiveMacroPillar('processoSeletivo')}
          className={`text-left p-4 rounded-2xl border transition-all space-y-2 ${
            activeMacroPillar === 'processoSeletivo'
              ? 'border-2 border-purple-500 bg-purple-500/5 shadow-sm'
              : 'border-border bg-card hover:border-purple-500/40 opacity-85 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400">
              Pilar 2 • Atração & PS
            </span>
            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
              {candidatosCount} candidatos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-purple-500 shrink-0" />
            <h3 className="text-sm font-extrabold text-foreground">Processo Seletivo & Aditivo</h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            Desafio Coletivo, Individual, Entrevistas, Entregas Aditivo e Portal do Candidato Externo.
          </p>
        </button>

        {/* Pilar 3: Gestão Financeira Consolidada */}
        <button
          type="button"
          onClick={() => setActiveMacroPillar('financeiro')}
          className={`text-left p-4 rounded-2xl border transition-all space-y-2 ${
            activeMacroPillar === 'financeiro'
              ? 'border-2 border-emerald-500 bg-emerald-500/5 shadow-sm'
              : 'border-border bg-card hover:border-emerald-500/40 opacity-85 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              Pilar 3 • 9 Sub-repartições
            </span>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              {summary?.totalMovimentacoes?.toLocaleString('pt-BR') || 0} lanç.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-emerald-500 shrink-0" />
            <h3 className="text-sm font-extrabold text-foreground">Finanças & Alocação</h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            Visão Geral, Extrato, Iniciativas, Caixa Mínimo, Bancário, Plano de Contas, DFC e Anuidades.
          </p>
        </button>

        {/* Pilar 4: Processos, Rotinas & Visitas */}
        <button
          type="button"
          onClick={() => setActiveMacroPillar('processos')}
          className={`text-left p-4 rounded-2xl border transition-all space-y-2 ${
            activeMacroPillar === 'processos'
              ? 'border-2 border-amber-500 bg-amber-500/5 shadow-sm'
              : 'border-border bg-card hover:border-amber-500/40 opacity-85 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
              Pilar 4 • Rotinas & Rede
            </span>
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
              6 Guildas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Workflow size={18} className="text-amber-500 shrink-0" />
            <h3 className="text-sm font-extrabold text-foreground">Processos, Ritos & Visitas</h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            Visitas dos Guardiões, cadência de reuniões (RVs), SLAs entre áreas e governança.
          </p>
        </button>
      </div>

      {/* ================================================================= */}
      {/* CONTEÚDO DO PILAR 1: GESTÃO DE TIME & CULTURA (RESTRITO A ADMs)   */}
      {/* ================================================================= */}
      {activeMacroPillar === 'time' && canViewGestaoTimeOP && (
        <GestaoTimeOverviewTab
          onNavigateToPS={() => setActiveMacroPillar('processoSeletivo')}
        />
      )}

      {/* ================================================================= */}
      {/* PILARES 2, 3 E 4: ACESSÍVEIS AO TIME, EDITÁVEIS PELO TIME DE OP   */}
      {/* ================================================================= */}
      {activeMacroPillar !== 'time' && (
        <DirectorateAccessGuard
          canEdit={canEditOP}
          directorateName="Diretoria de Operações (OP)"
          directorateShort="OP"
        >
          {/* CONTEÚDO DO PILAR 2: PROCESSO SELETIVO & ADITIVO */}
          {activeMacroPillar === 'processoSeletivo' && <ProcessoSeletivoTab />}

          {/* CONTEÚDO DO PILAR 3: GESTÃO FINANCEIRA CONSOLIDADA (9 SUB-ABAS) */}
          {activeMacroPillar === 'financeiro' && (
            <div className="space-y-6">
              <Tabs
                value={activeFinanceSubTab}
                onValueChange={setActiveFinanceSubTab}
                className="space-y-6"
              >
                <div className="bg-card border border-border rounded-2xl p-3 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Repartições do Pilar Financeiro
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Selecione o demonstrativo ou ferramenta financeira abaixo
                    </span>
                  </div>
                  <div className="overflow-x-auto pb-1">
                    <TabsList className="inline-flex h-auto p-1 bg-muted/60 rounded-xl space-x-1 whitespace-nowrap">
                      <TabsTrigger
                        value="dashboard"
                        className="flex items-center gap-1.5 text-xs font-bold py-2 px-3"
                      >
                        <LayoutDashboard size={14} /> Visão Geral
                      </TabsTrigger>

                      <TabsTrigger
                        value="extrato"
                        className="flex items-center gap-1.5 text-xs font-bold py-2 px-3"
                      >
                        <DollarSign size={14} />
                        <span>Extrato</span>
                        <span className="text-xs px-1.5 py-0.2 rounded-full bg-primary/20 text-primary font-extrabold">
                          {summary?.totalMovimentacoes?.toLocaleString('pt-BR') || 0}
                        </span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="iniciativas"
                        className="flex items-center gap-1.5 text-xs font-bold py-2 px-3"
                      >
                        <Target size={14} /> Iniciativas & Eventos
                      </TabsTrigger>

                      <TabsTrigger
                        value="caixaMinimo"
                        className="flex items-center gap-1.5 text-xs font-bold py-2 px-3"
                      >
                        <ShieldCheck size={14} /> Caixa Mínimo
                      </TabsTrigger>

                      <TabsTrigger
                        value="bancario"
                        className="flex items-center gap-1.5 text-xs font-bold py-2 px-3"
                      >
                        <Building2 size={14} /> Visão Bancária
                      </TabsTrigger>

                      <TabsTrigger
                        value="planoContas"
                        className="flex items-center gap-1.5 text-xs font-bold py-2 px-3"
                      >
                        <BookOpen size={14} /> Plano de Contas
                      </TabsTrigger>

                      <TabsTrigger
                        value="dfc"
                        className="flex items-center gap-1.5 text-xs font-bold py-2 px-3"
                      >
                        <FileText size={14} /> DFC
                      </TabsTrigger>

                      <TabsTrigger
                        value="projecao"
                        className="flex items-center gap-1.5 text-xs font-bold py-2 px-3"
                      >
                        <BarChart3 size={14} /> Projeção
                      </TabsTrigger>

                      <TabsTrigger
                        value="anuidades"
                        className="flex items-center gap-1.5 text-xs font-bold py-2 px-3"
                      >
                        <HandCoins size={14} /> Anuidades
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

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
                    onViewAllTx={() => setActiveFinanceSubTab('extrato')}
                  />
                </TabsContent>

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
                    onViewDetails={(tx) => {
                      setSelectedTx(tx);
                      setIsDetailsModalOpen(true);
                    }}
                    onEdit={(tx) => {
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

                <TabsContent value="iniciativas" className="space-y-6">
                  <IniciativasView iniciativas={iniciativas} />
                </TabsContent>

                <TabsContent value="caixaMinimo" className="space-y-6">
                  <CaixaMinimoView months={caixaMinimo} />
                </TabsContent>

                <TabsContent value="bancario" className="space-y-6">
                  <BankAccountsView data={bankData} />
                </TabsContent>

                <TabsContent value="planoContas" className="space-y-6">
                  <PlanoContasView planoContas={planoContas} />
                </TabsContent>

                <TabsContent value="dfc" className="space-y-6">
                  <DFCReportsView dfc={dfcData} summary={summary} />
                </TabsContent>

                <TabsContent value="projecao" className="space-y-6">
                  <FinancialProjectionChart selectedYear={selectedYear} />
                </TabsContent>

                <TabsContent value="anuidades" className="space-y-6">
                  <AnuidadesSection selectedYear={selectedYear} />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* CONTEÚDO DO PILAR 4: PROCESSOS, ROTINAS & VISITAS */}
          {activeMacroPillar === 'processos' && (
            <div className="space-y-6">
              <Tabs
                value={activeProcessSubTab}
                onValueChange={setActiveProcessSubTab}
                className="space-y-5"
              >
                <TabsList className="inline-flex h-auto p-1 bg-muted/60 rounded-xl space-x-1">
                  <TabsTrigger value="visitas" className="text-xs font-bold py-2 px-3.5 gap-1.5">
                    <MapPin size={14} /> Visitas dos Guardiões (OP & DDR)
                  </TabsTrigger>
                  <TabsTrigger value="cadencia" className="text-xs font-bold py-2 px-3.5 gap-1.5">
                    <Workflow size={14} /> Cadência de Ritos & Processos das Guildas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="visitas" className="space-y-6">
                  <VisitasGuardioesSection selectedYear={selectedYear} modo="op" />
                </TabsContent>

                <TabsContent value="cadencia" className="space-y-4">
                  <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
                    <div>
                      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold">
                        Gestão de Processos Internos (OP)
                      </Badge>
                      <h3 className="text-lg font-extrabold text-foreground mt-1">
                        Governança de Ritos Semanais, Ferramentas & SLAs entre Guildas
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Acompanhamento de rotinas operacionais da Federação para potencializar a produtividade de PRESEX, VPNEG, DDR, FE, OP e PRESCON.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm">📅 Reuniões de Guilda (RVs)</span>
                          <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                            100% em dia
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Pautas e atas registradas semanalmente pelas 6 Guildas com controle de presença integrado ao sistema de cartões.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm">🤝 Rito Geral (RG Mensal)</span>
                          <Badge className="bg-cyan-500/15 text-cyan-600 border-cyan-500/30">
                            Todo 1º Sábado
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Alinhamento estratégico de resultados da rede, prestação de contas e momentos de cultura do Time RioJunior.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm">🛠️ Ecossistema Digital RJ</span>
                          <Badge className="bg-purple-500/15 text-purple-600 border-purple-500/30">
                            Ativo
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Gestão de contas institucionais (@riojunior.com.br), CRM de Parcerias, Portal COEJ e Painel Estratégico.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DirectorateAccessGuard>
      )}

      {/* Modals Financeiros */}
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
        onEdit={(tx) => {
          setTxToEdit(tx);
          setIsTxModalOpen(true);
        }}
      />
    </div>
  );
};

export default OperationsView;
