// src/components/operations/ProcessoSeletivoTab.tsx
// Painel Oficial do Processo Seletivo & Processo Aditivo Gamificado (100% Editável pela Diretoria de Operações)

import { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Users,
  Brain,
  Mic,
  Compass,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  Award,
  Settings2,
  Eye,
  SlidersHorizontal,
  Trophy,
  RotateCcw,
  ExternalLink,
  Search,
  UserPlus,
  ShieldCheck,
  Calendar,
  ListChecks,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  processoSeletivoService,
  PSState,
  PSEtapaModular,
  PSEntregaAditivo,
  PSBadge,
  PSCandidato,
  EtapaStatusCandidato,
  EntregaStatusCandidato,
  NivelGamificacao,
} from '@/services/processoSeletivoService';
import { GUILDAS_INFO, GuildaKey, getPapeisByGuilda } from '@/data/rolesGuildasData';
import CandidatePortalView from './CandidatePortalView';
import { toast } from 'sonner';

export default function ProcessoSeletivoTab() {
  const [psState, setPsState] = useState<PSState>(processoSeletivoService.getState());
  const [activeTab, setActiveTab] = useState<string>('candidatos');

  // Filtros de Candidatos
  const [candSearch, setCandSearch] = useState('');
  const [candGuildaFilter, setCandGuildaFilter] = useState<string>('ALL');

  // Modal: Criar / Editar Etapa Modular
  const [isEtapaModalOpen, setIsEtapaModalOpen] = useState(false);
  const [etapaForm, setEtapaForm] = useState<PSEtapaModular>({
    id: '',
    titulo: '',
    subtitulo: '',
    categoria: 'coletivo',
    descricao: '',
    criteriosAvaliacao: [],
    xpMaximo: 250,
    janelaData: '',
    formato: 'Síncrono via Google Meet',
    linkPadrao: '',
    obrigatoria: true,
  });
  const [criteriosText, setCriteriosText] = useState('');

  // Modal: Criar / Editar Programa ou Entrega do Processo Aditivo
  const [isEntregaModalOpen, setIsEntregaModalOpen] = useState(false);
  const [entregaForm, setEntregaForm] = useState<PSEntregaAditivo>({
    id: '',
    titulo: '',
    tipo: 'entrega',
    guildaAlvo: 'TODAS',
    descricao: '',
    prazo: new Date().toISOString().split('T')[0],
    horarioLimite: '23:59',
    xpReward: 80,
    obrigatoria: true,
    linkTemplate: '',
  });

  // Modal: Criar / Editar Badge
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [badgeForm, setBadgeForm] = useState<PSBadge>({
    id: '',
    icone: '🏅',
    titulo: '',
    descricao: '',
    xpBonus: 30,
    criterioResumo: '',
  });

  // Modal: Criar / Editar Candidato (Dados Cadastrais + Login Externo)
  const [isCandModalOpen, setIsCandModalOpen] = useState(false);
  const [candForm, setCandForm] = useState<PSCandidato>({
    id: '',
    nome: '',
    email: '',
    codigoAcesso: 'RJ2026',
    telefone: '',
    ejOrigem: '',
    ies: '',
    regiao: 'Metropolitana',
    guildaAlvo: 'OP',
    frenteAlvo: 'Gestão de Processos',
    statusGeral: 'aditivo_ativo',
    dataInscricao: new Date().toISOString().split('T')[0],
    etapas: {},
    entregas: {},
    badgesDesbloqueadas: ['badge_passaporte'],
  });

  // Modal: Avaliar Etapas, Entregas e Badges de um Candidato Específico
  const [evaluatingCandId, setEvaluatingCandId] = useState<string | null>(null);

  // Estado do formulário de Concepção Geral
  const [configDraft, setConfigDraft] = useState(psState.config);

  useEffect(() => {
    const unsub = processoSeletivoService.subscribe(() => {
      const next = processoSeletivoService.getState();
      setPsState(next);
      setConfigDraft(next.config);
    });
    return unsub;
  }, []);

  const filteredCandidatos = useMemo(() => {
    return psState.candidatos.filter((c) => {
      const q = candSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.nome.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.ejOrigem.toLowerCase().includes(q) ||
        c.ies.toLowerCase().includes(q) ||
        c.frenteAlvo.toLowerCase().includes(q);
      const matchGuilda = candGuildaFilter === 'ALL' || c.guildaAlvo === candGuildaFilter;
      return matchSearch && matchGuilda;
    });
  }, [psState.candidatos, candSearch, candGuildaFilter]);

  const evaluatingCand = useMemo(
    () => psState.candidatos.find((c) => c.id === evaluatingCandId) || null,
    [psState.candidatos, evaluatingCandId]
  );

  // Métricas globais do PS
  const summaryStats = useMemo(() => {
    const total = psState.candidatos.length;
    if (total === 0) {
      return { total: 0, avgXp: 0, avgPct: 0, emAditivo: 0 };
    }
    let sumXp = 0;
    let sumPct = 0;
    let emAditivo = 0;
    psState.candidatos.forEach((c) => {
      const st = processoSeletivoService.calculateStats(c);
      sumXp += st.totalXp;
      sumPct += st.progressoPct;
      if (c.statusGeral === 'aditivo_ativo' || c.statusGeral === 'aprovado') emAditivo++;
    });
    return {
      total,
      avgXp: Math.round(sumXp / total),
      avgPct: Math.round(sumPct / total),
      emAditivo,
    };
  }, [psState]);

  // =========================================================================
  // HANDLERS DE ETAPAS MODULARES
  // =========================================================================
  const handleOpenNewEtapa = () => {
    setEtapaForm({
      id: 'etapa_' + Date.now(),
      titulo: '',
      subtitulo: '',
      categoria: 'custom',
      descricao: '',
      criteriosAvaliacao: ['Alinhamento com a cultura RioJunior', 'Entrega prática e comunicação'],
      xpMaximo: 200,
      janelaData: 'A definir',
      formato: 'Síncrono ou Assíncrono',
      linkPadrao: '',
      obrigatoria: true,
    });
    setCriteriosText('Alinhamento com a cultura RioJunior\nEntrega prática e comunicação');
    setIsEtapaModalOpen(true);
  };

  const handleOpenEditEtapa = (etapa: PSEtapaModular) => {
    setEtapaForm({ ...etapa });
    setCriteriosText((etapa.criteriosAvaliacao || []).join('\n'));
    setIsEtapaModalOpen(true);
  };

  const handleSaveEtapa = () => {
    if (!etapaForm.titulo.trim()) {
      toast.error('Informe o título da etapa modular.');
      return;
    }
    const criterios = criteriosText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    processoSeletivoService.saveEtapa({
      ...etapaForm,
      titulo: etapaForm.titulo.trim(),
      criteriosAvaliacao: criterios,
      xpMaximo: Number(etapaForm.xpMaximo) || 100,
    });
    toast.success(`Etapa "${etapaForm.titulo}" salva com sucesso!`);
    setIsEtapaModalOpen(false);
  };

  const handleDeleteEtapa = (id: string, titulo: string) => {
    processoSeletivoService.deleteEtapa(id);
    toast.success(`Etapa "${titulo}" removida.`);
  };

  // =========================================================================
  // HANDLERS DE PROGRAMAS E ENTREGAS DO PROCESSO ADITIVO
  // =========================================================================
  const handleOpenNewEntrega = () => {
    setEntregaForm({
      id: 'ent_' + Date.now(),
      titulo: '',
      tipo: 'entrega',
      guildaAlvo: 'TODAS',
      descricao: '',
      prazo: new Date().toISOString().split('T')[0],
      horarioLimite: '23:59',
      xpReward: 80,
      obrigatoria: true,
      linkTemplate: '',
    });
    setIsEntregaModalOpen(true);
  };

  const handleOpenEditEntrega = (entrega: PSEntregaAditivo) => {
    setEntregaForm({ ...entrega });
    setIsEntregaModalOpen(true);
  };

  const handleSaveEntrega = () => {
    if (!entregaForm.titulo.trim()) {
      toast.error('Informe o título do programa ou entrega do Processo Aditivo.');
      return;
    }
    processoSeletivoService.saveEntrega({
      ...entregaForm,
      titulo: entregaForm.titulo.trim(),
      xpReward: Number(entregaForm.xpReward) || 50,
    });
    toast.success(`Programa/Entrega "${entregaForm.titulo}" salvo com sucesso!`);
    setIsEntregaModalOpen(false);
  };

  // =========================================================================
  // HANDLERS DE BADGES / CONQUISTAS
  // =========================================================================
  const handleOpenNewBadge = () => {
    setBadgeForm({
      id: 'badge_' + Date.now(),
      icone: '🌟',
      titulo: '',
      descricao: '',
      xpBonus: 30,
      criterioResumo: '',
    });
    setIsBadgeModalOpen(true);
  };

  const handleOpenEditBadge = (badge: PSBadge) => {
    setBadgeForm({ ...badge });
    setIsBadgeModalOpen(true);
  };

  const handleSaveBadge = () => {
    if (!badgeForm.titulo.trim()) {
      toast.error('Informe o título da conquista.');
      return;
    }
    processoSeletivoService.saveBadge({
      ...badgeForm,
      titulo: badgeForm.titulo.trim(),
      xpBonus: Number(badgeForm.xpBonus) || 25,
    });
    toast.success(`Conquista "${badgeForm.titulo}" salva!`);
    setIsBadgeModalOpen(false);
  };

  // =========================================================================
  // HANDLERS DE CANDIDATOS
  // =========================================================================
  const handleOpenNewCandidato = () => {
    setCandForm({
      id: 'cand_' + Date.now(),
      nome: '',
      email: '',
      codigoAcesso: 'RJ2026',
      telefone: '',
      ejOrigem: '',
      ies: '',
      regiao: 'Metropolitana',
      guildaAlvo: 'OP',
      frenteAlvo: 'Gestão de Processos',
      statusGeral: 'aditivo_ativo',
      dataInscricao: new Date().toISOString().split('T')[0],
      etapas: {},
      entregas: {},
      badgesDesbloqueadas: ['badge_passaporte'],
    });
    setIsCandModalOpen(true);
  };

  const handleOpenEditCandidato = (cand: PSCandidato) => {
    setCandForm({ ...cand });
    setIsCandModalOpen(true);
  };

  const handleSaveCandidato = () => {
    if (!candForm.nome.trim() || !candForm.email.trim()) {
      toast.error('Nome e E-mail de login do candidato são obrigatórios.');
      return;
    }
    processoSeletivoService.saveCandidato({
      ...candForm,
      nome: candForm.nome.trim(),
      email: candForm.email.trim().toLowerCase(),
    });
    toast.success(`Candidato "${candForm.nome}" salvo com acesso externo habilitado!`);
    setIsCandModalOpen(false);
  };

  // =========================================================================
  // HANDLER DE CONCEPÇÃO GERAL
  // =========================================================================
  const handleSaveConfig = () => {
    processoSeletivoService.updateConfig({
      ...configDraft,
      metaXpTotal: Number(configDraft.metaXpTotal) || 1000,
    });
    toast.success('Concepção geral e regras de gamificação do Processo Seletivo atualizadas!');
  };

  const handleUpdateNivel = (idx: number, field: keyof NivelGamificacao, value: string | number) => {
    const nextNiveis = [...configDraft.niveis];
    nextNiveis[idx] = {
      ...nextNiveis[idx],
      [field]: field === 'xpMinimo' || field === 'nivel' ? Number(value) : value,
    };
    setConfigDraft({ ...configDraft, niveis: nextNiveis });
  };

  const handleAddNivel = () => {
    const nextNum = configDraft.niveis.length + 1;
    setConfigDraft({
      ...configDraft,
      niveis: [
        ...configDraft.niveis,
        { nivel: nextNum, titulo: `Nível ${nextNum}`, xpMinimo: nextNum * 250, cor: 'amber' },
      ],
    });
  };

  const handleRemoveNivel = (idx: number) => {
    if (configDraft.niveis.length <= 1) return;
    setConfigDraft({
      ...configDraft,
      niveis: configDraft.niveis.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header do Módulo de Processo Seletivo */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 font-bold">
              🚀 Atração, Seleção & Processo Aditivo Gamificado
            </Badge>
            <Badge variant="outline" className="text-xs">
              Ciclo {psState.config.ciclo} • 100% Editável
            </Badge>
          </div>
          <h3 className="text-xl font-extrabold text-foreground">
            {psState.config.tituloEdicao}
          </h3>
          <p className="text-xs text-muted-foreground max-w-3xl">
            Gerencie as etapas modulares não-lineares (Desafio Coletivo, Desafio Individual, Entrevistas), configure os programas e entregas do Processo Aditivo e controle o acesso restrito gamificado dos candidatos externos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('concepcao')}
            className="text-xs font-bold gap-1.5"
          >
            <SlidersHorizontal size={14} className="text-purple-500" />
            <span>Editar Concepção & Gamificação</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setActiveTab('preview-candidato')}
            className="text-xs font-bold gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Eye size={14} />
            <span>Ver Portal do Candidato Externo</span>
          </Button>
        </div>
      </div>

      {/* KPIs Rápidos do Processo Seletivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold">
            <span>Candidatos Cadastrados</span>
            <Users size={15} className="text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">{summaryStats.total}</p>
          <p className="text-xs text-muted-foreground">
            Com login externo habilitado para o Portal PS
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold">
            <span>Etapas Modulares Ativas</span>
            <Compass size={15} className="text-cyan-500" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">{psState.etapas.length} Blocos</p>
          <p className="text-xs text-muted-foreground">
            Coletivo, Individual, Entrevistas (Não-Lineares)
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold">
            <span>Programas & Entregas Aditivo</span>
            <ListChecks size={15} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            {psState.entregas.length} Entregas
          </p>
          <p className="text-xs text-muted-foreground">
            Prazos, templates e pontuação de XP configurados
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold">
            <span>Progressão Média Gamificada</span>
            <Trophy size={15} className="text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {summaryStats.avgPct}% ({summaryStats.avgXp} XP)
          </p>
          <p className="text-xs text-muted-foreground">
            Meta da trilha: {psState.config.metaXpTotal} XP
          </p>
        </div>
      </div>

      {/* Sub-Abas Internas do Módulo de Processo Seletivo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <div className="overflow-x-auto pb-1">
          <TabsList className="inline-flex h-auto p-1 bg-muted/60 rounded-xl space-x-1 whitespace-nowrap">
            <TabsTrigger value="candidatos" className="text-xs font-bold py-2 px-3.5 gap-1.5">
              <Users size={14} /> Candidatos & Avaliações ({psState.candidatos.length})
            </TabsTrigger>
            <TabsTrigger value="etapas" className="text-xs font-bold py-2 px-3.5 gap-1.5">
              <Compass size={14} /> Etapas Modulares ({psState.etapas.length})
            </TabsTrigger>
            <TabsTrigger value="entregas" className="text-xs font-bold py-2 px-3.5 gap-1.5">
              <ListChecks size={14} /> Programas & Entregas do Aditivo ({psState.entregas.length})
            </TabsTrigger>
            <TabsTrigger value="concepcao" className="text-xs font-bold py-2 px-3.5 gap-1.5">
              <Settings2 size={14} /> Concepção Geral, Níveis & Badges
            </TabsTrigger>
            <TabsTrigger
              value="preview-candidato"
              className="text-xs font-bold py-2 px-3.5 gap-1.5 text-purple-600 dark:text-purple-400"
            >
              <Eye size={14} /> Portal do Candidato Externo (Preview)
            </TabsTrigger>
          </TabsList>
        </div>

        {/* =============================================================== */}
        {/* SUB-ABA 1: CANDIDATOS & AVALIAÇÃO NÃO-LINEAR                    */}
        {/* =============================================================== */}
        <TabsContent value="candidatos" className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-extrabold text-foreground">
                  Quadro de Candidatos & Matriz de Progressão no Processo Aditivo
                </h4>
                <p className="text-xs text-muted-foreground">
                  Cada candidato cadastrado pode fazer login externo usando seu e-mail e código de acesso para acompanhar apenas sua trilha gamificada.
                </p>
              </div>
              <Button onClick={handleOpenNewCandidato} size="sm" className="text-xs font-bold gap-1.5">
                <UserPlus size={14} />
                <span>Novo Candidato (Liberar Login Externo)</span>
              </Button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={candSearch}
                  onChange={(e) => setCandSearch(e.target.value)}
                  placeholder="Buscar por nome, e-mail de login, EJ, IES ou frente..."
                  className="pl-9 text-xs"
                />
              </div>
              <select
                value={candGuildaFilter}
                onChange={(e) => setCandGuildaFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-secondary border border-border text-xs font-bold"
              >
                <option value="ALL">Todas as Guildas Alvo</option>
                {(Object.keys(GUILDAS_INFO) as GuildaKey[]).map((g) => (
                  <option key={g} value={g}>
                    {g} — {GUILDAS_INFO[g].nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabela de Candidatos */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/70 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-3">Candidato & Login Externo</th>
                    <th className="p-3">EJ / IES</th>
                    <th className="p-3">Guilda / Frente Alvo</th>
                    {psState.etapas.map((et) => (
                      <th key={et.id} className="p-3">
                        {et.titulo}
                      </th>
                    ))}
                    <th className="p-3">Entregas Aditivo</th>
                    <th className="p-3">XP / Nível</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCandidatos.map((cand) => {
                    const st = processoSeletivoService.calculateStats(cand);
                    return (
                      <tr key={cand.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-foreground">{cand.nome}</p>
                          <p className="text-muted-foreground text-[11px]">
                            {cand.email} • Cód: <strong>{cand.codigoAcesso}</strong>
                          </p>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold">{cand.ejOrigem}</span>
                          <span className="text-muted-foreground block text-[11px]">{cand.ies}</span>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="font-bold">
                            {cand.guildaAlvo} • {cand.frenteAlvo}
                          </Badge>
                        </td>
                        {psState.etapas.map((et) => {
                          const av = cand.etapas[et.id];
                          const status = av?.status || 'disponivel';
                          return (
                            <td key={et.id} className="p-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                  status === 'concluido'
                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                    : status === 'entregue'
                                    ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                                    : status === 'em_andamento'
                                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                                    : status === 'agendado'
                                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                    : 'bg-secondary text-muted-foreground'
                                }`}
                              >
                                {status === 'concluido'
                                  ? `✓ ${av?.xpGanho || 0} XP`
                                  : status === 'entregue'
                                  ? '📤 Entregue'
                                  : status === 'em_andamento'
                                  ? '🔥 Em Andamento'
                                  : status === 'agendado'
                                  ? '📅 Agendado'
                                  : 'Disponível'}
                              </span>
                            </td>
                          );
                        })}
                        <td className="p-3 font-bold">
                          {st.entregasConcluidas} / {st.totalEntregasAplicaveis} concluídas
                        </td>
                        <td className="p-3">
                          <span className="font-extrabold text-purple-600 dark:text-purple-400 block">
                            ⚡ {st.totalXp} XP ({st.progressoPct}%)
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Nv. {st.nivelAtual.nivel}: {st.nivelAtual.titulo}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEvaluatingCandId(cand.id)}
                              className="h-8 px-2.5 text-xs font-bold gap-1"
                            >
                              <CheckCircle2 size={13} className="text-emerald-500" />
                              <span>Avaliar</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenEditCandidato(cand)}
                              className="h-8 w-8 p-0"
                              title="Editar cadastro e login do candidato"
                            >
                              <Pencil size={13} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                processoSeletivoService.deleteCandidato(cand.id);
                                toast.success('Candidato removido.');
                              }}
                              className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600"
                              title="Remover candidato"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* =============================================================== */}
        {/* SUB-ABA 2: CONCEPÇÃO DAS ETAPAS MODULARES (100% EDITÁVEL)       */}
        {/* =============================================================== */}
        <TabsContent value="etapas" className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h4 className="text-base font-extrabold text-foreground">
                  Configuração das Etapas Modulares (Desafio Coletivo, Individual, Entrevistas e Outras)
                </h4>
                <p className="text-xs text-muted-foreground">
                  Edite títulos, descrições, critérios avaliados, datas e pontuação máxima de XP de cada etapa, ou adicione novos módulos ao processo seletivo.
                </p>
              </div>
              <Button onClick={handleOpenNewEtapa} size="sm" className="text-xs font-bold gap-1.5">
                <Plus size={14} />
                <span>Nova Etapa Modular</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {psState.etapas.map((etapa) => (
                <div
                  key={etapa.id}
                  className="p-5 rounded-2xl border border-border bg-secondary/30 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="outline" className="text-[11px] uppercase mb-1">
                          Módulo: {etapa.categoria}
                        </Badge>
                        <h5 className="text-base font-extrabold text-foreground">{etapa.titulo}</h5>
                      </div>
                      <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 font-extrabold">
                        {etapa.xpMaximo} XP
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-foreground/90">{etapa.subtitulo}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{etapa.descricao}</p>

                    <div className="space-y-1 pt-1">
                      <span className="text-xs font-bold text-foreground">Critérios de Avaliação:</span>
                      <ul className="space-y-1">
                        {etapa.criteriosAvaliacao.map((c, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border space-y-3">
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>
                        <strong>Janela / Prazo:</strong> {etapa.janelaData}
                      </p>
                      <p>
                        <strong>Formato:</strong> {etapa.formato}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditEtapa(etapa)}
                        className="text-xs font-bold gap-1.5 flex-1"
                      >
                        <Pencil size={13} />
                        <span>Editar Etapa</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteEtapa(etapa.id, etapa.titulo)}
                        className="text-rose-500 hover:text-rose-600"
                        title="Excluir etapa"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* =============================================================== */}
        {/* SUB-ABA 3: PROGRAMAS & ENTREGAS DO PROCESSO ADITIVO (EDITÁVEL)  */}
        {/* =============================================================== */}
        <TabsContent value="entregas" className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h4 className="text-base font-extrabold text-foreground">
                  Programas, Ritos e Entregas do Processo Aditivo (100% Editáveis)
                </h4>
                <p className="text-xs text-muted-foreground">
                  Defina quais programas e entregas precisam ser feitos pelos candidatos, estipule os prazos, direcione por Guilda e configure o XP de recompensa.
                </p>
              </div>
              <Button onClick={handleOpenNewEntrega} size="sm" className="text-xs font-bold gap-1.5">
                <Plus size={14} />
                <span>Novo Programa / Entrega</span>
              </Button>
            </div>

            <div className="space-y-3">
              {psState.entregas.map((entrega, idx) => (
                <div
                  key={entrega.id}
                  className="p-4 rounded-xl border border-border bg-secondary/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-foreground">
                        {idx + 1}. {entrega.titulo}
                      </span>
                      <Badge variant="outline" className="text-xs uppercase">
                        {entrega.tipo}
                      </Badge>
                      <Badge className="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs">
                        Guilda: {entrega.guildaAlvo}
                      </Badge>
                      <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-extrabold">
                        +{entrega.xpReward} XP
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{entrega.descricao}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                        <Clock size={12} /> Prazo: {entrega.prazo.split('-').reverse().join('/')} às{' '}
                        {entrega.horarioLimite}
                      </span>
                      {entrega.linkTemplate && (
                        <a
                          href={entrega.linkTemplate}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> Material / Template
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEditEntrega(entrega)}
                      className="text-xs font-bold gap-1.5"
                    >
                      <Pencil size={13} />
                      <span>Editar</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        processoSeletivoService.deleteEntrega(entrega.id);
                        toast.success(`Entrega "${entrega.titulo}" removida.`);
                      }}
                      className="text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* =============================================================== */}
        {/* SUB-ABA 4: CONCEPÇÃO GERAL, NÍVEIS DE GAMIFICAÇÃO E BADGES      */}
        {/* =============================================================== */}
        <TabsContent value="concepcao" className="space-y-6">
          {/* Bloco A: Textos, Títulos, Meta de XP e Links */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h4 className="text-base font-extrabold text-foreground">
                  Concepção Geral do Painel & Textos do Portal do Candidato
                </h4>
                <p className="text-xs text-muted-foreground">
                  Personalize todos os títulos, avisos de ordem não-cronológica, meta de XP e links de apoio exibidos para o time e para os candidatos externos.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Restaurar toda a concepção do Processo Seletivo para o modelo padrão?')) {
                      processoSeletivoService.resetToDefault();
                      toast.info('Concepção restaurada para o padrão oficial.');
                    }
                  }}
                  className="text-xs font-bold gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Restaurar Padrão</span>
                </Button>
                <Button onClick={handleSaveConfig} size="sm" className="text-xs font-bold gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Salvar Concepção</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Título da Edição do Processo Seletivo</label>
                <Input
                  value={configDraft.tituloEdicao}
                  onChange={(e) => setConfigDraft({ ...configDraft, tituloEdicao: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Ciclo / Semestre</label>
                <Input
                  value={configDraft.ciclo}
                  onChange={(e) => setConfigDraft({ ...configDraft, ciclo: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Meta de XP Total (100% da Barra)</label>
                <Input
                  type="number"
                  value={configDraft.metaXpTotal}
                  onChange={(e) =>
                    setConfigDraft({ ...configDraft, metaXpTotal: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Mensagem de Boas-Vindas no Portal do Candidato</label>
                <Textarea
                  rows={2}
                  value={configDraft.mensagemBoasVindasCandidato}
                  onChange={(e) =>
                    setConfigDraft({ ...configDraft, mensagemBoasVindasCandidato: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Aviso sobre Etapas Não-Lineares / Ordem Livre</label>
                <Textarea
                  rows={2}
                  value={configDraft.avisoOrdemNaoLinear}
                  onChange={(e) =>
                    setConfigDraft({ ...configDraft, avisoOrdemNaoLinear: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Link do Edital / Guia do Candidato</label>
                <Input
                  value={configDraft.linkEdital}
                  onChange={(e) => setConfigDraft({ ...configDraft, linkEdital: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Link do Canal de Avisos / WhatsApp</label>
                <Input
                  value={configDraft.linkComunidade}
                  onChange={(e) =>
                    setConfigDraft({ ...configDraft, linkComunidade: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Editor de Níveis de Gamificação */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-extrabold text-foreground">
                    Régua de Níveis da Gamificação (Progressão de XP)
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Configure os títulos e a pontuação mínima de XP para cada nível alcançado pelo candidato.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddNivel} className="text-xs font-bold">
                  + Adicionar Nível
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {configDraft.niveis.map((nv, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-border bg-secondary/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-primary">Nível {nv.nivel}</span>
                      {configDraft.niveis.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveNivel(idx)}
                          className="text-xs text-rose-500 hover:underline"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                    <Input
                      value={nv.titulo}
                      onChange={(e) => handleUpdateNivel(idx, 'titulo', e.target.value)}
                      placeholder="Título do Nível"
                      className="text-xs h-8"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground shrink-0">XP Mínimo:</span>
                      <Input
                        type="number"
                        value={nv.xpMinimo}
                        onChange={(e) => handleUpdateNivel(idx, 'xpMinimo', e.target.value)}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bloco B: Conquistas / Badges Gamificadas */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h4 className="text-base font-extrabold text-foreground">
                  Conquistas & Insígnias Gamificadas (Badges Editáveis)
                </h4>
                <p className="text-xs text-muted-foreground">
                  Crie ou edite as medalhas que bonificam os candidatos com XP extra ao longo do processo seletivo e aditivo.
                </p>
              </div>
              <Button onClick={handleOpenNewBadge} size="sm" className="text-xs font-bold gap-1.5">
                <Plus size={14} />
                <span>Nova Conquista (Badge)</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {psState.badges.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-border bg-secondary/30 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{b.icone}</span>
                      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-extrabold">
                        +{b.xpBonus} XP
                      </Badge>
                    </div>
                    <h5 className="text-sm font-extrabold text-foreground">{b.titulo}</h5>
                    <p className="text-xs text-muted-foreground">{b.descricao}</p>
                    <p className="text-[11px] font-semibold text-primary">
                      Critério: {b.criterioResumo}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEditBadge(b)}
                      className="text-xs font-bold h-7 px-2.5"
                    >
                      <Pencil size={12} className="mr-1" /> Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        processoSeletivoService.deleteBadge(b.id);
                        toast.success('Conquista removida.');
                      }}
                      className="h-7 w-7 p-0 text-rose-500"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* =============================================================== */}
        {/* SUB-ABA 5: PREVIEW AO VIVO DO PORTAL DO CANDIDATO EXTERNO       */}
        {/* =============================================================== */}
        <TabsContent value="preview-candidato">
          <CandidatePortalView isStandaloneExternalLogin={false} />
        </TabsContent>
      </Tabs>

      {/* ================================================================= */}
      {/* MODAL 1: CRIAR / EDITAR ETAPA MODULAR                             */}
      {/* ================================================================= */}
      <Dialog open={isEtapaModalOpen} onOpenChange={setIsEtapaModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurar Etapa Modular do Processo Seletivo</DialogTitle>
            <DialogDescription>
              As etapas são não-lineares e podem ocorrer em qualquer ordem cronológica.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold">Título da Etapa</label>
                <Input
                  value={etapaForm.titulo}
                  onChange={(e) => setEtapaForm({ ...etapaForm, titulo: e.target.value })}
                  placeholder="Ex.: Desafio Coletivo"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">Categoria / Ícone</label>
                <select
                  value={etapaForm.categoria}
                  onChange={(e) =>
                    setEtapaForm({
                      ...etapaForm,
                      categoria: e.target.value as PSEtapaModular['categoria'],
                    })
                  }
                  className="w-full h-10 px-3 rounded-md bg-background border border-input text-xs font-semibold"
                >
                  <option value="coletivo">Desafio Coletivo (Grupo)</option>
                  <option value="individual">Desafio Individual (Case Técnico)</option>
                  <option value="entrevista">Entrevista / Sabatina</option>
                  <option value="imersao">Imersão / Dinâmica</option>
                  <option value="custom">Módulo Personalizado</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold">Subtítulo Resumido</label>
              <Input
                value={etapaForm.subtitulo}
                onChange={(e) => setEtapaForm({ ...etapaForm, subtitulo: e.target.value })}
                placeholder="Ex.: Dinâmica em grupo e resolução colaborativa"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold">Descrição Detalhada para o Candidato</label>
              <Textarea
                rows={3}
                value={etapaForm.descricao}
                onChange={(e) => setEtapaForm({ ...etapaForm, descricao: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold">Critérios Avaliados (1 por linha)</label>
              <Textarea
                rows={3}
                value={criteriosText}
                onChange={(e) => setCriteriosText(e.target.value)}
                placeholder="Escuta ativa&#10;Visão sistêmica&#10;Fit cultural"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold">Pontuação Máxima (XP)</label>
                <Input
                  type="number"
                  value={etapaForm.xpMaximo}
                  onChange={(e) => setEtapaForm({ ...etapaForm, xpMaximo: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">Janela de Datas / Prazo</label>
                <Input
                  value={etapaForm.janelaData}
                  onChange={(e) => setEtapaForm({ ...etapaForm, janelaData: e.target.value })}
                  placeholder="Ex.: 04/11 a 12/11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold">Formato de Realização</label>
                <Input
                  value={etapaForm.formato}
                  onChange={(e) => setEtapaForm({ ...etapaForm, formato: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">Link Padrão (Sala Meet / Pasta Case)</label>
                <Input
                  value={etapaForm.linkPadrao || ''}
                  onChange={(e) => setEtapaForm({ ...etapaForm, linkPadrao: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEtapaModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEtapa}>Salvar Etapa Modular</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================================================================= */}
      {/* MODAL 2: CRIAR / EDITAR PROGRAMA OU ENTREGA DO PROCESSO ADITIVO   */}
      {/* ================================================================= */}
      <Dialog open={isEntregaModalOpen} onOpenChange={setIsEntregaModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Configurar Programa ou Entrega — Processo Aditivo</DialogTitle>
            <DialogDescription>
              Defina os entregáveis, imersões e prazos que aparecem no checklist gamificado dos candidatos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold">Título do Programa / Entrega</label>
              <Input
                value={entregaForm.titulo}
                onChange={(e) => setEntregaForm({ ...entregaForm, titulo: e.target.value })}
                placeholder="Ex.: Programa de Imersão no PE da Rede 25-27"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold">Tipo</label>
                <select
                  value={entregaForm.tipo}
                  onChange={(e) =>
                    setEntregaForm({
                      ...entregaForm,
                      tipo: e.target.value as PSEntregaAditivo['tipo'],
                    })
                  }
                  className="w-full h-10 px-3 rounded-md bg-background border border-input text-xs font-semibold"
                >
                  <option value="programa">Programa / Imersão</option>
                  <option value="entrega">Entrega Prática</option>
                  <option value="rito">Rito / Shadowing</option>
                  <option value="desafio">Desafio Técnico</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold">Guilda Alvo</label>
                <select
                  value={entregaForm.guildaAlvo}
                  onChange={(e) =>
                    setEntregaForm({
                      ...entregaForm,
                      guildaAlvo: e.target.value as PSEntregaAditivo['guildaAlvo'],
                    })
                  }
                  className="w-full h-10 px-3 rounded-md bg-background border border-input text-xs font-semibold"
                >
                  <option value="TODAS">Todas as Guildas</option>
                  {(Object.keys(GUILDAS_INFO) as GuildaKey[]).map((g) => (
                    <option key={g} value={g}>
                      Apenas {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold">Recompensa (+XP)</label>
                <Input
                  type="number"
                  value={entregaForm.xpReward}
                  onChange={(e) =>
                    setEntregaForm({ ...entregaForm, xpReward: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold">Instruções / O que deve ser entregue</label>
              <Textarea
                rows={3}
                value={entregaForm.descricao}
                onChange={(e) => setEntregaForm({ ...entregaForm, descricao: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold">Data Limite (Prazo)</label>
                <Input
                  type="date"
                  value={entregaForm.prazo}
                  onChange={(e) => setEntregaForm({ ...entregaForm, prazo: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">Horário Limite</label>
                <Input
                  value={entregaForm.horarioLimite}
                  onChange={(e) => setEntregaForm({ ...entregaForm, horarioLimite: e.target.value })}
                  placeholder="23:59"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">Link do Guia / Template</label>
                <Input
                  value={entregaForm.linkTemplate || ''}
                  onChange={(e) => setEntregaForm({ ...entregaForm, linkTemplate: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEntregaModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEntrega}>Salvar Programa / Entrega</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================================================================= */}
      {/* MODAL 3: CRIAR / EDITAR BADGE GAMIFICADA                          */}
      {/* ================================================================= */}
      <Dialog open={isBadgeModalOpen} onOpenChange={setIsBadgeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Conquista / Badge Gamificada</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold">Emoji / Ícone</label>
                <Input
                  value={badgeForm.icone}
                  onChange={(e) => setBadgeForm({ ...badgeForm, icone: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="font-bold">Título da Conquista</label>
                <Input
                  value={badgeForm.titulo}
                  onChange={(e) => setBadgeForm({ ...badgeForm, titulo: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-bold">Descrição da Medalha</label>
              <Textarea
                rows={2}
                value={badgeForm.descricao}
                onChange={(e) => setBadgeForm({ ...badgeForm, descricao: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold">Bônus de XP (+XP)</label>
                <Input
                  type="number"
                  value={badgeForm.xpBonus}
                  onChange={(e) => setBadgeForm({ ...badgeForm, xpBonus: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">Resumo de Desbloqueio</label>
                <Input
                  value={badgeForm.criterioResumo}
                  onChange={(e) => setBadgeForm({ ...badgeForm, criterioResumo: e.target.value })}
                  placeholder="Ex.: Entregar Case no prazo"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBadgeModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveBadge}>Salvar Conquista</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================================================================= */}
      {/* MODAL 4: CADASTRAR / EDITAR CANDIDATO (LOGIN EXTERNO)             */}
      {/* ================================================================= */}
      <Dialog open={isCandModalOpen} onOpenChange={setIsCandModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cadastro de Candidato & Credencial de Acesso Externo</DialogTitle>
            <DialogDescription>
              O candidato poderá acessar o Portal do Processo Seletivo informando o e-mail e o código de acesso abaixo na tela de Login.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold">Nome Completo</label>
                <Input
                  value={candForm.nome}
                  onChange={(e) => setCandForm({ ...candForm, nome: e.target.value })}
                  placeholder="Nome do candidato"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">Telefone / WhatsApp</label>
                <Input
                  value={candForm.telefone}
                  onChange={(e) => setCandForm({ ...candForm, telefone: e.target.value })}
                  placeholder="(21) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <div className="col-span-2 space-y-1">
                <label className="font-bold text-purple-700 dark:text-purple-300">
                  E-mail para Login Externo (Portal PS)
                </label>
                <Input
                  value={candForm.email}
                  onChange={(e) => setCandForm({ ...candForm, email: e.target.value })}
                  placeholder="candidato@ej.com.br"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-purple-700 dark:text-purple-300">
                  Senha / Código PS
                </label>
                <Input
                  value={candForm.codigoAcesso}
                  onChange={(e) => setCandForm({ ...candForm, codigoAcesso: e.target.value })}
                  placeholder="RJ2026"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold">Empresa Júnior (EJ)</label>
                <Input
                  value={candForm.ejOrigem}
                  onChange={(e) => setCandForm({ ...candForm, ejOrigem: e.target.value })}
                  placeholder="Ex.: Fluxo Consultoria"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">Universidade (IES)</label>
                <Input
                  value={candForm.ies}
                  onChange={(e) => setCandForm({ ...candForm, ies: e.target.value })}
                  placeholder="Ex.: UFRJ"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold">Guilda Pretendida</label>
                <select
                  value={candForm.guildaAlvo}
                  onChange={(e) => {
                    const g = e.target.value as GuildaKey;
                    const papeis = getPapeisByGuilda(g);
                    setCandForm({
                      ...candForm,
                      guildaAlvo: g,
                      frenteAlvo: papeis[0]?.nome || 'Membro',
                    });
                  }}
                  className="w-full h-10 px-3 rounded-md bg-background border border-input text-xs font-semibold"
                >
                  {(Object.keys(GUILDAS_INFO) as GuildaKey[]).map((g) => (
                    <option key={g} value={g}>
                      {g} — {GUILDAS_INFO[g].nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold">Frente / Papel Pretendido</label>
                <select
                  value={candForm.frenteAlvo}
                  onChange={(e) => setCandForm({ ...candForm, frenteAlvo: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-background border border-input text-xs font-semibold"
                >
                  {getPapeisByGuilda(candForm.guildaAlvo).map((p) => (
                    <option key={p.nome} value={p.nome}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCandModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCandidato}>Salvar Candidato</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================================================================= */}
      {/* MODAL 5: AVALIAR ETAPAS, ENTREGAS E BADGES DE UM CANDIDATO        */}
      {/* ================================================================= */}
      <Dialog open={!!evaluatingCand} onOpenChange={(o) => !o && setEvaluatingCandId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {evaluatingCand && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Avaliação & Progressão Individual — {evaluatingCand.nome}
                </DialogTitle>
                <DialogDescription>
                  {evaluatingCand.ejOrigem} ({evaluatingCand.ies}) • Vaga:{' '}
                  {evaluatingCand.guildaAlvo} — {evaluatingCand.frenteAlvo}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-2 text-xs">
                {/* 1. Avaliação das Etapas Modulares */}
                <div className="space-y-3">
                  <h5 className="font-extrabold text-sm text-foreground">
                    1. Status, Agendamento, XP e Feedback nas Etapas Modulares
                  </h5>
                  <div className="space-y-3">
                    {psState.etapas.map((etapa) => {
                      const av = evaluatingCand.etapas[etapa.id] || {
                        etapaId: etapa.id,
                        status: 'disponivel' as EtapaStatusCandidato,
                        xpGanho: 0,
                      };
                      return (
                        <div
                          key={etapa.id}
                          className="p-3.5 rounded-xl border border-border bg-secondary/30 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-extrabold text-sm">
                              {etapa.titulo}{' '}
                              <span className="text-muted-foreground font-normal">
                                (Máx: {etapa.xpMaximo} XP)
                              </span>
                            </span>
                            <div className="flex items-center gap-2">
                              <select
                                value={av.status}
                                onChange={(e) => {
                                  const nextStatus = e.target.value as EtapaStatusCandidato;
                                  const autoXp =
                                    nextStatus === 'concluido' && !av.xpGanho
                                      ? etapa.xpMaximo
                                      : av.xpGanho;
                                  processoSeletivoService.updateCandidatoEtapa(
                                    evaluatingCand.id,
                                    etapa.id,
                                    { status: nextStatus, xpGanho: autoXp }
                                  );
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-card border border-border font-bold text-xs"
                              >
                                <option value="disponivel">Disponível</option>
                                <option value="agendado">📅 Agendado</option>
                                <option value="em_andamento">🔥 Em Andamento</option>
                                <option value="entregue">📤 Entregue / Em Avaliação</option>
                                <option value="concluido">✓ Concluído / Aprovado</option>
                                <option value="revisao">⚠️ Revisão Solicitada</option>
                              </select>

                              <div className="flex items-center gap-1">
                                <span className="font-bold">XP:</span>
                                <Input
                                  type="number"
                                  value={av.xpGanho}
                                  onChange={(e) =>
                                    processoSeletivoService.updateCandidatoEtapa(
                                      evaluatingCand.id,
                                      etapa.id,
                                      { xpGanho: Number(e.target.value) }
                                    )
                                  }
                                  className="w-20 h-8 text-xs"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <Input
                              value={av.dataAgendada || ''}
                              onChange={(e) =>
                                processoSeletivoService.updateCandidatoEtapa(
                                  evaluatingCand.id,
                                  etapa.id,
                                  { dataAgendada: e.target.value }
                                )
                              }
                              placeholder="Data/Horário agendado (ex.: 08/11 às 18h)"
                              className="text-xs h-8"
                            />
                            <Input
                              value={av.feedbackPublico || ''}
                              onChange={(e) =>
                                processoSeletivoService.updateCandidatoEtapa(
                                  evaluatingCand.id,
                                  etapa.id,
                                  { feedbackPublico: e.target.value }
                                )
                              }
                              placeholder="Feedback ou orientação visível no portal do candidato..."
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Validação de Programas e Entregas do Processo Aditivo */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <h5 className="font-extrabold text-sm text-foreground">
                    2. Entregas & Programas do Processo Aditivo
                  </h5>
                  <div className="space-y-2">
                    {psState.entregas.map((ent) => {
                      const prog = evaluatingCand.entregas[ent.id] || {
                        entregaId: ent.id,
                        status: 'pendente' as EntregaStatusCandidato,
                        xpConcedido: 0,
                      };
                      return (
                        <div
                          key={ent.id}
                          className="p-3 rounded-xl border border-border bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <p className="font-bold text-foreground">
                              {ent.titulo} (+{ent.xpReward} XP)
                            </p>
                            {prog.linkEntrega && (
                              <a
                                href={prog.linkEntrega}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary underline text-[11px]"
                              >
                                Abrir link enviado pelo candidato
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <select
                              value={prog.status}
                              onChange={(e) => {
                                const st = e.target.value as EntregaStatusCandidato;
                                processoSeletivoService.updateCandidatoEntrega(
                                  evaluatingCand.id,
                                  ent.id,
                                  {
                                    status: st,
                                    xpConcedido:
                                      st === 'validado' || st === 'entregue' ? ent.xpReward : 0,
                                  }
                                );
                              }}
                              className="px-2.5 py-1 rounded-lg bg-card border border-border font-bold text-xs"
                            >
                              <option value="pendente">Pendente</option>
                              <option value="em_andamento">Em Andamento</option>
                              <option value="entregue">📤 Entregue</option>
                              <option value="validado">✓ Validado (+{ent.xpReward} XP)</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Conquistas / Badges do Candidato */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <h5 className="font-extrabold text-sm text-foreground">
                    3. Conquistas Desbloqueadas (Clique para conceder ou remover)
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {psState.badges.map((b) => {
                      const active = evaluatingCand.badgesDesbloqueadas.includes(b.id);
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() =>
                            processoSeletivoService.toggleCandidatoBadge(evaluatingCand.id, b.id)
                          }
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                            active
                              ? 'bg-amber-500/20 border-amber-500 text-foreground shadow-xs'
                              : 'bg-secondary border-border text-muted-foreground opacity-60'
                          }`}
                        >
                          <span>{b.icone}</span>
                          <span>{b.titulo}</span>
                          <span className="text-amber-500">+{b.xpBonus} XP</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setEvaluatingCandId(null)}>Concluir Avaliação</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
