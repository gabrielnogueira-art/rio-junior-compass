import { test, expect } from 'bun:test';
import { financialDelta } from './finance-impact';
test('extrato confirmado altera caixa e saldo do respectivo banco pelos centavos exatos', () => {
  const delta = financialDelta([{ id: '1', tipo: 'Receita', valorEfetivo: 100.25, conta: 'Cora', dataEfetiva: '2026-10-26' }, { id: '2', tipo: 'Despesa', valorEfetivo: 20.50, conta: 'Bradesco', dataEfetiva: '2026-10-26' }], []);
  expect(delta).toEqual({ receitas: 100.25, despesas: 20.50, saldo: 79.75, bancos: { Cora: 100.25, Bradesco: -20.50 } });
});