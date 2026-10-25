import { useState, useMemo } from 'react';
import {
  CalendarRange,
  Plus,
  AlertCircle,
  Save,
  Table,
  Calendar,
  Briefcase,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Pencil,
  Trash2,
  FileSpreadsheet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventos } from '@/hooks/useEventos';
import {
  useGradeConteudo,
  TIPO_MOMENTO_LABELS,
  PautaEvento,
  PautaVendida,
} from '@/hooks/useGradeConteudo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MomentoDialog, MomentoFormValues } from './MomentoDialog';
import { GradeCronologicaTable } from './GradeCronologicaTable';
import { GradeTemplatesModal } from './GradeTemplatesModal';
import { TemplateMomento } from './gradeTemplates';
import GradeLivreEditor from './GradeLivreEditor';
import { toast } from '@/hooks/use-toast';

interface GradeConteudoSectionProps {
  selectedYear: number;
}

const GradeConteudoSection = ({ selectedYear }: GradeConteudoSectionProps) => {
  const { eventos, loading: eventosLoading } = useEventos();
  const {
    pautas,
    vendas,
    loading,
    getConfig,
    saveConfig,
    syncCotasComGrade,
    addPauta,
    updatePauta,
    deletePauta,
  } = useGradeConteudo();

  const eventosAno = useMemo(
    () => eventos.filter(e => new Date(e.dataInicio + 'T12:00:00').getFullYear() === selectedYear),
    [eventos, selectedYear]
  );

  const [eventoSelecionado, setEventoSelecionado] = useState<string>('');
  const eventoId = eventoSelecionado || eventosAno[0]?.id || '';
  const evento = eventosAno.find(e => e.id === eventoId);

  // Configuração e pautas conectadas do evento
  const config = eventoId ? getConfig(eventoId) : undefined;
  const pautasEvento = pautas.filter(p => p.eventoId === eventoId);
  const vendasEvento = vendas.filter(v => v.eventoId === eventoId);
  const vendasPendentes = vendasEvento.filter(v => v.status === 'vendida');

  // Pautas comerciais (Magnas e Paralelas) presentes na grade deste evento
  const pautasComerciaisNaGrade = useMemo(() => {
    return pautasEvento.filter(p => p.tipo === 'magna' || p.tipo === 'paralela');
  }, [pautasEvento]);

  const vendidasMagnas = vendasEvento.filter(v => v.tipo === 'magna').length;
  const vendidasParalelas = vendasEvento.filter(v => v.tipo === 'paralela').length;

  const magnasNaGrade = config?.magnasNaGrade ?? 0;
  const paralelasNaGrade = config?.paralelasNaGrade ?? 0;

  // Cotas vendáveis totais (sempre >= quantidade na grade)
  const cotasMagnasTotal = config?.magnasVendaveis ?? 0;
  const cotasParalelasTotal = config?.paralelasVendaveis ?? 0;

  const dispMagnas = Math.max(0, cotasMagnasTotal - vendidasMagnas);
  const dispParalelas = Math.max(0, cotasParalelasTotal - vendidasParalelas);

  // Estado do formulário de cotas
  const [cotasForm, setCotasForm] = useState<{ magnas: string; paralelas: string } | null>(null);
  const cotasMagnasInput = cotasForm?.magnas ?? String(cotasMagnasTotal);
  const cotasParalelasInput = cotasForm?.paralelas ?? String(cotasParalelasTotal);

  // Modal de Adicionar / Editar momento
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<PautaEvento | null>(null);
  const [vendaParaAlocar, setVendaParaAlocar] = useState<PautaVendida | null>(null);
  const [sugestaoInicio, setSugestaoInicio] = useState<string>('09:00');
  const [diaPadraoModal, setDiaPadraoModal] = useState<string>('');

  // Modal de Templates / Modelos
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);

  // Sub-visão dentro da Planilha da Grade (Tabela Dinâmica vs Planilha Matricial)
  const [subVisaoPlanilha, setSubVisaoPlanilha] = useState<'tabela' | 'matricial'>('tabela');

  const abrirNovoMomento = (sugestaoHora?: string, diaPre?: string, tipoPre?: string) => {
    setEditando(null);
    setVendaParaAlocar(null);
    if (sugestaoHora) setSugestaoInicio(sugestaoHora);
    if (diaPre) setDiaPadraoModal(diaPre);
    else if (evento?.dataInicio) setDiaPadraoModal(evento.dataInicio);
    setModalOpen(true);
  };

  const abrirEdicaoMomento = (p: PautaEvento) => {
    setEditando(p);
    setVendaParaAlocar(null);
    setModalOpen(true);
  };

  const abrirAlocarVenda = (venda: PautaVendida) => {
    setEditando(null);
    setVendaParaAlocar(venda);
    setModalOpen(true);
  };

  const salvarMomento = async (values: MomentoFormValues) => {
    const input = {
      eventoId,
      tipo: values.tipo as any,
      titulo: values.titulo,
      tematicaMacro: values.tematicaMacro,
      dia: values.dia || null,
      horario: values.horario,
      ministranteTipo: (values.ministranteTipo || null) as any,
      ministranteNome: values.ministranteNome,
      parceiroNome: values.parceiroNome,
      csat: values.csat !== '' ? Number(values.csat) : null,
      vendaId: values.vendaId,
    };

    if (editando) {
      await updatePauta(editando.id, input);
    } else {
      await addPauta(input);
    }
  };

  const handleDuplicar = async (pauta: PautaEvento) => {
    const input = {
      eventoId: pauta.eventoId,
      tipo: pauta.tipo,
      titulo: `${pauta.titulo || 'Pauta'} (Trilha Paralela)`,
      tematicaMacro: pauta.tematicaMacro,
      dia: pauta.dia,
      horario: pauta.horario,
      ministranteTipo: pauta.ministranteTipo,
      ministranteNome: pauta.ministranteNome,
      parceiroNome: pauta.parceiroNome,
      csat: null,
      vendaId: null,
      ordem: pauta.ordem + 1,
    };
    await addPauta(input);
  };

  const handleQuickUpdateTitulo = async (id: string, novoTitulo: string) => {
    await updatePauta(id, { titulo: novoTitulo });
  };

  const salvarCotas = async () => {
    await saveConfig(eventoId, Number(cotasMagnasInput) || 0, Number(cotasParalelasInput) || 0);
    setCotasForm(null);
  };

  const handleSincronizarComGrade = async () => {
    await syncCotasComGrade(eventoId);
    setCotasForm(null);
  };

  // Aplicação do Modelo / Template
  const handleAplicarTemplate = async (momentos: TemplateMomento[], substituir: boolean) => {
    if (!eventoId) return;

    if (substituir && pautasEvento.length > 0) {
      // Exclui os momentos existentes
      for (const p of pautasEvento) {
        await deletePauta(p.id);
      }
    }

    const baseOrdem = substituir ? 0 : pautasEvento.length;
    const diaEvento = evento?.dataInicio || null;

    // Insere os momentos do template
    for (let i = 0; i < momentos.length; i++) {
      const m = momentos[i];
      await addPauta({
        eventoId,
        tipo: m.tipo as any,
        titulo: m.titulo,
        tematicaMacro: m.tematicaMacro,
        dia: diaEvento,
        horario: m.horario,
        ministranteTipo: (m.ministranteTipo || null) as any,
        ministranteNome: m.ministranteNome || '',
        parceiroNome: m.parceiroNome || '',
        csat: m.csat ?? null,
        ordem: baseOrdem + i,
      });
    }

    toast({
      title: 'Modelo aplicado com sucesso!',
      description: `${momentos.length} momentos foram adicionados à grade e já estão 100% editáveis.`,
    });
  };

  if (eventosLoading || loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando grade de conteúdo...</div>;
  }

  if (eventosAno.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <CalendarRange size={40} className="mx-auto mb-3 opacity-40" />
          <p>Nenhum evento cadastrado em {selectedYear}.</p>
          <p className="text-sm">Cadastre eventos na calendarização para montar a grade de conteúdo aqui.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seletor de Evento */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Label className="text-sm font-semibold shrink-0">Evento:</Label>
          <Select
            value={eventoId}
            onValueChange={id => {
              setEventoSelecionado(id);
              setCotasForm(null);
            }}
          >
            <SelectTrigger className="w-full sm:w-96 font-medium">
              <SelectValue placeholder="Selecione o evento" />
            </SelectTrigger>
            <SelectContent>
              {eventosAno.map(e => (
                <SelectItem key={e.id} value={e.id}>
                  {e.nome} — {format(new Date(e.dataInicio + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {evento && (
            <Badge variant="outline" className="w-fit text-xs font-medium">
              {format(new Date(evento.dataInicio + 'T12:00:00'), "dd/MM", { locale: ptBR })}
              {evento.dataFim !== evento.dataInicio &&
                ` a ${format(new Date(evento.dataFim + 'T12:00:00'), "dd/MM", { locale: ptBR })}`}
            </Badge>
          )}
        </div>

        {/* Botão de Templates de Grade */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10 font-semibold"
            onClick={() => setTemplatesModalOpen(true)}
          >
            <Sparkles size={14} className="text-primary" />
            <span>Modelos de Grade (Templates)</span>
          </Button>
        </div>
      </div>

      {/* ABAS: 1ª Pautas e Vendas VPNeg | 2ª Planilha da Grade */}
      <Tabs defaultValue="comercial" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="comercial" className="gap-2">
            <Briefcase size={14} />
            <span>Pautas e Vendas VPNeg</span>
            {(vendidasMagnas + vendidasParalelas > 0 || vendasPendentes.length > 0) && (
              <Badge variant="secondary" className="text-[10px] ml-1 px-1.5 py-0 h-4">
                {vendidasMagnas + vendidasParalelas} vendidas
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="planilha" className="gap-2">
            <Calendar size={14} />
            <span>Planilha da Grade</span>
            <Badge variant="secondary" className="text-[10px] ml-1 px-1.5 py-0 h-4">
              {pautasEvento.length} momentos
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ========================================================
            ABA 1: PAUTAS E VENDAS VPNEG
            ======================================================== */}
        <TabsContent value="comercial" className="space-y-6">
          {/* Card de Cotas Vendáveis (Sincronizado automaticamente com a Grade) */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Briefcase size={16} className="text-primary" />
                  Cotas de pautas vendáveis (interface com VPNeg)
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  As pautas magnas e paralelas adicionadas à grade contam automaticamente como vendáveis na VPNeg.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1.5"
                onClick={handleSincronizarComGrade}
                title="Ajusta as cotas vendáveis para igualar exatamente às pautas cadastradas na grade"
              >
                <RefreshCw size={12} /> Sincronizar com a grade
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pautas Magnas */}
                <div className="rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-500/5 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-purple-900 dark:text-purple-300">
                      Pautas magnas vendáveis
                    </Label>
                    <Badge variant="outline" className="text-[10px] text-purple-700 border-purple-300">
                      {magnasNaGrade} na grade
                    </Badge>
                  </div>
                  <Input
                    type="number"
                    min={magnasNaGrade}
                    value={cotasMagnasInput}
                    onChange={e => setCotasForm({ magnas: e.target.value, paralelas: cotasParalelasInput })}
                    className="h-9 font-semibold"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
                    <span>Vendidas VPNeg: <strong>{vendidasMagnas}</strong></span>
                    <span className={`font-semibold ${dispMagnas > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                      Disponíveis: {dispMagnas}
                    </span>
                  </div>
                </div>

                {/* Pautas Paralelas */}
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-500/5 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      Pautas paralelas vendáveis
                    </Label>
                    <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300">
                      {paralelasNaGrade} na grade
                    </Badge>
                  </div>
                  <Input
                    type="number"
                    min={paralelasNaGrade}
                    value={cotasParalelasInput}
                    onChange={e => setCotasForm({ magnas: cotasMagnasInput, paralelas: e.target.value })}
                    className="h-9 font-semibold"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
                    <span>Vendidas VPNeg: <strong>{vendidasParalelas}</strong></span>
                    <span className={`font-semibold ${dispParalelas > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                      Disponíveis: {dispParalelas}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button size="sm" onClick={salvarCotas} disabled={!cotasForm}>
                  <Save size={14} className="mr-1.5" /> Salvar cotas
                </Button>
                <span className="text-xs text-muted-foreground">
                  Total de vagas comerciais: <strong>{cotasMagnasTotal + cotasParalelasTotal}</strong>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pautas vendidas pela VPNeg aguardando alocação */}
          {vendasPendentes.length > 0 && (
            <Card className="border-amber-400/50 bg-amber-50/50 dark:bg-amber-900/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-500" />
                  Pautas vendidas pela VPNeg aguardando alocação na grade
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Estas vendas foram registradas no painel comercial da VPNeg e precisam ser posicionadas no horário do evento.
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {vendasPendentes.map(v => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between gap-2 bg-card rounded-lg border border-border p-3 shadow-xs"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={v.tipo === 'magna' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'}>
                        {v.tipo === 'magna' ? 'Pauta Magna' : 'Pauta Paralela'}
                      </Badge>
                      <span className="text-sm font-semibold text-foreground">{v.parceiroNome}</span>
                      {v.valor !== null && (
                        <span className="text-xs text-muted-foreground font-medium">
                          R$ {v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                    <Button size="sm" variant="default" onClick={() => abrirAlocarVenda(v)}>
                      <Plus size={13} className="mr-1" /> Alocar na grade
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Pautas Magnas e Paralelas Cadastradas no Evento */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold">
                  Pautas Magnas e Paralelas da Grade ({pautasComerciaisNaGrade.length})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Momentos com potencial comercial cadastrados na grade. Ao adicionar aqui, eles aparecem automaticamente na Planilha da Grade.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => abrirNovoMomento(undefined, undefined, 'magna')}>
                  <Plus size={13} /> Pauta Magna
                </Button>
                <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => abrirNovoMomento(undefined, undefined, 'paralela')}>
                  <Plus size={13} /> Pauta Paralela
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pautasComerciaisNaGrade.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  <Sparkles size={32} className="mx-auto mb-2 opacity-30 text-primary" />
                  <p className="text-sm font-semibold">Nenhuma pauta magna ou paralela cadastrada ainda.</p>
                  <p className="text-xs mt-1">
                    Adicione pautas magnas ou paralelas ou aplique um dos modelos oficiais para preencher a grade.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => setTemplatesModalOpen(true)}>
                      <Sparkles size={13} /> Usar Modelo de Grade
                    </Button>
                    <Button size="sm" className="text-xs" onClick={() => abrirNovoMomento()}>
                      <Plus size={13} className="mr-1" /> Adicionar momento
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {pautasComerciaisNaGrade.map(p => {
                    const isVendida = !!p.vendaId || !!p.parceiroNome;
                    return (
                      <div
                        key={p.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <Badge
                            className={
                              p.tipo === 'magna'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                            }
                          >
                            {p.tipo === 'magna' ? 'Pauta Magna' : 'Pauta Paralela'}
                          </Badge>
                          <span className="text-sm font-semibold text-foreground">{p.titulo || 'Pauta sem título'}</span>
                          {p.tematicaMacro && (
                            <Badge variant="outline" className="text-[10px]">{p.tematicaMacro}</Badge>
                          )}
                          {p.horario && (
                            <span className="text-xs text-muted-foreground">⏱️ {p.horario}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {isVendida ? (
                            <Badge variant="secondary" className="text-xs gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300">
                              <CheckCircle2 size={12} /> Vendida: {p.parceiroNome || 'Parceiro'}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-500/5">
                              Disponível para venda
                            </Badge>
                          )}

                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => abrirEdicaoMomento(p)}
                              title="Editar"
                            >
                              <Pencil size={13} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => deletePauta(p.id)}
                              title="Excluir"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================
            ABA 2: PLANILHA DA GRADE (Grade Completa Cronológica)
            ======================================================== */}
        <TabsContent value="planilha" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  Planilha da grade{evento ? ` — ${evento.nome}` : ''}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Organização cronológica de todos os momentos. Qualquer alteração feita aqui reflete instantaneamente nas cotas da VPNeg.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Botão de Modelos de Grade */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10 font-semibold"
                  onClick={() => setTemplatesModalOpen(true)}
                  title="Carregar ou salvar templates de grade de conteúdo"
                >
                  <Sparkles size={13} />
                  <span>Modelos de Grade</span>
                </Button>

                {/* Alternador de visualização Tabela Cronológica vs Matricial */}
                <div className="hidden sm:flex items-center gap-1 bg-muted p-1 rounded-lg">
                  <Button
                    type="button"
                    size="sm"
                    variant={subVisaoPlanilha === 'tabela' ? 'default' : 'ghost'}
                    className="h-7 text-xs gap-1.5"
                    onClick={() => setSubVisaoPlanilha('tabela')}
                  >
                    <Calendar size={12} />
                    <span>Tabela Cronológica</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={subVisaoPlanilha === 'matricial' ? 'default' : 'ghost'}
                    className="h-7 text-xs gap-1.5"
                    onClick={() => setSubVisaoPlanilha('matricial')}
                    title="Modo matricial de células"
                  >
                    <Table size={12} />
                    <span>Planilha Matricial</span>
                  </Button>
                </div>

                <Button size="sm" onClick={() => abrirNovoMomento()}>
                  <Plus size={14} className="mr-1" /> Adicionar momento
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {subVisaoPlanilha === 'tabela' ? (
                <GradeCronologicaTable
                  pautas={pautasEvento}
                  evento={evento}
                  cotasMagnas={cotasMagnasTotal}
                  cotasParalelas={cotasParalelasTotal}
                  onAdicionar={abrirNovoMomento}
                  onEditar={abrirEdicaoMomento}
                  onExcluir={deletePauta}
                  onDuplicar={handleDuplicar}
                  onQuickUpdateTitulo={handleQuickUpdateTitulo}
                />
              ) : (
                <GradeLivreEditor key={eventoId} eventoId={eventoId} pautas={pautasEvento} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Inteligente de Adicionar / Editar Momento */}
      <MomentoDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={salvarMomento}
        editando={editando}
        vendaParaAlocar={vendaParaAlocar}
        evento={evento}
        sugestaoHorarioInicio={sugestaoInicio}
        diaPadrao={diaPadraoModal}
      />

      {/* Modal de Modelos / Templates de Referência */}
      <GradeTemplatesModal
        open={templatesModalOpen}
        onOpenChange={setTemplatesModalOpen}
        pautasAtuais={pautasEvento}
        nomeEvento={evento?.nome || 'Evento Atual'}
        dataInicioEvento={evento?.dataInicio}
        onAplicarTemplate={handleAplicarTemplate}
      />
    </div>
  );
};

export default GradeConteudoSection;
