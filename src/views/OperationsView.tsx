import { useState, useEffect } from 'react';
import { FinancialRow, ProcessMetric, ProcessRow, RiskRow, AllocationRow } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Wallet, Settings2, Calendar, ShieldAlert, Sparkles, Trophy, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DirectorateAccessGuard } from '@/components/DirectorateAccessGuard';
import FinancialAllocationTab from '@/components/operations/FinancialAllocationTab';
import ProcessManagementTab from '@/components/operations/ProcessManagementTab';
import GestaoRitosTab from '@/components/operations/GestaoRitosTab';
import CartoesMembrosTab from '@/components/operations/CartoesMembrosTab';
import GestaoTimeOverviewTab from '@/components/operations/GestaoTimeOverviewTab';
import ProcessoSeletivoTab from '@/components/operations/ProcessoSeletivoTab';

interface Props {
  financialData: FinancialRow[];
  onFinancialChange: (d: FinancialRow[]) => void;
  allocationData: AllocationRow[];
  onAllocationChange: (d: AllocationRow[]) => void;
  processMetrics: ProcessMetric[];
  onProcessMetricsChange: (d: ProcessMetric[]) => void;
  processRows: ProcessRow[];
  onProcessRowsChange: (d: ProcessRow[]) => void;
  riskData: RiskRow[];
  onRiskChange: (d: RiskRow[]) => void;
}

export default function OperationsView(props: Props) {
  const { canViewGestaoTimeOP, canEditOP } = useAuth();

  const [activeMacroPillar, setActiveMacroPillar] = useState<'time' | 'processoSeletivo' | 'financeiro' | 'processos'>(
    () => (canViewGestaoTimeOP ? 'time' : 'processoSeletivo')
  );
  const [activeTimeSubTab, setActiveTimeSubTab] = useState('visao-time');
  const [activeProcessSubTab, setActiveProcessSubTab] = useState('processos');

  useEffect(() => {
    if (!canViewGestaoTimeOP && activeMacroPillar === 'time') {
      setActiveMacroPillar('processoSeletivo');
    }
  }, [canViewGestaoTimeOP, activeMacroPillar]);

  return (
    <div className="space-y-5">
      {/* Navegação por Macro-Pilares da Diretoria de Operações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/60 border border-border/60 rounded-2xl p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 w-full">
          {/* Pilar 1: Gestão de Time & Jornada — Restrito aos ADMs por hora */}
          {canViewGestaoTimeOP ? (
            <button
              type="button"
              onClick={() => setActiveMacroPillar('time')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all ${
                activeMacroPillar === 'time'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-secondary/70 text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">1. Gestão de Time &amp; Jornada</div>
                <div
                  className={`text-[10px] truncate ${
                    activeMacroPillar === 'time' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}
                >
                  52 Membros • Frentes • Cartões (ADM)
                </div>
              </div>
            </button>
          ) : (
            <div
              title="A parte de Gestão de Time e Jornada está restrita aos Administradores."
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-left border border-dashed border-border/60 bg-muted/20 opacity-60 cursor-not-allowed select-none"
            >
              <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate flex items-center gap-1.5">
                  <span>1. Gestão de Time &amp; Jornada</span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1">
                    Só ADM
                  </Badge>
                </div>
                <div className="text-[10px] truncate text-muted-foreground">
                  Acesso restrito aos Administradores
                </div>
              </div>
            </div>
          )}

          {/* Pilar 2: Processo Seletivo & Aditivo Gamificado */}
          <button
            type="button"
            onClick={() => setActiveMacroPillar('processoSeletivo')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all ${
              activeMacroPillar === 'processoSeletivo'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-secondary/70 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Trophy className="h-4 w-4 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">2. Processo Seletivo &amp; Aditivo</div>
              <div
                className={`text-[10px] truncate ${
                  activeMacroPillar === 'processoSeletivo'
                    ? 'text-primary-foreground/80'
                    : 'text-muted-foreground'
                }`}
              >
                Trilha Gamificada • Etapas • Entregas
              </div>
            </div>
          </button>

          {/* Pilar 3: Finanças & Alocação */}
          <button
            type="button"
            onClick={() => setActiveMacroPillar('financeiro')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all ${
              activeMacroPillar === 'financeiro'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-secondary/70 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Wallet className="h-4 w-4 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">3. Finanças &amp; Alocação</div>
              <div
                className={`text-[10px] truncate ${
                  activeMacroPillar === 'financeiro' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}
              >
                Orçamento • Fluxo de Caixa • Diretorias
              </div>
            </div>
          </button>

          {/* Pilar 4: Processos, Ritos & Visitas */}
          <button
            type="button"
            onClick={() => setActiveMacroPillar('processos')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all ${
              activeMacroPillar === 'processos'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-secondary/70 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings2 className="h-4 w-4 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">4. Processos, Ritos &amp; Visitas</div>
              <div
                className={`text-[10px] truncate ${
                  activeMacroPillar === 'processos' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}
              >
                SLAs Internos • Calendário de Ritos
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* CONTEÚDO DO PILAR 1: GESTÃO DE TIME & JORNADA (RESTRITO AOS ADMs) */}
      {activeMacroPillar === 'time' && canViewGestaoTimeOP && (
        <Tabs value={activeTimeSubTab} onValueChange={setActiveTimeSubTab} className="space-y-4">
          <TabsList className="bg-secondary/60 border border-border/60 h-10 p-1">
            <TabsTrigger value="visao-time" className="text-xs gap-1.5 px-3">
              <Sparkles className="h-3.5 w-3.5" /> Visão Geral, Organograma &amp; Jornada de Entrada/Saída
            </TabsTrigger>
            <TabsTrigger value="cadastro-cartoes" className="text-xs gap-1.5 px-3">
              <ShieldAlert className="h-3.5 w-3.5" /> Cadastro Detalhado, Frentes &amp; Cartões (OP)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visao-time" className="mt-0">
            <GestaoTimeOverviewTab onOpenFullRegistry={() => setActiveTimeSubTab('cadastro-cartoes')} />
          </TabsContent>

          <TabsContent value="cadastro-cartoes" className="mt-0">
            <CartoesMembrosTab />
          </TabsContent>
        </Tabs>
      )}

      {/* CONTEÚDO DOS DEMAIS PILARES DE OPERAÇÕES: VISTOS POR TODO O TIME, EDITADOS POR OP E ADMs */}
      {activeMacroPillar !== 'time' && (
        <DirectorateAccessGuard
          canEdit={canEditOP}
          directorateName="Diretoria de Operações (OP)"
          directorateShort="OP"
        >
          {activeMacroPillar === 'processoSeletivo' && <ProcessoSeletivoTab />}

          {activeMacroPillar === 'financeiro' && (
            <FinancialAllocationTab
              financialData={props.financialData}
              onFinancialChange={props.onFinancialChange}
              allocationData={props.allocationData}
              onAllocationChange={props.onAllocationChange}
            />
          )}

          {activeMacroPillar === 'processos' && (
            <Tabs value={activeProcessSubTab} onValueChange={setActiveProcessSubTab} className="space-y-4">
              <TabsList className="bg-secondary/60 border border-border/60 h-10 p-1">
                <TabsTrigger value="processos" className="text-xs gap-1.5 px-3">
                  <Settings2 className="h-3.5 w-3.5" /> Processos &amp; SLAs Operacionais
                </TabsTrigger>
                <TabsTrigger value="ritos" className="text-xs gap-1.5 px-3">
                  <Calendar className="h-3.5 w-3.5" /> Gestão de Ritos &amp; Visitas Presenciais
                </TabsTrigger>
              </TabsList>

              <TabsContent value="processos" className="mt-0">
                <ProcessManagementTab
                  metrics={props.processMetrics}
                  onMetricsChange={props.onProcessMetricsChange}
                  processes={props.processRows}
                  onProcessesChange={props.onProcessRowsChange}
                />
              </TabsContent>

              <TabsContent value="ritos" className="mt-0">
                <GestaoRitosTab />
              </TabsContent>
            </Tabs>
          )}
        </DirectorateAccessGuard>
      )}
    </div>
  );
}
