// src/components/operations/CartoesMembrosTab.tsx
// Aba Oficial de Aplicação de Cartões, Gestão de Membros e Frentes da Guilda de Operações (OP)
// Baseada em [RIOJUNIOR] Dados de Membros 2026.xlsx e [RioJunior] Mapeamento de Papéis 2027.xlsx
// Com suporte a edição dinâmica completa por ADMs (nomes, descrições, responsáveis e metas)

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
  Target,
  Clock,
  CheckSquare,
  Square,
  SlidersHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
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

export default function CartoesMembrosTab() {
  const [membros, setMembros] = useState<MembroRioJunior[]>(membrosCartoesService.getMembros());
  const [cartoes, setCartoes] = useState<CartaoAdvertencia[]>(membrosCartoesService.getCartoes());
  const [frentesVersion, setFrentesVersion] = useState(0);

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
    indicadores: string;
    modeloTrabalho: string;
    statusFrente: 'ativa' | 'em_estruturacao' | 'pausada';
    assignedMemberIds: string[];
  }>({
    guilda: 'OP',
    nome: '',
    objetivo: '',
    isDiretoria: false,
    indicadores: '',
    modeloTrabalho: 'Híbrido com ritos semanais',
    statusFrente: 'ativa',
    assignedMemberIds: []
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

      if (st.isDesligamento) desligados++;
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

  // Abertura do Perfil Individual
  const handleOpenProfile = (email: string) => {
    setSelectedTargetEmail(email);
    setIsProfileModalOpen(true);
  };

  // Exportar dados da tabela de membros em CSV
  const handleExportMembersCSV = () => {
    const headers = ['Nome', 'Email', 'Guilda', 'Cargo', 'Status', 'Cartoes_Amarelos', 'Cartoes_Vermelhos', 'Situacao_Disciplinar'];
    const rows = filteredMembros.map(m => {
      const cards = cartoes.filter(c => c.membroId === m.id);
      const st = membrosCartoesService.calculateCardStats(cards);
      return [
        `"${m.nome}"`,
        `"${m.email}"`,
        `"${m.guilda}"`,
        `"${m.cargo}"`,
        `"${m.status}"`,
        st.amarelosCount,
        st.totalVermelhos,
        st.isDesligamento ? 'Desligamento' : st.totalVermelhos > 0 ? 'Critico' : st.amarelosCount > 0 ? 'Atencao' : 'Regular'
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `riojunior_membros_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Planilha de membros exportada com sucesso!' });
  };

  // Exportar histórico de cartões em CSV
  const handleExportCardsCSV = () => {
    const headers = ['Data', 'Membro', 'Email', 'Guilda', 'Tipo', 'Categoria', 'Motivo', 'Observacoes', 'Aplicado_Por'];
    const rows = cartoes.map(c => [
      `"${c.data}"`,
      `"${c.membroNome}"`,
      `"${c.membroEmail}"`,
      `"${c.membroGuilda}"`,
      `"${c.tipo}"`,
      `"${c.categoria}"`,
      `"${c.motivo.replace(/"/g, '""')}"`,
      `"${(c.observacoes || '').replace(/"/g, '""')}"`,
      `"${c.aplicadoPor}"`
    ].join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `riojunior_cartoes_disciplinares_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Histórico de cartões exportado com sucesso!' });
  };

  // ========================================================
  // CONTROLADORES DA ABA DE FRENTES (EDIÇÃO DINÂMICA POR ADMs)
  // ========================================================

  const handleOpenNewFrente = (defaultGuilda?: GuildaKey) => {
    setIsEditingFrente(false);
    setOriginalFrenteNome('');
    const targetGuilda = defaultGuilda || (selectedFrenteGuilda !== 'all' ? (selectedFrenteGuilda as GuildaKey) : 'OP');
    setOriginalFrenteGuilda(targetGuilda);
    setMemberSearchInModal('');
    setFrenteForm({
      guilda: targetGuilda,
      nome: '',
      objetivo: '',
      isDiretoria: false,
      indicadores: '',
      modeloTrabalho: 'Híbrido com ritos semanais',
      statusFrente: 'ativa',
      assignedMemberIds: []
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
      indicadores: papel.indicadores || '',
      modeloTrabalho: papel.modeloTrabalho || 'Híbrido com ritos semanais',
      statusFrente: papel.statusFrente || 'ativa',
      assignedMemberIds: currentAssigned.map(m => m.id)
    });
    setIsFrenteModalOpen(true);
  };

  const handleToggleMemberAssignment = (membroId: string) => {
    setFrenteForm(prev => {
      const exists = prev.assignedMemberIds.includes(membroId);
      const updated = exists
        ? prev.assignedMemberIds.filter(id => id !== membroId)
        : [...prev.assignedMemberIds, membroId];
      return { ...prev, assignedMemberIds: updated };
    });
  };

  const handleSaveFrenteSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        indicadores: frenteForm.indicadores.trim() || undefined,
        modeloTrabalho: frenteForm.modeloTrabalho.trim() || undefined,
        statusFrente: frenteForm.statusFrente
      };

      if (isEditingFrente) {
        frentesService.saveFrente(
          originalFrenteGuilda,
          papelPayload,
          originalFrenteNome,
          frenteForm.guilda
        );
        frentesService.assignMembersToFrente(
          frenteForm.guilda,
          papelPayload.nome,
          frenteForm.assignedMemberIds
        );
        toast({
          title: 'Frente atualizada com sucesso!',
          description: `As alterações de "${papelPayload.nome}" e seus responsáveis foram salvas.`
        });
      } else {
        frentesService.createFrente(frenteForm.guilda, papelPayload);
        frentesService.assignMembersToFrente(
          frenteForm.guilda,
          papelPayload.nome,
          frenteForm.assignedMemberIds
        );
        toast({
          title: 'Nova frente cadastrada!',
          description: `A frente "${papelPayload.nome}" foi criada na guilda ${frenteForm.guilda}.`
        });
      }

      setIsFrenteModalOpen(false);
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar frente',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteFrente = (guilda: GuildaKey, frenteNome: string) => {
    if (confirm(`Tem certeza que deseja excluir a frente "${frenteNome}" da guilda ${guilda}? Membros atualmente alocados passarão a "Membro Colaborador".`)) {
      try {
        frentesService.deleteFrente(guilda, frenteNome);
        toast({
          title: 'Frente removida com sucesso!',
          description: `A frente "${frenteNome}" foi excluída.`
        });
      } catch (err: any) {
        toast({
          title: 'Não foi possível excluir a frente',
          description: err.message,
          variant: 'destructive'
        });
      }
    }
  };

  const handleQuickRemoveMemberFromFrente = (membro: MembroRioJunior, frenteNome: string) => {
    if (confirm(`Deseja desvincular ${membro.nome} da frente "${frenteNome}"?`)) {
      membrosCartoesService.saveMembro({
        ...membro,
        cargo: 'Membro Colaborador'
      });
      toast({
        title: 'Membro desvinculado',
        description: `${membro.nome} foi desvinculado(a) da frente "${frenteNome}".`
      });
    }
  };

  // Membros para seleção dentro do modal de Frente
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

  return (
    <div className="space-y-6">
      {/* Top Banner Informativo e Estatísticas Disciplinares */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-card to-background p-5 rounded-2xl border border-cyan-800/30 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShieldAlert size={20} />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Sistema Disciplinar, Membros & Frentes RioJunior
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Gestão oficial de advertências conduzida pela <strong>Guilda de Operações (OP)</strong> baseada em{' '}
              <strong>[RIOJUNIOR] Dados de Membros 2026</strong>, nas frentes de atuação do{' '}
              <strong>[RioJunior] Mapeamento de Papéis 2027</strong> com autonomia de edição para administradores.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={handleExportMembersCSV}
            >
              <FileSpreadsheet size={13} /> Exportar Membros
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={handleExportCardsCSV}
            >
              <FileSpreadsheet size={13} /> Exportar Cartões
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium shadow-xs"
              onClick={() => handleOpenApplyModal()}
            >
              <Plus size={14} /> Aplicar Cartão
            </Button>
          </div>
        </div>

        {/* Cards de Resumo Disciplinar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="bg-card/70 p-3 rounded-xl border border-border">
            <span className="text-[11px] font-medium text-muted-foreground">Membros Ativos</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold text-foreground">{summaryStats.totalMembros}</span>
              <Users size={14} className="text-muted-foreground" />
            </div>
          </div>

          <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
            <span className="text-[11px] font-medium text-emerald-400">Situação Regular</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold text-emerald-400">{summaryStats.conformes}</span>
              <CheckCircle2 size={14} className="text-emerald-400" />
            </div>
          </div>

          <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
            <span className="text-[11px] font-medium text-amber-400">Em Atenção (1 Amarelo)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold text-amber-400">{summaryStats.atencao}</span>
              <AlertTriangle size={14} className="text-amber-400" />
            </div>
          </div>

          <div className="bg-rose-500/5 p-3 rounded-xl border border-rose-500/20">
            <span className="text-[11px] font-medium text-rose-400">Crítico (1 Vermelho)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold text-rose-400">{summaryStats.critico}</span>
              <ShieldAlert size={14} className="text-rose-400" />
            </div>
          </div>

          <div className="bg-destructive/10 p-3 rounded-xl border border-destructive/30">
            <span className="text-[11px] font-medium text-destructive">Desligamento (2 Verm.)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold text-destructive">{summaryStats.desligados}</span>
              <XCircle size={14} className="text-destructive" />
            </div>
          </div>

          <div className="bg-card/70 p-3 rounded-xl border border-border">
            <span className="text-[11px] font-medium text-muted-foreground">Total de Cartões</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold text-foreground">{summaryStats.totalCartoesRegistrados}</span>
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Régua de Regras Oficiais da RioJunior */}
        <div className="bg-muted/40 p-3 rounded-xl border border-border/60 text-xs text-muted-foreground flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-cyan-400 shrink-0" />
            <span>
              <strong>Regimento Disciplinar RioJunior:</strong> Infrações moderadas resultam em{' '}
              <span className="text-amber-400 font-semibold">Cartão Amarelo</span>; Infrações graves resultam em{' '}
              <span className="text-rose-400 font-semibold">Cartão Vermelho</span>.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono">
            <Badge variant="outline" className="border-amber-400/40 text-amber-400">
              2 Amarelos = 1 Vermelho
            </Badge>
            <Badge variant="outline" className="border-rose-400/40 text-rose-400">
              2 Vermelhos = Desligamento
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs de Visualização */}
      <Tabs defaultValue="membros" className="space-y-4">
        <TabsList className="bg-card border border-border p-1 h-auto flex flex-wrap gap-1">
          <TabsTrigger value="membros" className="gap-2 text-xs">
            <Users size={14} />
            <span>Painel Geral de Membros & Cartões ({membros.length})</span>
          </TabsTrigger>
          <TabsTrigger value="historico" className="gap-2 text-xs">
            <ShieldAlert size={14} />
            <span>Histórico de Aplicação de Cartões ({cartoes.length})</span>
          </TabsTrigger>
          <TabsTrigger value="frentes" className="gap-2 text-xs">
            <FolderTree size={14} />
            <span>Aba de Frentes & Papéis</span>
          </TabsTrigger>
        </TabsList>

        {/* --------------------------------------------------------
            ABA 1: TABELA GERAL DE MEMBROS
            -------------------------------------------------------- */}
        <TabsContent value="membros" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar membro por nome, email, guilda ou cargo..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>

              <Select value={guildaFilter} onValueChange={setGuildaFilter}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue placeholder="Guilda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Guildas</SelectItem>
                  {Object.keys(GUILDAS_INFO).map(g => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="afastado">Afastado</SelectItem>
                  <SelectItem value="desligado">Desligado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5 shrink-0"
              onClick={() => handleOpenNewMember()}
            >
              <Plus size={13} /> Cadastrar Membro
            </Button>
          </div>

          {/* Tabela de Membros */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Membro</th>
                    <th className="py-2.5 px-3">Guilda</th>
                    <th className="py-2.5 px-3">Cargo / Papel</th>
                    <th className="py-2.5 px-3">Cartões Ativos</th>
                    <th className="py-2.5 px-3">Status Disciplinar</th>
                    <th className="py-2.5 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredMembros.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        Nenhum membro encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredMembros.map(m => {
                      const mCards = cartoes.filter(c => c.membroId === m.id);
                      const stats = membrosCartoesService.calculateCardStats(mCards);
                      const gInfo = getGuildaInfo(m.guilda);

                      return (
                        <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3">
                            <div
                              className="font-medium text-foreground cursor-pointer hover:underline flex items-center gap-1.5"
                              onClick={() => handleOpenProfile(m.email)}
                              title="Ver perfil completo deste membro"
                            >
                              <span>{m.nome}</span>
                              <Eye size={12} className="text-muted-foreground/70" />
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono">{m.email}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <Badge variant="outline" className="font-mono text-[10px]">
                              {m.guilda}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground max-w-xs truncate" title={m.cargo}>
                            {m.cargo}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              {stats.amarelosCount > 0 ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[10px]">
                                  🟨 {stats.amarelosCount}
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground/60">—</span>
                              )}
                              {stats.totalVermelhos > 0 ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-[10px]">
                                  🟥 {stats.totalVermelhos}
                                </span>
                              ) : null}
                              {stats.convertedRedCount > 0 ? (
                                <span className="text-[9px] text-muted-foreground/70" title="Convertido de 2 amarelos">
                                  ({stats.convertedRedCount} conv.)
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            {stats.isDesligamento ? (
                              <Badge variant="destructive" className="text-[10px] gap-1 font-bold">
                                <XCircle size={10} /> Desligamento
                              </Badge>
                            ) : stats.totalVermelhos === 1 ? (
                              <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-[10px] gap-1">
                                <ShieldAlert size={10} /> Crítico
                              </Badge>
                            ) : stats.amarelosCount > 0 ? (
                              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] gap-1">
                                <AlertTriangle size={10} /> Atenção
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
                                <CheckCircle2 size={10} /> Regular
                              </Badge>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-[11px] gap-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                                onClick={() => handleOpenApplyModal(m.id)}
                                title="Aplicar advertência ou cartão a este membro"
                              >
                                <Plus size={11} /> Cartão
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => handleOpenProfile(m.email)}
                                title="Ver Perfil"
                              >
                                <User size={13} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => handleOpenEditMember(m)}
                                title="Editar Cadastro"
                              >
                                <Pencil size={13} />
                              </Button>
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
            ABA 2: HISTÓRICO DE CARTÕES
            -------------------------------------------------------- */}
        <TabsContent value="historico" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-foreground">Registro de Infrações & Advertências</h3>
              <p className="text-xs text-muted-foreground">
                Histórico auditável de todos os cartões lançados pela guilda de Operações (OP).
              </p>
            </div>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={() => handleOpenApplyModal()}
            >
              <Plus size={14} /> Novo Lançamento
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3">Membro Penalizado</th>
                    <th className="py-2.5 px-3">Tipo</th>
                    <th className="py-2.5 px-3">Categoria</th>
                    <th className="py-2.5 px-3">Motivo Circunstanciado</th>
                    <th className="py-2.5 px-3">Aplicado Por</th>
                    <th className="py-2.5 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {cartoes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        Nenhum cartão disciplinar registrado no momento.
                      </td>
                    </tr>
                  ) : (
                    cartoes.map(c => {
                      const isVermelho = c.tipo === 'vermelho';
                      return (
                        <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                            {c.data}
                          </td>
                          <td className="py-2.5 px-3">
                            <div
                              className="font-medium text-foreground cursor-pointer hover:underline"
                              onClick={() => handleOpenProfile(c.membroEmail)}
                            >
                              {c.membroNome}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {c.membroGuilda} • {c.membroEmail}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            {isVermelho ? (
                              <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[10px] font-bold gap-1">
                                🟥 Vermelho
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-bold gap-1">
                                🟨 Amarelo
                              </Badge>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-foreground">
                            {c.categoria}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground max-w-sm">
                            <p className="line-clamp-2">{c.motivo}</p>
                            {c.observacoes && (
                              <p className="text-[10px] italic text-muted-foreground/70 mt-0.5">
                                Obs: {c.observacoes}
                              </p>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-muted-foreground whitespace-nowrap">
                            {c.aplicadoPor}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                                onClick={() => handleOpenEditCard(c)}
                                title="Editar detalhes do cartão"
                              >
                                <Pencil size={12} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-[11px] text-destructive hover:bg-destructive/10"
                                onClick={() => handleRevokeCard(c.id)}
                                title="Revogar / Excluir cartão"
                              >
                                <Trash2 size={12} />
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
            ABA 3: ABA DE FRENTES & PAPÉIS (DINÂMICA & EDITÁVEL POR ADM)
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
                  Catálogo dinâmico das frentes de atuação de cada Guilda. Administradores podem alterar nomes, descrições, métricas e alocar os membros responsáveis.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar frentes ou objetivos..."
                    value={frentesSearch}
                    onChange={e => setFrentesSearch(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>

                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shrink-0"
                  onClick={() => handleOpenNewFrente()}
                >
                  <Plus size={13} /> Nova Frente / Papel
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
              const status = papel.statusFrente || 'ativa';

              return (
                <div
                  key={`${guilda}_${papel.nome}`}
                  className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                    isDir
                      ? 'border-amber-400/60 bg-gradient-to-br from-amber-500/10 via-card to-amber-500/5 shadow-xs'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header do Card com Status, Guilda e Botões de Edição */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {guilda} • {guildaInfo.nome.split(' ')[0]}
                        </Badge>
                        {isDir ? (
                          <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] gap-1 shadow-xs">
                            👑 Diretoria Executiva
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Frente de Atuação
                          </Badge>
                        )}
                        {status === 'em_estruturacao' && (
                          <Badge variant="outline" className="text-[9px] text-amber-400 border-amber-500/30">
                            Estruturação
                          </Badge>
                        )}
                        {status === 'pausada' && (
                          <Badge variant="outline" className="text-[9px] text-slate-400 border-slate-500/30">
                            Pausada
                          </Badge>
                        )}
                      </div>

                      {/* Botões de Ação do ADM para a Frente */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => handleOpenEditFrente(guilda, papel, assignedMembers)}
                          title="Editar Nome, Descrição e Responsáveis desta frente"
                        >
                          <Pencil size={13} />
                        </Button>
                        {!isDir && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteFrente(guilda, papel.nome)}
                            title="Excluir esta frente"
                          >
                            <Trash2 size={13} />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Título da Frente */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 leading-snug">
                        {isDir && <Crown size={14} className="text-amber-500 shrink-0" />}
                        <span>{papel.nome}</span>
                      </h4>
                    </div>

                    {/* Objetivo Oficial da Frente */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                      {papel.objetivo}
                    </p>

                    {/* Metadados Adicionais (KPIs e Modelo de Trabalho) */}
                    {(papel.indicadores || papel.modeloTrabalho) && (
                      <div className="pt-1 space-y-1 text-[11px] bg-muted/20 p-2 rounded-lg border border-border/40">
                        {papel.indicadores && (
                          <div className="flex items-start gap-1.5 text-muted-foreground">
                            <Target size={12} className="text-primary shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              <strong className="text-foreground font-medium">KPIs:</strong> {papel.indicadores}
                            </span>
                          </div>
                        )}
                        {papel.modeloTrabalho && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock size={12} className="text-muted-foreground shrink-0" />
                            <span className="truncate">
                              <strong className="text-foreground font-medium">Rotina:</strong> {papel.modeloTrabalho}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Rodapé: Membros Alocados e Gestão de Responsáveis */}
                  <div className="pt-3 mt-3 border-t border-border/60 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1">
                        <Users size={12} />
                        Responsáveis Alocados ({assignedMembers.length}):
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[10px] px-2 text-primary hover:bg-primary/10 gap-1 font-medium"
                        onClick={() => handleOpenEditFrente(guilda, papel, assignedMembers)}
                        title="Gerenciar quem é responsável por esta frente"
                      >
                        <SlidersHorizontal size={11} /> Gerenciar
                      </Button>
                    </div>

                    {assignedMembers.length === 0 ? (
                      <div className="p-2.5 rounded-lg bg-muted/20 border border-dashed border-border/60 text-center space-y-1">
                        <p className="text-[11px] text-muted-foreground/70 italic">
                          Nenhum membro vinculado a esta frente no momento.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] px-2 gap-1 text-primary"
                          onClick={() => handleOpenEditFrente(guilda, papel, assignedMembers)}
                        >
                          <Plus size={10} /> Alocar Responsável
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {assignedMembers.map(m => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between p-1.5 rounded-lg bg-muted/30 border border-border/40 text-xs hover:bg-muted/50 group transition-colors"
                          >
                            <div
                              className="flex items-center gap-2 overflow-hidden cursor-pointer flex-1"
                              onClick={() => handleOpenProfile(m.email)}
                              title="Clique para ver o perfil completo do membro"
                            >
                              <div className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                                {m.nome.charAt(0)}
                              </div>
                              <span className="font-medium text-foreground truncate">{m.nome}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {m.status}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-5 w-5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-0 opacity-80 group-hover:opacity-100"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleQuickRemoveMemberFromFrente(m, papel.nome);
                                }}
                                title="Desvincular este membro desta frente"
                              >
                                <X size={11} />
                              </Button>
                            </div>
                          </div>
                        ))}
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
              <ShieldAlert className="text-cyan-400" size={18} />
              {editingCardId ? 'Editar Detalhes do Cartão' : 'Aplicação de Cartão Disciplinar'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Membro Penalizado</Label>
              <Select
                value={applyForm.membroId}
                onValueChange={val => setApplyForm({ ...applyForm, membroId: val })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Selecione o membro..." />
                </SelectTrigger>
                <SelectContent>
                  {membros.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome} ({m.guilda} • {m.cargo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Tipo de Cartão</Label>
                <Select
                  value={applyForm.tipo}
                  onValueChange={(val: CardTipo) => setApplyForm({ ...applyForm, tipo: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amarelo">🟨 Cartão Amarelo (Moderado)</SelectItem>
                    <SelectItem value="vermelho">🟥 Cartão Vermelho (Grave)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Data da Infração</Label>
                <Input
                  type="date"
                  value={applyForm.data}
                  onChange={e => setApplyForm({ ...applyForm, data: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Categoria da Infração</Label>
              <Select
                value={applyForm.categoria}
                onValueChange={val => setApplyForm({ ...applyForm, categoria: val })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Falta em Reunião Geral (RV)">Falta em Reunião Geral (RV)</SelectItem>
                  <SelectItem value="Não entrega de demanda regulamentar">Não entrega de demanda regulamentar</SelectItem>
                  <SelectItem value="Atraso injustificado em rito ou evento">Atraso injustificado em rito ou evento</SelectItem>
                  <SelectItem value="Conduta incompatível com os valores do MEJ">Conduta incompatível com os valores do MEJ</SelectItem>
                  <SelectItem value="Descumprimento de prazos estratégicos">Descumprimento de prazos estratégicos</SelectItem>
                  <SelectItem value="Falta de comunicação com a Guilda">Falta de comunicação com a Guilda</SelectItem>
                  <SelectItem value="Outro motivo circunstanciado">Outro motivo circunstanciado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Motivo Circunstanciado da Infração</Label>
              <Textarea
                placeholder="Descreva detalhadamente o ocorrido, o rito ou o compromisso violado..."
                value={applyForm.motivo}
                onChange={e => setApplyForm({ ...applyForm, motivo: e.target.value })}
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Observações Adicionais (opcional)</Label>
              <Input
                placeholder="Contexto adicional, alinhamentos feitos ou recursos..."
                value={applyForm.observacoes}
                onChange={e => setApplyForm({ ...applyForm, observacoes: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            {impactPreview && (
              <div
                className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                  impactPreview.willDismiss
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    : 'bg-muted/40 border-border text-muted-foreground'
                }`}
              >
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Info size={14} className="text-cyan-400" />
                  Impacto Disciplinar Calculado:
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
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={handleApplyCardSubmit}
            >
              {editingCardId ? 'Salvar Alterações' : 'Confirmar e Aplicar Cartão'}
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
              {isEditingMember ? 'Editar Dados do Membro' : 'Novo Membro da RioJunior'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Nome Completo</Label>
              <Input
                value={memberForm.nome || ''}
                onChange={e => setMemberForm({ ...memberForm, nome: e.target.value })}
                placeholder="Ex: Gabriel Nóbrega"
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">E-mail Oficial</Label>
                <Input
                  value={memberForm.email || ''}
                  onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                  placeholder="nome@riojunior.com.br"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <Select
                  value={memberForm.status || 'ativo'}
                  onValueChange={(val: any) => setMemberForm({ ...memberForm, status: val })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="afastado">Afastado</SelectItem>
                    <SelectItem value="desligado">Desligado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Guilda (Diretoria)</Label>
                <Select
                  value={memberForm.guilda || 'OP'}
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
                      <SelectItem key={g} value={g}>
                        {g} • {GUILDAS_INFO[g as GuildaKey].nome.split(' ')[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Cargo / Frente de Atuação</Label>
                <Select
                  value={memberForm.cargo || 'Gestão de Processos'}
                  onValueChange={val => setMemberForm({ ...memberForm, cargo: val })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getPapeisByGuilda(memberForm.guilda || 'OP').map(p => (
                      <SelectItem key={p.nome} value={p.nome}>
                        {p.isDiretoria ? '👑 ' : ''}{p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                <Label className="text-xs">RG / Identidade</Label>
                <div className="flex gap-1.5">
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
          MODAL: CRIAÇÃO E EDIÇÃO DINÂMICA DE FRENTES & PAPÉIS
          (Permite alterar nome, descrição, metas e responsáveis)
          ======================================================== */}
      <Dialog open={isFrenteModalOpen} onOpenChange={setIsFrenteModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FolderTree size={18} className="text-primary" />
              {isEditingFrente
                ? `Editar Frente: ${originalFrenteNome || frenteForm.nome}`
                : 'Cadastrar Nova Frente / Papel'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Altere o nome oficial, a descrição/objetivo, os indicadores e selecione quais membros da RioJunior são responsáveis por esta frente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Linha 1: Guilda e Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Guilda Responsável</Label>
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

              <div className="space-y-1.5">
                <Label className="text-xs">Status da Frente</Label>
                <Select
                  value={frenteForm.statusFrente}
                  onValueChange={(val: any) => setFrenteForm({ ...frenteForm, statusFrente: val })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativa">🟢 Ativa (Operação Regular)</SelectItem>
                    <SelectItem value="em_estruturacao">🟡 Em Estruturação</SelectItem>
                    <SelectItem value="pausada">⚪ Pausada Temporariamente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Linha 2: Nome da Frente e Checkbox de Diretoria */}
            <div className="space-y-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nome da Frente / Papel</Label>
                <Input
                  value={frenteForm.nome}
                  onChange={e => setFrenteForm({ ...frenteForm, nome: e.target.value })}
                  placeholder="Ex: Prospecção Ativa, Gestão de Processos, Relações Públicas..."
                  className="h-8 text-xs font-medium"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="isDiretoriaCheckbox"
                  checked={frenteForm.isDiretoria}
                  onCheckedChange={(checked: boolean) =>
                    setFrenteForm({ ...frenteForm, isDiretoria: !!checked })
                  }
                />
                <label
                  htmlFor="isDiretoriaCheckbox"
                  className="text-xs font-medium leading-none cursor-pointer flex items-center gap-1.5"
                >
                  <Crown size={13} className="text-amber-500" />
                  Cargo de Nível de Diretoria Executiva da Guilda
                </label>
              </div>
            </div>

            {/* Linha 3: Objetivo e Descrição Oficial da Frente */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Descrição & Objetivo Oficial da Frente</Label>
              <Textarea
                value={frenteForm.objetivo}
                onChange={e => setFrenteForm({ ...frenteForm, objetivo: e.target.value })}
                placeholder="Descreva a finalidade, escopo de atuação e responsabilidades desta frente dentro da Federação..."
                rows={4}
                className="text-xs resize-none leading-relaxed"
              />
            </div>

            {/* Linha 4: Indicadores (KPIs) e Modelo de Trabalho */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Indicadores & KPIs Principais</Label>
                <Input
                  value={frenteForm.indicadores}
                  onChange={e => setFrenteForm({ ...frenteForm, indicadores: e.target.value })}
                  placeholder="Ex: NPS, Taxa de Retenção, Metas de Faturamento..."
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Modelo de Trabalho / Rotina</Label>
                <Input
                  value={frenteForm.modeloTrabalho}
                  onChange={e => setFrenteForm({ ...frenteForm, modeloTrabalho: e.target.value })}
                  placeholder="Ex: Híbrido com ritos semanais, Remoto..."
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Linha 5: Alocação de Membros Responsáveis */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Users size={13} className="text-primary" />
                    Responsáveis Vinculados à Frente ({frenteForm.assignedMemberIds.length} selecionados)
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Marque os membros responsáveis por liderar ou executar as atividades desta frente.
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

              {/* Botões de Seleção Rápida */}
              <div className="flex items-center gap-2 text-[11px]">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] px-2"
                  onClick={() => {
                    const guildaMemberIds = membros
                      .filter(m => m.guilda === frenteForm.guilda)
                      .map(m => m.id);
                    setFrenteForm(prev => ({
                      ...prev,
                      assignedMemberIds: Array.from(new Set([...prev.assignedMemberIds, ...guildaMemberIds]))
                    }));
                  }}
                >
                  + Todos de {frenteForm.guilda}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] px-2 text-muted-foreground hover:text-destructive"
                  onClick={() => setFrenteForm(prev => ({ ...prev, assignedMemberIds: [] }))}
                >
                  Limpar Seleção
                </Button>
              </div>

              {/* Lista Scrollável de Membros com Checkboxes */}
              <div className="border border-border rounded-xl p-2 max-h-48 overflow-y-auto space-y-1 bg-muted/20">
                {membersAvailableForFrenteModal.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground text-xs">
                    Nenhum membro encontrado com este termo.
                  </p>
                ) : (
                  membersAvailableForFrenteModal.map(m => {
                    const isSelected = frenteForm.assignedMemberIds.includes(m.id);
                    const isFromSameGuilda = m.guilda === frenteForm.guilda;

                    return (
                      <div
                        key={m.id}
                        className={`flex items-center justify-between p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-primary/10 border-primary/40 font-medium'
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
                            <span className="text-foreground">{m.nome}</span>
                            <span className="text-[10px] text-muted-foreground ml-1.5">
                              ({m.guilda} • {m.cargo})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isFromSameGuilda && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                              {m.guilda}
                            </Badge>
                          )}
                          {isSelected && (
                            <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0 h-4 font-bold">
                              Alocado
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setIsFrenteModalOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={() => handleSaveFrenteSubmit()}>
              {isEditingFrente ? 'Salvar Alterações da Frente' : 'Criar Frente'}
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
