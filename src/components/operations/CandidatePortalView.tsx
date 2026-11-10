// src/components/operations/CandidatePortalView.tsx
// Portal Gamificado do Candidato Externo (Acesso Restrito via Login ou Preview Interno da OP)

import { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Trophy,
  Clock,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Send,
  ShieldCheck,
  Award,
  FileText,
  Users,
  Brain,
  Mic,
  Compass,
  LogOut,
  Info,
  Flame,
  Lock,
  Unlock,
  CheckSquare,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  PSCandidato,
  PSEtapaModular,
  PSEntregaAditivo,
} from '@/services/processoSeletivoService';
import { getGuildaInfo } from '@/data/rolesGuildasData';
import { toast } from 'sonner';

interface CandidatePortalViewProps {
  candidateEmail?: string | null;
  candidateId?: string | null;
  isStandaloneExternalLogin?: boolean;
  onLogout?: () => void;
  onExitPreview?: () => void;
}

export default function CandidatePortalView({
  candidateEmail,
  candidateId,
  isStandaloneExternalLogin = false,
  onLogout,
  onExitPreview,
}: CandidatePortalViewProps) {
  const [psState, setPsState] = useState<PSState>(processoSeletivoService.getState());
  const [selectedCandId, setSelectedCandId] = useState<string>('');

  // Modal de envio de entrega do Processo Aditivo ou Desafio Individual
  const [submittingEntrega, setSubmittingEntrega] = useState<PSEntregaAditivo | null>(null);
  const [entregaLink, setEntregaLink] = useState('');
  const [entregaComentario, setEntregaComentario] = useState('');

  const [submittingEtapa, setSubmittingEtapa] = useState<PSEtapaModular | null>(null);
  const [etapaLink, setEtapaLink] = useState('');

  useEffect(() => {
    const unsub = processoSeletivoService.subscribe(() => {
      setPsState(processoSeletivoService.getState());
    });
    return unsub;
  }, []);

  const candidato: PSCandidato | undefined = useMemo(() => {
    if (selectedCandId) {
      const byId = psState.candidatos.find((c) => c.id === selectedCandId);
      if (byId) return byId;
    }
    if (candidateId) {
      const byPropId = psState.candidatos.find((c) => c.id === candidateId);
      if (byPropId) return byPropId;
    }
    if (candidateEmail) {
      const byEmail = psState.candidatos.find(
        (c) => c.email.toLowerCase() === candidateEmail.toLowerCase()
      );
      if (byEmail) return byEmail;
    }
    return psState.candidatos[0];
  }, [psState, selectedCandId, candidateId, candidateEmail]);

  if (!candidato) {
    return (
      <div className="p-8 text-center bg-card border border-border rounded-2xl">
        <p className="text-sm text-muted-foreground">
          Nenhum candidato cadastrado ainda no Processo Seletivo.
        </p>
      </div>
    );
  }

  const stats = processoSeletivoService.calculateStats(candidato);
  const guildaInfo = getGuildaInfo(candidato.guildaAlvo);

  const entregasAplicaveis = psState.entregas.filter(
    (e) => e.guildaAlvo === 'TODAS' || e.guildaAlvo === candidato.guildaAlvo
  );

  const getEtapaIcon = (categoria: PSEtapaModular['categoria']) => {
    switch (categoria) {
      case 'coletivo':
        return <Users size={18} className="text-purple-500" />;
      case 'individual':
        return <Brain size={18} className="text-cyan-500" />;
      case 'entrevista':
        return <Mic size={18} className="text-amber-500" />;
      default:
        return <Compass size={18} className="text-emerald-500" />;
    }
  };

  const getStatusBadgeEtapa = (status?: string) => {
    switch (status) {
      case 'concluido':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            ✓ Concluído
          </Badge>
        );
      case 'entregue':
        return (
          <Badge className="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
            📤 Entregue / Em Avaliação
          </Badge>
        );
      case 'em_andamento':
        return (
          <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30">
            🔥 Em Andamento
          </Badge>
        );
      case 'agendado':
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
            📅 Agendado
          </Badge>
        );
      case 'revisao':
        return (
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30">
            ⚠️ Revisão Solicitada
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Disponível
          </Badge>
        );
    }
  };

  const handleToggleQuickEntrega = (entrega: PSEntregaAditivo) => {
    const current = candidato.entregas[entrega.id]?.status || 'pendente';
    if (current === 'entregue' || current === 'validado') {
      processoSeletivoService.updateCandidatoEntrega(candidato.id, entrega.id, {
        status: 'pendente',
        xpConcedido: 0,
      });
      toast.info(`Status de "${entrega.titulo}" retornado para pendente.`);
    } else {
      processoSeletivoService.updateCandidatoEntrega(candidato.id, entrega.id, {
        status: 'entregue',
        dataSubmissao: new Date().toISOString().split('T')[0],
        xpConcedido: entrega.xpReward,
      });
      toast.success(`Parabéns! +${entrega.xpReward} XP conquistados na entrega "${entrega.titulo}"!`);
    }
  };

  const handleOpenEntregaSubmit = (entrega: PSEntregaAditivo) => {
    const current = candidato.entregas[entrega.id];
    setSubmittingEntrega(entrega);
    setEntregaLink(current?.linkEntrega || '');
    setEntregaComentario(current?.comentarioCandidato || '');
  };

  const handleConfirmEntregaSubmit = () => {
    if (!submittingEntrega) return;
    processoSeletivoService.updateCandidatoEntrega(candidato.id, submittingEntrega.id, {
      status: 'entregue',
      dataSubmissao: new Date().toISOString().split('T')[0],
      linkEntrega: entregaLink.trim(),
      comentarioCandidato: entregaComentario.trim(),
      xpConcedido: submittingEntrega.xpReward,
    });
    toast.success(
      `Entrega enviada com sucesso! Você ganhou +${submittingEntrega.xpReward} XP no Processo Aditivo!`
    );
    setSubmittingEntrega(null);
  };

  const handleOpenEtapaSubmit = (etapa: PSEtapaModular) => {
    const current = candidato.etapas[etapa.id];
    setSubmittingEtapa(etapa);
    setEtapaLink(current?.linkSubmissaoCandidato || '');
  };

  const handleConfirmEtapaSubmit = () => {
    if (!submittingEtapa) return;
    const current = candidato.etapas[submittingEtapa.id];
    processoSeletivoService.updateCandidatoEtapa(candidato.id, submittingEtapa.id, {
      status: current?.status === 'concluido' ? 'concluido' : 'entregue',
      linkSubmissaoCandidato: etapaLink.trim(),
      xpGanho: current?.xpGanho || Math.round(submittingEtapa.xpMaximo * 0.85),
    });
    toast.success(`Submissão registrada na etapa "${submittingEtapa.titulo}"!`);
    setSubmittingEtapa(null);
  };

  const formatDaysRemaining = (prazoStr: string) => {
    if (!prazoStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(prazoStr + 'T00:00:00');
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: `Prazo encerrado (${prazoStr})`, urgent: true };
    if (diffDays === 0) return { text: 'Vence HOJE!', urgent: true };
    if (diffDays <= 3) return { text: `Faltam ${diffDays} dias (${prazoStr})`, urgent: true };
    return { text: `Prazo: ${prazoStr.split('-').reverse().join('/')} (${diffDays}d)`, urgent: false };
  };

  return (
    <div className={isStandaloneExternalLogin ? 'min-h-screen bg-background flex flex-col' : 'space-y-6'}>
      {/* Top Navbar exclusiva quando o candidato externo faz login */}
      {isStandaloneExternalLogin && (
        <header className="h-16 bg-card border-b border-border sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-primary-foreground font-extrabold text-sm shadow">
              RJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-foreground">RioJunior</span>
                <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30 text-[11px]">
                  🔒 Portal do Candidato (Acesso Restrito)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {psState.config.tituloEdicao} • Ciclo {psState.config.ciclo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Seletor rápido de candidato para facilitar testes no ambiente local */}
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Candidato ativo:</span>
              <select
                value={candidato.id}
                onChange={(e) => setSelectedCandId(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-foreground font-bold text-xs"
              >
                {psState.candidatos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.guildaAlvo} - {c.frenteAlvo})
                  </option>
                ))}
              </select>
            </div>

            {onExitPreview && (
              <Button variant="outline" size="sm" onClick={onExitPreview} className="text-xs font-bold">
                Voltar ao Painel Admin
              </Button>
            )}

            {onLogout && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="text-xs font-bold gap-1.5 text-rose-600 hover:text-rose-700"
              >
                <LogOut size={14} />
                <span>Sair</span>
              </Button>
            )}
          </div>
        </header>
      )}

      <div className={isStandaloneExternalLogin ? 'max-w-7xl mx-auto w-full p-4 md:p-8 space-y-6 flex-1' : 'space-y-6'}>
        {/* Barra seletora quando visualizado por dentro da aba de Operações */}
        {!isStandaloneExternalLogin && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600 text-white">Simulador da Visão do Candidato Externo</Badge>
                <span className="text-xs text-muted-foreground">
                  É exatamente assim que o usuário externo vê a plataforma ao logar com sua conta de candidato.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">Visualizar como:</span>
              <select
                value={candidato.id}
                onChange={(e) => setSelectedCandId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold"
              >
                {psState.candidatos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.ejOrigem} → {c.guildaAlvo})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* HERO CARD GAMIFICADO DO CANDIDATO */}
        <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 text-white flex flex-col items-center justify-center font-extrabold shrink-0 shadow-md">
                <span className="text-[10px] uppercase tracking-wider opacity-90">Nível</span>
                <span className="text-2xl leading-none">{stats.nivelAtual.nivel}</span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-foreground">
                    Olá, {candidato.nome}!
                  </h2>
                  <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-extrabold">
                    ⚡ {stats.totalXp} / {stats.metaXp} XP
                  </Badge>
                  <Badge variant="outline" className="font-bold">
                    🏅 {stats.nivelAtual.titulo}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  EJ de Origem: <strong>{candidato.ejOrigem} ({candidato.ies})</strong> • Vaga Alvo:{' '}
                  <strong className="text-primary">
                    {guildaInfo.sigla} ({guildaInfo.nome}) — {candidato.frenteAlvo}
                  </strong>
                </p>

                <p className="text-xs text-muted-foreground max-w-3xl">
                  {psState.config.mensagemBoasVindasCandidato}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {psState.config.linkEdital && (
                <a
                  href={psState.config.linkEdital}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileText size={14} className="text-primary" />
                  <span>Edital & Guia</span>
                  <ExternalLink size={12} />
                </a>
              )}
              {psState.config.linkComunidade && (
                <a
                  href={psState.config.linkComunidade}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles size={14} />
                  <span>Canal de Avisos</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Barra de Progressão Geral Gamificada */}
          <div className="space-y-2 bg-secondary/40 p-4 rounded-xl border border-border">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <div className="flex items-center gap-2">
                <Trophy size={15} className="text-amber-500" />
                <span>Progressão Geral no Processo Seletivo & Aditivo</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  Etapas: <strong>{stats.etapasConcluidas}/{stats.totalEtapas}</strong>
                </span>
                <span className="text-muted-foreground">
                  Entregas Aditivo: <strong>{stats.entregasConcluidas}/{stats.totalEntregasAplicaveis}</strong>
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-extrabold text-sm">
                  {stats.progressoPct}% Concluído
                </span>
              </div>
            </div>

            <div className="w-full h-3.5 bg-secondary rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 transition-all duration-500 rounded-full"
                style={{ width: `${stats.progressoPct}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-1">
              <span>
                Composição do seu XP: <strong>{stats.xpEtapas} XP</strong> (Etapas) +{' '}
                <strong>{stats.xpEntregas} XP</strong> (Entregas do Aditivo) +{' '}
                <strong>{stats.xpBadges} XP</strong> (Conquistas)
              </span>
              {stats.proximoNivel ? (
                <span>
                  Faltam <strong>{Math.max(0, stats.proximoNivel.xpMinimo - stats.totalXp)} XP</strong> para alcançar{' '}
                  <strong>
                    Nível {stats.proximoNivel.nivel}: {stats.proximoNivel.titulo}
                  </strong>
                </span>
              ) : (
                <span className="text-amber-500 font-bold">
                  🎉 Você atingiu o nível máximo da trilha gamificada!
                </span>
              )}
            </div>
          </div>

          {/* Galeria de Conquistas / Badges */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award size={14} className="text-amber-500" />
              Suas Conquistas & Insígnias no Processo Aditivo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {psState.badges.map((badge) => {
                const unlocked = candidato.badgesDesbloqueadas.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      unlocked
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-xs'
                        : 'bg-secondary/40 border-border opacity-60'
                    }`}
                  >
                    <div className="text-2xl shrink-0">{badge.icone}</div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground truncate">
                          {badge.titulo}
                        </span>
                        <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                          +{badge.xpBonus} XP
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {badge.descricao}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground pt-0.5">
                        {unlocked ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Unlock size={11} /> Desbloqueada
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Lock size={11} /> {badge.criterioResumo}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AVISO DE ETAPAS NÃO-CRONOLÓGICAS */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3.5 flex items-start gap-3">
          <Info size={18} className="text-cyan-500 shrink-0 mt-0.5" />
          <p className="text-xs text-foreground leading-relaxed">
            {psState.config.avisoOrdemNaoLinear}
          </p>
        </div>

        {/* BLOCO 1: ETAPAS MODULARES DE AVALIAÇÃO (DESAFIO COLETIVO, INDIVIDUAL, ENTREVISTAS, ETC.) */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-foreground">
                1. Etapas de Avaliação (Módulos Independentes)
              </h3>
              <p className="text-xs text-muted-foreground">
                Acompanhe seus agendamentos, submeta seu case e visualize os feedbacks liberados pela banca em cada módulo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {psState.etapas.map((etapa) => {
              const av = candidato.etapas[etapa.id];
              const xpObtido = av?.xpGanho || 0;

              return (
                <div
                  key={etapa.id}
                  className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-primary/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-secondary border border-border">
                          {getEtapaIcon(etapa.categoria)}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-foreground">{etapa.titulo}</h4>
                          <span className="text-xs text-muted-foreground">
                            Valor: <strong>{etapa.xpMaximo} XP</strong>
                          </span>
                        </div>
                      </div>
                      {getStatusBadgeEtapa(av?.status)}
                    </div>

                    <p className="text-xs font-semibold text-foreground/90">{etapa.subtitulo}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {etapa.descricao}
                    </p>

                    {/* Critérios avaliados */}
                    {etapa.criteriosAvaliacao.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-xs font-bold text-foreground">O que é observado:</span>
                        <ul className="space-y-1">
                          {etapa.criteriosAvaliacao.map((crit, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar size={13} />
                        {av?.dataAgendada || etapa.janelaData}
                      </span>
                      <span className="font-extrabold text-purple-600 dark:text-purple-400">
                        +{xpObtido} / {etapa.xpMaximo} XP
                      </span>
                    </div>

                    {av?.feedbackPublico && (
                      <div className="p-3 rounded-xl bg-secondary/70 border border-border text-xs space-y-1">
                        <span className="font-bold text-foreground block">
                          💬 Feedback / Orientação da Banca:
                        </span>
                        <p className="text-muted-foreground">{av.feedbackPublico}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {(av?.linkEspecifico || etapa.linkPadrao) && (
                        <a
                          href={av?.linkEspecifico || etapa.linkPadrao}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center justify-center gap-1.5 border border-border transition-colors"
                        >
                          <ExternalLink size={13} />
                          <span>Acessar Sala / Material</span>
                        </a>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEtapaSubmit(etapa)}
                        className="text-xs font-bold gap-1.5"
                      >
                        <Send size={13} />
                        <span>{av?.linkSubmissaoCandidato ? 'Editar Envio' : 'Enviar Link'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BLOCO 2: PROGRAMAS E ENTREGAS DO PROCESSO ADITIVO */}
        <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-foreground">
                  2. Trilha do Processo Aditivo: Programas, Imersões e Entregas
                </h3>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                  {stats.entregasConcluidas} de {stats.totalEntregasAplicaveis} concluídas
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Acompanhe quais programas e entregas precisam ser feitos, fique atento aos prazos e registre suas entregas para avançar na gamificação.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {entregasAplicaveis.map((entrega, idx) => {
              const prog = candidato.entregas[entrega.id];
              const isDone = prog?.status === 'entregue' || prog?.status === 'validado';
              const deadlineInfo = formatDaysRemaining(entrega.prazo);

              return (
                <div
                  key={entrega.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isDone
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-secondary/40 border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleQuickEntrega(entrega)}
                      className={`mt-0.5 h-6 w-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-card border-border text-transparent hover:border-primary'
                      }`}
                      title="Marcar ou desmarcar conclusão rápida"
                    >
                      <CheckCircle2 size={15} />
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-extrabold text-foreground">
                          {idx + 1}. {entrega.titulo}
                        </span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {entrega.tipo}
                        </Badge>
                        <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-extrabold">
                          +{entrega.xpReward} XP
                        </Badge>
                        {prog?.status === 'validado' && (
                          <Badge className="bg-emerald-600 text-white text-xs">
                            ✓ Validado pela OP
                          </Badge>
                        )}
                        {prog?.status === 'entregue' && (
                          <Badge className="bg-cyan-600 text-white text-xs">
                            📤 Entregue pelo Candidato
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {entrega.descricao}
                      </p>

                      {prog?.linkEntrega && (
                        <div className="flex items-center gap-2 text-xs text-primary font-semibold pt-1">
                          <ExternalLink size={12} />
                          <a href={prog.linkEntrega} target="_blank" rel="noreferrer" className="underline">
                            Link da sua entrega registrada
                          </a>
                          {prog.dataSubmissao && (
                            <span className="text-muted-foreground">({prog.dataSubmissao})</span>
                          )}
                        </div>
                      )}

                      {prog?.feedbackAvaliador && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                          💬 Feedback OP: "{prog.feedbackAvaliador}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 lg:pl-4">
                    {deadlineInfo && (
                      <div
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
                          isDone
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : deadlineInfo.urgent
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            : 'bg-card text-muted-foreground border-border'
                        }`}
                      >
                        <Clock size={13} />
                        <span>
                          {isDone ? 'Concluído no prazo' : `${deadlineInfo.text} • ${entrega.horarioLimite}`}
                        </span>
                      </div>
                    )}

                    {entrega.linkTemplate && (
                      <a
                        href={entrega.linkTemplate}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-card hover:bg-muted border border-border text-xs font-bold flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        <span>Guia</span>
                      </a>
                    )}

                    <Button
                      size="sm"
                      onClick={() => handleOpenEntregaSubmit(entrega)}
                      variant={isDone ? 'outline' : 'default'}
                      className="text-xs font-bold gap-1.5"
                    >
                      <Send size={13} />
                      <span>{isDone ? 'Atualizar Entrega' : 'Registrar Entrega'}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Submissão de Programa / Entrega do Processo Aditivo */}
      <Dialog open={!!submittingEntrega} onOpenChange={(o) => !o && setSubmittingEntrega(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Entrega — Processo Aditivo</DialogTitle>
            <DialogDescription>
              {submittingEntrega?.titulo} (+{submittingEntrega?.xpReward} XP)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Link do Arquivo / Documento (Google Drive, Notion, Canva, etc.)
              </label>
              <Input
                value={entregaLink}
                onChange={(e) => setEntregaLink(e.target.value)}
                placeholder="https://docs.google.com/..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Comentários ou Síntese da Atividade
              </label>
              <Textarea
                value={entregaComentario}
                onChange={(e) => setEntregaComentario(e.target.value)}
                placeholder="Descreva brevemente como foi realizar este programa/entrega..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmittingEntrega(null)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmEntregaSubmit}>
              Confirmar e Receber +{submittingEntrega?.xpReward} XP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Submissão de Link em Etapa Modular */}
      <Dialog open={!!submittingEtapa} onOpenChange={(o) => !o && setSubmittingEtapa(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Material — {submittingEtapa?.titulo}</DialogTitle>
            <DialogDescription>{submittingEtapa?.subtitulo}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Link da Apresentação / Case da Etapa
              </label>
              <Input
                value={etapaLink}
                onChange={(e) => setEtapaLink(e.target.value)}
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmittingEtapa(null)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmEtapaSubmit}>Salvar Submissão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

