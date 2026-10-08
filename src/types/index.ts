export interface Evento {
  id: string;
  nome: string;
  dataInicio: string;
  dataFim: string;
  tipo: string;
  pauta?: string;
  diretorias: string[];
}

export interface MesExecutado {
  mes: number;
  nome_mes: string;
  faturamento_mes: number;
  faturamento_acumulado: number;
  meta_mes: number;
  percentual_meta: number;
  contratos: number;
  membros_executores: number;
}

export interface IndicadoresPEBrasilJunior {
  essenciais: {
    faturamento_total: {
      nome: string;
      meta: number;
      realizado: number;
      percentual: number;
      status: string;
    };
    projetos_solucoes: {
      nome: string;
      meta: number;
      realizado: number;
      percentual: number;
      status: string;
    };
    membros_que_executam: {
      nome: string;
      meta_percentual: number;
      realizado_percentual: number;
      quantidade_executores: number;
      status: string;
    };
    satisfacao_cliente: {
      nome: string;
      csat: number;
      meta_csat: number;
      nps: number;
      meta_nps: number;
      coleta_percentual: number;
      status: string;
    };
    selo_ej: {
      nome: string;
      status: string;
      regular: boolean;
      descricao: string;
    };
  };
  complementares: {
    faturamento_por_membro: {
      nome: string;
      valor: number;
      unidade: string;
    };
    rede_colaborativa: {
      nome: string;
      meta_percentual: number;
      realizado_percentual: number;
      faturamento_colaborativo: number;
      parceiros: string;
    };
    diversidade_inclusao: {
      nome: string;
      membros_minorizados_percentual: number;
      politicas_di_adotadas: string;
    };
    tempo_medio_contrato: {
      nome: string;
      dias: number;
      unidade: string;
    };
    engajamento_mej: {
      nome: string;
      percentual: number;
      membros: number;
    };
    solucoes_inovadoras: {
      nome: string;
      ods_contempladas: number;
      solucoes_inovadoras: number;
    };
  };
}

export interface EJ {
  id: string;
  id_ej?: string;
  nome: string;
  slug?: string;
  logo_url?: string;
  cluster: 1 | 2 | 3 | 4 | 5;
  cnpj: string;
  regiao: string;
  localizacao: string;
  cidade?: string;
  ies?: string;
  cursos_admitidos?: string;
  ano_fundacao?: number;
  ano_federacao?: number;
  email?: string;
  website?: string;
  membros_ativos?: number;
  farol?: 'protagonista' | 'verde' | 'amarelo' | 'vermelho';
  farol_original?: string;
  guardiao_ddr?: string;
  batalha?: string;
  classificacao?: string;
  faturamentoMeta: number;
  faturamentoAtual: number;
  faturamentoQ1?: number;
  faturamentoQ2?: number;
  faturamentoQ3?: number;
  faturamentoQ4?: number;
  financeiro?: {
    meta_anual: number;
    faturamento_realizado: number;
    percentual_alcance: number;
    ticket_medio: number;
    faturamento_por_membro: number;
    meses_executados: MesExecutado[];
  };
  membros?: {
    total_ativos: number;
    executores_mes: number;
    percentual_executores: number;
    faturamento_por_membro_mes: number;
    retencao_1_ano_percentual: number;
    diversidade_minorizados_percentual: number;
    engajamento_mej_quantidade: number;
    engajamento_mej_percentual: number;
  };
  indicadores_pe_brasil_junior?: IndicadoresPEBrasilJunior;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
  data: string;
  status: 'realizado' | 'projetado';
  isRecorrente?: boolean;
  recorrenciaMeses?: number;
  ejId?: string;
  parceiroNome?: string;
  custoEmbutido?: number;
  jurosAplicados?: number;
}

export interface TipoTransacao {
  id: string;
  nome: string;
  tipo: 'entrada' | 'saida' | 'ambos';
}

export interface Anuidade {
  id: string;
  ejId: string;
  ano: number;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago' | 'atrasado';
  jurosPercentual: number;
  valorJuros: number;
  ejNome?: string;
}

export interface Documento {
  id: string;
  nome: string;
  etapa: 1 | 2 | 3 | 4;
  descricao?: string;
}

export interface EntregaDocumento {
  id: string;
  ejId: string;
  documentoId: string;
  dataEntrega?: string;
  entregue: boolean;
  ejNome?: string;
  documentoNome?: string;
  documentoEtapa?: number;
}

export interface Ciclo {
  id: string;
  nome: string;
  tipo: 'estrategico' | 'tatico' | 'operacional';
  numero: number;
  ano: number;
  dataInicio?: string;
  dataFim?: string;
}

export interface OKREstrategica {
  id: string;
  titulo: string;
  descricao?: string;
  ano: number;
  objetivos?: Objetivo[];
}

export interface Objetivo {
  id: string;
  titulo: string;
  descricao?: string;
  nivel: 'estrategico' | 'tatico' | 'operacional';
  okrEstrategicaId?: string;
  diretoria?: string;
  objetivoPaiId?: string;
  cicloId?: string;
  keyResults?: KeyResult[];
}

export interface KeyResult {
  id: string;
  objetivoId: string;
  titulo: string;
  descricao?: string;
  tipoMetrica: 'valor' | 'quantidade' | 'porcentagem';
  meta: number;
  atual: number;
  unidade?: string;
}

export interface FaturamentoMensal {
  id: string;
  ejId: string;
  ano: number;
  mes: number;
  valor: number;
  metaMes: number;
}

// Faróis de faturamento
export type FarolStatus = 'azul' | 'verde' | 'amarelo' | 'vermelho' | 'preto';

export type TabType = 'calendar' | 'ddr' | 'operations' | 'presidency' | 'business' | 'formation' | 'council' | 'strategic';

export type ViewMode = 'list' | 'month' | 'year';

export const DIRETORIAS = [
  'Presidência Executiva',
  'Presidência do Conselho',
  'VP Negócios',
  'Operações',
  'DDR',
  'Formação Empreendedora'
] as const;

export const DIRETORIAS_SIGLAS: Record<string, string> = {
  'Presidência Executiva': 'PRESEX',
  'Presidência do Conselho': 'PRESCON',
  'VP Negócios': 'VPNEG',
  'Operações': 'DOP',
  'DDR': 'DDR',
  'Formação Empreendedora': 'DFE'
};

export type Diretoria = typeof DIRETORIAS[number];

// ==========================================
// RioJunior 2026 - Movimentações Financeiras
// ==========================================
export interface MovimentacaoRioJunior {
  id: string;
  tipo: 'Despesa' | 'Receita';
  dataEfetiva: string;
  valorEfetivo: number;
  descricao: string;
  categoria: string;
  subcategoria: string;
  projeto: string;
  conta: 'ASAAS' | 'BANCO DO BRASIL' | 'BRADESCO' | 'CORA' | 'PAGBANK' | string;
  contaTransferencia?: string;
  centroCusto: string;
  contato?: string;
  observacoes?: string;
  dataCompetencia?: string;
  mesNum?: number;
  mesComp?: string;
  documento?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaxonomyRioJunior {
  tipos: string[];
  contas: string[];
  centrosCusto: string[];
  projetos: string[];
  categorias: string[];
  subcategorias: string[];
  meses: { num: number; nome: string }[];
  initialBalances: Record<string, number>;
  categoriesByType: {
    Despesa: string[];
    Receita: string[];
  };
  subcategoriesByCategory: Record<string, string[]>;
  contacts: string[];
}

export interface MonthBankData {
  mesNum: number;
  mesNome: string;
  entradas: number;
  saidas: number;
  resultado: number;
  saldoAcumulado: number;
}

export interface BankAccountDetails {
  saldoInicial: number;
  totalEntradas: number;
  totalSaidas: number;
  resultadoTotal: number;
  saldoAtual: number;
  months: MonthBankData[];
}

export interface BankAccountsViewData {
  initialTotal: number;
  totalEntradas: number;
  totalSaidas: number;
  resultadoConsolidado: number;
  saldoAtualConsolidado: number;
  accounts: Record<string, BankAccountDetails>;
  consolidatedMonthly: MonthBankData[];
}

export interface FinancialSummaryRioJunior {
  saldoInicialTotal: number;
  totalReceitas: number;
  totalDespesas: number;
  resultadoLiquido: number;
  saldoAtualConsolidado: number;
  totalMovimentacoes: number;
  monthly: {
    mesNum: number;
    mesNome: string;
    receitas: number;
    despesas: number;
    resultado: number;
  }[];
  accounts: Record<string, {
    receitas: number;
    despesas: number;
    net: number;
    saldoInicial: number;
    saldoAtual: number;
  }>;
  costCenters: Record<string, number>;
  topCategories: { name: string; value: number }[];
}

export interface DFCReport {
  entradas: { categoria: string; total: number; percent: number }[];
  despesas: { categoria: string; total: number; percent: number }[];
  totalEntradas: number;
  totalDespesas: number;
  resultadoOperacional: number;
}

export interface IniciativaMetrica {
  categoriaGrupo: string;
  iniciativa: string;
  receitas: number;
  despesas: number;
  resultado: number;
  margem: number;
  roi: number;
}

export interface CaixaMinimoMonth {
  mesNum: number;
  mesNome: string;
  entradas: {
    anuidade: number;
    vendaProduto: number;
    parceriasPatrocinios: number;
    eventos: number;
    outrasReceitas: number;
    total: number;
  };
  saidas: {
    taxasImpostos: number;
    custoProdutos: number;
    custoEvento: number;
    investimentoOrganizacao: number;
    investimentoMembro: number;
    investimentoRede: number;
    outrasDespesas: number;
    total: number;
  };
  saldoInicial: number;
  resultado: number;
  saldoFinal: number;
  responsavel?: string;
  cargo?: string;
}

export interface AnaliseGeralData {
  saldoInicialTotal: number;
  saldoAtualConsolidado: number;
  variacaoTotal: number;
  caixaSeparado: {
    rioJunior: number;
    efej: number;
    outrasIniciativas: number;
  };
  saldosContas: Record<string, number>;
  indicadoresExecutivos: {
    receitaTotal: number;
    despesaTotal: number;
    resultadoTotal: number;
    receitaMediaMensal: number;
    despesaMediaMensal: number;
    despesasOperacionais: number;
    mediaMensalDespesasOperacionais: number;
    composicaoReceitas: {
      anuidade: { valor: number; percent: number };
      vendaIngressos: { valor: number; percent: number };
      outrasReceitas: { valor: number; percent: number };
      receitasRecorrentes: { valor: number; percent: number };
    };
    sustentabilidade: {
      coberturaDespesasOperacionais: number;
      reservaOperacionalMeses: number;
      runwayMeses: number;
      margemOperacional: number;
    };
  };
  fluxoCaixaResumido: {
    mes: string;
    entradas: number;
    saidas: number;
    resultado: number;
    saldo: number;
  }[];
}

export interface PlanoContaItem {
  conta: string;
  centroCusto: string;
  isCategoriaPai: boolean;
  tipo: 'Receita' | 'Despesa';
}
