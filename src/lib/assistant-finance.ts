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

export function validatedProposals(value: unknown) {
  return proposedBatchSchema.parse(value).map(item => {
    const { data, descricao, valor, tipo, banco, documento } = item;
    if (data === undefined || descricao === undefined || valor === undefined || tipo === undefined || banco === undefined) throw new Error('Lançamento incompleto.');
    return { data, descricao, valor, tipo, banco, documento };
  });
}

export function movementKey(item: { data: string; descricao: string; valor: number; tipo: string; banco: string; documento?: string | null }) {
  return [item.banco.toLowerCase(), item.data, item.tipo, Math.round(item.valor * 100), item.documento || item.descricao.toLowerCase()].join('|');
}
export function uniqueProposals(items: unknown) {
  const seen = new Set<string>();
  return validatedProposals(items).filter(item => { const key = movementKey(item); if (seen.has(key)) return false; seen.add(key); return true; });
}