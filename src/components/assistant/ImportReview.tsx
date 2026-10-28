import { useState, useMemo } from 'react';
import { 
  Check, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uniqueProposals, validatedProposals } from '@/lib/assistant-finance';
import { movimentacoesService } from '@/services/movimentacoesService';
import { BankStatementService } from '@/services/bankStatementService';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatters';

export function ImportReview({ value }: { value: unknown }) {
  const availableBanks = useMemo(() => movimentacoesService.getTaxonomy().contas, []);
  
  const [items, setItems] = useState(() => {
    try {
      const proposals = uniqueProposals(value, availableBanks);
      const existing = movimentacoesService.getAllTransactions();
      const tax = movimentacoesService.getTaxonomy();
      return proposals.map(item => {
        const classified = BankStatementService.autoClassify(item, existing, tax);
        return {
          ...item,
          categoriaSugerida: classified.categoriaCaixaMinimoSugerida,
          planoConta: classified.planoContaSugerido,
          centroCusto: classified.centroCustoSugerido,
          iniciativa: classified.iniciativaSugerida,
          isDuplicate: classified.isDuplicate,
          duplicateReason: classified.duplicateReason,
          selected: !classified.isDuplicate
        };
      });
    } catch {
      return [];
    }
  });

  const [bulkBank, setBulkBank] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const selected = items.filter(item => item.selected);
  const totalReceitas = selected.filter(item => item.tipo === 'Receita').reduce((sum, item) => sum + item.valor, 0);
  const totalDespesas = selected.filter(item => item.tipo === 'Despesa').reduce((sum, item) => sum + item.valor, 0);
  const saldoLiquido = totalReceitas - totalDespesas;
  const duplicateCount = items.filter(i => i.isDuplicate).length;

  const handleApplyBulkBank = (bank: string) => {
    setBulkBank(bank);
    if (!bank) return;
    setItems(prev => prev.map(item => ({ ...item, banco: bank })));
  };

  const handleToggleSelectAll = (select: boolean) => {
    setItems(prev => prev.map(item => ({
      ...item,
      selected: select ? true : false
    })));
  };

  const handleDeselectDuplicates = () => {
    setItems(prev => prev.map(item => ({
      ...item,
      selected: item.isDuplicate ? false : item.selected
    })));
  };

  async function confirm() {
    if (busy || !selected.length) return;
    setBusy(true); 
    setError('');
    try {
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('status').eq('id', user.id).maybeSingle();
        if (profile && profile.status !== 'aprovado') {
          throw new Error('Seu acesso precisa estar aprovado pelo administrador.');
        }
      }

      const checked = validatedProposals(selected, availableBanks);
      const current = movimentacoesService.getAllTransactions();
      const taxonomy = movimentacoesService.getTaxonomy();

      const classified = checked.map(item => {
        return BankStatementService.autoClassify(item, current, taxonomy);
      });

      const toCreate = classified.map(item => ({
        tipo: item.tipo,
        dataEfetiva: item.data,
        valorEfetivo: item.valor,
        descricao: item.descricao,
        conta: item.banco,
        documento: item.documento,
        categoria: item.categoriaCaixaMinimoSugerida || 'Outros',
        subcategoria: item.planoContaSugerido || '',
        projeto: item.iniciativaSugerida || 'N/A',
        centroCusto: item.centroCustoSugerido || 'Operações'
      }));

      const created = await movimentacoesService.createBatchTransactions(toCreate);
      
      // Notifica todo o sistema para recarregar componentes de Caixa, DFC, Projeções e Gráficos
      window.dispatchEvent(new Event('rio-finance-updated'));
      
      setResult(`${created.length} lançamentos adicionados com sucesso ao Caixa! O saldo bancário, DFC e projeções financeiras já foram atualizados.`);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Não foi possível importar os lançamentos.');
    } finally {
      setBusy(false);
    }
  }

  if (!items.length && !result) {
    return (
      <div className="border border-border/80 rounded-lg p-3 text-xs bg-muted/30 text-muted-foreground">
        Nenhum lançamento válido encontrado no extrato para revisão.
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl p-3.5 space-y-3.5 bg-card/95 shadow-md my-2">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Sparkles size={15} />
          </div>
          <div>
            <h4 className="font-bold text-xs">Revisão do Extrato Bancário</h4>
            <p className="text-[11px] text-muted-foreground">
              {items.length} lançamentos identificados pela IA / Extrato
            </p>
          </div>
        </div>

        {/* Bulk Bank Selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <Building2 size={13} className="text-muted-foreground" />
          <select 
            aria-label="Definir banco para todos"
            value={bulkBank}
            onChange={e => handleApplyBulkBank(e.target.value)}
            disabled={busy || !!result}
            className="text-[11px] border border-input rounded bg-background px-2 py-1 text-foreground"
          >
            <option value="">Banco para todos...</option>
            {availableBanks.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {result ? (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 size={17} className="text-emerald-400" />
            <span>Controle Financeiro Atualizado!</span>
          </div>
          <p className="leading-relaxed opacity-90">{result}</p>
        </div>
      ) : (
        <>
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/60 text-center text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground block">Receitas ({selected.filter(i => i.tipo === 'Receita').length})</span>
              <span className="font-bold text-emerald-500 flex items-center justify-center gap-0.5">
                <ArrowUpRight size={13} />
                {formatCurrency(totalReceitas)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">Despesas ({selected.filter(i => i.tipo === 'Despesa').length})</span>
              <span className="font-bold text-rose-500 flex items-center justify-center gap-0.5">
                <ArrowDownRight size={13} />
                {formatCurrency(totalDespesas)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">Impacto Líquido</span>
              <span className={`font-bold ${saldoLiquido >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(saldoLiquido)}
              </span>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={() => handleToggleSelectAll(true)} 
                className="hover:text-primary underline cursor-pointer"
                disabled={busy}
              >
                Selecionar todos
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => handleToggleSelectAll(false)} 
                className="hover:text-primary underline cursor-pointer"
                disabled={busy}
              >
                Desmarcar todos
              </button>
              {duplicateCount > 0 && (
                <>
                  <span>•</span>
                  <button 
                    type="button" 
                    onClick={handleDeselectDuplicates} 
                    className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    disabled={busy}
                  >
                    <AlertTriangle size={11} />
                    Desmarcar {duplicateCount} duplicata(s)
                  </button>
                </>
              )}
            </div>
            <span className="font-medium text-foreground">{selected.length} selecionado(s)</span>
          </div>

          {/* Transactions List */}
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1 divide-y divide-border/40">
            {items.map((item, index) => (
              <div key={index} className={`pt-2 space-y-1.5 ${item.isDuplicate ? 'opacity-70 bg-amber-500/5 p-1.5 rounded' : ''}`}>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input 
                      type="checkbox" 
                      checked={item.selected} 
                      disabled={busy} 
                      onChange={e => setItems(prev => prev.map((row, i) => i === index ? { ...row, selected: e.target.checked } : row))} 
                      className="w-3.5 h-3.5 accent-primary rounded cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-muted-foreground">{item.data}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      item.tipo === 'Receita' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {item.tipo}
                    </span>
                    {item.isDuplicate && (
                      <span className="text-[10px] text-amber-400 flex items-center gap-0.5 bg-amber-500/15 px-1 rounded">
                        <AlertTriangle size={10} /> Possível duplicata
                      </span>
                    )}
                  </label>
                  <span className={`font-bold font-mono ${item.tipo === 'Receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {item.tipo === 'Receita' ? '+' : '-'}{formatCurrency(item.valor)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <div className="col-span-2">
                    <Input 
                      value={item.descricao} 
                      disabled={busy} 
                      className="h-7 text-xs bg-background"
                      onChange={e => setItems(prev => prev.map((row, i) => i === index ? { ...row, descricao: e.target.value } : row))} 
                      placeholder="Descrição do lançamento"
                    />
                  </div>
                  <div>
                    <select 
                      value={item.banco} 
                      disabled={busy} 
                      className="w-full h-7 border border-input rounded bg-background text-foreground text-[11px] px-1.5"
                      onChange={e => setItems(prev => prev.map((row, i) => i === index ? { ...row, banco: e.target.value } : row))}
                    >
                      {availableBanks.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Total a importar: <strong className="text-foreground">{selected.length} transações</strong>
            </span>
            <Button 
              size="sm" 
              disabled={busy || !selected.length} 
              onClick={confirm}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
            >
              <Check size={15} />
              {busy ? 'Atualizando Caixa...' : 'Confirmar e Atualizar Caixa Agora'}
            </Button>
          </div>
        </>
      )}

      {error && (
        <div className="p-2.5 rounded bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
          <AlertTriangle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
