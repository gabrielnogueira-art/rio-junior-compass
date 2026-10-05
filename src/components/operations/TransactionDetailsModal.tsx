import { MovimentacaoRioJunior } from '@/types';
import { X, Calendar, DollarSign, Building, Tag, Briefcase, FileText, User, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: MovimentacaoRioJunior | null;
  onEdit: (tx: MovimentacaoRioJunior) => void;
}

export const TransactionDetailsModal = ({
  isOpen,
  onClose,
  transaction,
  onEdit
}: TransactionDetailsModalProps) => {
  if (!isOpen || !transaction) return null;

  const isDespesa = transaction.tipo === 'Despesa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isDespesa ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {isDespesa ? <ArrowDownCircle size={22} /> : <ArrowUpCircle size={22} />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detalhes da Movimentação</span>
              <h3 className="text-xl font-bold text-foreground">{formatCurrency(transaction.valorEfetivo)}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
            <span className="text-xs text-muted-foreground block font-semibold mb-1">Descrição</span>
            <p className="text-foreground font-medium text-base">{transaction.descricao || 'Sem descrição'}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-background border border-border">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Calendar size={13} /> Data Efetiva
              </span>
              <p className="font-semibold text-foreground">
                {transaction.dataEfetiva} {transaction.mesComp ? `(${transaction.mesComp})` : ''}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-background border border-border">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Building size={13} /> Conta Bancária
              </span>
              <p className="font-bold text-primary">{transaction.conta}</p>
            </div>

            <div className="p-3 rounded-xl bg-background border border-border">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Tag size={13} /> Categoria
              </span>
              <p className="font-semibold text-foreground">{transaction.categoria}</p>
            </div>

            <div className="p-3 rounded-xl bg-background border border-border">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Tag size={13} /> Subcategoria
              </span>
              <p className="font-semibold text-foreground">{transaction.subcategoria || '-'}</p>
            </div>

            <div className="p-3 rounded-xl bg-background border border-border">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Briefcase size={13} /> Centro de Custo
              </span>
              <p className="font-semibold text-foreground">{transaction.centroCusto || 'Operações'}</p>
            </div>

            <div className="p-3 rounded-xl bg-background border border-border">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Briefcase size={13} /> Projeto / Evento
              </span>
              <p className="font-semibold text-foreground">{transaction.projeto || 'N/A'}</p>
            </div>
          </div>

          {(transaction.contato || transaction.documento) && (
            <div className="grid grid-cols-2 gap-3">
              {transaction.contato && (
                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <User size={13} /> Contato / Fornecedor
                  </span>
                  <p className="font-medium text-foreground">{transaction.contato}</p>
                </div>
              )}
              {transaction.documento && (
                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <FileText size={13} /> Nº Documento / NF
                  </span>
                  <p className="font-medium text-foreground">{transaction.documento}</p>
                </div>
              )}
            </div>
          )}

          {transaction.observacoes && (
            <div className="p-3 rounded-xl bg-background border border-border">
              <span className="text-xs text-muted-foreground block mb-1">Observações</span>
              <p className="text-foreground/80 italic">{transaction.observacoes}</p>
            </div>
          )}

          <div className="text-[11px] text-muted-foreground/60 flex justify-between pt-2">
            <span>ID: {transaction.id}</span>
            {transaction.createdAt && <span>Registrado em: {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/20">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-input bg-background hover:bg-muted text-foreground font-semibold text-sm transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(transaction);
            }}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-sm transition-colors"
          >
            Editar Movimentação
          </button>
        </div>
      </div>
    </div>
  );
};
