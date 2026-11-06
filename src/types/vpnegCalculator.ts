// src/types/vpnegCalculator.ts
// Estrutura fiel à planilha [Calculadora] Ações e Parceiros _ VPNeg 2026.xlsx

export type CalculadoraBlocoId =
  | 'consciencia'
  | 'interesse_programas'
  | 'produtos_conexao'
  | 'conversao_ps';

export interface FonteCalculoParam {
  id: string;
  celula: string; // A2..A12
  descricao: string;
  fonte: string;
  valor: number; // Valor base ou override
  isFormula?: boolean;
  formulaLabel?: string;
  override?: number | null; // Se preenchido, sobrescreve a fórmula
}

export interface MarkupConfig {
  custosFixos2024: number;
  custosFixosFonte: string;
  despesasFixas2024: number;
  despesasFixasFonte: string;
  faturamento2024: number;
  faturamentoFonte: string;
  dfFat: number; // C7: 21.39 (%)
  dvFat: number; // C8: 1.097 (%)
  mlGeral: number; // C9: 20 (%)
  mlEventos: number; // C10: 20 (%)
  mlEventosFonte: string;
  markupGeralOverride?: number | null;
  markupEventosOverride?: number | null;
  // Adicionais Fixos
  investJrMultiplicador: number; // C14: 1.15
  investJrDescricao: string;
  fundoImersaoMultiplicador: number; // C15: 1
  fundoImersaoDescricao: string;
  experienciaParceiroFixo: number; // C16: 500
  experienciaParceiroDescricao: string;
  // Terceirizada de Mídia
  terceirizadaMensalidade: number; // L5: 2520
  terceirizadaLimiteCreditos: number; // L6: 40
}

export interface MidiaCreditoItem {
  id: string;
  celulaPreco: string; // J5..J11
  acao: string;
  creditos: number; // G5..G11
  custoUnitarioOverride?: number | null;
  precoUnitarioOverride?: number | null;
}

export interface JornadaCustoItem {
  id: string;
  celulaPreco: string; // Q5..Q9
  acao: string;
  formulaCustoLabel: string;
  observacao?: string;
  custoOverride?: number | null;
  precoUnitarioOverride?: number | null;
}

export interface EventoCustoBaseItem {
  id: string;
  celulaPreco: string; // D21..D31
  acao: string;
  fonte: string;
  formulaCustoLabel: string;
  custoBase: number; // Para itens que são valor fixo (C21=3760, C25=126.88, C27=1445, C31=5126)
  custoOverride?: number | null;
  precoUnitarioOverride?: number | null;
}

export interface ModificadorEventoItem {
  id: string;
  celulaPreco: string; // J20..J28
  evento: string;
  publico: number; // H20, H23..H28
  tipoBase: 'magna' | 'paralela';
  isReferenciaCentralRio?: boolean;
  precoOverride?: number | null;
}

export interface CalculadoraActionRow {
  id: string;
  bloco: CalculadoraBlocoId;
  categoria: 'Consciência' | 'Interesse' | 'Conversão';
  acao: string;
  unidades: number;
  sugestaoPacote?: number; // F6..F11 no Plano de Comunicação
  refKey: string; // Chave que aponta para o preço calculado na Base de Custos
  refFormulaExcel: string; // Ex: "'Base de Custos | Fixos e Ações'!J5"
  multiplicadorFormula?: number; // Ex: 0.85 para EFEJ ano seguinte
  valorPraticadoOverride?: number | null; // Permite editar o valor praticado diretamente na calculadora
}

export interface CatalogoAcaoRow {
  id: string;
  categoria: 'Consciência' | 'Interesse' | 'Conversão';
  acao: string;
  etapa: string;
  refKey?: string; // Se vinculado a um preço numérico da base
  precoTextoFixo?: string; // Ex: "Combinação das unidades de itens abaixo"
  precoOverride?: number | null;
  descricao: string;
  kpis: string;
}

export interface KPIRegistroRow {
  id: string;
  acao: string;
  parceiro: string;
  dataAcao: string;
  evento: string;
  empresariosImpactados: number | null;
  // Consciência
  curtidas: number | null;
  mencoes: number | null;
  interacoes: number | null;
  comentarios: number | null;
  // Interesse
  nps: number | null;
  awarenessPre: number | null;
  awarenessPos: number | null;
  interessePre: number | null;
  interessePos: number | null;
  empregabilidadePre: number | null;
  empregabilidadePos: number | null;
  // Conversão
  contatosIndicados: number | null;
  inscricoesFacilitadas: number | null;
  conversoes: number | null;
}

export interface SimulacaoSalva {
  id: string;
  nomeProposta: string;
  parceiroNome: string;
  parceiroCardId?: string;
  criadoEm: string;
  descontoManual: number;
  observacoes?: string;
  unidadesPorItem: Record<string, number>;
  overridesPorItem: Record<string, number | null>;
  totalCalculado: number;
  totalFinal: number;
}

export interface VPNegCalculatorState {
  markupConfig: MarkupConfig;
  fonteCalculos: FonteCalculoParam[];
  midiaItens: MidiaCreditoItem[];
  jornadaItens: JornadaCustoItem[];
  eventosCustosBase: EventoCustoBaseItem[];
  modificadoresEventos: ModificadorEventoItem[];
  fatorAntecipadoEFEJ: number; // 0.85
  calculadoraRows: CalculadoraActionRow[];
  catalogoRows: CatalogoAcaoRow[];
  kpiRegistros: KPIRegistroRow[];
  simulacoesSalvas: SimulacaoSalva[];
  descontoPropostaAtual: number;
  parceiroPropostaAtual: string;
}

