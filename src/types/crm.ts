export type CRMFieldType =
  | 'texto_curto'
  | 'texto_longo'
  | 'moeda'
  | 'data'
  | 'data_hora'
  | 'data_vencimento'
  | 'etiquetas'
  | 'selecao_unica'
  | 'selecao_lista'
  | 'checkbox'
  | 'responsavel'
  | 'anexo'
  | 'telefone'
  | 'email'
  | 'numerico'
  | 'tempo';

export interface CRMFieldDefinition {
  id: string;
  label: string;
  tipo: CRMFieldType;
  obrigatorio?: boolean;
  opcoes?: string[];
  placeholder?: string;
  ajuda?: string;
  faseId?: string; // Se específico de fase, ou 'global'/'inicial'
}

export interface CRMFase {
  id: string;
  nome: string;
  cor: string;
  ordem: number;
  descricao?: string;
  campos?: CRMFieldDefinition[];
}

export interface CRMTag {
  id: string;
  nome: string;
  cor: string;
  categoria?: 'temperatura' | 'segmento' | 'origem' | 'outro';
}

export interface CRMCard {
  id: string;
  titulo: string; // Nome do Parceiro
  faseId: string;
  responsavelNome?: string;
  responsaveis?: string[];
  pontoContato?: string;
  email?: string;
  dataAbertura?: string;
  dataVencimento?: string;
  etiquetas: string[];
  valores: Record<string, any>;
  anexos?: { id: string; nome: string; url?: string; tamanho?: string }[];
  historico?: { fase: string; data: string; usuario?: string }[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface AIParsedMeeting {
  parceiroNome: string;
  faseSugerida: string;
  temperatura: 'Quente' | 'Morno' | 'Frio';
  segmento?: string;
  origem?: string;
  doresIdentificadas?: string;
  formatoProposta?: string;
  valorProposta?: number | null;
  contraproposta?: string;
  pontosPositivosNegativos?: string;
  proximosPassos?: string;
  dataFollowUp?: string;
  responsavel?: string;
  observacoes?: string;
  acaoSugerida: 'criar_novo' | 'atualizar_existente';
  cardExistenteId?: string;
}
