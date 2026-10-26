type Movement = { id: string; tipo: string; valorEfetivo: number; conta: string; dataEfetiva: string };
export function financialDelta(current: Movement[], baseline: Movement[]) {
  let receitas = 0; let despesas = 0;
  const bancos: Record<string, number> = {};
  for (const [items, factor] of [[current, 1], [baseline, -1]] as const) {
    for (const item of items) {
      const amount = Math.round(Number(item.valorEfetivo) * 100) * factor;
      if (item.tipo === 'Receita') receitas += amount;
      else if (item.tipo === 'Despesa') despesas += amount;
      bancos[item.conta] = (bancos[item.conta] ?? 0) + (item.tipo === 'Receita' ? amount : -amount);
    }
  }
  return { receitas: receitas / 100, despesas: despesas / 100, saldo: (receitas - despesas) / 100, bancos: Object.fromEntries(Object.entries(bancos).map(([bank, cents]) => [bank, cents / 100])) };
}