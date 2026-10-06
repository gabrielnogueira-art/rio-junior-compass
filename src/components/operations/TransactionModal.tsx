import { useState, useEffect } from 'react';
import { MovimentacaoRioJunior, TaxonomyRioJunior } from '@/types';
import { X, ArrowUpCircle, ArrowDownCircle, Check, Calendar, DollarSign, Tag, Building, Briefcase, Settings2 } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<MovimentacaoRioJunior>) => Promise<void>;
  transactionToEdit?: MovimentacaoRioJunior | null;
  taxonomy: TaxonomyRioJunior;
  onManageTaxonomy?: () => void;
}

export const TransactionModal = ({
  isOpen,
  onClose,
  onSave,
  transactionToEdit,
  taxonomy,
  onManageTaxonomy
}: TransactionModalProps) => {
  const isEditing = !!transactionToEdit;

  const [tipo, setTipo] = useState<'Despesa' | 'Receita'>('Despesa');
  const [dataEfetiva, setDataEfetiva] = useState(new Date().toISOString().split('T')[0]);
  const [valorEfetivo, setValorEfetivo] = useState<string>('');
  const [descricao, setDescricao] = useState('');
  const [conta, setConta] = useState('CORA');
  const [centroCusto, setCentroCusto] = useState('Operações');
  const [projeto, setProjeto] = useState('N/A');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [contato, setContato] = useState('');
  const [documento, setDocumento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setTipo(transactionToEdit.tipo || 'Despesa');
      setDataEfetiva(transactionToEdit.dataEfetiva ? transactionToEdit.dataEfetiva.split('T')[0] : new Date().toISOString().split('T')[0]);
      setValorEfetivo(String(transactionToEdit.valorEfetivo || ''));
      setDescricao(transactionToEdit.descricao || '');
      setConta(transactionToEdit.conta || 'CORA');
      setCentroCusto(transactionToEdit.centroCusto || 'Operações');
      setProjeto(transactionToEdit.projeto || 'N/A');
      setCategoria(transactionToEdit.categoria || '');
      setSubcategoria(transactionToEdit.subcategoria || '');
      setContato(transactionToEdit.contato || '');
      setDocumento(transactionToEdit.documento || '');
      setObservacoes(transactionToEdit.observacoes || '');
    } else {
      setTipo('Despesa');
      setDataEfetiva(new Date().toISOString().split('T')[0]);
      setValorEfetivo('');
      setDescricao('');
      setConta('CORA');
      setCentroCusto('Operações');
      setProjeto('N/A');
      const defaultCats = taxonomy?.categoriesByType?.Despesa || taxonomy?.categorias || [];
      const firstCat = defaultCats[0] || 'Investimento no membro';
      setCategoria(firstCat);
      const defaultSub = taxonomy?.subcategoriesByCategory?.[firstCat] || [];
      setSubcategoria(defaultSub[0] || '');
      setContato('');
      setDocumento('');
      setObservacoes('');
    }
  }, [transactionToEdit, isOpen, taxonomy]);

  // Handle category change when tipo changes
  const availableCategories = (taxonomy?.categoriesByType?.[tipo] || taxonomy?.categorias || []);

  const handleTipoChange = (newTipo: 'Despesa' | 'Receita') => {
    setTipo(newTipo);
    const cats = taxonomy?.categoriesByType?.[newTipo] || [];
    const firstCat = cats[0] || '';
    setCategoria(firstCat);
    const subs = taxonomy?.subcategoriesByCategory?.[firstCat] || [];
    setSubcategoria(subs[0] || '');
  };

  const handleCategoriaChange = (newCat: string) => {
    setCategoria(newCat);
    const subs = taxonomy?.subcategoriesByCategory?.[newCat] || [];
    setSubcategoria(subs[0] || '');
  };

  const availableSubcategories = taxonomy?.subcategoriesByCategory?.[categoria] || taxonomy?.subcategorias || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) {
      alert('Por favor, informe a descrição da movimentação.');
      return;
    }
    const val = parseFloat(valorEfetivo.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      alert('Por favor, informe um valor válido maior que zero.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        tipo,
        dataEfetiva,
        valorEfetivo: val,
        descricao: descricao.trim(),
        conta,
        centroCusto,
        projeto,
        categoria,
        subcategoria,
        contato: contato.trim(),
        documento: documento.trim(),
        observacoes: observacoes.trim()
      });
      onClose();
    } catch (err: any) {
      alert('Erro ao salvar movimentação: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/40">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {isEditing ? 'Editar Movimentação' : 'Nova Movimentação Financeira'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEditing ? `Editando ID: ${transactionToEdit?.id}` : 'Registro no fluxo de caixa da RioJunior 2026'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tipo Toggle */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTipoChange('Despesa')}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all border ${
                  tipo === 'Despesa'
                    ? 'bg-destructive/10 text-destructive border-destructive shadow-sm'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                <ArrowDownCircle size={18} />
                <span>Despesa (Saída)</span>
              </button>
              <button
                type="button"
                onClick={() => handleTipoChange('Receita')}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all border ${
                  tipo === 'Receita'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-sm'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                <ArrowUpCircle size={18} />
                <span>Receita (Entrada)</span>
              </button>
            </div>
          </div>

          {/* Valor & Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Valor (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  R$
                </span>
                <input
                  type="text"
                  required
                  placeholder="0,00"
                  value={valorEfetivo}
                  onChange={e => setValorEfetivo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground font-semibold text-base focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Data Efetiva *
              </label>
              <input
                type="date"
                required
                value={dataEfetiva}
                onChange={e => setDataEfetiva(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground font-medium text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Descrição da Transação *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Transporte - Uber para reunião / Ingressos EFEJ 2026"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Conta Bancária & Centro de Custo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Conta Bancária *
              </label>
              <select
                value={conta}
                onChange={e => setConta(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
              >
                {(taxonomy?.contas || ['CORA', 'ASAAS', 'PAGBANK', 'BANCO DO BRASIL', 'BRADESCO']).map(acc => (
                  <option key={acc} value={acc}>{acc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Centro de Custo (Diretoria) *
              </label>
              <select
                value={centroCusto}
                onChange={e => setCentroCusto(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
              >
                {(taxonomy?.centrosCusto || ['Operações', 'DirEx', 'Formação Empreendedora', 'Presidência Executiva', 'Presidência do Conselho', 'Desenvolvimento da Rede', 'Vice-Presidência de Negócios']).map(cc => (
                  <option key={cc} value={cc}>{cc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Categoria & Subcategoria (Cascata) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Categoria *
                </label>
                {onManageTaxonomy && (
                  <button
                    type="button"
                    onClick={onManageTaxonomy}
                    className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                    title="Adicionar, editar ou excluir categorias e subcategorias"
                  >
                    <Settings2 size={12} />
                    <span>Gerenciar opções</span>
                  </button>
                )}
              </div>
              <select
                value={categoria}
                onChange={e => handleCategoriaChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
              >
                {availableCategories.length === 0 && <option value="">Nenhuma categoria cadastrada</option>}
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Subcategoria
                </label>
                {onManageTaxonomy && (
                  <button
                    type="button"
                    onClick={onManageTaxonomy}
                    className="text-[11px] text-muted-foreground hover:text-primary font-medium flex items-center gap-1"
                    title="Editar ou adicionar novas subcategorias"
                  >
                    <Settings2 size={12} />
                    <span>Editar</span>
                  </button>
                )}
              </div>
              <select
                value={subcategoria}
                onChange={e => setSubcategoria(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
              >
                <option value="">Selecione...</option>
                {availableSubcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Projeto / Evento & Contato */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Projeto / Evento
              </label>
              <select
                value={projeto}
                onChange={e => setProjeto(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              >
                {(taxonomy?.projetos || ['N/A', 'EFEJ', 'EDL', 'RJ74', 'Imersão de Time', 'Lojinha', 'Anuidade']).map(proj => (
                  <option key={proj} value={proj}>{proj}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Contato / Fornecedor
              </label>
              <input
                type="text"
                list="contatos-list"
                placeholder="Ex: Uber, Ifood, Clube Giro..."
                value={contato}
                onChange={e => setContato(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
              <datalist id="contatos-list">
                {(taxonomy?.contacts || []).slice(0, 100).map(c => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Documento & Observações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Nº Documento / NF / Comprovante
              </label>
              <input
                type="text"
                placeholder="Ex: NF-1234, Recibo 58"
                value={documento}
                onChange={e => setDocumento(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Observações
              </label>
              <input
                type="text"
                placeholder="Notas internas..."
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-foreground font-semibold text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Check size={16} />
              <span>{loading ? 'Salvando...' : isEditing ? 'Atualizar Movimentação' : 'Salvar Movimentação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
