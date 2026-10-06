import { useState } from 'react';
import { PlanoContaItem } from '@/types';
import { BookOpen, Search, ArrowUpRight, ArrowDownRight, Tag, Building2, CheckCircle2 } from 'lucide-react';

interface PlanoContasViewProps {
  planoContas: PlanoContaItem[];
}

export const PlanoContasView = ({ planoContas }: PlanoContasViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<'ALL' | 'Receita' | 'Despesa'>('ALL');
  const [filterCentro, setFilterCentro] = useState('ALL');

  const centros = Array.from(new Set(planoContas.map(p => p.centroCusto).filter(Boolean))).sort();

  const filtered = planoContas.filter(item => {
    const matchesSearch = !searchTerm || item.conta.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'ALL' || item.tipo === filterTipo;
    const matchesCentro = filterCentro === 'ALL' || item.centroCusto === filterCentro;
    return matchesSearch && matchesTipo && matchesCentro;
  });

  const receitas = filtered.filter(p => p.tipo === 'Receita');
  const despesas = filtered.filter(p => p.tipo === 'Despesa');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              Plano de Contas & Critérios de Classificação
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {planoContas.length} Contas Oficiais
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Estrutura contábil padronizada da RioJunior com vinculação aos respectivos Centros de Custo das Diretorias.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
          <input
            type="text"
            placeholder="Buscar por código ou nome de conta..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-muted-foreground">Natureza:</span>
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted/60 border border-border">
            <button
              onClick={() => setFilterTipo('ALL')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${filterTipo === 'ALL' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              Todas ({filtered.length})
            </button>
            <button
              onClick={() => setFilterTipo('Receita')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${filterTipo === 'Receita' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}
            >
              Receitas ({receitas.length})
            </button>
            <button
              onClick={() => setFilterTipo('Despesa')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${filterTipo === 'Despesa' ? 'bg-destructive/10 text-destructive' : 'text-muted-foreground'}`}
            >
              Despesas ({despesas.length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-muted-foreground">Centro de Custo:</span>
          <select
            value={filterCentro}
            onChange={e => setFilterCentro(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-input bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="ALL">Todos os Centros</option>
            {centros.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => {
          const isReceita = item.tipo === 'Receita';

          return (
            <div
              key={item.conta}
              className={`p-4 rounded-xl border transition-all hover:border-primary/50 bg-card ${
                item.isCategoriaPai ? 'border-primary/30 bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${isReceita ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'}`}>
                    {isReceita ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                  </div>
                  <div>
                    <h5 className={`font-bold text-sm ${item.isCategoriaPai ? 'text-primary' : 'text-foreground'}`}>
                      {item.conta}
                    </h5>
                    <span className="text-[11px] text-muted-foreground">
                      {isReceita ? 'Conta de Entrada / Receita' : 'Conta de Saída / Despesa'}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted text-foreground border border-border/60 shrink-0">
                  {item.centroCusto}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
