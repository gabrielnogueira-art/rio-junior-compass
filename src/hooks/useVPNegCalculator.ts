// src/hooks/useVPNegCalculator.ts
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  VPNegCalculatorState,
  MarkupConfig,
  FonteCalculoParam,
  MidiaCreditoItem,
  JornadaCustoItem,
  EventoCustoBaseItem,
  ModificadorEventoItem,
  CalculadoraActionRow,
  CatalogoAcaoRow,
  KPIRegistroRow,
  SimulacaoSalva,
} from '@/types/vpnegCalculator';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'riojunior_vpneg_calculator_v1';

export const INITIAL_CALCULATOR_STATE: VPNegCalculatorState = {
  markupConfig: {
    custosFixos2024: 82102.23,
    custosFixosFonte: 'PF Anual do ano anterior',
    despesasFixas2024: 422180.99,
    despesasFixasFonte: 'PF Anual do ano anterior',
    faturamento2024: 464518.96,
    faturamentoFonte: 'PF Anual do ano anterior',
    dfFat: 21.39,
    dvFat: 1.097,
    mlGeral: 20,
    mlEventos: 20,
    mlEventosFonte: 'Benchmarking de eventos anteriores',
    markupGeralOverride: null,
    markupEventosOverride: null,
    investJrMultiplicador: 1.15,
    investJrDescricao: 'Fundo de acessibilidade a eventos',
    fundoImersaoMultiplicador: 1,
    fundoImersaoDescricao: 'Para manutenção e cobertura de demais despesas da federação',
    experienciaParceiroFixo: 500,
    experienciaParceiroDescricao: 'Customer Experience',
    terceirizadaMensalidade: 2520,
    terceirizadaLimiteCreditos: 40,
  },
  fonteCalculos: [
    { id: 'fc_headhunting', celula: 'A2', descricao: 'Headhunting', fonte: 'Benchmarking salarial com estagiário de R&S', valor: 1900 },
    { id: 'fc_hh_fu', celula: 'A3', descricao: 'Hora-homem liderança FU', fonte: 'Precificação Ayra 2025', valor: 11.8 },
    { id: 'fc_duracao_ativacao', celula: 'A4', descricao: 'Duração média de ativação em Horas', fonte: 'Base 2024', valor: 3 },
    { id: 'fc_publico_fu', celula: 'A5', descricao: 'Público Médio Evento FU', fonte: 'Histórico 2024', valor: 45 },
    { id: 'fc_hh_fp', celula: 'A6', descricao: 'Hora-homem média FP', fonte: '0,8 a do FU', valor: 9.44, isFormula: true, formulaLabel: '= 0.8 * A3' },
    { id: 'fc_hh_media', celula: 'A7', descricao: 'Hora-homem média', fonte: '0,6 a do FU', valor: 7.08, isFormula: true, formulaLabel: '= 0.6 * A3' },
    { id: 'fc_tempo_visita', celula: 'A8', descricao: 'Tempo Médio de Visita', fonte: 'Histórico', valor: 3 },
    { id: 'fc_presenca_visita', celula: 'A9', descricao: 'Presença Média em Visita', fonte: 'Base 2024', valor: 45 },
    { id: 'fc_inscritos_hackathon', celula: 'A10', descricao: 'Inscritos esperados por hackathon', fonte: 'Garantia RioJunior', valor: 100 },
    { id: 'fc_dedicacao_hackathon', celula: 'A11', descricao: 'Dedicação Média', fonte: 'Hackathon', valor: 2832, isFormula: true, formulaLabel: '= A4 * MÉDIA(A3,A6,A7) * A10' },
    { id: 'fc_fotografo', celula: 'A12', descricao: 'Fotógrafo', fonte: 'CentralRio 24', valor: 2400 },
  ],
  midiaItens: [
    { id: 'midia_post', celulaPreco: 'J5', acao: 'Post unitário (estático pra rede social)', creditos: 1 },
    { id: 'midia_carrossel', celulaPreco: 'J6', acao: 'Carrossel Curto', creditos: 1.5 },
    { id: 'midia_story', celulaPreco: 'J7', acao: 'Story unitário (estático)', creditos: 1 },
    { id: 'midia_seq_story', celulaPreco: 'J8', acao: 'Sequência de Story (máximo 5)', creditos: 1.5 },
    { id: 'midia_reels', celulaPreco: 'J9', acao: 'Reels (edição de vídeo trailer)', creditos: 3 },
    { id: 'midia_telegram', celulaPreco: 'J10', acao: 'Divulgação Telegram (Banner/flyer)', creditos: 1 },
    { id: 'midia_video_curto', celulaPreco: 'J11', acao: 'Vídeo Curto (video teaser)', creditos: 2 },
  ],
  jornadaItens: [
    { id: 'jornada_headhunting', celulaPreco: 'Q5', acao: 'Headhunting', formulaCustoLabel: 'Fonte!A2 (Headhunting)' },
    { id: 'jornada_hackathon', celulaPreco: 'Q6', acao: 'Hackathon', formulaCustoLabel: 'Fonte!A11 (Dedicação Hackathon)' },
    { id: 'jornada_fu', celulaPreco: 'Q7', acao: 'Participação em Programas (FU)', formulaCustoLabel: 'Fonte!A3 * A4 * A5', observacao: 'fev, maio, agosto e out' },
    { id: 'jornada_ignicao', celulaPreco: 'Q8', acao: 'Participação em Programas (Ignição)', formulaCustoLabel: 'Fonte!A7 * A4 * A5' },
    { id: 'jornada_visita', celulaPreco: 'Q9', acao: 'Visita / Working Day', formulaCustoLabel: 'MÉDIA(A3,A6,A7) * 40 * 3' },
  ],
  eventosCustosBase: [
    { id: 'ev_pauta_magna', celulaPreco: 'D21', acao: 'Pauta Magna', fonte: 'CentralRio 24 (Espaço + Alimentação)', formulaCustoLabel: 'Valor Base (R$ 3.760)', custoBase: 3760 },
    { id: 'ev_pauta_paralela', celulaPreco: 'D22', acao: 'Pauta Paralela', fonte: 'CentralRio 24', formulaCustoLabel: '50% do Custo da Pauta Magna (C21 * 0.5)', custoBase: 1880 },
    { id: 'ev_divulgacao_invest_jr', celulaPreco: 'D23', acao: 'Divulgação Invest. Jr', fonte: 'Post | Comunica 25', formulaCustoLabel: 'Custo Unitário Post (I5)', custoBase: 63 },
    { id: 'ev_case_parceiro', celulaPreco: 'D24', acao: 'Case Parceiro', fonte: 'Ponderação HH x Avaliação', formulaCustoLabel: '200 * 0.5 * MÉDIA(A3,A6,A7) / 3', custoBase: 314.6666667 },
    { id: 'ev_lote_parceiro', celulaPreco: 'D25', acao: 'Lote Parceiro', fonte: 'Receita total ponderada pelo preço dos ingressos CentralRio 24', formulaCustoLabel: 'Valor Base (R$ 126,88)', custoBase: 126.88 },
    { id: 'ev_programacao_flash', celulaPreco: 'D26', acao: 'Programação Flash', fonte: 'Ponderação de Magna pelo tempo de ativação', formulaCustoLabel: 'Custo Pauta Magna / 6 (C21 / 6)', custoBase: 626.6666667 },
    { id: 'ev_exposicao_presencial', celulaPreco: 'D27', acao: 'Exposição Presencial', fonte: 'Backdrop', formulaCustoLabel: 'Valor Base (R$ 1.445)', custoBase: 1445 },
    { id: 'ev_relatorio_comparado', celulaPreco: 'D28', acao: 'Relatório Comparado', fonte: 'Tempo para elaboração x Montagem do relatório', formulaCustoLabel: '3 * Fonte!A3 * 7', custoBase: 247.8 },
    { id: 'ev_cobertura_n1', celulaPreco: 'D29', acao: 'Cobertura nível 1', fonte: 'Inclusão em post de grade do evento, Telegram fotos e cobertura padrão', formulaCustoLabel: 'Fotógrafo(A12)/5 + Post(I5) + Telegram(I10)', custoBase: 606 },
    { id: 'ev_cobertura_n2', celulaPreco: 'D30', acao: 'Cobertura nível 2', fonte: 'Nível 1 + Telegram e Post individual pré-evento, cobertura individual com congressistas, destaque nos materiais gerais, reels pós-evento', formulaCustoLabel: 'Cobertura N1 (C29) + Vídeo Curto (I11)', custoBase: 732 },
    { id: 'ev_patrocinio_master', celulaPreco: 'D31', acao: 'Patrocínio Master (1 por evento)', fonte: 'Upgrade da Magna incluindo naming rights, exposição, lote, case e cobertura nível 2', formulaCustoLabel: '(C21 + C30 + C24 + C25) * Markup Eventos', custoBase: 5126 },
  ],
  modificadoresEventos: [
    { id: 'mod_magna_centralrio', celulaPreco: 'J20', evento: 'Magna CentralRio', publico: 500, tipoBase: 'magna', isReferenciaCentralRio: true },
    { id: 'mod_paralela_centralrio', celulaPreco: 'J21', evento: 'Paralela CentralRio', publico: 500, tipoBase: 'paralela', isReferenciaCentralRio: true },
    { id: 'mod_magna_onde', celulaPreco: 'J23', evento: 'Magna ONDE', publico: 450, tipoBase: 'magna' },
    { id: 'mod_paralela_onde', celulaPreco: 'J24', evento: 'Paralela ONDE', publico: 450, tipoBase: 'paralela' },
    { id: 'mod_magna_efej', celulaPreco: 'J25', evento: 'Magna EFEJ', publico: 400, tipoBase: 'magna' },
    { id: 'mod_paralela_efej', celulaPreco: 'J26', evento: 'Paralela EFEJ', publico: 400, tipoBase: 'paralela' },
    { id: 'mod_premio_rj', celulaPreco: 'J27', evento: 'Prêmio RioJunior', publico: 400, tipoBase: 'paralela' },
    { id: 'mod_rj76', celulaPreco: 'J28', evento: 'RJ 76', publico: 180, tipoBase: 'magna' },
  ],
  fatorAntecipadoEFEJ: 0.85,
  calculadoraRows: [
    // BLOCO 1: CONSCIÊNCIA - PLANO DE COMUNICAÇÃO (B6:E12)
    { id: 'calc_consc_post', bloco: 'consciencia', categoria: 'Consciência', acao: 'Post unitário (estático pra rede social)', unidades: 0, sugestaoPacote: 2, refKey: 'midia_post', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J5" },
    { id: 'calc_consc_carrossel', bloco: 'consciencia', categoria: 'Consciência', acao: 'Carrossel Curto', unidades: 0, sugestaoPacote: 2, refKey: 'midia_carrossel', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J6" },
    { id: 'calc_consc_story', bloco: 'consciencia', categoria: 'Consciência', acao: 'Story unitário (estático)', unidades: 0, sugestaoPacote: 4, refKey: 'midia_story', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J7" },
    { id: 'calc_consc_seq_story', bloco: 'consciencia', categoria: 'Consciência', acao: 'Sequência de Story (máximo 5)', unidades: 0, sugestaoPacote: 1, refKey: 'midia_seq_story', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J8" },
    { id: 'calc_consc_reels', bloco: 'consciencia', categoria: 'Consciência', acao: 'Reels (edição de vídeo trailer)', unidades: 0, sugestaoPacote: 1, refKey: 'midia_reels', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J9" },
    { id: 'calc_consc_telegram', bloco: 'consciencia', categoria: 'Consciência', acao: 'Divulgação Telegram (Banner/flyer)', unidades: 0, sugestaoPacote: 2, refKey: 'midia_telegram', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J10" },
    { id: 'calc_consc_video_curto', bloco: 'consciencia', categoria: 'Consciência', acao: 'Vídeo Curto (video teaser)', unidades: 0, refKey: 'midia_video_curto', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J11" },

    // BLOCO 2: INTERESSE - PROGRAMAS & INICIATIVAS (H6:K9)
    { id: 'calc_int_hackathon', bloco: 'interesse_programas', categoria: 'Interesse', acao: 'Hackathon', unidades: 0, refKey: 'jornada_hackathon', refFormulaExcel: "'Base de Custos | Fixos e Ações'!Q6" },
    { id: 'calc_int_fu', bloco: 'interesse_programas', categoria: 'Interesse', acao: 'Participação em Programas (FU)', unidades: 0, refKey: 'jornada_fu', refFormulaExcel: "'Base de Custos | Fixos e Ações'!Q7" },
    { id: 'calc_int_ignicao', bloco: 'interesse_programas', categoria: 'Interesse', acao: 'Participação em Programas (Ignição)', unidades: 0, refKey: 'jornada_ignicao', refFormulaExcel: "'Base de Custos | Fixos e Ações'!Q8" },
    { id: 'calc_int_visita', bloco: 'interesse_programas', categoria: 'Interesse', acao: 'Visita / Working Day', unidades: 0, refKey: 'jornada_visita', refFormulaExcel: "'Base de Custos | Fixos e Ações'!Q9" },

    // BLOCO 3: INTERESSE - PRODUTOS DE CONEXÃO / EVENTOS (M6:P24 + B31:E34)
    { id: 'calc_ev_produto_conexao', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Produto de Conexão', unidades: 0, refKey: 'ev_relatorio_comparado', refFormulaExcel: "'Base de Custos | Fixos e Ações'!D28" },
    { id: 'calc_ev_div_pre_n1', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Divulgação pré-evento nível 1', unidades: 1, refKey: 'ev_cobertura_n1', refFormulaExcel: "'Base de Custos | Fixos e Ações'!D29" },
    { id: 'calc_ev_div_pre_n2', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Divulgação pré-evento nível 2', unidades: 0, refKey: 'ev_cobertura_n2', refFormulaExcel: "'Base de Custos | Fixos e Ações'!D30" },
    { id: 'calc_ev_magna_centralrio', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Magna CentralRio', unidades: 0, refKey: 'mod_magna_centralrio', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J20" },
    { id: 'calc_ev_paralela_centralrio', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Paralela CentralRio', unidades: 1, refKey: 'mod_paralela_centralrio', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J21" },
    { id: 'calc_ev_magna_onde', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Magna ONDE', unidades: 0, refKey: 'mod_magna_onde', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J23" },
    { id: 'calc_ev_paralela_onde', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Paralela ONDE', unidades: 0, refKey: 'mod_paralela_onde', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J24" },
    { id: 'calc_ev_magna_efej', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Magna EFEJ', unidades: 1, refKey: 'mod_magna_efej', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J25" },
    { id: 'calc_ev_paralela_efej', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Paralela EFEJ', unidades: 0, refKey: 'mod_paralela_efej', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J26" },
    { id: 'calc_ev_magna_efej_prox', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Magna EFEJ (ano seguinte)', unidades: 0, refKey: 'mod_magna_efej', multiplicadorFormula: 0.85, refFormulaExcel: "'Base de Custos | Fixos e Ações'!J25*0.85" },
    { id: 'calc_ev_paralela_efej_prox', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Paralela EFEJ (ano seguinte)', unidades: 0, refKey: 'mod_paralela_onde', multiplicadorFormula: 0.85, refFormulaExcel: "'Base de Custos | Fixos e Ações'!J24*0.85" },
    { id: 'calc_ev_premio_rj', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Prêmio RioJunior', unidades: 0, refKey: 'mod_premio_rj', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J27" },
    { id: 'calc_ev_rj76', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'RJ 76', unidades: 0, refKey: 'mod_rj76', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J28" },
    { id: 'calc_ev_relatorio_comp_custo', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Relatório Comparado', unidades: 0, refKey: 'ev_relatorio_comparado', refFormulaExcel: "'Base de Custos | Fixos e Ações'!D28" },
    { id: 'calc_ev_div_invest_jr', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Divulgação Invest. Jr', unidades: 0, refKey: 'ev_divulgacao_invest_jr', refFormulaExcel: "'Base de Custos | Fixos e Ações'!D23" },
    { id: 'calc_ev_case_parceiro', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Case Parceiro', unidades: 0, refKey: 'ev_case_parceiro', refFormulaExcel: "'Base de Custos | Fixos e Ações'!D24" },
    { id: 'calc_ev_lote_parceiro', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Lote Parceiro', unidades: 0, refKey: 'ev_lote_parceiro', refFormulaExcel: "'Base de Custos | Fixos e Ações'!D25" },
    { id: 'calc_ev_exposicao_presencial', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Exposição Presencial', unidades: 0, refKey: 'ev_exposicao_presencial', refFormulaExcel: "'Base de Custos | Fixos e Ações'!D27" },
    { id: 'calc_ev_prog_flash', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Programação Flash', unidades: 0, refKey: 'ev_programacao_flash', refFormulaExcel: "'Base de Custos | Fixos e Ações'!D26" },
    { id: 'calc_ev_patrocinio_master', bloco: 'produtos_conexao', categoria: 'Interesse', acao: 'Patrocínio Master (1 por evento)', unidades: 0, refKey: 'ev_patrocinio_master', refFormulaExcel: "'Base de Custos | Fixos e Ações'!D31" },

    // BLOCO 4: CONVERSÃO - DIVULGAÇÃO DE PS & HEADHUNTING (R6:U11 + B36:E37)
    { id: 'calc_conv_post', bloco: 'conversao_ps', categoria: 'Conversão', acao: 'Post unitário (estático pra rede social)', unidades: 0, refKey: 'midia_post', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J5" },
    { id: 'calc_conv_carrossel', bloco: 'conversao_ps', categoria: 'Conversão', acao: 'Carrossel Curto', unidades: 0, refKey: 'midia_carrossel', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J6" },
    { id: 'calc_conv_story', bloco: 'conversao_ps', categoria: 'Conversão', acao: 'Story unitário (estático)', unidades: 0, refKey: 'midia_story', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J7" },
    { id: 'calc_conv_seq_story', bloco: 'conversao_ps', categoria: 'Conversão', acao: 'Sequência de Story (máximo 5)', unidades: 0, refKey: 'midia_seq_story', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J8" },
    { id: 'calc_conv_reels', bloco: 'conversao_ps', categoria: 'Conversão', acao: 'Reels (edição de vídeo trailer)', unidades: 0, refKey: 'midia_reels', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J9" },
    { id: 'calc_conv_telegram', bloco: 'conversao_ps', categoria: 'Conversão', acao: 'Divulgação Telegram (Banner/flyer)', unidades: 0, refKey: 'midia_telegram', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J10" },
    { id: 'calc_conv_video_curto', bloco: 'conversao_ps', categoria: 'Conversão', acao: 'Vídeo Curto (video teaser)', unidades: 0, refKey: 'midia_video_curto', refFormulaExcel: "'Base de Custos | Fixos e Ações'!J11" },
    { id: 'calc_conv_headhunting', bloco: 'conversao_ps', categoria: 'Conversão', acao: 'Headhunting', unidades: 0, refKey: 'jornada_headhunting', refFormulaExcel: "'Base de Custos | Fixos e Ações'!Q5" },
  ],
  catalogoRows: [
    { id: 'cat_1', categoria: 'Consciência', acao: 'Plano de Comunicação', etapa: 'Consciência', precoTextoFixo: 'Combinação das unidades de itens abaixo', descricao: 'Inclui obrigatoriamente a celebração de parceria', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_2', categoria: 'Consciência', acao: 'Post', etapa: 'Consciência', refKey: 'midia_post', descricao: 'Post unitário no Instagram', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_3', categoria: 'Consciência', acao: 'Post carrossel', etapa: 'Consciência', refKey: 'midia_carrossel', descricao: 'Sequência de fotos no mesmo post', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_4', categoria: 'Consciência', acao: 'Story', etapa: 'Consciência', refKey: 'midia_story', descricao: 'Story unitário', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_5', categoria: 'Consciência', acao: 'Sequência de Story', etapa: 'Consciência', refKey: 'midia_seq_story', descricao: 'Sequência de stories', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_6', categoria: 'Consciência', acao: 'Reels', etapa: 'Consciência', refKey: 'midia_reels', descricao: 'Reels divulgando a marca parceira', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_7', categoria: 'Consciência', acao: 'Divulgação Telegram', etapa: 'Consciência', refKey: 'midia_telegram', descricao: 'Divulgação unitária de tema definido pelo parceiro nos canais do Telegram', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_8', categoria: 'Interesse', acao: 'Visita/Working Day', etapa: 'Interesse', refKey: 'jornada_visita', descricao: 'Ida de EJs e nichos selecionados ao escritório/sede do parceiro', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_9', categoria: 'Interesse', acao: 'Programas', etapa: 'Interesse', precoTextoFixo: 'Varia por programa', descricao: 'Programas de contato qualitativo com empresas juniores ao longo do ano', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_10', categoria: 'Interesse', acao: 'Ignição', etapa: 'Interesse', refKey: 'jornada_ignicao', descricao: 'Programa voltado a capacitar técnica e comportamentalmente as empresas participantes', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_11', categoria: 'Interesse', acao: 'Fábrica de Unicórnios (FU)', etapa: 'Interesse', refKey: 'jornada_fu', descricao: 'Programa voltado a desenvolver modelo de negócios e vendas de empresa juniores de maior maturidade no estado', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_12', categoria: 'Interesse', acao: 'Edital e Hackathon', etapa: 'Interesse', refKey: 'jornada_hackathon', descricao: 'Ação voltada a organizar contato direcionado e avaliativo da empresa aos empresários juniores onde eles desenvolvem conteúdo para o crivo do parceiro', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_13', categoria: 'Interesse', acao: 'Evento em IES', etapa: 'Interesse', precoTextoFixo: 'Varia segundo precificação da EJ', descricao: 'Evento em IEs parceiras intermediado pela RioJunior e EJ parceira', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_14', categoria: 'Interesse', acao: 'Produtos de Conexão', etapa: 'Interesse', precoTextoFixo: 'Combinação dos itens da participação', descricao: 'Eventos de conexão massiva entre empresários juniores', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_15', categoria: 'Interesse', acao: 'RJ 76', etapa: 'Interesse', refKey: 'mod_rj76', descricao: 'Evento imersivo direcionado às lideranças das empresas juniores fluminenses', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_16', categoria: 'Interesse', acao: 'ONDE', etapa: 'Interesse', precoTextoFixo: 'Combinação dos itens da participação', descricao: 'Primeiro ponto de contato em massa com as empresas juniores do estado', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_17', categoria: 'Interesse', acao: 'CentralRio', etapa: 'Interesse', precoTextoFixo: 'Combinação dos itens da participação', descricao: 'Evento de maior adesão no ano. Expositivo e com foco em pautas técnicas e comportamentais 500 a 600 congressistas.', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_18', categoria: 'Interesse', acao: 'EFEJ', etapa: 'Interesse', precoTextoFixo: 'Combinação dos itens da participação', descricao: 'Ponto alto da jornada do empresário júnior no ano. Maior chance para o parceiro de criar conexão com o empresário júnior durante a jornada.', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_19', categoria: 'Interesse', acao: 'Pauta Magna', etapa: 'Interesse', refKey: 'ev_pauta_magna', descricao: 'Pauta de maior adesão no evento (estimativa de público total do evento)', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_20', categoria: 'Interesse', acao: 'Pauta Paralela', etapa: 'Interesse', refKey: 'ev_pauta_paralela', descricao: 'Pautas concomitantes no evento ao longo do dia (público parcial do evento)', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_21', categoria: 'Interesse', acao: 'Divulgação Invest. Jr', etapa: 'Interesse', refKey: 'ev_divulgacao_invest_jr', descricao: 'Divulgação da contribuição de acessibilidade inclusa na cota de patrocínio', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_22', categoria: 'Interesse', acao: 'Divulgação Pré-Evento Nível 1', etapa: 'Interesse', refKey: 'ev_cobertura_n1', descricao: 'Inclusão na linha editorial padrão do evento', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_23', categoria: 'Interesse', acao: 'Divulgação Pré-Evento Nível 2', etapa: 'Interesse', refKey: 'ev_cobertura_n2', descricao: 'Material e posts dedicados na estratégia de divulgação pré-evento', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_24', categoria: 'Interesse', acao: 'Patrocínio Presencial', etapa: 'Interesse', refKey: 'ev_exposicao_presencial', descricao: 'Divulgação presencial no evento em banners, crachás e camisas de staff', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_25', categoria: 'Interesse', acao: 'Programação Flash', etapa: 'Interesse', refKey: 'ev_programacao_flash', descricao: 'Ativações rápidas (até 15 minutos) ao longo da programação principal do evento', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_26', categoria: 'Interesse', acao: 'Lote Parceiro', etapa: 'Interesse', refKey: 'ev_lote_parceiro', descricao: 'Lote com o nome da empresa parceira', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_27', categoria: 'Interesse', acao: 'Case Parceiro', etapa: 'Interesse', refKey: 'ev_case_parceiro', descricao: 'Case com o nome da empresa parceira voltado a reconhecer EJs de performance destaque no tema selecionado pelo parceiro', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_28', categoria: 'Interesse', acao: 'Relatório Comparado', etapa: 'Interesse', refKey: 'ev_relatorio_comparado', descricao: 'Relatório comparando a percepção da participação do parceiro com outras empresas participantes no evento', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_29', categoria: 'Interesse', acao: 'Ativação presencial', etapa: 'Interesse', precoTextoFixo: 'Varia mediante evento - consultar calculadora', descricao: 'Ações Interativas no evento', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_30', categoria: 'Interesse', acao: 'ImpulsionAI', etapa: 'Interesse', precoTextoFixo: 'Sem custos - utilizado como overdelivery', descricao: 'Evento online voltado a capacitação técnica e comportamental de empresários juniores.', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_31', categoria: 'Interesse', acao: 'Prêmio RioJunior', etapa: 'Interesse', refKey: 'mod_premio_rj', descricao: 'Conclusão da jornada de conteúdo do empresário júnior - voltado a reconhecer performance e desempenho das empresas e empresários ao fim do ano.', kpis: 'NPS, Awareness, Interesse e Empregabilidade (pré e pós ação)' },
    { id: 'cat_32', categoria: 'Conversão', acao: 'Campanha de Processo Seletivo', etapa: 'Conversão', precoTextoFixo: 'Combinação das unidades de itens abaixo', descricao: 'Utilização da capilaridade da RioJunior para potencialização das conversões no processo seletivo do parceiro', kpis: 'Contatos indicados, Inscrições, Taxa de Contratação' },
    { id: 'cat_33', categoria: 'Conversão', acao: 'Post', etapa: 'Conversão', refKey: 'midia_post', descricao: 'Post unitário no Instagram', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_34', categoria: 'Conversão', acao: 'Post carrossel', etapa: 'Conversão', refKey: 'midia_carrossel', descricao: 'Sequência de fotos no mesmo post', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_35', categoria: 'Conversão', acao: 'Story', etapa: 'Conversão', refKey: 'midia_story', descricao: 'Story unitário', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_36', categoria: 'Conversão', acao: 'Sequência de Story', etapa: 'Conversão', refKey: 'midia_seq_story', descricao: 'Sequência de stories', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_37', categoria: 'Conversão', acao: 'Reels', etapa: 'Conversão', refKey: 'midia_reels', descricao: 'Reels divulgando a marca parceira', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_38', categoria: 'Conversão', acao: 'Divulgação Telegram', etapa: 'Conversão', refKey: 'midia_telegram', descricao: 'Divulgação unitária de tema definido pelo parceiro nos canais do Telegram', kpis: 'Curtidas, Menções, Interações e Comentários' },
    { id: 'cat_39', categoria: 'Conversão', acao: 'Headhunting', etapa: 'Conversão', refKey: 'jornada_headhunting', descricao: 'Indicação direta de contatos para vagas e processos seletivos do parceiro', kpis: 'Contatos indicados, Inscrições, Taxa de Contratação' },
  ],
  kpiRegistros: [
    {
      id: 'kpi_seed_1',
      acao: 'Pauta Magna',
      parceiro: 'Bain',
      dataAcao: '2026-05-15',
      evento: 'CentralRio',
      empresariosImpactados: 520,
      curtidas: 340,
      mencoes: 85,
      interacoes: 490,
      comentarios: 42,
      nps: 92,
      awarenessPre: 64,
      awarenessPos: 95,
      interessePre: 58,
      interessePos: 89,
      empregabilidadePre: 52,
      empregabilidadePos: 86,
      contatosIndicados: 45,
      inscricoesFacilitadas: 130,
      conversoes: 18,
    },
  ],
  simulacoesSalvas: [],
  descontoPropostaAtual: 0,
  parceiroPropostaAtual: '',
};

export function useVPNegCalculator() {
  const [state, setState] = useState<VPNegCalculatorState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...INITIAL_CALCULATOR_STATE, ...parsed };
      }
    } catch (e) {
      console.error('Erro ao carregar calculadora VPNeg:', e);
    }
    return INITIAL_CALCULATOR_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Erro ao salvar calculadora VPNeg:', e);
    }
  }, [state]);

  // =========================================================================
  // 1. MOTOR DE CÁLCULO DA FONTE DE CÁLCULOS (A2:A12)
  // =========================================================================
  const computedFonte = useMemo(() => {
    const map: Record<string, number> = {};
    state.fonteCalculos.forEach(f => {
      map[f.celula] = f.override !== undefined && f.override !== null ? f.override : f.valor;
    });

    const a2 = map['A2'] ?? 1900;
    const a3 = map['A3'] ?? 11.8;
    const a4 = map['A4'] ?? 3;
    const a5 = map['A5'] ?? 45;

    const fA6 = state.fonteCalculos.find(f => f.celula === 'A6');
    const a6 = fA6?.override !== undefined && fA6?.override !== null ? fA6.override : 0.8 * a3;

    const fA7 = state.fonteCalculos.find(f => f.celula === 'A7');
    const a7 = fA7?.override !== undefined && fA7?.override !== null ? fA7.override : 0.6 * a3;

    const a8 = map['A8'] ?? 3;
    const a9 = map['A9'] ?? 45;
    const a10 = map['A10'] ?? 100;

    const avgHH = (a3 + a6 + a7) / 3;
    const fA11 = state.fonteCalculos.find(f => f.celula === 'A11');
    const a11 = fA11?.override !== undefined && fA11?.override !== null ? fA11.override : a4 * avgHH * a10;

    const a12 = map['A12'] ?? 2400;

    return {
      A2: a2,
      A3: a3,
      A4: a4,
      A5: a5,
      A6: a6,
      A7: a7,
      A8: a8,
      A9: a9,
      A10: a10,
      A11: a11,
      A12: a12,
      avgHH,
    };
  }, [state.fonteCalculos]);

  // =========================================================================
  // 2. MOTOR DE CÁLCULO DE MARKUP (C11 e C12)
  // =========================================================================
  const computedMarkup = useMemo(() => {
    const { dfFat, dvFat, mlGeral, mlEventos, markupGeralOverride, markupEventosOverride } = state.markupConfig;
    const denomGeral = 100 - (dfFat + dvFat + mlGeral);
    const calcGeral = denomGeral > 0 ? 100 / denomGeral : 1.738737329;

    const denomEventos = 100 - (dfFat + dvFat + mlEventos);
    const calcEventos = denomEventos > 0 ? 100 / denomEventos : 1.738737329;

    return {
      markupGeralCalculado: calcGeral,
      markupGeral: markupGeralOverride !== undefined && markupGeralOverride !== null ? markupGeralOverride : calcGeral,
      markupEventosCalculado: calcEventos,
      markupEventos: markupEventosOverride !== undefined && markupEventosOverride !== null ? markupEventosOverride : calcEventos,
    };
  }, [state.markupConfig]);

  // =========================================================================
  // 3. MOTOR DE CÁLCULO DE MÍDIA TERCEIRIZADA (F5:J11)
  // =========================================================================
  const computedMidia = useMemo(() => {
    const limite = state.markupConfig.terceirizadaLimiteCreditos || 40;
    const mensalidade = state.markupConfig.terceirizadaMensalidade || 2520;
    const mkGeral = computedMarkup.markupGeral;

    return state.midiaItens.map(item => {
      const custoRelativo = limite > 0 ? item.creditos / limite : 0;
      const custoUnitarioCalculado = custoRelativo * mensalidade;
      const custoUnitario = item.custoUnitarioOverride !== undefined && item.custoUnitarioOverride !== null
        ? item.custoUnitarioOverride
        : custoUnitarioCalculado;
      const precoCalculado = custoUnitario * mkGeral;
      const precoUnitario = item.precoUnitarioOverride !== undefined && item.precoUnitarioOverride !== null
        ? item.precoUnitarioOverride
        : precoCalculado;

      return {
        ...item,
        custoRelativo,
        custoUnitarioCalculado,
        custoUnitario,
        precoCalculado,
        precoUnitario,
      };
    });
  }, [state.midiaItens, state.markupConfig, computedMarkup]);

  // =========================================================================
  // 4. MOTOR DE CÁLCULO DE JORNADA & INTERESSE (O5:Q9)
  // =========================================================================
  const computedJornada = useMemo(() => {
    const mkGeral = computedMarkup.markupGeral;
    const { A2, A3, A4, A5, A7, A11, avgHH } = computedFonte;

    return state.jornadaItens.map(item => {
      let custoFormula = 0;
      if (item.id === 'jornada_headhunting') custoFormula = A2;
      else if (item.id === 'jornada_hackathon') custoFormula = A11;
      else if (item.id === 'jornada_fu') custoFormula = A3 * A4 * A5;
      else if (item.id === 'jornada_ignicao') custoFormula = A7 * A4 * A5;
      else if (item.id === 'jornada_visita') custoFormula = avgHH * 40 * 3;

      const custo = item.custoOverride !== undefined && item.custoOverride !== null
        ? item.custoOverride
        : custoFormula;
      const precoCalculado = custo * mkGeral;
      const precoUnitario = item.precoUnitarioOverride !== undefined && item.precoUnitarioOverride !== null
        ? item.precoUnitarioOverride
        : precoCalculado;

      return {
        ...item,
        custoFormula,
        custo,
        precoCalculado,
        precoUnitario,
      };
    });
  }, [state.jornadaItens, computedFonte, computedMarkup]);

  // =========================================================================
  // 5. MOTOR DE CÁLCULO DE CUSTOS BASE DE EVENTOS (B21:E31)
  // =========================================================================
  const computedEventosBase = useMemo(() => {
    const mkEventos = computedMarkup.markupEventos;
    const { A3, A12, avgHH } = computedFonte;

    const postMidia = computedMidia.find(m => m.id === 'midia_post');
    const telegramMidia = computedMidia.find(m => m.id === 'midia_telegram');
    const videoCurtoMidia = computedMidia.find(m => m.id === 'midia_video_curto');

    const I5 = postMidia?.custoUnitario ?? 63;
    const I10 = telegramMidia?.custoUnitario ?? 63;
    const I11 = videoCurtoMidia?.custoUnitario ?? 126;

    // Primeiro resolvemos C21 (Pauta Magna) pois C22 e C26 dependem dele
    const magnaItem = state.eventosCustosBase.find(e => e.id === 'ev_pauta_magna');
    const C21 = magnaItem?.custoOverride !== undefined && magnaItem?.custoOverride !== null
      ? magnaItem.custoOverride
      : (magnaItem?.custoBase ?? 3760);

    const C24_formula = (200 * 0.5 * avgHH) / 3;
    const caseItem = state.eventosCustosBase.find(e => e.id === 'ev_case_parceiro');
    const C24 = caseItem?.custoOverride !== undefined && caseItem?.custoOverride !== null
      ? caseItem.custoOverride
      : C24_formula;

    const loteItem = state.eventosCustosBase.find(e => e.id === 'ev_lote_parceiro');
    const C25 = loteItem?.custoOverride !== undefined && loteItem?.custoOverride !== null
      ? loteItem.custoOverride
      : (loteItem?.custoBase ?? 126.88);

    const C29_formula = A12 / 5 + I5 + I10;
    const cob1Item = state.eventosCustosBase.find(e => e.id === 'ev_cobertura_n1');
    const C29 = cob1Item?.custoOverride !== undefined && cob1Item?.custoOverride !== null
      ? cob1Item.custoOverride
      : C29_formula;

    const C30_formula = C29 + I11;
    const cob2Item = state.eventosCustosBase.find(e => e.id === 'ev_cobertura_n2');
    const C30 = cob2Item?.custoOverride !== undefined && cob2Item?.custoOverride !== null
      ? cob2Item.custoOverride
      : C30_formula;

    return state.eventosCustosBase.map(item => {
      let custoFormula = item.custoBase;
      if (item.id === 'ev_pauta_magna') custoFormula = item.custoBase;
      else if (item.id === 'ev_pauta_paralela') custoFormula = C21 * 0.5;
      else if (item.id === 'ev_divulgacao_invest_jr') custoFormula = I5;
      else if (item.id === 'ev_case_parceiro') custoFormula = C24_formula;
      else if (item.id === 'ev_lote_parceiro') custoFormula = item.custoBase;
      else if (item.id === 'ev_programacao_flash') custoFormula = C21 / 6;
      else if (item.id === 'ev_exposicao_presencial') custoFormula = item.custoBase;
      else if (item.id === 'ev_relatorio_comparado') custoFormula = 3 * A3 * 7;
      else if (item.id === 'ev_cobertura_n1') custoFormula = C29_formula;
      else if (item.id === 'ev_cobertura_n2') custoFormula = C30_formula;
      else if (item.id === 'ev_patrocinio_master') custoFormula = item.custoBase;

      const custo = item.custoOverride !== undefined && item.custoOverride !== null
        ? item.custoOverride
        : custoFormula;

      let precoCalculado = custo * mkEventos;
      if (item.id === 'ev_patrocinio_master') {
        precoCalculado = item.custoOverride !== undefined && item.custoOverride !== null
          ? item.custoOverride * mkEventos
          : (C21 + C30 + C24 + C25) * mkEventos;
      }

      const precoUnitario = item.precoUnitarioOverride !== undefined && item.precoUnitarioOverride !== null
        ? item.precoUnitarioOverride
        : precoCalculado;

      return {
        ...item,
        custoFormula,
        custo,
        precoCalculado,
        precoUnitario,
      };
    });
  }, [state.eventosCustosBase, computedMarkup, computedFonte, computedMidia]);

  // =========================================================================
  // 6. MOTOR DE MODIFICADORES DE PAUTA POR PÚBLICO DE EVENTO (G20:J28)
  // =========================================================================
  const computedModificadoresEventos = useMemo(() => {
    const d21 = computedEventosBase.find(e => e.id === 'ev_pauta_magna')?.precoUnitario ?? 6537.652357;
    const d22 = computedEventosBase.find(e => e.id === 'ev_pauta_paralela')?.precoUnitario ?? 3268.826178;

    const refMagna = state.modificadoresEventos.find(m => m.id === 'mod_magna_centralrio');
    const H20 = refMagna?.publico || 500;

    const J20 = refMagna?.precoOverride !== undefined && refMagna?.precoOverride !== null ? refMagna.precoOverride : d21;
    const refParalela = state.modificadoresEventos.find(m => m.id === 'mod_paralela_centralrio');
    const J21 = refParalela?.precoOverride !== undefined && refParalela?.precoOverride !== null ? refParalela.precoOverride : d22;

    return state.modificadoresEventos.map(mod => {
      const proporcaoPublico = H20 > 0 ? mod.publico / H20 : 1;
      let precoCalculado = d21;
      if (mod.id === 'mod_magna_centralrio') precoCalculado = d21;
      else if (mod.id === 'mod_paralela_centralrio') precoCalculado = d22;
      else if (mod.tipoBase === 'magna') precoCalculado = J20 * proporcaoPublico;
      else precoCalculado = J21 * proporcaoPublico;

      const precoUnitario = mod.precoOverride !== undefined && mod.precoOverride !== null
        ? mod.precoOverride
        : precoCalculado;

      return {
        ...mod,
        proporcaoPublico,
        precoCalculado,
        precoUnitario,
      };
    });
  }, [state.modificadoresEventos, computedEventosBase]);

  // Mapa unificado de preços da Base de Custos por refKey
  const basePriceMap = useMemo(() => {
    const map: Record<string, number> = {};
    computedMidia.forEach(m => { map[m.id] = m.precoUnitario; });
    computedJornada.forEach(j => { map[j.id] = j.precoUnitario; });
    computedEventosBase.forEach(e => { map[e.id] = e.precoUnitario; });
    computedModificadoresEventos.forEach(mod => { map[mod.id] = mod.precoUnitario; });
    return map;
  }, [computedMidia, computedJornada, computedEventosBase, computedModificadoresEventos]);

  // =========================================================================
  // 7. LINHAS DA CALCULADORA E TOTAIS POR BLOCO
  // =========================================================================
  const computedCalculadoraRows = useMemo(() => {
    return state.calculadoraRows.map(row => {
      const rawBase = basePriceMap[row.refKey] ?? 0;
      const mult = row.multiplicadorFormula !== undefined ? row.multiplicadorFormula : 1;
      const precoBaseCalculado = rawBase * mult;
      const isOverridden = row.valorPraticadoOverride !== undefined && row.valorPraticadoOverride !== null;
      const valorUnitarioPraticado = isOverridden ? (row.valorPraticadoOverride as number) : precoBaseCalculado;
      const subtotal = (row.unidades || 0) * valorUnitarioPraticado;

      return {
        ...row,
        precoBaseCalculado,
        isOverridden,
        valorUnitarioPraticado,
        subtotal,
      };
    });
  }, [state.calculadoraRows, basePriceMap]);

  const totaisCalculadora = useMemo(() => {
    const totalConsciencia = computedCalculadoraRows
      .filter(r => r.bloco === 'consciencia')
      .reduce((acc, r) => acc + r.subtotal, 0);

    const totalInteresseProgramas = computedCalculadoraRows
      .filter(r => r.bloco === 'interesse_programas')
      .reduce((acc, r) => acc + r.subtotal, 0);

    const totalProdutosConexao = computedCalculadoraRows
      .filter(r => r.bloco === 'produtos_conexao')
      .reduce((acc, r) => acc + r.subtotal, 0);

    const totalConversaoPS = computedCalculadoraRows
      .filter(r => r.bloco === 'conversao_ps')
      .reduce((acc, r) => acc + r.subtotal, 0);

    const somaExata = totalConsciencia + totalInteresseProgramas + totalProdutosConexao + totalConversaoPS;
    const totalArredondado = Math.round(somaExata);
    const desconto = state.descontoPropostaAtual || 0;
    const totalComDesconto = Math.max(0, totalArredondado - desconto);

    return {
      totalConsciencia,
      totalInteresseProgramas,
      totalProdutosConexao,
      totalConversaoPS,
      somaExata,
      totalArredondado,
      desconto,
      totalComDesconto,
    };
  }, [computedCalculadoraRows, state.descontoPropostaAtual]);

  // =========================================================================
  // 8. CATÁLOGO COM PREÇOS DINÂMICOS
  // =========================================================================
  const computedCatalogo = useMemo(() => {
    return state.catalogoRows.map(cat => {
      const precoBase = cat.refKey ? basePriceMap[cat.refKey] : undefined;
      const precoFinal = cat.precoOverride !== undefined && cat.precoOverride !== null
        ? cat.precoOverride
        : precoBase;
      return {
        ...cat,
        precoBase,
        precoFinal,
      };
    });
  }, [state.catalogoRows, basePriceMap]);

  // =========================================================================
  // HANDLERS DE EDIÇÃO DA CALCULADORA E BASE DE CÁLCULO
  // =========================================================================
  const setUnidades = useCallback((rowId: string, unidades: number) => {
    const val = Math.max(0, Number.isFinite(unidades) ? unidades : 0);
    setState(prev => ({
      ...prev,
      calculadoraRows: prev.calculadoraRows.map(r => r.id === rowId ? { ...r, unidades: val } : r),
    }));
  }, []);

  const setValorPraticado = useCallback((rowId: string, valor: number | null) => {
    setState(prev => ({
      ...prev,
      calculadoraRows: prev.calculadoraRows.map(r => r.id === rowId ? { ...r, valorPraticadoOverride: valor } : r),
    }));
  }, []);

  const setMultiplicadorLinha = useCallback((rowId: string, mult: number) => {
    setState(prev => ({
      ...prev,
      calculadoraRows: prev.calculadoraRows.map(r => r.id === rowId ? { ...r, multiplicadorFormula: mult } : r),
    }));
  }, []);

  const aplicarPacoteSugeridoComunicacao = useCallback(() => {
    setState(prev => ({
      ...prev,
      calculadoraRows: prev.calculadoraRows.map(r =>
        r.bloco === 'consciencia' && r.sugestaoPacote !== undefined
          ? { ...r, unidades: r.sugestaoPacote }
          : r
      ),
    }));
    toast({ title: 'Pacote de Comunicação aplicado', description: 'Unidades padrão do Plano de Comunicação preenchidas.' });
  }, []);

  const zerarUnidades = useCallback(() => {
    setState(prev => ({
      ...prev,
      calculadoraRows: prev.calculadoraRows.map(r => ({ ...r, unidades: 0 })),
      descontoPropostaAtual: 0,
    }));
    toast({ title: 'Calculadora zerada', description: 'Todas as quantidades foram redefinidas para 0.' });
  }, []);

  const restaurarValoresPraticadosPadrao = useCallback(() => {
    setState(prev => ({
      ...prev,
      calculadoraRows: prev.calculadoraRows.map(r => ({ ...r, valorPraticadoOverride: null })),
    }));
    toast({ title: 'Preços restaurados', description: 'Todos os itens voltaram a usar o preço calculado pela Base de Custos.' });
  }, []);

  const addCustomCalculadoraRow = useCallback((nova: {
    bloco: CalculadoraActionRow['bloco'];
    categoria: CalculadoraActionRow['categoria'];
    acao: string;
    valorPraticado: number;
    unidades: number;
  }) => {
    const id = 'calc_custom_' + Date.now();
    setState(prev => ({
      ...prev,
      calculadoraRows: [
        ...prev.calculadoraRows,
        {
          id,
          bloco: nova.bloco,
          categoria: nova.categoria,
          acao: nova.acao,
          unidades: nova.unidades,
          refKey: 'custom',
          refFormulaExcel: String(nova.valorPraticado),
          valorPraticadoOverride: nova.valorPraticado,
        },
      ],
    }));
    toast({ title: 'Ação adicionada', description: `"${nova.acao}" incluída na calculadora.` });
  }, []);

  const deleteCalculadoraRow = useCallback((rowId: string) => {
    setState(prev => ({
      ...prev,
      calculadoraRows: prev.calculadoraRows.filter(r => r.id !== rowId),
    }));
  }, []);

  // Edição da Base de Cálculo
  const updateMarkupConfig = useCallback((updates: Partial<MarkupConfig>) => {
    setState(prev => ({
      ...prev,
      markupConfig: { ...prev.markupConfig, ...updates },
    }));
  }, []);

  const updateFonteCalculo = useCallback((id: string, novoValor: number, isOverride = false) => {
    setState(prev => ({
      ...prev,
      fonteCalculos: prev.fonteCalculos.map(f => {
        if (f.id !== id) return f;
        if (f.isFormula || isOverride) {
          return { ...f, override: novoValor };
        }
        return { ...f, valor: novoValor, override: null };
      }),
    }));
  }, []);

  const resetFonteCalculoOverride = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      fonteCalculos: prev.fonteCalculos.map(f => f.id === id ? { ...f, override: null } : f),
    }));
  }, []);

  const updateMidiaItem = useCallback((id: string, updates: Partial<MidiaCreditoItem>) => {
    setState(prev => ({
      ...prev,
      midiaItens: prev.midiaItens.map(m => m.id === id ? { ...m, ...updates } : m),
    }));
  }, []);

  const updateJornadaItem = useCallback((id: string, updates: Partial<JornadaCustoItem>) => {
    setState(prev => ({
      ...prev,
      jornadaItens: prev.jornadaItens.map(j => j.id === id ? { ...j, ...updates } : j),
    }));
  }, []);

  const updateEventoCustoBase = useCallback((id: string, updates: Partial<EventoCustoBaseItem>) => {
    setState(prev => ({
      ...prev,
      eventosCustosBase: prev.eventosCustosBase.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const updateModificadorEvento = useCallback((id: string, updates: Partial<ModificadorEventoItem>) => {
    setState(prev => ({
      ...prev,
      modificadoresEventos: prev.modificadoresEventos.map(m => m.id === id ? { ...m, ...updates } : m),
    }));
  }, []);

  const updateCatalogoRow = useCallback((id: string, updates: Partial<CatalogoAcaoRow>) => {
    setState(prev => ({
      ...prev,
      catalogoRows: prev.catalogoRows.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, []);

  const addKPIRegistro = useCallback((novo: Omit<KPIRegistroRow, 'id'>) => {
    setState(prev => ({
      ...prev,
      kpiRegistros: [
        { ...novo, id: 'kpi_' + Date.now() },
        ...prev.kpiRegistros,
      ],
    }));
    toast({ title: 'KPI registrado', description: `Registro para ${novo.parceiro} salvo com sucesso.` });
  }, []);

  const deleteKPIRegistro = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      kpiRegistros: prev.kpiRegistros.filter(k => k.id !== id),
    }));
  }, []);

  const setDescontoPropostaAtual = useCallback((desconto: number) => {
    setState(prev => ({ ...prev, descontoPropostaAtual: Math.max(0, desconto) }));
  }, []);

  const setParceiroPropostaAtual = useCallback((parceiro: string) => {
    setState(prev => ({ ...prev, parceiroPropostaAtual: parceiro }));
  }, []);

  // Salvar e Carregar Simulações
  const salvarSimulacao = useCallback((nomeProposta: string, parceiroNome: string, parceiroCardId?: string) => {
    const unidadesPorItem: Record<string, number> = {};
    const overridesPorItem: Record<string, number | null> = {};
    state.calculadoraRows.forEach(r => {
      if (r.unidades > 0) unidadesPorItem[r.id] = r.unidades;
      if (r.valorPraticadoOverride !== undefined && r.valorPraticadoOverride !== null) {
        overridesPorItem[r.id] = r.valorPraticadoOverride;
      }
    });

    const nova: SimulacaoSalva = {
      id: 'sim_' + Date.now(),
      nomeProposta: nomeProposta.trim() || `Proposta ${parceiroNome || 'Parceiro'}`,
      parceiroNome: parceiroNome.trim() || 'Parceiro',
      parceiroCardId,
      criadoEm: new Date().toISOString(),
      descontoManual: state.descontoPropostaAtual || 0,
      unidadesPorItem,
      overridesPorItem,
      totalCalculado: totaisCalculadora.totalArredondado,
      totalFinal: totaisCalculadora.totalComDesconto,
    };

    setState(prev => ({
      ...prev,
      simulacoesSalvas: [nova, ...prev.simulacoesSalvas],
    }));
    toast({ title: 'Simulação salva', description: `"${nova.nomeProposta}" salva no histórico da calculadora.` });
    return nova;
  }, [state.calculadoraRows, state.descontoPropostaAtual, totaisCalculadora]);

  const carregarSimulacao = useCallback((sim: SimulacaoSalva) => {
    setState(prev => ({
      ...prev,
      parceiroPropostaAtual: sim.parceiroNome,
      descontoPropostaAtual: sim.descontoManual,
      calculadoraRows: prev.calculadoraRows.map(r => ({
        ...r,
        unidades: sim.unidadesPorItem[r.id] ?? 0,
        valorPraticadoOverride: sim.overridesPorItem[r.id] ?? r.valorPraticadoOverride ?? null,
      })),
    }));
    toast({ title: 'Simulação carregada', description: `Dados de "${sim.nomeProposta}" aplicados na calculadora.` });
  }, []);

  const excluirSimulacao = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      simulacoesSalvas: prev.simulacoesSalvas.filter(s => s.id !== id),
    }));
  }, []);

  const resetarTudoParaPlanilhaOriginal = useCallback(() => {
    setState(INITIAL_CALCULATOR_STATE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CALCULATOR_STATE));
    toast({
      title: 'Planilha original restaurada',
      description: 'Todos os valores praticados, base de custos e fórmulas voltaram ao padrão da planilha VPNeg 2026.',
    });
  }, []);

  return {
    state,
    computedFonte,
    computedMarkup,
    computedMidia,
    computedJornada,
    computedEventosBase,
    computedModificadoresEventos,
    basePriceMap,
    computedCalculadoraRows,
    totaisCalculadora,
    computedCatalogo,
    setUnidades,
    setValorPraticado,
    setMultiplicadorLinha,
    aplicarPacoteSugeridoComunicacao,
    zerarUnidades,
    restaurarValoresPraticadosPadrao,
    addCustomCalculadoraRow,
    deleteCalculadoraRow,
    updateMarkupConfig,
    updateFonteCalculo,
    resetFonteCalculoOverride,
    updateMidiaItem,
    updateJornadaItem,
    updateEventoCustoBase,
    updateModificadorEvento,
    updateCatalogoRow,
    addKPIRegistro,
    deleteKPIRegistro,
    setDescontoPropostaAtual,
    setParceiroPropostaAtual,
    salvarSimulacao,
    carregarSimulacao,
    excluirSimulacao,
    resetarTudoParaPlanilhaOriginal,
  };
}

