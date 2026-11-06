// src/components/business/VPNegCalculatorView.tsx
import { useState, useMemo } from 'react';
import {
  Calculator,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  Save,
  FolderOpen,
  BookOpen,
  BarChart3,
  Info,
  Search,
  Minus,
  Link2,
  Sliders,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVPNegCalculator } from '@/hooks/useVPNegCalculator';
import { exportVPNegCalculatorToExcel } from '@/utils/vpnegCalculatorExport';
import { CalculadoraBlocoId } from '@/types/vpnegCalculator';
import { CRMCard } from '@/types/crm';
import { toast } from '@/hooks/use-toast';

interface VPNegCalculatorViewProps {
  cards?: CRMCard[];
  onApplyProposalToCard?: (cardId: string, valorFinal: number, resumoItens: string) => void;
}

const fmtCurrency = (val: number) =>
  'R$ ' +
  (Number.isFinite(val) ? val : 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtIntCurrency = (val: number) =>
  'R$ ' +
  Math.round(Number.isFinite(val) ? val : 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export function VPNegCalculatorView({
  cards = [],
  onApplyProposalToCard,
}: VPNegCalculatorViewProps) {
  const {
    state,
    computedFonte,
    computedMarkup,
    computedMidia,
    computedJornada,
    computedEventosBase,
    computedModificadoresEventos,
    computedCalculadoraRows,
    totaisCalculadora,
    computedCatalogo,
    setUnidades,
    setValorPraticado,
    setMultiplicadorLinha,
    aplicarPacoteSugeridoComunicacao,
    zerarUnidades,
    restaurarValoresPraticadosPadrao,
    addCustomCalculadoraRow,
    deleteCalculadoraRow,
    updateMarkupConfig,
    updateFonteCalculo,
    resetFonteCalculoOverride,
    updateMidiaItem,
    updateJornadaItem,
    updateEventoCustoBase,
    updateModificadorEvento,
    updateCatalogoRow,
    addKPIRegistro,
    deleteKPIRegistro,
    setDescontoPropostaAtual,
    setParceiroPropostaAtual,
    salvarSimulacao,
    carregarSimulacao,
    excluirSimulacao,
    resetarTudoParaPlanilhaOriginal,
  } = useVPNegCalculator();

  const [subTab, setSubTab] = useState<'calculadora' | 'base_custos' | 'catalogo' | 'kpis'>('calculadora');
  const [selectedCardId, setSelectedCardId] = useState<string>('none');
  const [onlySelectedFilter, setOnlySelectedFilter] = useState(false);

  // Modal Nova Ação na Calculadora
  const [addActionModalOpen, setAddActionModalOpen] = useState(false);
  const [newActionForm, setNewActionForm] = useState({
    bloco: 'produtos_conexao' as CalculadoraBlocoId,
    categoria: 'Interesse' as 'Consciência' | 'Interesse' | 'Conversão',
    acao: '',
    valorPraticado: '',
    unidades: '1',
  });

  // Modal Salvar Simulação
  const [saveSimModalOpen, setSaveSimModalOpen] = useState(false);
  const [simNameInput, setSimNameInput] = useState('');

  // Catálogo filtros
  const [catSearch, setCatSearch] = useState('');
  const [catStageFilter, setCatStageFilter] = useState<string>('todas');

  // KPIs Acompanhamento filtros (idênticos à aba KPIs | Acompanhamento)
  const [kpiFilterParceiro, setKpiFilterParceiro] = useState<string>('todos');
  const [kpiFilterAcao, setKpiFilterAcao] = useState<string>('todas');
  const [kpiFilterEvento, setKpiFilterEvento] = useState<string>('todos');

  // Modal Novo Registro de KPI
  const [kpiModalOpen, setKpiModalOpen] = useState(false);
  const [newKpiForm, setNewKpiForm] = useState({
    acao: 'Pauta Magna',
    parceiro: '',
    dataAcao: new Date().toISOString().slice(0, 10),
    evento: 'CentralRio',
    empresariosImpactados: '',
    curtidas: '',
    mencoes: '',
    interacoes: '',
    comentarios: '',
    nps: '',
    awarenessPre: '',
    awarenessPos: '',
    interessePre: '',
    interessePos: '',
    empregabilidadePre: '',
    empregabilidadePos: '',
    contatosIndicados: '',
    inscricoesFacilitadas: '',
    conversoes: '',
  });

  const handleExportExcel = () => {
    exportVPNegCalculatorToExcel(state, {
      computedFonte,
      computedMarkup,
      computedMidia,
      computedJornada,
      computedEventosBase,
      computedModificadoresEventos,
      computedCalculadoraRows,
      totaisCalculadora,
      computedCatalogo,
    });
    toast({
      title: 'Planilha Calculadora exportada (.xlsx)',
      description: 'O arquivo contém todas as 6 abas e fórmulas dinâmicas de Excel prontas para uso.',
    });
  };

  const handleSelectCRMCard = (cardId: string) => {
    setSelectedCardId(cardId);
    if (cardId !== 'none') {
      const found = cards.find(c => c.id === cardId);
      if (found) {
        setParceiroPropostaAtual(found.titulo);
      }
    }
  };

  const handleApplyToCRM = () => {
    if (!onApplyProposalToCard || selectedCardId === 'none') {
      toast({
        title: 'Selecione um Parceiro do CRM',
        description: 'Escolha um card do funil para vincular o valor e os itens selecionados.',
        variant: 'destructive',
      });
      return;
    }
    const itensAtivos = computedCalculadoraRows.filter(r => r.unidades > 0);
    const resumo = itensAtivos
      .map(i => `${i.unidades}x ${i.acao} (${fmtCurrency(i.subtotal)})`)
      .join('; ');
    onApplyProposalToCard(selectedCardId, totaisCalculadora.totalComDesconto, resumo);
    toast({
      title: 'Proposta aplicada ao Card no CRM!',
      description: `Valor de ${fmtCurrency(totaisCalculadora.totalComDesconto)} vinculado ao parceiro.`,
    });
  };

  const handleCreateCustomRow = () => {
    if (!newActionForm.acao.trim()) return;
    addCustomCalculadoraRow({
      bloco: newActionForm.bloco,
      categoria: newActionForm.categoria,
      acao: newActionForm.acao.trim(),
      valorPraticado: Number(newActionForm.valorPraticado) || 0,
      unidades: Number(newActionForm.unidades) || 1,
    });
    setNewActionForm({
      bloco: 'produtos_conexao',
      categoria: 'Interesse',
      acao: '',
      valorPraticado: '',
      unidades: '1',
    });
    setAddActionModalOpen(false);
  };

  // Cálculo AVERAGEIFS para KPIs | Acompanhamento
  const kpiMedias = useMemo(() => {
    const filtered = state.kpiRegistros.filter(reg => {
      if (kpiFilterParceiro !== 'todos' && reg.parceiro.toLowerCase() !== kpiFilterParceiro.toLowerCase()) return false;
      if (kpiFilterAcao !== 'todas' && reg.acao.toLowerCase() !== kpiFilterAcao.toLowerCase()) return false;
      if (kpiFilterEvento !== 'todos' && reg.evento.toLowerCase() !== kpiFilterEvento.toLowerCase()) return false;
      return true;
    });

    const avg = (key: keyof typeof filtered[0]) => {
      const nums = filtered
        .map(r => r[key])
        .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
      if (nums.length === 0) return null;
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    };

    return {
      count: filtered.length,
      curtidas: avg('curtidas'),
      mencoes: avg('mencoes'),
      interacoes: avg('interacoes'),
      comentarios: avg('comentarios'),
      nps: avg('nps'),
      awarenessPre: avg('awarenessPre'),
      awarenessPos: avg('awarenessPos'),
      interessePre: avg('interessePre'),
      interessePos: avg('interessePos'),
      empregabilidadePre: avg('empregabilidadePre'),
      empregabilidadePos: avg('empregabilidadePos'),
      contatosIndicados: avg('contatosIndicados'),
      inscricoesFacilitadas: avg('inscricoesFacilitadas'),
      conversoes: avg('conversoes'),
    };
  }, [state.kpiRegistros, kpiFilterParceiro, kpiFilterAcao, kpiFilterEvento]);

  const filteredCatalogo = useMemo(() => {
    return computedCatalogo.filter(c => {
      if (catStageFilter !== 'todas' && c.categoria !== catStageFilter) return false;
      if (catSearch.trim()) {
        const q = catSearch.toLowerCase();
        return (
          c.acao.toLowerCase().includes(q) ||
          c.descricao.toLowerCase().includes(q) ||
          c.kpis.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [computedCatalogo, catStageFilter, catSearch]);

  // Renderizador de Bloco da Calculadora
  const renderCalculadoraBloco = (
    blocoId: CalculadoraBlocoId,
    titulo: string,
    subtitulo: string,
    corBadge: string,
    totalBloco: number,
    showSugestao = false
  ) => {
    const rows = computedCalculadoraRows.filter(
      r => r.bloco === blocoId && (!onlySelectedFilter || r.unidades > 0)
    );

    return (
      <Card className="border-border/80 shadow-sm overflow-hidden">
        <CardHeader className="py-3.5 px-4 bg-muted/30 border-b border-border/60 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-[10px] font-bold ${corBadge}`}>
                {subtitulo}
              </Badge>
              <CardTitle className="text-sm font-bold">{titulo}</CardTitle>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
              Subtotal do Bloco
            </span>
            <span className="text-sm font-extrabold text-foreground font-mono">
              {fmtCurrency(totalBloco)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground">
                  <th className="text-left font-semibold py-2 px-3">Ação</th>
                  {showSugestao && (
                    <th className="text-center font-semibold py-2 px-2 w-16" title="Sugestão do Plano de Comunicação">
                      Sug.
                    </th>
                  )}
                  <th className="text-right font-semibold py-2 px-2 w-28">Base (Fórmula)</th>
                  <th className="text-right font-semibold py-2 px-2 w-36">Valor Praticado (R$)</th>
                  <th className="text-center font-semibold py-2 px-2 w-28">Unidades</th>
                  <th className="text-right font-semibold py-2 px-3 w-28">Valor Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={showSugestao ? 6 : 5} className="text-center py-6 text-muted-foreground">
                      Nenhum item selecionado neste bloco.
                    </td>
                  </tr>
                ) : (
                  rows.map(row => {
                    const isSelected = row.unidades > 0;
                    const isCustom = row.id.startsWith('calc_custom_');
                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-primary/5 hover:bg-primary/10'
                            : 'hover:bg-muted/30'
                        }`}
                      >
                        <td className="py-2 px-3">
                          <div className="flex items-center justify-between gap-1">
                            <div>
                              <span className={`font-medium ${isSelected ? 'text-foreground font-semibold' : 'text-foreground/90'}`}>
                                {row.acao}
                              </span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  {row.refFormulaExcel.replace("'Base de Custos | Fixos e Ações'!", 'Base!')}
                                </span>
                                {row.multiplicadorFormula !== undefined && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[9px] h-4 px-1 cursor-pointer"
                                    title="Clique para ajustar o multiplicador de desconto antecipado (padrão 0.85)"
                                    onClick={() => {
                                      const novo = window.prompt(
                                        `Multiplicador para "${row.acao}" (Ex: 0.85 = 15% off):`,
                                        String(row.multiplicadorFormula)
                                      );
                                      if (novo !== null && !isNaN(Number(novo))) {
                                        setMultiplicadorLinha(row.id, Number(novo));
                                      }
                                    }}
                                  >
                                    ×{row.multiplicadorFormula}
                                  </Badge>
                                )}
                                {row.isOverridden && (
                                  <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[9px] h-4 px-1">
                                    Editado
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {isCustom && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={() => deleteCalculadoraRow(row.id)}
                                title="Remover ação customizada"
                              >
                                <Trash2 size={12} />
                              </Button>
                            )}
                          </div>
                        </td>

                        {showSugestao && (
                          <td className="py-2 px-2 text-center">
                            {row.sugestaoPacote !== undefined ? (
                              <Badge
                                variant="outline"
                                className="text-[10px] font-mono cursor-pointer hover:bg-primary/10"
                                title="Clique para usar a quantidade sugerida"
                                onClick={() => setUnidades(row.id, row.sugestaoPacote!)}
                              >
                                {row.sugestaoPacote}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        )}

                        <td className="py-2 px-2 text-right font-mono text-muted-foreground">
                          {fmtCurrency(row.precoBaseCalculado)}
                        </td>

                        <td className="py-2 px-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              className={`h-7 w-24 text-right font-mono text-xs px-1.5 ${
                                row.isOverridden
                                  ? 'border-amber-500/60 bg-amber-500/5 font-semibold text-amber-700 dark:text-amber-300'
                                  : ''
                              }`}
                              value={
                                row.isOverridden
                                  ? row.valorPraticadoOverride ?? ''
                                  : Number(row.precoBaseCalculado.toFixed(2))
                              }
                              onChange={e => {
                                const val = e.target.value;
                                if (val === '') {
                                  setValorPraticado(row.id, null);
                                } else {
                                  setValorPraticado(row.id, Number(val));
                                }
                              }}
                            />
                            {row.isOverridden && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                title="Restaurar para preço calculado pela Base de Custos"
                                onClick={() => setValorPraticado(row.id, null)}
                              >
                                <RotateCcw size={11} />
                              </Button>
                            )}
                          </div>
                        </td>

                        <td className="py-2 px-2">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded"
                              onClick={() => setUnidades(row.id, Math.max(0, (row.unidades || 0) - 1))}
                            >
                              <Minus size={11} />
                            </Button>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              className={`h-7 w-12 text-center font-mono text-xs px-1 ${
                                isSelected ? 'border-primary font-bold bg-primary/5' : ''
                              }`}
                              value={row.unidades}
                              onChange={e => setUnidades(row.id, Number(e.target.value))}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded"
                              onClick={() => setUnidades(row.id, (row.unidades || 0) + 1)}
                            >
                              <Plus size={11} />
                            </Button>
                          </div>
                        </td>

                        <td className={`py-2 px-3 text-right font-mono ${isSelected ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                          {fmtCurrency(row.subtotal)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-5">
      {/* Banner / Barra Superior da Calculadora */}
      <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-emerald-500/10 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Calculator size={18} className="text-indigo-500" />
            <h2 className="text-base font-bold text-foreground">
              [Calculadora] Ações e Parceiros | VPNeg 2026
            </h2>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Markup Geral: {computedMarkup.markupGeral.toFixed(4)}x
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Markup Eventos: {computedMarkup.markupEventos.toFixed(4)}x
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Edite as quantidades, os <strong>Valores Praticados</strong> ou toda a <strong>Base de Cálculo</strong> (Markup, Créditos de Mídia, Hora-Homem e Público de Eventos). Exporte a qualquer momento em <code>.xlsx</code> com fórmulas vivas de planilha.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5"
            onClick={() => {
              if (
                window.confirm(
                  'Deseja restaurar toda a Calculadora e a Base de Custos para os valores originais da planilha VPNeg 2026?'
                )
              ) {
                resetarTudoParaPlanilhaOriginal();
              }
            }}
          >
            <RotateCcw size={13} /> Restaurar Planilha Original
          </Button>

          <Button
            size="sm"
            onClick={handleExportExcel}
            className="h-9 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
          >
            <FileSpreadsheet size={15} /> Exportar Planilha Calculadora (.xlsx)
          </Button>
        </div>
      </div>

      {/* Sub-navegação das abas da planilha */}
      <Tabs value={subTab} onValueChange={(v: any) => setSubTab(v)} className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-muted/60">
          <TabsTrigger value="calculadora" className="text-xs py-2 gap-1.5 font-semibold">
            <Calculator size={14} /> 1. Calculadora (Precificação)
          </TabsTrigger>
          <TabsTrigger value="base_custos" className="text-xs py-2 gap-1.5 font-semibold">
            <Sliders size={14} /> 2. Base de Custos & Fonte
          </TabsTrigger>
          <TabsTrigger value="catalogo" className="text-xs py-2 gap-1.5 font-semibold">
            <BookOpen size={14} /> 3. Catálogo de Ações ({computedCatalogo.length})
          </TabsTrigger>
          <TabsTrigger value="kpis" className="text-xs py-2 gap-1.5 font-semibold">
            <BarChart3 size={14} /> 4. KPIs | Acompanhamento
          </TabsTrigger>
        </TabsList>

        {/* ================================================================= */}
        {/* SUB-ABA 1: CALCULADORA (PRECIFICAÇÃO | VPNEG 26)                  */}
        {/* ================================================================= */}
        <TabsContent value="calculadora" className="m-0 space-y-5">
          {/* Cards de Resumo de Totais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-3.5">
                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                  Consciência (E5)
                </span>
                <p className="text-lg font-extrabold font-mono text-foreground mt-0.5">
                  {fmtCurrency(totaisCalculadora.totalConsciencia)}
                </p>
                <span className="text-[10px] text-muted-foreground">Plano de Comunicação</span>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="p-3.5">
                <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
                  Interesse • Prog. (I10)
                </span>
                <p className="text-lg font-extrabold font-mono text-foreground mt-0.5">
                  {fmtCurrency(totaisCalculadora.totalInteresseProgramas)}
                </p>
                <span className="text-[10px] text-muted-foreground">Hackathon, FU, Ignição, Visita</span>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="p-3.5">
                <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
                  Produtos Conexão (N25)
                </span>
                <p className="text-lg font-extrabold font-mono text-foreground mt-0.5">
                  {fmtCurrency(totaisCalculadora.totalProdutosConexao)}
                </p>
                <span className="text-[10px] text-muted-foreground">Eventos, Pautas e Ativações</span>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-3.5">
                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  Conversão & PS (S12)
                </span>
                <p className="text-lg font-extrabold font-mono text-foreground mt-0.5">
                  {fmtCurrency(totaisCalculadora.totalConversaoPS)}
                </p>
                <span className="text-[10px] text-muted-foreground">Divulgação de PS & Headhunting</span>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/30 bg-indigo-500/10">
              <CardContent className="p-3.5">
                <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                  Total Planilha (C18 = ROUND)
                </span>
                <p className="text-xl font-black font-mono text-foreground mt-0.5">
                  {fmtIntCurrency(totaisCalculadora.totalArredondado)}
                </p>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Soma exata: {fmtCurrency(totaisCalculadora.somaExata)}
                </span>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 to-teal-500/10">
              <CardContent className="p-3.5">
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
                  Valor Final Proposta
                </span>
                <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {fmtCurrency(totaisCalculadora.totalComDesconto)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-muted-foreground">Desc. R$:</span>
                  <Input
                    type="number"
                    min="0"
                    step="50"
                    className="h-5 w-20 text-[10px] font-mono px-1 py-0"
                    value={state.descontoPropostaAtual || ''}
                    placeholder="0"
                    onChange={e => setDescontoPropostaAtual(Number(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barra de Ferramentas de Edição Rápida e Vinculação ao CRM */}
          <Card className="border-border/80">
            <CardContent className="p-3.5 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Label className="text-xs font-semibold whitespace-nowrap">Parceiro:</Label>
                  <Input
                    className="h-8 w-44 text-xs"
                    placeholder="Ex: Bain, Stone, Falconi..."
                    value={state.parceiroPropostaAtual}
                    onChange={e => setParceiroPropostaAtual(e.target.value)}
                  />
                </div>

                {cards.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Select value={selectedCardId} onValueChange={handleSelectCRMCard}>
                      <SelectTrigger className="h-8 w-48 text-xs">
                        <SelectValue placeholder="Vincular Card do CRM..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem vínculo com Card</SelectItem>
                        {cards.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCardId !== 'none' && onApplyProposalToCard && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 text-xs gap-1"
                        onClick={handleApplyToCRM}
                      >
                        <Link2 size={13} /> Aplicar no Card CRM
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={aplicarPacoteSugeridoComunicacao}
                  title="Preenche Post=2, Carrossel=2, Story=4, Seq. Story=1, Reels=1, Telegram=2"
                >
                  <Sparkles size={13} className="text-blue-500" /> Pacote Sugerido Comunicação
                </Button>

                <Button
                  variant={onlySelectedFilter ? 'secondary' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setOnlySelectedFilter(v => !v)}
                >
                  {onlySelectedFilter ? 'Mostrar Todas as Ações' : 'Apenas Selecionadas (>0)'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={() => setAddActionModalOpen(true)}
                >
                  <Plus size={13} /> Nova Ação
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={restaurarValoresPraticadosPadrao}
                  title="Remove edições manuais de Valor Praticado e volta a usar a fórmula da Base de Custos"
                >
                  <RotateCcw size={12} /> Restaurar Preços Base
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs text-destructive hover:text-destructive"
                  onClick={zerarUnidades}
                >
                  Zerar Quantidades
                </Button>

                <Button
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={() => {
                    setSimNameInput(
                      state.parceiroPropostaAtual
                        ? `Proposta ${state.parceiroPropostaAtual}`
                        : 'Simulação Cota 2026'
                    );
                    setSaveSimModalOpen(true);
                  }}
                >
                  <Save size={13} /> Salvar Simulação
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Os 4 Blocos Interativos da Calculadora */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="space-y-5">
              {renderCalculadoraBloco(
                'consciencia',
                'Plano de Comunicação',
                'Consciência',
                'border-blue-500 text-blue-600 dark:text-blue-400',
                totaisCalculadora.totalConsciencia,
                true
              )}

              {renderCalculadoraBloco(
                'interesse_programas',
                'Programas & Jornada de Conteúdo',
                'Interesse',
                'border-amber-500 text-amber-600 dark:text-amber-400',
                totaisCalculadora.totalInteresseProgramas
              )}

              {renderCalculadoraBloco(
                'conversao_ps',
                'Divulgação de PS & Ações de Conversão',
                'Conversão',
                'border-emerald-500 text-emerald-600 dark:text-emerald-400',
                totaisCalculadora.totalConversaoPS
              )}
            </div>

            <div className="space-y-5">
              {renderCalculadoraBloco(
                'produtos_conexao',
                'Produtos de Conexão (Eventos, Pautas e Coberturas)',
                'Interesse • Eventos',
                'border-purple-500 text-purple-600 dark:text-purple-400',
                totaisCalculadora.totalProdutosConexao
              )}
            </div>
          </div>

          {/* Histórico de Simulações Salvas */}
          {state.simulacoesSalvas.length > 0 && (
            <Card>
              <CardHeader className="py-3 px-4 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FolderOpen size={15} className="text-primary" />
                  Simulações e Propostas Salvas ({state.simulacoesSalvas.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {state.simulacoesSalvas.map(sim => (
                    <div
                      key={sim.id}
                      className="rounded-lg border border-border p-3 bg-muted/20 flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-foreground">{sim.nomeProposta}</span>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {fmtCurrency(sim.totalFinal)}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Parceiro: <strong>{sim.parceiroNome}</strong> •{' '}
                          {new Date(sim.criadoEm).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 pt-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 text-[11px]"
                          onClick={() => carregarSimulacao(sim)}
                        >
                          Carregar na Calculadora
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive"
                          onClick={() => excluirSimulacao(sim.id)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ================================================================= */}
        {/* SUB-ABA 2: BASE DE CUSTOS | FIXOS E AÇÕES + FONTE DE CÁLCULOS     */}
        {/* ================================================================= */}
        <TabsContent value="base_custos" className="m-0 space-y-6">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2.5 text-xs">
            <Info size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground">Base de Cálculo Dinâmica:</strong> Qualquer alteração feita abaixo em{' '}
              <em>Markup RioJunior</em>, <em>Créditos de Mídia Terceirizada</em>, <em>Fonte de Cálculos (Hora-Homem)</em>,{' '}
              <em>Custos Base de Eventos</em> ou <em>Público dos Eventos (Modificadores de Pauta)</em> recalcula automaticamente todos os preços da{' '}
              <strong>Calculadora</strong> e do <strong>Catálogo</strong>, além de ser exportada nas fórmulas do Excel.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. MARKUP RIOJUNIOR & ADICIONAIS FIXOS (B3:D16) */}
            <Card>
              <CardHeader className="py-3.5 px-4 bg-muted/30 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>1. Markup RioJunior & Adicionais Fixos (Células B3:D16)</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    Base de Custos!B3:D16
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Custos Fixos 2024 (C4)</Label>
                    <Input
                      type="number"
                      step="100"
                      className="h-8 font-mono text-xs"
                      value={state.markupConfig.custosFixos2024}
                      onChange={e => updateMarkupConfig({ custosFixos2024: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Despesas Fixas 2024 (C5)</Label>
                    <Input
                      type="number"
                      step="100"
                      className="h-8 font-mono text-xs"
                      value={state.markupConfig.despesasFixas2024}
                      onChange={e => updateMarkupConfig({ despesasFixas2024: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Faturamento 2024 (C6)</Label>
                    <Input
                      type="number"
                      step="100"
                      className="h-8 font-mono text-xs"
                      value={state.markupConfig.faturamento2024}
                      onChange={e => updateMarkupConfig({ faturamento2024: Number(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">DF/Fat % (C7)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className="h-8 font-mono text-xs"
                      value={state.markupConfig.dfFat}
                      onChange={e => updateMarkupConfig({ dfFat: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">DV/Fat % (C8)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      className="h-8 font-mono text-xs"
                      value={state.markupConfig.dvFat}
                      onChange={e => updateMarkupConfig({ dvFat: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">ML Geral % (C9)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      className="h-8 font-mono text-xs"
                      value={state.markupConfig.mlGeral}
                      onChange={e => updateMarkupConfig({ mlGeral: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">ML Eventos % (C10)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      className="h-8 font-mono text-xs"
                      value={state.markupConfig.mlEventos}
                      onChange={e => updateMarkupConfig({ mlEventos: Number(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                {/* Resultado do Markup C11 e C12 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        Markup Geral (C11)
                      </Label>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        =100/(100-(C7+C8+C9))
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        step="0.0001"
                        className="h-8 font-mono text-xs font-bold"
                        value={
                          state.markupConfig.markupGeralOverride !== null &&
                          state.markupConfig.markupGeralOverride !== undefined
                            ? state.markupConfig.markupGeralOverride
                            : Number(computedMarkup.markupGeralCalculado.toFixed(6))
                        }
                        onChange={e =>
                          updateMarkupConfig({
                            markupGeralOverride: e.target.value === '' ? null : Number(e.target.value),
                          })
                        }
                      />
                      {state.markupConfig.markupGeralOverride !== null &&
                        state.markupConfig.markupGeralOverride !== undefined && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Restaurar fórmula do Markup Geral"
                            onClick={() => updateMarkupConfig({ markupGeralOverride: null })}
                          >
                            <RotateCcw size={12} />
                          </Button>
                        )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-purple-600 dark:text-purple-400">
                        Markup Eventos (C12)
                      </Label>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        =100/(100-(C7+C8+C10))
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        step="0.0001"
                        className="h-8 font-mono text-xs font-bold"
                        value={
                          state.markupConfig.markupEventosOverride !== null &&
                          state.markupConfig.markupEventosOverride !== undefined
                            ? state.markupConfig.markupEventosOverride
                            : Number(computedMarkup.markupEventosCalculado.toFixed(6))
                        }
                        onChange={e =>
                          updateMarkupConfig({
                            markupEventosOverride: e.target.value === '' ? null : Number(e.target.value),
                          })
                        }
                      />
                      {state.markupConfig.markupEventosOverride !== null &&
                        state.markupConfig.markupEventosOverride !== undefined && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Restaurar fórmula do Markup Eventos"
                            onClick={() => updateMarkupConfig({ markupEventosOverride: null })}
                          >
                            <RotateCcw size={12} />
                          </Button>
                        )}
                    </div>
                  </div>
                </div>

                {/* Adicionais Fixos */}
                <div className="border-t border-border/60 pt-3">
                  <p className="text-xs font-bold mb-2">Adicionais Fixos (B13:D16)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Invest Jr Mult. (C14)</Label>
                      <Input
                        type="number"
                        step="0.05"
                        className="h-8 font-mono text-xs"
                        value={state.markupConfig.investJrMultiplicador}
                        onChange={e => updateMarkupConfig({ investJrMultiplicador: Number(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Fundo Imersão (C15)</Label>
                      <Input
                        type="number"
                        step="0.05"
                        className="h-8 font-mono text-xs"
                        value={state.markupConfig.fundoImersaoMultiplicador}
                        onChange={e => updateMarkupConfig({ fundoImersaoMultiplicador: Number(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Experiência Parceiro R$ (C16)</Label>
                      <Input
                        type="number"
                        step="50"
                        className="h-8 font-mono text-xs"
                        value={state.markupConfig.experienciaParceiroFixo}
                        onChange={e => updateMarkupConfig({ experienciaParceiroFixo: Number(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. FONTE DE CÁLCULOS | PRECIFICAÇÃO (A1:C12) */}
            <Card>
              <CardHeader className="py-3.5 px-4 bg-muted/30 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>2. Fonte de Cálculos | Precificação (Hora-Homem & Parâmetros)</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    Fonte de Cálculos!A2:C12
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground">
                        <th className="text-left py-2 px-3 w-14">Célula</th>
                        <th className="text-left py-2 px-2">Descrição</th>
                        <th className="text-left py-2 px-2">Fonte / Fórmula</th>
                        <th className="text-right py-2 px-3 w-32">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {state.fonteCalculos.map(fc => {
                        const valCalculado = computedFonte[fc.celula] ?? fc.valor;
                        const hasOverride = fc.override !== null && fc.override !== undefined;
                        return (
                          <tr key={fc.id} className="hover:bg-muted/20">
                            <td className="py-1.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              {fc.celula}
                            </td>
                            <td className="py-1.5 px-2 font-medium">{fc.descricao}</td>
                            <td className="py-1.5 px-2 text-muted-foreground text-[11px]">
                              {fc.isFormula ? (
                                <span className="font-mono text-amber-600 dark:text-amber-400">
                                  {fc.formulaLabel} ({fc.fonte})
                                </span>
                              ) : (
                                fc.fonte
                              )}
                            </td>
                            <td className="py-1.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Input
                                  type="number"
                                  step="0.1"
                                  className={`h-7 w-24 text-right font-mono text-xs px-1.5 ${
                                    hasOverride ? 'border-amber-500 bg-amber-500/10 font-bold' : ''
                                  }`}
                                  value={Number(valCalculado.toFixed(2))}
                                  onChange={e => updateFonteCalculo(fc.id, Number(e.target.value) || 0)}
                                />
                                {hasOverride && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    title="Restaurar fórmula automática"
                                    onClick={() => resetFonteCalculoOverride(fc.id)}
                                  >
                                    <RotateCcw size={11} />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3. SISTEMA DE CRÉDITOS DE MÍDIA TERCEIRIZADA (F4:L11) */}
          <Card>
            <CardHeader className="py-3.5 px-4 bg-muted/30 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-bold">
                  3. Mídia Terceirizada — Sistema de Créditos (Base de Custos!F4:L11)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Custo Relativo = Créditos / Limite (L6) • Custo Unitário = Custo Relativo × Mensalidade (L5) • Preço = Custo Unitário × Markup Geral (C11)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Label className="text-xs whitespace-nowrap">Mensalidade Mídia (L5):</Label>
                  <Input
                    type="number"
                    step="50"
                    className="h-8 w-28 font-mono text-xs"
                    value={state.markupConfig.terceirizadaMensalidade}
                    onChange={e => updateMarkupConfig({ terceirizadaMensalidade: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <Label className="text-xs whitespace-nowrap">Limite Créditos (L6):</Label>
                  <Input
                    type="number"
                    step="1"
                    className="h-8 w-20 font-mono text-xs"
                    value={state.markupConfig.terceirizadaLimiteCreditos}
                    onChange={e => updateMarkupConfig({ terceirizadaLimiteCreditos: Number(e.target.value) || 1 })}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground">
                      <th className="text-left py-2 px-3">Célula</th>
                      <th className="text-left py-2 px-3">Ação de Mídia (F5:F11)</th>
                      <th className="text-center py-2 px-2 w-28">Créditos (G)</th>
                      <th className="text-right py-2 px-2 w-28">Custo Relativo (H)</th>
                      <th className="text-right py-2 px-2 w-36">Custo Unitário (I)</th>
                      <th className="text-right py-2 px-3 w-40">Preço Unitário c/ Markup (J)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {computedMidia.map(m => {
                      const hasCustoOver = m.custoUnitarioOverride !== null && m.custoUnitarioOverride !== undefined;
                      const hasPrecoOver = m.precoUnitarioOverride !== null && m.precoUnitarioOverride !== undefined;
                      return (
                        <tr key={m.id} className="hover:bg-muted/20">
                          <td className="py-2 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {m.celulaPreco}
                          </td>
                          <td className="py-2 px-3 font-medium">{m.acao}</td>
                          <td className="py-2 px-2 text-center">
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              className="h-7 w-20 mx-auto text-center font-mono text-xs"
                              value={m.creditos}
                              onChange={e => updateMidiaItem(m.id, { creditos: Number(e.target.value) || 0 })}
                            />
                          </td>
                          <td className="py-2 px-2 text-right font-mono text-muted-foreground">
                            {(m.custoRelativo * 100).toFixed(2)}%
                          </td>
                          <td className="py-2 px-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Input
                                type="number"
                                step="0.5"
                                className={`h-7 w-24 text-right font-mono text-xs ${hasCustoOver ? 'border-amber-500 bg-amber-500/10' : ''}`}
                                value={Number(m.custoUnitario.toFixed(2))}
                                onChange={e =>
                                  updateMidiaItem(m.id, {
                                    custoUnitarioOverride: e.target.value === '' ? null : Number(e.target.value),
                                  })
                                }
                              />
                              {hasCustoOver && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateMidiaItem(m.id, { custoUnitarioOverride: null })}
                                >
                                  <RotateCcw size={11} />
                                </Button>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Input
                                type="number"
                                step="0.5"
                                className={`h-7 w-28 text-right font-mono text-xs font-bold ${hasPrecoOver ? 'border-amber-500 bg-amber-500/10' : ''}`}
                                value={Number(m.precoUnitario.toFixed(2))}
                                onChange={e =>
                                  updateMidiaItem(m.id, {
                                    precoUnitarioOverride: e.target.value === '' ? null : Number(e.target.value),
                                  })
                                }
                              />
                              {hasPrecoOver && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateMidiaItem(m.id, { precoUnitarioOverride: null })}
                                >
                                  <RotateCcw size={11} />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 4. JORNADA DE CONTEÚDO E INTERESSE (O4:R9) */}
            <Card>
              <CardHeader className="py-3.5 px-4 bg-muted/30 border-b border-border/60">
                <CardTitle className="text-sm font-bold">
                  4. Base de Custos | Jornada de Conteúdo e Interesse (O4:R9)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground">
                        <th className="text-left py-2 px-3">Ref</th>
                        <th className="text-left py-2 px-2">Ação</th>
                        <th className="text-right py-2 px-2">Custo (P)</th>
                        <th className="text-right py-2 px-3">Preço c/ Markup (Q)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {computedJornada.map(j => {
                        const hasCustoOver = j.custoOverride !== null && j.custoOverride !== undefined;
                        const hasPrecoOver = j.precoUnitarioOverride !== null && j.precoUnitarioOverride !== undefined;
                        return (
                          <tr key={j.id} className="hover:bg-muted/20">
                            <td className="py-2 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                              {j.celulaPreco}
                            </td>
                            <td className="py-2 px-2">
                              <span className="font-medium block">{j.acao}</span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {j.formulaCustoLabel}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Input
                                  type="number"
                                  step="10"
                                  className={`h-7 w-24 text-right font-mono text-xs ${hasCustoOver ? 'border-amber-500 bg-amber-500/10' : ''}`}
                                  value={Number(j.custo.toFixed(2))}
                                  onChange={e =>
                                    updateJornadaItem(j.id, {
                                      custoOverride: e.target.value === '' ? null : Number(e.target.value),
                                    })
                                  }
                                />
                                {hasCustoOver && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateJornadaItem(j.id, { custoOverride: null })}
                                  >
                                    <RotateCcw size={11} />
                                  </Button>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Input
                                  type="number"
                                  step="10"
                                  className={`h-7 w-28 text-right font-mono text-xs font-bold ${hasPrecoOver ? 'border-amber-500 bg-amber-500/10' : ''}`}
                                  value={Number(j.precoUnitario.toFixed(2))}
                                  onChange={e =>
                                    updateJornadaItem(j.id, {
                                      precoUnitarioOverride: e.target.value === '' ? null : Number(e.target.value),
                                    })
                                  }
                                />
                                {hasPrecoOver && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateJornadaItem(j.id, { precoUnitarioOverride: null })}
                                  >
                                    <RotateCcw size={11} />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 5. MODIFICADORES DE PAUTA POR PÚBLICO DE EVENTO (G20:J28) */}
            <Card>
              <CardHeader className="py-3.5 px-4 bg-muted/30 border-b border-border/60">
                <CardTitle className="text-sm font-bold">
                  5. Modificadores de Pauta | Público por Evento (G20:J28)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Pondera o preço das Pautas Magnas e Paralelas pelo público do evento em relação ao CentralRio (H20).
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground">
                        <th className="text-left py-2 px-3">Ref</th>
                        <th className="text-left py-2 px-2">Evento / Pauta</th>
                        <th className="text-center py-2 px-2 w-24">Público (H)</th>
                        <th className="text-right py-2 px-2 w-24">Público/CR (I)</th>
                        <th className="text-right py-2 px-3 w-36">Preço Pauta (J)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {computedModificadoresEventos.map(mod => {
                        const hasOver = mod.precoOverride !== null && mod.precoOverride !== undefined;
                        return (
                          <tr key={mod.id} className="hover:bg-muted/20">
                            <td className="py-2 px-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                              {mod.celulaPreco}
                            </td>
                            <td className="py-2 px-2 font-medium">
                              {mod.evento}
                              {mod.isReferenciaCentralRio && (
                                <Badge variant="outline" className="ml-1.5 text-[9px] h-4 px-1">
                                  Ref. Base
                                </Badge>
                              )}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <Input
                                type="number"
                                step="10"
                                min="1"
                                className="h-7 w-20 mx-auto text-center font-mono text-xs"
                                value={mod.publico}
                                onChange={e =>
                                  updateModificadorEvento(mod.id, { publico: Number(e.target.value) || 0 })
                                }
                              />
                            </td>
                            <td className="py-2 px-2 text-right font-mono text-muted-foreground">
                              {(mod.proporcaoPublico * 100).toFixed(0)}%
                            </td>
                            <td className="py-2 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Input
                                  type="number"
                                  step="10"
                                  className={`h-7 w-28 text-right font-mono text-xs font-bold ${hasOver ? 'border-amber-500 bg-amber-500/10' : ''}`}
                                  value={Number(mod.precoUnitario.toFixed(2))}
                                  onChange={e =>
                                    updateModificadorEvento(mod.id, {
                                      precoOverride: e.target.value === '' ? null : Number(e.target.value),
                                    })
                                  }
                                />
                                {hasOver && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateModificadorEvento(mod.id, { precoOverride: null })}
                                  >
                                    <RotateCcw size={11} />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 6. BASE DE CUSTOS | EVENTOS (B20:E31) */}
          <Card>
            <CardHeader className="py-3.5 px-4 bg-muted/30 border-b border-border/60">
              <CardTitle className="text-sm font-bold">
                6. Base de Custos | Eventos e Entregáveis (Base de Custos!B20:E31)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground">
                      <th className="text-left py-2 px-3 w-16">Ref</th>
                      <th className="text-left py-2 px-2">Ação / Item de Evento</th>
                      <th className="text-left py-2 px-2">Fórmula de Custo / Fonte</th>
                      <th className="text-right py-2 px-2 w-36">Custo Base (C)</th>
                      <th className="text-right py-2 px-3 w-40">Preço c/ Markup Eventos (D)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {computedEventosBase.map(ev => {
                      const hasCustoOver = ev.custoOverride !== null && ev.custoOverride !== undefined;
                      const hasPrecoOver = ev.precoUnitarioOverride !== null && ev.precoUnitarioOverride !== undefined;
                      return (
                        <tr key={ev.id} className="hover:bg-muted/20">
                          <td className="py-2 px-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                            {ev.celulaPreco}
                          </td>
                          <td className="py-2 px-2 font-semibold">{ev.acao}</td>
                          <td className="py-2 px-2">
                            <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 block">
                              {ev.formulaCustoLabel}
                            </span>
                            <span className="text-[11px] text-muted-foreground">{ev.fonte}</span>
                          </td>
                          <td className="py-2 px-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Input
                                type="number"
                                step="10"
                                className={`h-7 w-28 text-right font-mono text-xs ${hasCustoOver ? 'border-amber-500 bg-amber-500/10' : ''}`}
                                value={Number(ev.custo.toFixed(2))}
                                onChange={e =>
                                  updateEventoCustoBase(ev.id, {
                                    custoOverride: e.target.value === '' ? null : Number(e.target.value),
                                  })
                                }
                              />
                              {hasCustoOver && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateEventoCustoBase(ev.id, { custoOverride: null })}
                                >
                                  <RotateCcw size={11} />
                                </Button>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Input
                                type="number"
                                step="10"
                                className={`h-7 w-28 text-right font-mono text-xs font-bold ${hasPrecoOver ? 'border-amber-500 bg-amber-500/10' : ''}`}
                                value={Number(ev.precoUnitario.toFixed(2))}
                                onChange={e =>
                                  updateEventoCustoBase(ev.id, {
                                    precoUnitarioOverride: e.target.value === '' ? null : Number(e.target.value),
                                  })
                                }
                              />
                              {hasPrecoOver && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateEventoCustoBase(ev.id, { precoUnitarioOverride: null })}
                                >
                                  <RotateCcw size={11} />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================= */}
        {/* SUB-ABA 3: AÇÕES | CATÁLOGO (39 ITENS SINCRONIZADOS)              */}
        {/* ================================================================= */}
        <TabsContent value="catalogo" className="m-0 space-y-4">
          <Card>
            <CardHeader className="py-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60">
              <div>
                <CardTitle className="text-sm font-bold">
                  Ações | Catálogo Completo VPNeg 2026
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Preços vinculados automaticamente às fórmulas da aba Base de Custos.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    className="h-8 pl-8 w-56 text-xs"
                    placeholder="Buscar ação, descrição ou KPI..."
                    value={catSearch}
                    onChange={e => setCatSearch(e.target.value)}
                  />
                </div>
                <Select value={catStageFilter} onValueChange={setCatStageFilter}>
                  <SelectTrigger className="h-8 w-40 text-xs">
                    <SelectValue placeholder="Filtrar Etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Etapas</SelectItem>
                    <SelectItem value="Consciência">Consciência</SelectItem>
                    <SelectItem value="Interesse">Interesse</SelectItem>
                    <SelectItem value="Conversão">Conversão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground">
                      <th className="text-left py-2.5 px-3 w-28">Categoria</th>
                      <th className="text-left py-2.5 px-3 w-52">Ação</th>
                      <th className="text-right py-2.5 px-3 w-48">Preço Dinâmico</th>
                      <th className="text-left py-2.5 px-3">Descrição</th>
                      <th className="text-left py-2.5 px-3 w-64">KPIs de Acompanhamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredCatalogo.map(cat => (
                      <tr key={cat.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              cat.categoria === 'Consciência'
                                ? 'border-blue-500 text-blue-500'
                                : cat.categoria === 'Interesse'
                                ? 'border-purple-500 text-purple-500'
                                : 'border-emerald-500 text-emerald-500'
                            }`}
                          >
                            {cat.categoria}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{cat.acao}</td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {cat.precoFinal !== undefined ? (
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {fmtCurrency(cat.precoFinal)}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-sans italic">
                              {cat.precoTextoFixo}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <Input
                            className="h-7 text-xs bg-transparent border-transparent hover:border-border focus:border-primary"
                            value={cat.descricao}
                            onChange={e => updateCatalogoRow(cat.id, { descricao: e.target.value })}
                          />
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{cat.kpis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================= */}
        {/* SUB-ABA 4: KPIS | ACOMPANHAMENTO E REGISTRO                       */}
        {/* ================================================================= */}
        <TabsContent value="kpis" className="m-0 space-y-5">
          <Card>
            <CardHeader className="py-3.5 px-4 bg-muted/30 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold">
                  KPIs | Acompanhamento (Médias Condicionais AVERAGEIFS)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Filtre por Parceiro, Ação e Evento para visualizar os indicadores médios de Consciência, Interesse e Conversão.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  className="h-8 w-36 text-xs"
                  placeholder="Parceiro (ou todos)"
                  value={kpiFilterParceiro === 'todos' ? '' : kpiFilterParceiro}
                  onChange={e => setKpiFilterParceiro(e.target.value.trim() || 'todos')}
                />
                <Input
                  className="h-8 w-40 text-xs"
                  placeholder="Ação (ou todas)"
                  value={kpiFilterAcao === 'todas' ? '' : kpiFilterAcao}
                  onChange={e => setKpiFilterAcao(e.target.value.trim() || 'todas')}
                />
                <Input
                  className="h-8 w-36 text-xs"
                  placeholder="Evento (ou todos)"
                  value={kpiFilterEvento === 'todos' ? '' : kpiFilterEvento}
                  onChange={e => setKpiFilterEvento(e.target.value.trim() || 'todos')}
                />
                <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setKpiModalOpen(true)}>
                  <Plus size={13} /> Registrar Resultado de Ação
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Coluna Consciência */}
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3.5 space-y-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                    Consciência
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Curtidas:</span>
                      <span className="font-mono font-bold">{kpiMedias.curtidas?.toFixed(1) ?? '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Menções:</span>
                      <span className="font-mono font-bold">{kpiMedias.mencoes?.toFixed(1) ?? '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interações:</span>
                      <span className="font-mono font-bold">{kpiMedias.interacoes?.toFixed(1) ?? '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comentários:</span>
                      <span className="font-mono font-bold">{kpiMedias.comentarios?.toFixed(1) ?? '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Coluna Interesse */}
                <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3.5 space-y-2">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                    Interesse
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NPS Médio:</span>
                      <span className="font-mono font-bold">{kpiMedias.nps?.toFixed(1) ?? '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Awareness (Pré → Pós):</span>
                      <span className="font-mono font-bold">
                        {kpiMedias.awarenessPre?.toFixed(0) ?? '—'}% → {kpiMedias.awarenessPos?.toFixed(0) ?? '—'}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interesse (Pré → Pós):</span>
                      <span className="font-mono font-bold">
                        {kpiMedias.interessePre?.toFixed(0) ?? '—'}% → {kpiMedias.interessePos?.toFixed(0) ?? '—'}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Empregabilidade (Pré → Pós):</span>
                      <span className="font-mono font-bold">
                        {kpiMedias.empregabilidadePre?.toFixed(0) ?? '—'}% →{' '}
                        {kpiMedias.empregabilidadePos?.toFixed(0) ?? '—'}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coluna Conversão */}
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Conversão
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contatos Indicados:</span>
                      <span className="font-mono font-bold">
                        {kpiMedias.contatosIndicados?.toFixed(1) ?? '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inscrições Facilitadas:</span>
                      <span className="font-mono font-bold">
                        {kpiMedias.inscricoesFacilitadas?.toFixed(1) ?? '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversões:</span>
                      <span className="font-mono font-bold">{kpiMedias.conversoes?.toFixed(1) ?? '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela KPIs | Registro */}
          <Card>
            <CardHeader className="py-3 px-4 border-b border-border/60">
              <CardTitle className="text-sm font-bold">
                KPIs | Registro de Ações Realizadas ({state.kpiRegistros.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground">
                      <th className="text-left py-2 px-3">Parceiro</th>
                      <th className="text-left py-2 px-2">Ação</th>
                      <th className="text-left py-2 px-2">Evento</th>
                      <th className="text-left py-2 px-2">Data</th>
                      <th className="text-right py-2 px-2">Impactados</th>
                      <th className="text-right py-2 px-2">Curtidas</th>
                      <th className="text-right py-2 px-2">NPS</th>
                      <th className="text-right py-2 px-2">Inscrições</th>
                      <th className="text-right py-2 px-2">Conversões</th>
                      <th className="text-center py-2 px-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {state.kpiRegistros.map(reg => (
                      <tr key={reg.id} className="hover:bg-muted/20">
                        <td className="py-2 px-3 font-bold">{reg.parceiro}</td>
                        <td className="py-2 px-2">{reg.acao}</td>
                        <td className="py-2 px-2">{reg.evento || '—'}</td>
                        <td className="py-2 px-2 font-mono">{reg.dataAcao}</td>
                        <td className="py-2 px-2 text-right font-mono">{reg.empresariosImpactados ?? '—'}</td>
                        <td className="py-2 px-2 text-right font-mono">{reg.curtidas ?? '—'}</td>
                        <td className="py-2 px-2 text-right font-mono">{reg.nps ?? '—'}</td>
                        <td className="py-2 px-2 text-right font-mono">{reg.inscricoesFacilitadas ?? '—'}</td>
                        <td className="py-2 px-2 text-right font-mono">{reg.conversoes ?? '—'}</td>
                        <td className="py-2 px-2 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => deleteKPIRegistro(reg.id)}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal: Adicionar Nova Ação na Calculadora */}
      <Dialog open={addActionModalOpen} onOpenChange={setAddActionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Ação Customizada na Calculadora</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Bloco da Calculadora</Label>
              <Select
                value={newActionForm.bloco}
                onValueChange={(v: CalculadoraBlocoId) => {
                  const catMap: Record<CalculadoraBlocoId, 'Consciência' | 'Interesse' | 'Conversão'> = {
                    consciencia: 'Consciência',
                    interesse_programas: 'Interesse',
                    produtos_conexao: 'Interesse',
                    conversao_ps: 'Conversão',
                  };
                  setNewActionForm({ ...newActionForm, bloco: v, categoria: catMap[v] });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consciencia">Consciência — Plano de Comunicação</SelectItem>
                  <SelectItem value="interesse_programas">Interesse — Programas & Jornada</SelectItem>
                  <SelectItem value="produtos_conexao">Interesse — Produtos de Conexão (Eventos)</SelectItem>
                  <SelectItem value="conversao_ps">Conversão — Divulgação de PS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Nome da Ação / Entregável</Label>
              <Input
                placeholder="Ex: Workshop Exclusivo In-Company"
                value={newActionForm.acao}
                onChange={e => setNewActionForm({ ...newActionForm, acao: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Valor Unitário Praticado (R$)</Label>
                <Input
                  type="number"
                  step="50"
                  placeholder="Ex: 1500"
                  value={newActionForm.valorPraticado}
                  onChange={e => setNewActionForm({ ...newActionForm, valorPraticado: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Unidades</Label>
                <Input
                  type="number"
                  step="1"
                  min="1"
                  value={newActionForm.unidades}
                  onChange={e => setNewActionForm({ ...newActionForm, unidades: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddActionModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCustomRow} disabled={!newActionForm.acao.trim()}>
              Adicionar na Calculadora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Salvar Simulação */}
      <Dialog open={saveSimModalOpen} onOpenChange={setSaveSimModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Salvar Simulação de Proposta</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Nome da Proposta / Simulação</Label>
              <Input
                value={simNameInput}
                onChange={e => setSimNameInput(e.target.value)}
                placeholder="Ex: Cota Master CentralRio + EFEJ"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Parceiro</Label>
              <Input
                value={state.parceiroPropostaAtual}
                onChange={e => setParceiroPropostaAtual(e.target.value)}
                placeholder="Ex: Bain & Company"
              />
            </div>
            <div className="p-3 rounded-lg bg-muted/40 text-xs flex justify-between items-center">
              <span>Valor Final a salvar:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {fmtCurrency(totaisCalculadora.totalComDesconto)}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveSimModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                salvarSimulacao(
                  simNameInput,
                  state.parceiroPropostaAtual,
                  selectedCardId !== 'none' ? selectedCardId : undefined
                );
                setSaveSimModalOpen(false);
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Novo Registro de KPI */}
      <Dialog open={kpiModalOpen} onOpenChange={setKpiModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar KPIs de Ação Realizada</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Parceiro</Label>
              <Input
                placeholder="Ex: Bain, Stone..."
                value={newKpiForm.parceiro}
                onChange={e => setNewKpiForm({ ...newKpiForm, parceiro: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Ação</Label>
              <Input
                placeholder="Ex: Pauta Magna"
                value={newKpiForm.acao}
                onChange={e => setNewKpiForm({ ...newKpiForm, acao: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Evento (se aplicável)</Label>
              <Input
                placeholder="Ex: CentralRio, EFEJ..."
                value={newKpiForm.evento}
                onChange={e => setNewKpiForm({ ...newKpiForm, evento: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Data da Ação</Label>
              <Input
                type="date"
                value={newKpiForm.dataAcao}
                onChange={e => setNewKpiForm({ ...newKpiForm, dataAcao: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">EJs / Congressistas Impactados</Label>
              <Input
                type="number"
                value={newKpiForm.empresariosImpactados}
                onChange={e => setNewKpiForm({ ...newKpiForm, empresariosImpactados: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">NPS da Ação</Label>
              <Input
                type="number"
                value={newKpiForm.nps}
                onChange={e => setNewKpiForm({ ...newKpiForm, nps: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Curtidas</Label>
              <Input
                type="number"
                value={newKpiForm.curtidas}
                onChange={e => setNewKpiForm({ ...newKpiForm, curtidas: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Interações</Label>
              <Input
                type="number"
                value={newKpiForm.interacoes}
                onChange={e => setNewKpiForm({ ...newKpiForm, interacoes: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Inscrições Facilitadas</Label>
              <Input
                type="number"
                value={newKpiForm.inscricoesFacilitadas}
                onChange={e => setNewKpiForm({ ...newKpiForm, inscricoesFacilitadas: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Conversões / Contratações</Label>
              <Input
                type="number"
                value={newKpiForm.conversoes}
                onChange={e => setNewKpiForm({ ...newKpiForm, conversoes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKpiModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!newKpiForm.parceiro.trim()}
              onClick={() => {
                const toNum = (v: string) => (v !== '' && !isNaN(Number(v)) ? Number(v) : null);
                addKPIRegistro({
                  parceiro: newKpiForm.parceiro.trim(),
                  acao: newKpiForm.acao.trim() || 'Ação',
                  evento: newKpiForm.evento.trim(),
                  dataAcao: newKpiForm.dataAcao,
                  empresariosImpactados: toNum(newKpiForm.empresariosImpactados),
                  curtidas: toNum(newKpiForm.curtidas),
                  mencoes: toNum(newKpiForm.mencoes),
                  interacoes: toNum(newKpiForm.interacoes),
                  comentarios: toNum(newKpiForm.comentarios),
                  nps: toNum(newKpiForm.nps),
                  awarenessPre: toNum(newKpiForm.awarenessPre),
                  awarenessPos: toNum(newKpiForm.awarenessPos),
                  interessePre: toNum(newKpiForm.interessePre),
                  interessePos: toNum(newKpiForm.interessePos),
                  empregabilidadePre: toNum(newKpiForm.empregabilidadePre),
                  empregabilidadePos: toNum(newKpiForm.empregabilidadePos),
                  contatosIndicados: toNum(newKpiForm.contatosIndicados),
                  inscricoesFacilitadas: toNum(newKpiForm.inscricoesFacilitadas),
                  conversoes: toNum(newKpiForm.conversoes),
                });
                setKpiModalOpen(false);
              }}
            >
              Salvar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

