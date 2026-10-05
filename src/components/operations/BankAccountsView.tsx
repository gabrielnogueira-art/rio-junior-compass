import { useState } from 'react';
import { BankAccountsViewData, MonthBankData } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Building2, ArrowUpRight, ArrowDownRight, Scale, CheckCircle2 } from 'lucide-react';

interface BankAccountsViewProps {
  data: BankAccountsViewData | null;
}

const BANKS = ['ALL', 'CORA', 'ASAAS', 'PAGBANK', 'BANCO DO BRASIL', 'BRADESCO'];

export const BankAccountsView = ({ data }: BankAccountsViewProps) => {
  const [selectedBank, setSelectedBank] = useState<string>('ALL');

  if (!data) return null;

  const isConsolidated = selectedBank === 'ALL';
  const currentAccount = isConsolidated ? null : data.accounts[selectedBank];

  const saldoInicial = isConsolidated ? data.initialTotal : currentAccount?.saldoInicial || 0;
  const totalEntradas = isConsolidated ? data.totalEntradas : currentAccount?.totalEntradas || 0;
  const totalSaidas = isConsolidated ? data.totalSaidas : currentAccount?.totalSaidas || 0;
  const resultadoTotal = isConsolidated ? data.resultadoConsolidado : currentAccount?.resultadoTotal || 0;
  const saldoFinal = isConsolidated ? data.saldoAtualConsolidado : currentAccount?.saldoAtual || 0;

  const monthsData: MonthBankData[] = isConsolidated 
    ? data.consolidatedMonthly 
    : currentAccount?.months || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Bank Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Building2 size={20} className="text-primary" />
            Visão Bancária & Conciliação
          </h3>
          <p className="text-xs text-muted-foreground">
            Espelho financeiro mês a mês das contas bancárias oficiais da RioJunior (Página 94).
          </p>
        </div>

        {/* Bank Segmented Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {BANKS.map(b => (
            <button
              key={b}
              onClick={() => setSelectedBank(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedBank === b
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {b === 'ALL' ? 'Consolidado Geral' : b}
            </button>
          ))}
        </div>
      </div>

      {/* Highlights KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
            Saldo Inicial (01/01/2026)
          </span>
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(saldoInicial)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
            Total de Entradas
          </span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(totalEntradas)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
            Total de Saídas
          </span>
          <div className="text-xl font-bold text-destructive">
            -{formatCurrency(totalSaidas)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
            Resultado no Período
          </span>
          <div className={`text-xl font-bold ${resultadoTotal >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
            {resultadoTotal >= 0 ? '+ ' : ''}{formatCurrency(resultadoTotal)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 shadow-sm">
          <span className="text-[11px] font-semibold text-primary uppercase block mb-1">
            Saldo Final Atual
          </span>
          <div className="text-xl font-extrabold text-primary">
            {formatCurrency(saldoFinal)}
          </div>
        </div>
      </div>

      {/* Monthly Matrix Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
          <h4 className="font-bold text-sm text-foreground">
            Matriz Mensal de Fluxo: {isConsolidated ? 'Consolidado Geral' : `Conta ${selectedBank}`}
          </h4>
          <span className="text-xs text-muted-foreground">Ano base 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-5">Mês de Competência</th>
                <th className="py-3 px-5 text-right">Entradas (R$)</th>
                <th className="py-3 px-5 text-right">Saídas (R$)</th>
                <th className="py-3 px-5 text-right">Resultado do Mês (R$)</th>
                <th className="py-3 px-5 text-right">Saldo Acumulado (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {monthsData.map(m => {
                const isPositive = m.resultado >= 0;

                return (
                  <tr key={m.mesNum} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-foreground">
                      {m.mesNome}
                    </td>
                    <td className="py-3.5 px-5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      {m.entradas > 0 ? `+ ${formatCurrency(m.entradas)}` : 'R$ 0,00'}
                    </td>
                    <td className="py-3.5 px-5 text-right font-medium text-destructive">
                      {m.saidas > 0 ? `- ${formatCurrency(m.saidas)}` : 'R$ 0,00'}
                    </td>
                    <td className={`py-3.5 px-5 text-right font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                      {m.resultado !== 0 ? (isPositive ? '+ ' : '') + formatCurrency(m.resultado) : 'R$ 0,00'}
                    </td>
                    <td className="py-3.5 px-5 text-right font-extrabold text-foreground">
                      {formatCurrency(m.saldoAcumulado)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/50 text-xs font-bold">
                <td className="py-4 px-5 text-foreground uppercase tracking-wider">
                  Total Acumulado 2026
                </td>
                <td className="py-4 px-5 text-right text-emerald-600 dark:text-emerald-400 font-extrabold">
                  + {formatCurrency(totalEntradas)}
                </td>
                <td className="py-4 px-5 text-right text-destructive font-extrabold">
                  - {formatCurrency(totalSaidas)}
                </td>
                <td className={`py-4 px-5 text-right font-extrabold ${resultadoTotal >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                  {resultadoTotal >= 0 ? '+ ' : ''}{formatCurrency(resultadoTotal)}
                </td>
                <td className="py-4 px-5 text-right font-extrabold text-primary text-sm">
                  {formatCurrency(saldoFinal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
