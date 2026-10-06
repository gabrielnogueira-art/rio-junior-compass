import { useState } from 'react';
import { IniciativaMetrica } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { 
  Target, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Percent, 
  Layers, 
  Search,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface IniciativasViewProps {
  iniciativas: IniciativaMetrica[];
}

export const IniciativasView = ({ iniciativas }: IniciativasViewProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const groups = ['ALL', 'Produtos e Eventos da Rede', 'Projetos da Rede', 'Eventos Externos', 'Projetos Internos'];

  const filtered = iniciativas.filter(item => {
    const matchesGroup = selectedGroup === 'ALL' || item.categoriaGrupo === selectedGroup;
    const matchesSearch = !searchTerm || item.iniciativa.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  // Calculate totals for currently filtered
  const totalReceitas = filtered.reduce((acc, i) => acc + i.receitas, 0);
  const totalDespesas = filtered.reduce((acc, i) => acc + i.despesas, 0);
  const totalResultado = totalReceitas - totalDespesas;
  const margemMedia = totalReceitas > 0 ? (totalResultado / totalReceitas) * 100 : 0;

  // Eventos da Rede totals (from spreadsheet)
  const redeEventos = iniciativas.filter(i => i.categoriaGrupo === 'Produtos e Eventos da Rede');
  const redeRec = redeEventos.reduce((acc, i) => acc + i.receitas, 0);
  const redeDesp = redeEventos.reduce((acc, i) => acc + i.despesas, 0);
  const redeRes = redeRec - redeDesp;
  const redeMargem = redeRec > 0 ? (redeRes / redeRec) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Overview */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Target size={20} className="text-primary" />
              Análise das Iniciativas & Eventos
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Oficial RioJunior 2026
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rentabilidade, margem e retorno sobre investimento (ROI) de cada evento, produto e projeto da Federação.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
          <input
            type="text"
            placeholder="Buscar evento/iniciativa..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* Featured Banner: Eventos da Rede */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Desempenho Geral dos Eventos e Produtos da Rede
            </span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">EFEJ, CentralRIO, Captação, ONDE, RJ74, Lojinha</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-card/80 border border-border/60">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Receita Gerada</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(redeRec)}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-card/80 border border-border/60">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Custo Total</span>
            <div className="text-xl font-bold text-destructive">-{formatCurrency(redeDesp)}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-card/80 border border-border/60">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Superávit da Rede</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(redeRes)}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-card/80 border border-border/60">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Margem Líquida</span>
            <div className="text-xl font-extrabold text-primary">{redeMargem.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Category Group Selector */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
        {groups.map(g => (
          <button
            key={g}
            onClick={() => setSelectedGroup(g)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedGroup === g
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {g === 'ALL' ? 'Todas as Iniciativas' : g}
          </button>
        ))}
      </div>

      {/* Summary KPI Strip of active filter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-card border border-border">
          <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Receitas Totais</span>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(totalReceitas)}</div>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border">
          <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Despesas Totais</span>
          <div className="text-base font-bold text-destructive">-{formatCurrency(totalDespesas)}</div>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border">
          <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Resultado Líquido</span>
          <div className={`text-base font-bold ${totalResultado >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
            {totalResultado >= 0 ? '+ ' : ''}{formatCurrency(totalResultado)}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border">
          <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Margem Operacional</span>
          <div className={`text-base font-bold ${margemMedia >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {margemMedia.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Iniciativas Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Iniciativa / Evento</th>
                <th className="py-3 px-3">Grupo</th>
                <th className="py-3 px-4 text-right">Receitas (R$)</th>
                <th className="py-3 px-4 text-right">Despesas (R$)</th>
                <th className="py-3 px-4 text-right">Resultado (R$)</th>
                <th className="py-3 px-4 text-right">Margem</th>
                <th className="py-3 px-4 text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(item => {
                const isSuperavit = item.resultado >= 0;
                const margemPercent = (item.margem * 100).toFixed(1);
                const roiDisplay = item.roi > 0 ? `${item.roi.toFixed(2)}x` : '-';

                return (
                  <tr key={item.iniciativa} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">
                      {item.iniciativa}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-muted font-medium">
                        {item.categoriaGrupo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.receitas > 0 ? `+ ${formatCurrency(item.receitas)}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-destructive">
                      {item.despesas > 0 ? `- ${formatCurrency(item.despesas)}` : '-'}
                    </td>
                    <td className={`py-3 px-4 text-right font-extrabold ${isSuperavit ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                      {item.resultado !== 0 ? (isSuperavit ? '+ ' : '') + formatCurrency(item.resultado) : 'R$ 0,00'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      {item.receitas > 0 ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          item.margem >= 0.5 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                          item.margem >= 0.2 ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' :
                          item.margem > 0 ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                          'bg-destructive/15 text-destructive'
                        }`}>
                          {margemPercent}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-foreground">
                      {roiDisplay}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
