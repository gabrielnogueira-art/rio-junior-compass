import { useState } from 'react';
import { TaxonomyRioJunior } from '@/types';
import { X, ArrowRightLeft, Check } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (data: { contaOrigem: string; contaDestino: string; valorEfetivo: number; dataEfetiva: string; observacoes?: string }) => Promise<void>;
  taxonomy: TaxonomyRioJunior;
}

export const TransferModal = ({
  isOpen,
  onClose,
  onTransfer,
  taxonomy
}: TransferModalProps) => {
  const [contaOrigem, setContaOrigem] = useState('CORA');
  const [contaDestino, setContaDestino] = useState('ASAAS');
  const [valor, setValor] = useState('');
  const [dataEfetiva, setDataEfetiva] = useState(new Date().toISOString().split('T')[0]);
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  const contas = taxonomy?.contas || ['CORA', 'ASAAS', 'PAGBANK', 'BANCO DO BRASIL', 'BRADESCO'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contaOrigem === contaDestino) {
      alert('As contas de origem e destino devem ser diferentes.');
      return;
    }
    const val = parseFloat(valor.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      alert('Por favor, insira um valor válido maior que zero.');
      return;
    }

    setLoading(true);
    try {
      await onTransfer({
        contaOrigem,
        contaDestino,
        valorEfetivo: val,
        dataEfetiva,
        observacoes
      });
      onClose();
    } catch (err: any) {
      alert('Erro ao realizar transferência: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col animate-scale-in">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Transferência entre Contas RioJunior</h3>
              <p className="text-xs text-muted-foreground">Gera o par contábil de débito e crédito automaticamente</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Conta de Origem (Saída)
              </label>
              <select
                value={contaOrigem}
                onChange={e => setContaOrigem(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
              >
                {contas.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Conta de Destino (Entrada)
              </label>
              <select
                value={contaDestino}
                onChange={e => setContaDestino(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
              >
                {contas.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Valor da Transferência (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  R$
                </span>
                <input
                  type="text"
                  required
                  placeholder="0,00"
                  value={valor}
                  onChange={e => setValor(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground font-semibold text-base focus:ring-2 focus:ring-primary outline-none"
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
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Observações / Justificativa
            </label>
            <input
              type="text"
              placeholder="Ex: Alocação para despesas operacionais do mês"
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

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
              <span>{loading ? 'Processando...' : 'Confirmar Transferência'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
