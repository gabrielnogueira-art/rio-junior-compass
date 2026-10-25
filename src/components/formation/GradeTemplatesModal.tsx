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
  GradeTemplate,
  TemplateMomento,
  getGradeTemplates,
  saveCustomGradeTemplate,
  deleteCustomGradeTemplate,
} from './gradeTemplates';
import { PautaEvento } from '@/hooks/useGradeConteudo';
import { useManageableOptions } from './useManageableOptions';

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
  const { getTipoColor, getTipoLabel } = useManageableOptions();
  const [templates, setTemplates] = useState<GradeTemplate[]>(() => getGradeTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('template_rj74');
  const [expandedPreviewId, setExpandedPreviewId] = useState<string | null>('template_rj74');
  const [substituir, setSubstituir] = useState<boolean>(pautasAtuais.length === 0);
  const [applying, setApplying] = useState(false);

  // Estado para salvar grade atual como template
  const [showSaveCustom, setShowSaveCustom] = useState(false);
  const [customNome, setCustomNome] = useState('');
  const [customDescricao, setCustomDescricao] = useState('');

  const reloadTemplates = () => {
    setTemplates(getGradeTemplates());
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

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
  };

  const handleDeleteCustom = (templateId: string) => {
    if (confirm('Deseja excluir este modelo personalizado?')) {
      deleteCustomGradeTemplate(templateId);
      reloadTemplates();
      if (selectedTemplateId === templateId) {
        setSelectedTemplateId('template_rj74');
      }
    }
  };

  const getTemplateIcon = (icone: string) => {
    switch (icone) {
      case 'Flame':
        return <Flame size={18} className="text-amber-500" />;
      case 'Target':
        return <Target size={18} className="text-emerald-500" />;
      default:
        return <Users size={18} className="text-primary" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="text-primary" size={20} />
                Modelos de Grade de Conteúdo (Templates Oficiais)
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Modelos editáveis com base nas grades reais de 2026 (RJ 74°, CentralRio e ONDE). Use como referência estrutural para montar a programação do seu evento.
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

        {/* Formulário para salvar grade atual como modelo */}
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
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowSaveCustom(false)}>
                Cancelar
              </Button>
              <Button size="sm" className="h-7 text-xs" onClick={handleSaveCurrentAsTemplate} disabled={!customNome.trim()}>
                Salvar Modelo
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4 py-2">
          {/* Grid de Modelos Disponíveis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {templates.map(t => {
              const isSelected = selectedTemplateId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={`relative cursor-pointer rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                      : 'border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/30'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          {getTemplateIcon(t.icone)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground leading-tight">{t.nome}</h4>
                          <span className="text-[10px] text-muted-foreground font-medium">{t.tipoEvento}</span>
                        </div>
                      </div>
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
                        >
                          <Trash2 size={12} />
                        </Button>
                      )}
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-snug line-clamp-3">
                      {t.descricao}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <Layers size={11} /> {t.totalMomentos} momentos
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {t.horasEstimadas}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-purple-700 dark:text-purple-300 border-purple-300">
                        {t.qtdMagnas} Magnas
                      </Badge>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-emerald-700 dark:text-emerald-300 border-emerald-300">
                        {t.qtdParalelas} Paralelas
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPreviewId(expandedPreviewId === t.id ? null : t.id);
                      }}
                      className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>{expandedPreviewId === t.id ? 'Ocultar pautas' : 'Ver pautas'}</span>
                      {expandedPreviewId === t.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {isSelected && (
                      <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                        <Check size={12} /> Selecionado
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
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span>Programação do Modelo: {selectedTemplate.nome}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {selectedTemplate.momentos.length} momentos
                    </Badge>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Referência oficial: <strong>{selectedTemplate.eventoReferencia}</strong>. Ao aplicar, todos os momentos serão criados na grade e ficam 100% editáveis.
                  </p>
                </div>
              </div>

              {/* Lista dos momentos do template */}
              <div className="max-h-64 overflow-y-auto divide-y divide-border border border-border rounded-lg">
                {selectedTemplate.momentos.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 text-xs hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
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
        </div>

        <DialogFooter className="border-t border-border pt-3 flex items-center justify-between">
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
              <span>{applying ? 'Aplicando modelo...' : `Carregar "${selectedTemplate.nome}"`}</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
