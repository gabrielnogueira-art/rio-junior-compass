import seedData from '@/data/crmSeed.json';
import { CRMCard, CRMFase, CRMFieldDefinition, CRMTag, AIParsedMeeting } from '@/types/crm';

const STORAGE_KEY_CARDS = 'riojunior_crm_cards_v2';
const STORAGE_KEY_FASES = 'riojunior_crm_fases_v2';
const STORAGE_KEY_TAGS = 'riojunior_crm_tags_v2';

export class CRMService {
  private cards: CRMCard[] = [];
  private fases: CRMFase[] = [];
  private tags: CRMTag[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedFases = localStorage.getItem(STORAGE_KEY_FASES);
      if (savedFases) {
        this.fases = JSON.parse(savedFases);
      } else {
        this.fases = (seedData.fases as unknown) as CRMFase[];
        this.persistFases();
      }

      const savedCards = localStorage.getItem(STORAGE_KEY_CARDS);
      if (savedCards) {
        this.cards = JSON.parse(savedCards);
      } else {
        this.cards = (seedData.cards as unknown) as CRMCard[];
        this.persistCards();
      }

      const savedTags = localStorage.getItem(STORAGE_KEY_TAGS);
      if (savedTags) {
        this.tags = JSON.parse(savedTags);
      } else {
        this.tags = (seedData.etiquetas as unknown) as CRMTag[];
        this.persistTags();
      }
    } catch (e) {
      console.warn('Erro ao carregar CRM do localStorage:', e);
      this.fases = (seedData.fases as unknown) as CRMFase[];
      this.cards = (seedData.cards as unknown) as CRMCard[];
      this.tags = (seedData.etiquetas as unknown) as CRMTag[];
    }
  }

  private persistCards() {
    try {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(this.cards));
    } catch (e) {
      console.error('Falha ao persistir cards no storage', e);
    }
  }

  private persistFases() {
    try {
      localStorage.setItem(STORAGE_KEY_FASES, JSON.stringify(this.fases));
    } catch (e) {
      console.error('Falha ao persistir fases no storage', e);
    }
  }

  private persistTags() {
    try {
      localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(this.tags));
    } catch (e) {
      console.error('Falha ao persistir tags no storage', e);
    }
  }

  // --- Fases ---
  public getFases(): CRMFase[] {
    return [...this.fases].sort((a, b) => a.ordem - b.ordem);
  }

  public getFaseById(id: string): CRMFase | undefined {
    return this.fases.find(f => f.id === id);
  }

  public createFase(nome: string, cor: string, descricao?: string): CRMFase {
    const id = 'fase_' + Date.now().toString(36);
    const maxOrdem = this.fases.reduce((acc, f) => Math.max(acc, f.ordem), 0);
    const novaFase: CRMFase = {
      id,
      nome,
      cor,
      ordem: maxOrdem + 1,
      descricao: descricao || '',
      campos: []
    };
    this.fases.push(novaFase);
    this.persistFases();
    return novaFase;
  }

  public updateFase(id: string, updates: Partial<CRMFase>): CRMFase | undefined {
    const index = this.fases.findIndex(f => f.id === id);
    if (index === -1) return undefined;
    this.fases[index] = { ...this.fases[index], ...updates };
    this.persistFases();
    return this.fases[index];
  }

  public deleteFase(id: string): boolean {
    const temCards = this.cards.some(c => c.faseId === id);
    if (temCards) {
      throw new Error('Não é possível excluir uma fase que contém parceiros/cards. Mova os cards antes de excluir.');
    }
    this.fases = this.fases.filter(f => f.id !== id);
    this.persistFases();
    return true;
  }

  public reorderFases(orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      const f = this.fases.find(fase => fase.id === id);
      if (f) f.ordem = index + 1;
    });
    this.persistFases();
  }

  // --- Campos Configuráveis ---
  public addCampoToFase(faseId: string, campo: Omit<CRMFieldDefinition, 'id'>): CRMFieldDefinition {
    const fase = this.fases.find(f => f.id === faseId);
    if (!fase) throw new Error('Fase não encontrada');
    if (!fase.campos) fase.campos = [];
    const novoCampo: CRMFieldDefinition = {
      ...campo,
      id: 'field_' + Date.now().toString(36)
    };
    fase.campos.push(novoCampo);
    this.persistFases();
    return novoCampo;
  }

  public updateCampoInFase(faseId: string, campoId: string, updates: Partial<CRMFieldDefinition>) {
    const fase = this.fases.find(f => f.id === faseId);
    if (!fase || !fase.campos) return;
    const idx = fase.campos.findIndex(c => c.id === campoId);
    if (idx !== -1) {
      fase.campos[idx] = { ...fase.campos[idx], ...updates };
      this.persistFases();
    }
  }

  public deleteCampoFromFase(faseId: string, campoId: string) {
    const fase = this.fases.find(f => f.id === faseId);
    if (!fase || !fase.campos) return;
    fase.campos = fase.campos.filter(c => c.id !== campoId);
    this.persistFases();
  }

  // --- Cards / Parceiros ---
  public getCards(): CRMCard[] {
    return [...this.cards];
  }

  public getCardById(id: string): CRMCard | undefined {
    return this.cards.find(c => c.id === id);
  }

  public createCard(cardData: Partial<CRMCard> & { titulo: string; faseId: string }): CRMCard {
    const id = 'card_' + Date.now().toString(36);
    const now = new Date().toISOString();
    const fase = this.getFaseById(cardData.faseId);
    const novoCard: CRMCard = {
      id,
      titulo: cardData.titulo.trim(),
      faseId: cardData.faseId,
      responsavelNome: cardData.responsavelNome || 'Rian Mendes',
      responsaveis: cardData.responsaveis || ['Rian Mendes'],
      pontoContato: cardData.pontoContato || '',
      email: cardData.email || '',
      dataAbertura: cardData.dataAbertura || now.split('T')[0],
      dataVencimento: cardData.dataVencimento,
      etiquetas: cardData.etiquetas || ['Morno'],
      valores: cardData.valores || {},
      anexos: cardData.anexos || [],
      historico: [
        { fase: fase?.nome || cardData.faseId, data: now, usuario: 'Usuário Conectado' }
      ],
      criadoEm: now,
      atualizadoEm: now
    };
    this.cards.unshift(novoCard);
    this.persistCards();
    return novoCard;
  }

  public updateCard(id: string, updates: Partial<CRMCard>): CRMCard | undefined {
    const idx = this.cards.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    const now = new Date().toISOString();
    const current = this.cards[idx];
    
    // Se mudou de fase, adiciona ao histórico
    let historico = current.historico || [];
    if (updates.faseId && updates.faseId !== current.faseId) {
      const faseDestino = this.getFaseById(updates.faseId);
      historico = [
        ...historico,
        {
          fase: faseDestino?.nome || updates.faseId,
          data: now,
          usuario: 'Usuário Conectado'
        }
      ];
    }

    this.cards[idx] = {
      ...current,
      ...updates,
      historico,
      atualizadoEm: now
    };
    this.persistCards();
    return this.cards[idx];
  }

  public moveCard(id: string, novaFaseId: string): CRMCard | undefined {
    return this.updateCard(id, { faseId: novaFaseId });
  }

  public deleteCard(id: string): boolean {
    this.cards = this.cards.filter(c => c.id !== id);
    this.persistCards();
    return true;
  }

  // --- Tags / Etiquetas ---
  public getTags(): CRMTag[] {
    return [...this.tags];
  }

  public addTag(nome: string, cor: string, categoria: CRMTag['categoria'] = 'outro'): CRMTag {
    const id = 'tag_' + Date.now().toString(36);
    const newTag: CRMTag = { id, nome, cor, categoria };
    this.tags.push(newTag);
    this.persistTags();
    return newTag;
  }

  // --- IA / Parser de Reunião Inteligente ---
  public parseMeeting(text: string): AIParsedMeeting {
    const lower = text.toLowerCase();
    
    // 1. Tentar encontrar se menciona um parceiro existente
    let parceiroEncontrado: CRMCard | undefined = undefined;
    for (const card of this.cards) {
      if (lower.includes(card.titulo.toLowerCase())) {
        parceiroEncontrado = card;
        break;
      }
    }

    // Se não encontrou, extrair nome provável
    let parceiroNome = parceiroEncontrado ? parceiroEncontrado.titulo : '';
    if (!parceiroNome) {
      const nameMatch = text.match(/(?:reunião com|alinhamento com|parceiro|empresa|cliente|call com)\s+([A-Z][a-zA-Z0-9&_\s]{2,25})/i);
      if (nameMatch && nameMatch[1]) {
        parceiroNome = nameMatch[1].trim();
      } else {
        const firstLine = text.trim().split('\n')[0];
        parceiroNome = firstLine.slice(0, 30).trim();
      }
    }

    // 2. Extrair Temperatura / Persona
    let temperatura: 'Quente' | 'Morno' | 'Frio' = 'Morno';
    if (lower.includes('muito interessado') || lower.includes('quente') || lower.includes('fechar') || lower.includes('adorou') || lower.includes('prioridade alta')) {
      temperatura = 'Quente';
    } else if (lower.includes('desinteresse') || lower.includes('sem budget') || lower.includes('frio') || lower.includes('não vai avançar') || lower.includes('rejeit')) {
      temperatura = 'Frio';
    }

    // 3. Extrair Fase Sugerida
    let faseSugerida = 'rd_realizada';
    if (lower.includes('contrato assinado') || lower.includes('fechou') || lower.includes('parceria fechada') || lower.includes('fechamos')) {
      faseSugerida = 'parceria_fechada';
    } else if (lower.includes('minuta') || lower.includes('em assinatura') || lower.includes('jurídico') || lower.includes('contratos em assinatura')) {
      faseSugerida = 'contratos_assinatura';
    } else if (lower.includes('ap realizada') || lower.includes('apresentação de proposta') || lower.includes('mostramos a proposta') || lower.includes('proposta apresentada')) {
      faseSugerida = 'aps_realizada';
    } else if (lower.includes('rd realizada') || lower.includes('reunião de diagnóstico') || lower.includes('diagnóstico') || lower.includes('dores')) {
      faseSugerida = 'rd_realizada';
    } else if (lower.includes('sem resposta') || lower.includes('sem devolutiva') || lower.includes('retomada')) {
      faseSugerida = 'propostas_sem_retorno';
    } else if (lower.includes('recusada') || lower.includes('recusou') || lower.includes('não aceitou')) {
      faseSugerida = 'proposta_recusada';
    } else if (lower.includes('standby') || lower.includes('geladeira') || lower.includes('congelar') || lower.includes('ano que vem') || lower.includes('segundo semestre')) {
      faseSugerida = 'geladeira';
    } else if (lower.includes('primeiro contato') || lower.includes('iniciar contato')) {
      faseSugerida = 'contato_aberto';
    }

    // 4. Extrair Valores Financeiros
    let valorProposta: number | null = null;
    const valMatch = text.match(/(?:r\$|reais|valor|cota|orçamento)?\s*([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?|[0-9]+)\s*(?:k|mil)?/i);
    const valorExplicitMatch = text.match(/(?:R\$\s*|de\s+)([0-9]+(?:\.[0-9]{3})*(?:,[0-9]{2})?|[0-9]+k?)/i);
    if (valorExplicitMatch && valorExplicitMatch[1]) {
      let rawVal = valorExplicitMatch[1].toLowerCase();
      if (rawVal.endsWith('k')) {
        valorProposta = parseFloat(rawVal.replace('k', '')) * 1000;
      } else {
        valorProposta = parseFloat(rawVal.replace(/\./g, '').replace(',', '.'));
      }
    }

    // 5. Extrair Dores e Observações
    let doresIdentificadas = '';
    const doresMatch = text.match(/(?:dores|necessidades|problema|desafio|busca)\s*:?\s*([^.\n]+(?:\.[^.\n]+)?)/i);
    if (doresMatch && doresMatch[1]) {
      doresIdentificadas = doresMatch[1].trim();
    } else {
      doresIdentificadas = 'Identificado interesse em visibilidade de marca e aproximação com os estudantes das EJs do estado do RJ.';
    }

    // 6. Proposta e Contraproposta
    let formatoProposta = '';
    const propMatch = text.match(/(?:proposta|cota|stand|palestra|visita)\s*:?\s*([^.\n]+)/i);
    if (propMatch && propMatch[1]) {
      formatoProposta = propMatch[1].trim();
    } else {
      formatoProposta = 'Cota de Patrocínio / Apresentação de Pauta Magna nos eventos da RioJunior.';
    }

    // 7. Próximos Passos & Data Follow-Up
    let proximosPassos = '';
    const proxMatch = text.match(/(?:próximo passo|proximos passos|follow-up|fup|encaminhamento|ação)\s*:?\s*([^.\n]+)/i);
    if (proxMatch && proxMatch[1]) {
      proximosPassos = proxMatch[1].trim();
    } else {
      proximosPassos = 'Enviar material institucional e agendar Apresentação de Proposta (AP).';
    }

    return {
      parceiroNome: parceiroNome || 'Novo Parceiro',
      faseSugerida,
      temperatura,
      segmento: lower.includes('consultoria') ? 'Consultoria' : lower.includes('óleo') || lower.includes('gás') || lower.includes('energia') ? 'Petróleo e Gás' : lower.includes('banco') || lower.includes('financeir') ? 'Instituição Financeira' : lower.includes('cosmético') ? 'Cosméticos' : 'Produtos/Serviços',
      origem: lower.includes('linkedin') ? 'LinkedIn' : lower.includes('bj') ? 'Indicação BJ' : lower.includes('pós-júnior') ? 'Indicação Pós-Júnior' : 'Relacionamento do ano anterior',
      doresIdentificadas,
      formatoProposta,
      valorProposta: valorProposta || (faseSugerida === 'parceria_fechada' ? 25000 : 15000),
      contraproposta: lower.includes('contraproposta') ? 'Solicitou detalhamento sobre acesso aos dados dos universitários.' : undefined,
      proximosPassos,
      dataFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      responsavel: 'Rian Mendes',
      observacoes: text.trim(),
      acaoSugerida: parceiroEncontrado ? 'atualizar_existente' : 'criar_novo',
      cardExistenteId: parceiroEncontrado ? parceiroEncontrado.id : undefined
    };
  }

  // Reset para dados iniciais (se necessário)
  public resetToSeed() {
    this.fases = (seedData.fases as unknown) as CRMFase[];
    this.cards = (seedData.cards as unknown) as CRMCard[];
    this.tags = (seedData.etiquetas as unknown) as CRMTag[];
    this.persistFases();
    this.persistCards();
    this.persistTags();
  }
}

export const crmService = new CRMService();
