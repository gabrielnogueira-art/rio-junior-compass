import { z } from 'zod';

export function normalizeDate(val: string): string {
  if (!val) return new Date().toISOString().slice(0, 10);
  const trimmed = val.trim();
  // If DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [d, m, y] = trimmed.split('/');
    return `${y}-${m}-${d}`;
  }
  // If YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 10);
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

export function normalizeBank(bankName: string, availableBanks: string[] = ['Cora', 'Asaas', 'PagBank', 'Banco do Brasil', 'Bradesco']): string {
  if (!bankName) return availableBanks[0] || 'Cora';
  const clean = bankName.trim().toLowerCase();
  
  if (clean.includes('cora')) return 'Cora';
  if (clean.includes('asaas')) return 'Asaas';
  if (clean.includes('pagbank') || clean.includes('pagseguro')) return 'PagBank';
  if (clean.includes('brasil') || clean.includes('bb')) return 'Banco do Brasil';
  if (clean.includes('bradesco')) return 'Bradesco';

  // Find exact or partial match
  const match = availableBanks.find(b => b.toLowerCase().includes(clean) || clean.includes(b.toLowerCase()));
  if (match) return match;

  return availableBanks[0] || 'Cora';
}

export const proposedMovementSchema = z.object({
  data: z.string().transform(normalizeDate),
  descricao: z.string().min(1).max(500),
  valor: z.union([z.number(), z.string()]).transform(v => {
    if (typeof v === 'number') return Math.abs(v);
    const cleaned = String(v).replace(/[^\d,.-]/g, '').replace(',', '.');
    return Math.abs(parseFloat(cleaned) || 0);
  }).refine(v => v > 0, 'Valor deve ser positivo'),
  tipo: z.enum(['Receita', 'Despesa']),
  banco: z.string().min(1).max(100),
  documento: z.string().max(200).nullable().optional(),
});

export const proposedBatchSchema = z.array(proposedMovementSchema).min(1).max(1000);

export function validatedProposals(value: unknown, availableBanks: string[] = ['Cora', 'Asaas', 'PagBank', 'Banco do Brasil', 'Bradesco']) {
  const parsed = proposedBatchSchema.safeParse(value);
  if (!parsed.success) {
    if (Array.isArray(value)) {
      return value.map(item => {
        const anyItem = item as any;
        return {
          data: normalizeDate(String(anyItem.data || '')),
          descricao: String(anyItem.descricao || 'Lançamento sem descrição'),
          valor: Math.abs(Number(anyItem.valor) || 0) || 1,
          tipo: (anyItem.tipo === 'Receita' ? 'Receita' : 'Despesa') as 'Receita' | 'Despesa',
          banco: normalizeBank(String(anyItem.banco || ''), availableBanks),
          documento: anyItem.documento ? String(anyItem.documento) : null,
        };
      });
    }
    throw new Error('Lançamento incompleto ou inválido.');
  }

  return parsed.data.map(item => ({
    ...item,
    banco: normalizeBank(item.banco, availableBanks),
    documento: item.documento ?? null,
  }));
}

export function movementKey(item: { data: string; descricao: string; valor: number; tipo: string; banco: string; documento?: string | null }) {
  return [item.banco.toLowerCase(), item.data, item.tipo, Math.round(item.valor * 100), (item.documento || item.descricao).toLowerCase().trim()].join('|');
}

export function uniqueProposals(items: unknown, availableBanks?: string[]) {
  const seen = new Set<string>();
  return validatedProposals(items, availableBanks).filter(item => {
    const key = movementKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
