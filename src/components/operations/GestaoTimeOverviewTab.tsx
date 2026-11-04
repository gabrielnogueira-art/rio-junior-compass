// src/components/operations/GestaoTimeOverviewTab.tsx
// Visão Incisiva de Gestão de Time, Saúde por Guilda, Jornada de Pessoas, Frentes e Sistema Disciplinar (OP)

import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FolderTree,
  HeartHandshake,
  Activity,
  Sparkles,
  Crown,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  membrosCartoesService,
  MembroRioJunior,
  CartaoAdvertencia,
} from '@/services/membrosCartoesService';
import {
  GUILDAS_INFO,
  GuildaKey,
  getPapeisByGuilda,
} from '@/data/rolesGuildasData';
import CartoesMembrosTab from './CartoesMembrosTab';

interface GestaoTimeOverviewTabProps {
  onNavigateToPS?: () => void;
}

export default function GestaoTimeOverviewTab({ onNavigateToPS }: GestaoTimeOverviewTabProps) {
  const [membros, setMembros] = useState<MembroRioJunior[]>(membrosCartoesService.getMembros());
  const [cartoes, setCartoes] = useState<CartaoAdvertencia[]>(membrosCartoesService.getCartoes());
  const [subView, setSubView] = useState<'termometro' | 'gestao-completa'>('termometro');

  useEffect(() => {
    const unsub = membrosCartoesService.subscribe(() => {
      setMembros(membrosCartoesService.getMembros());
      setCartoes(membrosCartoesService.getCartoes());
    });
    return unsub;
  }, []);

  const stats = useMemo(() => {
    const total = membros.length;
    const ativos = membros.filter((m) => m.status === 'ativo').length;
    const atencao = membros.filter((m) => m.status === 'atencao').length;
    const critico = membros.filter((m) => m.status === 'critico').length;
    const desligados = membros.filter((m) => m.status === 'desligado').length;
    const emOperacao = ativos + atencao + critico;
    const retencaoPct = total > 0 ? Math.round((emOperacao / total) * 100) : 100;
    const saudeVerdePct = emOperacao > 0 ? Math.round((ativos / emOperacao) * 100) : 100;

    const guildasKeys: GuildaKey[] = ['PRESEX', 'VPNEG', 'DDR', 'FE', 'OP', 'PRESCON'];
    const porGuilda = guildasKeys.map((gKey) => {
      const info = GUILDAS_INFO[gKey];
      const mGuilda = membros.filter((m) => m.guilda === gKey && m.status !== 'desligado');
      const mAtivos = mGuilda.filter((m) => m.status === 'ativo').length;
      const mAlerta = mGuilda.filter((m) => m.status === 'atencao' || m.status === 'critico').length;
      const papeis = getPapeisByGuilda(gKey);
      const saudePct = mGuilda.length > 0 ? Math.round((mAtivos / mGuilda.length) * 100) : 100;
      return {
        sigla: gKey,
        nome: info.nome,
        diretoriaTitulo: info.diretoriaTitulo,
        totalMembros: mGuilda.length,
        ativos: mAtivos,
        alerta: mAlerta,
        totalFrentes: papeis.length,
        saudePct,
      };
    });

    const totalFrentes = porGuilda.reduce((acc, g) => acc + g.totalFrentes, 0);

    return {
      total,
      emOperacao,
      ativos,
      atencao,
      critico,
      desligados,
      retencaoPct,
      saudeVerdePct,
      totalFrentes,
      porGuilda,
    };
  }, [membros]);

  const membrosEmAlerta = useMemo(() => {
    return membros
      .filter((m) => m.status === 'critico' || m.status === 'atencao')
      .slice(0, 6);
  }, [membros]);

  return (
    <div className="space-y-6">
      {/* Sub-navegação rápida dentro do Pilar de Gestão de Time */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 font-bold">
              👥 Gente, Cultura & Jornada de Time (OP)
            </Badge>
            <span className="text-xs text-muted-foreground">
              • {stats.emOperacao} membros em atividade nas 6 Guildas
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-foreground mt-1">
            Painel Incisivo de Gestão de Pessoas, Frentes & Compliance
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-secondary p-1 rounded-xl border border-border shrink-0">
          <button
            type="button"
            onClick={() => setSubView('termometro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subView === 'termometro'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            📊 Termômetro & Saúde por Guilda
          </button>
          <button
            type="button"
            onClick={() => setSubView('gestao-completa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subView === 'gestao-completa'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🗂️ Quadro de Membros, Frentes & Cartões
          </button>
        </div>
      </div>

      {subView === 'termometro' ? (
        <div className="space-y-6">
          {/* KPIs Incisivos de Gestão de Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">
                  Taxa de Retenção do Time
                </span>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                  {stats.retencaoPct}% ativo
                </Badge>
              </div>
              <p className="text-2xl font-extrabold text-foreground">
                {stats.emOperacao}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  / {stats.total} membros
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.ativos} regulares • {stats.desligados} desligamento(s) no ciclo
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">
                  Saúde & Clima Operacional
                </span>
                <Activity size={16} className="text-cyan-500" />
              </div>
              <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">
                {stats.saudeVerdePct}% no Verde
              </p>
              <p className="text-xs text-muted-foreground">
                Sem advertências graves ou pendências de rito
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">
                  Frentes & Papéis Mapeados
                </span>
                <FolderTree size={16} className="text-purple-500" />
              </div>
              <p className="text-2xl font-extrabold text-foreground">
                {stats.totalFrentes} Frentes
              </p>
              <p className="text-xs text-muted-foreground">
                Distribuídas nas 6 Guildas Oficiais da Federação
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-amber-500/30 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  Radar de Atenção (1:1 / PDI)
                </span>
                <AlertTriangle size={16} className="text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-amber-500">
                {stats.atencao + stats.critico} Membros
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.atencao} em atenção • {stats.critico} críticos ({cartoes.length} cartões)
              </p>
            </div>
          </div>

          {/* Matriz de Saúde e Alocação por Guilda */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h4 className="text-base font-extrabold text-foreground">
                  Raio-X de Pessoas & Engajamento por Guilda
                </h4>
                <p className="text-xs text-muted-foreground">
                  Acompanhamento de efetivo, cobertura de frentes e saúde disciplinar em cada diretoria da RioJunior.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubView('gestao-completa')}
                className="text-xs font-bold gap-1.5"
              >
                <span>Gerenciar Membros, Frentes e Cartões</span>
                <ArrowRight size={13} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.porGuilda.map((g) => (
                <div
                  key={g.sigla}
                  className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-extrabold">
                        {g.sigla}
                      </Badge>
                      <span className="text-sm font-extrabold text-foreground truncate">
                        {g.nome}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-extrabold ${
                        g.saudePct >= 80
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : g.saudePct >= 60
                          ? 'text-amber-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {g.saudePct}% regular
                    </span>
                  </div>

                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        g.saudePct >= 80
                          ? 'bg-emerald-500'
                          : g.saudePct >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${g.saudePct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                    <div className="p-2 rounded-lg bg-card border border-border">
                      <span className="block font-extrabold text-foreground">{g.totalMembros}</span>
                      <span className="text-[11px] text-muted-foreground">Membros</span>
                    </div>
                    <div className="p-2 rounded-lg bg-card border border-border">
                      <span className="block font-extrabold text-cyan-600 dark:text-cyan-400">
                        {g.totalFrentes}
                      </span>
                      <span className="text-[11px] text-muted-foreground">Frentes</span>
                    </div>
                    <div className="p-2 rounded-lg bg-card border border-border">
                      <span
                        className={`block font-extrabold ${
                          g.alerta > 0 ? 'text-amber-500' : 'text-emerald-500'
                        }`}
                      >
                        {g.alerta}
                      </span>
                      <span className="text-[11px] text-muted-foreground">Em Alerta</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Prioritário de Acompanhamento Individual (Jornada de Time) + Atalho para Processo Seletivo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                    <HeartHandshake size={16} className="text-amber-500" />
                    Prioridades de Acompanhamento 1:1 (Jornada de Time)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Membros com status de atenção ou crítico que demandam ponto de contato da frente de Jornada de Time.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSubView('gestao-completa')}
                  className="text-xs font-bold"
                >
                  Ver Todos →
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {membrosEmAlerta.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl border border-border bg-secondary/30 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{m.nome}</p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {m.guilda} • {m.cargo}
                      </p>
                    </div>
                    <Badge
                      className={
                        m.status === 'critico'
                          ? 'bg-rose-500/15 text-rose-600 border-rose-500/30 text-[11px]'
                          : 'bg-amber-500/15 text-amber-600 border-amber-500/30 text-[11px]'
                      }
                    >
                      {m.status === 'critico' ? 'Crítico' : 'Atenção'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 via-card to-cyan-500/10 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <Badge className="bg-purple-600 text-white text-xs">
                  Employer Branding & Atração
                </Badge>
                <h4 className="text-base font-extrabold text-foreground">
                  Reposição de Quadro & Processo Aditivo
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Precisa recompor vagas nas Guildas? Acompanhe os candidatos em fase de Desafio Coletivo, Desafio Individual, Entrevistas e Entregas do Processo Aditivo.
                </p>
              </div>
              {onNavigateToPS && (
                <Button
                  onClick={onNavigateToPS}
                  className="w-full text-xs font-bold gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Sparkles size={14} />
                  <span>Abrir Painel do Processo Seletivo →</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <CartoesMembrosTab />
      )}
    </div>
  );
}
