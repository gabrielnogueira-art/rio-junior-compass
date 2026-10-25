import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Star, Sparkles, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ManageableSelect } from './ManageableSelect';
import { useManageableOptions } from './useManageableOptions';
import {
  parseTime,
  minutesToTime,
  formatDurationLabel,
  calculateEndTime,
  calculateDuration,
  extractTimesFromHorario,
  formatHorarioString,
} from './timeUtils';
import { PautaEvento, PautaVendida } from '@/hooks/useGradeConteudo';
import { format, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface MomentoFormValues {
  tipo: string;
  titulo: string;
  tematicaMacro: string;
  dia: string;
  horario: string;
  horarioInicio: string;
  horarioFim: string;
  duracaoMinutos: number;
  ministranteTipo: string;
  ministranteNome: string;
  parceiroNome: string;
  csat: string;
  vendaId: string | null;
}

interface MomentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: MomentoFormValues) => Promise<void>;
  editando: PautaEvento | null;
  vendaParaAlocar?: PautaVendida | null;
  evento?: {
    id: string;
    nome: string;
    dataInicio: string;
    dataFim: string;
  } | null;
  sugestaoHorarioInicio?: string;
  diaPadrao?: string;
}

const DURACAO_PRESETS = [
  { label: '15m', mins: 15 },
  { label: '30m', mins: 30 },
  { label: '45m', mins: 45 },
  { label: '1h', mins: 60 },
  { label: '1h 30m', mins: 90 },
  { label: '2h', mins: 120 },
];

export function MomentoDialog({
  open,
  onOpenChange,
  onSave,
  editando,
  vendaParaAlocar,
  evento,
  sugestaoHorarioInicio,
  diaPadrao,
}: MomentoDialogProps) {
  const {
    tiposMomento,
    tematicasMacro,
    ministrantes,
    addTipoMomento,
    removeTipoMomento,
    addTematicaMacro,
    removeTematicaMacro,
    addMinistrante,
    removeMinistrante,
    getTipoColor,
  } = useManageableOptions();

  const [saving, setSaving] = useState(false);

  // Form State
  const [tipo, setTipo] = useState<string>('paralela');
  const [titulo, setTitulo] = useState<string>('');
  const [tematicaMacro, setTematicaMacro] = useState<string>('');
  const [dia, setDia] = useState<string>('');
  const [horarioInicio, setHorarioInicio] = useState<string>('09:00');
  const [horarioFim, setHorarioFim] = useState<string>('10:30');
  const [duracaoMinutos, setDuracaoMinutos] = useState<number>(90);
  const [ministranteTipo, setMinistranteTipo] = useState<string>('');
  const [ministranteNome, setMinistranteNome] = useState<string>('');
  const [parceiroNome, setParceiroNome] = useState<string>('');
  const [csat, setCsat] = useState<string>('');
  const [vendaId, setVendaId] = useState<string | null>(null);

  // Lista os dias do evento se for de múltiplos dias (ex.: EFEJ)
  const diasEvento = React.useMemo(() => {
    if (!evento?.dataInicio) return [];
    try {
      const inicio = new Date(evento.dataInicio + 'T12:00:00');
      const fim = evento.dataFim ? new Date(evento.dataFim + 'T12:00:00') : inicio;
      if (fim < inicio) return [evento.dataInicio];
      const days = eachDayOfInterval({ start: inicio, end: fim });
      return days.map(d => format(d, 'yyyy-MM-dd'));
    } catch {
      return [evento.dataInicio];
    }
  }, [evento]);

  // Inicializa o formulário ao abrir
  useEffect(() => {
    if (!open) return;

    if (editando) {
      setTipo(editando.tipo || 'paralela');
      setTitulo(editando.titulo || '');
      setTematicaMacro(editando.tematicaMacro || '');
      setDia(editando.dia || (evento?.dataInicio ?? ''));
      setMinistranteTipo(editando.ministranteTipo || '');
      setMinistranteNome(editando.ministranteNome || '');
      setParceiroNome(editando.parceiroNome || '');
      setCsat(editando.csat !== null && editando.csat !== undefined ? String(editando.csat) : '');
      setVendaId(editando.vendaId || null);

      const parsed = extractTimesFromHorario(editando.horario || '');
      setHorarioInicio(parsed.inicio || '09:00');
      setHorarioFim(parsed.fim || (parsed.inicio ? calculateEndTime(parsed.inicio, 60) : '10:00'));
      setDuracaoMinutos(parsed.duracao || 60);
    } else if (vendaParaAlocar) {
      setTipo(vendaParaAlocar.tipo);
      setTitulo(`Pauta Patrocinada: ${vendaParaAlocar.parceiroNome}`);
      setTematicaMacro('Vendas');
      setDia(diaPadrao || evento?.dataInicio || '');
      setMinistranteTipo('parceiro_vpneg');
      setMinistranteNome(vendaParaAlocar.parceiroNome);
      setParceiroNome(vendaParaAlocar.parceiroNome);
      setCsat('');
      setVendaId(vendaParaAlocar.id);

      const ini = sugestaoHorarioInicio || '14:00';
      setHorarioInicio(ini);
      const fim = calculateEndTime(ini, 60);
      setHorarioFim(fim);
      setDuracaoMinutos(60);
    } else {
      // Novo momento em branco com sugestão inteligente
      setTipo('paralela');
      setTitulo('');
      setTematicaMacro('');
      setDia(diaPadrao || evento?.dataInicio || '');
      setMinistranteTipo('');
      setMinistranteNome('');
      setParceiroNome('');
      setCsat('');
      setVendaId(null);

      const ini = sugestaoHorarioInicio || '09:00';
      setHorarioInicio(ini);
      const fim = calculateEndTime(ini, 90) || '10:30';
      setHorarioFim(fim);
      setDuracaoMinutos(90);
    }
  }, [open, editando, vendaParaAlocar, evento, sugestaoHorarioInicio, diaPadrao]);

  // Handlers reativos de cálculo bidirecional de horário
  const handleInicioChange = (novoInicio: string) => {
    setHorarioInicio(novoInicio);
    if (duracaoMinutos > 0) {
      const novoFim = calculateEndTime(novoInicio, duracaoMinutos);
      if (novoFim) setHorarioFim(novoFim);
    } else if (horarioFim) {
      const novaDur = calculateDuration(novoInicio, horarioFim);
      setDuracaoMinutos(novaDur);
    }
  };

  const handleFimChange = (novoFim: string) => {
    setHorarioFim(novoFim);
    if (horarioInicio) {
      const novaDur = calculateDuration(horarioInicio, novoFim);
      setDuracaoMinutos(novaDur);
    }
  };

  const handleDuracaoChange = (novaDur: number) => {
    setDuracaoMinutos(novaDur);
    if (horarioInicio && novaDur > 0) {
      const novoFim = calculateEndTime(horarioInicio, novaDur);
      if (novoFim) setHorarioFim(novoFim);
    }
  };

  const handlePresetClick = (mins: number) => {
    handleDuracaoChange(mins);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() && tipo !== 'almoco_intervalo' && tipo !== 'credenciamento') {
      // Se não for almoço ou credenciamento, sugere preencher título
    }

    const horarioFinal = formatHorarioString(horarioInicio, horarioFim);

    setSaving(true);
    try {
      await onSave({
        tipo,
        titulo: titulo.trim() || (tipo === 'almoco_intervalo' ? 'Almoço / Intervalo' : tipo === 'credenciamento' ? 'Credenciamento' : 'Momento sem título'),
        tematicaMacro,
        dia,
        horario: horarioFinal,
        horarioInicio,
        horarioFim,
        duracaoMinutos,
        ministranteTipo,
        ministranteNome: ministranteNome.trim(),
        parceiroNome: parceiroNome.trim(),
        csat,
        vendaId,
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="text-primary" size={18} />
            {editando ? 'Editar momento na grade' : vendaId ? 'Alocar pauta vendida na grade' : 'Adicionar momento à grade'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          {/* Alerta de venda VPNeg */}
          {vendaId && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg border border-primary/30 bg-primary/5 text-xs text-primary font-medium">
              <AlertCircle size={15} />
              <span>Esta pauta está vinculada a uma venda comercial da VPNeg ({parceiroNome || 'Parceiro'}).</span>
            </div>
          )}

          {/* Linha 1: Tipo de Momento e Temática Macro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ManageableSelect
              label="Tipo de momento"
              value={tipo}
              onChange={setTipo}
              options={tiposMomento}
              onAddOption={addTipoMomento}
              onRemoveOption={removeTipoMomento}
              showBadgeColor
            />

            <ManageableSelect
              label="Temática macro"
              value={tematicaMacro}
              onChange={setTematicaMacro}
              options={tematicasMacro}
              onAddOption={addTematicaMacro}
              onRemoveOption={removeTematicaMacro}
              placeholder="Selecione"
            />
          </div>

          {/* Linha 2: Pauta Específica */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">Pauta específica (título / direcionamento)</Label>
            <Input
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ex.: Liderança de times de alta performance"
              className="text-sm font-medium"
            />
          </div>

          {/* Linha 3: Dia do Evento (com seleção fácil de múltiplos dias) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Calendar size={13} className="text-muted-foreground" />
                Dia do evento
              </Label>
              {diasEvento.length > 1 && (
                <span className="text-[11px] text-muted-foreground">
                  Evento de {diasEvento.length} dias (ex.: EFEJ)
                </span>
              )}
            </div>

            {diasEvento.length > 1 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {diasEvento.map((d, index) => {
                    const isSelected = dia === d;
                    const dateObj = new Date(d + 'T12:00:00');
                    return (
                      <Button
                        key={d}
                        type="button"
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        className={`h-8 text-xs font-medium ${isSelected ? '' : 'text-muted-foreground'}`}
                        onClick={() => setDia(d)}
                      >
                        Dia {index + 1} ({format(dateObj, 'dd/MM', { locale: ptBR })})
                      </Button>
                    );
                  })}
                </div>
                <Input
                  type="date"
                  value={dia}
                  onChange={e => setDia(e.target.value)}
                  className="h-8 text-xs text-muted-foreground w-44"
                />
              </div>
            ) : (
              <Input
                type="date"
                value={dia}
                onChange={e => setDia(e.target.value)}
                className="h-9 text-sm"
              />
            )}
          </div>

          {/* Linha 4: Horário Inteligente com Cálculo Bidirecional */}
          <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock size={13} className="text-primary" />
                Horário & Duração Inteligente
              </Label>
              <Badge variant="secondary" className="font-semibold text-xs">
                Duração: {formatDurationLabel(duracaoMinutos)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">Início</span>
                <Input
                  type="time"
                  value={horarioInicio}
                  onChange={e => handleInicioChange(e.target.value)}
                  className="h-9 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">Término</span>
                <Input
                  type="time"
                  value={horarioFim}
                  onChange={e => handleFimChange(e.target.value)}
                  className="h-9 text-xs font-medium"
                />
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">Duração (min)</span>
                <Input
                  type="number"
                  min={5}
                  step={5}
                  value={duracaoMinutos || ''}
                  onChange={e => handleDuracaoChange(Number(e.target.value) || 0)}
                  placeholder="Ex: 90"
                  className="h-9 text-xs font-medium"
                />
              </div>
            </div>

            {/* Presets rápidos de duração */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-muted-foreground mr-1">Atalhos rápidos:</span>
              {DURACAO_PRESETS.map(p => (
                <button
                  key={p.mins}
                  type="button"
                  onClick={() => handlePresetClick(p.mins)}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                    duracaoMinutos === p.mins
                      ? 'bg-primary text-primary-foreground border-primary font-semibold'
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Linha 5: Quem Ministra e Nome do Ministrante */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ManageableSelect
              label="Quem ministra"
              value={ministranteTipo}
              onChange={setMinistranteTipo}
              options={ministrantes}
              onAddOption={addMinistrante}
              onRemoveOption={removeMinistrante}
              placeholder="Selecione"
            />

            <div className="space-y-1">
              <Label className="text-xs font-medium">Nome do ministrante</Label>
              <Input
                value={ministranteNome}
                onChange={e => setMinistranteNome(e.target.value)}
                placeholder="Ex.: Gabriel Nogueira"
                className="text-sm"
              />
            </div>
          </div>

          {/* Linha 6: Parceiro e CSAT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Parceiro (se houver)</Label>
              <Input
                value={parceiroNome}
                onChange={e => setParceiroNome(e.target.value)}
                placeholder="Ex.: Stone, Falconi..."
                className="text-sm"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">CSAT da pauta (0 a 5)</Label>
                {csat && !isNaN(Number(csat)) && (
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                    <Star size={12} className="fill-amber-500" />
                    {Number(csat).toFixed(1)} / 5.0
                  </span>
                )}
              </div>
              <Input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={csat}
                onChange={e => setCsat(e.target.value)}
                placeholder="Ex.: 4.8"
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 flex items-center justify-end gap-2 border-t border-border mt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : editando ? 'Salvar alterações' : 'Adicionar momento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
