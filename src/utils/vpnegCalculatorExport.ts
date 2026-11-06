// src/utils/vpnegCalculatorExport.ts
import * as XLSX from 'xlsx';
import { VPNegCalculatorState } from '@/types/vpnegCalculator';

interface ComputedCalculatorData {
  computedFonte: Record<string, number>;
  computedMarkup: {
    markupGeralCalculado: number;
    markupGeral: number;
    markupEventosCalculado: number;
    markupEventos: number;
  };
  computedMidia: Array<{
    id: string;
    celulaPreco: string;
    acao: string;
    creditos: number;
    custoRelativo: number;
    custoUnitarioCalculado: number;
    custoUnitario: number;
    precoCalculado: number;
    precoUnitario: number;
    custoUnitarioOverride?: number | null;
    precoUnitarioOverride?: number | null;
  }>;
  computedJornada: Array<{
    id: string;
    celulaPreco: string;
    acao: string;
    observacao?: string;
    custoFormula: number;
    custo: number;
    precoCalculado: number;
    precoUnitario: number;
    custoOverride?: number | null;
    precoUnitarioOverride?: number | null;
  }>;
  computedEventosBase: Array<{
    id: string;
    celulaPreco: string;
    acao: string;
    fonte: string;
    custoFormula: number;
    custo: number;
    precoCalculado: number;
    precoUnitario: number;
    custoOverride?: number | null;
    precoUnitarioOverride?: number | null;
  }>;
  computedModificadoresEventos: Array<{
    id: string;
    celulaPreco: string;
    evento: string;
    publico: number;
    tipoBase: 'magna' | 'paralela';
    proporcaoPublico: number;
    precoCalculado: number;
    precoUnitario: number;
    precoOverride?: number | null;
  }>;
  computedCalculadoraRows: Array<{
    id: string;
    bloco: string;
    categoria: string;
    acao: string;
    unidades: number;
    sugestaoPacote?: number;
    refKey: string;
    refFormulaExcel: string;
    multiplicadorFormula?: number;
    valorPraticadoOverride?: number | null;
    precoBaseCalculado: number;
    isOverridden: boolean;
    valorUnitarioPraticado: number;
    subtotal: number;
  }>;
  totaisCalculadora: {
    totalConsciencia: number;
    totalInteresseProgramas: number;
    totalProdutosConexao: number;
    totalConversaoPS: number;
    somaExata: number;
    totalArredondado: number;
    desconto: number;
    totalComDesconto: number;
  };
  computedCatalogo: Array<{
    id: string;
    categoria: string;
    acao: string;
    etapa: string;
    refKey?: string;
    precoTextoFixo?: string;
    precoFinal?: number;
    descricao: string;
    kpis: string;
  }>;
}

const CURRENCY_FMT = '"R$"\\ #,##0.00';
const INT_CURRENCY_FMT = '"R$"\\ #,##0';
const PERCENT_DEC_FMT = '0.00';

function setCell(
  ws: XLSX.WorkSheet,
  cellRef: string,
  val: string | number | null | undefined,
  opts?: { formula?: string; numFmt?: string }
) {
  if (val === undefined || val === null) {
    if (!opts?.formula) return;
  }
  const cell: XLSX.CellObject = {
    t: typeof val === 'number' ? 'n' : 's',
    v: val ?? 0,
  };
  if (opts?.formula) {
    cell.t = typeof val === 'number' ? 'n' : 's';
    cell.f = opts.formula;
  }
  if (opts?.numFmt) {
    cell.z = opts.numFmt;
  }
  ws[cellRef] = cell;
}

export function exportVPNegCalculatorToExcel(
  state: VPNegCalculatorState,
  computed: ComputedCalculatorData,
  customFileName?: string
) {
  const wb = XLSX.utils.book_new();

  // =========================================================================
  // ABA 1: Ações | Catálogo
  // =========================================================================
  const wsCatalogo: XLSX.WorkSheet = {};
  setCell(wsCatalogo, 'B1', 'Categoria');
  setCell(wsCatalogo, 'C1', 'Ação');
  setCell(wsCatalogo, 'D1', 'Etapa');
  setCell(wsCatalogo, 'E1', 'Preço');
  setCell(wsCatalogo, 'F1', 'Descrição');
  setCell(wsCatalogo, 'G1', 'KPIs');

  const refKeyToCatalogFormula: Record<string, string> = {
    midia_post: "'Base de Custos | Fixos e Ações'!J5",
    midia_carrossel: "'Base de Custos | Fixos e Ações'!J6",
    midia_story: "'Base de Custos | Fixos e Ações'!J7",
    midia_seq_story: "'Base de Custos | Fixos e Ações'!J8",
    midia_reels: "'Base de Custos | Fixos e Ações'!J9",
    midia_telegram: "'Base de Custos | Fixos e Ações'!J10",
    midia_video_curto: "'Base de Custos | Fixos e Ações'!J11",
    jornada_headhunting: "'Base de Custos | Fixos e Ações'!Q5",
    jornada_hackathon: "'Base de Custos | Fixos e Ações'!Q6",
    jornada_fu: "'Base de Custos | Fixos e Ações'!Q7",
    jornada_ignicao: "'Base de Custos | Fixos e Ações'!Q8",
    jornada_visita: "'Base de Custos | Fixos e Ações'!Q9",
    ev_pauta_magna: "'Base de Custos | Fixos e Ações'!D21",
    ev_pauta_paralela: "'Base de Custos | Fixos e Ações'!D22",
    ev_divulgacao_invest_jr: "'Base de Custos | Fixos e Ações'!D23",
    ev_case_parceiro: "'Base de Custos | Fixos e Ações'!D24",
    ev_lote_parceiro: "'Base de Custos | Fixos e Ações'!D25",
    ev_programacao_flash: "'Base de Custos | Fixos e Ações'!D26",
    ev_exposicao_presencial: "'Base de Custos | Fixos e Ações'!D27",
    ev_relatorio_comparado: "'Base de Custos | Fixos e Ações'!D28",
    ev_cobertura_n1: "'Base de Custos | Fixos e Ações'!D29",
    ev_cobertura_n2: "'Base de Custos | Fixos e Ações'!D30",
    ev_patrocinio_master: "'Base de Custos | Fixos e Ações'!D31",
    mod_magna_centralrio: "'Base de Custos | Fixos e Ações'!J20",
    mod_paralela_centralrio: "'Base de Custos | Fixos e Ações'!J21",
    mod_magna_onde: "'Base de Custos | Fixos e Ações'!J23",
    mod_paralela_onde: "'Base de Custos | Fixos e Ações'!J24",
    mod_magna_efej: "'Base de Custos | Fixos e Ações'!J25",
    mod_paralela_efej: "'Base de Custos | Fixos e Ações'!J26",
    mod_premio_rj: "'Base de Custos | Fixos e Ações'!J27",
    mod_rj76: "'Base de Custos | Fixos e Ações'!J28",
  };

  computed.computedCatalogo.forEach((cat, idx) => {
    const r = idx + 2;
    setCell(wsCatalogo, `B${r}`, cat.categoria);
    setCell(wsCatalogo, `C${r}`, cat.acao);
    setCell(wsCatalogo, `D${r}`, cat.etapa);
    if (cat.precoTextoFixo && cat.precoFinal === undefined) {
      setCell(wsCatalogo, `E${r}`, cat.precoTextoFixo);
    } else if (cat.refKey && refKeyToCatalogFormula[cat.refKey]) {
      setCell(wsCatalogo, `E${r}`, cat.precoFinal ?? 0, {
        formula: refKeyToCatalogFormula[cat.refKey],
        numFmt: CURRENCY_FMT,
      });
    } else {
      setCell(wsCatalogo, `E${r}`, cat.precoFinal ?? cat.precoTextoFixo ?? '', {
        numFmt: typeof cat.precoFinal === 'number' ? CURRENCY_FMT : undefined,
      });
    }
    setCell(wsCatalogo, `F${r}`, cat.descricao);
    setCell(wsCatalogo, `G${r}`, cat.kpis);
  });

  wsCatalogo['!ref'] = `A1:G${computed.computedCatalogo.length + 2}`;
  wsCatalogo['!cols'] = [
    { wch: 4 },
    { wch: 16 },
    { wch: 34 },
    { wch: 16 },
    { wch: 36 },
    { wch: 68 },
    { wch: 52 },
  ];
  XLSX.utils.book_append_sheet(wb, wsCatalogo, 'Ações | Catálogo');

  // =========================================================================
  // ABA 2: Calculadora (Com todas as fórmulas dinâmicas!)
  // =========================================================================
  const wsCalc: XLSX.WorkSheet = {};
  setCell(wsCalc, 'B2', 'Precificação | VPNeg 26');

  // Bloco 1: Consciência (B4:F12)
  setCell(wsCalc, 'B4', 'Categoria');
  setCell(wsCalc, 'C4', 'Ação');
  setCell(wsCalc, 'D4', 'Unidades');
  setCell(wsCalc, 'E4', 'Valor');
  setCell(wsCalc, 'F4', 'Sugestão');

  setCell(wsCalc, 'B5', 'Consciência');
  setCell(wsCalc, 'C5', 'Plano de Comunicação');
  setCell(wsCalc, 'E5', computed.totaisCalculadora.totalConsciencia, {
    formula: 'SUM(E6:E12)',
    numFmt: CURRENCY_FMT,
  });

  const rowsConsciencia = computed.computedCalculadoraRows.filter(r => r.bloco === 'consciencia');
  rowsConsciencia.forEach((row, idx) => {
    const r = 6 + idx;
    setCell(wsCalc, `B${r}`, row.categoria);
    setCell(wsCalc, `C${r}`, row.acao);
    setCell(wsCalc, `D${r}`, row.unidades);
    const unitFormula = row.isOverridden
      ? `D${r}*${row.valorUnitarioPraticado}`
      : `D${r}*${row.refFormulaExcel}`;
    setCell(wsCalc, `E${r}`, row.subtotal, {
      formula: unitFormula,
      numFmt: CURRENCY_FMT,
    });
    if (row.sugestaoPacote !== undefined) {
      setCell(wsCalc, `F${r}`, row.sugestaoPacote);
    }
  });

  // Bloco 2: Interesse - Programas (H4:K10)
  setCell(wsCalc, 'H4', 'Categoria');
  setCell(wsCalc, 'I4', 'Ação');
  setCell(wsCalc, 'J4', 'Unidades');
  setCell(wsCalc, 'K4', 'Valor');

  setCell(wsCalc, 'H5', 'Interesse');
  setCell(wsCalc, 'I5', 'Programas');

  const rowsProgramas = computed.computedCalculadoraRows.filter(r => r.bloco === 'interesse_programas');
  rowsProgramas.forEach((row, idx) => {
    const r = 6 + idx;
    setCell(wsCalc, `H${r}`, row.categoria);
    setCell(wsCalc, `I${r}`, row.acao);
    setCell(wsCalc, `J${r}`, row.unidades);
    const unitFormula = row.isOverridden
      ? `J${r}*${row.valorUnitarioPraticado}`
      : `J${r}*${row.refFormulaExcel}`;
    setCell(wsCalc, `K${r}`, row.subtotal, {
      formula: unitFormula,
      numFmt: CURRENCY_FMT,
    });
  });
  const endProgRow = Math.max(9, 5 + rowsProgramas.length);
  setCell(wsCalc, `H${endProgRow + 1}`, 'Total');
  setCell(wsCalc, `I${endProgRow + 1}`, computed.totaisCalculadora.totalInteresseProgramas, {
    formula: `SUM(K6:K${endProgRow})`,
    numFmt: CURRENCY_FMT,
  });

  // Bloco 3: Produtos de Conexão (M4:P25)
  setCell(wsCalc, 'M4', 'Categoria');
  setCell(wsCalc, 'N4', 'Ação');
  setCell(wsCalc, 'O4', 'Unidades');
  setCell(wsCalc, 'P4', 'Valor');

  setCell(wsCalc, 'M5', 'Interesse');
  setCell(wsCalc, 'N5', 'Produtos de Conexão');

  const rowsConexao = computed.computedCalculadoraRows.filter(r => r.bloco === 'produtos_conexao');
  rowsConexao.forEach((row, idx) => {
    const r = 6 + idx;
    setCell(wsCalc, `M${r}`, row.categoria);
    setCell(wsCalc, `N${r}`, row.acao);
    setCell(wsCalc, `O${r}`, row.unidades);
    const unitFormula = row.isOverridden
      ? `O${r}*${row.valorUnitarioPraticado}`
      : `O${r}*${row.refFormulaExcel}`;
    setCell(wsCalc, `P${r}`, row.subtotal, {
      formula: unitFormula,
      numFmt: CURRENCY_FMT,
    });
  });
  const endConexaoRow = Math.max(24, 5 + rowsConexao.length);
  const totalConexaoRow = endConexaoRow + 1;
  setCell(wsCalc, `M${totalConexaoRow}`, 'Total');
  setCell(wsCalc, `N${totalConexaoRow}`, computed.totaisCalculadora.totalProdutosConexao, {
    formula: `SUM(P6:P${endConexaoRow})`,
    numFmt: CURRENCY_FMT,
  });

  // Bloco 4: Divulgação de PS / Conversão (R4:U13)
  setCell(wsCalc, 'R4', 'Categoria');
  setCell(wsCalc, 'S4', 'Ação');
  setCell(wsCalc, 'T4', 'Unidades');
  setCell(wsCalc, 'U4', 'Valor');

  setCell(wsCalc, 'R5', 'Interesse');
  setCell(wsCalc, 'S5', 'Divulgação de PS');

  const rowsConversao = computed.computedCalculadoraRows.filter(r => r.bloco === 'conversao_ps');
  rowsConversao.forEach((row, idx) => {
    const r = 6 + idx;
    setCell(wsCalc, `R${r}`, row.categoria);
    setCell(wsCalc, `S${r}`, row.acao);
    setCell(wsCalc, `T${r}`, row.unidades);
    const unitFormula = row.isOverridden
      ? `T${r}*${row.valorUnitarioPraticado}`
      : `T${r}*${row.refFormulaExcel}`;
    setCell(wsCalc, `U${r}`, row.subtotal, {
      formula: unitFormula,
      numFmt: CURRENCY_FMT,
    });
  });
  const endConvRow = Math.max(11, 5 + rowsConversao.length);
  const totalConvRow = endConvRow + 1;
  setCell(wsCalc, `R${totalConvRow}`, 'Total');
  setCell(wsCalc, `S${totalConvRow}`, computed.totaisCalculadora.totalConversaoPS, {
    formula: `SUM(U6:U${endConvRow})`,
    numFmt: CURRENCY_FMT,
  });

  // Total Geral da Calculadora (B18:C22)
  setCell(wsCalc, 'B18', 'Total');
  setCell(wsCalc, 'C18', computed.totaisCalculadora.totalArredondado, {
    formula: `ROUND(SUM(E5,I${endProgRow + 1},N${totalConexaoRow},S${totalConvRow}),0)`,
    numFmt: INT_CURRENCY_FMT,
  });

  if (state.parceiroPropostaAtual) {
    setCell(wsCalc, 'B16', 'Parceiro:');
    setCell(wsCalc, 'C16', state.parceiroPropostaAtual);
  }
  if (state.descontoPropostaAtual > 0) {
    setCell(wsCalc, 'B19', 'Desconto Negociado');
    setCell(wsCalc, 'C19', state.descontoPropostaAtual, { numFmt: CURRENCY_FMT });
    setCell(wsCalc, 'B20', 'Total Final c/ Desconto');
    setCell(wsCalc, 'C20', computed.totaisCalculadora.totalComDesconto, {
      formula: 'MAX(0,C18-C19)',
      numFmt: CURRENCY_FMT,
    });
  }

  // Blocos auxiliares inferiores (B31:E37) idênticos à planilha
  setCell(wsCalc, 'B31', 'Interesse');
  setCell(wsCalc, 'C31', 'Relatório Comparado');
  setCell(wsCalc, 'D31', 0);
  setCell(wsCalc, 'E31', 0, { formula: "D31*'Base de Custos | Fixos e Ações'!D28", numFmt: CURRENCY_FMT });

  setCell(wsCalc, 'B32', 'Interesse');
  setCell(wsCalc, 'C32', 'Cobertura nível 1');
  setCell(wsCalc, 'D32', 0);
  setCell(wsCalc, 'E32', 0, { formula: "D32*'Base de Custos | Fixos e Ações'!D29", numFmt: CURRENCY_FMT });

  setCell(wsCalc, 'B33', 'Interesse');
  setCell(wsCalc, 'C33', 'Cobertura nível 2');
  setCell(wsCalc, 'D33', 0);
  setCell(wsCalc, 'E33', 0, { formula: "D33*'Base de Custos | Fixos e Ações'!D30", numFmt: CURRENCY_FMT });

  setCell(wsCalc, 'B34', 'Interesse');
  setCell(wsCalc, 'C34', 'Patrocínio Master (1 por evento)');
  setCell(wsCalc, 'D34', 0);
  setCell(wsCalc, 'E34', 0, { formula: "D34*'Base de Custos | Fixos e Ações'!D31", numFmt: CURRENCY_FMT });

  setCell(wsCalc, 'B35', 'Conversão');
  setCell(wsCalc, 'C35', 'Ações de Conversão');
  setCell(wsCalc, 'E35', 0, { formula: 'SUM(E36:E43)', numFmt: CURRENCY_FMT });

  setCell(wsCalc, 'B36', 'Conversão');
  setCell(wsCalc, 'C36', 'Vídeo Curto (video teaser)');
  setCell(wsCalc, 'D36', 0);
  setCell(wsCalc, 'E36', 0, { formula: "D36*'Base de Custos | Fixos e Ações'!J11", numFmt: CURRENCY_FMT });

  setCell(wsCalc, 'B37', 'Conversão');
  setCell(wsCalc, 'C37', 'Headhunting');
  setCell(wsCalc, 'D37', 0);
  setCell(wsCalc, 'E37', 0, { formula: "D37*'Base de Custos | Fixos e Ações'!Q5", numFmt: CURRENCY_FMT });

  wsCalc['!ref'] = 'A1:V44';
  wsCalc['!cols'] = [
    { wch: 3 },  // A
    { wch: 15 }, // B
    { wch: 36 }, // C
    { wch: 11 }, // D
    { wch: 16 }, // E
    { wch: 10 }, // F
    { wch: 3 },  // G
    { wch: 14 }, // H
    { wch: 36 }, // I
    { wch: 11 }, // J
    { wch: 16 }, // K
    { wch: 3 },  // L
    { wch: 14 }, // M
    { wch: 36 }, // N
    { wch: 11 }, // O
    { wch: 16 }, // P
    { wch: 3 },  // Q
    { wch: 14 }, // R
    { wch: 36 }, // S
    { wch: 11 }, // T
    { wch: 16 }, // U
  ];
  XLSX.utils.book_append_sheet(wb, wsCalc, 'Calculadora');

  // =========================================================================
  // ABA 3: Base de Custos | Fixos e Ações
  // =========================================================================
  const wsBase: XLSX.WorkSheet = {};
  const mk = state.markupConfig;

  setCell(wsBase, 'B3', 'Markup RioJunior');
  setCell(wsBase, 'C3', 'Valor');
  setCell(wsBase, 'D3', 'Fonte');

  setCell(wsBase, 'B4', 'Custos Fixos 2024');
  setCell(wsBase, 'C4', mk.custosFixos2024, { numFmt: CURRENCY_FMT });
  setCell(wsBase, 'D4', mk.custosFixosFonte);

  setCell(wsBase, 'B5', 'Despesas Fixas 2024');
  setCell(wsBase, 'C5', mk.despesasFixas2024, { numFmt: CURRENCY_FMT });
  setCell(wsBase, 'D5', mk.despesasFixasFonte);

  setCell(wsBase, 'B6', 'Faturamento 2024');
  setCell(wsBase, 'C6', mk.faturamento2024, { numFmt: CURRENCY_FMT });
  setCell(wsBase, 'D6', mk.faturamentoFonte);

  setCell(wsBase, 'B7', 'DF/Fat');
  setCell(wsBase, 'C7', mk.dfFat, { numFmt: PERCENT_DEC_FMT });

  setCell(wsBase, 'B8', 'DV/Fat');
  setCell(wsBase, 'C8', mk.dvFat, { numFmt: '0.000' });

  setCell(wsBase, 'B9', 'ML');
  setCell(wsBase, 'C9', mk.mlGeral, { numFmt: PERCENT_DEC_FMT });

  setCell(wsBase, 'B10', 'ML Eventos');
  setCell(wsBase, 'C10', mk.mlEventos, { numFmt: PERCENT_DEC_FMT });
  setCell(wsBase, 'D10', mk.mlEventosFonte);

  setCell(wsBase, 'B11', 'Markup Geral');
  setCell(wsBase, 'C11', computed.computedMarkup.markupGeral, {
    formula: mk.markupGeralOverride !== null && mk.markupGeralOverride !== undefined
      ? undefined
      : '100/(100-(C7+C8+C9))',
    numFmt: '0.000000',
  });

  setCell(wsBase, 'B12', 'Markup Eventos');
  setCell(wsBase, 'C12', computed.computedMarkup.markupEventos, {
    formula: mk.markupEventosOverride !== null && mk.markupEventosOverride !== undefined
      ? undefined
      : '100/(100-($C$7+$C8+C10))',
    numFmt: '0.000000',
  });

  // Adicionais Fixos (B13:D16)
  setCell(wsBase, 'B13', 'Adicionais Fixos');
  setCell(wsBase, 'C13', 'Multiplicador');
  setCell(wsBase, 'D13', 'Descrição');

  setCell(wsBase, 'B14', 'Invest Jr');
  setCell(wsBase, 'C14', mk.investJrMultiplicador, { numFmt: PERCENT_DEC_FMT });
  setCell(wsBase, 'D14', mk.investJrDescricao);

  setCell(wsBase, 'B15', 'Fundo de Imersão');
  setCell(wsBase, 'C15', mk.fundoImersaoMultiplicador, { numFmt: PERCENT_DEC_FMT });
  setCell(wsBase, 'D15', mk.fundoImersaoDescricao);

  setCell(wsBase, 'B16', 'Experiência do Parceiro');
  setCell(wsBase, 'C16', mk.experienciaParceiroFixo, { numFmt: CURRENCY_FMT });
  setCell(wsBase, 'D16', mk.experienciaParceiroDescricao);

  // Mídia Terceirizada (F4:L11)
  setCell(wsBase, 'F4', 'Ação');
  setCell(wsBase, 'G4', 'Créditos');
  setCell(wsBase, 'H4', 'Custo relativo');
  setCell(wsBase, 'I4', 'Custo Unitário');
  setCell(wsBase, 'J4', 'Preço Unitário');
  setCell(wsBase, 'K4', 'Valor Mensalidade');
  setCell(wsBase, 'L4', 'Valor');

  setCell(wsBase, 'K5', 'Terceirizada de Mídia');
  setCell(wsBase, 'L5', mk.terceirizadaMensalidade, { numFmt: CURRENCY_FMT });
  setCell(wsBase, 'K6', 'Limite de Créditos (VPNeg)');
  setCell(wsBase, 'L6', mk.terceirizadaLimiteCreditos);

  computed.computedMidia.forEach((m, idx) => {
    const r = 5 + idx;
    setCell(wsBase, `F${r}`, m.acao);
    setCell(wsBase, `G${r}`, m.creditos);
    setCell(wsBase, `H${r}`, m.custoRelativo, {
      formula: `G${r}/$L$6`,
      numFmt: '0.0000',
    });
    setCell(wsBase, `I${r}`, m.custoUnitario, {
      formula: m.custoUnitarioOverride !== null && m.custoUnitarioOverride !== undefined
        ? undefined
        : `H${r}*$L$5`,
      numFmt: CURRENCY_FMT,
    });
    setCell(wsBase, `J${r}`, m.precoUnitario, {
      formula: m.precoUnitarioOverride !== null && m.precoUnitarioOverride !== undefined
        ? undefined
        : `I${r}*$C$11`,
      numFmt: CURRENCY_FMT,
    });
  });

  // Base de Custos | Jornada de Conteúdo e Interesse (O3:R9)
  setCell(wsBase, 'O3', 'Base de Custos | Jornada de Conteúdo e Interesse');
  setCell(wsBase, 'O4', 'Ações');
  setCell(wsBase, 'P4', 'Custo');
  setCell(wsBase, 'Q4', 'Preço');
  setCell(wsBase, 'R4', 'Observações');

  const jornadaFormulas: Record<string, string> = {
    jornada_headhunting: "'Fonte de Cálculos | Precificaçã'!A2",
    jornada_hackathon: "'Fonte de Cálculos | Precificaçã'!A11",
    jornada_fu: "'Fonte de Cálculos | Precificaçã'!A3*'Fonte de Cálculos | Precificaçã'!A4*'Fonte de Cálculos | Precificaçã'!A5",
    jornada_ignicao: "'Fonte de Cálculos | Precificaçã'!A7*'Fonte de Cálculos | Precificaçã'!A4*'Fonte de Cálculos | Precificaçã'!A5",
    jornada_visita: "AVERAGE('Fonte de Cálculos | Precificaçã'!A3,'Fonte de Cálculos | Precificaçã'!A6,'Fonte de Cálculos | Precificaçã'!A7)*40*3",
  };

  computed.computedJornada.forEach((j, idx) => {
    const r = 5 + idx;
    setCell(wsBase, `O${r}`, j.acao);
    setCell(wsBase, `P${r}`, j.custo, {
      formula: j.custoOverride !== null && j.custoOverride !== undefined
        ? undefined
        : jornadaFormulas[j.id],
      numFmt: CURRENCY_FMT,
    });
    setCell(wsBase, `Q${r}`, j.precoUnitario, {
      formula: j.precoUnitarioOverride !== null && j.precoUnitarioOverride !== undefined
        ? undefined
        : `P${r}*$C$11`,
      numFmt: CURRENCY_FMT,
    });
    if (j.observacao) {
      setCell(wsBase, `R${r}`, j.observacao);
    }
  });

  // Base de custos | Eventos (B20:E31)
  setCell(wsBase, 'B20', 'Base de custos | Eventos');
  setCell(wsBase, 'C20', 'Custo');
  setCell(wsBase, 'D20', 'Preço');
  setCell(wsBase, 'E20', 'Fonte');

  const eventoCustoFormulas: Record<string, string | undefined> = {
    ev_pauta_magna: undefined,
    ev_pauta_paralela: 'C21*0.5',
    ev_divulgacao_invest_jr: 'I5',
    ev_case_parceiro: "200*0.5*AVERAGE('Fonte de Cálculos | Precificaçã'!A3,'Fonte de Cálculos | Precificaçã'!A6,'Fonte de Cálculos | Precificaçã'!A7)/3",
    ev_lote_parceiro: undefined,
    ev_programacao_flash: 'C21/6',
    ev_exposicao_presencial: undefined,
    ev_relatorio_comparado: "3*'Fonte de Cálculos | Precificaçã'!A3*7",
    ev_cobertura_n1: "'Fonte de Cálculos | Precificaçã'!A12/5+I5+I10",
    ev_cobertura_n2: 'C29+I11',
    ev_patrocinio_master: undefined,
  };

  computed.computedEventosBase.forEach((ev, idx) => {
    const r = 21 + idx;
    setCell(wsBase, `B${r}`, ev.acao);
    const hasCustoOverride = ev.custoOverride !== null && ev.custoOverride !== undefined;
    setCell(wsBase, `C${r}`, ev.custo, {
      formula: hasCustoOverride ? undefined : eventoCustoFormulas[ev.id],
      numFmt: CURRENCY_FMT,
    });

    const hasPrecoOverride = ev.precoUnitarioOverride !== null && ev.precoUnitarioOverride !== undefined;
    const defaultPrecoFormula = ev.id === 'ev_patrocinio_master'
      ? '(C21+C30+C24+C25)*C12'
      : `C${r}*$C$12`;

    setCell(wsBase, `D${r}`, ev.precoUnitario, {
      formula: hasPrecoOverride ? undefined : defaultPrecoFormula,
      numFmt: CURRENCY_FMT,
    });
    setCell(wsBase, `E${r}`, ev.fonte);
  });

  // Modificadores de Pauta | Eventos (G20:J28)
  const modMagnaCR = computed.computedModificadoresEventos.find(m => m.id === 'mod_magna_centralrio');
  const modParalelaCR = computed.computedModificadoresEventos.find(m => m.id === 'mod_paralela_centralrio');

  setCell(wsBase, 'G20', 'Magna CentralRio');
  setCell(wsBase, 'H20', modMagnaCR?.publico ?? 500);
  setCell(wsBase, 'I20', 'Público');
  setCell(wsBase, 'J20', modMagnaCR?.precoUnitario ?? 6537.65, {
    formula: modMagnaCR?.precoOverride !== null && modMagnaCR?.precoOverride !== undefined ? undefined : 'D21',
    numFmt: CURRENCY_FMT,
  });

  setCell(wsBase, 'G21', 'Paralela CentralRio');
  setCell(wsBase, 'H21', modParalelaCR?.publico ?? 500);
  setCell(wsBase, 'J21', modParalelaCR?.precoUnitario ?? 3268.83, {
    formula: modParalelaCR?.precoOverride !== null && modParalelaCR?.precoOverride !== undefined ? undefined : 'D22',
    numFmt: CURRENCY_FMT,
  });

  setCell(wsBase, 'G22', 'Modificadores de Pauta | Eventos');
  setCell(wsBase, 'H22', 'Público');
  setCell(wsBase, 'I22', 'Público/CentralRio');
  setCell(wsBase, 'J22', 'Preço');

  const outrosMods = computed.computedModificadoresEventos.filter(
    m => m.id !== 'mod_magna_centralrio' && m.id !== 'mod_paralela_centralrio'
  );
  outrosMods.forEach((mod, idx) => {
    const r = 23 + idx;
    setCell(wsBase, `G${r}`, mod.evento);
    setCell(wsBase, `H${r}`, mod.publico);
    setCell(wsBase, `I${r}`, mod.proporcaoPublico, {
      formula: `H${r}/$H$20`,
      numFmt: PERCENT_DEC_FMT,
    });
    const baseRef = mod.tipoBase === 'magna' ? '$J$20' : '$J$21';
    setCell(wsBase, `J${r}`, mod.precoUnitario, {
      formula: mod.precoOverride !== null && mod.precoOverride !== undefined ? undefined : `${baseRef}*I${r}`,
      numFmt: CURRENCY_FMT,
    });
  });

  wsBase['!ref'] = 'A1:S34';
  wsBase['!cols'] = [
    { wch: 3 },
    { wch: 32 },
    { wch: 16 },
    { wch: 16 },
    { wch: 48 },
    { wch: 36 },
    { wch: 10 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 24 },
    { wch: 14 },
    { wch: 3 },
    { wch: 3 },
    { wch: 34 },
    { wch: 16 },
    { wch: 16 },
    { wch: 24 },
  ];
  XLSX.utils.book_append_sheet(wb, wsBase, 'Base de Custos | Fixos e Ações');

  // =========================================================================
  // ABA 4: Fonte de Cálculos | Precificaçã
  // =========================================================================
  const wsFonte: XLSX.WorkSheet = {};
  setCell(wsFonte, 'A1', 'Valor');
  setCell(wsFonte, 'B1', 'Descrição');
  setCell(wsFonte, 'C1', 'Fonte');

  const fonteExcelFormulas: Record<string, string> = {
    A6: '0.8*A3',
    A7: '0.6*A3',
    A11: 'A4*AVERAGE(A3,A6,A7)*A10',
  };

  state.fonteCalculos.forEach((fc, idx) => {
    const r = idx + 2;
    const val = computed.computedFonte[fc.celula] ?? fc.valor;
    const hasOverride = fc.override !== null && fc.override !== undefined;
    const f = !hasOverride && fonteExcelFormulas[fc.celula] ? fonteExcelFormulas[fc.celula] : undefined;
    setCell(wsFonte, `A${r}`, val, {
      formula: f,
      numFmt: PERCENT_DEC_FMT,
    });
    setCell(wsFonte, `B${r}`, fc.descricao);
    setCell(wsFonte, `C${r}`, fc.fonte);
  });

  wsFonte['!ref'] = 'A1:D14';
  wsFonte['!cols'] = [
    { wch: 16 },
    { wch: 40 },
    { wch: 44 },
  ];
  XLSX.utils.book_append_sheet(wb, wsFonte, 'Fonte de Cálculos | Precificaçã');

  // =========================================================================
  // ABA 5: KPIs | Acompanhamento
  // =========================================================================
  const wsKPIAcomp: XLSX.WorkSheet = {};
  setCell(wsKPIAcomp, 'C2', 'Parceiro');
  setCell(wsKPIAcomp, 'D2', 'Bain');
  setCell(wsKPIAcomp, 'E2', 'Ação');
  setCell(wsKPIAcomp, 'F2', 'Pauta Magna');
  setCell(wsKPIAcomp, 'G2', 'Evento');
  setCell(wsKPIAcomp, 'H2', 'CentralRio');

  setCell(wsKPIAcomp, 'C4', 'Consciência');
  setCell(wsKPIAcomp, 'E4', 'Interesse');
  setCell(wsKPIAcomp, 'G4', 'Conversão');

  setCell(wsKPIAcomp, 'C5', 'Curtidas');
  setCell(wsKPIAcomp, 'D5', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!F2:F233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });
  setCell(wsKPIAcomp, 'E5', 'NPS');
  setCell(wsKPIAcomp, 'F5', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!J2:J233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });
  setCell(wsKPIAcomp, 'G5', 'Contatos Indicados');
  setCell(wsKPIAcomp, 'H5', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!Q2:Q233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });

  setCell(wsKPIAcomp, 'C6', 'Menções');
  setCell(wsKPIAcomp, 'D6', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!G2:G233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });
  setCell(wsKPIAcomp, 'E6', 'Awareness pré');
  setCell(wsKPIAcomp, 'F6', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!K2:K233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });
  setCell(wsKPIAcomp, 'G6', 'Inscrições Facilitadas');
  setCell(wsKPIAcomp, 'H6', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!R2:R233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });

  setCell(wsKPIAcomp, 'C7', 'Interações');
  setCell(wsKPIAcomp, 'D7', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!H2:H233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });
  setCell(wsKPIAcomp, 'E7', 'Awareness pós');
  setCell(wsKPIAcomp, 'F7', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!L2:L233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });
  setCell(wsKPIAcomp, 'G7', 'Conversões');
  setCell(wsKPIAcomp, 'H7', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!S2:S233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });

  setCell(wsKPIAcomp, 'C8', 'Comentários');
  setCell(wsKPIAcomp, 'D8', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!I2:I233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });
  setCell(wsKPIAcomp, 'E8', 'Interesse pré');
  setCell(wsKPIAcomp, 'F8', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!M2:M233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });

  setCell(wsKPIAcomp, 'E9', 'Interesse pós');
  setCell(wsKPIAcomp, 'F9', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!N2:N233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });

  setCell(wsKPIAcomp, 'E10', 'Empregabilidade pré');
  setCell(wsKPIAcomp, 'F10', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!O2:O233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });

  setCell(wsKPIAcomp, 'E11', 'Empregabilidade pós');
  setCell(wsKPIAcomp, 'F11', 0, {
    formula: "AVERAGEIFS('KPIs | Registro'!P2:P233,'KPIs | Registro'!B2:B233,D2,'KPIs | Registro'!A2:A233,F2,'KPIs | Registro'!D2:D233,H2)",
  });

  wsKPIAcomp['!ref'] = 'A1:I14';
  wsKPIAcomp['!cols'] = [
    { wch: 4 },
    { wch: 4 },
    { wch: 22 },
    { wch: 16 },
    { wch: 22 },
    { wch: 18 },
    { wch: 22 },
    { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, wsKPIAcomp, 'KPIs | Acompanhamento');

  // =========================================================================
  // ABA 6: KPIs | Registro
  // =========================================================================
  const wsKPIReg: XLSX.WorkSheet = {};
  const kpiHeaders = [
    'Ação',
    'Parceiro',
    'Data da Ação',
    'Evento (se aplicável)',
    'Empresários Juniores Impactados',
    'Curtidas',
    'Menções',
    'Interações',
    'Comentários',
    'NPS',
    'Awareness pré',
    'Awareness pós',
    'Interesse pré',
    'Interesse pós',
    'Empregabilidade pré',
    'Empregabilidade pós',
    'Contatos Indicados',
    'Inscrições Facilitadas',
    'Conversões',
  ];
  kpiHeaders.forEach((h, i) => {
    const col = XLSX.utils.encode_col(i);
    setCell(wsKPIReg, `${col}1`, h);
  });

  state.kpiRegistros.forEach((reg, idx) => {
    const r = idx + 2;
    setCell(wsKPIReg, `A${r}`, reg.acao);
    setCell(wsKPIReg, `B${r}`, reg.parceiro);
    setCell(wsKPIReg, `C${r}`, reg.dataAcao);
    setCell(wsKPIReg, `D${r}`, reg.evento);
    if (reg.empresariosImpactados !== null) setCell(wsKPIReg, `E${r}`, reg.empresariosImpactados);
    if (reg.curtidas !== null) setCell(wsKPIReg, `F${r}`, reg.curtidas);
    if (reg.mencoes !== null) setCell(wsKPIReg, `G${r}`, reg.mencoes);
    if (reg.interacoes !== null) setCell(wsKPIReg, `H${r}`, reg.interacoes);
    if (reg.comentarios !== null) setCell(wsKPIReg, `I${r}`, reg.comentarios);
    if (reg.nps !== null) setCell(wsKPIReg, `J${r}`, reg.nps);
    if (reg.awarenessPre !== null) setCell(wsKPIReg, `K${r}`, reg.awarenessPre);
    if (reg.awarenessPos !== null) setCell(wsKPIReg, `L${r}`, reg.awarenessPos);
    if (reg.interessePre !== null) setCell(wsKPIReg, `M${r}`, reg.interessePre);
    if (reg.interessePos !== null) setCell(wsKPIReg, `N${r}`, reg.interessePos);
    if (reg.empregabilidadePre !== null) setCell(wsKPIReg, `O${r}`, reg.empregabilidadePre);
    if (reg.empregabilidadePos !== null) setCell(wsKPIReg, `P${r}`, reg.empregabilidadePos);
    if (reg.contatosIndicados !== null) setCell(wsKPIReg, `Q${r}`, reg.contatosIndicados);
    if (reg.inscricoesFacilitadas !== null) setCell(wsKPIReg, `R${r}`, reg.inscricoesFacilitadas);
    if (reg.conversoes !== null) setCell(wsKPIReg, `S${r}`, reg.conversoes);
  });

  wsKPIReg['!ref'] = `A1:S${Math.max(10, state.kpiRegistros.length + 2)}`;
  wsKPIReg['!cols'] = kpiHeaders.map(h => ({ wch: Math.max(16, h.length + 4) }));
  XLSX.utils.book_append_sheet(wb, wsKPIReg, 'KPIs | Registro');

  const safePartner = state.parceiroPropostaAtual
    ? `_${state.parceiroPropostaAtual.replace(/[^a-zA-Z0-9_-]/g, '_')}`
    : '';
  const fileName = customFileName || `[Calculadora] Ações e Parceiros _ VPNeg 2026${safePartner}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

