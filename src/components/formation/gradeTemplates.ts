/**
 * Modelos de Grade de Conteúdo de Referência da RioJunior
 * Baseados nos documentos oficiais da pasta "Modelo de Grade de conteúdo":
 * 1. RJ 74° (Reunião Geral e Encontro Estadual)
 * 2. CentralRio 2026 (Encontro Regional e Foco em Resultados)
 * 3. ONDE 2026 (Imersão de Liderança, Alta Performance e Governança)
 */

export interface TemplateMomento {
  horario: string;
  tipo: string;
  titulo: string;
  tematicaMacro: string;
  ministranteTipo?: string;
  ministranteNome?: string;
  parceiroNome?: string;
  csat?: number;
}

export interface GradeTemplate {
  id: string;
  nome: string;
  eventoReferencia: string;
  tipoEvento: string;
  descricao: string;
  icone: string;
  totalMomentos: number;
  horasEstimadas: string;
  qtdMagnas: number;
  qtdParalelas: number;
  tags: string[];
  isCustom?: boolean;
  momentos: TemplateMomento[];
}

export const DEFAULT_GRADE_TEMPLATES: GradeTemplate[] = [
  {
    id: 'template_rj74',
    nome: 'Modelo Encontro RJ (Base: RJ 74°)',
    eventoReferencia: 'Grade RJ 74° 2026',
    tipoEvento: 'Reunião Geral & Encontro Estadual',
    descricao:
      'Estrutura clássica de Encontro Estadual da RioJunior: Credenciamento, 3 Pautas Magnas, 2 rodadas de Paralelas simultâneas (GEP, MKT, FU/FP, Finanças, Projetos), falas institucionais (SESC/Sebrae), ativações, reconhecimento e after.',
    icone: 'Users',
    totalMomentos: 20,
    horasEstimadas: '9h de programação',
    qtdMagnas: 3,
    qtdParalelas: 6,
    tags: ['Reunião Geral', '3 Magnas', '2 Rodadas de Paralelas', 'Ativações', 'Reconhecimento'],
    momentos: [
      {
        horario: '09:00 às 09:40',
        tipo: 'credenciamento',
        titulo: 'Credenciamento / Mural / Roda de conversa',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Diretoria da RioJunior',
      },
      {
        horario: '09:45 às 10:25',
        tipo: 'magna',
        titulo: 'MAGNA: Lideranças que querem, sabem e fazem',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Liderança Ambev',
        parceiroNome: 'Ambev',
      },
      {
        horario: '10:30 às 10:40',
        tipo: 'abertura',
        titulo: 'Fala institucional do SESC',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'parceiro_presex',
        ministranteNome: 'Representante SESC',
        parceiroNome: 'SESC',
      },
      {
        horario: '10:45 às 10:55',
        tipo: 'outro',
        titulo: 'Código de Ética: Nosso Código, nossa cultura',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Deb',
      },
      {
        horario: '10:55 às 11:35',
        tipo: 'magna',
        titulo: 'MAGNA: Carreira e Construção de Legado',
        tematicaMacro: 'Gestão de Pessoas',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Liderança Ambev',
        parceiroNome: 'Ambev',
      },
      {
        horario: '11:40 às 11:55',
        tipo: 'outro',
        titulo: 'Fala institucional - Sebrae',
        tematicaMacro: 'Inovação & IA',
        ministranteTipo: 'parceiro_presex',
        ministranteNome: 'Representante Sebrae',
        parceiroNome: 'Sebrae',
      },
      {
        horario: '11:55 às 12:55',
        tipo: 'almoco_intervalo',
        titulo: 'Almoço da Rede',
        tematicaMacro: 'Outra',
      },
      {
        horario: '13:00 às 13:15',
        tipo: 'outro',
        titulo: 'Ativação: Monster Energy',
        tematicaMacro: 'Marketing',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Equipe EFEJ e Time',
        parceiroNome: 'Monster',
      },
      {
        horario: '13:15 às 13:30',
        tipo: 'outro',
        titulo: 'Ativação: EFEJ 2026',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Equipe EFEJ',
      },
      {
        horario: '13:30 às 14:20',
        tipo: 'paralela',
        titulo: 'GEP & PRES: Cultura viva, como fazer o time ter o DNA da empresa?',
        tematicaMacro: 'Gestão de Pessoas',
        ministranteTipo: 'pos_junior',
        ministranteNome: 'Pedro Vitali',
      },
      {
        horario: '13:30 às 14:20',
        tipo: 'paralela',
        titulo: 'MKT & COM: Como transformar seu time em um motor de vendas?',
        tematicaMacro: 'Vendas',
        ministranteTipo: 'interno',
        ministranteNome: 'Matheus',
      },
      {
        horario: '13:30 às 14:20',
        tipo: 'paralela',
        titulo: 'FU/FP: Escalabilidade e Inovação',
        tematicaMacro: 'Operações & Processos',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Pedro e Raul',
        parceiroNome: 'QI Tech',
      },
      {
        horario: '14:20 às 15:10',
        tipo: 'magna',
        titulo: 'MAGNA: Como nasce um líder?',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'interno',
        ministranteNome: 'Ju',
      },
      {
        horario: '15:15 às 16:00',
        tipo: 'paralela',
        titulo: 'Comunicação: Uma ponte entre pessoas',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Eli',
      },
      {
        horario: '15:15 às 16:00',
        tipo: 'paralela',
        titulo: 'ADM FIN: Finanças 360° - Estratégias para garantir a saúde do caixa hoje e amanhã',
        tematicaMacro: 'Financeiro',
        ministranteTipo: 'interno',
        ministranteNome: 'Ana Elisa',
      },
      {
        horario: '15:15 às 16:00',
        tipo: 'paralela',
        titulo: 'PROJETOS: Performance Sustentável - Como identificar gargalos e acelerar projetos',
        tematicaMacro: 'Operações & Processos',
        ministranteTipo: 'interno',
        ministranteNome: 'Bia',
      },
      {
        horario: '16:05 às 16:25',
        tipo: 'almoco_intervalo',
        titulo: 'Coffee Break da Rede',
        tematicaMacro: 'Outra',
      },
      {
        horario: '16:30 às 17:20',
        tipo: 'outro',
        titulo: 'Momento de Reconhecimento da Rede',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Rian e Ana',
      },
      {
        horario: '17:30 às 17:45',
        tipo: 'encerramento',
        titulo: 'Pauta de Encerramento Oficial',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Coordenadores',
      },
      {
        horario: '18:00 às 20:00',
        tipo: 'happy_hour',
        titulo: 'After / Confraternização da Rede',
        tematicaMacro: 'Outra',
        parceiroNome: 'Buxixo',
      },
    ],
  },
  {
    id: 'template_centralrio',
    nome: 'Modelo CentralRio (Base: CentralRio 2026)',
    eventoReferencia: 'Grade CentralRio 2026',
    tipoEvento: 'Encontro Regional & Batalha de Resultados',
    descricao:
      'Formato dinâmico e focado em metas para pólos regionais: Credenciamento, 3 Pautas Magnas, Fast Consulting BJ, Batalha de Cases, Sala aberta de Benchmarking, Ativações ENEJ/EFEJ e Palco de Premiação.',
    icone: 'Flame',
    totalMomentos: 20,
    horasEstimadas: '11h de programação',
    qtdMagnas: 3,
    qtdParalelas: 7,
    tags: ['Regional', 'Fast Consulting BJ', 'Batalha de Cases', 'Benchmarking', 'Palco Premiação'],
    momentos: [
      {
        horario: '08:00 às 09:00',
        tipo: 'credenciamento',
        titulo: 'Credenciamento da Rede CentralRio',
        tematicaMacro: 'Outra',
      },
      {
        horario: '09:00 às 09:35',
        tipo: 'abertura',
        titulo: 'Abertura Oficial: "O Legado de Sonhar e Agir" (Homenagem Marcus Vinicius Barão)',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'MCs + Diretoria RioJunior',
      },
      {
        horario: '09:35 às 09:45',
        tipo: 'outro',
        titulo: 'Código de Ética: "Nosso Código, nossa cultura"',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Deb',
      },
      {
        horario: '09:45 às 10:20',
        tipo: 'magna',
        titulo: 'MAGNA: O sonho grande e a cultura de resultados inegociáveis',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Liderança Ambev',
        parceiroNome: 'Ambev',
      },
      {
        horario: '10:20 às 10:55',
        tipo: 'magna',
        titulo: 'MAGNA: Como o ecossistema enxerga quem ousa inovar e assumir riscos',
        tematicaMacro: 'Inovação & IA',
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: '1ª Rodada: Comercial - Ousadia em Vendas e Prospecção Ativa',
        tematicaMacro: 'Vendas',
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: '1ª Rodada: Projetos de Alto Impacto na Sociedade',
        tematicaMacro: 'Operações & Processos',
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: '1ª Rodada: Marketing de Atração e Posicionamento de Marca',
        tematicaMacro: 'Marketing',
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: 'Fast Consulting: Projeto de Impacto com Brasil Júnior',
        tematicaMacro: 'Estratégia & Liderança',
        parceiroNome: 'Brasil Júnior',
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'outro',
        titulo: 'Sala aberta de Benchmarking entre Empresas Juniores',
        tematicaMacro: 'Cultura',
      },
      {
        horario: '11:50 às 13:20',
        tipo: 'almoco_intervalo',
        titulo: 'Almoço & Conexões',
        tematicaMacro: 'Outra',
      },
      {
        horario: '13:20 às 13:35',
        tipo: 'outro',
        titulo: 'Ativação: Monster Energy',
        tematicaMacro: 'Marketing',
        parceiroNome: 'Monster',
      },
      {
        horario: '13:35 às 13:45',
        tipo: 'outro',
        titulo: 'Ativação: ENEJ 2026',
        tematicaMacro: 'Cultura',
      },
      {
        horario: '13:45 às 14:20',
        tipo: 'magna',
        titulo: 'MAGNA: Brasil Júnior - Como liderar em momentos de picos de erro',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'parceiro_vpneg',
        parceiroNome: 'Brasil Júnior',
      },
      {
        horario: '14:20 às 14:30',
        tipo: 'outro',
        titulo: 'Momento Comunica RioJunior',
        tematicaMacro: 'Marketing',
        ministranteTipo: 'interno',
        ministranteNome: 'Dri',
      },
      {
        horario: '14:30 às 15:20',
        tipo: 'paralela',
        titulo: '2ª Rodada: A ousadia da execução - Pauta tática para alavancar faturamento',
        tematicaMacro: 'Vendas',
      },
      {
        horario: '14:30 às 15:20',
        tipo: 'paralela',
        titulo: '2ª Rodada: Gestão de Pessoas - Manutenção da base, engajamento e cultura de dono',
        tematicaMacro: 'Gestão de Pessoas',
      },
      {
        horario: '14:30 às 15:20',
        tipo: 'paralela',
        titulo: '2ª Rodada: Liderança & Presidência - Condução do Planejamento Estratégico',
        tematicaMacro: 'Estratégia & Liderança',
      },
      {
        horario: '15:20 às 15:35',
        tipo: 'outro',
        titulo: 'Ativação: EFEJ 2026',
        tematicaMacro: 'Cultura',
      },
      {
        horario: '16:10 às 16:50',
        tipo: 'outro',
        titulo: 'Batalha de Cases de Sucesso RioJunior',
        tematicaMacro: 'Vendas',
      },
      {
        horario: '17:00 às 17:30',
        tipo: 'almoco_intervalo',
        titulo: 'Exquenta pré-palco + Coffee Break',
        tematicaMacro: 'Outra',
      },
      {
        horario: '17:40 às 18:50',
        tipo: 'outro',
        titulo: 'PALCO RIOJUNIOR: Reconhecimento e Premiação das EJs',
        tematicaMacro: 'Cultura',
        ministranteNome: 'Diretoria RioJunior',
      },
      {
        horario: '18:50 às 19:00',
        tipo: 'encerramento',
        titulo: 'Pauta de Encerramento Oficial',
        tematicaMacro: 'Cultura',
        ministranteNome: 'Coordenadores',
      },
    ],
  },
  {
    id: 'template_onde',
    nome: 'Modelo Imersão ONDE (Base: ONDE 2026)',
    eventoReferencia: 'Grade ONDE 2026',
    tipoEvento: 'Imersão Estratégica, Liderança & Alta Performance',
    descricao:
      'Estrutura aprofundada de imersão: Credenciamento estendido, Magna Máquina de Vendas, Coworking + Sala COEJ, Sessões Guardiãs, Desafio Produtivo (CA/CM), 2 rodadas de batalhas de cases e palco de expansão.',
    icone: 'Target',
    totalMomentos: 20,
    horasEstimadas: '10h de programação',
    qtdMagnas: 2,
    qtdParalelas: 8,
    tags: ['Imersão', 'Máquina de Vendas', 'Coworking COEJ', 'Sessões Guardiãs', 'Cases GG'],
    momentos: [
      {
        horario: '08:30 às 09:40',
        tipo: 'credenciamento',
        titulo: 'Credenciamento e Check-in com Dinâmica de Acolhimento',
        tematicaMacro: 'Outra',
      },
      {
        horario: '09:40 às 10:10',
        tipo: 'abertura',
        titulo: 'Abertura Oficial: ONDE - O orgulho de ser movimento',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'DR + Coordenadores',
      },
      {
        horario: '10:15 às 10:25',
        tipo: 'outro',
        titulo: 'Código de Ética: O Código que nos sustenta',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Deb',
      },
      {
        horario: '10:30 às 11:15',
        tipo: 'magna',
        titulo: 'MAGNA: Como ser uma máquina de vendas e conversão',
        tematicaMacro: 'Vendas',
        ministranteTipo: 'convidado_externo',
        ministranteNome: 'Bernardo Salgado',
      },
      {
        horario: '10:30 às 12:25',
        tipo: 'outro',
        titulo: 'Coworking + Espaço Estratégico COEJ (Sala A211)',
        tematicaMacro: 'Operações & Processos',
      },
      {
        horario: '11:15 às 12:05',
        tipo: 'paralela',
        titulo: 'Paralela FU+FP: Você está inovando... ou repetindo o passado?',
        tematicaMacro: 'Inovação & IA',
      },
      {
        horario: '11:15 às 12:05',
        tipo: 'paralela',
        titulo: 'Paralela Processos: ONDE os processos comerciais se multiplicam',
        tematicaMacro: 'Vendas',
      },
      {
        horario: '11:15 às 12:05',
        tipo: 'paralela',
        titulo: 'Sessão Guardiã: Vendas, Projetos e Gestão & Gente',
        tematicaMacro: 'Gestão de Pessoas',
        ministranteTipo: 'interno',
        ministranteNome: 'Guardiões RioJunior',
      },
      {
        horario: '11:15 às 12:05',
        tipo: 'paralela',
        titulo: 'Paralela Finanças: ONDE as Finanças e Governança Decidem Resultados',
        tematicaMacro: 'Financeiro',
      },
      {
        horario: '12:05 às 13:30',
        tipo: 'almoco_intervalo',
        titulo: 'Almoço da Rede + Sala de Benchmarking Livre',
        tematicaMacro: 'Outra',
      },
      {
        horario: '13:30 às 13:40',
        tipo: 'outro',
        titulo: 'Momento Comunica RioJunior',
        tematicaMacro: 'Marketing',
        ministranteTipo: 'interno',
        ministranteNome: 'Dri',
      },
      {
        horario: '13:40 às 13:55',
        tipo: 'outro',
        titulo: 'Apresentação CA + CM: O Desafio Produtivo',
        tematicaMacro: 'Operações & Processos',
        ministranteTipo: 'interno',
        ministranteNome: 'Miguel / DP',
      },
      {
        horario: '13:55 às 14:10',
        tipo: 'outro',
        titulo: 'Ativação: EFEJ 2026',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Duda Thomé',
      },
      {
        horario: '14:30 às 15:40',
        tipo: 'magna',
        titulo: 'MAGNA: Onde o orgulho de ser rede nos move para o topo',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'interno',
        ministranteNome: 'Coordenadores',
      },
      {
        horario: '15:50 às 16:40',
        tipo: 'paralela',
        titulo: 'Batalha de Cases GG: Como criar conexões que geram conversão em vendas',
        tematicaMacro: 'Vendas',
      },
      {
        horario: '15:50 às 16:40',
        tipo: 'paralela',
        titulo: 'Produtividade Comercial: Retenção e vendas na mesa de negociação',
        tematicaMacro: 'Vendas',
      },
      {
        horario: '15:50 às 16:40',
        tipo: 'paralela',
        titulo: 'Crescimento e Desejo: Como criar Cases que geram Expansão e Impacto',
        tematicaMacro: 'Marketing',
      },
      {
        horario: '15:50 às 16:40',
        tipo: 'paralela',
        titulo: 'Ideias que viram impacto: Transformando planos em projetos reais',
        tematicaMacro: 'Operações & Processos',
      },
      {
        horario: '16:50 às 17:35',
        tipo: 'outro',
        titulo: 'Palco ONDE: Reconhecimento e Celebração',
        tematicaMacro: 'Cultura',
      },
      {
        horario: '17:40 às 18:10',
        tipo: 'almoco_intervalo',
        titulo: 'Exquenta pré-palco + Coffee Break',
        tematicaMacro: 'Outra',
      },
      {
        horario: '18:10 às 18:30',
        tipo: 'encerramento',
        titulo: 'Pauta de Encerramento Oficial',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Ana Clara e Raul / Coordenadores',
      },
    ],
  },
];

const CUSTOM_TEMPLATES_STORAGE_KEY = 'riojunior_custom_grade_templates_v2';

export function getGradeTemplates(): GradeTemplate[] {
  try {
    const saved = localStorage.getItem(CUSTOM_TEMPLATES_STORAGE_KEY);
    if (saved) {
      const custom: GradeTemplate[] = JSON.parse(saved);
      return [...DEFAULT_GRADE_TEMPLATES, ...custom];
    }
  } catch (e) {
    console.warn('Erro ao carregar templates customizados do localStorage:', e);
  }
  return DEFAULT_GRADE_TEMPLATES;
}

export function saveCustomGradeTemplate(template: GradeTemplate): void {
  try {
    const existing = getGradeTemplates().filter(t => t.isCustom);
    const updated = [...existing.filter(t => t.id !== template.id), { ...template, isCustom: true }];
    localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Erro ao salvar template customizado:', e);
  }
}

export function deleteCustomGradeTemplate(templateId: string): void {
  try {
    const existing = getGradeTemplates().filter(t => t.isCustom);
    const filtered = existing.filter(t => t.id !== templateId);
    localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Erro ao excluir template customizado:', e);
  }
}
