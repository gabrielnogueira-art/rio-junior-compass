import { useState } from 'react';
import { Crown, Briefcase, Settings2, Network, GraduationCap, LogOut, ShieldCheck, UserCircle2, Eye, Lock, Pencil } from 'lucide-react';
import {
  OKR,
  FinancialRow,
  ProcessMetric,
  ProcessRow,
  RiskRow,
  AllocationRow,
  GovernanceChecklist,
  GovProgramRow,
} from '@/types';
import {
  initialOKRs,
  initialFinancials,
  initialProcessMetrics,
  initialProcessRows,
  initialRisks,
  initialAllocations,
  initialGovernanceChecklist,
  initialGovPrograms,
} from '@/data/mockData';
import { DDR_EMPRESAS_JUNIORES } from '@/data/ddrDatabase';
import { GUILDAS_INFO } from '@/data/rolesGuildasData';
import PresidencyView from '@/views/PresidencyView';
import BusinessView from '@/views/BusinessView';
import OperationsView from '@/views/OperationsView';
import DDRView from '@/views/DDRView';
import FormacaoEmpreendedoraView from '@/views/FormacaoEmpreendedoraView';
import CandidatePortalView from '@/components/operations/CandidatePortalView';
import COEJSection from '@/components/presidency/coej/COEJSection';
import { getDatabase } from '@/components/presidency/coej/database.js';
import { GlobalStickyNotes } from '@/components/GlobalStickyNotes';
import { ThemeToggle } from '@/components/ThemeToggle';
import { usePersistedState } from '@/hooks/usePersistedState';
import { useAuth, TIPOS_USUARIO, ADMIN_VIEW_MODES, AdminSimulatedViewMode } from '@/hooks/useAuth';
import UsersAdmin from '@/components/admin/UsersAdmin';
import { UserProfileModal } from '@/components/profile/UserProfileModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
const logoHeader = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48"><text x="0" y="36" font-family="Arial,sans-serif" font-weight="700" font-size="32" fill="%231e4fa3">Rio<tspan fill="%2316a34a">Junior</tspan></text></svg>'.replace(/%23/g, '#'));

type Tab = 'presidencia' | 'empresarial' | 'operacoes' | 'ddr' | 'formacao';

const tabs: { id: Tab; label: string; shortLabel: string; icon: typeof Crown; guildaKey: string }[] = [
  { id: 'presidencia', label: 'Presidência', shortLabel: 'PresEx', icon: Crown, guildaKey: 'PRESEX' },
  { id: 'empresarial', label: 'VP de Negócios', shortLabel: 'VPNeg', icon: Briefcase, guildaKey: 'VPNEG' },
  { id: 'operacoes', label: 'Operações', shortLabel: 'Operações', icon: Settings2, guildaKey: 'OP' },
  { id: 'ddr', label: 'DDR', shortLabel: 'DDR', icon: Network, guildaKey: 'DDR' },
  { id: 'formacao', label: 'Formação Empreendedora', shortLabel: 'Formação', icon: GraduationCap, guildaKey: 'FE' },
];

const Index = () => {
  const {
    profile,
    roles,
    isActualAdmin,
    isAdmin,
    isExternalCandidate,
    signOut,
    accountLink,
    simulatedViewMode,
    setSimulatedViewMode,
    simulatedEjIds,
    setSimulatedEjIds,
    effectiveUserType,
    effectiveGuilda,
    allowedProfessorEjIds,
    canEditPresEx,
    canEditVPNeg,
    canEditDDR,
    canEditFE,
    canEditOP,
  } = useAuth();

  const [adminOpen, setAdminOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('presidencia');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Presidency state
  const [okrs, setOKRs] = usePersistedState<OKR[]>('rj_okrs_v1', initialOKRs);
  const [govChecklist, setGovChecklist] = usePersistedState<GovernanceChecklist[]>('rj_gov_checklist_v1', initialGovernanceChecklist);
  const [govPrograms, setGovPrograms] = usePersistedState<GovProgramRow[]>('rj_gov_programs_v1', initialGovPrograms);

  // Operations state
  const [financialData, setFinancialData] = usePersistedState<FinancialRow[]>('rj_financials_v1', initialFinancials);
  const [allocationData, setAllocationData] = usePersistedState<AllocationRow[]>('rj_allocations_v1', initialAllocations);
  const [processMetrics, setProcessMetrics] = usePersistedState<ProcessMetric[]>('rj_process_metrics_v1', initialProcessMetrics);
  const [processRows, setProcessRows] = usePersistedState<ProcessRow[]>('rj_process_rows_v1', initialProcessRows);
  const [riskData, setRiskData] = usePersistedState<RiskRow[]>('rj_risks_v1', initialRisks);

  const coejDb = getDatabase();
  const professoresCoej = coejDb.Usuarios_COEJ || [];
  const ejsCoej = coejDb.Empresas_Juniores || [];

  // Barra superior exclusiva para ADMs transitarem entre todas as visualizações do sistema
  const renderAdminViewSwitcherBar = () => {
    if (!isActualAdmin) return null;

    const currentModeObj =
      ADMIN_VIEW_MODES.find((m) => m.id === simulatedViewMode) || ADMIN_VIEW_MODES[0];
    const isSimulating = simulatedViewMode !== 'admin';

    return (
      <div
        className={`border-b transition-colors ${
          isSimulating
            ? 'bg-amber-500/15 border-amber-500/40'
            : 'bg-primary/5 border-border/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={isSimulating ? 'default' : 'outline'}
              className={`gap-1 text-[11px] ${
                isSimulating
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-500 font-bold'
                  : 'border-primary/40 text-primary font-semibold'
              }`}
            >
              <Eye className="h-3 w-3" />
              {isSimulating ? 'Modo Teste de Visualização Ativo' : 'Simulador de Visualizações (ADM)'}
            </Badge>
            <span className="text-muted-foreground hidden sm:inline">
              {currentModeObj.description}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-muted-foreground">Visualizar como:</span>
            <Select
              value={simulatedViewMode}
              onValueChange={(val) => setSimulatedViewMode(val as AdminSimulatedViewMode)}
            >
              <SelectTrigger className="h-8 w-64 text-xs bg-background font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_VIEW_MODES.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-xs">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Seletor de Professor / EJ quando simulando Professor Orientador ou Diretor/Membro de EJ */}
            {(simulatedViewMode === 'professor_orientador' || simulatedViewMode === 'diretor_ej') && (
              <Select
                value={simulatedEjIds[0] || 'ej_002'}
                onValueChange={(val) => setSimulatedEjIds([val])}
              >
                <SelectTrigger className="h-8 w-64 text-xs bg-background">
                  <SelectValue placeholder="Selecione a EJ vinculada" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {professoresCoej.map((p: any) => {
                    const ejVinc = ejsCoej.find((e: any) => e.id_ej === p.id_ej_vinculada);
                    return (
                      <SelectItem key={p.id_auth} value={p.id_ej_vinculada} className="text-xs">
                        👨‍🏫 {p.nome} — {ejVinc?.nome || p.id_ej_vinculada}
                      </SelectItem>
                    );
                  })}
                  {DDR_EMPRESAS_JUNIORES.slice(0, 30).map((ej) => (
                    <SelectItem key={ej.id} value={ej.id} className="text-xs">
                      🏢 {ej.nome} ({ej.ies || ej.regiao})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {isSimulating && (
              <Button
                size="sm"
                variant="default"
                onClick={() => setSimulatedViewMode('admin')}
                className="h-8 text-xs gap-1 font-bold"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Voltar para ADM Total
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Se o usuário efetivo for Candidato Externo do Processo Seletivo, renderiza exclusivamente o Portal do Candidato
  if (isExternalCandidate) {
    return (
      <div className="min-h-screen bg-background">
        {renderAdminViewSwitcherBar()}
        <CandidatePortalView />
      </div>
    );
  }

  // Se o usuário efetivo for Professor Orientador ou Diretor/Membro de EJ, renderiza exclusivamente o Painel do COEJ restrito às suas EJs
  const isCoejOnlyUser =
    effectiveUserType === 'professor_orientador' ||
    effectiveUserType === 'diretor_ej' ||
    effectiveUserType === 'membro_ej';

  const canEditByTab: Record<Tab, boolean> = {
    presidencia: canEditPresEx,
    empresarial: canEditVPNeg,
    operacoes: canEditOP,
    ddr: canEditDDR,
    formacao: canEditFE,
  };

  const roleLabel = isAdmin
    ? 'Administrador (Acesso Total)'
    : effectiveUserType === 'professor_orientador'
    ? 'Professor Orientador (COEJ)'
    : effectiveUserType === 'diretor_ej'
    ? 'Diretor de EJ (COEJ)'
    : effectiveUserType === 'membro_ej'
    ? 'Membro de EJ (COEJ)'
    : effectiveGuilda
    ? `Time RioJunior • Guilda ${effectiveGuilda}`
    : roles.map((r) => TIPOS_USUARIO[r] ?? r).join(' • ') || 'Time RioJunior';

  return (
    <div className="min-h-screen bg-background">
      {/* Barra de Alternância de Visualizações (exclusiva para ADMs) */}
      {renderAdminViewSwitcherBar()}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img src={logoHeader} alt="RioJunior" className="h-9 w-auto object-contain" />
              </div>
              <div className="hidden sm:block h-6 w-px bg-border/60" />
              <div>
                <h1 className="text-sm font-bold text-foreground tracking-tight leading-none">
                  {isCoejOnlyUser ? 'Painel do COEJ — RioJunior' : 'Painel Estratégico'}
                </h1>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                  {isCoejOnlyUser
                    ? 'Acompanhamento de Empresas Juniores & Orientação Acadêmica'
                    : 'RioJunior • Federação das Empresas Juniores do RJ'}
                </p>
              </div>
            </div>

            {/* Navigation Tabs — visíveis apenas para ADMs e Time RioJunior */}
            {!isCoejOnlyUser && (
              <nav className="flex items-center gap-1 bg-secondary/70 p-1 rounded-xl border border-border/50">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const canEditThisTab = canEditByTab[tab.id];
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      title={
                        canEditThisTab
                          ? `${tab.label} — Edição liberada para seu perfil`
                          : `${tab.label} — Modo somente visualização`
                      }
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
                      <span className="hidden md:inline">{tab.label}</span>
                      <span className="md:hidden">{tab.shortLabel}</span>
                      {!isAdmin && (
                        <span className="hidden lg:inline-flex items-center ml-0.5 opacity-75">
                          {canEditThisTab ? <Pencil size={10} /> : <Lock size={10} />}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            )}

            {/* User & Theme Controls */}
            <div className="flex items-center gap-1.5">
              {/* Perfil Pessoal com Cargo, Guilda e Cartões */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProfileOpen(true)}
                className="gap-1.5 text-xs h-8 px-2.5 border-border/60"
                title="Abrir meu perfil, frente e histórico"
              >
                <UserCircle2 className="h-3.5 w-3.5 text-primary" />
                <span className="hidden lg:inline max-w-[130px] truncate font-semibold">
                  {accountLink.nomeCadastrado?.split(' ')[0] || profile?.nome?.split(' ')[0] || 'Meu Perfil'}
                </span>
                <Badge variant="secondary" className="hidden xl:inline-flex text-[10px] py-0 px-1.5 font-normal">
                  {roleLabel}
                </Badge>
              </Button>

              {isActualAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdminOpen(true)}
                  className="gap-1.5 text-xs h-8"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">Acessos</span>
                </Button>
              )}
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title={`Sair (${profile?.email ?? ''})`}
                className="h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isCoejOnlyUser ? (
          <COEJSection
            restrictedMode={effectiveUserType === 'professor_orientador' ? 'orientador' : 'membro_ej'}
            allowedEjIds={allowedProfessorEjIds}
          />
        ) : (
          <>
            {activeTab === 'presidencia' && (
              <PresidencyView
                okrs={okrs}
                onOKRsChange={setOKRs}
                govChecklist={govChecklist}
                onGovChecklistChange={setGovChecklist}
                govPrograms={govPrograms}
                onGovProgramsChange={setGovPrograms}
              />
            )}
            {activeTab === 'empresarial' && <BusinessView selectedYear={selectedYear} />}
            {activeTab === 'operacoes' && (
              <OperationsView
                financialData={financialData}
                onFinancialChange={setFinancialData}
                allocationData={allocationData}
                onAllocationChange={setAllocationData}
                processMetrics={processMetrics}
                onProcessMetricsChange={setProcessMetrics}
                processRows={processRows}
                onProcessRowsChange={setProcessRows}
                riskData={riskData}
                onRiskChange={setRiskData}
              />
            )}
            {activeTab === 'ddr' && <DDRView selectedYear={selectedYear} />}
            {activeTab === 'formacao' && <FormacaoEmpreendedoraView selectedYear={selectedYear} />}
          </>
        )}
      </main>

      {/* Post-its globais visíveis em todas as abas */}
      <GlobalStickyNotes activeTab={isCoejOnlyUser ? 'coej' : activeTab} />

      {isActualAdmin && (
        <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerenciar acessos ao painel</DialogTitle>
            </DialogHeader>
            <UsersAdmin />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Perfil do Usuário Logado */}
      <UserProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
};

export default Index;
