import type { CellBase, Matrix } from 'react-spreadsheet';

export interface GradePage {
  id: string;
  name: string;
  data: Matrix<CellBase<string>>;
}

export const GRADE_HEADERS = ['Dia', 'Início', 'Fim', 'Duração', 'Tipo de atividade', 'Descrição / tema', 'Responsável / palestrante', 'Substituto', 'Local / sala', 'Rodada', 'Observações'];

export function createPage(name = 'Versão 1', headers = GRADE_HEADERS): GradePage {
  return { id: crypto.randomUUID(), name, data: [headers.map(value => ({ value })), ...Array.from({ length: 12 }, () => headers.map(() => ({ value: '' })))] };
}

export function duplicatePage(page: GradePage): GradePage {
  return { ...structuredClone(page), id: crypto.randomUUID(), name: `${page.name} — cópia` };
}

export function insertRow(data: GradePage['data'], index: number): GradePage['data'] {
  const next = structuredClone(data);
  next.splice(index, 0, Array.from({ length: Math.max(1, ...data.map(row => row.length)) }, () => ({ value: '' })));
  return next;
}

export function insertColumn(data: GradePage['data'], index: number): GradePage['data'] {
  return data.map(row => { const next = [...row]; next.splice(index, 0, { value: '' }); return next; });
}

export function normalizeData(data: Matrix<CellBase>): GradePage['data'] {
  const width = Math.max(1, ...data.map(row => row.length));
  return data.map(row => Array.from({ length: width }, (_, col) => ({ value: String(row[col]?.value ?? '') })));
}