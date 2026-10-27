// src/components/operations/CartoesMembrosTab.tsx
// Aba Oficial de Aplicação de Cartões e Gestão de Membros da Guilda de Operações (OP)
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
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  getGuildaInfo
} from '@/data/rolesGuildasData';
import { UserProfileModal } from '@/components/profile/UserProfileModal';
import { toast } from '@/hooks/use-toast';

export default function CartoesMembrosTab() {
  const [membros, setMembros] = useState<MembroRioJunior[]>(membrosCartoesService.getMembros());
  const [cartoes, setCartoes] = useState<CartaoAdvertencia[]>(membrosCartoesService.getCartoes());

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [guildaFilter, setGuildaFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modais
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedTargetEmail, setSelectedTargetEmail] = useState<string>('');

  // Formulário de Aplicação de Cartão
  const [applyForm, setApplyForm] = useState<{
    membroId: string;
    tipo: CardTipo;
    categoria: string;
    motivo: string;
    observacoes: string;
    data: string;
  }>({
    membroId: '',
    tipo: 'amarelo',
    categoria: 'Falta em Reunião Geral (RV)',
    motivo: '',
    observacoes: '',
    data: new Date().toISOString().split('T')[0]
  });

  // Formulário de Edição / Cadastro de Membro
  const [memberForm, setMemberForm] = useState<Partial<MembroRioJunior>>({
    guilda: 'OP',
    cargo: 'Gestão de Processos',
    status: 'ativo'
  });
  const [isEditingMember, setIsEditingMember] = useState(false);

  // Sincronização reativa com o serviço
  useEffect(() => {
    const unsub = membrosCartoesService.subscribe(() => {
      setMembros(membrosCartoesService.getMembros());
      setCartoes(membrosCartoesService.getCartoes());
    });
    return unsub;
  }, []);

  // Estatísticas Globais da RioJunior
  const globalStats = useMemo(() => {
    const totalMembros = membros.length;
    const totalCartoes = cartoes.length;
    const totalAmarelos = cartoes.filter(c => c.tipo === 'amarelo').length;
    const totalVermelhos = cartoes.filter(c => c.tipo === 'vermelho').length;

    let membrosEmAtencao = 0;
    let membrosCriticos = 0;
    let membrosDesligamento = 0;

    membros.forEach(m => {
      const mCards = membrosCartoesService.getCartoesByMembro(m.id);
      const st = membrosCartoesService.calculateCardStats(mCards);
      if (st.isDesligamento) membrosDesligamento++;
      else if (st.totalVermelhos === 1) membrosCriticos++;
      else if (st.amarelosCount > 0) membrosEmAtencao++;
    });

    return {
      totalMembros,
      totalCartoes,
      totalAmarelos,
      totalVermelhos,
      membrosEmAtencao,
      membrosCriticos,
      membrosDesligamento
    };
  }, [membros, cartoes]);

  // Lista Filtrada de Membros
  const filteredMembros = useMemo(() => {
    return membros.filter(m => {
      const matchSearch =
        m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.cargo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchGuilda = guildaFilter === 'ALL' || m.guilda === guildaFilter;

      let matchStatus = true;
      if (statusFilter !== 'ALL') {
        const mCards = membrosCartoesService.getCartoesByMembro(m.id);
        const st = membrosCartoesService.calculateCardStats(mCards);
        if (statusFilter === 'regular') matchStatus = st.riscoNivel === 'regular';
        else if (statusFilter === 'atencao') matchStatus = st.riscoNivel === 'atencao';
        else if (statusFilter === 'critico') matchStatus = st.riscoNivel === 'critico';
        else if (statusFilter === 'desligamento') matchStatus = st.riscoNivel === 'desligamento';
      }

      return matchSearch && matchGuilda && matchStatus;
    });
  }, [membros, searchTerm, guildaFilter, statusFilter]);

  // Membro atualmente selecionado no modal de aplicação
  const memberBeingPenalized = useMemo(() => {
    return membros.find(m => m.id === applyForm.membroId);
  }, [membros, applyForm.membroId]);

  const penalizedCurrentStats = useMemo(() => {
    if (!memberBeingPenalized) return null;
    const currentCards = membrosCartoesService.getCartoesByMembro(memberBeingPenalized.id);
    return membrosCartoesService.calculateCardStats(currentCards);
  }, [memberBeingPenalized]);

  // Impacto do novo cartão
  const futureImpact = useMemo(() => {
    if (!penalizedCurrentStats) return null;
    let newAmarelos = penalizedCurrentStats.amarelosCount + (applyForm.tipo === 'amarelo' ? 1 : 0);
    let newVermelhosDiretos = penalizedCurrentStats.vermelhosDiretosCount + (applyForm.tipo === 'vermelho' ? 1 : 0);
    let newVermelhosConvertidos = Math.floor(newAmarelos / 2);
    let newTotalVermelhos = newVermelhosDiretos + newVermelhosConvertidos;
    let willDesligar = newTotalVermelhos >= 2;
    let willConvert = applyForm.tipo === 'amarelo' && newAmarelos % 2 === 0;

    return {
      newAmarelos,
      newTotalVermelhos,
      willDesligar,
      willConvert
    };
  }, [penalizedCurrentStats, applyForm.tipo]);

  // Abrir modal de aplicação pré-selecionando membro
  const handleOpenApplyModal = (membroId?: string) => {
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

  // Submeter aplicação de cartão
  const handleApplyCardSubmit = () => {
    if (!applyForm.membroId) {
      toast({ title: 'Selecione um membro!', variant: 'destructive' });
      return;
    }
    if (!applyForm.motivo.trim()) {
      toast({ title: 'Descreva o motivo da infração!', variant: 'destructive' });
      return;
    }

    try {
      membrosCartoesService.aplicarCartao({
        membroId: applyForm.membroId,
        tipo: applyForm.tipo,
        categoria: applyForm.categoria,
        motivo: applyForm.motivo.trim(),
        data: applyForm.data,
        observacoes: applyForm.observacoes.trim() || undefined,
        aplicadoPor: 'Guilda de Operações (OP)'
      });

      setIsApplyModalOpen(false);
      toast({
        title: `Cartão ${applyForm.tipo === 'vermelho' ? 'Vermelho' : 'Amarelo'} aplicado!`,
        description: `A infração foi registrada e calculada com base no regimento da RioJunior.`
      });
    } catch (err: any) {
      toast({ title: 'Erro ao aplicar cartão', description: err.message, variant: 'destructive' });
    }
  };

  // Abrir edição de membro
  const handleOpenEditMember = (m: MembroRioJunior) => {
    setMemberForm(m);
    setIsEditingMember(true);
    setIsMemberModalOpen(true);
  };

  // Abrir cadastro de novo membro
  const handleOpenNewMember = () => {
    setMemberForm({
      nome: '',
      email: '',
      guilda: 'OP',
      cargo: 'Gestão de Processos',
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
      membrosCartoesService.addMembro({
        nome: memberForm.nome.trim(),
        email: memberForm.email.trim(),
        guilda: (memberForm.guilda as GuildaKey) || 'OP',
        cargo: memberForm.cargo || 'Gestão de Processos',
        cpf: memberForm.cpf || '',
        identidade: memberForm.identidade || '',
        orgaoExpedidor: memberForm.orgaoExpedidor || 'DETRAN-RJ',
        endereco: memberForm.endereco || '',
        nacionalidade: memberForm.nacionalidade || 'brasileira',
        estadoCivil: memberForm.estadoCivil || 'solteiro',
        profissao: memberForm.profissao || 'estudante',
        dataEntrada: new Date().toISOString().split('T')[0],
        status: 'ativo'
      });
      toast({ title: 'Novo membro cadastrado com sucesso!' });
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

  // Revogar cartão
  const handleRevokeCard = (id: string) => {
    if (confirm('Deseja realmente revogar/excluir este registro de cartão?')) {
      membrosCartoesService.deleteCartao(id);
      toast({ title: 'Cartão revogado com sucesso.' });
    }
  };

  // Ver perfil
  const handleViewProfile = (email: string) => {
    setSelectedTargetEmail(email);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Cabeçalho Institucional da Guilda de OP */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-[#0f1c35] to-[#1e3a8a]/20 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40 text-[10px] font-bold uppercase tracking-wider">
                Guilda de Operações (OP)
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">Sistema de Pessoas & Compliance</span>
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <ShieldAlert className="text-amber-500" size={22} />
              Gestão de Membros & Aplicação de Cartões (Advertências)
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl">
              Alinhamento com as planilhas oficiais <strong>[RIOJUNIOR] Dados de Membros 2026</strong> e <strong>[RioJunior] Mapeamento de Papéis 2027</strong>.
              Permite gerenciar a equipe, aplicar cartões disciplinares e sincronizar os acessos à plataforma por e-mail.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5"
              onClick={() => {
                if (confirm('Deseja restaurar a base de membros e cartões para o padrão inicial das planilhas?')) {
                  membrosCartoesService.resetToDefault();
                  toast({ title: 'Dados restaurados para o padrão original!' });
                }
              }}
            >
              <RefreshCw size={13} /> Restaurar Padrão
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5"
              onClick={handleOpenNewMember}
            >
              <Plus size={13} /> Cadastrar Membro
            </Button>
            <Button
              size="sm"
              className="text-xs gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md"
              onClick={() => handleOpenApplyModal()}
            >
              <Flame size={14} /> Aplicar Cartão (OP)
            </Button>
          </div>
        </div>

        {/* Regras do Sistema Resumidas */}
        <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <div className="w-3 h-4 rounded-xs bg-amber-400 shrink-0"></div>
            <span className="text-muted-foreground">
              Infrações <strong>moderadas</strong> = Cartão Amarelo
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/5 border border-rose-500/20">
            <div className="w-3 h-4 rounded-xs bg-rose-500 shrink-0"></div>
            <span className="text-muted-foreground">
              Infrações <strong>graves</strong> = Cartão Vermelho
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <span className="text-sm">⚡</span>
            <span className="text-muted-foreground">
              <strong>2 Amarelos</strong> viram 1 Vermelho
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/5 border border-destructive/20">
            <span className="text-sm">⛔</span>
            <span className="text-muted-foreground">
              <strong>2 Vermelhos</strong> = Desligamento da RJ
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Membros */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Membros na Federação</p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">{globalStats.totalMembros}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Sincronizados com o Excel</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users size={20} />
            </div>
          </CardContent>
        </Card>

        {/* Cartões Amarelos */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Cartões Amarelos Ativos</p>
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-200 mt-0.5">
                {globalStats.totalAmarelos}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {globalStats.membrosEmAtencao} membros em atenção
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <div className="w-4 h-6 rounded-xs bg-amber-400 border border-amber-600"></div>
            </div>
          </CardContent>
        </Card>

        {/* Cartões Vermelhos */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">Cartões Vermelhos Ativos</p>
              <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-200 mt-0.5">
                {globalStats.totalVermelhos}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {globalStats.membrosCriticos} membros em alerta crítico
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <div className="w-4 h-6 rounded-xs bg-rose-500 border border-rose-700"></div>
            </div>
          </CardContent>
        </Card>

        {/* Desligamentos Regulamentares */}
        <Card className={globalStats.membrosDesligamento > 0 ? 'border-destructive/40 bg-destructive/5' : ''}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-destructive">Desligamento Recomendado</p>
              <h3 className="text-2xl font-bold text-destructive mt-0.5">
                {globalStats.membrosDesligamento}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Atingiram 2 cartões vermelhos
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
              <XCircle size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Abas Principais: Membros vs Histórico de Aplicações */}
      <Tabs defaultValue="membros" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="membros" className="gap-2">
            <Users size={14} />
            <span>Membros da Federação</span>
            <Badge variant="secondary" className="text-[10px] ml-1 px-1.5 py-0 h-4">
              {filteredMembros.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="historico" className="gap-2">
            <ShieldAlert size={14} />
            <span>Histórico de Cartões Aplicados (OP)</span>
            <Badge variant="secondary" className="text-[10px] ml-1 px-1.5 py-0 h-4">
              {cartoes.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ========================================================
            ABA 1: LISTA DE MEMBROS E STATUS DOS CARTÕES
            ======================================================== */}
        <TabsContent value="membros" className="space-y-4">
          {/* Barra de Filtros e Busca */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, e-mail ou cargo..."
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Filtro por Guilda */}
              <div className="flex items-center gap-1.5 text-xs">
                <Label className="text-muted-foreground shrink-0 text-xs">Guilda:</Label>
                <Select value={guildaFilter} onValueChange={setGuildaFilter}>
                  <SelectTrigger className="h-9 text-xs w-36">
                    <SelectValue placeholder="Todas as Guildas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">Todas as Guildas</SelectItem>
                    {Object.keys(GUILDAS_INFO).map(g => (
                      <SelectItem key={g} value={g} className="text-xs">
                        {g} - {GUILDAS_INFO[g as GuildaKey].nome.split(' ')[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Status Disciplinar */}
              <div className="flex items-center gap-1.5 text-xs">
                <Label className="text-muted-foreground shrink-0 text-xs">Status:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 text-xs w-36">
                    <SelectValue placeholder="Todos os Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">Todos os Status</SelectItem>
                    <SelectItem value="regular" className="text-xs">🟢 Regular</SelectItem>
                    <SelectItem value="atencao" className="text-xs">🟡 Em Atenção</SelectItem>
                    <SelectItem value="critico" className="text-xs">🔴 Alerta Crítico</SelectItem>
                    <SelectItem value="desligamento" className="text-xs">⛔ Desligamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tabela de Membros */}
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Membro</th>
                    <th className="py-3 px-4">Guilda (Diretoria)</th>
                    <th className="py-3 px-4">Cargo / Frente Mapeada</th>
                    <th className="py-3 px-4 text-center">Cartões</th>
                    <th className="py-3 px-4 text-center">Status</th>
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
                      const mCards = membrosCartoesService.getCartoesByMembro(m.id);
                      const mStats = membrosCartoesService.calculateCardStats(mCards);
                      const gInfo = getGuildaInfo(m.guilda);

                      return (
                        <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                          {/* Membro */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
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
                            <span className="font-medium text-foreground">{m.cargo}</span>
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
                            {mStats.isDesligamento ? (
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
                                variant="outline"
                                className="h-7 text-[11px] px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 gap-1"
                                onClick={() => handleOpenApplyModal(m.id)}
                                title="Aplicar Cartão Disciplinar neste membro"
                              >
                                <ShieldAlert size={12} />
                                <span>Cartão</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => handleViewProfile(m.email)}
                                title="Ver Perfil Individual Completo"
                              >
                                <Eye size={13} />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => handleOpenEditMember(m)}
                                title="Editar Dados Cadastrais"
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

        {/* ========================================================
            ABA 2: HISTÓRICO DE CARTÕES APLICADOS PELA GUILDA OP
            ======================================================== */}
        <TabsContent value="historico" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Registro Oficial de Cartões & Infrações</h3>
              <p className="text-xs text-muted-foreground">
                Auditoria de todas as advertências aplicadas pela Guilda de Operações na gestão.
              </p>
            </div>
            <Button
              size="sm"
              className="text-xs gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
              onClick={() => handleOpenApplyModal()}
            >
              <Plus size={13} /> Novo Lançamento de Cartão
            </Button>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Membro Penalizado</th>
                    <th className="py-3 px-4 text-center">Tipo de Cartão</th>
                    <th className="py-3 px-4">Categoria da Infração</th>
                    <th className="py-3 px-4">Motivo Circunstanciado</th>
                    <th className="py-3 px-4">Aplicado Por</th>
                    <th className="py-3 px-4 text-right">Revogar</th>
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
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRevokeCard(c.id)}
                              title="Revogar este cartão"
                            >
                              <Trash2 size={13} />
                            </Button>
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
      </Tabs>

      {/* ========================================================
          MODAL: APLICAÇÃO DE CARTÃO PELA GUILDA DE OP
          ======================================================== */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert size={20} className="text-amber-500" />
              Aplicação de Cartão Disciplinar (Guilda de OP)
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Lançamento oficial no sistema de advertências da RioJunior.
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

            {/* Painel de Impacto e Alerta em Tempo Real */}
            {memberBeingPenalized && penalizedCurrentStats && futureImpact && (
              <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                futureImpact.willDesligar
                  ? 'bg-destructive/10 border-destructive/40 text-destructive'
                  : futureImpact.willConvert
                  ? 'bg-amber-500/15 border-amber-400 text-amber-900 dark:text-amber-200'
                  : 'bg-muted/40 border-border text-foreground'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Situação Atual do Membro:</span>
                  <span>
                    {penalizedCurrentStats.amarelosCount} Amarelo(s) • {penalizedCurrentStats.totalVermelhos} Vermelho(s)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                  <span>Com este novo cartão:</span>
                  <ArrowRight size={12} />
                  <span>
                    {futureImpact.newAmarelos} Amarelo(s) • {futureImpact.newTotalVermelhos} Vermelho(s)
                  </span>
                </div>

                {futureImpact.willDesligar && (
                  <div className="font-bold flex items-center gap-1.5 text-destructive pt-1">
                    <XCircle size={14} />
                    ATENÇÃO MÁXIMA: Este membro atingirá 2 cartões vermelhos e será encaminhado para DESLIGAMENTO da RioJunior!
                  </div>
                )}

                {futureImpact.willConvert && !futureImpact.willDesligar && (
                  <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300 pt-1">
                    <Flame size={14} />
                    ATENÇÃO: Este 2º cartão amarelo será CONVERTIDO automaticamente em 1 CARTÃO VERMELHO!
                  </div>
                )}
              </div>
            )}

            {/* Tipo de Cartão */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Tipo de Cartão</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setApplyForm({ ...applyForm, tipo: 'amarelo' })}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    applyForm.tipo === 'amarelo'
                      ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/50'
                      : 'border-border bg-card hover:bg-muted/30'
                  }`}
                >
                  <div className="w-4 h-6 rounded-xs bg-amber-400 shrink-0 border border-amber-600 mt-0.5"></div>
                  <div>
                    <div className="font-bold text-amber-900 dark:text-amber-300">Cartão Amarelo</div>
                    <div className="text-[11px] text-muted-foreground">Infrações moderadas (2 viram 1 vermelho)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setApplyForm({ ...applyForm, tipo: 'vermelho' })}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    applyForm.tipo === 'vermelho'
                      ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/50'
                      : 'border-border bg-card hover:bg-muted/30'
                  }`}
                >
                  <div className="w-4 h-6 rounded-xs bg-rose-500 shrink-0 border border-rose-700 mt-0.5"></div>
                  <div>
                    <div className="font-bold text-rose-900 dark:text-rose-300">Cartão Vermelho</div>
                    <div className="text-[11px] text-muted-foreground">Infrações graves (2 viram desligamento)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Categoria e Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Categoria da Infração</Label>
                <Select
                  value={applyForm.categoria}
                  onValueChange={val => setApplyForm({ ...applyForm, categoria: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Falta em Reunião Geral (RV)" className="text-xs">Falta em Reunião Geral (RV)</SelectItem>
                    <SelectItem value="Falta em Capacitação Obrigatória" className="text-xs">Falta em Capacitação Obrigatória</SelectItem>
                    <SelectItem value="Atraso Crítico em Demanda" className="text-xs">Atraso Crítico em Demanda</SelectItem>
                    <SelectItem value="Descumprimento de Diretriz Interna" className="text-xs">Descumprimento de Diretriz Interna</SelectItem>
                    <SelectItem value="Conduta e Compliance" className="text-xs">Conduta e Compliance</SelectItem>
                    <SelectItem value="Quebra de Procedimento" className="text-xs">Quebra de Procedimento</SelectItem>
                    <SelectItem value="Outro" className="text-xs">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Data da Ocorrência</Label>
                <Input
                  type="date"
                  value={applyForm.data}
                  onChange={e => setApplyForm({ ...applyForm, data: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Motivo Detalhado */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Motivo Circunstanciado da Infração</Label>
              <textarea
                value={applyForm.motivo}
                onChange={e => setApplyForm({ ...applyForm, motivo: e.target.value })}
                placeholder="Descreva detalhadamente o que ocorreu, reuniões afetadas ou prazos descumpridos..."
                className="w-full h-20 p-2.5 rounded-lg border border-border bg-background text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Observações Opcionais */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Observações / Orientações do Time de OP (Opcional)</Label>
              <Input
                value={applyForm.observacoes}
                onChange={e => setApplyForm({ ...applyForm, observacoes: e.target.value })}
                placeholder="Ex: Prazo de 5 dias concedido para alinhamento com a diretoria..."
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleApplyCardSubmit}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              Confirmar Aplicação de Cartão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL: CADASTRO / EDIÇÃO DE DADOS DO MEMBRO
          ======================================================== */}
      <Dialog open={isMemberModalOpen} onOpenChange={setIsMemberModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users size={18} className="text-primary" />
              {isEditingMember ? 'Editar Dados do Membro' : 'Cadastrar Novo Membro'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Vínculo cadastral com as frentes da RioJunior e acesso à plataforma via e-mail.
            </p>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Nome Completo</Label>
                <Input
                  value={memberForm.nome || ''}
                  onChange={e => setMemberForm({ ...memberForm, nome: e.target.value })}
                  placeholder="Nome completo do membro"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">E-mail Institucional (@riojunior.com.br)</Label>
                <Input
                  value={memberForm.email || ''}
                  onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                  placeholder="usuario@riojunior.com.br"
                  className="h-8 text-xs"
                />
              </div>
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
                  <SelectContent>
                    {getPapeisByGuilda(memberForm.guilda || 'OP').map(p => (
                      <SelectItem key={p.nome} value={p.nome} className="text-xs">
                        {p.nome}
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

      {/* MODAL DE PERFIL INDIVIDUAL DO MEMBRO */}
      <UserProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        targetMemberEmail={selectedTargetEmail}
      />
    </div>
  );
}
