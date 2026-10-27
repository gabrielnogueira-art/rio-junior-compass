// src/components/operations/CartoesMembrosTab.tsx
// Aba Oficial de Aplicação de Cartões, Gestão de Membros e Frentes da Guilda de Operações (OP)
// Baseada em [RIOJUNIOR] Dados de Membros 2026.xlsx e [RioJunior] Mapeamento de Papéis 2027.xlsx

import { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  User,
  Mail,
  Building2,
  Briefcase,
  IdCard,
  Sparkles,
  Info,
  Calendar,
  RefreshCw,
  FileSpreadsheet,
  Eye,
  Flame,
  ArrowRight,
  FolderTree,
  Crown,
  ShieldCheck,
  Award,
  X,
  UserX,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  membrosCartoesService,
  MembroRioJunior,
  CartaoAdvertencia,
  CardTipo
} from '@/services/membrosCartoesService';
import {
  GUILDAS_INFO,
  GuildaKey,
  getPapeisByGuilda,
  getGuildaInfo,
  PapelRioJunior
} from '@/data/rolesGuildasData';
import { frentesService } from '@/services/frentesService';
import { UserProfileModal } from '@/components/profile/UserProfileModal';
import { toast } from '@/hooks/use-toast';

// Frentes com time de assessores (ex.: coordenadorias do EFEJ -> Time EFEJ)
const papelTemTime = (p: PapelRioJunior): boolean =>
  p.temTime ?? (/coordenadoria/i.test(p.nome) && /efej/i.test(p.nome));

const labelTimeDaFrente = (p: PapelRioJunior): string => (/efej/i.test(p.nome) ? 'Time EFEJ' : 'Time da Frente');

export default function CartoesMembrosTab() {
  const [membros, setMembros] = useState<MembroRioJunior[]>(membrosCartoesService.getMembros());
  const [cartoes, setCartoes] = useState<CartaoAdvertencia[]>(membrosCartoesService.getCartoes());

  // Filtros da Tabela de Membros
  const [searchQuery, setSearchQuery] = useState('');
  const [guildaFilter, setGuildaFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtros da Aba de Frentes
  const [selectedFrenteGuilda, setSelectedFrenteGuilda] = useState<string>('all');
  const [frentesSearch, setFrentesSearch] = useState<string>('');

  // Modais de Controle
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedTargetEmail, setSelectedTargetEmail] = useState<string>('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [frentesVersion, setFrentesVersion] = useState(0);

  // Modal de Edição / Criação de Frente & Papel
  const [isFrenteModalOpen, setIsFrenteModalOpen] = useState(false);
  const [isEditingFrente, setIsEditingFrente] = useState(false);
  const [originalFrenteNome, setOriginalFrenteNome] = useState('');
  const [originalFrenteGuilda, setOriginalFrenteGuilda] = useState<GuildaKey>('OP');
  const [memberSearchInModal, setMemberSearchInModal] = useState('');
  const [frenteForm, setFrenteForm] = useState<{
    guilda: GuildaKey;
    nome: string;
    objetivo: string;
    isDiretoria: boolean;
    temTime: boolean;
    indicadores: string;
    modeloTrabalho: string;
    statusFrente: 'ativa' | 'em_estruturacao' | 'pausada';
    assignedMemberIds: string[];
    timeMemberIds: string[];
  }>({
    guilda: 'OP',
    nome: '',
    objetivo: '',
    isDiretoria: false,
    temTime: false,
    indicadores: '',
    modeloTrabalho: '',
    statusFrente: 'ativa',
    assignedMemberIds: [],
    timeMemberIds: []
  });

  // Desligamento por motivo específico (sem cartão)
  const [isDesligarModalOpen, setIsDesligarModalOpen] = useState(false);
  const [desligarTarget, setDesligarTarget] = useState<MembroRioJunior | null>(null);
  const [desligarForm, setDesligarForm] = useState({
    motivo: '',
    data: new Date().toISOString().split('T')[0]
  });

  // Formulário de Aplicação / Edição de Cartão
  const [applyForm, setApplyForm] = useState({
    membroId: '',
    tipo: 'amarelo' as CardTipo,
    categoria: 'Falta em Reunião Geral (RV)',
    motivo: '',
    observacoes: '',
    data: new Date().toISOString().split('T')[0]
  });

  // Formulário de Cadastro / Edição de Membro
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [memberForm, setMemberForm] = useState<Partial<MembroRioJunior>>({
    guilda: 'OP',
    cargo: 'Gestão de Processos',
    status: 'ativo'
  });

  // Sincroniza estado com o serviço
  useEffect(() => {
    const unsubMembros = membrosCartoesService.subscribe(() => {
      setMembros(membrosCartoesService.getMembros());
      setCartoes(membrosCartoesService.getCartoes());
    });
    const unsubFrentes = frentesService.subscribe(() => {
      setFrentesVersion(v => v + 1);
      setMembros(membrosCartoesService.getMembros());
    });
    return () => {
      unsubMembros();
      unsubFrentes();
    };
  }, []);

  // Membros filtrados
  const filteredMembros = useMemo(() => {
    return membros.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.nome.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.cargo.toLowerCase().includes(q) ||
        m.guilda.toLowerCase().includes(q);

      const matchGuilda = guildaFilter === 'all' || m.guilda === guildaFilter;
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchSearch && matchGuilda && matchStatus;
    });
  }, [membros, searchQuery, guildaFilter, statusFilter]);

  // Lista de Frentes compiladas com membros alocados
  const frentesList = useMemo(() => {
    const guildasToInspect: GuildaKey[] =
      selectedFrenteGuilda === 'all'
        ? (['PRESEX', 'VPNEG', 'DDR', 'FE', 'OP', 'PRESCON'] as GuildaKey[])
        : ([selectedFrenteGuilda as GuildaKey]);

    const result: Array<{
      guilda: GuildaKey;
      guildaInfo: ReturnType<typeof getGuildaInfo>;
      papel: ReturnType<typeof getPapeisByGuilda>[number];
      assignedMembers: MembroRioJunior[];
    }> = [];

    guildasToInspect.forEach(gKey => {
      const papeis = getPapeisByGuilda(gKey);
      const gInfo = getGuildaInfo(gKey);
      papeis.forEach(papel => {
        const q = frentesSearch.toLowerCase().trim();
        const matchesSearch =
          !q ||
          papel.nome.toLowerCase().includes(q) ||
          papel.objetivo.toLowerCase().includes(q) ||
          gKey.toLowerCase().includes(q) ||
          gInfo.nome.toLowerCase().includes(q);

        if (matchesSearch) {
          const assigned = membros.filter(m => {
            if (m.guilda !== gKey) return false;
            const mCargo = (m.cargo || '').toLowerCase().trim();
            const pNome = papel.nome.toLowerCase().trim();
            if (mCargo === pNome) return true;
            if (pNome.includes('relações públicas') && (mCargo.includes('relações públicas') || mCargo === 'rp' || mCargo.includes('rp ('))) {
              return true;
            }
            return false;
          });
          result.push({
            guilda: gKey,
            guildaInfo: gInfo,
            papel,
            assignedMembers: assigned
          });
        }
      });
    });

    return result;
  }, [selectedFrenteGuilda, frentesSearch, membros, frentesVersion]);

  // Estatísticas gerais
  const summaryStats = useMemo(() => {
    let conformes = 0;
    let atencao = 0;
    let critico = 0;
    let desligados = 0;
    let totalAmarelos = 0;
    let totalVermelhos = 0;

    membros.forEach(m => {
      const mCards = cartoes.filter(c => c.membroId === m.id);
      const st = membrosCartoesService.calculateCardStats(mCards);
      totalAmarelos += st.amarelosCount;
      totalVermelhos += st.totalVermelhos;

      if (m.desligamentoManual || st.isDesligamento) desligados++;
      else if (st.totalVermelhos === 1) critico++;
      else if (st.amarelosCount > 0) atencao++;
      else conformes++;
    });

    return {
      totalMembros: membros.length,
      conformes,
      atencao,
      critico,
      desligados,
      totalAmarelos,
      totalVermelhos,
      totalCartoesRegistrados: cartoes.length
    };
  }, [membros, cartoes]);

  // Membro selecionado no form de aplicação
  const penalizedMember = useMemo(() => {
    return membros.find(m => m.id === applyForm.membroId);
  }, [membros, applyForm.membroId]);

  const penalizedCurrentStats = useMemo(() => {
    if (!penalizedMember) return null;
    const cards = cartoes.filter(c => c.membroId === penalizedMember.id);
    return membrosCartoesService.calculateCardStats(cards);
  }, [penalizedMember, cartoes]);

  // Pré-visualização do impacto do novo cartão
  const impactPreview = useMemo(() => {
    if (!penalizedCurrentStats) return null;
    const currentA = penalizedCurrentStats.amarelosCount;
    const currentV = penalizedCurrentStats.totalVermelhos;

    if (applyForm.tipo === 'vermelho') {
      const nextV = currentV + 1;
      return {
        nextV,
        nextA: currentA,
        willDismiss: nextV >= 2,
        desc: nextV >= 2 ? '⚠️ ATENÇÃO: Atingirá 2 cartões vermelhos (DESLIGAMENTO DA RIOJUNIOR)!' : 'Ficará com 1 Cartão Vermelho (Status Crítico).'
      };
    } else {
      if (currentA === 1) {
        const nextV = currentV + 1;
        return {
          nextV,
          nextA: 0,
          willDismiss: nextV >= 2,
          desc: '🔄 2º Cartão Amarelo! Converte automaticamente em +1 CARTÃO VERMELHO.' + (nextV >= 2 ? ' Resultará em DESLIGAMENTO!' : ' Membro entrará em status Crítico.')
        };
      } else {
        return {
          nextV: currentV,
          nextA: currentA + 1,
          willDismiss: false,
          desc: '1º Cartão Amarelo (Infração moderada - Status Atenção).'
        };
      }
    }
  }, [penalizedCurrentStats, applyForm.tipo]);

  // Abrir modal de aplicação para novo cartão
  const handleOpenApplyModal = (membroId?: string) => {
    setEditingCardId(null);
    setApplyForm({
      membroId: membroId || membros[0]?.id || '',
      tipo: 'amarelo',
      categoria: 'Falta em Reunião Geral (RV)',
      motivo: '',
      observacoes: '',
      data: new Date().toISOString().split('T')[0]
    });
    setIsApplyModalOpen(true);
  };

  // Abrir modal para edição de cartão existente
  const handleOpenEditCard = (card: CartaoAdvertencia) => {
    setEditingCardId(card.id);
    setApplyForm({
      membroId: card.membroId,
      tipo: card.tipo,
      categoria: card.categoria,
      motivo: card.motivo,
      observacoes: card.observacoes || '',
      data: card.data
    });
    setIsApplyModalOpen(true);
  };

  // Submeter aplicação ou edição de cartão
  const handleApplyCardSubmit = () => {
    if (!applyForm.membroId) {
      toast({ title: 'Selecione um membro!', variant: 'destructive' });
      return;
    }
    if (!applyForm.motivo.trim()) {
      toast({ title: 'Descreva o motivo circunstanciado da infração!', variant: 'destructive' });
      return;
    }

    try {
      if (editingCardId) {
        const existing = membrosCartoesService.getCartaoById(editingCardId);
        if (existing) {
          membrosCartoesService.updateCartao({
            ...existing,
            membroId: applyForm.membroId,
            tipo: applyForm.tipo,
            categoria: applyForm.categoria,
            motivo: applyForm.motivo.trim(),
            data: applyForm.data,
            observacoes: applyForm.observacoes.trim() || undefined
          });
          toast({
            title: 'Cartão atualizado com sucesso!',
            description: 'Os dados do cartão foram alterados e o status disciplinar recalculado.'
          });
        }
      } else {
        membrosCartoesService.aplicarCartao({
          membroId: applyForm.membroId,
          tipo: applyForm.tipo,
          categoria: applyForm.categoria,
          motivo: applyForm.motivo.trim(),
          data: applyForm.data,
          observacoes: applyForm.observacoes.trim() || undefined,
          aplicadoPor: 'Guilda de Operações (OP)'
        });
        toast({
          title: `Cartão ${applyForm.tipo === 'vermelho' ? 'Vermelho' : 'Amarelo'} aplicado!`,
          description: 'A infração foi registrada e calculada com base no regimento da RioJunior.'
        });
      }

      setIsApplyModalOpen(false);
      setEditingCardId(null);
    } catch (err: any) {
      toast({ title: 'Erro ao salvar cartão', description: err.message, variant: 'destructive' });
    }
  };

  // Revogar/Excluir cartão existente
  const handleRevokeCard = (id: string) => {
    const card = membrosCartoesService.getCartaoById(id);
    const desc = card ? `cartão de ${card.membroNome} ("${card.motivo}")` : 'este registro de cartão';
    if (confirm(`Deseja realmente revogar/excluir ${desc}?`)) {
      membrosCartoesService.deleteCartao(id);
      toast({
        title: 'Cartão revogado com sucesso!',
        description: 'O registro foi removido e os indicadores disciplinares foram recalculados.'
      });
    }
  };

  // Abrir edição de membro
  const handleOpenEditMember = (m: MembroRioJunior) => {
    setMemberForm(m);
    setIsEditingMember(true);
    setIsMemberModalOpen(true);
  };

  // Abrir cadastro de novo membro (opcionalmente com guilda e cargo pré-selecionados)
  const handleOpenNewMember = (preGuilda?: GuildaKey, preCargo?: string) => {
    const guilda = preGuilda || 'OP';
    const papeis = getPapeisByGuilda(guilda);
    const cargo = preCargo || papeis[0]?.nome || 'Gestão de Processos';

    setMemberForm({
      nome: '',
      email: '',
      guilda,
      cargo,
      cpf: '',
      identidade: '',
      orgaoExpedidor: 'DETRAN-RJ',
      endereco: '',
      nacionalidade: 'brasileira',
      estadoCivil: 'solteiro',
      profissao: 'estudante',
      status: 'ativo'
    });
    setIsEditingMember(false);
    setIsMemberModalOpen(true);
  };

  // Salvar membro (criação ou edição)
  const handleSaveMember = () => {
    if (!memberForm.nome?.trim() || !memberForm.email?.trim()) {
      toast({ title: 'Preencha Nome e E-mail!', variant: 'destructive' });
      return;
    }

    if (isEditingMember && memberForm.id) {
      membrosCartoesService.saveMembro(memberForm as MembroRioJunior);
      toast({ title: 'Membro atualizado com sucesso!' });
    } else {
      const newMembro: MembroRioJunior = {
        id: 'mem_' + Date.now().toString(36),
        nome: memberForm.nome!.trim(),
        email: memberForm.email!.trim().toLowerCase(),
        cpf: memberForm.cpf || '',
        identidade: memberForm.identidade || '',
        orgaoExpedidor: memberForm.orgaoExpedidor || 'DETRAN-RJ',
        endereco: memberForm.endereco || '',
        nacionalidade: memberForm.nacionalidade || 'brasileira',
        estadoCivil: memberForm.estadoCivil || 'solteiro',
        profissao: memberForm.profissao || 'estudante',
        dataEntrada: new Date().toISOString().split('T')[0],
        guilda: memberForm.guilda || 'OP',
        cargo: memberForm.cargo || 'Gestão de Processos',
        status: 'ativo'
      };
      membrosCartoesService.saveMembro(newMembro);
      toast({ title: 'Membro cadastrado com sucesso!' });
    }
    setIsMemberModalOpen(false);
  };

  // Excluir membro
  const handleDeleteMember = (id: string, nome: string) => {
    if (confirm(`Deseja realmente remover o membro "${nome}" da base de membros da RioJunior?`)) {
      membrosCartoesService.deleteMembro(id);
      toast({ title: 'Membro excluído com sucesso.' });
    }
  };

  // ========================================================
  // EDIÇÃO DINÂMICA DE FRENTES & PAPÉIS (ADMs)
  // ========================================================

  const handleOpenNewFrente = (defaultGuilda?: GuildaKey) => {
    const targetGuilda =
      defaultGuilda || (selectedFrenteGuilda !== 'all' ? (selectedFrenteGuilda as GuildaKey) : 'OP');
    setIsEditingFrente(false);
    setOriginalFrenteNome('');
    setOriginalFrenteGuilda(targetGuilda);
    setMemberSearchInModal('');
    setFrenteForm({
      guilda: targetGuilda,
      nome: '',
      objetivo: '',
      isDiretoria: false,
      temTime: false,
      indicadores: '',
      modeloTrabalho: '',
      statusFrente: 'ativa',
      assignedMemberIds: [],
      timeMemberIds: []
    });
    setIsFrenteModalOpen(true);
  };

  const handleOpenEditFrente = (guilda: GuildaKey, papel: PapelRioJunior, currentAssigned: MembroRioJunior[]) => {
    setIsEditingFrente(true);
    setOriginalFrenteNome(papel.nome);
    setOriginalFrenteGuilda(guilda);
    setMemberSearchInModal('');
    setFrenteForm({
      guilda,
      nome: papel.nome,
      objetivo: papel.objetivo || '',
      isDiretoria: !!papel.isDiretoria,
      temTime: papelTemTime(papel),
      indicadores: papel.indicadores || '',
      modeloTrabalho: papel.modeloTrabalho || '',
      statusFrente: papel.statusFrente || 'ativa',
      assignedMemberIds: currentAssigned.map(m => m.id),
      timeMemberIds: currentAssigned.filter(m => m.vinculoFrente === 'time').map(m => m.id)
    });
    setIsFrenteModalOpen(true);
  };

  const handleToggleMemberAssignment = (membroId: string) => {
    setFrenteForm(prev => {
      const exists = prev.assignedMemberIds.includes(membroId);
      return {
        ...prev,
        assignedMemberIds: exists
          ? prev.assignedMemberIds.filter(id => id !== membroId)
          : [...prev.assignedMemberIds, membroId],
        timeMemberIds: exists ? prev.timeMemberIds.filter(id => id !== membroId) : prev.timeMemberIds
      };
    });
  };

  const handleSetMemberVinculo = (membroId: string, vinculo: 'responsavel' | 'time') => {
    setFrenteForm(prev => ({
      ...prev,
      timeMemberIds:
        vinculo === 'time'
          ? Array.from(new Set([...prev.timeMemberIds, membroId]))
          : prev.timeMemberIds.filter(id => id !== membroId)
    }));
  };

  const handleSaveFrenteSubmit = () => {
    if (!frenteForm.nome.trim()) {
      toast({ title: 'Preencha o nome da frente/papel!', variant: 'destructive' });
      return;
    }
    if (!frenteForm.objetivo.trim()) {
      toast({ title: 'Preencha a descrição/objetivo da frente!', variant: 'destructive' });
      return;
    }

    try {
      const papelPayload: PapelRioJunior = {
        nome: frenteForm.nome.trim(),
        objetivo: frenteForm.objetivo.trim(),
        isDiretoria: frenteForm.isDiretoria,
        temTime: frenteForm.temTime,
        indicadores: frenteForm.indicadores.trim() || undefined,
        modeloTrabalho: frenteForm.modeloTrabalho.trim() || undefined,
        statusFrente: frenteForm.statusFrente
      };
      const timeIds = frenteForm.temTime ? frenteForm.timeMemberIds : [];

      if (isEditingFrente) {
        frentesService.saveFrente(originalFrenteGuilda, papelPayload, originalFrenteNome, frenteForm.guilda);
        frentesService.assignMembersToFrente(
          frenteForm.guilda,
          papelPayload.nome,
          frenteForm.assignedMemberIds,
          timeIds
        );
        toast({
          title: 'Frente atualizada com sucesso!',
          description: `As alterações de "${papelPayload.nome}" e de seus responsáveis foram salvas.`
        });
      } else {
        frentesService.createFrente(frenteForm.guilda, papelPayload);
        frentesService.assignMembersToFrente(
          frenteForm.guilda,
          papelPayload.nome,
          frenteForm.assignedMemberIds,
          timeIds
        );
        toast({
          title: 'Nova frente cadastrada!',
          description: `A frente "${papelPayload.nome}" foi criada na guilda ${frenteForm.guilda}.`
        });
      }
      setIsFrenteModalOpen(false);
    } catch (err: any) {
      toast({ title: 'Erro ao salvar frente', description: err.message, variant: 'destructive' });
    }
  };

  const handleDeleteFrente = (guilda: GuildaKey, frenteNome: string) => {
    if (
      confirm(
        `Excluir a frente "${frenteNome}" da guilda ${guilda}? Os membros alocados passarão a "Membro Colaborador".`
      )
    ) {
      try {
        frentesService.deleteFrente(guilda, frenteNome);
        toast({ title: 'Frente removida com sucesso!' });
      } catch (err: any) {
        toast({ title: 'Não foi possível excluir a frente', description: err.message, variant: 'destructive' });
      }
    }
  };

  const handleQuickRemoveMemberFromFrente = (membro: MembroRioJunior, frenteNome: string) => {
    if (confirm(`Desvincular ${membro.nome} da frente "${frenteNome}"?`)) {
      const { vinculoFrente, ...rest } = membro;
      membrosCartoesService.saveMembro({ ...rest, cargo: 'Membro Colaborador' });
      toast({ title: 'Membro desvinculado', description: `${membro.nome} saiu da frente "${frenteNome}".` });
    }
  };

  const membersAvailableForFrenteModal = useMemo(() => {
    const q = memberSearchInModal.toLowerCase().trim();
    return membros.filter(m => {
      if (!q) return true;
      return (
        m.nome.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.guilda.toLowerCase().includes(q) ||
        m.cargo.toLowerCase().includes(q)
      );
    });
  }, [membros, memberSearchInModal]);

  // ========================================================
  // DESLIGAMENTO POR MOTIVO ESPECÍFICO (SEM CARTÃO)
  // ========================================================

  const handleOpenDesligar = (m: MembroRioJunior) => {
    setDesligarTarget(m);
    setDesligarForm({ motivo: '', data: new Date().toISOString().split('T')[0] });
    setIsDesligarModalOpen(true);
  };

  const handleConfirmDesligar = () => {
    if (!desligarTarget) return;
    if (!desligarForm.motivo.trim()) {
      toast({ title: 'Informe o motivo do desligamento!', variant: 'destructive' });
      return;
    }
    membrosCartoesService.desligarMembro(desligarTarget.id, desligarForm.motivo, desligarForm.data);
    toast({
      title: 'Membro desligado',
      description: `${desligarTarget.nome} foi desligado(a) da RioJunior (motivo registrado).`
    });
    setIsDesligarModalOpen(false);
    setDesligarTarget(null);
  };

  const handleReintegrar = (m: MembroRioJunior) => {
    if (confirm(`Reintegrar ${m.nome}? O status voltará a ser calculado pelos cartões.`)) {
      membrosCartoesService.reintegrarMembro(m.id);
      toast({ title: 'Membro reintegrado', description: `${m.nome} voltou ao quadro ativo.` });
    }
  };

  // Ver perfil do membro
  const handleOpenProfile = (email: string) => {
    setSelectedTargetEmail(email);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          HERO & APRESENTAÇÃO DO SISTEMA DISCIPLINAR
          ======================================================== */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card/95 to-amber-500/5 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-400 text-amber-600 dark:text-amber-400 gap-1 font-bold">
                <ShieldAlert size={12} /> Guilda de Operações (OP)
              </Badge>
              <Badge variant="secondary" className="text-[11px] gap-1">
                <FileSpreadsheet size={12} /> Base Oficial 2026/2027
              </Badge>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              Sistema Disciplinar, Membros & Frentes RioJunior
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Gestão integrada do quadro de membros da Federação baseada na planilha oficial{' '}
              <strong>[RIOJUNIOR] Dados de Membros 2026</strong>, nas frentes de atuação do{' '}
              <strong>[RioJunior] Mapeamento de Papéis 2027</strong> e no regimento de advertências e cartões da Federação.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              onClick={() => handleOpenApplyModal()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs gap-1.5 shadow-sm"
            >
              <ShieldAlert size={14} />
              Aplicar Cartão (OP)
            </Button>
            <Button
              onClick={() => handleOpenNewMember()}
              variant="outline"
              className="text-xs gap-1.5"
            >
              <Plus size={14} />
              Novo Membro
            </Button>
            {/* Botão de reset removido para preservar dados dos membros */}
          </div>
        </div>

        {/* CARDS DE RESUMO & REGRAS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-border/60">
          <div className="p-3 rounded-xl bg-background/60 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Quadro Total</span>
            <span className="text-xl font-black text-foreground">{summaryStats.totalMembros}</span>
            <span className="text-[10px] text-muted-foreground block">Membros cadastrados</span>
          </div>

          <div className="p-3 rounded-xl bg-background/60 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Conformes</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {summaryStats.conformes}
            </span>
            <span className="text-[10px] text-muted-foreground block">Sem advertências</span>
          </div>

          <div className="p-3 rounded-xl bg-background/60 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Em Atenção</span>
            <span className="text-xl font-black text-amber-500">{summaryStats.atencao}</span>
            <span className="text-[10px] text-muted-foreground block">{summaryStats.totalAmarelos} amarelo(s)</span>
          </div>

          <div className="p-3 rounded-xl bg-background/60 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Status Crítico</span>
            <span className="text-xl font-black text-rose-500">{summaryStats.critico}</span>
            <span className="text-[10px] text-muted-foreground block">1 cartão vermelho</span>
          </div>

          <div className="p-3 rounded-xl bg-background/60 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Desligamentos</span>
            <span className="text-xl font-black text-destructive">{summaryStats.desligados}</span>
            <span className="text-[10px] text-muted-foreground block">2 cartões vermelhos</span>
          </div>

          <div className="p-3 rounded-xl bg-background/60 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Total Cartões</span>
            <span className="text-xl font-black text-foreground">{summaryStats.totalCartoesRegistrados}</span>
            <span className="text-[10px] text-muted-foreground block">Lançados pela OP</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          ABAS PRINCIPAIS: MEMBROS / HISTÓRICO / FRENTES & PAPÉIS
          ======================================================== */}
      <Tabs defaultValue="membros" className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <TabsList className="grid grid-cols-3 max-w-xl">
            <TabsTrigger value="membros" className="gap-2 text-xs">
              <Users size={14} />
              <span>Membros ({filteredMembros.length})</span>
            </TabsTrigger>
            <TabsTrigger value="historico" className="gap-2 text-xs">
              <ShieldAlert size={14} />
              <span>Histórico de Cartões ({cartoes.length})</span>
            </TabsTrigger>
            <TabsTrigger value="frentes" className="gap-2 text-xs">
              <FolderTree size={14} />
              <span>Aba de Frentes & Papéis</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --------------------------------------------------------
            ABA 1: LISTAGEM DE MEMBROS DA FEDERAÇÃO
            -------------------------------------------------------- */}
        <TabsContent value="membros" className="space-y-4">
          {/* Barra de Filtros */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card p-3 rounded-xl border border-border">
            <div className="relative w-full md:w-80">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar membro, e-mail ou cargo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Filtro por Guilda */}
              <Select value={guildaFilter} onValueChange={setGuildaFilter}>
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue placeholder="Todas Guildas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Todas Guildas</SelectItem>
                  {Object.keys(GUILDAS_INFO).map(g => (
                    <SelectItem key={g} value={g} className="text-xs">
                      {g} - {GUILDAS_INFO[g as GuildaKey].nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro por Status Disciplinar */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue placeholder="Status Disciplinar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Todos os Status</SelectItem>
                  <SelectItem value="ativo" className="text-xs">Conforme (Ativo)</SelectItem>
                  <SelectItem value="atencao" className="text-xs">Atenção (1 Amarelo)</SelectItem>
                  <SelectItem value="critico" className="text-xs">Crítico (1 Vermelho)</SelectItem>
                  <SelectItem value="desligado" className="text-xs">Desligado (2 Vermelhos)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabela de Membros */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Nome & Contato</th>
                    <th className="py-3 px-4">Guilda</th>
                    <th className="py-3 px-4">Cargo / Frente Mapeada</th>
                    <th className="py-3 px-4 text-center">Cartões</th>
                    <th className="py-3 px-4 text-center">Status Disciplinar</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMembros.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        Nenhum membro encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredMembros.map(m => {
                      const mCards = cartoes.filter(c => c.membroId === m.id);
                      const mStats = membrosCartoesService.calculateCardStats(mCards);
                      const isDiretoria =
                        m.cargo.toLowerCase().includes('diretor') ||
                        m.cargo.toLowerCase().includes('presidente');

                      return (
                        <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                          {/* Nome & Email */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                                {m.nome.charAt(0)}
                              </div>
                              <div>
                                <span className="font-semibold text-foreground block">{m.nome}</span>
                                <span className="text-[11px] text-muted-foreground">{m.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Guilda */}
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="font-bold text-[11px]">
                              {m.guilda}
                            </Badge>
                          </td>

                          {/* Cargo */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium text-foreground">{m.cargo}</span>
                              {m.vinculoFrente === 'time' && (
                                <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                                  {/efej/i.test(m.cargo) ? 'Time EFEJ' : 'Time'}
                                </Badge>
                              )}
                              {isDiretoria && (
                                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 text-[10px] py-0 px-1.5 gap-0.5">
                                  👑 Diretoria
                                </Badge>
                              )}
                            </div>
                          </td>

                          {/* Cartões */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center gap-2">
                              {/* Amarelos */}
                              <div
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                  mStats.amarelosCount > 0
                                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-900/60'
                                    : 'text-muted-foreground/40'
                                }`}
                                title={`${mStats.amarelosCount} Cartão(ões) Amarelo(s)`}
                              >
                                <div className={`w-2.5 h-3.5 rounded-xs ${mStats.amarelosCount > 0 ? 'bg-amber-400' : 'bg-muted-foreground/30'}`} />
                                <span>{mStats.amarelosCount}</span>
                              </div>

                              {/* Vermelhos */}
                              <div
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                  mStats.totalVermelhos > 0
                                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900/60'
                                    : 'text-muted-foreground/40'
                                }`}
                                title={`${mStats.totalVermelhos} Cartão(ões) Vermelho(s) (${mStats.vermelhosDiretosCount} diretos + ${mStats.vermelhosConvertidos} por conversão)`}
                              >
                                <div className={`w-2.5 h-3.5 rounded-xs ${mStats.totalVermelhos > 0 ? 'bg-rose-500' : 'bg-muted-foreground/30'}`} />
                                <span>{mStats.totalVermelhos}</span>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center">
                            {m.desligamentoManual ? (
                              <Badge
                                variant="destructive"
                                className="text-[10px] py-0 px-2"
                                title={`Desligado em ${m.desligamentoManual.data}: ${m.desligamentoManual.motivo}`}
                              >
                                Desligado
                              </Badge>
                            ) : mStats.isDesligamento ? (
                              <Badge variant="destructive" className="text-[10px] py-0 px-2 animate-pulse">
                                Desligamento (2V)
                              </Badge>
                            ) : mStats.totalVermelhos === 1 ? (
                              <Badge className="bg-rose-500 text-white text-[10px] py-0 px-2">
                                Crítico (1V)
                              </Badge>
                            ) : mStats.amarelosCount > 0 ? (
                              <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px] py-0 px-2">
                                Atenção ({mStats.amarelosCount}A)
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] py-0 px-2">
                                Conforme
                              </Badge>
                            )}
                          </td>

                          {/* Ações */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => handleOpenProfile(m.email)}
                                title="Ver Perfil Individual"
                              >
                                <Eye size={13} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-500/10"
                                onClick={() => handleOpenApplyModal(m.id)}
                                title="Aplicar Cartão Disciplinar"
                              >
                                <ShieldAlert size={13} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => handleOpenEditMember(m)}
                                title="Editar Cadastro / Frente"
                              >
                                <Pencil size={13} />
                              </Button>
                              {m.desligamentoManual ? (

                                <Button

                                  size="sm"

                                  variant="ghost"

                                  className="h-7 w-7 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"

                                  onClick={() => handleReintegrar(m)}

                                  title="Reintegrar membro"

                                >

                                  <UserCheck size={13} />

                                </Button>

                              ) : (

                                <Button

                                  size="sm"

                                  variant="ghost"

                                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"

                                  onClick={() => handleOpenDesligar(m)}

                                  title="Desligar membro (motivo específico)"

                                >

                                  <UserX size={13} />

                                </Button>

                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteMember(m.id, m.nome)}
                                title="Excluir Membro"
                              >
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* --------------------------------------------------------
            ABA 2: HISTÓRICO DE CARTÕES APLICADOS (OP)
            -------------------------------------------------------- */}
        <TabsContent value="historico" className="space-y-4">
          <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
            <div>
              <h3 className="text-sm font-bold text-foreground">Registro Disciplinar Oficial da RioJunior</h3>
              <p className="text-xs text-muted-foreground">
                Cartões lançados pela Guilda de Operações com efeitos estatutários automáticos.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handleOpenApplyModal()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs gap-1.5"
            >
              <ShieldAlert size={13} />
              + Novo Lançamento de Advertência
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Membro Penalizado</th>
                    <th className="py-3 px-4 text-center">Tipo de Cartão</th>
                    <th className="py-3 px-4">Categoria da Infração</th>
                    <th className="py-3 px-4">Motivo Circunstanciado</th>
                    <th className="py-3 px-4">Aplicado Por</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cartoes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        Nenhum cartão disciplinar registrado até o momento.
                      </td>
                    </tr>
                  ) : (
                    cartoes.map(c => {
                      const m = membros.find(mem => mem.id === c.membroId);

                      return (
                        <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                            {c.data}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-foreground block">{c.membroNome}</span>
                            <span className="text-[11px] text-muted-foreground">{m?.cargo || m?.guilda || c.membroEmail}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {c.tipo === 'vermelho' ? (
                              <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] gap-1">
                                <div className="w-2 h-3 bg-white rounded-xs"></div> Vermelho (Grave)
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[10px] gap-1">
                                <div className="w-2 h-3 bg-amber-900 rounded-xs"></div> Amarelo (Moderada)
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-[10px]">
                              {c.categoria}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <p className="text-foreground font-medium">{c.motivo}</p>
                            {c.observacoes && (
                              <p className="text-muted-foreground text-[11px] italic mt-0.5">
                                Obs: {c.observacoes}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {c.aplicadoPor}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                                onClick={() => handleOpenEditCard(c)}
                                title="Editar detalhes do cartão"
                              >
                                <Pencil size={13} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRevokeCard(c.id)}
                                title="Revogar/Excluir este cartão"
                              >
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* --------------------------------------------------------
            ABA 3: ABA DE FRENTES & PAPÉIS (MAPEAMENTO 2027)
            -------------------------------------------------------- */}
        <TabsContent value="frentes" className="space-y-4">
          {/* Header e Filtros de Frentes */}
          <div className="bg-card p-4 rounded-xl border border-border space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FolderTree size={16} className="text-primary" />
                  Mapeamento Oficial de Papéis & Frentes RioJunior 2027
                </h3>
                <p className="text-xs text-muted-foreground">
                  Catálogo das frentes de atuação de cada Guilda. Administradores podem editar nome, descrição, responsáveis e demais dados.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar frente por nome ou objetivo..."
                    value={frentesSearch}
                    onChange={e => setFrentesSearch(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <Button size="sm" className="h-8 text-xs gap-1.5 shrink-0" onClick={() => handleOpenNewFrente()}>
                  <Plus size={13} /> Nova Frente
                </Button>
              </div>
            </div>

            {/* Seletor de Guilda */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
              <Button
                size="sm"
                variant={selectedFrenteGuilda === 'all' ? 'default' : 'outline'}
                className="h-7 text-xs rounded-full px-3"
                onClick={() => setSelectedFrenteGuilda('all')}
              >
                Todas as Guildas ({Object.keys(GUILDAS_INFO).length})
              </Button>
              {Object.keys(GUILDAS_INFO).map(g => {
                const info = GUILDAS_INFO[g as GuildaKey];
                const isSelected = selectedFrenteGuilda === g;
                return (
                  <Button
                    key={g}
                    size="sm"
                    variant={isSelected ? 'default' : 'outline'}
                    className="h-7 text-xs rounded-full px-3 shrink-0"
                    onClick={() => setSelectedFrenteGuilda(g)}
                  >
                    {g} • {info.nome.split(' ')[0]}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Grid de Frentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frentesList.map(({ guilda, guildaInfo, papel, assignedMembers }) => {
              const isDir = !!papel.isDiretoria;
              const temTime = papelTemTime(papel);
              const coordenadores = assignedMembers.filter(m => m.vinculoFrente !== 'time');
              const timeMembers = assignedMembers.filter(m => m.vinculoFrente === 'time');

              const renderMemberRow = (m: MembroRioJunior) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-muted/30 border border-border/40 text-xs hover:bg-muted/50 group"
                >
                  <div
                    className="flex items-center gap-2 overflow-hidden flex-1 cursor-pointer"
                    onClick={() => handleOpenProfile(m.email)}
                    title="Clique para ver o perfil completo"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                      {m.nome.charAt(0)}
                    </div>
                    <span className="font-medium text-foreground truncate">{m.nome}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-muted-foreground font-mono">{m.status}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                      onClick={e => {
                        e.stopPropagation();
                        handleQuickRemoveMemberFromFrente(m, papel.nome);
                      }}
                      title="Desvincular desta frente"
                    >
                      <X size={11} />
                    </Button>
                  </div>
                </div>
              );

              return (
                <div
                  key={`${guilda}_${papel.nome}`}
                  className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                    isDir
                      ? 'border-amber-400/60 bg-gradient-to-br from-amber-500/10 via-card to-amber-500/5 shadow-xs'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header do Card */}
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {guilda} • {guildaInfo.nome}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {isDir ? (
                          <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] gap-1 shadow-xs">
                            👑 Diretoria Executiva
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Frente de Atuação
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Título da Frente + ações do ADM */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        {isDir && <Crown size={14} className="text-amber-500 shrink-0" />}
                        <span>{papel.nome}</span>
                      </h4>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => handleOpenEditFrente(guilda, papel, assignedMembers)}
                          title="Editar frente (nome, descrição, responsáveis...)"
                        >
                          <Pencil size={13} />
                        </Button>
                        {!isDir && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteFrente(guilda, papel.nome)}
                            title="Excluir frente"
                          >
                            <Trash2 size={13} />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Objetivo Oficial da Frente */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{papel.objetivo}</p>

                    {(papel.indicadores || papel.modeloTrabalho) && (
                      <div className="text-[11px] text-muted-foreground space-y-0.5">
                        {papel.indicadores && (
                          <p className="line-clamp-2">
                            <strong className="text-foreground font-medium">KPIs:</strong> {papel.indicadores}
                          </p>
                        )}
                        {papel.modeloTrabalho && (
                          <p className="line-clamp-1">
                            <strong className="text-foreground font-medium">Rotina:</strong> {papel.modeloTrabalho}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Rodapé: Membros Alocados */}
                  <div className="pt-3 mt-3 border-t border-border/60 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground font-semibold">
                        {temTime ? 'Coordenador(a)' : 'Responsáveis'} ({coordenadores.length}):
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[10px] px-2 text-primary hover:bg-primary/10 gap-1"
                        onClick={() => handleOpenEditFrente(guilda, papel, assignedMembers)}
                      >
                        <Plus size={11} /> Gerenciar
                      </Button>
                    </div>

                    {coordenadores.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground/60 italic">
                        Nenhum membro vinculado a esta frente no momento.
                      </p>
                    ) : (
                      <div className="space-y-1.5">{coordenadores.map(renderMemberRow)}</div>
                    )}

                    {temTime && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] text-muted-foreground font-semibold block">
                          {labelTimeDaFrente(papel)} — assessores ({timeMembers.length}):
                        </span>
                        {timeMembers.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground/60 italic">Nenhum assessor no time.</p>
                        ) : (
                          <div className="space-y-1.5">{timeMembers.map(renderMemberRow)}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* ========================================================
          MODAL: APLICAÇÃO OU EDIÇÃO DE CARTÃO PELA GUILDA DE OP
          ======================================================== */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert size={20} className={applyForm.tipo === 'vermelho' ? 'text-rose-500' : 'text-amber-500'} />
              {editingCardId ? 'Editar Detalhes do Cartão Disciplinar' : 'Aplicação de Cartão Disciplinar (Guilda de OP)'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              {editingCardId
                ? 'Modifique o motivo, data, gravidade ou categoria da advertência registrada.'
                : 'Lançamento oficial no sistema de advertências da RioJunior.'}
            </p>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Seleção do Membro */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Membro Penalizado</Label>
              <Select
                value={applyForm.membroId}
                onValueChange={val => setApplyForm({ ...applyForm, membroId: val })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Selecione o membro" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {membros.map(m => (
                    <SelectItem key={m.id} value={m.id} className="text-xs">
                      {m.nome} — {m.cargo} ({m.guilda})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo do Cartão (Gravidade) */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Tipo de Cartão (Gravidade da Infração)</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setApplyForm({ ...applyForm, tipo: 'amarelo' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    applyForm.tipo === 'amarelo'
                      ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/20'
                      : 'border-border bg-card opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-4 bg-amber-400 rounded-xs shadow-xs" />
                    <span className="font-bold text-foreground">Cartão Amarelo</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Infração Moderada (2 amarelos viram 1 vermelho).
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setApplyForm({ ...applyForm, tipo: 'vermelho' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    applyForm.tipo === 'vermelho'
                      ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/20'
                      : 'border-border bg-card opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-4 bg-rose-500 rounded-xs shadow-xs" />
                    <span className="font-bold text-foreground">Cartão Vermelho</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Infração Grave (2 vermelhos = desligamento).
                  </p>
                </button>
              </div>
            </div>

            {/* Categoria da Infração */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Categoria da Ocorrência</Label>
              <Select
                value={applyForm.categoria}
                onValueChange={val => setApplyForm({ ...applyForm, categoria: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Falta em Reunião Geral (RV)" className="text-xs">Falta em Reunião Geral (RV)</SelectItem>
                  <SelectItem value="Descumprimento de SLA / Entrega" className="text-xs">Descumprimento de SLA / Entrega</SelectItem>
                  <SelectItem value="Comportamental / Clima" className="text-xs">Comportamental / Clima Organizacional</SelectItem>
                  <SelectItem value="Violação Estatutária" className="text-xs">Violação Estatutária ou Regimental</SelectItem>
                  <SelectItem value="Quebra de Confidencialidade" className="text-xs">Quebra de Confidencialidade</SelectItem>
                  <SelectItem value="Ausência em Evento Obrigatório" className="text-xs">Ausência em Evento Obrigatório</SelectItem>
                  <SelectItem value="Outros" className="text-xs">Outros Motivos Circunstanciados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Motivo Circunstanciado */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Motivo Circunstanciado</Label>
              <Input
                placeholder="Descreva o que motivou a aplicação da advertência..."
                value={applyForm.motivo}
                onChange={e => setApplyForm({ ...applyForm, motivo: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            {/* Data do Ocorrido */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Data da Ocorrência</Label>
              <Input
                type="date"
                value={applyForm.data}
                onChange={e => setApplyForm({ ...applyForm, data: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            {/* Observações Opcionais */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Observações / Encaminhamentos (Opcional)</Label>
              <Input
                placeholder="Alinhamentos adicionais, prazo de recurso ou combinados..."
                value={applyForm.observacoes}
                onChange={e => setApplyForm({ ...applyForm, observacoes: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            {/* Prévia do Impacto Regulamentar */}
            {impactPreview && (
              <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                impactPreview.willDismiss
                  ? 'border-rose-400 bg-rose-500/10 text-rose-800 dark:text-rose-300'
                  : 'border-amber-300 bg-amber-500/10 text-amber-900 dark:text-amber-200'
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertTriangle size={14} />
                  Impacto Regulamentar Previsto:
                </div>
                <p>{impactPreview.desc}</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleApplyCardSubmit}
              className={applyForm.tipo === 'vermelho' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'}
            >
              {editingCardId ? 'Salvar Alterações no Cartão' : 'Confirmar Aplicação de Advertência'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL: CADASTRO OU EDIÇÃO DE MEMBRO
          ======================================================== */}
      <Dialog open={isMemberModalOpen} onOpenChange={setIsMemberModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User size={18} className="text-primary" />
              {isEditingMember ? 'Editar Dados do Membro' : 'Cadastrar Novo Membro'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Vínculo cadastral com as frentes da RioJunior e acesso à plataforma via e-mail.
            </p>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Nome Completo</Label>
              <Input
                value={memberForm.nome || ''}
                onChange={e => setMemberForm({ ...memberForm, nome: e.target.value })}
                placeholder="Nome do membro"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">E-mail Institucional (@riojunior.com.br)</Label>
              <Input
                value={memberForm.email || ''}
                onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                placeholder="nome@riojunior.com.br"
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Guilda */}
              <div className="space-y-1">
                <Label className="text-xs">Guilda (Diretoria)</Label>
                <Select
                  value={memberForm.guilda}
                  onValueChange={(val: GuildaKey) => {
                    const papeis = getPapeisByGuilda(val);
                    setMemberForm({
                      ...memberForm,
                      guilda: val,
                      cargo: papeis[0]?.nome || memberForm.cargo
                    });
                  }}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(GUILDAS_INFO).map(g => (
                      <SelectItem key={g} value={g} className="text-xs">
                        {g} - {GUILDAS_INFO[g as GuildaKey].nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cargo / Frente */}
              <div className="space-y-1">
                <Label className="text-xs">Cargo / Frente (Mapeamento 2027)</Label>
                <Select
                  value={memberForm.cargo}
                  onValueChange={val => setMemberForm({ ...memberForm, cargo: val })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {getPapeisByGuilda(memberForm.guilda || 'OP').map(p => (
                      <SelectItem key={p.nome} value={p.nome} className="text-xs">
                        {p.isDiretoria ? `👑 ${p.nome} (Diretoria)` : p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">CPF</Label>
                <Input
                  value={memberForm.cpf || ''}
                  onChange={e => setMemberForm({ ...memberForm, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Identidade / Órgão</Label>
                <div className="flex gap-2">
                  <Input
                    value={memberForm.identidade || ''}
                    onChange={e => setMemberForm({ ...memberForm, identidade: e.target.value })}
                    placeholder="Número RG"
                    className="h-8 text-xs flex-1"
                  />
                  <Input
                    value={memberForm.orgaoExpedidor || ''}
                    onChange={e => setMemberForm({ ...memberForm, orgaoExpedidor: e.target.value })}
                    placeholder="Órgão"
                    className="h-8 text-xs w-28"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Endereço Residencial</Label>
              <Input
                value={memberForm.endereco || ''}
                onChange={e => setMemberForm({ ...memberForm, endereco: e.target.value })}
                placeholder="Rua, número, bairro, cidade - RJ, CEP"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsMemberModalOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSaveMember}>
              {isEditingMember ? 'Salvar Alterações' : 'Cadastrar Membro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL: EDIÇÃO / CRIAÇÃO DE FRENTE & PAPEL (ADMs)
          ======================================================== */}
      <Dialog open={isFrenteModalOpen} onOpenChange={setIsFrenteModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderTree size={18} className="text-primary" />
              {isEditingFrente ? `Editar Frente: ${originalFrenteNome}` : 'Nova Frente / Papel'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Altere nome, descrição, indicadores e defina quem são os responsáveis por esta frente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Guilda</Label>
                <Select
                  value={frenteForm.guilda}
                  onValueChange={(val: GuildaKey) => setFrenteForm({ ...frenteForm, guilda: val })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(GUILDAS_INFO).map(g => (
                      <SelectItem key={g} value={g}>
                        {g} • {GUILDAS_INFO[g as GuildaKey].nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Status da Frente</Label>
                <Select
                  value={frenteForm.statusFrente}
                  onValueChange={(val: any) => setFrenteForm({ ...frenteForm, statusFrente: val })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativa">Ativa</SelectItem>
                    <SelectItem value="em_estruturacao">Em estruturação</SelectItem>
                    <SelectItem value="pausada">Pausada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Nome da Frente / Papel</Label>
              <Input
                value={frenteForm.nome}
                onChange={e => setFrenteForm({ ...frenteForm, nome: e.target.value })}
                placeholder="Ex: Coordenadoria Geral do EFEJ"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Descrição / Objetivo</Label>
              <Textarea
                value={frenteForm.objetivo}
                onChange={e => setFrenteForm({ ...frenteForm, objetivo: e.target.value })}
                rows={4}
                className="text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Indicadores / KPIs</Label>
                <Input
                  value={frenteForm.indicadores}
                  onChange={e => setFrenteForm({ ...frenteForm, indicadores: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Modelo de Trabalho / Rotina</Label>
                <Input
                  value={frenteForm.modeloTrabalho}
                  onChange={e => setFrenteForm({ ...frenteForm, modeloTrabalho: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={frenteForm.isDiretoria}
                  onCheckedChange={c => setFrenteForm({ ...frenteForm, isDiretoria: !!c })}
                />
                <Crown size={13} className="text-amber-500" /> Cargo de Diretoria da guilda
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={frenteForm.temTime}
                  onCheckedChange={c => setFrenteForm({ ...frenteForm, temTime: !!c })}
                />
                <Users size={13} className="text-primary" /> Possui time de assessores (ex.: Time EFEJ)
              </label>
            </div>

            {/* Responsáveis */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Label className="text-xs font-semibold">
                    Membros vinculados ({frenteForm.assignedMemberIds.length})
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {frenteForm.temTime
                      ? 'Marque os membros e defina se cada um é Coordenador(a) ou integrante do Time.'
                      : 'Marque os membros responsáveis por esta frente.'}
                  </p>
                </div>
                <div className="relative w-full sm:w-48">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar membros..."
                    value={memberSearchInModal}
                    onChange={e => setMemberSearchInModal(e.target.value)}
                    className="pl-7 h-7 text-[11px]"
                  />
                </div>
              </div>

              <div className="border border-border rounded-xl p-2 max-h-56 overflow-y-auto space-y-1 bg-muted/20">
                {membersAvailableForFrenteModal.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground text-xs">Nenhum membro encontrado.</p>
                ) : (
                  membersAvailableForFrenteModal.map(m => {
                    const isSelected = frenteForm.assignedMemberIds.includes(m.id);
                    const isTime = frenteForm.timeMemberIds.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        className={`flex items-center justify-between gap-2 p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-primary/10 border-primary/40'
                            : 'bg-card border-border/50 hover:bg-muted/40'
                        }`}
                        onClick={() => handleToggleMemberAssignment(m.id)}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleMemberAssignment(m.id)}
                            onClick={e => e.stopPropagation()}
                          />
                          <div className="truncate">
                            <span className="text-foreground font-medium">{m.nome}</span>
                            <span className="text-[10px] text-muted-foreground ml-1.5">
                              ({m.guilda} • {m.cargo})
                            </span>
                          </div>
                        </div>

                        {isSelected && frenteForm.temTime && (
                          <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                            <Button
                              type="button"
                              size="sm"
                              variant={!isTime ? 'default' : 'outline'}
                              className="h-6 text-[10px] px-2"
                              onClick={() => handleSetMemberVinculo(m.id, 'responsavel')}
                            >
                              Coordenador(a)
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={isTime ? 'default' : 'outline'}
                              className="h-6 text-[10px] px-2"
                              onClick={() => handleSetMemberVinculo(m.id, 'time')}
                            >
                              Time
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsFrenteModalOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSaveFrenteSubmit}>
              {isEditingFrente ? 'Salvar Alterações' : 'Criar Frente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL: DESLIGAMENTO POR MOTIVO ESPECÍFICO (SEM CARTÃO)
          ======================================================== */}
      <Dialog open={isDesligarModalOpen} onOpenChange={setIsDesligarModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserX size={18} className="text-destructive" />
              Desligar Membro
            </DialogTitle>
            <DialogDescription className="text-xs">
              Registre um desligamento ocorrido por motivo específico, sem relação com aplicação de cartões.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-sm font-semibold text-foreground">{desligarTarget?.nome}</p>
            <div className="space-y-1">
              <Label className="text-xs">Data do desligamento</Label>
              <Input
                type="date"
                value={desligarForm.data}
                onChange={e => setDesligarForm({ ...desligarForm, data: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Motivo do desligamento</Label>
              <Textarea
                value={desligarForm.motivo}
                onChange={e => setDesligarForm({ ...desligarForm, motivo: e.target.value })}
                placeholder="Ex: Pedido do próprio membro, mudança de cidade, decisão da Diretoria..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDesligarModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmDesligar}>
              Confirmar Desligamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DE PERFIL INDIVIDUAL DO MEMBRO */}
      <UserProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        targetMemberEmail={selectedTargetEmail}
      />
    </div>
  );
}
