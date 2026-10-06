import rawTaxonomy from '@/data/taxonomy.json';
import rawTransactions from '@/data/transactions.json';
import rawIniciativas from '@/data/iniciativasData.json';
import rawCaixaMinimo from '@/data/caixaMinimoData.json';
import rawAnaliseGeral from '@/data/analiseGeralData.json';
import rawPlanoContas from '@/data/planoContasData.json';

import { 
  MovimentacaoRioJunior, 
  TaxonomyRioJunior, 
  FinancialSummaryRioJunior, 
  BankAccountsViewData,
  BankAccountDetails,
  MonthBankData,
  DFCReport,
  IniciativaMetrica,
  CaixaMinimoMonth,
  AnaliseGeralData,
  PlanoContaItem
} from '@/types';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const ACCOUNTS = ['Cora', 'Asaas', 'PagBank', 'Banco do Brasil', 'Bradesco'];

const STORAGE_KEY = 'riojunior_movimentacoes_2026_v3';
const TAXONOMY_STORAGE_KEY = 'riojunior_taxonomy_2026_custom_v1';

class MovimentacoesService {
  private memoryTransactions: MovimentacaoRioJunior[] = [];
  private taxonomy: TaxonomyRioJunior = rawTaxonomy as unknown as TaxonomyRioJunior;
  private iniciativas: IniciativaMetrica[] = rawIniciativas as unknown as IniciativaMetrica[];
  private caixaMinimo: CaixaMinimoMonth[] = rawCaixaMinimo as unknown as CaixaMinimoMonth[];
  private analiseGeral: AnaliseGeralData = rawAnaliseGeral as unknown as AnaliseGeralData;
  private planoContas: PlanoContaItem[] = rawPlanoContas as unknown as PlanoContaItem[];
  private isBackendAvailable: boolean | null = null;

  constructor() {
    this.initStore();
  }

  private loadTaxonomyFromStorage() {
    try {
      const storedTax = localStorage.getItem(TAXONOMY_STORAGE_KEY);
      if (storedTax) {
        this.taxonomy = JSON.parse(storedTax);
      }
    } catch (e) {
      console.warn('Failed to load custom taxonomy from localStorage:', e);
    }
  }

  private initStore() {
    this.loadTaxonomyFromStorage();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.memoryTransactions = JSON.parse(stored);
      } else {
        this.memoryTransactions = (rawTransactions as unknown as MovimentacaoRioJunior[]).map(t => ({
          ...t,
          valorEfetivo: Number(t.valorEfetivo) || 0
        }));
        this.saveToStorage();
      }
    } catch {
      this.memoryTransactions = (rawTransactions as unknown as MovimentacaoRioJunior[]).map(t => ({
        ...t,
        valorEfetivo: Number(t.valorEfetivo) || 0
      }));
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memoryTransactions));
    } catch (e) {
      console.warn('LocalStorage quota or disabled:', e);
    }
  }

  public async checkBackend(): Promise<boolean> {
    try {
      const res = await fetch('/api/status', { method: 'GET', signal: AbortSignal.timeout(1500) });
      this.isBackendAvailable = res.ok;
      return res.ok;
    } catch {
      this.isBackendAvailable = false;
      return false;
    }
  }

  public updateTaxonomy(updated: TaxonomyRioJunior): TaxonomyRioJunior {
    this.taxonomy = updated;
    try {
      localStorage.setItem(TAXONOMY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save taxonomy to localStorage:', e);
    }
    return this.taxonomy;
  }

  public resetTaxonomy(): TaxonomyRioJunior {
    this.taxonomy = rawTaxonomy as unknown as TaxonomyRioJunior;
    try {
      localStorage.removeItem(TAXONOMY_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear taxonomy storage:', e);
    }
    return this.taxonomy;
  }

  public getTaxonomy(): TaxonomyRioJunior {
    return this.taxonomy;
  }

  public getIniciativas(): IniciativaMetrica[] {
    return this.iniciativas;
  }

  public getCaixaMinimo(): CaixaMinimoMonth[] {
    return this.caixaMinimo;
  }

  public getAnaliseGeral(): AnaliseGeralData {
    return this.analiseGeral;
  }

  public getPlanoContas(): PlanoContaItem[] {
    return this.planoContas;
  }

  public async getSummary(): Promise<FinancialSummaryRioJunior> {
    const txs = this.memoryTransactions;
    const initialBalances = this.taxonomy.initialBalances || {
      'Asaas': 4679.52,
      'Banco do Brasil': 13299.14,
      'Bradesco': 4813.15,
      'Cora': 34011.18,
      'PagBank': 65.10
    };

    let saldoInicialTotal = 56868.09;
    let totalReceitas = 0;
    let totalDespesas = 0;

    const monthlyMap: Record<string, { mesNum: number; mesNome: string; receitas: number; despesas: number; resultado: number }> = {};
    MONTH_NAMES.forEach((m, idx) => {
      monthlyMap[m] = { mesNum: idx + 1, mesNome: m, receitas: 0, despesas: 0, resultado: 0 };
    });

    const accountsMap: Record<string, { receitas: number; despesas: number; net: number; saldoInicial: number; saldoAtual: number }> = {};
    ACCOUNTS.forEach(acc => {
      const init = initialBalances[acc] || 0;
      accountsMap[acc] = { receitas: 0, despesas: 0, net: 0, saldoInicial: init, saldoAtual: init };
    });

    const costCentersMap: Record<string, number> = {};
    const categoriesMap: Record<string, number> = {};

    txs.forEach(t => {
      const val = Number(t.valorEfetivo) || 0;
      const mes = t.mesComp || MONTH_NAMES[(t.mesNum || 1) - 1];
      const acc = t.conta;
      const cc = t.centroCusto || 'Operações';
      const cat = (t as any).categoriaCaixaMinimo || t.categoria || 'Outros';

      if (t.tipo === 'Receita') {
        totalReceitas += val;
        if (monthlyMap[mes]) monthlyMap[mes].receitas += val;
        if (accountsMap[acc]) {
          accountsMap[acc].receitas += val;
          accountsMap[acc].net += val;
          accountsMap[acc].saldoAtual += val;
        }
      } else if (t.tipo === 'Despesa') {
        totalDespesas += val;
        if (monthlyMap[mes]) monthlyMap[mes].despesas += val;
        if (accountsMap[acc]) {
          accountsMap[acc].despesas += val;
          accountsMap[acc].net -= val;
          accountsMap[acc].saldoAtual -= val;
        }
        costCentersMap[cc] = (costCentersMap[cc] || 0) + val;
        categoriesMap[cat] = (categoriesMap[cat] || 0) + val;
      }
    });

    MONTH_NAMES.forEach(m => {
      monthlyMap[m].resultado = monthlyMap[m].receitas - monthlyMap[m].despesas;
    });

    const topCategories = Object.entries(categoriesMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // If we have analiseGeral from spreadsheet, use official current balances
    if (this.analiseGeral && this.analiseGeral.saldosContas) {
      Object.entries(this.analiseGeral.saldosContas).forEach(([acc, val]) => {
        if (accountsMap[acc]) {
          accountsMap[acc].saldoAtual = val;
        }
      });
    }

    const saldoAtualConsolidado = this.analiseGeral?.saldoAtualConsolidado || (saldoInicialTotal + (totalReceitas - totalDespesas));

    return {
      saldoInicialTotal,
      totalReceitas: this.analiseGeral?.indicadoresExecutivos?.receitaTotal || totalReceitas,
      totalDespesas: this.analiseGeral?.indicadoresExecutivos?.despesaTotal || totalDespesas,
      resultadoLiquido: this.analiseGeral?.indicadoresExecutivos?.resultadoTotal || (totalReceitas - totalDespesas),
      saldoAtualConsolidado,
      totalMovimentacoes: txs.length,
      monthly: Object.values(monthlyMap),
      accounts: accountsMap,
      costCenters: costCentersMap,
      topCategories
    };
  }

  public async getTransactions(filters: {
    search?: string;
    tipo?: string;
    conta?: string;
    categoria?: string;
    centroCusto?: string;
    iniciativa?: string;
    tipoIniciativa?: string;
    categoriaCaixaMinimo?: string;
    mes?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: MovimentacaoRioJunior[]; total: number; filteredReceitas: number; filteredDespesas: number; filteredSaldo: number }> {
    let list = [...this.memoryTransactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(t => 
        (t.descricao && t.descricao.toLowerCase().includes(q)) ||
        (t.contato && t.contato.toLowerCase().includes(q)) ||
        (t.documento && t.documento.toLowerCase().includes(q)) ||
        (t.observacoes && t.observacoes.toLowerCase().includes(q)) ||
        ((t as any).planoConta && (t as any).planoConta.toLowerCase().includes(q)) ||
        ((t as any).iniciativa && (t as any).iniciativa.toLowerCase().includes(q))
      );
    }

    if (filters.tipo && filters.tipo !== 'ALL') {
      list = list.filter(t => t.tipo === filters.tipo);
    }
    if (filters.conta && filters.conta !== 'ALL') {
      list = list.filter(t => t.conta.toLowerCase() === filters.conta.toLowerCase());
    }
    if (filters.categoria && filters.categoria !== 'ALL') {
      list = list.filter(t => t.categoria === filters.categoria || (t as any).planoConta === filters.categoria);
    }
    if (filters.centroCusto && filters.centroCusto !== 'ALL') {
      list = list.filter(t => t.centroCusto === filters.centroCusto);
    }
    if (filters.iniciativa && filters.iniciativa !== 'ALL') {
      list = list.filter(t => (t as any).iniciativa === filters.iniciativa);
    }
    if (filters.tipoIniciativa && filters.tipoIniciativa !== 'ALL') {
      list = list.filter(t => (t as any).tipoIniciativa === filters.tipoIniciativa);
    }
    if (filters.categoriaCaixaMinimo && filters.categoriaCaixaMinimo !== 'ALL') {
      list = list.filter(t => (t as any).categoriaCaixaMinimo === filters.categoriaCaixaMinimo);
    }
    if (filters.mes && filters.mes !== 'ALL') {
      list = list.filter(t => t.mesComp === filters.mes || String(t.mesNum) === filters.mes);
    }

    let filteredReceitas = 0;
    let filteredDespesas = 0;
    list.forEach(t => {
      const v = Number(t.valorEfetivo) || 0;
      if (t.tipo === 'Receita') filteredReceitas += v;
      else if (t.tipo === 'Despesa') filteredDespesas += v;
    });

    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      if (filters.sortBy === 'valorEfetivo') {
        return (Number(a.valorEfetivo) - Number(b.valorEfetivo)) * sortOrder;
      }
      const dateA = new Date(a.dataEfetiva || 0).getTime();
      const dateB = new Date(b.dataEfetiva || 0).getTime();
      return (dateA - dateB) * sortOrder;
    });

    const total = list.length;
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return {
      data: paginated,
      total,
      filteredReceitas,
      filteredDespesas,
      filteredSaldo: filteredReceitas - filteredDespesas
    };
  }

  public async getBankAccountsView(): Promise<BankAccountsViewData> {
    const txs = this.memoryTransactions;
    const initialBalances = this.taxonomy.initialBalances || {
      'Asaas': 4679.52,
      'Banco do Brasil': 13299.14,
      'Bradesco': 4813.15,
      'Cora': 34011.18,
      'PagBank': 65.10
    };

    let initialTotal = 56868.09;

    const accountsData: Record<string, BankAccountDetails> = {};
    ACCOUNTS.forEach(acc => {
      const init = initialBalances[acc] || 0;
      const months: MonthBankData[] = MONTH_NAMES.map((m, idx) => ({
        mesNum: idx + 1,
        mesNome: m,
        entradas: 0,
        saidas: 0,
        resultado: 0,
        saldoAcumulado: 0
      }));

      accountsData[acc] = {
        saldoInicial: init,
        totalEntradas: 0,
        totalSaidas: 0,
        resultadoTotal: 0,
        saldoAtual: init,
        months
      };
    });

    const consolidatedMonths: MonthBankData[] = MONTH_NAMES.map((m, idx) => ({
      mesNum: idx + 1,
      mesNome: m,
      entradas: 0,
      saidas: 0,
      resultado: 0,
      saldoAcumulado: 0
    }));

    txs.forEach(t => {
      const val = Number(t.valorEfetivo) || 0;
      const mIdx = (t.mesNum ? t.mesNum - 1 : 0);
      if (mIdx < 0 || mIdx > 11) return;
      const acc = t.conta;

      if (accountsData[acc]) {
        if (t.tipo === 'Receita') {
          accountsData[acc].months[mIdx].entradas += val;
          accountsData[acc].totalEntradas += val;
          consolidatedMonths[mIdx].entradas += val;
        } else if (t.tipo === 'Despesa') {
          accountsData[acc].months[mIdx].saidas += val;
          accountsData[acc].totalSaidas += val;
          consolidatedMonths[mIdx].saidas += val;
        }
      }
    });

    ACCOUNTS.forEach(acc => {
      let runSaldo = accountsData[acc].saldoInicial;
      accountsData[acc].months.forEach(m => {
        m.resultado = m.entradas - m.saidas;
        runSaldo += m.resultado;
        m.saldoAcumulado = runSaldo;
      });
      accountsData[acc].resultadoTotal = accountsData[acc].totalEntradas - accountsData[acc].totalSaidas;
      accountsData[acc].saldoAtual = this.analiseGeral?.saldosContas?.[acc] || runSaldo;
    });

    let runConsolidado = initialTotal;
    let totalEntradas = 0;
    let totalSaidas = 0;
    consolidatedMonths.forEach(m => {
      m.resultado = m.entradas - m.saidas;
      runConsolidado += m.resultado;
      m.saldoAcumulado = runConsolidado;
      totalEntradas += m.entradas;
      totalSaidas += m.saidas;
    });

    return {
      initialTotal,
      totalEntradas,
      totalSaidas,
      resultadoConsolidado: totalEntradas - totalSaidas,
      saldoAtualConsolidado: this.analiseGeral?.saldoAtualConsolidado || runConsolidado,
      accounts: accountsData,
      consolidatedMonthly: consolidatedMonths
    };
  }

  public async getDFCReport(): Promise<DFCReport> {
    const txs = this.memoryTransactions;
    const entradasCat: Record<string, number> = {};
    const despesasCat: Record<string, number> = {};
    let totalEntradas = 0;
    let totalDespesas = 0;

    txs.forEach(t => {
      const val = Number(t.valorEfetivo) || 0;
      const cat = (t as any).categoriaCaixaMinimo || t.categoria || 'Outros';
      if (t.tipo === 'Receita') {
        entradasCat[cat] = (entradasCat[cat] || 0) + val;
        totalEntradas += val;
      } else if (t.tipo === 'Despesa') {
        despesasCat[cat] = (despesasCat[cat] || 0) + val;
        totalDespesas += val;
      }
    });

    const entradas = Object.entries(entradasCat)
      .map(([categoria, total]) => ({
        categoria,
        total,
        percent: totalEntradas > 0 ? (total / totalEntradas) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total);

    const despesas = Object.entries(despesasCat)
      .map(([categoria, total]) => ({
        categoria,
        total,
        percent: totalDespesas > 0 ? (total / totalDespesas) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total);

    return {
      entradas,
      despesas,
      totalEntradas,
      totalDespesas,
      resultadoOperacional: totalEntradas - totalDespesas
    };
  }

  public getAllTransactions(): MovimentacaoRioJunior[] {
    return [...this.memoryTransactions];
  }

  public async createBatchTransactions(items: Partial<MovimentacaoRioJunior>[]): Promise<MovimentacaoRioJunior[]> {
    const created: MovimentacaoRioJunior[] = [];
    const baseTime = Date.now();

    for (let i = 0; i < items.length; i++) {
      const data = items[i];
      const dateObj = new Date(data.dataEfetiva || new Date().toISOString().split('T')[0]);
      const mesNum = isNaN(dateObj.getTime()) ? 1 : dateObj.getMonth() + 1;
      const mesComp = MONTH_NAMES[mesNum - 1] || 'Jan';

      const newTx: MovimentacaoRioJunior = {
        id: `${data.conta || 'EXTRATO'}-${(baseTime + i).toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000).toString(36).toUpperCase()}`,
        tipo: (data.tipo as 'Despesa' | 'Receita') || 'Despesa',
        dataEfetiva: data.dataEfetiva || new Date().toISOString().split('T')[0],
        valorEfetivo: Math.abs(Number(data.valorEfetivo) || 0),
        descricao: data.descricao || '',
        categoria: data.categoria || 'Outros',
        subcategoria: data.subcategoria || '',
        projeto: data.projeto || 'N/A',
        conta: data.conta || 'Cora',
        contaTransferencia: data.contaTransferencia || '',
        centroCusto: data.centroCusto || 'Operações',
        contato: data.contato || '',
        observacoes: data.observacoes || (data.documento ? `Doc: ${data.documento}` : ''),
        dataCompetencia: data.dataCompetencia || data.dataEfetiva || new Date().toISOString().split('T')[0],
        mesNum,
        mesComp,
        documento: data.documento || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      created.push(newTx);
    }

    this.memoryTransactions.unshift(...created);
    this.saveToStorage();
    return created;
  }

  public async createTransaction(data: Partial<MovimentacaoRioJunior>): Promise<MovimentacaoRioJunior> {
    const dateObj = new Date(data.dataEfetiva || new Date().toISOString().split('T')[0]);
    const mesNum = dateObj.getMonth() + 1;
    const mesComp = MONTH_NAMES[mesNum - 1];

    const newTx: MovimentacaoRioJunior = {
      id: `${data.conta || 'MANUAL'}-${Date.now().toString(36).toUpperCase()}`,
      tipo: (data.tipo as 'Despesa' | 'Receita') || 'Despesa',
      dataEfetiva: data.dataEfetiva || new Date().toISOString().split('T')[0],
      valorEfetivo: Number(data.valorEfetivo) || 0,
      descricao: data.descricao || '',
      categoria: data.categoria || 'Outros',
      subcategoria: data.subcategoria || '',
      projeto: data.projeto || 'N/A',
      conta: data.conta || 'Cora',
      contaTransferencia: data.contaTransferencia || '',
      centroCusto: data.centroCusto || 'Operações',
      contato: data.contato || '',
      observacoes: data.observacoes || '',
      dataCompetencia: data.dataEfetiva || new Date().toISOString().split('T')[0],
      mesNum,
      mesComp,
      documento: data.documento || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.memoryTransactions.unshift(newTx);
    this.saveToStorage();
    return newTx;
  }

  public async updateTransaction(id: string, updates: Partial<MovimentacaoRioJunior>): Promise<MovimentacaoRioJunior> {
    const idx = this.memoryTransactions.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Movimentação não encontrada');

    let mesNum = this.memoryTransactions[idx].mesNum;
    let mesComp = this.memoryTransactions[idx].mesComp;
    if (updates.dataEfetiva) {
      const dateObj = new Date(updates.dataEfetiva);
      mesNum = dateObj.getMonth() + 1;
      mesComp = MONTH_NAMES[mesNum - 1];
    }

    const updated: MovimentacaoRioJunior = {
      ...this.memoryTransactions[idx],
      ...updates,
      valorEfetivo: updates.valorEfetivo !== undefined ? Number(updates.valorEfetivo) : this.memoryTransactions[idx].valorEfetivo,
      mesNum,
      mesComp,
      updatedAt: new Date().toISOString()
    };

    this.memoryTransactions[idx] = updated;
    this.saveToStorage();
    return updated;
  }

  public async deleteTransaction(id: string): Promise<boolean> {
    this.memoryTransactions = this.memoryTransactions.filter(t => t.id !== id);
    this.saveToStorage();
    return true;
  }

  public async createTransfer(params: {
    contaOrigem: string;
    contaDestino: string;
    valorEfetivo: number;
    dataEfetiva: string;
    observacoes?: string;
  }): Promise<{ debit: MovimentacaoRioJunior; credit: MovimentacaoRioJunior }> {
    const debit = await this.createTransaction({
      tipo: 'Despesa',
      dataEfetiva: params.dataEfetiva,
      valorEfetivo: params.valorEfetivo,
      descricao: `Transferência para ${params.contaDestino}`,
      categoria: 'Transferência Interna',
      subcategoria: 'Transferência entre contas',
      projeto: 'N/A',
      conta: params.contaOrigem,
      contaTransferencia: params.contaDestino,
      centroCusto: 'Operações',
      observacoes: params.observacoes || 'Transferência interna'
    });

    const credit = await this.createTransaction({
      tipo: 'Receita',
      dataEfetiva: params.dataEfetiva,
      valorEfetivo: params.valorEfetivo,
      descricao: `Transferência de ${params.contaOrigem}`,
      categoria: 'Transferência Interna',
      subcategoria: 'Transferência entre contas',
      projeto: 'N/A',
      conta: params.contaDestino,
      contaTransferencia: params.contaOrigem,
      centroCusto: 'Operações',
      observacoes: params.observacoes || 'Transferência interna'
    });

    return { debit, credit };
  }

  public exportCSV(filteredData?: MovimentacaoRioJunior[]) {
    const list = filteredData || this.memoryTransactions;
    const headers = [
      'ID', 'Tipo', 'Data Efetiva', 'Valor Efetivo', 'Descrição', 'Banco',
      'Plano de Contas', 'Iniciativa', 'Tipo Iniciativa', 'Centro de Custo',
      'Categoria Caixa Mínimo', 'Contato', 'Mês'
    ];

    const rows = list.map(t => [
      t.id,
      t.tipo,
      t.dataEfetiva,
      (Number(t.valorEfetivo) || 0).toFixed(2).replace('.', ','),
      `"${(t.descricao || '').replace(/"/g, '""')}"`,
      t.conta,
      `"${((t as any).planoConta || t.categoria || '').replace(/"/g, '""')}"`,
      `"${((t as any).iniciativa || t.projeto || '').replace(/"/g, '""')}"`,
      `"${((t as any).tipoIniciativa || '').replace(/"/g, '""')}"`,
      `"${(t.centroCusto || '').replace(/"/g, '""')}"`,
      `"${((t as any).categoriaCaixaMinimo || '').replace(/"/g, '""')}"`,
      `"${(t.contato || '').replace(/"/g, '""')}"`,
      t.mesComp || ''
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `movimentacoes_riojunior_2026_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const movimentacoesService = new MovimentacoesService();
