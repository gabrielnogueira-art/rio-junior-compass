import rawTaxonomy from '@/data/taxonomy.json';
import rawTransactions from '@/data/transactions.json';
import { 
  MovimentacaoRioJunior, 
  TaxonomyRioJunior, 
  FinancialSummaryRioJunior, 
  BankAccountsViewData,
  BankAccountDetails,
  MonthBankData,
  DFCReport 
} from '@/types';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const ACCOUNTS = ['CORA', 'ASAAS', 'PAGBANK', 'BANCO DO BRASIL', 'BRADESCO'];

const STORAGE_KEY = 'riojunior_movimentacoes_2026';

class MovimentacoesService {
  private memoryTransactions: MovimentacaoRioJunior[] = [];
  private taxonomy: TaxonomyRioJunior = rawTaxonomy as unknown as TaxonomyRioJunior;
  private isBackendAvailable: boolean | null = null;

  constructor() {
    this.initStore();
  }

  private initStore() {
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

  public getTaxonomy(): TaxonomyRioJunior {
    return this.taxonomy;
  }

  public async getSummary(): Promise<FinancialSummaryRioJunior> {
    if (await this.checkBackend()) {
      try {
        const res = await fetch('/api/summary');
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API summary failed, using local calculations:', err);
      }
    }

    const txs = this.memoryTransactions;
    const initialBalances = this.taxonomy.initialBalances || {
      'ASAAS': 4679.52,
      'BANCO DO BRASIL': 13299.14,
      'BRADESCO': 4813.15,
      'CORA': 34011.18,
      'PAGBANK': 65.10
    };

    let saldoInicialTotal = 0;
    Object.values(initialBalances).forEach(b => saldoInicialTotal += b);

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
      const cat = t.categoria || 'Outros';

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

    return {
      saldoInicialTotal,
      totalReceitas,
      totalDespesas,
      resultadoLiquido: totalReceitas - totalDespesas,
      saldoAtualConsolidado: saldoInicialTotal + (totalReceitas - totalDespesas),
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
    subcategoria?: string;
    centroCusto?: string;
    projeto?: string;
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
        (t.projeto && t.projeto.toLowerCase().includes(q))
      );
    }

    if (filters.tipo && filters.tipo !== 'ALL') {
      list = list.filter(t => t.tipo === filters.tipo);
    }
    if (filters.conta && filters.conta !== 'ALL') {
      list = list.filter(t => t.conta === filters.conta);
    }
    if (filters.categoria && filters.categoria !== 'ALL') {
      list = list.filter(t => t.categoria === filters.categoria);
    }
    if (filters.subcategoria && filters.subcategoria !== 'ALL') {
      list = list.filter(t => t.subcategoria === filters.subcategoria);
    }
    if (filters.centroCusto && filters.centroCusto !== 'ALL') {
      list = list.filter(t => t.centroCusto === filters.centroCusto);
    }
    if (filters.projeto && filters.projeto !== 'ALL') {
      list = list.filter(t => t.projeto === filters.projeto);
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
    if (await this.checkBackend()) {
      try {
        const res = await fetch('/api/bank-accounts');
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API bank-accounts failed, using local matrix:', err);
      }
    }

    const txs = this.memoryTransactions;
    const initialBalances = this.taxonomy.initialBalances || {
      'ASAAS': 4679.52,
      'BANCO DO BRASIL': 13299.14,
      'BRADESCO': 4813.15,
      'CORA': 34011.18,
      'PAGBANK': 65.10
    };

    let initialTotal = 0;
    Object.values(initialBalances).forEach(b => initialTotal += b);

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
      accountsData[acc].saldoAtual = runSaldo;
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
      saldoAtualConsolidado: runConsolidado,
      accounts: accountsData,
      consolidatedMonthly: consolidatedMonths
    };
  }

  public async getDFCReport(): Promise<DFCReport> {
    if (await this.checkBackend()) {
      try {
        const res = await fetch('/api/reports/dfc');
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API DFC failed, using local calculations:', err);
      }
    }

    const txs = this.memoryTransactions;
    const entradasCat: Record<string, number> = {};
    const despesasCat: Record<string, number> = {};
    let totalEntradas = 0;
    let totalDespesas = 0;

    txs.forEach(t => {
      const val = Number(t.valorEfetivo) || 0;
      const cat = t.categoria || 'Outros';
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
      conta: data.conta || 'CORA',
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

    if (await this.checkBackend()) {
      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTx)
        });
        if (res.ok) {
          const created = await res.json();
          this.memoryTransactions.unshift(created);
          this.saveToStorage();
          return created;
        }
      } catch (err) {
        console.warn('Backend create failed, storing locally:', err);
      }
    }

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

    if (await this.checkBackend()) {
      try {
        await fetch(`/api/transactions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
      } catch (err) {
        console.warn('Backend update failed:', err);
      }
    }

    this.memoryTransactions[idx] = updated;
    this.saveToStorage();
    return updated;
  }

  public async deleteTransaction(id: string): Promise<boolean> {
    if (await this.checkBackend()) {
      try {
        await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Backend delete failed:', err);
      }
    }

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
    if (await this.checkBackend()) {
      try {
        const res = await fetch('/api/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
        if (res.ok) {
          const result = await res.json();
          this.memoryTransactions.unshift(result.debit, result.credit);
          this.saveToStorage();
          return result;
        }
      } catch (err) {
        console.warn('Backend transfer failed, executing locally:', err);
      }
    }

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

  public async syncToExcel(): Promise<{ ok: boolean; message: string }> {
    if (await this.checkBackend()) {
      try {
        const res = await fetch('/api/sync/excel', { method: 'POST' });
        if (res.ok) {
          return await res.json();
        }
      } catch (err: any) {
        return { ok: false, message: 'Erro ao conectar ao servidor local: ' + err.message };
      }
    }
    return { ok: false, message: 'Servidor local do sistema de movimentações não está acessível no momento.' };
  }

  public exportCSV(filteredData?: MovimentacaoRioJunior[]) {
    const list = filteredData || this.memoryTransactions;
    const headers = [
      'ID', 'Tipo', 'Data Efetiva', 'Valor Efetivo', 'Descrição', 'Categoria',
      'Subcategoria', 'Projeto', 'Conta Bancária', 'Conta Transferência',
      'Centro de Custo', 'Contato/Fornecedor', 'Observações', 'Mês Competência'
    ];

    const rows = list.map(t => [
      t.id,
      t.tipo,
      t.dataEfetiva,
      (Number(t.valorEfetivo) || 0).toFixed(2).replace('.', ','),
      `"${(t.descricao || '').replace(/"/g, '""')}"`,
      `"${(t.categoria || '').replace(/"/g, '""')}"`,
      `"${(t.subcategoria || '').replace(/"/g, '""')}"`,
      `"${(t.projeto || '').replace(/"/g, '""')}"`,
      t.conta,
      t.contaTransferencia || '',
      `"${(t.centroCusto || '').replace(/"/g, '""')}"`,
      `"${(t.contato || '').replace(/"/g, '""')}"`,
      `"${(t.observacoes || '').replace(/"/g, '""')}"`,
      t.mesComp || ''
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `movimentacoes_riojunior_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const movimentacoesService = new MovimentacoesService();
