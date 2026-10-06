import { useState } from 'react';
import { MovimentacaoRioJunior, TaxonomyRioJunior } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  Plus,
  ArrowRightLeft,
  Tag,
  Target
} from 'lucide-react';

interface MovimentacoesTableProps {
  transactions: MovimentacaoRioJunior[];
  total: number;
  filteredReceitas: number;
  filteredDespesas: number;
  filteredSaldo: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  filters: {
    search: string;
    tipo: string;
    conta: string;
    mes: string;
    centroCusto: string;
    categoria: string;
    iniciativa?: string;
    tipoIniciativa?: string;
    categoriaCaixaMinimo?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
  taxonomy: TaxonomyRioJunior;
  onViewDetails: (tx: MovimentacaoRioJunior) => void;
  onEdit: (tx: MovimentacaoRioJunior) => void;
  onDuplicate: (tx: MovimentacaoRioJunior) => void;
  onDelete: (id: string) => void;
  onExportCSV: () => void;
  onOpenNewTx: () => void;
  onOpenTransfer: () => void;
}

const BANK_PILLS: Record<string, string> = {
  'Cora': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/30',
  'Asaas': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30',
  'PagBank': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
  'Banco do Brasil': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30',
  'Bradesco': 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30',
};

export const MovimentacoesTable = ({
  transactions,
  total,
  filteredReceitas,
  filteredDespesas,
  filteredSaldo,
  page,
  limit,
  onPageChange,
  onLimitChange,
  filters,
  onFilterChange,
  onResetFilters,
  taxonomy,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
  onExportCSV,
  onOpenNewTx,
  onOpenTransfer
}: MovimentacoesTableProps) => {
  const totalPages = Math.ceil(total / limit) || 1;

  const hasActiveFilters = 
    filters.search || 
    filters.tipo !== 'ALL' || 
    filters.conta !== 'ALL' || 
    filters.mes !== 'ALL' || 
    filters.centroCusto !== 'ALL' || 
    filters.categoria !== 'ALL' || 
    (filters.iniciativa && filters.iniciativa !== 'ALL') ||
    (filters.tipoIniciativa && filters.tipoIniciativa !== 'ALL') ||
    (filters.categoriaCaixaMinimo && filters.categoriaCaixaMinimo !== 'ALL');

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Control Bar: Search & Filter Dropdowns */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
            <input
              type="text"
              placeholder="Buscar por descrição, contato, documento, conta do plano ou iniciativa..."
              value={filters.search}
              onChange={e => onFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="px-3.5 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-muted-foreground hover:text-foreground font-semibold text-xs flex items-center gap-1.5 transition-colors"
                title="Limpar todos os filtros"
              >
                <RotateCcw size={14} />
                <span>Limpar Filtros</span>
              </button>
            )}

            <button
              onClick={onExportCSV}
              className="px-3.5 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-foreground font-semibold text-xs flex items-center gap-1.5 transition-colors"
              title="Exportar registros filtrados para CSV"
            >
              <Download size={14} />
              <span>Exportar</span>
            </button>

            <button
              onClick={onOpenNewTx}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus size={15} />
              <span>Lançamento</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2.5 pt-2 border-t border-border/50 text-xs">
          {/* Tipo */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Tipo
            </label>
            <select
              value={filters.tipo}
              onChange={e => onFilterChange('tipo', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="ALL">Todos os Tipos</option>
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
            </select>
          </div>

          {/* Conta Bancária */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Conta Bancária
            </label>
            <select
              value={filters.conta}
              onChange={e => onFilterChange('conta', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="ALL">Todas as Contas</option>
              {(taxonomy?.contas || ['Cora', 'Asaas', 'PagBank', 'Banco do Brasil', 'Bradesco']).map(acc => (
                <option key={acc} value={acc}>{acc}</option>
              ))}
            </select>
          </div>

          {/* Mês de Competência */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Mês
            </label>
            <select
              value={filters.mes}
              onChange={e => onFilterChange('mes', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="ALL">Todos os Meses</option>
              {(taxonomy?.meses || []).map(m => (
                <option key={m.num} value={m.nome}>{m.nome}</option>
              ))}
            </select>
          </div>

          {/* Centro de Custo */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Centro de Custo
            </label>
            <select
              value={filters.centroCusto}
              onChange={e => onFilterChange('centroCusto', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="ALL">Todos os Centros</option>
              {(taxonomy?.centrosCusto || []).map(cc => (
                <option key={cc} value={cc}>{cc}</option>
              ))}
            </select>
          </div>

          {/* Iniciativa */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Iniciativa
            </label>
            <select
              value={filters.iniciativa || 'ALL'}
              onChange={e => onFilterChange('iniciativa', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="ALL">Todas Iniciativas</option>
              {((taxonomy as any)?.iniciativas || []).map((ini: string) => (
                <option key={ini} value={ini}>{ini}</option>
              ))}
            </select>
          </div>

          {/* Tipo de Iniciativa */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Tipo de Iniciativa
            </label>
            <select
              value={filters.tipoIniciativa || 'ALL'}
              onChange={e => onFilterChange('tipoIniciativa', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="ALL">Todos os Tipos</option>
              {((taxonomy as any)?.tiposIniciativa || []).map((tipo: string) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Categoria Caixa Mínimo */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Caixa Mínimo
            </label>
            <select
              value={filters.categoriaCaixaMinimo || 'ALL'}
              onChange={e => onFilterChange('categoriaCaixaMinimo', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="ALL">Todas Categorias</option>
              {((taxonomy as any)?.categoriasCaixaMinimo || []).map((cm: string) => (
                <option key={cm} value={cm}>{cm}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Summary Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-xl bg-card border border-border text-xs">
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>
            Mostrando <strong>{transactions.length}</strong> de <strong>{total.toLocaleString('pt-BR')}</strong> movimentações
          </span>
          {hasActiveFilters && (
            <span className="text-primary font-semibold">
              (Filtros ativos)
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Entradas:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(filteredReceitas)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Saídas:</span>
            <span className="font-bold text-destructive">-{formatCurrency(filteredDespesas)}</span>
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-border">
            <span className="text-muted-foreground">Saldo do Filtro:</span>
            <span className={`font-bold ${filteredSaldo >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
              {formatCurrency(filteredSaldo)}
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-4">Descrição & Contato</th>
                <th className="py-3 px-3">Banco</th>
                <th className="py-3 px-3">Plano de Contas</th>
                <th className="py-3 px-3">Iniciativa / Projeto</th>
                <th className="py-3 px-3">Centro de Custo</th>
                <th className="py-3 px-3">Caixa Mínimo</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-muted-foreground">
                    Nenhuma movimentação encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                transactions.map(t => {
                  const isReceita = t.tipo === 'Receita';
                  const bankClass = BANK_PILLS[t.conta] || 'bg-muted text-foreground';

                  return (
                    <tr 
                      key={t.id} 
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Data */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-foreground">{t.dataEfetiva}</div>
                        <div className="text-[10px] text-muted-foreground">{t.mesComp}</div>
                      </td>

                      {/* Tipo */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          isReceita 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}>
                          {isReceita ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {t.tipo}
                        </span>
                      </td>

                      {/* Descrição & Contato */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-foreground truncate" title={t.descricao}>
                          {t.descricao || 'Sem descrição'}
                        </div>
                        {t.contato && (
                          <div className="text-[11px] text-muted-foreground truncate" title={t.contato}>
                            {t.contato}
                          </div>
                        )}
                      </td>

                      {/* Banco */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${bankClass}`}>
                          {t.conta}
                        </span>
                      </td>

                      {/* Plano de Contas */}
                      <td className="py-3 px-3 max-w-[150px]">
                        <span className="font-medium text-foreground truncate block" title={(t as any).planoConta || t.categoria}>
                          {(t as any).planoConta || t.categoria}
                        </span>
                      </td>

                      {/* Iniciativa & Tipo */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground truncate max-w-[130px]">
                            {(t as any).iniciativa || (t as any).projeto || 'N/A'}
                          </span>
                          {(t as any).tipoIniciativa && (
                            <span className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                              {(t as any).tipoIniciativa}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Centro de Custo */}
                      <td className="py-3 px-3 whitespace-nowrap text-muted-foreground">
                        <span className="font-medium text-foreground">{t.centroCusto || 'Operações'}</span>
                      </td>

                      {/* Caixa Mínimo */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                          {(t as any).categoriaCaixaMinimo || '-'}
                        </span>
                      </td>

                      {/* Valor */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-bold">
                        <span className={isReceita ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}>
                          {isReceita ? '+ ' : '- '}{formatCurrency(t.valorEfetivo)}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onViewDetails(t)}
                            title="Ver detalhes"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => onEdit(t)}
                            title="Editar movimentação"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => onDuplicate(t)}
                            title="Duplicar movimentação"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Tem certeza que deseja excluir a movimentação "${t.descricao}"?`)) {
                                onDelete(t.id);
                              }
                            }}
                            title="Excluir movimentação"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground bg-muted/20">
          <div className="flex items-center gap-2">
            <span>Itens por página:</span>
            <select
              value={limit}
              onChange={e => onLimitChange(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border border-input bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span>Página {page} de {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="p-1.5 rounded-lg border border-input bg-background hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="p-1.5 rounded-lg border border-input bg-background hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
