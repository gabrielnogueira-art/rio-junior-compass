// src/services/processoSeletivoService.ts
// Serviço oficial e 100% editável para gestão do Processo Seletivo e Processo Aditivo Gamificado da RioJunior

import { GuildaKey } from '@/data/rolesGuildasData';

export type EtapaStatusCandidato =
  | 'disponivel'
  | 'agendado'
  | 'em_andamento'
  | 'entregue'
  | 'concluido'
  | 'revisao';

export type EntregaStatusCandidato =
  | 'pendente'
  | 'em_andamento'
  | 'entregue'
  | 'validado';

export interface NivelGamificacao {
  nivel: number;
  titulo: string;
  xpMinimo: number;
  cor: string;
}

export interface PSConfig {
  tituloEdicao: string;
  subtituloPortal: string;
  ciclo: string;
  statusEdicao: 'inscricoes_abertas' | 'etapas_avaliativas' | 'processo_aditivo' | 'finalizado';
  metaXpTotal: number;
  mensagemBoasVindasCandidato: string;
  avisoOrdemNaoLinear: string;
  linkEdital: string;
  linkComunidade: string;
  niveis: NivelGamificacao[];
}

export interface PSEtapaModular {
  id: string;
  titulo: string;
  subtitulo: string;
  categoria: 'coletivo' | 'individual' | 'entrevista' | 'imersao' | 'custom';
  descricao: string;
  criteriosAvaliacao: string[];
  xpMaximo: number;
  janelaData: string;
  formato: string;
  linkPadrao?: string;
  obrigatoria: boolean;
}

export interface PSEntregaAditivo {
  id: string;
  titulo: string;
  tipo: 'programa' | 'entrega' | 'rito' | 'desafio';
  guildaAlvo: 'TODAS' | GuildaKey;
  descricao: string;
  prazo: string; // YYYY-MM-DD
  horarioLimite: string;
  xpReward: number;
  obrigatoria: boolean;
  linkTemplate?: string;
}

export interface PSBadge {
  id: string;
  icone: string;
  titulo: string;
  descricao: string;
  xpBonus: number;
  criterioResumo: string;
}

export interface AvaliacaoEtapaCandidato {
  etapaId: string;
  status: EtapaStatusCandidato;
  nota?: number; // 0 a 10
  xpGanho: number;
  dataAgendada?: string;
  linkEspecifico?: string;
  linkSubmissaoCandidato?: string;
  feedbackPublico?: string;
  observacaoInterna?: string;
}

export interface ProgressoEntregaCandidato {
  entregaId: string;
  status: EntregaStatusCandidato;
  dataSubmissao?: string;
  linkEntrega?: string;
  comentarioCandidato?: string;
  feedbackAvaliador?: string;
  xpConcedido: number;
}

export interface PSCandidato {
  id: string;
  nome: string;
  email: string;
  codigoAcesso: string;
  telefone: string;
  ejOrigem: string;
  ies: string;
  regiao: string;
  guildaAlvo: GuildaKey;
  frenteAlvo: string;
  statusGeral: 'em_processo' | 'aditivo_ativo' | 'aprovado' | 'banco_talentos';
  dataInscricao: string;
  etapas: Record<string, AvaliacaoEtapaCandidato>;
  entregas: Record<string, ProgressoEntregaCandidato>;
  badgesDesbloqueadas: string[];
}

export interface PSState {
  config: PSConfig;
  etapas: PSEtapaModular[];
  entregas: PSEntregaAditivo[];
  badges: PSBadge[];
  candidatos: PSCandidato[];
}

export interface CandidatoGamificationStats {
  xpEtapas: number;
  xpEntregas: number;
  xpBadges: number;
  totalXp: number;
  metaXp: number;
  progressoPct: number;
  nivelAtual: NivelGamificacao;
  proximoNivel: NivelGamificacao | null;
  etapasConcluidas: number;
  totalEtapas: number;
  entregasConcluidas: number;
  totalEntregasAplicaveis: number;
}

const STORAGE_KEY_PS = 'riojunior_processo_seletivo_v1';

export const INITIAL_PS_STATE: PSState = {
  config: {
    tituloEdicao: 'Processo Seletivo & Aditivo RioJunior 2026',
    subtituloPortal: 'Portal Gamificado de Acompanhamento de Etapas, Programas e Entregas da Federação',
    ciclo: '2026.2 / 2027',
    statusEdicao: 'processo_aditivo',
    metaXpTotal: 1000,
    mensagemBoasVindasCandidato:
      'Bem-vindo(a) à sua jornada rumo ao Time RioJunior! Acompanhe aqui seus blocos avaliativos, seus prazos e sua evolução nos programas e entregas do Processo Aditivo.',
    avisoOrdemNaoLinear:
      'Importante: O Desafio Coletivo, o Desafio Individual, as Entrevistas e os Programas do Processo Aditivo são módulos independentes e não seguem necessariamente uma ordem cronológica fixa. Realize cada etapa conforme seu agendamento e prazos abaixo!',
    linkEdital: 'https://riojunior.com.br/edital-processo-seletivo',
    linkComunidade: 'https://chat.whatsapp.com/riojunior-ps',
    niveis: [
      { nivel: 1, titulo: 'Explorador Fluminense', xpMinimo: 0, cor: 'slate' },
      { nivel: 2, titulo: 'Talento em Imersão', xpMinimo: 300, cor: 'cyan' },
      { nivel: 3, titulo: 'Protagonista do Aditivo', xpMinimo: 650, cor: 'purple' },
      { nivel: 4, titulo: 'Pronto para Posse RJ', xpMinimo: 900, cor: 'amber' },
    ],
  },
  etapas: [
    {
      id: 'etapa_coletivo',
      titulo: 'Desafio Coletivo',
      subtitulo: 'Dinâmica em Grupo & Resolução Colaborativa de Case da Rede',
      categoria: 'coletivo',
      descricao:
        'Etapa colaborativa em grupo focada na resolução de uma dor real das Empresas Juniores fluminenses. Avalia escuta ativa, construção conjunta, sinergia cultural e protagonismo compartilhado.',
      criteriosAvaliacao: [
        'Trabalho em equipe e escuta ativa',
        'Conexão com a cultura e valores da RioJunior',
        'Estruturação lógica da solução em grupo',
        'Comunicação assertiva e síntese',
      ],
      xpMaximo: 250,
      janelaData: '04/11 a 10/11 (Horários por banca)',
      formato: 'Síncrono (Google Meet ou Presencial)',
      linkPadrao: 'https://meet.google.com/rio-ps-coletivo',
      obrigatoria: true,
    },
    {
      id: 'etapa_individual',
      titulo: 'Desafio Individual',
      subtitulo: 'Case Técnico Prático Direcionado à Guilda & Frente Escolhida',
      categoria: 'individual',
      descricao:
        'Construção individual de um diagnóstico e plano de ação prático voltado para a frente pretendida na RioJunior (ex.: Operações, DDR, VPNeg, FE, Presidência). Não depende da realização prévia da entrevista ou do coletivo.',
      criteriosAvaliacao: [
        'Profundidade analítica e domínio dos indicadores da frente',
        'Viabilidade prática do plano de ação proposto',
        'Organização visual e clareza da entrega',
        'Alinhamento com o Planejamento Estratégico da Rede (PE 25-27)',
      ],
      xpMaximo: 300,
      janelaData: 'Entrega até 14/11 às 23:59',
      formato: 'Assíncrono (Submissão de PDF / Apresentação / Planilha)',
      linkPadrao: 'https://drive.google.com/riojunior-cases',
      obrigatoria: true,
    },
    {
      id: 'etapa_entrevistas',
      titulo: 'Parte de Entrevistas',
      subtitulo: 'Bate-papo de Fit Cultural, Sabatina Técnica e Alinhamento de Rotina',
      categoria: 'entrevista',
      descricao:
        'Conversa individual com a Diretoria de Operações e lideranças da Guilda pretendida. Pode ocorrer antes, durante ou após os desafios coletivo e individual, de acordo com a disponibilidade agendada.',
      criteriosAvaliacao: [
        'Alinhamento de propósito e disponibilidade semanal',
        'Autoconhecimento e maturidade emocional',
        'Motivação para atuar na Federação',
        'Defesa de ideias e adaptabilidade',
      ],
      xpMaximo: 200,
      janelaData: '03/11 a 16/11 (Agendamento individual)',
      formato: 'Síncrono Individual (30 a 45 min via Meet)',
      linkPadrao: 'https://calendly.com/riojunior-entrevistas',
      obrigatoria: true,
    },
  ],
  entregas: [
    {
      id: 'ent_imersao_pe',
      titulo: 'Programa de Imersão: Planejamento Estratégico da Rede (PE 25-27)',
      tipo: 'programa',
      guildaAlvo: 'TODAS',
      descricao:
        'Estudar a trilha introdutória sobre os pilares do PE da Rede Fluminense, a estrutura de Guildas da RioJunior e enviar a síntese dos 3 maiores aprendizados.',
      prazo: '2026-11-08',
      horarioLimite: '23:59',
      xpReward: 60,
      obrigatoria: true,
      linkTemplate: 'https://riojunior.com.br/trilha-pe-rede',
    },
    {
      id: 'ent_shadowing_frente',
      titulo: 'Shadowing de Frente: Bate-papo com Membro Atual da Guilda',
      tipo: 'rito',
      guildaAlvo: 'TODAS',
      descricao:
        'Realizar um benchmarking/bate-papo de 30 minutos com um membro atual da frente escolhida para entender rotinas, ferramentas e principais dores da área.',
      prazo: '2026-11-11',
      horarioLimite: '23:59',
      xpReward: 70,
      obrigatoria: true,
      linkTemplate: 'https://riojunior.com.br/roteiro-shadowing',
    },
    {
      id: 'ent_plano_30dias',
      titulo: 'Entrega do Processo Aditivo: Matriz de Primeiros 30 Dias na Frente',
      tipo: 'entrega',
      guildaAlvo: 'TODAS',
      descricao:
        'Estruturar um roadmap objetivo com as 3 prioridades que você executaria no seu primeiro mês dentro da Guilda pretendida.',
      prazo: '2026-11-14',
      horarioLimite: '23:59',
      xpReward: 100,
      obrigatoria: true,
      linkTemplate: 'https://riojunior.com.br/template-30-dias',
    },
    {
      id: 'ent_rito_observador',
      titulo: 'Vivência Aditiva: Participação como Ouvinte em RV da Guilda',
      tipo: 'rito',
      guildaAlvo: 'TODAS',
      descricao:
        'Participar de uma Reunião Semanal (RV) da Guilda pretendida como candidato observador e registrar suas percepções no formulário de acompanhamento.',
      prazo: '2026-11-17',
      horarioLimite: '20:00',
      xpReward: 70,
      obrigatoria: true,
      linkTemplate: 'https://riojunior.com.br/ata-observador',
    },
  ],
  badges: [
    {
      id: 'badge_passaporte',
      icone: '🏅',
      titulo: 'Passaporte Fluminense',
      descricao: 'Inscrição homologada e perfil de candidato 100% configurado no Portal RioJunior.',
      xpBonus: 25,
      criterioResumo: 'Homologação inicial no Processo Seletivo',
    },
    {
      id: 'badge_sinergia',
      icone: '🤝',
      titulo: 'Sinergia em Rede',
      descricao: 'Destaque em colaboração e construção conjunta durante o Desafio Coletivo.',
      xpBonus: 35,
      criterioResumo: 'Concluir o Desafio Coletivo',
    },
    {
      id: 'badge_estrategista',
      icone: '🧠',
      titulo: 'Estrategista de Guilda',
      descricao: 'Submeteu o Desafio Individual com foco analítico e proposta estruturada.',
      xpBonus: 40,
      criterioResumo: 'Entregar o Desafio Individual',
    },
    {
      id: 'badge_mestre_aditivo',
      icone: '🚀',
      titulo: 'Mestre do Processo Aditivo',
      descricao: 'Concluiu 100% dos programas e entregas obrigatórias do Processo Aditivo no prazo!',
      xpBonus: 50,
      criterioResumo: '100% das entregas do Processo Aditivo concluídas',
    },
  ],
  candidatos: [
    {
      id: 'cand_001',
      nome: 'Lucas Mendonça',
      email: 'lucas.mendonca@candidato.riojunior.com.br',
      codigoAcesso: 'RJ2026',
      telefone: '(21) 99812-3456',
      ejOrigem: 'Fluxo Consultoria',
      ies: 'UFRJ',
      regiao: 'Metropolitana',
      guildaAlvo: 'OP',
      frenteAlvo: 'Gestão de Processos',
      statusGeral: 'aditivo_ativo',
      dataInscricao: '2026-10-28',
      etapas: {
        etapa_coletivo: {
          etapaId: 'etapa_coletivo',
          status: 'concluido',
          nota: 9.5,
          xpGanho: 250,
          dataAgendada: '2026-11-02 14:00',
          feedbackPublico: 'Excelente facilitação do grupo, escuta ativa e visão sistêmica da rede.',
        },
        etapa_individual: {
          etapaId: 'etapa_individual',
          status: 'em_andamento',
          xpGanho: 150,
          dataAgendada: 'Prazo: 14/11 às 23:59',
          feedbackPublico: 'Case liberado! Submeta o link da apresentação até a data limite.',
        },
        etapa_entrevistas: {
          etapaId: 'etapa_entrevistas',
          status: 'concluido',
          nota: 9.2,
          xpGanho: 200,
          dataAgendada: '2026-11-01 18:30',
          feedbackPublico: 'Ótimo alinhamento cultural e clareza sobre os desafios de Operações.',
        },
      },
      entregas: {
        ent_imersao_pe: {
          entregaId: 'ent_imersao_pe',
          status: 'validado',
          dataSubmissao: '2026-11-03',
          linkEntrega: 'https://docs.google.com/document/d/sintese-lucas-pe27',
          comentarioCandidato: 'Síntese enviada com foco nos indicadores de OP e DDR.',
          feedbackAvaliador: 'Muito bem detalhado! Pontuação máxima.',
          xpConcedido: 60,
        },
        ent_shadowing_frente: {
          entregaId: 'ent_shadowing_frente',
          status: 'validado',
          dataSubmissao: '2026-11-04',
          linkEntrega: 'https://docs.google.com/document/d/shadowing-lucas-op',
          comentarioCandidato: 'Conversei com a frente de Processos sobre automação de ritos.',
          feedbackAvaliador: 'Ótimos insights levantados no bate-papo.',
          xpConcedido: 70,
        },
        ent_plano_30dias: {
          entregaId: 'ent_plano_30dias',
          status: 'em_andamento',
          xpConcedido: 0,
        },
        ent_rito_observador: {
          entregaId: 'ent_rito_observador',
          status: 'pendente',
          xpConcedido: 0,
        },
      },
      badgesDesbloqueadas: ['badge_passaporte', 'badge_sinergia'],
    },
    {
      id: 'cand_002',
      nome: 'Mariana Costa',
      email: 'mariana.costa@candidato.riojunior.com.br',
      codigoAcesso: 'RJ2026',
      telefone: '(21) 98765-4321',
      ejOrigem: 'Meta Consultoria',
      ies: 'UFF',
      regiao: 'Leste Fluminense',
      guildaAlvo: 'DDR',
      frenteAlvo: 'Aceleração',
      statusGeral: 'aditivo_ativo',
      dataInscricao: '2026-10-29',
      etapas: {
        etapa_coletivo: {
          etapaId: 'etapa_coletivo',
          status: 'agendado',
          xpGanho: 0,
          dataAgendada: '2026-11-08 10:00',
          feedbackPublico: 'Banca de sábado às 10h confirmada.',
        },
        etapa_individual: {
          etapaId: 'etapa_individual',
          status: 'concluido',
          nota: 9.8,
          xpGanho: 300,
          dataAgendada: 'Entregue em 03/11',
          linkSubmissaoCandidato: 'https://drive.google.com/case-mariana-ddr',
          feedbackPublico: 'Diagnóstico impecável sobre tração dos clusters 2 e 3!',
        },
        etapa_entrevistas: {
          etapaId: 'etapa_entrevistas',
          status: 'concluido',
          nota: 9.6,
          xpGanho: 200,
          dataAgendada: '2026-10-31 16:00',
          feedbackPublico: 'Realizou a entrevista antes dos desafios com alto nível de maturidade.',
        },
      },
      entregas: {
        ent_imersao_pe: {
          entregaId: 'ent_imersao_pe',
          status: 'validado',
          dataSubmissao: '2026-11-01',
          xpConcedido: 60,
        },
        ent_shadowing_frente: {
          entregaId: 'ent_shadowing_frente',
          status: 'validado',
          dataSubmissao: '2026-11-02',
          xpConcedido: 70,
        },
        ent_plano_30dias: {
          entregaId: 'ent_plano_30dias',
          status: 'validado',
          dataSubmissao: '2026-11-03',
          xpConcedido: 100,
        },
        ent_rito_observador: {
          entregaId: 'ent_rito_observador',
          status: 'entregue',
          dataSubmissao: '2026-11-04',
          xpConcedido: 70,
        },
      },
      badgesDesbloqueadas: ['badge_passaporte', 'badge_estrategista', 'badge_mestre_aditivo'],
    },
    {
      id: 'cand_003',
      nome: 'Pedro Henrique Alves',
      email: 'pedro.alves@candidato.riojunior.com.br',
      codigoAcesso: 'RJ2026',
      telefone: '(21) 97654-1122',
      ejOrigem: 'Empresa Jr PUC-Rio',
      ies: 'PUC-Rio',
      regiao: 'Centro Sul 1',
      guildaAlvo: 'VPNEG',
      frenteAlvo: 'Executivo de Vendas',
      statusGeral: 'em_processo',
      dataInscricao: '2026-10-30',
      etapas: {
        etapa_coletivo: {
          etapaId: 'etapa_coletivo',
          status: 'concluido',
          nota: 8.9,
          xpGanho: 230,
          dataAgendada: '2026-11-02 14:00',
          feedbackPublico: 'Boa postura comercial e argumentação clara.',
        },
        etapa_individual: {
          etapaId: 'etapa_individual',
          status: 'entregue',
          xpGanho: 250,
          dataAgendada: 'Entregue em 04/11',
          linkSubmissaoCandidato: 'https://drive.google.com/prospeccao-pedro',
        },
        etapa_entrevistas: {
          etapaId: 'etapa_entrevistas',
          status: 'agendado',
          xpGanho: 0,
          dataAgendada: '2026-11-07 17:00',
        },
      },
      entregas: {
        ent_imersao_pe: {
          entregaId: 'ent_imersao_pe',
          status: 'validado',
          dataSubmissao: '2026-11-02',
          xpConcedido: 60,
        },
        ent_shadowing_frente: {
          entregaId: 'ent_shadowing_frente',
          status: 'em_andamento',
          xpConcedido: 0,
        },
      },
      badgesDesbloqueadas: ['badge_passaporte', 'badge_sinergia', 'badge_estrategista'],
    },
  ],
};

class ProcessoSeletivoService {
  private listeners: Array<() => void> = [];

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rio-ps-updated'));
    }
  }

  public getState(): PSState {
    if (typeof window === 'undefined') return INITIAL_PS_STATE;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_PS, JSON.stringify(INITIAL_PS_STATE));
        return INITIAL_PS_STATE;
      }
      const parsed = JSON.parse(raw) as PSState;
      return {
        config: { ...INITIAL_PS_STATE.config, ...(parsed.config || {}) },
        etapas: Array.isArray(parsed.etapas) ? parsed.etapas : INITIAL_PS_STATE.etapas,
        entregas: Array.isArray(parsed.entregas) ? parsed.entregas : INITIAL_PS_STATE.entregas,
        badges: Array.isArray(parsed.badges) ? parsed.badges : INITIAL_PS_STATE.badges,
        candidatos: Array.isArray(parsed.candidatos) ? parsed.candidatos : INITIAL_PS_STATE.candidatos,
      };
    } catch {
      return INITIAL_PS_STATE;
    }
  }

  private saveState(state: PSState) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PS, JSON.stringify(state));
    }
    this.notify();
  }

  public resetToDefault(): PSState {
    this.saveState(INITIAL_PS_STATE);
    return INITIAL_PS_STATE;
  }

  // =========================================================================
  // 1. EDIÇÃO DA CONCEPÇÃO GERAL E NÍVEIS DE GAMIFICAÇÃO
  // =========================================================================
  public updateConfig(partial: Partial<PSConfig>): PSConfig {
    const state = this.getState();
    state.config = { ...state.config, ...partial };
    this.saveState(state);
    return state.config;
  }

  // =========================================================================
  // 2. CRUD COMPLETO DE ETAPAS MODULARES (NÃO-LINEARES)
  // =========================================================================
  public saveEtapa(etapa: PSEtapaModular): PSEtapaModular {
    const state = this.getState();
    const idx = state.etapas.findIndex((e) => e.id === etapa.id);
    if (idx >= 0) {
      state.etapas[idx] = etapa;
    } else {
      state.etapas.push(etapa);
    }
    this.saveState(state);
    return etapa;
  }

  public deleteEtapa(id: string) {
    const state = this.getState();
    state.etapas = state.etapas.filter((e) => e.id !== id);
    this.saveState(state);
  }

  // =========================================================================
  // 3. CRUD COMPLETO DE PROGRAMAS E ENTREGAS DO PROCESSO ADITIVO
  // =========================================================================
  public saveEntrega(entrega: PSEntregaAditivo): PSEntregaAditivo {
    const state = this.getState();
    const idx = state.entregas.findIndex((e) => e.id === entrega.id);
    if (idx >= 0) {
      state.entregas[idx] = entrega;
    } else {
      state.entregas.push(entrega);
    }
    this.saveState(state);
    return entrega;
  }

  public deleteEntrega(id: string) {
    const state = this.getState();
    state.entregas = state.entregas.filter((e) => e.id !== id);
    this.saveState(state);
  }

  // =========================================================================
  // 4. CRUD COMPLETO DE BADGES / CONQUISTAS GAMIFICADAS
  // =========================================================================
  public saveBadge(badge: PSBadge): PSBadge {
    const state = this.getState();
    const idx = state.badges.findIndex((b) => b.id === badge.id);
    if (idx >= 0) {
      state.badges[idx] = badge;
    } else {
      state.badges.push(badge);
    }
    this.saveState(state);
    return badge;
  }

  public deleteBadge(id: string) {
    const state = this.getState();
    state.badges = state.badges.filter((b) => b.id !== id);
    this.saveState(state);
  }

  // =========================================================================
  // 5. CRUD COMPLETO DE CANDIDATOS E PROGRESSO INDIVIDUAL
  // =========================================================================
  public saveCandidato(candidato: PSCandidato): PSCandidato {
    const state = this.getState();
    const idx = state.candidatos.findIndex((c) => c.id === candidato.id);
    if (idx >= 0) {
      state.candidatos[idx] = candidato;
    } else {
      state.candidatos.unshift(candidato);
    }
    this.saveState(state);
    return candidato;
  }

  public deleteCandidato(id: string) {
    const state = this.getState();
    state.candidatos = state.candidatos.filter((c) => c.id !== id);
    this.saveState(state);
  }

  public getCandidatoByEmail(email?: string | null): PSCandidato | undefined {
    const state = this.getState();
    if (!email) return state.candidatos[0];
    const clean = email.trim().toLowerCase();
    return state.candidatos.find((c) => c.email.toLowerCase() === clean);
  }

  public updateCandidatoEtapa(
    candidatoId: string,
    etapaId: string,
    avaliacao: Partial<AvaliacaoEtapaCandidato>
  ) {
    const state = this.getState();
    const cand = state.candidatos.find((c) => c.id === candidatoId);
    if (!cand) return;

    const existing = cand.etapas[etapaId] || {
      etapaId,
      status: 'disponivel',
      xpGanho: 0,
    };
    cand.etapas[etapaId] = {
      ...existing,
      ...avaliacao,
      etapaId,
    };
    this.saveState(state);
  }

  public updateCandidatoEntrega(
    candidatoId: string,
    entregaId: string,
    progresso: Partial<ProgressoEntregaCandidato>
  ) {
    const state = this.getState();
    const cand = state.candidatos.find((c) => c.id === candidatoId);
    if (!cand) return;

    const entregaDef = state.entregas.find((e) => e.id === entregaId);
    const existing = cand.entregas[entregaId] || {
      entregaId,
      status: 'pendente',
      xpConcedido: 0,
    };

    const nextStatus = progresso.status ?? existing.status;
    let nextXp = progresso.xpConcedido ?? existing.xpConcedido;
    if (
      (nextStatus === 'entregue' || nextStatus === 'validado') &&
      progresso.xpConcedido === undefined &&
      entregaDef
    ) {
      nextXp = entregaDef.xpReward;
    } else if (nextStatus === 'pendente' && progresso.xpConcedido === undefined) {
      nextXp = 0;
    }

    cand.entregas[entregaId] = {
      ...existing,
      ...progresso,
      entregaId,
      status: nextStatus,
      xpConcedido: nextXp,
    };

    // Verifica se desbloqueou automaticamente a badge de Mestre do Aditivo
    const entregasAplicaveis = state.entregas.filter(
      (e) => e.guildaAlvo === 'TODAS' || e.guildaAlvo === cand.guildaAlvo
    );
    const todasConcluidas =
      entregasAplicaveis.length > 0 &&
      entregasAplicaveis.every((e) => {
        const st = cand.entregas[e.id]?.status;
        return st === 'entregue' || st === 'validado';
      });
    if (todasConcluidas && !cand.badgesDesbloqueadas.includes('badge_mestre_aditivo')) {
      cand.badgesDesbloqueadas.push('badge_mestre_aditivo');
    }

    this.saveState(state);
  }

  public toggleCandidatoBadge(candidatoId: string, badgeId: string) {
    const state = this.getState();
    const cand = state.candidatos.find((c) => c.id === candidatoId);
    if (!cand) return;
    if (cand.badgesDesbloqueadas.includes(badgeId)) {
      cand.badgesDesbloqueadas = cand.badgesDesbloqueadas.filter((b) => b !== badgeId);
    } else {
      cand.badgesDesbloqueadas.push(badgeId);
    }
    this.saveState(state);
  }

  // =========================================================================
  // 6. CÁLCULO DE MÉTRICAS GAMIFICADAS DO CANDIDATO
  // =========================================================================
  public calculateStats(candidato: PSCandidato): CandidatoGamificationStats {
    const state = this.getState();
    const xpEtapas = state.etapas.reduce((acc, etapa) => {
      const av = candidato.etapas[etapa.id];
      return acc + (av?.xpGanho || 0);
    }, 0);

    const entregasAplicaveis = state.entregas.filter(
      (e) => e.guildaAlvo === 'TODAS' || e.guildaAlvo === candidato.guildaAlvo
    );

    const xpEntregas = entregasAplicaveis.reduce((acc, ent) => {
      const pr = candidato.entregas[ent.id];
      return acc + (pr?.xpConcedido || 0);
    }, 0);

    const xpBadges = state.badges.reduce((acc, b) => {
      if (candidato.badgesDesbloqueadas.includes(b.id)) {
        return acc + (b.xpBonus || 0);
      }
      return acc;
    }, 0);

    const totalXp = xpEtapas + xpEntregas + xpBadges;
    const metaXp = Math.max(100, state.config.metaXpTotal || 1000);
    const progressoPct = Math.min(100, Math.round((totalXp / metaXp) * 100));

    const sortedNiveis = [...state.config.niveis].sort((a, b) => a.xpMinimo - b.xpMinimo);
    let nivelAtual = sortedNiveis[0] || {
      nivel: 1,
      titulo: 'Candidato',
      xpMinimo: 0,
      cor: 'cyan',
    };
    let proximoNivel: NivelGamificacao | null = null;

    for (let i = 0; i < sortedNiveis.length; i++) {
      if (totalXp >= sortedNiveis[i].xpMinimo) {
        nivelAtual = sortedNiveis[i];
        proximoNivel = sortedNiveis[i + 1] || null;
      }
    }

    const etapasConcluidas = state.etapas.filter((e) => {
      const st = candidato.etapas[e.id]?.status;
      return st === 'concluido' || st === 'entregue';
    }).length;

    const entregasConcluidas = entregasAplicaveis.filter((e) => {
      const st = candidato.entregas[e.id]?.status;
      return st === 'entregue' || st === 'validado';
    }).length;

    return {
      xpEtapas,
      xpEntregas,
      xpBadges,
      totalXp,
      metaXp,
      progressoPct,
      nivelAtual,
      proximoNivel,
      etapasConcluidas,
      totalEtapas: state.etapas.length,
      entregasConcluidas,
      totalEntregasAplicaveis: entregasAplicaveis.length,
    };
  }
}

export const processoSeletivoService = new ProcessoSeletivoService();

