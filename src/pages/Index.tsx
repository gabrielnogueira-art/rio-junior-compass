import { useState, useMemo } from 'react';
import {
  Menu,
  ChevronDown,
  ShieldAlert,
  Trophy,
  Eye,
  GraduationCap,
  LogOut,
  Building2,
} from 'lucide-react';
import { TabType } from '@/types';
import { useAuth, ADMIN_VIEW_MODES, AdminSimulatedViewMode } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import CalendarView from '@/views/CalendarView';
import DDRView from '@/views/DDRView';
import OperationsView from '@/views/OperationsView';
import StrategicPanelView from '@/views/StrategicPanelView';
import PlaceholderView from '@/views/PlaceholderView';
import PresidencyView from '@/views/PresidencyView';
import FormacaoEmpreendedoraView from '@/views/FormacaoEmpreendedoraView';
import BusinessView from '@/views/BusinessView';
import UsersAdmin from '@/components/admin/UsersAdmin';
import CandidatePortalView from '@/components/operations/CandidatePortalView';
import COEJSection from '@/components/presidency/coej/COEJSection';
import { getDatabase } from '@/components/presidency/coej/database';
import { UserProfileModal } from '@/components/profile/UserProfileModal';
import { useWebMCP } from 'use-webmcp-tool';
import { runWebMCPTool } from '@/lib/webmcp-telemetry';
import RioAssistant from '@/components/assistant/RioAssistant';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [previewExternalCandidate, setPreviewExternalCandidate] = useState(false);
  const {
    profile,
    isAdmin,
    isActualAdmin,
    isExternalCandidate,
    signOut,
    simulatedViewMode,
    setSimulatedViewMode,
    simulatedEjIds,
    setSimulatedEjIds,
    effectiveUserType,
    effectiveGuilda,
    allowedProfessorEjIds,
    accountLink,
  } = useAuth();

  const allCoejEjs = useMemo(() => {
    try {
      const db = getDatabase();
      return db.Empresas_Juniores || [];
    } catch {
      return [];
    }
  }, []);

  const currentModeInfo = useMemo(
    () => ADMIN_VIEW_MODES.find((m) => m.id === simulatedViewMode) || ADMIN_VIEW_MODES[0],
    [simulatedViewMode]
  );

  const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
  const visibleTabs: TabType[] = [
    'calendar',
    'strategic',
    'presidency',
    'council',
    'business',
    'operations',
    'ddr',
    'formation',
    ...(isAdmin ? ['users' as const] : []),
  ];

  function changeTab(tab: TabType) {
    if (typeof tab !== 'string' || !visibleTabs.includes(tab))
      throw new Error('Seção indisponível para sua conta.');
    setActiveTab(tab);
  }
  function changeYear(year: number) {
    if (typeof year !== 'number' || !Number.isInteger(year) || !yearOptions.includes(year))
      throw new Error('Ano indisponível no seletor.');
    setSelectedYear(year);
  }

  useWebMCP({
    name: 'read_current_section',
    description: 'Consulta a seção e o ano atualmente selecionados no painel RioJunior.',
    annotations: { readOnlyHint: true },
    execute: () =>
      runWebMCPTool('read_current_section', () => `Seção: ${activeTab}; ano: ${selectedYear}.`),
  });
  useWebMCP({
    name: 'open_section',
    description: 'Abre uma seção disponível no menu da RioJunior sem alterar registros.',
    inputSchema: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          enum: visibleTabs,
          description: 'Identificador da seção do menu.',
        },
      },
      required: ['section'],
    },
    execute: ({ section }: { section: TabType }) =>
      runWebMCPTool('open_section', () => {
        changeTab(section);
        return `Seção selecionada: ${section}.`;
      }),
  });
  useWebMCP({
    name: 'select_year',
    description: 'Seleciona um ano disponível no seletor de vigência do painel.',
    inputSchema: {
      type: 'object',
      properties: {
        year: {
          type: 'integer',
          enum: yearOptions,
          description: 'Ano de vigência disponível.',
        },
      },
      required: ['year'],
    },
    execute: ({ year }: { year: number }) =>
      runWebMCPTool('select_year', () => {
        changeYear(year);
        return `Ano selecionado: ${year}.`;
      }),
  });

  // Barra superior de Simulador de Visões exclusiva para Administradores (ADMs)
  const renderAdminViewSwitcherBar = () => {
    if (!isActualAdmin) return null;

    const isSimulatingCoej =
      simulatedViewMode === 'professor_orientador' || simulatedViewMode === 'diretor_ej';

    return (
      <div className="bg-slate-950 text-white border-b border-amber-500/30 px-4 py-2 text-xs z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[11px]">
              <Eye size={13} />
              Simulador de Visões ADM
            </span>
            <select
              value={simulatedViewMode}
              onChange={(e) => {
                const nextMode = e.target.value as AdminSimulatedViewMode;
                setSimulatedViewMode(nextMode);
                if (nextMode !== 'candidato_ps') {
                  setPreviewExternalCandidate(false);
                }
              }}
              className="bg-slate-900 text-white border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {ADMIN_VIEW_MODES.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                  {m.label}
                </option>
              ))}
            </select>

            {isSimulatingCoej && allCoejEjs.length > 0 && (
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1">
                <Building2 size={12} className="text-cyan-400" />
                <span className="text-[11px] text-slate-300">EJ Vinculada:</span>
                <select
                  value={simulatedEjIds[0] || 'ej_002'}
                  onChange={(e) => setSimulatedEjIds([e.target.value])}
                  className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  {allCoejEjs.map((ej: any) => (
                    <option key={ej.id_ej} value={ej.id_ej} className="bg-slate-900 text-white">
                      {ej.nome} ({ej.ies})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-2">
            <span className="text-[11px] text-slate-300 hidden xl:inline">
              {currentModeInfo.description}
            </span>
            {simulatedViewMode !== 'admin' && (
              <button
                onClick={() => {
                  setSimulatedViewMode('admin');
                  setPreviewExternalCandidate(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[11px] transition shrink-0"
              >
                Voltar ao ADM Total
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 1. Se o usuário logado for um Candidato Externo do Processo Seletivo (ou se o Admin ativou o preview em tela cheia),
  // renderiza EXCLUSIVAMENTE o Portal Gamificado do Processo Seletivo, bloqueando qualquer acesso às abas internas.
  if (isExternalCandidate || previewExternalCandidate) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {renderAdminViewSwitcherBar()}
        <div className="flex-1">
          <CandidatePortalView
            candidateEmail={profile?.email}
            isStandaloneExternalLogin={true}
            onLogout={signOut}
            onExitPreview={
              previewExternalCandidate || (isActualAdmin && simulatedViewMode === 'candidato_ps')
                ? () => {
                    setPreviewExternalCandidate(false);
                    if (simulatedViewMode === 'candidato_ps') {
                      setSimulatedViewMode('admin');
                    }
                  }
                : undefined
            }
          />
        </div>
      </div>
    );
  }

  // 2. Se o usuário for Professor Orientador ou Diretor/Membro de EJ,
  // acessa EXCLUSIVAMENTE o Painel do COEJ com os dados específicos das suas EJs vinculadas.
  if (
    effectiveUserType === 'professor_orientador' ||
    effectiveUserType === 'diretor_ej' ||
    effectiveUserType === 'membro_ej'
  ) {
    const isProf = effectiveUserType === 'professor_orientador';
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {renderAdminViewSwitcherBar()}
        <header className="h-16 bg-card border-b border-border sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-primary-foreground font-bold text-sm">
              RJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-foreground">RioJunior • Portal COEJ</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <GraduationCap size={12} />
                  {isProf ? 'Professor Orientador' : 'Diretoria / Membro de EJ'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {accountLink.resumoVinculo || profile?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:inline">Ano de vigência:</span>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => changeYear(Number(e.target.value))}
                className="appearance-none bg-primary text-primary-foreground px-3.5 py-1.5 pr-8 rounded-lg font-bold text-xs cursor-pointer"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-foreground pointer-events-none"
              />
            </div>

            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive font-bold text-xs transition"
            >
              <LogOut size={14} />
              <span>Sair</span>
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          <COEJSection
            selectedYear={selectedYear}
            restrictedMode={isProf ? 'orientador' : 'membro_ej'}
            allowedEjIds={allowedProfessorEjIds}
          />
        </main>

        <footer className="py-4 px-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>© 2025 RioJunior - Federação de Empresas Juniores do Estado do Rio de Janeiro • Portal COEJ</p>
        </footer>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView selectedYear={selectedYear} />;
      case 'ddr':
        return <DDRView selectedYear={selectedYear} />;
      case 'operations':
        return <OperationsView selectedYear={selectedYear} />;
      case 'strategic':
        return <StrategicPanelView selectedYear={selectedYear} />;
      case 'presidency':
        return <PresidencyView selectedYear={selectedYear} />;
      case 'users':
        return isAdmin ? <UsersAdmin /> : <CalendarView selectedYear={selectedYear} />;
      case 'council':
        return (
          <PlaceholderView
            title="Presidência do Conselho"
            description="Esta seção será desenvolvida em breve. Aqui você encontrará informações e atividades relacionadas ao Conselho da Federação."
          />
        );
      case 'business':
        return <BusinessView selectedYear={selectedYear} />;
      case 'formation':
        return <FormacaoEmpreendedoraView selectedYear={selectedYear} />;
      default:
        return <CalendarView selectedYear={selectedYear} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={changeTab}
        isAdmin={isAdmin}
        userName={profile?.nome ?? accountLink.nomeCadastrado ?? undefined}
        userEmail={profile?.email ?? undefined}
        onLogout={signOut}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={changeTab}
        isAdmin={isAdmin}
        onLogout={signOut}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0 lg:ml-72 flex flex-col min-h-screen">
        {renderAdminViewSwitcherBar()}

        {/* Header with Year Selector */}
        <header className="h-16 bg-card border-b border-border sticky top-0 z-10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-foreground hover:bg-secondary rounded-lg transition-colors lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xs">
                RJ
              </div>
              <span className="font-bold text-lg text-foreground">RioJunior</span>
            </div>

            {effectiveGuilda && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                Guilda: {effectiveGuilda}
                {accountLink.cargo ? ` • ${accountLink.cargo}` : ''}
              </span>
            )}
          </div>

          {/* Year Selector, Portal Candidato Preview & Profile button */}
          <div className="flex items-center gap-2">
            {isActualAdmin && (
              <button
                onClick={() => setPreviewExternalCandidate(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-600 dark:text-purple-300 transition-all"
                title="Simular visão restrita de Candidato Externo do Processo Seletivo"
              >
                <Trophy size={13} />
                <span>Portal Candidato PS</span>
              </button>
            )}

            <span className="text-sm text-muted-foreground hidden md:inline">Ano de vigência:</span>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => changeYear(Number(e.target.value))}
                className="appearance-none bg-primary text-primary-foreground px-4 py-2 pr-8 rounded-lg font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity border-0 focus:ring-2 focus:ring-primary/50 focus:outline-none"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-foreground pointer-events-none"
              />
            </div>

            {/* Botão Perfil & Cartões no Header */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card hover:bg-muted border border-border text-xs font-bold text-foreground transition-all shadow-xs"
              title="Ver Perfil de Usuário, Guilda, Cargo e Cartões"
            >
              <div className="h-6 w-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[11px]">
                {(profile?.nome || accountLink.nomeCadastrado || 'U').charAt(0)}
              </div>
              <span className="hidden sm:inline">
                {(profile?.nome || accountLink.nomeCadastrado || 'Meu Perfil').split(' ')[0]}
              </span>
              <ShieldAlert size={14} className="text-amber-500" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main data-assistant-page className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>© 2025 RioJunior - Federação de Empresas Juniores do Estado do Rio de Janeiro</p>
        </footer>
      </div>

      <RioAssistant section={activeTab} year={selectedYear} />

      {/* Modal de Perfil de Usuário Oficial RioJunior */}
      <UserProfileModal
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        targetMemberEmail={profile?.email || undefined}
      />
    </div>
  );
};

export default Index;
