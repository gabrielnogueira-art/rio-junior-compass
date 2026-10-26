import { z } from 'zod';

export const proposedMovementSchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => { const date = new Date(value + 'T12:00:00Z'); return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value; }, 'Data inválida'),
  descricao: z.string().min(1).max(500),
  valor: z.number().positive().finite(),
  tipo: z.enum(['Receita', 'Despesa']),
  banco: z.string().min(1).max(100),
  documento: z.string().max(200).nullable(),
});
export const proposedBatchSchema = z.array(proposedMovementSchema).min(1).max(500);

export function movementKey(item: { data: string; descricao: string; valor: number; tipo: string; banco: string; documento?: string | null }) {
  return [item.banco.toLowerCase(), item.data, item.tipo, Math.round(item.valor * 100), item.documento || item.descricao.toLowerCase()].join('|');
}
export function uniqueProposals(items: z.infer<typeof proposedMovementSchema>[]) {
  const seen = new Set<string>();
  return items.filter(item => { const key = movementKey(item); if (seen.has(key)) return false; seen.add(key); return true; });
}