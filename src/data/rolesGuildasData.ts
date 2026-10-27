// src/data/rolesGuildasData.ts
// Dados oficiais extraídos de [RioJunior] Mapeamento de Papéis 2027.xlsx
// Com exatamente 1 cargo de nível de Diretoria por Guilda e frentes estratégicas completas

export type GuildaKey = 'PRESEX' | 'VPNEG' | 'DDR' | 'FE' | 'OP' | 'PRESCON';

export interface PapelRioJunior {
  id?: string;
  nome: string;
  nomeCompletoOriginal?: string;
  objetivo: string;
  isDiretoria?: boolean;
  indicadores?: string;
  modeloTrabalho?: string;
  statusFrente?: 'ativa' | 'em_estruturacao' | 'pausada';
  entregaveis?: string;
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

export { frentesService } from '@/services/frentesService';
import { frentesService } from '@/services/frentesService';

export function getPapeisByGuilda(guilda: GuildaKey | string): PapelRioJunior[] {
  return frentesService.getPapeisByGuilda(guilda);
}

export function getObjetivoPapel(guilda: string, cargoNome: string): string {
  return frentesService.getObjetivoPapel(guilda, cargoNome);
}

export function getGuildaInfo(guilda: string): GuildaInfo {
  const g = (guilda || '').toUpperCase() as GuildaKey;
  return GUILDAS_INFO[g] || GUILDAS_INFO.OP;
}
