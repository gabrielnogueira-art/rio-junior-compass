import { useState } from 'react';
import { CaixaMinimoMonth } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { ShieldCheck, Calendar, ArrowUpRight, ArrowDownRight, User, CheckCircle2, ChevronRight } from 'lucide-react';

interface CaixaMinimoViewProps {
  months: CaixaMinimoMonth[];
}

export const CaixaMinimoView = ({ months }: CaixaMinimoViewProps) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(months.length > 9 ? 9 : months.length - 1); // Default to October if available

  const currentMonth = months[selectedMonthIndex] || months[0];

  if (!currentMonth) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary" />
              Relatório Oficial de Caixa Mínimo
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Diretoria de Operações & Presidência
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Demonstrativo analítico de entradas e saídas categorizadas segundo os critérios de Caixa Mínimo da RioJunior 2026.
          </p>
        </div>

        {/* Month Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border overflow-x-auto max-w-full">
          {months.slice(0, 10).map((m, idx) => (
            <button
              key={m.mesNum}
              onClick={() => setSelectedMonthIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedMonthIndex === idx
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.mesNome}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Month Summary Card */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mês Selecionado</span>
            <h4 className="text-2xl font-extrabold text-foreground">{currentMonth.mesNome} de 2026</h4>
          </div>
          <div className="flex items-center gap-3 text-xs bg-muted/40 px-3.5 py-2 rounded-xl border border-border">
            <User size={15} className="text-primary" />
            <div>
              <span className="text-muted-foreground block text-[10px]">Responsável pelo Fechamento</span>
              <span className="font-bold text-foreground">{currentMonth.responsavel} ({currentMonth.cargo})</span>
            </div>
          </div>
        </div>

        {/* Balances Trio */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-muted/20 border border-border">
            <span className="text-xs text-muted-foreground block font-semibold mb-1">Saldo de Abertura</span>
            <div className="text-xl font-bold text-foreground">{formatCurrency(currentMonth.saldoInicial)}</div>
          </div>

          <div className="p-4 rounded-xl bg-muted/20 border border-border">
            <span className="text-xs text-muted-foreground block font-semibold mb-1">Resultado Líquido do Mês</span>
            <div className={`text-xl font-extrabold ${currentMonth.resultado >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
              {currentMonth.resultado >= 0 ? '+ ' : ''}{formatCurrency(currentMonth.resultado)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
            <span className="text-xs text-primary block font-semibold mb-1">Saldo de Fechamento</span>
            <div className="text-xl font-extrabold text-primary">{formatCurrency(currentMonth.saldoFinal)}</div>
          </div>
        </div>
      </div>

      {/* Categories Breakdown (Entradas vs Saídas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entradas por Categoria Caixa Mínimo */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-border bg-emerald-500/5 flex items-center justify-between">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <ArrowUpRight size={17} className="text-emerald-600 dark:text-emerald-400" />
              Receitas / Entradas por Categoria
            </h4>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(currentMonth.entradas.total)}
            </span>
          </div>

          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/50 text-xs">
              <span className="font-medium text-foreground">Anuidade</span>
              <span className="font-bold text-foreground">{formatCurrency(currentMonth.entradas.anuidade)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50 text-xs">
              <span className="font-medium text-foreground">Venda de Produto (Lojinha)</span>
              <span className="font-bold text-foreground">{formatCurrency(currentMonth.entradas.vendaProduto)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50 text-xs">
              <span className="font-medium text-foreground">Parcerias & Patrocínios</span>
              <span className="font-bold text-foreground">{formatCurrency(currentMonth.entradas.parceriasPatrocinios)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50 text-xs">
              <span className="font-medium text-foreground">Eventos (Ingressos)</span>
              <span className="font-bold text-foreground">{formatCurrency(currentMonth.entradas.eventos)}</span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="font-medium text-foreground">Outras Receitas (Rendimentos, etc.)</span>
              <span className="font-bold text-foreground">{formatCurrency(currentMonth.entradas.outrasReceitas)}</span>
            </div>
          </div>
        </div>

        {/* Saídas por Categoria Caixa Mínimo */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-border bg-destructive/5 flex items-center justify-between">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <ArrowDownRight size={17} className="text-destructive" />
              Despesas / Saídas por Categoria
            </h4>
            <span className="text-sm font-extrabold text-destructive">
              -{formatCurrency(currentMonth.saidas.total)}
            </span>
          </div>

          <div className="p-5 space-y-2.5">
            <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-xs">
              <span className="font-medium text-foreground">Taxas e impostos</span>
              <span className="font-bold text-destructive">-{formatCurrency(currentMonth.saidas.taxasImpostos)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-xs">
              <span className="font-medium text-foreground">Custos dos produtos (Lojinha)</span>
              <span className="font-bold text-destructive">-{formatCurrency(currentMonth.saidas.custoProdutos)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-xs">
              <span className="font-medium text-foreground">Custo Evento</span>
              <span className="font-bold text-destructive">-{formatCurrency(currentMonth.saidas.custoEvento)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-xs">
              <span className="font-medium text-foreground">Investimento na organização</span>
              <span className="font-bold text-destructive">-{formatCurrency(currentMonth.saidas.investimentoOrganizacao)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-xs">
              <span className="font-medium text-foreground">Investimento no membro</span>
              <span className="font-bold text-destructive">-{formatCurrency(currentMonth.saidas.investimentoMembro)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-xs">
              <span className="font-medium text-foreground">Investimento na rede</span>
              <span className="font-bold text-destructive">-{formatCurrency(currentMonth.saidas.investimentoRede)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 text-xs">
              <span className="font-medium text-foreground">Outras Despesas</span>
              <span className="font-bold text-destructive">-{formatCurrency(currentMonth.saidas.outrasDespesas)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Months Matrix View */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
          <h4 className="font-bold text-sm text-foreground">Histórico Anual de Caixa Mínimo (2026)</h4>
          <span className="text-xs text-muted-foreground">Janeiro a Outubro</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Mês</th>
                <th className="py-3 px-4 text-right">Saldo Inicial</th>
                <th className="py-3 px-4 text-right">Entradas</th>
                <th className="py-3 px-4 text-right">Saídas</th>
                <th className="py-3 px-4 text-right">Resultado</th>
                <th className="py-3 px-4 text-right">Saldo Final</th>
                <th className="py-3 px-4">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {months.slice(0, 10).map((m, idx) => (
                <tr 
                  key={m.mesNum}
                  onClick={() => setSelectedMonthIndex(idx)}
                  className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                    selectedMonthIndex === idx ? 'bg-primary/5 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-foreground flex items-center gap-1.5">
                    {selectedMonthIndex === idx && <ChevronRight size={13} className="text-primary" />}
                    <span>{m.mesNome}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground font-medium">
                    {formatCurrency(m.saldoInicial)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(m.entradas.total)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-destructive">
                    -{formatCurrency(m.saidas.total)}
                  </td>
                  <td className={`py-3 px-4 text-right font-extrabold ${m.resultado >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                    {m.resultado !== 0 ? (m.resultado >= 0 ? '+ ' : '') + formatCurrency(m.resultado) : 'R$ 0,00'}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-foreground">
                    {formatCurrency(m.saldoFinal)}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-[11px]">
                    {m.responsavel || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
