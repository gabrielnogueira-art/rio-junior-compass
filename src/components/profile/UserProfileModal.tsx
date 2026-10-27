// src/components/profile/UserProfileModal.tsx
// Perfil Individual de Usuário da RioJunior com Sistema de Advertências, Cartões Editáveis e Papéis Mapeados

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Briefcase,
  Mail,
  Calendar,
  IdCard,
  MapPin,
  CheckCircle2,
  XCircle,
  FileText,
  Save,
  Pencil,
  Trash2,
  Plus,
  Info,
  Clock,
  Sparkles,
  ArrowRight,
  Crown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  membrosCartoesService,
  MembroRioJunior,
  CartaoAdvertencia,
  MembroCardStats,
  CardTipo
} from '@/services/membrosCartoesService';
import {
  getGuildaInfo,
  getPapeisByGuilda,
  getObjetivoPapel,
  GUILDAS_INFO,
  GuildaKey
} from '@/data/rolesGuildasData';
import { toast } from '@/hooks/use-toast';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetMemberEmail?: string;
}

const normalizeText = (t: string) =>
  (t || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// Caixas institucionais (e-mails de cargo) -> cargo correspondente no quadro
const INSTITUTIONAL_MAILBOX_ROLES: Record<string, RegExp> = {
  presidencia: /presidente executivo/i
};

// Localiza o membro do usuário: e-mail exato > nome completo único > caixa institucional
function findMemberForUser(membros: MembroRioJunior[], email: string, nome: string): MembroRioJunior | undefined {
  const mail = normalizeText(email);
  if (mail) {
    const byEmail = membros.find(m => normalizeText(m.email) === mail);
    if (byEmail) return byEmail;
  }
  const nameNorm = normalizeText(nome);
  if (nameNorm) {
    const byName = membros.filter(m => normalizeText(m.nome) === nameNorm);
    if (byName.length === 1) return byName[0];
  }
  const local = mail.split('@')[0];
  const rolePattern = INSTITUTIONAL_MAILBOX_ROLES[local];
  if (rolePattern) {
    const byRole = membros.filter(m => rolePattern.test(m.cargo || ''));
    if (byRole.length === 1) return byRole[0];
  }
  return undefined;
}

export function UserProfileModal({ open, onOpenChange, targetMemberEmail }: UserProfileModalProps) {
  const { profile } = useAuth();
  const [membros, setMembros] = useState<MembroRioJunior[]>(membrosCartoesService.getMembros());
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  
  // Edição dos dados cadastrais do membro
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<MembroRioJunior>>({});

  // Gerenciamento e edição de cartões disciplinares
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardForm, setCardForm] = useState({
    tipo: 'amarelo' as CardTipo,
    categoria: 'Falta em Reunião Geral (RV)',
    motivo: '',
    data: new Date().toISOString().split('T')[0],
    observacoes: ''
  });

  // Atualiza lista caso haja alterações no serviço
  useEffect(() => {
    const unsub = membrosCartoesService.subscribe(() => {
      setMembros(membrosCartoesService.getMembros());
    });
    return unsub;
  }, []);

  // Identifica o membro vinculado pelo e-mail
  const loggedEmail = targetMemberEmail || profile?.email || '';
  // Nome do usuário logado só é usado quando o perfil aberto é o dele próprio
  const selfNameHint = !targetMemberEmail || targetMemberEmail === profile?.email ? profile?.nome || '' : '';

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      setIsCardModalOpen(false);
      setEditingCardId(null);
      return;
    }
    const matched = findMemberForUser(membros, loggedEmail, selfNameHint);
    setSelectedMemberId(matched ? matched.id : '');
  }, [open, loggedEmail, selfNameHint, membros]);

  const currentMember = useMemo(() => {
    return membros.find(m => m.id === selectedMemberId);
  }, [membros, selectedMemberId]);

  // Carrega cartões e calcula estatísticas regulamentares
  const memberCards = useMemo(() => {
    if (!currentMember) return [];
    return membrosCartoesService.getCartoesByMembro(currentMember.id);
  }, [currentMember, membros]);

  const stats: MembroCardStats = useMemo(() => {
    return membrosCartoesService.calculateCardStats(memberCards);
  }, [memberCards]);

  const guildaInfo = useMemo(() => {
    return getGuildaInfo(currentMember?.guilda || 'OP');
  }, [currentMember]);

  const objetivoPapel = useMemo(() => {
    if (!currentMember) return '';
    return getObjetivoPapel(currentMember.guilda, currentMember.cargo);
  }, [currentMember]);

  // Prévia do impacto para adição/edição de cartão no perfil
  const cardImpactPreview = useMemo(() => {
    if (!stats) return null;
    if (cardForm.tipo === 'vermelho') {
      const nextV = stats.totalVermelhos + (editingCardId ? 0 : 1);
      return {
        willDismiss: nextV >= 2,
        desc: nextV >= 2
          ? '⚠️ ATENÇÃO: Resultará em 2 cartões vermelhos (DESLIGAMENTO DA RIOJUNIOR)!'
          : 'Membro ficará em Status Crítico (1 Cartão Vermelho).'
      };
    } else {
      if (stats.amarelosCount === 1 && !editingCardId) {
        const nextV = stats.totalVermelhos + 1;
        return {
          willDismiss: nextV >= 2,
          desc: '🔄 2º Amarelo: converte automaticamente em +1 Vermelho.' + (nextV >= 2 ? ' Resultará em DESLIGAMENTO!' : ' Membro entrará em Status Crítico.')
        };
      }
      return {
        willDismiss: false,
        desc: 'Infração Moderada: Cartão Amarelo registrado.'
      };
    }
  }, [stats, cardForm.tipo, editingCardId]);

  // Iniciar edição de dados cadastrais
  const handleStartEdit = () => {
    if (!currentMember) return;
    setEditForm({
      nome: currentMember.nome,
      email: currentMember.email,
      guilda: currentMember.guilda,
      cargo: currentMember.cargo,
      cpf: currentMember.cpf,
      identidade: currentMember.identidade,
      orgaoExpedidor: currentMember.orgaoExpedidor,
      endereco: currentMember.endereco,
      nacionalidade: currentMember.nacionalidade,
      estadoCivil: currentMember.estadoCivil,
      profissao: currentMember.profissao
    });
    setIsEditing(true);
  };

  // Salvar dados cadastrais
  const handleSaveEdit = () => {
    if (!currentMember) return;
    if (!editForm.nome?.trim() || !editForm.email?.trim()) {
      toast({
        title: 'Nome e E-mail são obrigatórios!',
        variant: 'destructive'
      });
      return;
    }

    const updated: MembroRioJunior = {
      ...currentMember,
      ...editForm,
      nome: editForm.nome.trim(),
      email: editForm.email.trim().toLowerCase(),
      guilda: editForm.guilda || currentMember.guilda,
      cargo: editForm.cargo || currentMember.cargo
    };

    membrosCartoesService.saveMembro(updated);
    setIsEditing(false);
    toast({
      title: 'Perfil atualizado com sucesso!',
      description: 'As alterações cadastrais foram salvas.'
    });
  };

  // Abrir modal para adicionar cartão a esta pessoa
  const handleOpenAddCard = () => {
    if (!currentMember) return;
    setEditingCardId(null);
    setCardForm({
      tipo: 'amarelo',
      categoria: 'Falta em Reunião Geral (RV)',
      motivo: '',
      data: new Date().toISOString().split('T')[0],
      observacoes: ''
    });
    setIsCardModalOpen(true);
  };

  // Abrir modal para editar cartão existente desta pessoa
  const handleOpenEditCard = (card: CartaoAdvertencia) => {
    setEditingCardId(card.id);
    setCardForm({
      tipo: card.tipo,
      categoria: card.categoria,
      motivo: card.motivo,
      data: card.data,
      observacoes: card.observacoes || ''
    });
    setIsCardModalOpen(true);
  };

  // Excluir / Revogar cartão disciplinar
  const handleDeleteCard = (cardId: string) => {
    const card = membrosCartoesService.getCartaoById(cardId);
    const desc = card ? `"${card.motivo}"` : 'este cartão';
    if (confirm(`Deseja realmente revogar/excluir ${desc}?`)) {
      membrosCartoesService.deleteCartao(cardId);
      toast({
        title: 'Cartão revogado com sucesso!',
        description: 'O registro foi removido e os indicadores foram recalculados.'
      });
    }
  };

  // Submeter adição ou edição de cartão
  const handleSaveCardSubmit = () => {
    if (!currentMember) return;
    if (!cardForm.motivo.trim()) {
      toast({
        title: 'Preencha o motivo circunstanciado da infração!',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingCardId) {
        const existing = membrosCartoesService.getCartaoById(editingCardId);
        if (existing) {
          membrosCartoesService.updateCartao({
            ...existing,
            membroId: currentMember.id,
            membroNome: currentMember.nome,
            membroEmail: currentMember.email,
            tipo: cardForm.tipo,
            categoria: cardForm.categoria,
            motivo: cardForm.motivo.trim(),
            data: cardForm.data,
            observacoes: cardForm.observacoes.trim() || undefined
          });
          toast({
            title: 'Cartão atualizado com sucesso!',
            description: 'Os detalhes do cartão foram salvos e o status recalculado.'
          });
        }
      } else {
        membrosCartoesService.aplicarCartao({
          membroId: currentMember.id,
          tipo: cardForm.tipo,
          categoria: cardForm.categoria,
          motivo: cardForm.motivo.trim(),
          data: cardForm.data,
          observacoes: cardForm.observacoes.trim() || undefined,
          aplicadoPor: 'Guilda de Operações (OP)'
        });
        toast({
          title: `Cartão ${cardForm.tipo === 'vermelho' ? 'Vermelho' : 'Amarelo'} aplicado!`,
          description: `A advertência foi atribuída a ${currentMember.nome}.`
        });
      }

      setIsCardModalOpen(false);
      setEditingCardId(null);
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar cartão',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  if (!currentMember) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Perfil não encontrado</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Não localizamos você no quadro de membros da RioJunior
            {loggedEmail ? ` (e-mail: ${loggedEmail})` : ''}. Peça à Guilda de Operações para vincular
            o seu e-mail ao seu cadastro.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  const isDiretoria =
    currentMember.cargo.toLowerCase().includes('diretor') ||
    currentMember.cargo.toLowerCase().includes('presidente');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0">
        {/* ========================================================
            HEADER DO PERFIL
            ======================================================== */}
        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10 p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                {currentMember.nome.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-black text-foreground">{currentMember.nome}</h3>
                  {isDiretoria && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] gap-1 shadow-xs">
                      👑 Diretoria Executiva
                    </Badge>
                  )}
                  {currentMember.vinculoFrente === 'time' && (
                    <Badge variant="secondary" className="font-bold text-[10px]">
                      {/efej/i.test(currentMember.cargo) ? 'Time EFEJ' : 'Time da Frente'}
                    </Badge>
                  )}
                  {currentMember.desligamentoManual ? (
                    <Badge
                      variant="destructive"
                      className="font-bold text-[10px]"
                      title={currentMember.desligamentoManual.motivo}
                    >
                      Desligado em {currentMember.desligamentoManual.data}
                    </Badge>
                  ) : stats.isDesligamento ? (
                    <Badge variant="destructive" className="font-bold text-[10px] animate-pulse">
                      Desligamento Formal (2 Vermelhos)
                    </Badge>
                  ) : stats.totalVermelhos === 1 ? (
                    <Badge className="bg-rose-500 text-white font-bold text-[10px]">
                      Status Crítico (1 Vermelho)
                    </Badge>
                  ) : stats.amarelosCount > 0 ? (
                    <Badge className="bg-amber-400 text-slate-950 font-bold text-[10px]">
                      Status Atenção ({stats.amarelosCount} Amarelo)
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-bold">
                      Conforme
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail size={12} /> {currentMember.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Building2 size={12} className="text-primary" /> {guildaInfo.nome} ({currentMember.guilda})
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            CORPO DO MODAL: SISTEMA DISCIPLINAR + DADOS
            ======================================================== */}
        <div className="p-6 space-y-6">
          {/* PAINEL DISCIPLINAR DA PESSOA (SISTEMA DE CARTÕES) */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/20 p-4 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-amber-500" />
                <h4 className="text-sm font-bold text-foreground">
                  Prontuário Disciplinar & Sistema de Advertências
                </h4>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono self-start sm:self-auto">
                Estatuto e Regimento RioJunior
              </Badge>
            </div>

            {/* Cards dos Contadores */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Cartões Amarelos */}
              <div className="p-3 rounded-xl border border-amber-300/50 bg-amber-500/10 text-center space-y-1">
                <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider block">
                  Cartões Amarelos
                </span>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5">
                  <div className="w-3.5 h-5 bg-amber-400 rounded-xs shadow-xs" />
                  <span>{stats.amarelosCount}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Infração Moderada
                </p>
              </div>

              {/* Cartões Vermelhos Totais */}
              <div className="p-3 rounded-xl border border-rose-300/50 bg-rose-500/10 text-center space-y-1">
                <span className="text-[10px] text-rose-800 dark:text-rose-300 font-bold uppercase tracking-wider block">
                  Cartões Vermelhos
                </span>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5">
                  <div className="w-3.5 h-5 bg-rose-500 rounded-xs shadow-xs" />
                  <span>{stats.totalVermelhos}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {stats.vermelhosConvertidos > 0
                    ? `(${stats.vermelhosDiretosCount} direto + ${stats.vermelhosConvertidos} por 2 amarelos)`
                    : 'Infração Grave'}
                </p>
              </div>

              {/* Medidor de Limite para Desligamento */}
              <div className="sm:col-span-2 rounded-xl border border-border bg-card p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-foreground">Escala para Desligamento</span>
                    <span className={stats.totalVermelhos >= 2 ? 'text-destructive font-bold' : 'text-muted-foreground'}>
                      {stats.totalVermelhos} / 2 Vermelhos
                    </span>
                  </div>
                  {/* Barra de Progresso Customizada */}
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex gap-1 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stats.totalVermelhos >= 1 ? 'bg-rose-500 flex-1' : 'bg-transparent flex-1'
                      }`}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stats.totalVermelhos >= 2 ? 'bg-destructive flex-1' : 'bg-transparent flex-1'
                      }`}
                    />
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                  <strong>Regra RioJunior:</strong> 2 amarelos = 1 vermelho. 2 vermelhos = <strong>desligamento formal</strong>.
                </div>
              </div>
            </div>

            {/* Histórico Detalhado dos Cartões Desta Pessoa com Ações */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Histórico de Aplicações ({memberCards.length})
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1 border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                  onClick={handleOpenAddCard}
                >
                  <Plus size={12} />
                  <span>Adicionar Cartão</span>
                </Button>
              </div>

              {memberCards.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground bg-muted/20">
                  <CheckCircle2 size={24} className="mx-auto mb-1.5 text-emerald-500 opacity-60" />
                  Nenhum cartão disciplinar registrado para este membro. Excelente conduta!
                </div>
              ) : (
                <div className="space-y-2">
                  {memberCards.map(c => (
                    <div
                      key={c.id}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs ${
                        c.tipo === 'vermelho'
                          ? 'bg-rose-500/5 border-rose-300 dark:border-rose-900/50'
                          : 'bg-amber-500/5 border-amber-300 dark:border-amber-900/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-3.5 h-5 rounded-xs shrink-0 mt-0.5 shadow-xs ${
                            c.tipo === 'vermelho' ? 'bg-rose-500' : 'bg-amber-400'
                          }`}
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-foreground">
                              {c.tipo === 'vermelho' ? 'Cartão Vermelho (Grave)' : 'Cartão Amarelo (Moderada)'}
                            </span>
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                              {c.categoria}
                            </Badge>
                          </div>
                          <p className="text-foreground/90 font-medium">{c.motivo}</p>
                          {c.observacoes && (
                            <p className="text-muted-foreground text-[11px] italic">
                              Obs: {c.observacoes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                        <div className="text-muted-foreground text-[11px] text-right">
                          <div>📅 {c.data}</div>
                          <div className="text-primary font-medium">{c.aplicadoPor}</div>
                        </div>

                        {/* Botões de Ação para o Cartão */}
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            onClick={() => handleOpenEditCard(c)}
                            title="Editar detalhes do cartão"
                          >
                            <Pencil size={13} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteCard(c.id)}
                            title="Remover / Excluir cartão"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Abas de Dados da Guilda, Papel e Informações Cadastrais */}
          <Tabs defaultValue="papel" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="papel" className="gap-2 text-xs">
                <Briefcase size={14} />
                <span>Guilda & Frente de Atuação</span>
              </TabsTrigger>
              <TabsTrigger value="cadastro" className="gap-2 text-xs">
                <IdCard size={14} />
                <span>Dados Cadastrais & Contato</span>
              </TabsTrigger>
            </TabsList>

            {/* ABA 1: Guilda e Cargo / Papel */}
            <TabsContent value="papel" className="space-y-4 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guilda */}
                <div className="rounded-xl border border-border p-4 bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground uppercase font-bold">Guilda (Diretoria)</Label>
                    <Badge variant="outline" className="font-bold text-primary">
                      {guildaInfo.sigla}
                    </Badge>
                  </div>
                  <h4 className="text-base font-bold text-foreground">{guildaInfo.nome}</h4>
                  <p className="text-xs text-muted-foreground">{guildaInfo.descricao}</p>
                </div>

                {/* Cargo / Frente */}
                <div className="rounded-xl border border-border p-4 bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground uppercase font-bold">Cargo / Frente Mapeada</Label>
                    {isDiretoria ? (
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px]">
                        👑 Diretoria
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Mapeamento 2027
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-foreground flex items-center gap-1.5">
                    {isDiretoria && <Crown size={14} className="text-amber-500 shrink-0" />}
                    <span>{currentMember.cargo}</span>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Atuação estratégica alinhada ao organograma oficial da Federação.
                  </p>
                </div>
              </div>

              {/* Objetivo do Papel Oficial */}
              {objetivoPapel && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1.5">
                  <h5 className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Sparkles size={14} />
                    Objetivo do Papel (Mapeamento Oficial de Papéis RioJunior 2027):
                  </h5>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    "{objetivoPapel}"
                  </p>
                </div>
              )}
            </TabsContent>

            {/* ABA 2: Dados Cadastrais Editáveis */}
            <TabsContent value="cadastro" className="space-y-4 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Informações sincronizadas com a planilha oficial <strong>[RIOJUNIOR] Dados de Membros 2026</strong>.
                </span>
                {!isEditing ? (
                  <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={handleStartEdit}>
                    <Pencil size={12} /> Editar Dados
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-xs" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button size="sm" className="text-xs gap-1.5" onClick={handleSaveEdit}>
                      <Save size={12} /> Salvar
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <Label className="text-xs">Nome Completo</Label>
                    <Input
                      value={editForm.nome || ''}
                      onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">E-mail Institucional</Label>
                    <Input
                      value={editForm.email || ''}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Guilda (Diretoria)</Label>
                    <Select
                      value={editForm.guilda}
                      onValueChange={(val: GuildaKey) => {
                        const papeis = getPapeisByGuilda(val);
                        setEditForm({
                          ...editForm,
                          guilda: val,
                          cargo: papeis[0]?.nome || editForm.cargo
                        });
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(GUILDAS_INFO).map(g => (
                          <SelectItem key={g} value={g} className="text-xs">
                            {GUILDAS_INFO[g as GuildaKey].nome} ({g})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Cargo / Papel</Label>
                    <Select
                      value={editForm.cargo}
                      onValueChange={val => setEditForm({ ...editForm, cargo: val })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {getPapeisByGuilda(editForm.guilda || currentMember.guilda).map(p => (
                          <SelectItem key={p.nome} value={p.nome} className="text-xs">
                            {p.isDiretoria ? `👑 ${p.nome} (Diretoria)` : p.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">CPF</Label>
                    <Input
                      value={editForm.cpf || ''}
                      onChange={e => setEditForm({ ...editForm, cpf: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Identidade / Órgão</Label>
                    <div className="flex gap-2">
                      <Input
                        value={editForm.identidade || ''}
                        onChange={e => setEditForm({ ...editForm, identidade: e.target.value })}
                        className="h-8 text-xs flex-1"
                        placeholder="Número"
                      />
                      <Input
                        value={editForm.orgaoExpedidor || ''}
                        onChange={e => setEditForm({ ...editForm, orgaoExpedidor: e.target.value })}
                        className="h-8 text-xs w-28"
                        placeholder="Órgão"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs">Endereço Residencial</Label>
                    <Input
                      value={editForm.endereco || ''}
                      onChange={e => setEditForm({ ...editForm, endereco: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">CPF</span>
                    <span className="font-semibold text-foreground">{currentMember.cpf || 'Não informado'}</span>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Identidade / Órgão</span>
                    <span className="font-semibold text-foreground">
                      {currentMember.identidade || 'Não informada'} ({currentMember.orgaoExpedidor || 'DETRAN-RJ'})
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Profissão / Estado Civil</span>
                    <span className="font-semibold text-foreground capitalize">
                      {currentMember.profissao || 'Estudante'} • {currentMember.estadoCivil || 'Solteiro'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Data de Entrada</span>
                    <span className="font-semibold text-foreground">{currentMember.dataEntrada}</span>
                  </div>
                  <div className="sm:col-span-2 p-3 rounded-lg border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Endereço</span>
                    <span className="font-semibold text-foreground">{currentMember.endereco || 'Não informado'}</span>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="p-4 border-t border-border bg-muted/10 flex justify-between sm:justify-between items-center">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Info size={13} className="text-primary" />
            <span>Perfil sincronizado por e-mail com a base de Membros da RioJunior.</span>
          </div>
          <Button variant="default" size="sm" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* ========================================================
          SUB-MODAL: ADIÇÃO OU EDIÇÃO DE CARTÃO NO PERFIL
          ======================================================== */}
      <Dialog open={isCardModalOpen} onOpenChange={setIsCardModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert size={18} className={cardForm.tipo === 'vermelho' ? 'text-rose-500' : 'text-amber-500'} />
              {editingCardId ? 'Editar Detalhes do Cartão' : `Aplicar Cartão a ${currentMember.nome}`}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              {editingCardId
                ? 'Modifique o motivo circunstanciado, data, categoria ou gravidade.'
                : 'Lançamento com efeito direto no prontuário disciplinar do membro.'}
            </p>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {/* Tipo do Cartão */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Tipo de Cartão</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCardForm({ ...cardForm, tipo: 'amarelo' })}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    cardForm.tipo === 'amarelo'
                      ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/20'
                      : 'border-border bg-card opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2.5 h-3.5 bg-amber-400 rounded-xs shadow-xs" />
                    <span className="font-bold text-foreground text-xs">Amarelo</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Moderada</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCardForm({ ...cardForm, tipo: 'vermelho' })}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    cardForm.tipo === 'vermelho'
                      ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/20'
                      : 'border-border bg-card opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2.5 h-3.5 bg-rose-500 rounded-xs shadow-xs" />
                    <span className="font-bold text-foreground text-xs">Vermelho</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Grave</span>
                </button>
              </div>
            </div>

            {/* Categoria */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Categoria da Ocorrência</Label>
              <Select
                value={cardForm.categoria}
                onValueChange={val => setCardForm({ ...cardForm, categoria: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Falta em Reunião Geral (RV)" className="text-xs">Falta em Reunião Geral (RV)</SelectItem>
                  <SelectItem value="Descumprimento de SLA / Entrega" className="text-xs">Descumprimento de SLA / Entrega</SelectItem>
                  <SelectItem value="Comportamental / Clima" className="text-xs">Comportamental / Clima</SelectItem>
                  <SelectItem value="Violação Estatutária" className="text-xs">Violação Estatutária</SelectItem>
                  <SelectItem value="Quebra de Confidencialidade" className="text-xs">Quebra de Confidencialidade</SelectItem>
                  <SelectItem value="Ausência em Evento Obrigatório" className="text-xs">Ausência em Evento Obrigatório</SelectItem>
                  <SelectItem value="Outros" className="text-xs">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Motivo Circunstanciado */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Motivo Circunstanciado</Label>
              <Input
                placeholder="Descreva o motivo detalhado da infração..."
                value={cardForm.motivo}
                onChange={e => setCardForm({ ...cardForm, motivo: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            {/* Data */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Data da Ocorrência</Label>
              <Input
                type="date"
                value={cardForm.data}
                onChange={e => setCardForm({ ...cardForm, data: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            {/* Observações */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Observações (Opcional)</Label>
              <Input
                placeholder="Observações complementares..."
                value={cardForm.observacoes}
                onChange={e => setCardForm({ ...cardForm, observacoes: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            {/* Impacto */}
            {cardImpactPreview && (
              <div className={`p-2.5 rounded-lg border text-xs ${
                cardImpactPreview.willDismiss
                  ? 'border-rose-300 bg-rose-500/10 text-rose-800 dark:text-rose-300'
                  : 'border-amber-300 bg-amber-500/10 text-amber-900 dark:text-amber-200'
              }`}>
                <div className="font-bold flex items-center gap-1 mb-0.5">
                  <AlertTriangle size={13} />
                  Impacto Disciplinar:
                </div>
                <p>{cardImpactPreview.desc}</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsCardModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSaveCardSubmit}
              className={cardForm.tipo === 'vermelho' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'}
            >
              {editingCardId ? 'Salvar Alterações' : 'Aplicar Cartão'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
