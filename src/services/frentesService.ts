// src/services/frentesService.ts
// Servico dinamico de gestao de Frentes e Papeis das Guildas da RioJunior
// Permite que administradores alterem nome, descricao, responsaveis e outros dados das frentes

import { GuildaKey, PapelRioJunior, GUILDAS_INFO } from '@/data/rolesGuildasData';
import { membrosCartoesService, MembroRioJunior } from '@/services/membrosCartoesService';

const STORAGE_KEY_FRENTES = 'riojunior_frentes_v2';

export const INITIAL_MAPEAMENTO_PAPEIS: Record<GuildaKey, PapelRioJunior[]> = {
  PRESEX: [
    {
      nome: 'Presidente Executivo',
      nomeCompletoOriginal: 'Presidente Executivo',
      objetivo: 'Garantir a representação dos interesses da RioJunior perante a sociedade civil organizada, instituições de ensino superior e instâncias do MEJ.',
      isDiretoria: true,
      statusFrente: 'ativa'
    },
    {
      nome: 'Relações Públicas',
      nomeCompletoOriginal: 'Relações Públicas (1 pessoa)',
      objetivo: 'Responsável por construir, divulgar e preservar a boa imagem da organização perante o público interno ou externo, a partir da comunicação, trazendo relevância e presença no ecossistema. Responsável por gerir o posicionamento da RioJunior com o ecossistema empreendedor e relacionamento com pós juniores.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Relacionamento com Insituição de Ensino Superior',
      nomeCompletoOriginal: 'Relacionamento com Insituição de Ensino Superior (1 pessoa)',
      objetivo: 'Promover a representação e potencialização dos interesses e necessidades da comunidade do Movimento Empresa Júnior (MEJ) perante as instituições de ensino superior e organizações do ecossistema da educação. Atuar como elo estratégico entre a RioJunior, as universidades e demais agentes educacionais, garantindo suporte ao desenvolvimento das EJs e fortalecendo a presença do MEJ dentro das IES.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Mercado',
      nomeCompletoOriginal: 'Mercado (1 pessoa)',
      objetivo: 'Representar as bandeiras e interesses da RioJunior e do Movimento Empresa Júnior (MEJ) perante agentes de mercado, visando gerar oportunidades diretas, parcerias estratégicas e recursos para fortalecer a rede e suas iniciativas.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Relações Institucionais e Governamentais',
      nomeCompletoOriginal: 'Relações Institucionais e Governamentais (1 pessoa)',
      objetivo: 'Desenvolver iniciativas em parceria com o poder público para captação de recursos e execução de projetos alinhados às bandeiras do MEJ, além de fortalecer o posicionamento político e institucional da RioJunior.',
      statusFrente: 'ativa'
    }
  ],
  VPNEG: [
    {
      nome: 'Diretor(a) de Negócios',
      nomeCompletoOriginal: 'Diretor(a) de Negócios',
      objetivo: 'Liderar a estratégia comercial da RioJunior, prospecção e fechamento de parcerias com grandes marcas, captação de recursos e desenvolvimento de novas fontes de receita para a Federação.',
      isDiretoria: true,
      statusFrente: 'ativa'
    },
    {
      nome: 'Executivo de Vendas',
      nomeCompletoOriginal: 'Executivo de Vendas (3 pessoas)',
      objetivo: 'Gerar oportunidades frente a contas de renovação e novos negócios, garantindo a captação de receita operacional bruta da RioJunior por meio das fontes tradicionais. Além disso, garantir o recebimento dessas contas.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Modelo de Negócios',
      nomeCompletoOriginal: 'Modelo de Negócios (2 pessoas)',
      objetivo: 'Desenhar, estruturar, testar e implementar novos produtos e modelos de negócios para a RioJunior, garantindo a validação de propostas de valor escaláveis e sustentáveis. Além de gerenciar as fontes de receita diversificada atuais.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Customer Sucess',
      nomeCompletoOriginal: 'Customer Sucess (1 pessoa)',
      objetivo: 'Garantir a execução da proposta de valor vendida aos parceiros da RioJunior, com o objetivo de gerar retenção (renovação de contratos) e satisfação por meio de um bom relacionamento e entrega com excelência.',
      statusFrente: 'ativa'
    }
  ],
  DDR: [
    {
      nome: 'Diretor(a) de Desenvolvimento da Rede',
      nomeCompletoOriginal: 'Diretor(a) de Desenvolvimento da Rede',
      objetivo: 'Liderar a guilda de Desenvolvimento da Rede, impulsionando a conformidade regulamentar (Selo EJ), a aceleração dos resultados das EJs e o acompanhamento dos Guardiões.',
      isDiretoria: true,
      statusFrente: 'ativa'
    },
    {
      nome: 'Aceleração',
      nomeCompletoOriginal: 'Aceleração',
      objetivo: 'Auxiliar e guiar as instâncias da rede fluminense para que cumpram seu papel no suporte e desenvolvimento das EJs, a fim de garantir a aceleração da rede rumo às metas do Plano Estratégico da Rede 2027.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Expansão',
      nomeCompletoOriginal: 'Expansão',
      objetivo: 'Atuar diretamente no crescimento sustentável da rede de Empresas Juniores no Rio de Janeiro, auxiliando na prospecção, criação, fundação e federação de novas EJs, garantindo que novas iniciativas tenham suporte estrutural para se desenvolverem com excelência.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Regulamentação da Rede',
      nomeCompletoOriginal: 'Regulamentação da Rede',
      objetivo: 'Acompanhar as Empresas Juniores no estejam de acordo com as exigências legais e regulamentares, especialmente da BJ através do selo EJ, oferecendo orientação, suporte e soluções para promover a regularização de suas atividades e fortalecer uma atuação segura, organizada e em conformidade. Além de, em conjunto com a diretoria da guilda, monitorar o processo de acompanhamento para garantir regularidade das EJs perante a RioJunior.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Suporte as EJs',
      nomeCompletoOriginal: 'Suporte as EJs',
      objetivo: 'Consiste em atuar quase como consultor de desenvolvimento organizacional, apoio as empresas juniores na identificação de desafios, realizar diagnósticos e construção de soluções que façam sentido para a realidade de cada empresa. A ideia é ajudar a acelerar a curva de maturidade, fortalecer a cultura e preparar as ejs para crescerem de forma consistente e sustentável, gerar cada vez mais impacto ao longo do tempo.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Suporte aos Guardiões',
      nomeCompletoOriginal: 'Suporte aos Guardiões',
      objetivo: 'Facilitar e potencializar o desempenho dos guardiões e da rede por meio do uso estratégico de dados, coletas estruturadas e estímulos internos de engajamento. Se concentrando no planejamento prévio para suprir necessidades em tempo hábil, prevenindo atritos no relacionamento e assegurando o alcance das metas, o fortalecimento da cultura e a evolução contínua da maturidade das EJs.',
      statusFrente: 'ativa'
    }
  ],
  FE: [
    {
      nome: 'Diretor(a) de Formação Empreendedora',
      nomeCompletoOriginal: 'Diretor(a) de Formação Empreendedora',
      objetivo: 'Liderar a guilda de Formação Empreendedora, definindo a estratégia de capacitações da rede, produtos de conexão, comunicação institucional e os grandes eventos do MEJ Fluminense (EFEJ, CentralRio, ONDE).',
      isDiretoria: true,
      statusFrente: 'ativa'
    },
    {
      nome: 'Educação da rede',
      nomeCompletoOriginal: 'Educação da rede (2 pessoas)',
      objetivo: 'Promover conteúdos síncronos e assíncronos para a rede fluminense, que sejam capazes de desenvolver habilidades descritas na Vivência Empresarial do MEJ, em prol do alcance dos indicadores dispostos no planejamento estratégico da rede do MEJ.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Experiência e Infraestrutura de Eventos',
      nomeCompletoOriginal: 'Experiência e Infraestrutura de Eventos (1 pessoa)',
      objetivo: 'Formar e educar as lideranças das rede, olhando tanto para a formação dos mesmo quando para o cascateamento da formação do empresário júnior através dos produtos de conexão da rede.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Estratégia de Comunicação',
      nomeCompletoOriginal: 'Estratégia de Comunicação (1 pessoa)',
      objetivo: 'Gerir a comunicação da RioJunior, garantindo a plena sinergia e utilização dos canais da RioJunior, assim como o alinhamento dos empresários juniores com o propósito do MEJ.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Coordenadoria Geral do EFEJ',
      nomeCompletoOriginal: 'Coordenadoria Geral do EFEJ (1 pessoa)',
      objetivo: 'Coordenar o Encontro Fluminense de Empresas Juniores, prezando por uma ótima experiência e formação do empresário júnior.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Coordenadoria de Comunicação do EFEJ',
      nomeCompletoOriginal: 'Coordenadoria de Comunicação do EFEJ (1 pessoa)',
      objetivo: 'Coordenar o Encontro Fluminense de Empresas Juniores, buscando garantir a participação do maior número possível de empresários juniores no evento, além de promover a diversidade de todas as EJs presentes e promover a venda das fontes de receitas diversificadas (lojinha, festas, etc.).',
      statusFrente: 'ativa'
    },
    {
      nome: 'Coordenadoria de Operações do EFEJ',
      nomeCompletoOriginal: 'Coordenadoria de Operações do EFEJ (1 pessoa)',
      objetivo: 'Coordenar o Encontro Fluminense de Empresas Juniores, buscando garantir a execução plena de um planejamento financeiro para o evento, também da estruturação correta da infraestrutura do evento, prezando pela sustentabilidade financeira da federação e do evento a longo prazo.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Coordenadoria de Conteúdo do EFEJ',
      nomeCompletoOriginal: 'Coordenadoria de Conteúdo do EFEJ (1 pessoa)',
      objetivo: 'Coordenar o Encontro Fluminense de Empresas Juniores, buscando garantir a melhor execução possível da grade de conteúdo do evento e da realização das melhores experiências possíveis para a rede fluminense.',
      statusFrente: 'ativa'
    }
  ],
  OP: [
    {
      nome: 'Diretor(a) de Operações',
      nomeCompletoOriginal: 'Diretor(a) de Operações',
      objetivo: 'Liderar a guilda de Operações, garantindo a excelência dos processos internos, alocação e gestão financeira da Federação, desenvolvimento da equipe interna, clima organizacional e compliance do sistema de advertências.',
      isDiretoria: true,
      statusFrente: 'ativa'
    },
    {
      nome: 'Gestão de Processos',
      nomeCompletoOriginal: 'Gestão de Processos (1 pessoa)',
      objetivo: 'Gerenciar processos, ferramentas e rotinas que potencializem o trabalho das Guildas, buscando continuamente melhores resultados para a RioJunior.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Employer Branding',
      nomeCompletoOriginal: 'Employer Branding (1 pessoa)',
      objetivo: 'Responsável por fomentar e consolidar a Marca Empregadora da RioJunior, garantindo que a imagem da Federação seja atrativa e consistente para a Rede Fluminense.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Jornada de Time',
      nomeCompletoOriginal: 'Jornada de Time (1 pessoa)',
      objetivo: 'Garantir a retenção e o desenvolvimento dos talentos da RioJunior.',
      statusFrente: 'ativa'
    },
    {
      nome: 'Financeiro',
      nomeCompletoOriginal: 'Financeiro (1 pessoa)',
      objetivo: 'Garantir a gestão e alocação assertiva dos recursos da RioJunior, com objetivo de potencializar a sustentabilidade financeira da Federação.',
      statusFrente: 'ativa'
    }
  ],
  PRESCON: [
    {
      nome: 'Presidente do Conselho',
      nomeCompletoOriginal: 'Presidente do Conselho',
      objetivo: 'Representar o MEJ Fluminense e desenvolver a RioJunior através da governança, garantindo a perenidade, evolução e bom funcionamento de seus órgãos de governança, fortalecendo a ética e contribuindo para o direcionamento estratégico da Federação.',
      isDiretoria: true,
      statusFrente: 'ativa'
    }
  ]
};

class FrentesService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEY_FRENTES)) {
      localStorage.setItem(STORAGE_KEY_FRENTES, JSON.stringify(INITIAL_MAPEAMENTO_PAPEIS));
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Erro no listener de FrentesService:', err);
      }
    });
  }

  public getFrentes(): Record<GuildaKey, PapelRioJunior[]> {
    if (typeof window === 'undefined') return INITIAL_MAPEAMENTO_PAPEIS;
    const data = localStorage.getItem(STORAGE_KEY_FRENTES);
    if (!data) return INITIAL_MAPEAMENTO_PAPEIS;
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_MAPEAMENTO_PAPEIS;
    }
  }

  public getPapeisByGuilda(guilda: GuildaKey | string): PapelRioJunior[] {
    const g = (guilda || '').toUpperCase() as GuildaKey;
    const all = this.getFrentes();
    return all[g] || [];
  }

  public getObjetivoPapel(guilda: string, cargoNome: string): string {
    const papeis = this.getPapeisByGuilda(guilda);
    const found = papeis.find(p => p.nome.toLowerCase() === (cargoNome || '').toLowerCase());
    return found ? found.objetivo : '';
  }

  // Salvar edicao de frente existente
  public saveFrente(
    guildaAtual: GuildaKey,
    frenteAtualizada: PapelRioJunior,
    originalNome?: string,
    novaGuilda?: GuildaKey
  ): void {
    const all = this.getFrentes();
    const gDestino = novaGuilda || guildaAtual;
    const searchName = (originalNome || frenteAtualizada.nome).toLowerCase().trim();

    // Remove da guilda de origem
    all[guildaAtual] = (all[guildaAtual] || []).filter(
      p => p.nome.toLowerCase().trim() !== searchName
    );

    // Insere ou atualiza na guilda destino
    if (!all[gDestino]) all[gDestino] = [];
    all[gDestino].push(frenteAtualizada);

    localStorage.setItem(STORAGE_KEY_FRENTES, JSON.stringify(all));

    // Se o nome ou a guilda mudou, sincroniza automaticamente os membros que estavam vinculados
    if (originalNome && (originalNome.trim() !== frenteAtualizada.nome.trim() || guildaAtual !== gDestino)) {
      const membros = membrosCartoesService.getMembros();
      membros.forEach(m => {
        if (m.guilda === guildaAtual && m.cargo.toLowerCase().trim() === searchName) {
          membrosCartoesService.saveMembro({
            ...m,
            guilda: gDestino,
            cargo: frenteAtualizada.nome.trim()
          });
        }
      });
    }

    this.notify();
  }

  // Criar nova frente
  public createFrente(guilda: GuildaKey, novaFrente: PapelRioJunior): void {
    const all = this.getFrentes();
    if (!all[guilda]) all[guilda] = [];

    // Verifica se ja existe frente com mesmo nome
    const exists = all[guilda].some(p => p.nome.toLowerCase().trim() === novaFrente.nome.toLowerCase().trim());
    if (exists) {
      throw new Error(`Já existe uma frente com o nome "${novaFrente.nome}" na guilda ${guilda}.`);
    }

    all[guilda].push(novaFrente);
    localStorage.setItem(STORAGE_KEY_FRENTES, JSON.stringify(all));
    this.notify();
  }

  // Excluir frente
  public deleteFrente(guilda: GuildaKey, frenteNome: string): void {
    const all = this.getFrentes();
    const nameLower = frenteNome.toLowerCase().trim();

    // Impede exclusao se for o unico cargo de diretoria
    const frente = (all[guilda] || []).find(p => p.nome.toLowerCase().trim() === nameLower);
    if (frente?.isDiretoria) {
      const totalDiretorias = (all[guilda] || []).filter(p => p.isDiretoria).length;
      if (totalDiretorias <= 1) {
        throw new Error('Não é permitido excluir o único cargo de Diretoria da guilda.');
      }
    }

    all[guilda] = (all[guilda] || []).filter(p => p.nome.toLowerCase().trim() !== nameLower);
    localStorage.setItem(STORAGE_KEY_FRENTES, JSON.stringify(all));

    // Desaloca membros que estavam nessa frente
    const membros = membrosCartoesService.getMembros();
    membros.forEach(m => {
      if (m.guilda === guilda && m.cargo.toLowerCase().trim() === nameLower) {
        membrosCartoesService.saveMembro({
          ...m,
          cargo: 'Membro Colaborador'
        });
      }
    });

    this.notify();
  }

  // Atribuir e gerenciar membros responsaveis pela frente
  public assignMembersToFrente(guilda: GuildaKey, cargoNome: string, targetMemberIds: string[]): void {
    const membros = membrosCartoesService.getMembros();
    const cargoLower = cargoNome.toLowerCase().trim();

    membros.forEach(m => {
      const isCurrentlyAssigned = m.guilda === guilda && m.cargo.toLowerCase().trim() === cargoLower;
      const shouldBeAssigned = targetMemberIds.includes(m.id);

      if (shouldBeAssigned && !isCurrentlyAssigned) {
        // Aloca membro nesta frente
        membrosCartoesService.saveMembro({
          ...m,
          guilda: guilda,
          cargo: cargoNome
        });
      } else if (!shouldBeAssigned && isCurrentlyAssigned) {
        // Desaloca membro desta frente
        membrosCartoesService.saveMembro({
          ...m,
          cargo: 'Membro Colaborador'
        });
      }
    });

    this.notify();
  }
}

export const frentesService = new FrentesService();
