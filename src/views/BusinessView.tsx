import { useState, useMemo } from 'react';
import { 
  Briefcase, Plus, Trash2, CalendarRange, Sparkles, CheckCircle2, 
  Kanban, ListFilter, Settings, TrendingUp, DollarSign, 
  Users, Building2, Flame
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useEventos } from '@/hooks/useEventos';
import { useGradeConteudo } from '@/hooks/useGradeConteudo';
import { useCRM } from '@/hooks/useCRM';
import { CRMCard } from '@/types/crm';
import { CRMKanban } from '@/components/business/CRMKanban';
import { CRMListView } from '@/components/business/CRMListView';
import { CRMCardModal } from '@/components/business/CRMCardModal';
import { CRMAssistantModal } from '@/components/business/CRMAssistantModal';
import { CRMConfigModal } from '@/components/business/CRMConfigModal';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BusinessViewProps {
  selectedYear: number;
}

const BusinessView = ({ selectedYear }: BusinessViewProps) => {
  // Eventos & Grade de Conteudo (Venda de Pautas)
  const { eventos, loading: eventosLoading } = useEventos();
  const { pautas, vendas, loading: gradeLoading, getConfig, registrarVenda, deleteVenda } = useGradeConteudo();

  // CRM Pipefy State & Hook
  const { 
    fases, 
    cards, 
    tags, 
    loading: crmLoading,
    createCard, 
    updateCard, 
    moveCard, 
    deleteCard,
    createFase, 
    updateFase, 
    deleteFase,
    addCampoToFase, 
    deleteCampoFromFase,
    parseMeeting, 
    resetToSeed 
  } = useCRM();

  // Navigation tabs within VPNeg
  const [activeTab, setActiveTab] = useState<'crm' | 'pautas' | 'metricas'>('crm');
  const [crmViewMode, setCrmViewMode] = useState<'kanban' | 'lista'>('kanban');

  // Modals state
  const [selectedCard, setSelectedCard] = useState<CRMCard | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Modal Venda de Pauta
  const [vendaModalOpen, setVendaModalOpen] = useState(false);
  const [vendaForm, setVendaForm] = useState({ eventoId: '', tipo: 'magna' as 'magna' | 'paralela', parceiroNome: '', valor: '' });

  const eventosAno = useMemo(
    () => eventos.filter(e => new Date(e.dataInicio + 'T12:00:00').getFullYear() === selectedYear),
    [eventos, selectedYear]
  );

  const totalVendido = vendas
    .filter(v => eventosAno.some(e => e.id === v.eventoId))
    .reduce((acc, v) => acc + (v.valor || 0), 0);

  // Métricas do CRM
  const totalParceiros = cards.length;
  const leadsQuentes = cards.filter(c => c.etiquetas?.includes('Quente')).length;
  const parceriasFechadas = cards.filter(c => c.faseId === 'parceria_fechada');
  const valorTotalFechado = parceriasFechadas.reduce((acc, c) => acc + (Number(c.valores?.valor_fechado) || 0), 0);

  // Handlers para CRM
  const handleOpenCard = (card: CRMCard) => {
    setSelectedCard(card);
    setIsCardModalOpen(true);
  };

  const handleQuickAdd = (faseId: string) => {
    const novo = createCard({
      titulo: 'Novo Parceiro ' + (cards.length + 1),
      faseId,
      etiquetas: ['Morno']
    });
    setSelectedCard(novo);
    setIsCardModalOpen(true);
  };

  // Handlers para Venda de Pautas
  const abrirModalVenda = (eventoId?: string) => {
    setVendaForm({ eventoId: eventoId || eventosAno[0]?.id || '', tipo: 'magna', parceiroNome: '', valor: '' });
    setVendaModalOpen(true);
  };

  const salvarVenda = async () => {
    if (!vendaForm.eventoId || !vendaForm.parceiroNome.trim()) return;
    await registrarVenda(vendaForm.eventoId, vendaForm.tipo, vendaForm.parceiroNome.trim(), vendaForm.valor !== '' ? Number(vendaForm.valor) : null);
    setVendaModalOpen(false);
  };

  if (eventosLoading || gradeLoading || crmLoading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando painel VPNeg...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">VPNeg — Vice-Presidência de Negócios</h1>
              <Badge variant="outline" className="text-xs font-bold border-indigo-400 text-indigo-500">
                Pipefy CRM
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Funil de Parceiros comerciais, negociações de cotas e venda de pautas sincronizadas com FE.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {activeTab === 'crm' && (
            <Button 
              size="sm"
              onClick={() => setIsAssistantModalOpen(true)}
              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm font-semibold text-xs h-9"
            >
              <Sparkles size={14} /> Inserir via IA (Reunião)
            </Button>
          )}

          {activeTab === 'pautas' && (
            <Button size="sm" onClick={() => abrirModalVenda()} disabled={eventosAno.length === 0} className="h-9 text-xs">
              <Plus size={14} className="mr-1" /> Registrar venda de pauta
            </Button>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-4">
        <div className="flex items-center justify-between border-b border-border">
          <TabsList className="bg-transparent h-10 p-0 gap-6">
            <TabsTrigger 
              value="crm" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-xs font-bold gap-2"
            >
              <Kanban size={15} /> CRM de Parceiros (Pipefy)
            </TabsTrigger>
            <TabsTrigger 
              value="pautas" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-xs font-bold gap-2"
            >
              <Briefcase size={15} /> Venda de Pautas de Eventos
            </TabsTrigger>
            <TabsTrigger 
              value="metricas" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-xs font-bold gap-2"
            >
              <TrendingUp size={15} /> Métricas Comerciais
            </TabsTrigger>
          </TabsList>

          {/* Sub-view switcher for CRM: Kanban vs Lista */}
          {activeTab === 'crm' && (
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg">
              <Button
                variant={crmViewMode === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs gap-1.5 px-2.5"
                onClick={() => setCrmViewMode('kanban')}
              >
                <Kanban size={13} /> Kanban
              </Button>
              <Button
                variant={crmViewMode === 'lista' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs gap-1.5 px-2.5"
                onClick={() => setCrmViewMode('lista')}
              >
                <ListFilter size={13} /> Lista
              </Button>
            </div>
          )}
        </div>

        {/* TAB 1: CRM de Parceiros (Pipefy) */}
        <TabsContent value="crm" className="m-0 space-y-4">
          {crmViewMode === 'kanban' ? (
            <CRMKanban 
              fases={fases}
              cards={cards}
              tags={tags}
              onCardClick={handleOpenCard}
              onQuickAddCard={handleQuickAdd}
              onOpenAssistantModal={() => setIsAssistantModalOpen(true)}
              onOpenConfigModal={() => setIsConfigModalOpen(true)}
              onQuickMoveCard={moveCard}
            />
          ) : (
            <CRMListView 
              fases={fases}
              cards={cards}
              tags={tags}
              onCardClick={handleOpenCard}
              onQuickMoveCard={moveCard}
              onDeleteCard={deleteCard}
            />
          )}
        </TabsContent>

        {/* TAB 2: Venda de Pautas (Original Feature integrada com FE) */}
        <TabsContent value="pautas" className="m-0 space-y-6">
          {/* Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Pautas vendidas em {selectedYear}</p>
                <p className="text-2xl font-bold text-foreground">
                  {vendas.filter(v => eventosAno.some(e => e.id === v.eventoId)).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Receita com pautas</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  R$ {totalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Aguardando alocação pela FE</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {vendas.filter(v => v.status === 'vendida' && eventosAno.some(e => e.id === v.eventoId)).length}
                </p>
              </CardContent>
            </Card>
          </div>

          {eventosAno.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground space-y-2">
                <CalendarRange className="mx-auto text-muted-foreground" size={32} />
                <p className="text-sm">Nenhum evento cadastrado para o ano {selectedYear}.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {eventosAno.map(e => {
                const config = getConfig(e.id);
                const vendasEvento = vendas.filter(v => v.eventoId === e.id);
                const vendidasMagnas = vendasEvento.filter(v => v.tipo === 'magna').length;
                const vendidasParalelas = vendasEvento.filter(v => v.tipo === 'paralela').length;
                
                const totalMagnas = config.magnasVendaveis;
                const totalParalelas = config.paralelasVendaveis;

                const dispMagnas = totalMagnas - vendidasMagnas;
                const dispParalelas = totalParalelas - vendidasParalelas;

                return (
                  <Card key={e.id}>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base">{e.nome}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(e.dataInicio + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR })}
                          {e.dataFim !== e.dataInicio && ` a ${format(new Date(e.dataFim + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR })}`}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => abrirModalVenda(e.id)}>
                        <Plus size={14} className="mr-1" /> Vender pauta
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-purple-500/10 p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground font-medium">Pautas magnas</p>
                            {config.magnasNaGrade > 0 && (
                              <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-300">
                                {config.magnasNaGrade} na grade
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-bold text-foreground">
                            {vendidasMagnas} vendidas / {totalMagnas} disponíveis
                          </p>
                          <p className={`text-xs font-semibold ${dispMagnas > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                            {dispMagnas > 0 ? `${dispMagnas} restantes` : 'Esgotadas'}
                          </p>
                        </div>

                        <div className="rounded-lg bg-emerald-500/10 p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground font-medium">Pautas paralelas</p>
                            {config.paralelasNaGrade > 0 && (
                              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                                {config.paralelasNaGrade} na grade
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-bold text-foreground">
                            {vendidasParalelas} vendidas / {totalParalelas} disponíveis
                          </p>
                          <p className={`text-xs font-semibold ${dispParalelas > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                            {dispParalelas > 0 ? `${dispParalelas} restantes` : 'Esgotadas'}
                          </p>
                        </div>
                      </div>

                      {vendasEvento.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Vendas realizadas:</p>
                          {vendasEvento.map(v => (
                            <div key={v.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 bg-muted/20">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-[10px]">
                                  {v.tipo === 'magna' ? 'Magna' : 'Paralela'}
                                </Badge>
                                <span className="text-sm font-medium text-foreground">{v.parceiroNome}</span>
                                {v.valor !== null && (
                                  <span className="text-xs text-muted-foreground">
                                    R$ {v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                )}
                                <Badge variant={v.status === 'alocada' ? 'secondary' : 'default'} className="text-[10px]">
                                  {v.status === 'alocada' ? 'Alocada na grade' : 'Aguardando alocação'}
                                </Badge>
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteVenda(v.id)}>
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB 3: Métricas Comerciais */}
        <TabsContent value="metricas" className="m-0 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-medium">Total de Parceiros</span>
                  <Building2 size={16} />
                </div>
                <p className="text-2xl font-bold text-foreground">{totalParceiros}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Cadastrados no funil Pipefy</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-medium">Leads Quentes</span>
                  <Flame size={16} className="text-red-500" />
                </div>
                <p className="text-2xl font-bold text-red-500">{leadsQuentes}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Alta probabilidade de conversão</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-medium">Parcerias Fechadas</span>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {parceriasFechadas.length}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">Contratos vigentes em 2026</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-medium">Receita em Parcerias</span>
                  <DollarSign size={16} className="text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">
                  R$ {valorTotalFechado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">Total captado pela VPNeg</p>
              </CardContent>
            </Card>
          </div>

          {/* Distribuição por Fases */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Distribuição do Pipeline por Fase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fases.map(fase => {
                  const faseCards = cards.filter(c => c.faseId === fase.id);
                  const pct = totalParceiros > 0 ? Math.round((faseCards.length / totalParceiros) * 100) : 0;

                  return (
                    <div key={fase.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: fase.cor }} />
                          {fase.nome}
                        </span>
                        <span className="text-muted-foreground font-mono">
                          {faseCards.length} parceiros ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: fase.cor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Card Completo (Pipefy 3-colunas) */}
      <CRMCardModal 
        card={selectedCard}
        fases={fases}
        tags={tags}
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onUpdate={updateCard}
        onMove={moveCard}
        onDelete={deleteCard}
        onAddFieldToFase={addCampoToFase}
      />

      {/* Modal Assistente IA de Inserção de Reunião */}
      <CRMAssistantModal 
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
        fases={fases}
        cards={cards}
        onParse={parseMeeting}
        onCreateCard={createCard}
        onUpdateCard={updateCard}
        onMoveCard={moveCard}
      />

      {/* Modal de Configuração do Pipe */}
      <CRMConfigModal 
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        fases={fases}
        tags={tags}
        onCreateFase={createFase}
        onUpdateFase={updateFase}
        onDeleteFase={deleteFase}
        onAddFieldToFase={addCampoToFase}
        onDeleteFieldFromFase={deleteCampoFromFase}
        onResetToSeed={resetToSeed}
      />

      {/* Modal de Venda de Pauta */}
      <Dialog open={vendaModalOpen} onOpenChange={setVendaModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar venda de pauta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Evento</Label>
              <Select value={vendaForm.eventoId} onValueChange={v => setVendaForm({ ...vendaForm, eventoId: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione o evento" /></SelectTrigger>
                <SelectContent>
                  {eventosAno.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Tipo de pauta</Label>
              <Select value={vendaForm.tipo} onValueChange={v => setVendaForm({ ...vendaForm, tipo: v as 'magna' | 'paralela' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="magna">Pauta Magna</SelectItem>
                  <SelectItem value="paralela">Pauta Paralela</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Nome do parceiro / empresa</Label>
              <Input
                value={vendaForm.parceiroNome}
                onChange={e => setVendaForm({ ...vendaForm, parceiroNome: e.target.value })}
                placeholder="Ex.: Stone, Falconi, Ambev..."
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Valor da cota (R$)</Label>
              <Input
                type="number"
                min={0}
                step={100}
                value={vendaForm.valor}
                onChange={e => setVendaForm({ ...vendaForm, valor: e.target.value })}
                placeholder="Ex.: 5000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVendaModalOpen(false)}>Cancelar</Button>
            <Button onClick={salvarVenda} disabled={!vendaForm.parceiroNome.trim()}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessView;
