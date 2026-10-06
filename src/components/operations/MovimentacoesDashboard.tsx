import { FinancialSummaryRioJunior, MovimentacaoRioJunior, AnaliseGeralData } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Scale, 
  Building2, 
  Plus, 
  ArrowRightLeft,
  UploadCloud, 
  RefreshCw, 
  Download,
  Sparkles,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Clock,
  Layers,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface MovimentacoesDashboardProps {
  summary: FinancialSummaryRioJunior | null;
  analiseGeral: AnaliseGeralData | null;
  recentTransactions: MovimentacaoRioJunior[];
  backendConnected: boolean;
  onOpenNewTx: () => void;
  onOpenTransfer: () => void;
  onOpenImportStatement?: () => void;
  onSyncExcel: () => void;
  onExportCSV: () => void;
  onSelectAccountFilter: (acc: string) => void;
  onViewAllTx: () => void;
}

const BANK_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  'Cora': { bg: 'bg-pink-500/10 dark:bg-pink-500/15', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-500/30', badge: 'bg-pink-600 text-white' },
  'Asaas': { bg: 'bg-blue-500/10 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30', badge: 'bg-blue-600 text-white' },
  'PagBank': { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30', badge: 'bg-emerald-600 text-white' },
  'Banco do Brasil': { bg: 'bg-amber-500/10 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30', badge: 'bg-amber-500 text-slate-900 font-bold' },
  'Bradesco': { bg: 'bg-red-500/10 dark:bg-red-500/15', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/30', badge: 'bg-red-600 text-white' },
};

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

export const MovimentacoesDashboard = ({
  summary,
  analiseGeral,
  recentTransactions,
  backendConnected,
  onOpenNewTx,
  onOpenTransfer,
  onOpenImportStatement,
  onSyncExcel,
  onExportCSV,
  onSelectAccountFilter,
  onViewAllTx
}: MovimentacoesDashboardProps) => {
  if (!summary) return null;

  const costCenterData = Object.entries(summary.costCenters || {}).map(([name, value]) => ({
    name,
    value: Math.round(value)
  })).sort((a, b) => b.value - a.value);

  const bankOrder = ['PagBank', 'Cora', 'Asaas', 'Banco do Brasil', 'Bradesco'];

  const monthlyChartData = analiseGeral?.fluxoCaixaResumido?.map((m, idx) => ({
    mesNome: m.mes,
    receitas: m.entradas,
    despesas: m.saidas,
    saldo: m.saldo
  })) || summary.monthly;

  const saldoConsolidado = analiseGeral?.saldoAtualConsolidado || summary.saldoAtualConsolidado;
  const rioJuniorLivre = analiseGeral?.caixaSeparado?.rioJunior || (saldoConsolidado * 0.676);
  const efejSeparado = analiseGeral?.caixaSeparado?.efej || (saldoConsolidado * 0.324);

  const sustentabilidade = analiseGeral?.indicadoresExecutivos?.sustentabilidade || {
    coberturaDespesasOperacionais: 1.77,
    reservaOperacionalMeses: 8,
    runwayMeses: 4,
    margemOperacional: 0.2521
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-bold text-foreground">Visão Geral & Análise Financeira</h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Base Atualizada até Outubro 2026 ({summary.totalMovimentacoes} lançamentos)
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Critérios e classificações oficiais das planilhas de Análise Financeira e Movimentações da RioJunior.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={onOpenNewTx}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow"
          >
            <Plus size={16} />
            <span>Nova Movimentação</span>
          </button>

          {onOpenImportStatement && (
            <button
              onClick={onOpenImportStatement}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow"
              title="Importar extrato bancário (OFX, Excel ou CSV) com reconciliação inteligente"
            >
              <UploadCloud size={15} />
              <span>Importar Extrato</span>
            </button>
          )}

          <button
            onClick={onOpenTransfer}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-foreground font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <ArrowRightLeft size={15} />
            <span>Transferência</span>
          </button>

          {backendConnected && (
            <button
              onClick={onSyncExcel}
              title="Gravar atualizações diretamente no arquivo Excel oficial"
              className="px-3.5 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <RefreshCw size={15} />
              <span>Gravar no Excel</span>
            </button>
          )}

          <button
            onClick={onExportCSV}
            title="Baixar planilha CSV das movimentações"
            className="px-3.5 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-foreground font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Saldo Atual Consolidado */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saldo Atual em Caixa</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Wallet size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight">
              {formatCurrency(saldoConsolidado)}
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <span>+102,3% vs Inicial (R$ 56.868)</span>
            </p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
        </div>

        {/* Saldo Inicial Consolidado */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between group hover:border-border/80 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saldo Inicial (01/01)</span>
            <div className="p-2 rounded-xl bg-muted text-muted-foreground">
              <Scale size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight">
              {formatCurrency(summary.saldoInicialTotal)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Base de abertura do exercício 2026
            </p>
          </div>
        </div>

        {/* Receitas Totais */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Receitas Acumuladas</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              +{formatCurrency(summary.totalReceitas)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Média mensal: R$ 33.313,74
            </p>
          </div>
        </div>

        {/* Despesas Totais */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between group hover:border-destructive/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Despesas Acumuladas</span>
            <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
              <ArrowDownRight size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-destructive tracking-tight">
              -{formatCurrency(summary.totalDespesas)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Média mensal: R$ 24.913,71
            </p>
          </div>
        </div>

        {/* Resultado Operacional */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resultado Operacional</span>
            <div className={`p-2 rounded-xl ${summary.resultadoLiquido >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <div className={`text-2xl font-extrabold tracking-tight ${summary.resultadoLiquido >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
              {summary.resultadoLiquido >= 0 ? '+ ' : ''}{formatCurrency(summary.resultadoLiquido)}
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              Superávit com margem de 25,2%
            </p>
          </div>
        </div>
      </div>

      {/* Caixa Separado & Sustentabilidade Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Caixa Separado (RioJunior vs EFEJ) */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck size={17} className="text-primary" />
                Caixa Separado & Destinação
              </h4>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Oficial Planilha</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Divisão entre o caixa livre da federação e os recursos vinculados ao evento EFEJ 2026.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">Caixa RioJunior (Livre)</span>
                  <span className="text-[11px] text-muted-foreground">Disponível para operações</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-foreground">{formatCurrency(rioJuniorLivre)}</div>
                  <span className="text-[10px] font-semibold text-primary">67,6% do total</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">Provisão EFEJ 2026</span>
                  <span className="text-[11px] text-muted-foreground">Recursos guardados do evento</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{formatCurrency(efejSeparado)}</div>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">32,4% do total</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Total em Caixa:</span>
            <span className="font-extrabold text-foreground">{formatCurrency(saldoConsolidado)}</span>
          </div>
        </div>

        {/* Indicadores de Sustentabilidade & Eficiência */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Clock size={17} className="text-emerald-500" />
                Indicadores de Sustentabilidade & Eficiência
              </h4>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Saúde Financeira Forte
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Métricas oficiais calculadas na aba Análise Geral da planilha.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                  Reserva Operacional
                </span>
                <div className="text-2xl font-black text-foreground">
                  {sustentabilidade.reservaOperacionalMeses} meses
                </div>
                <span className="text-[10px] text-muted-foreground">de despesas em caixa</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                  Runway Estimado
                </span>
                <div className="text-2xl font-black text-foreground">
                  {sustentabilidade.runwayMeses} meses
                </div>
                <span className="text-[10px] text-muted-foreground">sem novas receitas</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                  Cobertura Op.
                </span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {sustentabilidade.coberturaDespesasOperacionais.toFixed(2)}x
                </div>
                <span className="text-[10px] text-muted-foreground">receitas vs custos op.</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                  Margem Líquida
                </span>
                <div className="text-2xl font-black text-primary">
                  {(sustentabilidade.margemOperacional * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-muted-foreground">margem do exercício</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-border text-xs">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-muted-foreground">Despesas Op. Totais:</span>
              <span className="font-bold text-foreground">R$ 78.718,04</span>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-muted-foreground">Média Mensal Op.:</span>
              <span className="font-bold text-foreground">R$ 8.746,45</span>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-muted-foreground">Receitas Recorrentes:</span>
              <span className="font-bold text-primary">46,5% do total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Account Balances Strip */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Building2 size={15} /> Saldos Atualizados por Conta Bancária
          </h4>
          <span className="text-xs text-muted-foreground">Clique para filtrar o extrato por banco</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {bankOrder.map(accName => {
            const saldoVal = analiseGeral?.saldosContas?.[accName] !== undefined 
              ? analiseGeral.saldosContas[accName] 
              : summary.accounts?.[accName]?.saldoAtual || 0;

            const style = BANK_COLORS[accName] || { bg: 'bg-muted', text: 'text-foreground', border: 'border-border', badge: 'bg-muted text-foreground' };

            return (
              <button
                key={accName}
                onClick={() => onSelectAccountFilter(accName)}
                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] hover:shadow-md bg-card ${style.border} group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${style.badge}`}>
                    {accName}
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">Saldo</span>
                </div>
                <div className={`text-lg font-bold ${style.text}`}>
                  {formatCurrency(saldoVal)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-foreground">Fluxo de Caixa Mensal (Jan a Outubro 2026)</h4>
              <p className="text-xs text-muted-foreground">Comparativo de entradas vs saídas e saldo acumulado mês a mês</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <XAxis 
                  dataKey="mesNome" 
                  tickFormatter={v => v.substring(0, 3)} 
                  stroke="#888888" 
                  fontSize={11} 
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={11} 
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  formatter={(val: any) => [formatCurrency(Number(val)), '']} 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="receitas" name="Entradas" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesas" name="Saídas" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Centers Donut */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="mb-2">
            <h4 className="text-base font-bold text-foreground">Despesas por Centro de Custo</h4>
            <p className="text-xs text-muted-foreground">Execução orçamentária por Diretoria</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costCenterData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {costCenterData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [formatCurrency(Number(val)), '']}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin text-xs">
            {costCenterData.map((cc, i) => (
              <div key={cc.name} className="flex items-center justify-between py-1 border-b border-border/40 last:border-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-foreground truncate max-w-[140px]">{cc.name}</span>
                </div>
                <span className="font-semibold text-foreground">{formatCurrency(cc.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Categories & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Categories */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <h4 className="text-base font-bold text-foreground mb-1">Maiores Categorias de Custo</h4>
          <p className="text-xs text-muted-foreground mb-4">Classificação por categorias de Caixa Mínimo e Plano de Contas</p>
          <div className="space-y-3">
            {summary.topCategories.slice(0, 6).map((cat, i) => {
              const maxVal = summary.topCategories[0]?.value || 1;
              const percent = Math.round((cat.value / maxVal) * 100);

              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground truncate max-w-[180px]">{cat.name}</span>
                    <span className="font-bold text-foreground">{formatCurrency(cat.value)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-base font-bold text-foreground">Últimos Lançamentos</h4>
              <p className="text-xs text-muted-foreground">Registros mais recentes do fluxo de caixa</p>
            </div>
            <button
              onClick={onViewAllTx}
              className="text-xs font-bold text-primary hover:underline"
            >
              Ver Extrato Completo ({summary.totalMovimentacoes})
            </button>
          </div>

          <div className="divide-y divide-border/60 overflow-hidden">
            {recentTransactions.slice(0, 5).map(t => (
              <div key={t.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`p-2 rounded-xl shrink-0 ${t.tipo === 'Receita' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                    {t.tipo === 'Receita' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-foreground truncate">{t.descricao || 'Sem descrição'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{t.dataEfetiva}</span>
                      <span>•</span>
                      <span className="font-medium text-primary">{t.conta}</span>
                      {t.contato && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[130px]">{t.contato}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`font-bold ${t.tipo === 'Receita' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                    {t.tipo === 'Receita' ? '+' : '-'}{formatCurrency(t.valorEfetivo)}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{t.categoria}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
