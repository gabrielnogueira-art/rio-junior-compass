import { DFCReport, FinancialSummaryRioJunior } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { FileText, ArrowUpRight, ArrowDownRight, PieChart, Layers } from 'lucide-react';

interface DFCReportsViewProps {
  dfc: DFCReport | null;
  summary: FinancialSummaryRioJunior | null;
}

export const DFCReportsView = ({ dfc, summary }: DFCReportsViewProps) => {
  if (!dfc || !summary) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          Demonstrativos Financeiros & DFC
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Demonstrativo do Fluxo de Caixa por categorias analíticas e distribuição por centros de custo da RioJunior 2026.
        </p>
      </div>

      {/* DFC Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Total de Entradas Operacionais
          </span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(dfc.totalEntradas)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">100% da receita realizada</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Total de Despesas Operacionais
          </span>
          <div className="text-2xl font-bold text-destructive">
            -{formatCurrency(dfc.totalDespesas)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">100% dos desembolsos realizados</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Resultado Líquido do DFC
          </span>
          <div className={`text-2xl font-bold ${dfc.resultadoOperacional >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
            {dfc.resultadoOperacional >= 0 ? '+ ' : ''}{formatCurrency(dfc.resultadoOperacional)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Geração de caixa no exercício</p>
        </div>
      </div>

      {/* DFC Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entradas por Categoria */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-border bg-emerald-500/5 flex items-center justify-between">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <ArrowUpRight size={17} className="text-emerald-600 dark:text-emerald-400" />
              Entradas de Caixa por Categoria
            </h4>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(dfc.totalEntradas)}
            </span>
          </div>

          <div className="p-5 space-y-3.5">
            {dfc.entradas.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">Nenhuma receita registrada.</p>
            ) : (
              dfc.entradas.map(item => (
                <div key={item.categoria} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{item.categoria}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{formatCurrency(item.total)}</span>
                      <span className="text-muted-foreground w-12 text-right">({item.percent.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(item.percent, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Despesas por Categoria */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-border bg-destructive/5 flex items-center justify-between">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <ArrowDownRight size={17} className="text-destructive" />
              Despesas e Desembolsos por Categoria
            </h4>
            <span className="text-xs font-bold text-destructive">
              -{formatCurrency(dfc.totalDespesas)}
            </span>
          </div>

          <div className="p-5 space-y-3.5">
            {dfc.despesas.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">Nenhuma despesa registrada.</p>
            ) : (
              dfc.despesas.map(item => (
                <div key={item.categoria} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{item.categoria}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{formatCurrency(item.total)}</span>
                      <span className="text-muted-foreground w-12 text-right">({item.percent.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-destructive h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(item.percent, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Relatório por Centros de Custo */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Layers size={17} className="text-primary" />
            Execução de Despesas por Centro de Custo (Diretorias)
          </h4>
          <span className="text-xs text-muted-foreground">Ano base 2026</span>
        </div>

        <div className="p-5 space-y-3">
          {Object.entries(summary.costCenters)
            .sort((a, b) => b[1] - a[1])
            .map(([cc, val]) => {
              const maxVal = summary.totalDespesas || 1;
              const percent = ((val / maxVal) * 100).toFixed(1);

              return (
                <div key={cc} className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <div>
                      <span className="font-bold text-foreground text-sm">{cc}</span>
                      <span className="text-muted-foreground ml-2">({percent}% do total de despesas)</span>
                    </div>
                  </div>
                  <div className="font-extrabold text-foreground text-sm self-end sm:self-auto">
                    {formatCurrency(val)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
