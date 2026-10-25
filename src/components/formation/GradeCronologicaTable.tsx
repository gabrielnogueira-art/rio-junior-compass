import React, { useState, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Star,
  Coffee,
  Sparkles,
  ArrowUpDown,
  Check,
  X,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PautaEvento, PautaVendida } from '@/hooks/useGradeConteudo';
import { useManageableOptions } from './useManageableOptions';
import {
  extractTimesFromHorario,
  formatDurationLabel,
  parseTime,
  calculateDuration,
  getGapBetween,
} from './timeUtils';
import { format, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GradeCronologicaTableProps {
  pautas: PautaEvento[];
  evento?: {
    id: string;
    nome: string;
    dataInicio: string;
    dataFim: string;
  } | null;
  cotasMagnas: number;
  cotasParalelas: number;
  onAdicionar: (sugestaoInicio?: string, diaPre?: string, tipoPre?: string) => void;
  onEditar: (pauta: PautaEvento) => void;
  onExcluir: (id: string) => void;
  onDuplicar: (pauta: PautaEvento) => void;
  onQuickUpdateTitulo: (id: string, novoTitulo: string) => Promise<void>;
  canEdit?: boolean;
}

export function GradeCronologicaTable({
  pautas,
  evento,
  cotasMagnas,
  cotasParalelas,
  onAdicionar,
  onEditar,
  onExcluir,
  onDuplicar,
  onQuickUpdateTitulo,
  canEdit = true,
}: GradeCronologicaTableProps) {
  const { getTipoColor, getTipoLabel, getMinistranteLabel } = useManageableOptions();

  // Dias do evento (se for múltiplos dias como EFEJ)
  const diasEvento = useMemo(() => {
    if (!evento?.dataInicio) return [];
    try {
      const inicio = new Date(evento.dataInicio + 'T12:00:00');
      const fim = evento.dataFim ? new Date(evento.dataFim + 'T12:00:00') : inicio;
      if (fim < inicio) return [evento.dataInicio];
      return eachDayOfInterval({ start: inicio, end: fim }).map(d => format(d, 'yyyy-MM-dd'));
    } catch {
      return [evento.dataInicio];
    }
  }, [evento]);

  // Filtro de dia selecionado
  const [diaFiltro, setDiaFiltro] = useState<string>('todos');

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitulo, setEditingTitulo] = useState<string>('');

  // Processa e ordena cronologicamente
  const pautasProcessadas = useMemo(() => {
    return pautas.map(p => {
      const parsedTime = extractTimesFromHorario(p.horario || '');
      const startMins = parseTime(parsedTime.inicio) ?? (p.ordem * 60 + 540); // default 09:00 + ordem
      return {
        ...p,
        parsedTime,
        startMins,
      };
    });
  }, [pautas]);

  // Filtra por dia
  const pautasFiltradas = useMemo(() => {
    let list = pautasProcessadas;
    if (diaFiltro !== 'todos') {
      list = list.filter(p => (p.dia || evento?.dataInicio) === diaFiltro);
    }
    // Ordena por dia (se 'todos') e depois por horário de início
    return [...list].sort((a, b) => {
      const diaA = a.dia || evento?.dataInicio || '';
      const diaB = b.dia || evento?.dataInicio || '';
      if (diaA !== diaB) return diaA.localeCompare(diaB);
      if (a.startMins !== b.startMins) return a.startMins - b.startMins;
      return a.ordem - b.ordem;
    });
  }, [pautasProcessadas, diaFiltro, evento]);

  // Estatísticas da grade
  const stats = useMemo(() => {
    let totalMinutos = 0;
    let magnasAlocadas = 0;
    let paralelasAlocadas = 0;
    let somaCsat = 0;
    let qtdCsat = 0;

    pautasProcessadas.forEach(p => {
      if (p.parsedTime.duracao > 0) {
        totalMinutos += p.parsedTime.duracao;
      } else {
        totalMinutos += 60; // fallback padrão
      }
      if (p.tipo === 'magna') magnasAlocadas++;
      if (p.tipo === 'paralela') paralelasAlocadas++;
      if (p.csat !== null && p.csat !== undefined && p.csat > 0) {
        somaCsat += p.csat;
        qtdCsat++;
      }
    });

    const mediaCsat = qtdCsat > 0 ? (somaCsat / qtdCsat).toFixed(1) : null;

    return {
      totalMomentos: pautasProcessadas.length,
      duracaoTotalLabel: formatDurationLabel(totalMinutos),
      magnasAlocadas,
      paralelasAlocadas,
      mediaCsat,
    };
  }, [pautasProcessadas]);

  // Inicia inline edit
  const startInlineEdit = (p: PautaEvento) => {
    if (!canEdit) return;
    setEditingId(p.id);
    setEditingTitulo(p.titulo || '');
  };

  const saveInlineEdit = async (id: string) => {
    if (editingTitulo.trim()) {
      await onQuickUpdateTitulo(id, editingTitulo.trim());
    }
    setEditingId(null);
  };

  // Último horário de término para sugerir no próximo momento
  const ultimoHorarioFim = useMemo(() => {
    if (pautasFiltradas.length === 0) return '09:00';
    const ultimo = pautasFiltradas[pautasFiltradas.length - 1];
    return ultimo.parsedTime.fim || ultimo.parsedTime.inicio || '09:00';
  }, [pautasFiltradas]);

  const diaAtivoParaAdicionar = diaFiltro !== 'todos' ? diaFiltro : (diasEvento[0] || evento?.dataInicio || '');

  return (
    <div className="space-y-4">
      {/* Barra de Estatísticas / Chips Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
        <div className="bg-card border border-border rounded-xl p-3 shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Clock size={12} className="text-primary" /> Carga Horária
          </span>
          <p className="text-base font-bold text-foreground mt-0.5">{stats.duracaoTotalLabel}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Layers size={12} className="text-primary" /> Total Momentos
          </span>
          <p className="text-base font-bold text-foreground mt-0.5">{stats.totalMomentos}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Sparkles size={12} className="text-purple-500" /> Pautas Magnas
          </span>
          <p className="text-base font-bold text-foreground mt-0.5">
            {stats.magnasAlocadas}{' '}
            <span className="text-xs font-normal text-muted-foreground">/ {cotasMagnas} vendáveis</span>
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Sparkles size={12} className="text-emerald-500" /> Pautas Paralelas
          </span>
          <p className="text-base font-bold text-foreground mt-0.5">
            {stats.paralelasAlocadas}{' '}
            <span className="text-xs font-normal text-muted-foreground">/ {cotasParalelas} vendáveis</span>
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-card border border-border rounded-xl p-3 shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-500" /> CSAT Médio
          </span>
          <p className="text-base font-bold text-foreground mt-0.5">
            {stats.mediaCsat ? `★ ${stats.mediaCsat}` : '-'}
          </p>
        </div>
      </div>

      {/* Tabs por Dia se houver mais de 1 dia (ex: EFEJ 3 dias) */}
      {diasEvento.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Filtrar dia:</span>
            <Button
              type="button"
              size="sm"
              variant={diaFiltro === 'todos' ? 'default' : 'outline'}
              className="h-7 text-xs"
              onClick={() => setDiaFiltro('todos')}
            >
              Todos os dias ({pautasProcessadas.length})
            </Button>
            {diasEvento.map((d, idx) => {
              const count = pautasProcessadas.filter(p => (p.dia || evento?.dataInicio) === d).length;
              const dateObj = new Date(d + 'T12:00:00');
              return (
                <Button
                  key={d}
                  type="button"
                  size="sm"
                  variant={diaFiltro === d ? 'default' : 'outline'}
                  className="h-7 text-xs gap-1.5"
                  onClick={() => setDiaFiltro(d)}
                >
                  <span>Dia {idx + 1} ({format(dateObj, 'dd/MM', { locale: ptBR })})</span>
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>

          <Button
            size="sm"
            className="h-7 text-xs gap-1 font-medium ml-auto"
            onClick={() => onAdicionar(ultimoHorarioFim, diaAtivoParaAdicionar)}
          >
            <Plus size={13} /> Adicionar neste dia
          </Button>
        </div>
      )}

      {/* Tabela Cronológica Moderna */}
      {pautasFiltradas.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center space-y-3">
            <Calendar size={36} className="mx-auto text-muted-foreground/40" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Nenhum momento cadastrado {diaFiltro !== 'todos' ? 'para este dia' : 'na grade'}.
              </p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Monte a programação com credenciamento, check-in, abertura, almoço, pautas magnas e paralelas de forma sequencial.
              </p>
            </div>
            <Button size="sm" onClick={() => onAdicionar(ultimoHorarioFim, diaAtivoParaAdicionar)}>
              <Plus size={14} className="mr-1.5" /> Adicionar primeiro momento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-xs">
          {/* Cabeçalho da Grade */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-muted/50 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider items-center">
            <div className="col-span-3 sm:col-span-2">Horário</div>
            <div className="col-span-3 sm:col-span-2">Tipo</div>
            <div className="col-span-6 sm:col-span-4">Pauta / Título</div>
            <div className="hidden sm:block sm:col-span-2">Ministrante</div>
            <div className="hidden sm:block sm:col-span-1 text-center">CSAT</div>
            <div className="hidden sm:block sm:col-span-1 text-right">Ações</div>
          </div>

          {/* Linhas da Grade com Detecção de Intervalos */}
          <div className="divide-y divide-border">
            {pautasFiltradas.map((p, index) => {
              const prev = index > 0 ? pautasFiltradas[index - 1] : null;
              const mesmoDia = prev && (prev.dia || evento?.dataInicio) === (p.dia || evento?.dataInicio);
              const gapMins = mesmoDia && prev.parsedTime.fim && p.parsedTime.inicio
                ? getGapBetween(prev.parsedTime.fim, p.parsedTime.inicio)
                : 0;

              const isEditing = editingId === p.id;
              const duracaoLabel = p.parsedTime.duracao > 0 ? formatDurationLabel(p.parsedTime.duracao) : '';

              return (
                <React.Fragment key={p.id}>
                  {/* Se houver intervalo livre entre dois momentos, mostra a barra de intervalo */}
                  {gapMins >= 15 && (
                    <div className="flex items-center justify-between px-4 py-2 bg-amber-500/5 border-y border-dashed border-amber-500/30 text-xs">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium">
                        <Coffee size={14} />
                        <span>
                          Intervalo livre de {formatDurationLabel(gapMins)} ({prev.parsedTime.fim} às {p.parsedTime.inicio})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[11px] px-2 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
                        onClick={() => onAdicionar(prev.parsedTime.fim, p.dia || '', 'almoco_intervalo')}
                      >
                        <Plus size={11} className="mr-1" /> Inserir Almoço / Intervalo aqui
                      </Button>
                    </div>
                  )}

                  {/* Linha do Momento */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 transition-colors group text-sm">
                    {/* Coluna Horário */}
                    <div className="col-span-3 sm:col-span-2 space-y-0.5">
                      <div className="font-semibold text-foreground text-xs sm:text-sm flex items-center gap-1">
                        <Clock size={12} className="text-muted-foreground shrink-0 hidden sm:inline" />
                        <span>{p.horario || 'Horário livre'}</span>
                      </div>
                      {duracaoLabel && (
                        <span className="text-[10px] text-muted-foreground font-medium inline-block bg-muted px-1.5 py-0.2 rounded">
                          {duracaoLabel}
                        </span>
                      )}
                      {diaFiltro === 'todos' && diasEvento.length > 1 && p.dia && (
                        <div className="text-[10px] text-muted-foreground font-medium">
                          {format(new Date(p.dia + 'T12:00:00'), 'dd/MM', { locale: ptBR })}
                        </div>
                      )}
                    </div>

                    {/* Coluna Tipo de Momento */}
                    <div className="col-span-3 sm:col-span-2 flex flex-col gap-1 items-start">
                      <Badge className={`text-[10px] font-semibold border ${getTipoColor(p.tipo)}`}>
                        {getTipoLabel(p.tipo)}
                      </Badge>
                      {p.tematicaMacro && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-full">
                          {p.tematicaMacro}
                        </span>
                      )}
                    </div>

                    {/* Coluna Pauta / Título (com suporte a quick edit) */}
                    <div className="col-span-6 sm:col-span-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={editingTitulo}
                            onChange={e => setEditingTitulo(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveInlineEdit(p.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="h-8 text-xs font-medium"
                          />
                          <Button size="icon" className="h-7 w-7 shrink-0" onClick={() => saveInlineEdit(p.id)}>
                            <Check size={12} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => setEditingId(null)}>
                            <X size={12} />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer group/title"
                          onClick={() => startInlineEdit(p)}
                          title="Clique para editar o título rapidamente"
                        >
                          <p className="font-semibold text-foreground text-xs sm:text-sm group-hover/title:text-primary transition-colors line-clamp-2">
                            {p.titulo || <span className="italic text-muted-foreground">Sem título</span>}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-muted-foreground mt-0.5 sm:hidden">
                            {p.ministranteNome && <span>{p.ministranteNome}</span>}
                            {p.csat !== null && (
                              <span className="text-amber-500 font-semibold flex items-center">
                                ★ {Number(p.csat).toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Coluna Ministrante & Parceiro (Desktop) */}
                    <div className="hidden sm:block sm:col-span-2 space-y-0.5 text-xs">
                      {p.ministranteNome ? (
                        <div className="font-medium text-foreground truncate">{p.ministranteNome}</div>
                      ) : (
                        <span className="text-muted-foreground italic text-[11px]">-</span>
                      )}
                      {p.ministranteTipo && (
                        <div className="text-[10px] text-muted-foreground truncate">
                          {getMinistranteLabel(p.ministranteTipo)}
                        </div>
                      )}
                      {p.parceiroNome && (
                        <div className="text-[10px] text-primary font-medium truncate">
                          Parceiro: {p.parceiroNome}
                        </div>
                      )}
                      {p.vendaId && (
                        <Badge variant="secondary" className="text-[9px] px-1 py-0">
                          Vendida VPNeg
                        </Badge>
                      )}
                    </div>

                    {/* Coluna CSAT (Desktop) */}
                    <div className="hidden sm:block sm:col-span-1 text-center">
                      {p.csat !== null && p.csat !== undefined && p.csat > 0 ? (
                        <div className="inline-flex items-center gap-0.5 font-bold text-xs text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                          <Star size={11} className="fill-amber-500" />
                          <span>{Number(p.csat).toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </div>

                    {/* Coluna Ações */}
                    <div className="col-span-12 sm:col-span-1 flex items-center justify-end gap-0.5 pt-1 sm:pt-0 border-t border-border/40 sm:border-t-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => onEditar(p)}
                        title="Editar todos os detalhes"
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => onDuplicar(p)}
                        title="Duplicar momento (criar pauta paralela simultânea)"
                      >
                        <Copy size={13} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onExcluir(p.id)}
                        title="Excluir momento"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Rodapé da Grade com Botão Rápido de Adição */}
          <div className="p-3 bg-muted/20 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Mostrando {pautasFiltradas.length} momento(s)
            </span>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => onAdicionar(ultimoHorarioFim, diaAtivoParaAdicionar)}
            >
              <Plus size={13} /> Continuar montando grade (+ Adicionar momento)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
