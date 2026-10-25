/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { createPage, duplicatePage, insertColumn, insertRow } from './contentWorkbook';

describe('grade livre', () => {
  test('novas colunas aceitam tópicos não predefinidos', () => {
    const page = createPage();
    const expanded = insertColumn(page.data, 2);
    expanded[0][2] = { value: 'Materiais de uma dinâmica inédita' };
    expect(expanded[0].length).toBe(page.data[0].length + 1);
    expect(expanded[0][2]?.value).toBe('Materiais de uma dinâmica inédita');
  });
  test('novas linhas preservam os momentos existentes e valores vazios', () => {
    const page = createPage();
    page.data[1][0] = { value: 'em paralelo' };
    const expanded = insertRow(page.data, 1);
    expect(expanded.length).toBe(page.data.length + 1);
    expect(expanded[1][0]?.value).toBe('');
    expect(expanded[2][0]?.value).toBe('em paralelo');
  });
  test('duplicar versão não altera a página original', () => {
    const original = createPage('Grade aprovada');
    original.data[1][0] = { value: '09:00' };
    const copy = duplicatePage(original);
    copy.data[1][0] = { value: '10:00' };
    expect(copy.id).not.toBe(original.id);
    expect(original.data[1][0]?.value).toBe('09:00');
    expect(copy.data[1][0]?.value).toBe('10:00');
  });
});