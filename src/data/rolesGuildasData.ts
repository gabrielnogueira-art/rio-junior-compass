// src/data/rolesGuildasData.ts
// Dados oficiais extraídos de [RioJunior] Mapeamento de Papéis 2027.xlsx
// Com exatamente 1 cargo de nível de Diretoria por Guilda e frentes estratégicas completas

export type GuildaKey = 'PRESEX' | 'VPNEG' | 'DDR' | 'FE' | 'OP' | 'PRESCON';

export interface PapelRioJunior {
  nome: string;
  nomeCompletoOriginal: string;
  objetivo: string;
  isDiretoria?: boolean;
}

export interface GuildaInfo {
  nome: string;
  sigla: GuildaKey;
  cor: string;
  descricao: string;
  diretoriaTitulo: string;
}

export const GUILDAS_INFO: Record<GuildaKey, GuildaInfo> = {
  PRESEX: {
    nome: 'Presidência Executiva',
    sigla: 'PRESEX',
    cor: 'amber',
    descricao: 'Representação institucional, relações governamentais, mercado e relações públicas.',
    diretoriaTitulo: 'Presidente Executivo'
  },
  VPNEG: {
    nome: 'Vice-Presidência de Negócios',
    sigla: 'VPNEG',
    cor: 'emerald',
    descricao: 'Captação de receitas, parcerias corporativas, patrocínios e novos modelos de negócios.',
    diretoriaTitulo: 'Diretor(a) de Negócios'
  },
  DDR: {
    nome: 'Desenvolvimento da Rede (EJs)',
    sigla: 'DDR',
    cor: 'blue',
    descricao: 'Aceleração, expansão, conformidade jurídica (Selo EJ) e acompanhamento dos guardiões.',
    diretoriaTitulo: 'Diretor(a) de Desenvolvimento da Rede'
  },
  FE: {
    nome: 'Formação Empreendedora',
    sigla: 'FE',
    cor: 'purple',
    descricao: 'Capacitações da rede, eventos oficiais (EFEJ, ONDE, CentralRio), comunicação e vivência empresarial.',
    diretoriaTitulo: 'Diretor(a) de Formação Empreendedora'
  },
  OP: {
    nome: 'Operações (Gente e Gestão)',
    sigla: 'OP',
    cor: 'cyan',
    descricao: 'Processos internos, financeiro, jornada de time, marca empregadora e sistema disciplinar.',
    diretoriaTitulo: 'Diretor(a) de Operações'
  },
  PRESCON: {
    nome: 'Presidência do Conselho',
    sigla: 'PRESCON',
    cor: 'slate',
    descricao: 'Governança institucional, perenidade, fiscalização estatutária e ética da Federação.',
    diretoriaTitulo: 'Presidente do Conselho'
  }
};

export const MAPEAMENTO_PAPEIS: Record<GuildaKey, PapelRioJunior[]> = {
  PRESEX: [
    {
      nome: 'Presidente Executivo',
      nomeCompletoOriginal: 'Presidente Executivo',
      objetivo: 'Garantir a representação dos interesses da RioJunior perante a sociedade civil organizada, instituições de ensino superior e instâncias do MEJ.',
      isDiretoria: true
    },
    {
      nome: 'Relações Públicas',
      nomeCompletoOriginal: 'Relações Públicas (1 pessoa)',
      objetivo: 'Responsável por construir, divulgar e preservar a boa imagem da organização perante o público interno ou externo, a partir da comunicação, trazendo relevância e presença no ecossistema. Responsável por gerir o posicionamento da RioJunior com o ecossistema empreendedor e relacionamento com pós juniores.'
    },
    {
      nome: 'Relacionamento com Insituição de Ensino Superior',
      nomeCompletoOriginal: 'Relacionamento com Insituição de Ensino Superior (1 pessoa)',
      objetivo: 'Promover a representação e potencialização dos interesses e necessidades da comunidade do Movimento Empresa Júnior (MEJ) perante as instituições de ensino superior e organizações do ecossistema da educação. Atuar como elo estratégico entre a RioJunior, as universidades e demais agentes educacionais, garantindo suporte ao desenvolvimento das EJs e fortalecendo a presença do MEJ dentro das IES.'
    },
    {
      nome: 'Mercado',
      nomeCompletoOriginal: 'Mercado (1 pessoa)',
      objetivo: 'Representar as bandeiras e interesses da RioJunior e do Movimento Empresa Júnior (MEJ) perante agentes de mercado, visando gerar oportunidades diretas, parcerias estratégicas e recursos para fortalecer a rede e suas iniciativas.'
    },
    {
      nome: 'Relações Institucionais e Governamentais',
      nomeCompletoOriginal: 'Relações Institucionais e Governamentais (1 pessoa)',
      objetivo: 'Desenvolver iniciativas em parceria com o poder público para captação de recursos e execução de projetos alinhados às bandeiras do MEJ, além de fortalecer o posicionamento político e institucional da RioJunior.'
    }
  ],
  VPNEG: [
    {
      nome: 'Diretor(a) de Negócios',
      nomeCompletoOriginal: 'Diretor(a) de Negócios',
      objetivo: 'Liderar a estratégia comercial da RioJunior, prospecção e fechamento de parcerias com grandes marcas, captação de recursos e desenvolvimento de novas fontes de receita para a Federação.',
      isDiretoria: true
    },
    {
      nome: 'Executivo de Vendas',
      nomeCompletoOriginal: 'Executivo de Vendas (3 pessoas)',
      objetivo: 'Gerar oportunidades frente a contas de renovação e novos negócios, garantindo a captação de receita operacional bruta da RioJunior por meio das fontes tradicionais. Além disso, garantir o recebimento dessas contas.'
    },
    {
      nome: 'Modelo de Negócios',
      nomeCompletoOriginal: 'Modelo de Negócios (2 pessoas)',
      objetivo: 'Desenhar, estruturar, testar e implementar novos produtos e modelos de negócios para a RioJunior, garantindo a validação de propostas de valor escaláveis e sustentáveis. Além de gerenciar as fontes de receita diversificada atuais.'
    },
    {
      nome: 'Customer Sucess',
      nomeCompletoOriginal: 'Customer Sucess (1 pessoa)',
      objetivo: 'Garantir a execução da proposta de valor vendida aos parceiros da RioJunior, com o objetivo de gerar retenção (renovação de contratos) e satisfação por meio de um bom relacionamento e entrega com excelência.'
    }
  ],
  DDR: [
    {
      nome: 'Diretor(a) de Desenvolvimento da Rede',
      nomeCompletoOriginal: 'Diretor(a) de Desenvolvimento da Rede',
      objetivo: 'Liderar a guilda de Desenvolvimento da Rede, impulsionando a conformidade regulamentar (Selo EJ), a aceleração dos resultados das EJs e o acompanhamento dos Guardiões.',
      isDiretoria: true
    },
    {
      nome: 'Aceleração',
      nomeCompletoOriginal: 'Aceleração',
      objetivo: 'Auxiliar e guiar as instâncias da rede fluminense para que cumpram seu papel no suporte e desenvolvimento das EJs, a fim de garantir a aceleração da rede rumo às metas do Plano Estratégico da Rede 2027.'
    },
    {
      nome: 'Expansão',
      nomeCompletoOriginal: 'Expansão',
      objetivo: 'Atuar diretamente no crescimento sustentável da rede de Empresas Juniores no Rio de Janeiro, auxiliando na prospecção, criação, fundação e federação de novas EJs, garantindo que novas iniciativas tenham suporte estrutural para se desenvolverem com excelência.'
    },
    {
      nome: 'Regulamentação da Rede',
      nomeCompletoOriginal: 'Regulamentação da Rede',
      objetivo: 'Acompanhar as Empresas Juniores no estejam de acordo com as exigências legais e regulamentares, especialmente da BJ através do selo EJ, oferecendo orientação, suporte e soluções para promover a regularização de suas atividades e fortalecer uma atuação segura, organizada e em conformidade. Além de, em conjunto com a diretoria da guilda, monitorar o processo de acompanhamento para garantir regularidade das EJs perante a RioJunior.'
    },
    {
      nome: 'Suporte as EJs',
      nomeCompletoOriginal: 'Suporte as EJs',
      objetivo: 'Consiste em atuar quase como consultor de desenvolvimento organizacional, apoio as empresas juniores na identificação de desafios, realizar diagnósticos e construção de soluções que façam sentido para a realidade de cada empresa. A ideia é ajudar a acelerar a curva de maturidade, fortalecer a cultura e preparar as ejs para crescerem de forma consistente e sustentável, gerar cada vez mais impacto ao longo do tempo.'
    },
    {
      nome: 'Suporte aos Guardiões',
      nomeCompletoOriginal: 'Suporte aos Guardiões',
      objetivo: 'Facilitar e potencializar o desempenho dos guardiões e da rede por meio do uso estratégico de dados, coletas estruturadas e estímulos internos de engajamento. Se concentrando no planejamento prévio para suprir necessidades em tempo hábil, prevenindo atritos no relacionamento e assegurando o alcance das metas, o fortalecimento da cultura e a evolução contínua da maturidade das EJs.'
    }
  ],
  FE: [
    {
      nome: 'Diretor(a) de Formação Empreendedora',
      nomeCompletoOriginal: 'Diretor(a) de Formação Empreendedora',
      objetivo: 'Liderar a guilda de Formação Empreendedora, definindo a estratégia de capacitações da rede, produtos de conexão, comunicação institucional e os grandes eventos do MEJ Fluminense (EFEJ, CentralRio, ONDE).',
      isDiretoria: true
    },
    {
      nome: 'Educação da rede',
      nomeCompletoOriginal: 'Educação da rede (2 pessoas)',
      objetivo: 'Promover conteúdos síncronos e assíncronos para a rede fluminense, que sejam capazes de desenvolver habilidades descritas na Vivência Empresarial do MEJ, em prol do alcance dos indicadores dispostos no planejamento estratégico da rede do MEJ.'
    },
    {
      nome: 'Experiência e Infraestrutura de Eventos',
      nomeCompletoOriginal: 'Experiência e Infraestrutura de Eventos (1 pessoa)',
      objetivo: 'Formar e educar as lideranças das rede, olhando tanto para a formação dos mesmo quando para o cascateamento da formação do empresário júnior através dos produtos de conexão da rede.'
    },
    {
      nome: 'Estratégia de Comunicação',
      nomeCompletoOriginal: 'Estratégia de Comunicação (1 pessoa)',
      objetivo: 'Gerir a comunicação da RioJunior, garantindo a plena sinergia e utilização dos canais da RioJunior, assim como o alinhamento dos empresários juniores com o propósito do MEJ.'
    },
    {
      nome: 'Coordenadoria Geral do EFEJ',
      nomeCompletoOriginal: 'Coordenadoria Geral do EFEJ (1 pessoa)',
      objetivo: 'Coordenar o Encontro Fluminense de Empresas Juniores, prezando por uma ótima experiência e formação do empresário júnior.'
    },
    {
      nome: 'Coordenadoria de Comunicação do EFEJ',
      nomeCompletoOriginal: 'Coordenadoria de Comunicação do EFEJ (1 pessoa)',
      objetivo: 'Coordenar o Encontro Fluminense de Empresas Juniores, buscando garantir a participação do maior número possível de empresários juniores no evento, além de promover a diversidade de todas as EJs presentes e promover a venda das fontes de receitas diversificadas (lojinha, festas, etc.).'
    },
    {
      nome: 'Coordenadoria de Operações do EFEJ',
      nomeCompletoOriginal: 'Coordenadoria de Operações do EFEJ (1 pessoa)',
      objetivo: 'Coordenar o Encontro Fluminense de Empresas Juniores, buscando garantir a execução plena de um planejamento financeiro para o evento, também da estruturação correta da infraestrutura do evento, prezando pela sustentabilidade financeira da federação e do evento a longo prazo.'
    },
    {
      nome: 'Coordenadoria de Conteúdo do EFEJ',
      nomeCompletoOriginal: 'Coordenadoria de Conteúdo do EFEJ (1 pessoa)',
      objetivo: 'Coordenar o Encontro Fluminense de Empresas Juniores, buscando garantir a melhor execução possível da grade de conteúdo do evento e da realização das melhores experiências possíveis para a rede fluminense.'
    }
  ],
  OP: [
    {
      nome: 'Diretor(a) de Operações',
      nomeCompletoOriginal: 'Diretor(a) de Operações',
      objetivo: 'Liderar a guilda de Operações, garantindo a excelência dos processos internos, alocação e gestão financeira da Federação, desenvolvimento da equipe interna, clima organizacional e compliance do sistema de advertências.',
      isDiretoria: true
    },
    {
      nome: 'Gestão de Processos',
      nomeCompletoOriginal: 'Gestão de Processos (1 pessoa)',
      objetivo: 'Gerenciar processos, ferramentas e rotinas que potencializem o trabalho das Guildas, buscando continuamente melhores resultados para a RioJunior.'
    },
    {
      nome: 'Employer Branding',
      nomeCompletoOriginal: 'Employer Branding (1 pessoa)',
      objetivo: 'Responsável por fomentar e consolidar a Marca Empregadora da RioJunior, garantindo que a imagem da Federação seja atrativa e consistente para a Rede Fluminense.'
    },
    {
      nome: 'Jornada de Time',
      nomeCompletoOriginal: 'Jornada de Time (1 pessoa)',
      objetivo: 'Garantir a retenção e o desenvolvimento dos talentos da RioJunior.'
    },
    {
      nome: 'Financeiro',
      nomeCompletoOriginal: 'Financeiro (1 pessoa)',
      objetivo: 'Garantir a gestão e alocação assertiva dos recursos da RioJunior, com objetivo de potencializar a sustentabilidade financeira da Federação.'
    }
  ],
  PRESCON: [
    {
      nome: 'Presidente do Conselho',
      nomeCompletoOriginal: 'Presidente do Conselho',
      objetivo: 'Representar o MEJ Fluminense e desenvolver a RioJunior através da governança, garantindo a perenidade, evolução e bom funcionamento de seus órgãos de governança, fortalecendo a ética e contribuindo para o direcionamento estratégico da Federação.',
      isDiretoria: true
    }
  ]
};

export function getPapeisByGuilda(guilda: GuildaKey | string): PapelRioJunior[] {
  const g = (guilda || '').toUpperCase() as GuildaKey;
  return MAPEAMENTO_PAPEIS[g] || [];
}

export function getObjetivoPapel(guilda: string, cargoNome: string): string {
  const papeis = getPapeisByGuilda(guilda);
  const found = papeis.find(p => p.nome.toLowerCase() === (cargoNome || '').toLowerCase());
  return found ? found.objetivo : '';
}

export function getGuildaInfo(guilda: string): GuildaInfo {
  const g = (guilda || '').toUpperCase() as GuildaKey;
  return GUILDAS_INFO[g] || GUILDAS_INFO.OP;
}
