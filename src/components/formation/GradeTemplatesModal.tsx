import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Calendar,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  BookmarkPlus,
  ArrowRight,
  Info,
  Flame,
  Users,
  Target,
  Award,
  Pencil,
  RotateCcw,
  Plus,
  ArrowUp,
  ArrowDown,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GradeTemplate,
  TemplateMomento,
  DEFAULT_GRADE_TEMPLATES,
  getGradeTemplates,
  saveGradeTemplate,
  saveCustomGradeTemplate,
  resetTemplateToDefault,
  deleteCustomGradeTemplate,
} from './gradeTemplates';
import { PautaEvento } from '@/hooks/useGradeConteudo';
import { useManageableOptions } from './useManageableOptions';
import { toast } from '@/hooks/use-toast';

interface GradeTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pautasAtuais: PautaEvento[];
  nomeEvento: string;
  dataInicioEvento?: string;
  onAplicarTemplate: (momentos: TemplateMomento[], substituir: boolean) => Promise<void>;
}

export function GradeTemplatesModal({
  open,
  onOpenChange,
  pautasAtuais,
  nomeEvento,
  dataInicioEvento,
  onAplicarTemplate,
}: GradeTemplatesModalProps) {
  const { getTipoColor, getTipoLabel, tiposMomento } = useManageableOptions();
  const [templates, setTemplates] = useState<GradeTemplate[]>(() => getGradeTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('template_rj74');
  const [expandedPreviewId, setExpandedPreviewId] = useState<string | null>('template_rj74');
  const [substituir, setSubstituir] = useState<boolean>(pautasAtuais.length === 0);
  const [applying, setApplying] = useState(false);

  // Filtro de dia para visualização de templates multi-dias (ex: EFEJ)
  const [previewDiaFiltro, setPreviewDiaFiltro] = useState<number | 'todos'>('todos');

  // Modo de edição de template
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [templateEmEdicao, setTemplateEmEdicao] = useState<GradeTemplate | null>(null);

  // Estado para salvar grade atual como template novo
  const [showSaveCustom, setShowSaveCustom] = useState(false);
  const [customNome, setCustomNome] = useState('');
  const [customDescricao, setCustomDescricao] = useState('');

  const reloadTemplates = () => {
    const list = getGradeTemplates();
    setTemplates(list);
    return list;
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Verifica se o template atual difere do padrão de fábrica
  const isTemplateModificado = (templateId: string): boolean => {
    const original = DEFAULT_GRADE_TEMPLATES.find(d => d.id === templateId);
    if (!original) return false;
    const atual = templates.find(t => t.id === templateId);
    if (!atual) return false;
    return JSON.stringify(original) !== JSON.stringify(atual);
  };

  const handleApply = async () => {
    if (!selectedTemplate) return;
    setApplying(true);
    try {
      await onAplicarTemplate(selectedTemplate.momentos, substituir);
      onOpenChange(false);
    } finally {
      setApplying(false);
    }
  };

  const handleSaveCurrentAsTemplate = () => {
    if (!customNome.trim() || pautasAtuais.length === 0) return;

    const newTemplate: GradeTemplate = {
      id: `custom_${Date.now()}`,
      nome: customNome.trim(),
      eventoReferencia: nomeEvento || 'Evento Customizado',
      tipoEvento: 'Modelo Personalizado',
      descricao: customDescricao.trim() || `Template criado a partir da grade de ${nomeEvento}`,
      icone: 'BookmarkPlus',
      diasCount: 1,
      totalMomentos: pautasAtuais.length,
      horasEstimadas: `${pautasAtuais.length} momentos`,
      qtdMagnas: pautasAtuais.filter(p => p.tipo === 'magna').length,
      qtdParalelas: pautasAtuais.filter(p => p.tipo === 'paralela').length,
      tags: ['Personalizado', 'Rede RioJunior'],
      isCustom: true,
      momentos: pautasAtuais.map(p => ({
        horario: p.horario || '',
        tipo: p.tipo,
        titulo: p.titulo || '',
        tematicaMacro: p.tematicaMacro || 'Geral',
        ministranteTipo: p.ministranteTipo || undefined,
        ministranteNome: p.ministranteNome || undefined,
        parceiroNome: p.parceiroNome || undefined,
        csat: p.csat !== null ? p.csat : undefined,
      })),
    };

    saveCustomGradeTemplate(newTemplate);
    reloadTemplates();
    setSelectedTemplateId(newTemplate.id);
    setShowSaveCustom(false);
    setCustomNome('');
    setCustomDescricao('');
    toast({
      title: 'Modelo salvo com sucesso!',
      description: `O modelo "${newTemplate.nome}" agora está disponível na lista.`,
    });
  };

  const handleDeleteCustom = (templateId: string) => {
    if (confirm('Deseja excluir este modelo personalizado?')) {
      deleteCustomGradeTemplate(templateId);
      const list = reloadTemplates();
      if (selectedTemplateId === templateId) {
        setSelectedTemplateId(list[0]?.id || 'template_rj74');
      }
      toast({ title: 'Modelo excluído' });
    }
  };

  const handleResetTemplate = (templateId: string) => {
    if (confirm('Deseja restaurar as configurações originais deste modelo oficial? Todas as edições feitas nele serão revertidas.')) {
      resetTemplateToDefault(templateId);
      reloadTemplates();
      if (templateEmEdicao && templateEmEdicao.id === templateId) {
        const orig = DEFAULT_GRADE_TEMPLATES.find(d => d.id === templateId);
        if (orig) setTemplateEmEdicao(JSON.parse(JSON.stringify(orig)));
      }
      toast({
        title: 'Modelo restaurado!',
        description: 'As configurações padrão de fábrica foram recuperadas.',
      });
    }
  };

  // Iniciar edição de um template
  const handleIniciarEdicao = (template: GradeTemplate) => {
    setTemplateEmEdicao(JSON.parse(JSON.stringify(template)));
    setIsEditing(true);
  };

  // Salvar edições do template
  const handleSalvarEdicaoTemplate = () => {
    if (!templateEmEdicao) return;
    if (!templateEmEdicao.nome.trim()) {
      toast({ title: 'O nome do modelo não pode estar vazio', variant: 'destructive' });
      return;
    }

    saveGradeTemplate(templateEmEdicao);
    reloadTemplates();
    setIsEditing(false);
    setSelectedTemplateId(templateEmEdicao.id);
    toast({
      title: 'Modelo atualizado com sucesso!',
      description: `As alterações no modelo "${templateEmEdicao.nome}" foram salvas.`,
    });
  };

  // Helpers de manipulação de momentos durante edição
  const handleEditMomentoField = (index: number, field: keyof TemplateMomento, value: any) => {
    if (!templateEmEdicao) return;
    const novos = [...templateEmEdicao.momentos];
    novos[index] = { ...novos[index], [field]: value };
    setTemplateEmEdicao({ ...templateEmEdicao, momentos: novos });
  };

  const handleRemoverMomento = (index: number) => {
    if (!templateEmEdicao) return;
    const novos = templateEmEdicao.momentos.filter((_, i) => i !== index);
    setTemplateEmEdicao({ ...templateEmEdicao, momentos: novos });
  };

  const handleMoverMomento = (index: number, direcao: 'up' | 'down') => {
    if (!templateEmEdicao) return;
    const target = direcao === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= templateEmEdicao.momentos.length) return;
    const novos = [...templateEmEdicao.momentos];
    const temp = novos[index];
    novos[index] = novos[target];
    novos[target] = temp;
    setTemplateEmEdicao({ ...templateEmEdicao, momentos: novos });
  };

  const handleAdicionarMomento = (diaOffset: number = 0) => {
    if (!templateEmEdicao) return;
    const novoMomento: TemplateMomento = {
      horario: '10:00 às 11:00',
      tipo: 'magna',
      titulo: 'Novo Momento',
      tematicaMacro: 'Geral',
      diaOffset,
    };
    setTemplateEmEdicao({
      ...templateEmEdicao,
      momentos: [...templateEmEdicao.momentos, novoMomento],
    });
  };

  const getTemplateIcon = (icone: string) => {
    switch (icone) {
      case 'Flame':
        return <Flame size={18} className="text-amber-500" />;
      case 'Target':
        return <Target size={18} className="text-emerald-500" />;
      case 'Award':
        return <Award size={18} className="text-indigo-500" />;
      case 'Sparkles':
        return <Sparkles size={18} className="text-purple-500" />;
      default:
        return <Users size={18} className="text-primary" />;
    }
  };

  // Momentos filtrados para o preview
  const momentosPreviewFiltrados = selectedTemplate?.momentos.filter(m => {
    if (previewDiaFiltro === 'todos') return true;
    return (m.diaOffset ?? 0) === previewDiaFiltro;
  }) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
        {/* ======================= MODO DE EDIÇÃO DO TEMPLATE ======================= */}
        {isEditing && templateEmEdicao ? (
          <div className="space-y-5 animate-fade-in">
            <DialogHeader className="border-b border-border pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground"
                      onClick={() => setIsEditing(false)}
                    >
                      ← Voltar
                    </Button>
                    <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Pencil size={18} className="text-primary" />
                      Editando Modelo: {templateEmEdicao.nome}
                    </DialogTitle>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Modifique o nome, descrição, evento de referência e a grade de momentos. Suas alterações ficam salvas no sistema.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {DEFAULT_GRADE_TEMPLATES.some(d => d.id === templateEmEdicao.id) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5 text-muted-foreground hover:text-amber-600"
                      onClick={() => handleResetTemplate(templateEmEdicao.id)}
                      title="Voltar às configurações originais de fábrica"
                    >
                      <RotateCcw size={13} />
                      <span>Restaurar Original</span>
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    className="gap-1.5 font-bold"
                    onClick={handleSalvarEdicaoTemplate}
                  >
                    <CheckCircle2 size={14} />
                    <span>Salvar Alterações</span>
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* Metadados gerais do Modelo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-border bg-card">
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-semibold">Nome do Modelo</Label>
                <Input
                  value={templateEmEdicao.nome}
                  onChange={e => setTemplateEmEdicao({ ...templateEmEdicao, nome: e.target.value })}
                  placeholder="Ex.: Modelo Encontro RJ (Base: RJ 75°)"
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Evento de Referência</Label>
                <Input
                  value={templateEmEdicao.eventoReferencia}
                  onChange={e => setTemplateEmEdicao({ ...templateEmEdicao, eventoReferencia: e.target.value })}
                  placeholder="Ex.: Grade RJ 75° 2026"
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-semibold">Descrição do Modelo</Label>
                <Textarea
                  value={templateEmEdicao.descricao}
                  onChange={e => setTemplateEmEdicao({ ...templateEmEdicao, descricao: e.target.value })}
                  placeholder="Breve resumo da proposta pedagógica e dinâmica..."
                  className="text-xs min-h-[64px]"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Estimativa / Duração</Label>
                <Input
                  value={templateEmEdicao.horasEstimadas}
                  onChange={e => setTemplateEmEdicao({ ...templateEmEdicao, horasEstimadas: e.target.value })}
                  placeholder="Ex.: 9h de programação ou 3 dias"
                  className="h-9 text-sm"
                />
                <div className="pt-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {templateEmEdicao.diasCount > 1 ? `${templateEmEdicao.diasCount} Dias` : '1 Dia'}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {templateEmEdicao.momentos.length} momentos
                  </Badge>
                </div>
              </div>
            </div>

            {/* Lista dos Momentos para Edição */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">
                    Momentos do Modelo ({templateEmEdicao.momentos.length})
                  </h4>
                  <Badge variant="secondary" className="text-[10px]">
                    {templateEmEdicao.momentos.filter(m => m.tipo === 'magna').length} Magnas
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {templateEmEdicao.momentos.filter(m => m.tipo === 'paralela').length} Paralelas
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {templateEmEdicao.diasCount > 1 && (
                    <span className="text-[11px] text-muted-foreground mr-1">
                      Multi-dias: Dia 1, Dia 2 e Dia 3
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5 border-primary/40 text-primary font-semibold"
                    onClick={() => handleAdicionarMomento(0)}
                  >
                    <Plus size={13} />
                    <span>Adicionar Momento</span>
                  </Button>
                </div>
              </div>

              {/* Tabela interativa de edição de momentos */}
              <div className="max-h-[50vh] overflow-y-auto divide-y divide-border border border-border rounded-xl bg-card">
                {templateEmEdicao.momentos.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 hover:bg-muted/30 transition-colors flex flex-col md:flex-row md:items-center gap-2.5 text-xs"
                  >
                    {/* Botões de reordenação */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground w-5 text-center">
                        {idx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        disabled={idx === 0}
                        onClick={() => handleMoverMomento(idx, 'up')}
                        title="Mover para cima"
                      >
                        <ArrowUp size={12} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        disabled={idx === templateEmEdicao.momentos.length - 1}
                        onClick={() => handleMoverMomento(idx, 'down')}
                        title="Mover para baixo"
                      >
                        <ArrowDown size={12} />
                      </Button>
                    </div>

                    {/* Dia (caso o modelo seja multi-dias ou EFEJ) */}
                    {templateEmEdicao.diasCount > 1 && (
                      <div className="w-24 shrink-0">
                        <Select
                          value={String(m.diaOffset ?? 0)}
                          onValueChange={v => handleEditMomentoField(idx, 'diaOffset', Number(v))}
                        >
                          <SelectTrigger className="h-8 text-xs font-semibold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Dia 1</SelectItem>
                            <SelectItem value="1">Dia 2</SelectItem>
                            <SelectItem value="2">Dia 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Horário */}
                    <div className="w-32 shrink-0">
                      <Input
                        value={m.horario}
                        onChange={e => handleEditMomentoField(idx, 'horario', e.target.value)}
                        placeholder="09:00 às 09:40"
                        className="h-8 text-xs font-mono"
                      />
                    </div>

                    {/* Tipo do Momento */}
                    <div className="w-36 shrink-0">
                      <Select
                        value={m.tipo}
                        onValueChange={v => handleEditMomentoField(idx, 'tipo', v)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposMomento.map(tm => (
                            <SelectItem key={tm.id} value={tm.id}>
                              {tm.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Título do Momento */}
                    <div className="flex-1 min-w-[180px]">
                      <Input
                        value={m.titulo}
                        onChange={e => handleEditMomentoField(idx, 'titulo', e.target.value)}
                        placeholder="Título da Pauta / Atividade"
                        className="h-8 text-xs font-medium"
                      />
                    </div>

                    {/* Temática Macro */}
                    <div className="w-32 shrink-0">
                      <Input
                        value={m.tematicaMacro}
                        onChange={e => handleEditMomentoField(idx, 'tematicaMacro', e.target.value)}
                        placeholder="Temática Macro"
                        className="h-8 text-xs"
                      />
                    </div>

                    {/* Palestrante / Parceiro */}
                    <div className="w-36 shrink-0">
                      <Input
                        value={m.parceiroNome || m.ministranteNome || ''}
                        onChange={e => {
                          const val = e.target.value;
                          handleEditMomentoField(idx, 'parceiroNome', val);
                          handleEditMomentoField(idx, 'ministranteNome', val);
                        }}
                        placeholder="Palestrante / Parceiro"
                        className="h-8 text-xs"
                      />
                    </div>

                    {/* Excluir Momento */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleRemoverMomento(idx)}
                      title="Excluir este momento do modelo"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-3 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancelar Edição
              </Button>
              <Button
                type="button"
                size="sm"
                className="gap-1.5 font-bold"
                onClick={handleSalvarEdicaoTemplate}
              >
                <CheckCircle2 size={14} />
                <span>Salvar Alterações no Modelo</span>
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* ======================= MODO NORMAL: SELEÇÃO E APLICAÇÃO ======================= */
          <div className="space-y-4">
            <DialogHeader className="border-b border-border pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="text-primary" size={20} />
                    Modelos de Grade de Conteúdo (Templates Oficiais)
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Modelos editáveis na ordem cronológica oficial da RioJunior: <strong>RJ 74°</strong>, <strong>ONDE</strong>, <strong>CentralRio</strong> e <strong>EFEJ (3 Dias)</strong>.
                  </p>
                </div>

                {pautasAtuais.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5 shrink-0"
                    onClick={() => setShowSaveCustom(!showSaveCustom)}
                  >
                    <BookmarkPlus size={14} />
                    <span>Salvar grade atual como modelo</span>
                  </Button>
                )}
              </div>
            </DialogHeader>

            {/* Formulário para salvar grade atual como modelo customizado */}
            {showSaveCustom && (
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3 my-2 animate-fade-in">
                <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <BookmarkPlus size={14} /> Salvar os {pautasAtuais.length} momentos de "{nomeEvento}" como novo modelo
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Nome do Modelo</Label>
                    <Input
                      value={customNome}
                      onChange={e => setCustomNome(e.target.value)}
                      placeholder="Ex.: Modelo Imersão Regional 2026"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Descrição rápida</Label>
                    <Input
                      value={customDescricao}
                      onChange={e => setCustomDescricao(e.target.value)}
                      placeholder="Ex.: Grade com foco em projetos e liderança..."
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setShowSaveCustom(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 text-xs font-semibold"
                    onClick={handleSaveCurrentAsTemplate}
                    disabled={!customNome.trim()}
                  >
                    Salvar Modelo
                  </Button>
                </div>
              </div>
            )}

            {/* Grid dos Modelos Disponíveis (Ordem Cronológica: RJ 74°, ONDE, CentralRio, EFEJ) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {templates.map(t => {
                const isSelected = selectedTemplateId === t.id;
                const isModificado = isTemplateModificado(t.id);

                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplateId(t.id);
                      setPreviewDiaFiltro('todos');
                    }}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.03] shadow-sm'
                        : 'border-border hover:border-primary/50 bg-card hover:bg-muted/30'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-muted border border-border">
                            {getTemplateIcon(t.icone)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground line-clamp-1 leading-tight">
                              {t.nome}
                            </h4>
                            <span className="text-[10px] text-muted-foreground block line-clamp-1">
                              {t.tipoEvento}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Botão de Editar Template */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIniciarEdicao(t);
                            }}
                            title="Editar este modelo (momentos, nome e descrição)"
                          >
                            <Pencil size={11} />
                          </Button>

                          {t.isCustom && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCustom(t.id);
                              }}
                              title="Excluir modelo customizado"
                            >
                              <Trash2 size={11} />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Badges de Duração e Modificado */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {t.diasCount > 1 ? (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-indigo-400 text-indigo-700 dark:text-indigo-300 font-bold">
                            🗓️ {t.diasCount} Dias
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-muted-foreground">
                            1 Dia
                          </Badge>
                        )}

                        {isModificado && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                            ✏️ Editado
                          </Badge>
                        )}
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-snug line-clamp-3">
                        {t.descricao}
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-muted-foreground font-medium pt-1">
                        <span className="flex items-center gap-1">
                          <Layers size={10} /> {t.momentos.length} momentos
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {t.horasEstimadas}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-purple-700 dark:text-purple-300 border-purple-300">
                          {t.momentos.filter(m => m.tipo === 'magna').length} Magnas
                        </Badge>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-emerald-700 dark:text-emerald-300 border-emerald-300">
                          {t.momentos.filter(m => m.tipo === 'paralela').length} Paralelas
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-2.5 mt-2.5 border-t border-border/50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplateId(t.id);
                          setPreviewDiaFiltro('todos');
                          setExpandedPreviewId(expandedPreviewId === t.id ? null : t.id);
                        }}
                        className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>{expandedPreviewId === t.id ? 'Ocultar pautas' : 'Ver pautas'}</span>
                        {expandedPreviewId === t.id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>

                      {isSelected && (
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                          <Check size={11} /> Selecionado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pré-visualização da Programação do Modelo Selecionado */}
            {selectedTemplate && (
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2 flex-wrap">
                      <span>Programação do Modelo: {selectedTemplate.nome}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {selectedTemplate.momentos.length} momentos
                      </Badge>
                      {selectedTemplate.diasCount > 1 && (
                        <Badge className="text-[10px] bg-indigo-600 text-white font-bold">
                          Evento de {selectedTemplate.diasCount} Dias
                        </Badge>
                      )}
                      {isTemplateModificado(selectedTemplate.id) && (
                        <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                          Personalizado pelo usuário
                        </Badge>
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Referência: <strong>{selectedTemplate.eventoReferencia}</strong>. Ao aplicar, todos os momentos serão criados na grade e ficam 100% editáveis.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Botão de Edição do Modelo Selecionado */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5 text-primary border-primary/40 hover:bg-primary/10 font-semibold"
                      onClick={() => handleIniciarEdicao(selectedTemplate)}
                    >
                      <Pencil size={13} />
                      <span>Editar este Modelo</span>
                    </Button>

                    {isTemplateModificado(selectedTemplate.id) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs gap-1 text-muted-foreground hover:text-amber-600"
                        onClick={() => handleResetTemplate(selectedTemplate.id)}
                        title="Restaurar padrão oficial"
                      >
                        <RotateCcw size={13} />
                        <span>Restaurar Padrão</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Abas de filtro por dia se o modelo for multi-dias (ex: EFEJ) */}
                {selectedTemplate.diasCount > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] font-semibold text-muted-foreground mr-1">Filtrar por dia:</span>
                    <Button
                      type="button"
                      variant={previewDiaFiltro === 'todos' ? 'default' : 'outline'}
                      size="sm"
                      className="h-7 text-xs px-2.5"
                      onClick={() => setPreviewDiaFiltro('todos')}
                    >
                      Todos ({selectedTemplate.momentos.length})
                    </Button>
                    <Button
                      type="button"
                      variant={previewDiaFiltro === 0 ? 'default' : 'outline'}
                      size="sm"
                      className="h-7 text-xs px-2.5"
                      onClick={() => setPreviewDiaFiltro(0)}
                    >
                      Dia 1 - Sexta ({selectedTemplate.momentos.filter(m => (m.diaOffset ?? 0) === 0).length})
                    </Button>
                    <Button
                      type="button"
                      variant={previewDiaFiltro === 1 ? 'default' : 'outline'}
                      size="sm"
                      className="h-7 text-xs px-2.5"
                      onClick={() => setPreviewDiaFiltro(1)}
                    >
                      Dia 2 - Sábado ({selectedTemplate.momentos.filter(m => m.diaOffset === 1).length})
                    </Button>
                    <Button
                      type="button"
                      variant={previewDiaFiltro === 2 ? 'default' : 'outline'}
                      size="sm"
                      className="h-7 text-xs px-2.5"
                      onClick={() => setPreviewDiaFiltro(2)}
                    >
                      Dia 3 - Domingo ({selectedTemplate.momentos.filter(m => m.diaOffset === 2).length})
                    </Button>
                  </div>
                )}

                {/* Lista dos momentos do template */}
                <div className="max-h-64 overflow-y-auto divide-y divide-border border border-border rounded-lg">
                  {momentosPreviewFiltrados.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 text-xs hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        {selectedTemplate.diasCount > 1 && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono text-indigo-600 border-indigo-200 shrink-0">
                            Dia {(m.diaOffset ?? 0) + 1}
                          </Badge>
                        )}
                        <span className="font-semibold text-foreground shrink-0 w-28 text-[11px]">
                          ⏱️ {m.horario}
                        </span>
                        <Badge className={`text-[9px] px-1.5 py-0 border shrink-0 ${getTipoColor(m.tipo)}`}>
                          {getTipoLabel(m.tipo)}
                        </Badge>
                        <span className="font-medium text-foreground truncate">{m.titulo}</span>
                        {m.tematicaMacro && (
                          <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:inline">
                            ({m.tematicaMacro})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground shrink-0 pl-2">
                        {m.parceiroNome && <span className="text-primary font-medium">{m.parceiroNome}</span>}
                        {m.ministranteNome && !m.parceiroNome && <span>{m.ministranteNome}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Opção de Substituir ou Mesclar */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/30 p-3 rounded-lg border border-border">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-foreground">Como deseja aplicar este modelo?</span>
                    <p className="text-[11px] text-muted-foreground">
                      {pautasAtuais.length > 0
                        ? `O evento já possui ${pautasAtuais.length} momento(s) cadastrado(s).`
                        : 'A grade deste evento está vazia no momento.'}
                      {selectedTemplate.diasCount > 1 &&
                        ' Para o EFEJ (3 dias), os momentos serão automaticamente distribuídos nos 3 dias do evento.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={substituir ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setSubstituir(true)}
                    >
                      Substituir grade atual
                    </Button>
                    {pautasAtuais.length > 0 && (
                      <Button
                        type="button"
                        variant={!substituir ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setSubstituir(false)}
                      >
                        Adicionar ao final da grade
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-border pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Info size={13} />
                Após aplicar, você pode editar horários, nomes, palestrantes e excluir ou adicionar linhas normalmente.
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 font-bold"
                  onClick={handleApply}
                  disabled={!selectedTemplate || applying}
                >
                  <Download size={14} />
                  <span>{applying ? 'Aplicando modelo...' : `Carregar "${selectedTemplate?.nome}"`}</span>
                </Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
