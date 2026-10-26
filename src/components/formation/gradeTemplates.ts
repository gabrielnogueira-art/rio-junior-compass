/**
 * Modelos de Grade de Conteúdo Oficiais da RioJunior
 * Ordem cronológica oficial:
 * 1. RJ 74° (Reunião Geral & Encontro Estadual)
 * 2. ONDE (Imersão de Liderança, Alta Performance e Governança)
 * 3. CentralRio (Encontro Regional & Batalha de Resultados)
 * 4. EFEJ (Encontro Fluminense de Empresas Juniores - 3 Dias Completos)
 */

export interface TemplateMomento {
  id?: string;
  horario: string;
  tipo: string;
  titulo: string;
  tematicaMacro: string;
  ministranteTipo?: string;
  ministranteNome?: string;
  parceiroNome?: string;
  csat?: number;
  diaOffset?: number; // 0 = Dia 1, 1 = Dia 2, 2 = Dia 3
}

export interface GradeTemplate {
  id: string;
  nome: string;
  eventoReferencia: string;
  tipoEvento: string;
  descricao: string;
  icone: string;
  diasCount: number; // 1 para eventos de 1 dia, 3 para EFEJ
  totalMomentos: number;
  horasEstimadas: string;
  qtdMagnas: number;
  qtdParalelas: number;
  tags: string[];
  isCustom?: boolean;
  momentos: TemplateMomento[];
}

export const DEFAULT_GRADE_TEMPLATES: GradeTemplate[] = [
  // 1. RJ 74°
  {
    id: 'template_rj74',
    nome: 'Modelo Encontro RJ (Base: RJ 74°)',
    eventoReferencia: 'Grade RJ 74° 2026',
    tipoEvento: 'Reunião Geral & Encontro Estadual',
    descricao:
      'Estrutura clássica de Encontro Estadual da RioJunior: Credenciamento, 3 Pautas Magnas, 2 rodadas de Paralelas simultâneas (GEP, MKT, FU/FP, Finanças, Projetos), falas institucionais (SESC/Sebrae), ativações, reconhecimento e after.',
    icone: 'Users',
    diasCount: 1,
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
        diaOffset: 0,
      },
      {
        horario: '09:45 às 10:25',
        tipo: 'magna',
        titulo: 'MAGNA: Lideranças que querem, sabem e fazem',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Liderança Ambev',
        parceiroNome: 'Ambev',
        diaOffset: 0,
      },
      {
        horario: '10:30 às 10:40',
        tipo: 'abertura',
        titulo: 'Fala institucional do SESC',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'parceiro_presex',
        ministranteNome: 'Representante SESC',
        parceiroNome: 'SESC',
        diaOffset: 0,
      },
      {
        horario: '10:45 às 10:55',
        tipo: 'outro',
        titulo: 'Código de Ética: Nosso Código, nossa cultura',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Deb',
        diaOffset: 0,
      },
      {
        horario: '10:55 às 11:35',
        tipo: 'magna',
        titulo: 'MAGNA: Carreira e Construção de Legado',
        tematicaMacro: 'Gestão de Pessoas',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Liderança Ambev',
        parceiroNome: 'Ambev',
        diaOffset: 0,
      },
      {
        horario: '11:40 às 11:55',
        tipo: 'outro',
        titulo: 'Fala institucional - Sebrae',
        tematicaMacro: 'Inovação & IA',
        ministranteTipo: 'parceiro_presex',
        ministranteNome: 'Representante Sebrae',
        parceiroNome: 'Sebrae',
        diaOffset: 0,
      },
      {
        horario: '11:55 às 12:55',
        tipo: 'almoco_intervalo',
        titulo: 'Almoço da Rede',
        tematicaMacro: 'Outra',
        diaOffset: 0,
      },
      {
        horario: '13:00 às 13:15',
        tipo: 'outro',
        titulo: 'Ativação: Monster Energy',
        tematicaMacro: 'Marketing',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Equipe EFEJ e Time',
        parceiroNome: 'Monster',
        diaOffset: 0,
      },
      {
        horario: '13:15 às 13:30',
        tipo: 'outro',
        titulo: 'Ativação: EFEJ 2026',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Equipe EFEJ',
        diaOffset: 0,
      },
      {
        horario: '13:30 às 14:20',
        tipo: 'paralela',
        titulo: 'GEP & PRES: Cultura viva, como fazer o time ter o DNA da empresa?',
        tematicaMacro: 'Gestão de Pessoas',
        ministranteTipo: 'pos_junior',
        ministranteNome: 'Pedro Vitali',
        diaOffset: 0,
      },
      {
        horario: '13:30 às 14:20',
        tipo: 'paralela',
        titulo: 'MKT & COM: Como transformar seu time em um motor de vendas?',
        tematicaMacro: 'Vendas',
        ministranteTipo: 'interno',
        ministranteNome: 'Matheus',
        diaOffset: 0,
      },
      {
        horario: '13:30 às 14:20',
        tipo: 'paralela',
        titulo: 'FU/FP: Escalabilidade e Inovação',
        tematicaMacro: 'Operações & Processos',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Pedro e Raul',
        parceiroNome: 'QI Tech',
        diaOffset: 0,
      },
      {
        horario: '14:20 às 15:10',
        tipo: 'magna',
        titulo: 'MAGNA: Como nasce um líder?',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'interno',
        ministranteNome: 'Ju',
        diaOffset: 0,
      },
      {
        horario: '15:15 às 16:00',
        tipo: 'paralela',
        titulo: 'Comunicação: Uma ponte entre pessoas',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Eli',
        diaOffset: 0,
      },
      {
        horario: '15:15 às 16:00',
        tipo: 'paralela',
        titulo: 'ADM FIN: Finanças 360° - Estratégias para garantir a saúde do caixa hoje e amanhã',
        tematicaMacro: 'Financeiro',
        ministranteTipo: 'interno',
        ministranteNome: 'Ana Elisa',
        diaOffset: 0,
      },
      {
        horario: '15:15 às 16:00',
        tipo: 'paralela',
        titulo: 'PROJETOS: Performance Sustentável - Como identificar gargalos e acelerar projetos',
        tematicaMacro: 'Operações & Processos',
        ministranteTipo: 'interno',
        ministranteNome: 'Bia',
        diaOffset: 0,
      },
      {
        horario: '16:05 às 16:25',
        tipo: 'almoco_intervalo',
        titulo: 'Coffee Break da Rede',
        tematicaMacro: 'Outra',
        diaOffset: 0,
      },
      {
        horario: '16:30 às 17:20',
        tipo: 'outro',
        titulo: 'Momento de Reconhecimento da Rede',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Rian e Ana',
        diaOffset: 0,
      },
      {
        horario: '17:30 às 17:45',
        tipo: 'encerramento',
        titulo: 'Pauta de Encerramento Oficial',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Coordenadores',
        diaOffset: 0,
      },
      {
        horario: '18:00 às 20:00',
        tipo: 'happy_hour',
        titulo: 'After / Confraternização da Rede',
        tematicaMacro: 'Outra',
        parceiroNome: 'Buxixo',
        diaOffset: 0,
      },
    ],
  },

  // 2. ONDE 2026
  {
    id: 'template_onde',
    nome: 'Modelo Imersão ONDE (Base: ONDE 2026)',
    eventoReferencia: 'Grade ONDE 2026',
    tipoEvento: 'Imersão Estratégica, Liderança & Alta Performance',
    descricao:
      'Estrutura aprofundada de imersão: Credenciamento estendido, Magna Máquina de Vendas, Coworking + Sala COEJ, Sessões Guardiãs, Desafio Produtivo (CA/CM), 2 rodadas de batalhas de cases e palco de expansão.',
    icone: 'Target',
    diasCount: 1,
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
        diaOffset: 0,
      },
      {
        horario: '09:40 às 10:10',
        tipo: 'abertura',
        titulo: 'Abertura Oficial: ONDE - O orgulho de ser movimento',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'DR + Coordenadores',
        diaOffset: 0,
      },
      {
        horario: '10:15 às 10:25',
        tipo: 'outro',
        titulo: 'Código de Ética: O Código que nos sustenta',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Deb',
        diaOffset: 0,
      },
      {
        horario: '10:30 às 11:15',
        tipo: 'magna',
        titulo: 'MAGNA: Como ser uma máquina de vendas e conversão',
        tematicaMacro: 'Vendas',
        ministranteTipo: 'convidado_externo',
        ministranteNome: 'Bernardo Salgado',
        diaOffset: 0,
      },
      {
        horario: '10:30 às 12:25',
        tipo: 'outro',
        titulo: 'Coworking + Espaço Estratégico COEJ (Sala A211)',
        tematicaMacro: 'Operações & Processos',
        diaOffset: 0,
      },
      {
        horario: '11:15 às 12:05',
        tipo: 'paralela',
        titulo: 'Paralela FU+FP: Você está inovando... ou repetindo o passado?',
        tematicaMacro: 'Inovação & IA',
        diaOffset: 0,
      },
      {
        horario: '11:15 às 12:05',
        tipo: 'paralela',
        titulo: 'Paralela Processos: ONDE os processos comerciais se multiplicam',
        tematicaMacro: 'Vendas',
        diaOffset: 0,
      },
      {
        horario: '11:15 às 12:05',
        tipo: 'paralela',
        titulo: 'Sessão Guardiã: Vendas, Projetos e Gestão & Gente',
        tematicaMacro: 'Gestão de Pessoas',
        ministranteTipo: 'interno',
        ministranteNome: 'Guardiões RioJunior',
        diaOffset: 0,
      },
      {
        horario: '11:15 às 12:05',
        tipo: 'paralela',
        titulo: 'Paralela Finanças: ONDE as Finanças e Governança Decidem Resultados',
        tematicaMacro: 'Financeiro',
        diaOffset: 0,
      },
      {
        horario: '12:05 às 13:30',
        tipo: 'almoco_intervalo',
        titulo: 'Almoço da Rede + Sala de Benchmarking Livre',
        tematicaMacro: 'Outra',
        diaOffset: 0,
      },
      {
        horario: '13:30 às 13:40',
        tipo: 'outro',
        titulo: 'Momento Comunica RioJunior',
        tematicaMacro: 'Marketing',
        ministranteTipo: 'interno',
        ministranteNome: 'Dri',
        diaOffset: 0,
      },
      {
        horario: '13:40 às 13:55',
        tipo: 'outro',
        titulo: 'Apresentação CA + CM: O Desafio Produtivo',
        tematicaMacro: 'Operações & Processos',
        ministranteTipo: 'interno',
        ministranteNome: 'Miguel / DP',
        diaOffset: 0,
      },
      {
        horario: '13:55 às 14:10',
        tipo: 'outro',
        titulo: 'Ativação: EFEJ 2026',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Duda Thomé',
        diaOffset: 0,
      },
      {
        horario: '14:30 às 15:40',
        tipo: 'magna',
        titulo: 'MAGNA: Onde o orgulho de ser rede nos move para o topo',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'interno',
        ministranteNome: 'Coordenadores',
        diaOffset: 0,
      },
      {
        horario: '15:50 às 16:40',
        tipo: 'paralela',
        titulo: 'Batalha de Cases GG: Como criar conexões que geram conversão em vendas',
        tematicaMacro: 'Vendas',
        diaOffset: 0,
      },
      {
        horario: '15:50 às 16:40',
        tipo: 'paralela',
        titulo: 'Produtividade Comercial: Retenção e vendas na mesa de negociação',
        tematicaMacro: 'Vendas',
        diaOffset: 0,
      },
      {
        horario: '15:50 às 16:40',
        tipo: 'paralela',
        titulo: 'Crescimento e Desejo: Como criar Cases que geram Expansão e Impacto',
        tematicaMacro: 'Marketing',
        diaOffset: 0,
      },
      {
        horario: '15:50 às 16:40',
        tipo: 'paralela',
        titulo: 'Ideias que viram impacto: Transformando planos em projetos reais',
        tematicaMacro: 'Operações & Processos',
        diaOffset: 0,
      },
      {
        horario: '16:50 às 17:35',
        tipo: 'outro',
        titulo: 'Palco ONDE: Reconhecimento e Celebração',
        tematicaMacro: 'Cultura',
        diaOffset: 0,
      },
      {
        horario: '17:40 às 18:10',
        tipo: 'almoco_intervalo',
        titulo: 'Exquenta pré-palco + Coffee Break',
        tematicaMacro: 'Outra',
        diaOffset: 0,
      },
      {
        horario: '18:10 às 18:30',
        tipo: 'encerramento',
        titulo: 'Pauta de Encerramento Oficial',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Ana Clara e Raul / Coordenadores',
        diaOffset: 0,
      },
    ],
  },

  // 3. CentralRio 2026
  {
    id: 'template_centralrio',
    nome: 'Modelo CentralRio (Base: CentralRio 2026)',
    eventoReferencia: 'Grade CentralRio 2026',
    tipoEvento: 'Encontro Regional & Batalha de Resultados',
    descricao:
      'Formato dinâmico e focado em metas para pólos regionais: Credenciamento, 3 Pautas Magnas, Fast Consulting BJ, Batalha de Cases, Sala aberta de Benchmarking, Ativações ENEJ/EFEJ e Palco de Premiação.',
    icone: 'Flame',
    diasCount: 1,
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
        diaOffset: 0,
      },
      {
        horario: '09:00 às 09:35',
        tipo: 'abertura',
        titulo: 'Abertura Oficial: "O Legado de Sonhar e Agir" (Homenagem Marcus Vinicius Barão)',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'MCs + Diretoria RioJunior',
        diaOffset: 0,
      },
      {
        horario: '09:35 às 09:45',
        tipo: 'outro',
        titulo: 'Código de Ética: "Nosso Código, nossa cultura"',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Deb',
        diaOffset: 0,
      },
      {
        horario: '09:45 às 10:20',
        tipo: 'magna',
        titulo: 'MAGNA: O sonho grande e a cultura de resultados inegociáveis',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Liderança Ambev',
        parceiroNome: 'Ambev',
        diaOffset: 0,
      },
      {
        horario: '10:20 às 10:55',
        tipo: 'magna',
        titulo: 'MAGNA: Como o ecossistema enxerga quem ousa inovar e assumir riscos',
        tematicaMacro: 'Inovação & IA',
        diaOffset: 0,
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: '1ª Rodada: Comercial - Ousadia em Vendas e Prospecção Ativa',
        tematicaMacro: 'Vendas',
        diaOffset: 0,
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: '1ª Rodada: Projetos de Alto Impacto na Sociedade',
        tematicaMacro: 'Operações & Processos',
        diaOffset: 0,
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: '1ª Rodada: Marketing de Atração e Posicionamento de Marca',
        tematicaMacro: 'Marketing',
        diaOffset: 0,
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: 'Fast Consulting: Projeto de Impacto com Brasil Júnior',
        tematicaMacro: 'Estratégia & Liderança',
        parceiroNome: 'Brasil Júnior',
        diaOffset: 0,
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'outro',
        titulo: 'Sala aberta de Benchmarking entre Empresas Juniores',
        tematicaMacro: 'Cultura',
        diaOffset: 0,
      },
      {
        horario: '11:50 às 13:20',
        tipo: 'almoco_intervalo',
        titulo: 'Almoço & Conexões',
        tematicaMacro: 'Outra',
        diaOffset: 0,
      },
      {
        horario: '13:20 às 13:35',
        tipo: 'outro',
        titulo: 'Ativação: Monster Energy',
        tematicaMacro: 'Marketing',
        parceiroNome: 'Monster',
        diaOffset: 0,
      },
      {
        horario: '13:35 às 13:45',
        tipo: 'outro',
        titulo: 'Ativação: ENEJ 2026',
        tematicaMacro: 'Cultura',
        diaOffset: 0,
      },
      {
        horario: '13:45 às 14:20',
        tipo: 'magna',
        titulo: 'MAGNA: Brasil Júnior - Como liderar em momentos de picos de erro',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'parceiro_vpneg',
        parceiroNome: 'Brasil Júnior',
        diaOffset: 0,
      },
      {
        horario: '14:20 às 14:30',
        tipo: 'outro',
        titulo: 'Momento Comunica RioJunior',
        tematicaMacro: 'Marketing',
        ministranteTipo: 'interno',
        ministranteNome: 'Dri',
        diaOffset: 0,
      },
      {
        horario: '14:30 às 15:20',
        tipo: 'paralela',
        titulo: '2ª Rodada: A ousadia da execução - Pauta tática para alavancar faturamento',
        tematicaMacro: 'Vendas',
        diaOffset: 0,
      },
      {
        horario: '14:30 às 15:20',
        tipo: 'paralela',
        titulo: '2ª Rodada: Gestão de Pessoas - Manutenção da base, engajamento e cultura de dono',
        tematicaMacro: 'Gestão de Pessoas',
        diaOffset: 0,
      },
      {
        horario: '14:30 às 15:20',
        tipo: 'paralela',
        titulo: '2ª Rodada: Liderança & Presidência - Condução do Planejamento Estratégico',
        tematicaMacro: 'Estratégia & Liderança',
        diaOffset: 0,
      },
      {
        horario: '15:20 às 15:35',
        tipo: 'outro',
        titulo: 'Ativação: EFEJ 2026',
        tematicaMacro: 'Cultura',
        diaOffset: 0,
      },
      {
        horario: '16:10 às 16:50',
        tipo: 'outro',
        titulo: 'Batalha de Cases de Sucesso RioJunior',
        tematicaMacro: 'Vendas',
        diaOffset: 0,
      },
      {
        horario: '17:00 às 17:30',
        tipo: 'almoco_intervalo',
        titulo: 'Exquenta pré-palco + Coffee Break',
        tematicaMacro: 'Outra',
        diaOffset: 0,
      },
      {
        horario: '17:40 às 18:50',
        tipo: 'outro',
        titulo: 'PALCO RIOJUNIOR: Reconhecimento e Premiação das EJs',
        tematicaMacro: 'Cultura',
        ministranteNome: 'Diretoria RioJunior',
        diaOffset: 0,
      },
      {
        horario: '18:50 às 19:00',
        tipo: 'encerramento',
        titulo: 'Pauta de Encerramento Oficial',
        tematicaMacro: 'Cultura',
        ministranteNome: 'Coordenadores',
        diaOffset: 0,
      },
    ],
  },

  // 4. EFEJ 2026 (3 DIAS COMPLETOS)
  {
    id: 'template_efej',
    nome: 'Modelo EFEJ (Encontro Fluminense - 3 Dias)',
    eventoReferencia: 'EFEJ 2026 (Congresso de 3 Dias)',
    tipoEvento: 'Congresso Imersivo Estadual (3 Dias)',
    descricao:
      'O ápice anual do MEJ Fluminense reunindo toda a rede por 3 dias completos: Credenciamento nos alojamentos, 5 Pautas Magnas, 2 rodadas de Paralelas setoriais, Batalha Estadual de Cases, Fast Consulting, Feira de Parceiros, Luau, Premiação Estadual e After.',
    icone: 'Award',
    diasCount: 3,
    totalMomentos: 26,
    horasEstimadas: '3 dias completos',
    qtdMagnas: 5,
    qtdParalelas: 8,
    tags: ['Congresso 3 Dias', '5 Magnas', '8 Paralelas', 'Premiação Estadual', 'Feira de Parceiros', 'Luau'],
    momentos: [
      // DIA 1
      {
        horario: '14:00 às 18:00',
        tipo: 'credenciamento',
        titulo: 'Credenciamento Oficial & Check-in nos Alojamentos / Hotéis',
        tematicaMacro: 'Outra',
        diaOffset: 0,
      },
      {
        horario: '18:00 às 19:30',
        tipo: 'almoco_intervalo',
        titulo: 'Jantar dos Congressistas & Feira de Oportunidades',
        tematicaMacro: 'Outra',
        diaOffset: 0,
      },
      {
        horario: '19:30 às 20:30',
        tipo: 'abertura',
        titulo: 'Cerimônia de Abertura Oficial do EFEJ: A Força do Movimento Fluminense',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Diretoria Executiva RioJunior',
        diaOffset: 0,
      },
      {
        horario: '20:30 às 20:45',
        tipo: 'outro',
        titulo: 'Código de Ética & Boas Práticas do Congresso',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Time de Governança',
        diaOffset: 0,
      },
      {
        horario: '20:45 às 21:45',
        tipo: 'magna',
        titulo: 'MAGNA DE ABERTURA: Liderando a Transformação do Estado do Rio de Janeiro',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Palestrante Magna / CEO Parceiro',
        parceiroNome: 'Patrocinador Master',
        diaOffset: 0,
      },
      {
        horario: '22:00 às 00:00',
        tipo: 'happy_hour',
        titulo: 'Momento de Integração: Luau da Rede Fluminense',
        tematicaMacro: 'Outra',
        diaOffset: 0,
      },

      // DIA 2
      {
        horario: '08:00 às 09:00',
        tipo: 'checkin',
        titulo: 'Café da Manhã & Check-in Matinal dos Congressistas',
        tematicaMacro: 'Outra',
        diaOffset: 1,
      },
      {
        horario: '09:00 às 09:50',
        tipo: 'magna',
        titulo: 'MAGNA MATUTINA: Inovação Aberta e o Ecossistema Empreendedor',
        tematicaMacro: 'Inovação & IA',
        ministranteTipo: 'convidado_externo',
        ministranteNome: 'Líder do Ecossistema de Inovação',
        diaOffset: 1,
      },
      {
        horario: '10:00 às 10:50',
        tipo: 'paralela',
        titulo: '1ª Rodada: Comercial - Máquina de Prospecção e Fechamento Outbound',
        tematicaMacro: 'Vendas',
        diaOffset: 1,
      },
      {
        horario: '10:00 às 10:50',
        tipo: 'paralela',
        titulo: '1ª Rodada: Projetos - Metodologias Ágeis de Alta Entrega ao Cliente',
        tematicaMacro: 'Operações & Processos',
        diaOffset: 1,
      },
      {
        horario: '10:00 às 10:50',
        tipo: 'paralela',
        titulo: '1ª Rodada: Gestão de Pessoas - Retenção e Engajamento da Base',
        tematicaMacro: 'Gestão de Pessoas',
        diaOffset: 1,
      },
      {
        horario: '10:00 às 10:50',
        tipo: 'paralela',
        titulo: '1ª Rodada: Marketing - Posicionamento de Marca e Geração de Demanda',
        tematicaMacro: 'Marketing',
        diaOffset: 1,
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: '2ª Rodada: Finanças - Precificação Estratégica e Lucratividade',
        tematicaMacro: 'Financeiro',
        diaOffset: 1,
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: '2ª Rodada: Liderança - Como Conduzir a EJ em Momentos de Crise',
        tematicaMacro: 'Estratégia & Liderança',
        diaOffset: 1,
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: '2ª Rodada: ESG & Impacto Social Transformador nos Negócios',
        tematicaMacro: 'Cultura',
        diaOffset: 1,
      },
      {
        horario: '11:00 às 11:50',
        tipo: 'paralela',
        titulo: 'Fast Consulting: Desafio Corporativo com Patrocinador Master',
        tematicaMacro: 'Estratégia & Liderança',
        parceiroNome: 'Empresa Parceira',
        diaOffset: 1,
      },
      {
        horario: '12:00 às 13:30',
        tipo: 'almoco_intervalo',
        titulo: 'Almoço da Rede & Feira de Estandes dos Patrocinadores',
        tematicaMacro: 'Outra',
        diaOffset: 1,
      },
      {
        horario: '13:30 às 13:45',
        tipo: 'outro',
        titulo: 'Momento Comunica: Lançamentos e Novidades da RioJunior',
        tematicaMacro: 'Marketing',
        diaOffset: 1,
      },
      {
        horario: '13:45 às 14:45',
        tipo: 'magna',
        titulo: 'MAGNA VESPERTINA: Cultura de Alta Performance e Escala nos Negócios',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'parceiro_vpneg',
        ministranteNome: 'Liderança Ambev',
        parceiroNome: 'Ambev',
        diaOffset: 1,
      },
      {
        horario: '15:00 às 16:00',
        tipo: 'outro',
        titulo: 'Batalha Estadual de Cases: As Melhores Soluções do MEJ Fluminense',
        tematicaMacro: 'Vendas',
        diaOffset: 1,
      },
      {
        horario: '16:00 às 16:30',
        tipo: 'almoco_intervalo',
        titulo: 'Coffee Break & Sala de Benchmarking Livre',
        tematicaMacro: 'Outra',
        diaOffset: 1,
      },
      {
        horario: '16:30 às 17:30',
        tipo: 'magna',
        titulo: 'MAGNA: O Papel do Jovem no Desenvolvimento Econômico e Social do Rio',
        tematicaMacro: 'Estratégia & Liderança',
        diaOffset: 1,
      },
      {
        horario: '17:30 às 18:30',
        tipo: 'outro',
        titulo: 'Ativação Especial dos Patrocinadores & Dinâmicas da Rede',
        tematicaMacro: 'Marketing',
        diaOffset: 1,
      },
      {
        horario: '19:00 às 20:30',
        tipo: 'almoco_intervalo',
        titulo: 'Jantar dos Congressistas',
        tematicaMacro: 'Outra',
        diaOffset: 1,
      },
      {
        horario: '21:00 às 02:00',
        tipo: 'happy_hour',
        titulo: 'Festa Temática Oficial do EFEJ',
        tematicaMacro: 'Outra',
        diaOffset: 1,
      },

      // DIA 3
      {
        horario: '08:30 às 09:30',
        tipo: 'checkin',
        titulo: 'Café da Manhã & Check-in do Dia de Premiação',
        tematicaMacro: 'Outra',
        diaOffset: 2,
      },
      {
        horario: '09:30 às 10:30',
        tipo: 'outro',
        titulo: 'Painel de Pós-Juniores: Carreira, Trajetória e Legado do MEJ',
        tematicaMacro: 'Gestão de Pessoas',
        ministranteTipo: 'pos_junior',
        ministranteNome: 'Pós-Juniores Destaque',
        diaOffset: 2,
      },
      {
        horario: '10:45 às 11:45',
        tipo: 'magna',
        titulo: 'MAGNA DE ENCERRAMENTO: Nosso Compromisso com o Futuro do Rio de Janeiro',
        tematicaMacro: 'Estratégia & Liderança',
        ministranteTipo: 'convidado_externo',
        ministranteNome: 'Liderança Inspiradora',
        diaOffset: 2,
      },
      {
        horario: '12:00 às 13:30',
        tipo: 'almoco_intervalo',
        titulo: 'Almoço de Encerramento',
        tematicaMacro: 'Outra',
        diaOffset: 2,
      },
      {
        horario: '13:30 às 16:00',
        tipo: 'outro',
        titulo: 'PALCO RIOJUNIOR: Cerimônia de Premiação e Reconhecimento das Melhores EJs do Ano',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Diretoria da RioJunior',
        diaOffset: 2,
      },
      {
        horario: '16:00 às 16:30',
        tipo: 'encerramento',
        titulo: 'Pauta de Encerramento Oficial do EFEJ',
        tematicaMacro: 'Cultura',
        ministranteTipo: 'interno',
        ministranteNome: 'Presidente da RioJunior & Coordenadores',
        diaOffset: 2,
      },
      {
        horario: '17:00 às 20:00',
        tipo: 'happy_hour',
        titulo: 'After Oficial de Despedida do EFEJ',
        tematicaMacro: 'Outra',
        diaOffset: 2,
      },
    ],
  },
];

const TEMPLATES_STORAGE_KEY = 'riojunior_grade_templates_v4';

export function getGradeTemplates(): GradeTemplate[] {
  try {
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (saved) {
      const storedMap: Record<string, GradeTemplate> = JSON.parse(saved);
      // Mescla os padrões na ordem oficial com as edições salvas pelo usuário
      const result = DEFAULT_GRADE_TEMPLATES.map(def => {
        if (storedMap[def.id]) {
          return { ...def, ...storedMap[def.id] };
        }
        return def;
      });

      // Adiciona quaisquer templates personalizados criados pelo usuário
      const customTemplates = Object.values(storedMap).filter(t => t.isCustom);
      return [...result, ...customTemplates];
    }
  } catch (e) {
    console.warn('Erro ao carregar templates do localStorage:', e);
  }
  return DEFAULT_GRADE_TEMPLATES;
}

export function saveGradeTemplate(template: GradeTemplate): void {
  try {
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    const storedMap: Record<string, GradeTemplate> = saved ? JSON.parse(saved) : {};

    // Recalcula quantidades automáticas
    const totalMomentos = template.momentos.length;
    const qtdMagnas = template.momentos.filter(m => m.tipo === 'magna').length;
    const qtdParalelas = template.momentos.filter(m => m.tipo === 'paralela').length;

    storedMap[template.id] = {
      ...template,
      totalMomentos,
      qtdMagnas,
      qtdParalelas,
    };

    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(storedMap));
  } catch (e) {
    console.warn('Erro ao salvar template:', e);
  }
}

export function resetTemplateToDefault(templateId: string): void {
  try {
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (saved) {
      const storedMap: Record<string, GradeTemplate> = JSON.parse(saved);
      delete storedMap[templateId];
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(storedMap));
    }
  } catch (e) {
    console.warn('Erro ao resetar template:', e);
  }
}

export function deleteCustomGradeTemplate(templateId: string): void {
  try {
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (saved) {
      const storedMap: Record<string, GradeTemplate> = JSON.parse(saved);
      delete storedMap[templateId];
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(storedMap));
    }
  } catch (e) {
    console.warn('Erro ao excluir template:', e);
  }
}


export const saveCustomGradeTemplate = saveGradeTemplate;
