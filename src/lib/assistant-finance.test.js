import { expect, test } from 'bun:test';
import { proposedBatchSchema, uniqueProposals } from './assistant-finance';
const receita = { data: '2026-10-26', descricao: 'Anuidade', valor: 100.25, tipo: 'Receita', banco: 'Cora', documento: '1' };
test('extratos preservam centavos e distinguem entradas e saídas', () => {
  const items = proposedBatchSchema.parse([receita, { ...receita, tipo: 'Despesa', valor: 20.50 }]);
  expect(items[0].valor - items[1].valor).toBe(79.75);
});
test('revisão rejeita datas impossíveis e valores negativos', () => {
  expect(proposedBatchSchema.safeParse([{ ...receita, data: '2026-02-30' }]).success).toBe(false);
  expect(proposedBatchSchema.safeParse([{ ...receita, valor: -10 }]).success).toBe(false);
});
test('duplicatas do mesmo extrato não duplicam o caixa', () => {
  expect(uniqueProposals([receita, receita, { ...receita, banco: 'Bradesco' }])).toHaveLength(2);
});