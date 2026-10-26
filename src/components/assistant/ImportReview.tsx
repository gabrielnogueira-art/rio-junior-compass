import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { proposedBatchSchema, uniqueProposals } from '@/lib/assistant-finance';
import { movimentacoesService } from '@/services/movimentacoesService';
import { BankStatementService } from '@/services/bankStatementService';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatters';

export function ImportReview({ value }: { value: unknown }) {
  const parsed = proposedBatchSchema.safeParse(value);
  const [items, setItems] = useState(() => parsed.success ? uniqueProposals(parsed.data).map(item => ({ ...item, selected: !BankStatementService.autoClassify(item, movimentacoesService.getAllTransactions(), movimentacoesService.getTaxonomy()).isDuplicate })) : []);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const selected = items.filter(item => item.selected);
  if (!parsed.success) return <p className="text-destructive">Os lançamentos precisam ser revisados pelo assistente.</p>;
  async function confirm() {
    if (busy || !user || !selected.length) return;
    setBusy(true); setError('');
    try {
      const { data: profile, error: accessError } = await supabase.from('profiles').select('status').eq('id', user.id).maybeSingle();
      if (accessError || profile?.status !== 'aprovado') throw new Error('Seu acesso precisa estar aprovado.');
      const checked = proposedBatchSchema.parse(selected);
      const banks = movimentacoesService.getTaxonomy().contas;
      const current = movimentacoesService.getAllTransactions();
      const classified = checked.map(item => {
        if (!banks.includes(item.banco)) throw new Error('Selecione um banco disponível.');
        const classified = BankStatementService.autoClassify(item, current, movimentacoesService.getTaxonomy());
        if (classified.isDuplicate) throw new Error('Há lançamentos já importados. Desmarque as duplicatas antes de confirmar.');
        return classified;
      });
      const created = await movimentacoesService.createBatchTransactions(classified.map(item => ({ tipo: item.tipo, dataEfetiva: item.data, valorEfetivo: item.valor, descricao: item.descricao, conta: item.banco, documento: item.documento, categoria: item.categoriaCaixaMinimoSugerida, subcategoria: item.planoContaSugerido, projeto: item.iniciativaSugerida, centroCusto: item.centroCustoSugerido })));
      window.dispatchEvent(new Event('rio-finance-updated'));
      setResult(`${created.length} lançamentos importados neste navegador. Caixa, visão bancária, DFC e projeção atualizados.`);
    } catch (error) { setError(error instanceof Error ? error.message : 'Não foi possível importar.'); }
    finally { setBusy(false); }
  }
  return <div className="border border-border rounded-md p-3 space-y-3 bg-card">
    <h3 className="font-semibold text-sm">Revisão do extrato</h3>
    {result ? <p role="status" className="text-sm text-accent">{result}</p> : <>
      <div className="max-h-72 overflow-auto space-y-3">{items.map((item, index) => <div key={index} className="border-b border-border pb-3 space-y-2">
        <label className="flex items-center gap-2 text-xs"><input type="checkbox" aria-label={`Importar ${item.descricao}`} checked={item.selected} disabled={busy} onChange={event => setItems(previous => previous.map((row, i) => i === index ? { ...row, selected: event.target.checked } : row))} />{item.data} · {item.tipo} · {formatCurrency(item.valor)}</label>
        <Input aria-label={`Descrição ${index + 1}`} value={item.descricao} disabled={busy} onChange={event => setItems(previous => previous.map((row, i) => i === index ? { ...row, descricao: event.target.value } : row))} />
        <select aria-label={`Banco ${index + 1}`} value={item.banco} disabled={busy} className="w-full border border-input rounded-md bg-background text-foreground text-xs p-2" onChange={event => setItems(previous => previous.map((row, i) => i === index ? { ...row, banco: event.target.value } : row))}>{movimentacoesService.getTaxonomy().contas.map(bank => <option key={bank}>{bank}</option>)}</select>
      </div>)}</div>
      <p className="text-xs text-muted-foreground">{selected.length} selecionados · entradas {formatCurrency(selected.filter(item => item.tipo === 'Receita').reduce((sum, item) => sum + item.valor, 0))} · saídas {formatCurrency(selected.filter(item => item.tipo === 'Despesa').reduce((sum, item) => sum + item.valor, 0))}</p>
      <Button size="sm" disabled={busy || !selected.length} onClick={confirm}>{busy ? 'Importando…' : 'Confirmar importação'}</Button>
    </>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
  </div>;
}