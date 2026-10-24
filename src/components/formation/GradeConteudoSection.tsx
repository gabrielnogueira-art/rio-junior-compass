import { useState, useMemo } from 'react';
import { CalendarRange, Plus, Pencil, Trash2, AlertCircle, Star, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEventos } from '@/hooks/useEventos';
import {
  useGradeConteudo,
  TIPO_MOMENTO_LABELS,
  TEMATICAS_MACRO,
  MINISTRANTE_TIPO_LABELS,
  TipoMomento,
  MinistranteTipo,
  PautaEvento,
  PautaVendida,
} from '@/hooks/useGradeConteudo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TIPO_COLORS: Record<string, string> = {
  credenciamento: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
  checkin: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
  abertura: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  magna: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  paralela: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  outro: 'bg-muted text-muted-foreground',
};

interface PautaFormState {
  tipo: TipoMomento;
  titulo: string;
  tematicaMacro: string;
  dia: string;
  horario: string;
  ministranteTipo: MinistranteTipo | '';
  ministranteNome: string;
  parceiroNome: string;
  csat: string;
  vendaId: string | null;
}

const EMPTY_FORM: PautaFormState = {
  tipo: 'paralela',
  titulo: '',
  tematicaMacro: '',
  dia: '',
  horario: '',
  ministranteTipo: '',
  ministranteNome: '',
  parceiroNome: '',
  csat: '',
  vendaId: null,
};

interface GradeConteudoSectionProps {
  selectedYear: number;
}

const GradeConteudoSection = ({ selectedYear }: GradeConteudoSectionProps) => {
  const { eventos, loading: eventosLoading } = useEventos();
  const { pautas, vendas, loading, getConfig, saveConfig, addPauta, updatePauta, deletePauta } = useGradeConteudo();

  const eventosAno = useMemo(
    () => eventos.filter(e => new Date(e.dataInicio + 'T12:00:00').getFullYear() === selectedYear),
    [eventos, selectedYear]
  );

  const [eventoSelecionado, setEventoSelecionado] = useState<string>('');
  const eventoId = eventoSelecionado || eventosAno[0]?.id || '';
  const evento = eventosAno.find(e => e.id === eventoId);

  const config = eventoId ? getConfig(eventoId) : undefined;
  const pautasEvento = pautas.filter(p => p.eventoId === eventoId);
  const vendasEvento = vendas.filter(v => v.eventoId === eventoId);
  const vendasPendentes = vendasEvento.filter(v => v.status === 'vendida');

  const vendidasMagnas = vendasEvento.filter(v => v.tipo === 'magna').length;
  const vendidasParalelas = vendasEvento.filter(v => v.tipo === 'paralela').length;

  // Cotas (edição)
  const [cotasForm, setCotasForm] = useState<{ magnas: string; paralelas: string } | null>(null);
  const cotasMagnas = cotasForm?.magnas ?? String(config?.magnasVendaveis ?? 0);
  const cotasParalelas = cotasForm?.paralelas ?? String(config?.paralelasVendaveis ?? 0);

  // Modal de pauta
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<PautaEvento | null>(null);
  const [form, setForm] = useState<PautaFormState>(EMPTY_FORM);

  const abrirNova = (venda?: PautaVendida) => {
    setEditando(null);
    setForm(venda
      ? { ...EMPTY_FORM, tipo: venda.tipo, parceiroNome: venda.parceiroNome, ministranteTipo: 'parceiro_vpneg', vendaId: venda.id }
      : EMPTY_FORM
    );
    setModalOpen(true);
  };

  const abrirEdicao = (p: PautaEvento) => {
    setEditando(p);
    setForm({
      tipo: p.tipo,
      titulo: p.titulo,
      tematicaMacro: p.tematicaMacro,
      dia: p.dia || '',
      horario: p.horario,
      ministranteTipo: p.ministranteTipo || '',
      ministranteNome: p.ministranteNome,
      parceiroNome: p.parceiroNome,
      csat: p.csat !== null ? String(p.csat) : '',
      vendaId: p.vendaId,
    });
    setModalOpen(true);
  };

  const salvar = async () => {
    const input = {
      eventoId,
      tipo: form.tipo,
      titulo: form.titulo,
      tematicaMacro: form.tematicaMacro,
      dia: form.dia || null,
      horario: form.horario,
      ministranteTipo: (form.ministranteTipo || null) as MinistranteTipo | null,
      ministranteNome: form.ministranteNome,
      parceiroNome: form.parceiroNome,
      csat: form.csat !== '' ? Number(form.csat) : null,
      vendaId: form.vendaId,
    };
    if (editando) {
      await updatePauta(editando.id, input);
    } else {
      await addPauta(input);
    }
    setModalOpen(false);
  };

  const salvarCotas = async () => {
    await saveConfig(eventoId, Number(cotasMagnas) || 0, Number(cotasParalelas) || 0);
    setCotasForm(null);
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
      {/* Seletor de evento */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Label className="text-sm font-medium shrink-0">Evento:</Label>
        <Select value={eventoId} onValueChange={setEventoSelecionado}>
          <SelectTrigger className="w-full sm:w-96">
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
          <Badge variant="outline" className="w-fit">
            {format(new Date(evento.dataInicio + 'T12:00:00'), "dd/MM", { locale: ptBR })}
            {evento.dataFim !== evento.dataInicio && ` a ${format(new Date(evento.dataFim + 'T12:00:00'), "dd/MM", { locale: ptBR })}`}
          </Badge>
        )}
      </div>

      {/* Cotas de pautas vendáveis (interface com VPNeg) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pautas vendáveis (interface com VPNeg)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Pautas magnas vendáveis</Label>
              <Input
                type="number"
                min={0}
                value={cotasMagnas}
                onChange={e => setCotasForm({ magnas: e.target.value, paralelas: cotasParalelas })}
              />
              <p className="text-xs text-muted-foreground">
                Vendidas: {vendidasMagnas} · Disponíveis: {Math.max(0, (Number(cotasMagnas) || 0) - vendidasMagnas)}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Pautas paralelas vendáveis</Label>
              <Input
                type="number"
                min={0}
                value={cotasParalelas}
                onChange={e => setCotasForm({ magnas: cotasMagnas, paralelas: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Vendidas: {vendidasParalelas} · Disponíveis: {Math.max(0, (Number(cotasParalelas) || 0) - vendidasParalelas)}
              </p>
            </div>
          </div>
          <Button size="sm" onClick={salvarCotas} disabled={!cotasForm}>
            <Save size={14} className="mr-1" /> Salvar cotas
          </Button>
        </CardContent>
      </Card>

      {/* Pautas vendidas pela VPNeg aguardando alocação */}
      {vendasPendentes.length > 0 && (
        <Card className="border-amber-400/50 bg-amber-50/50 dark:bg-amber-900/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" />
              Pautas vendidas pela VPNeg aguardando alocação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {vendasPendentes.map(v => (
              <div key={v.id} className="flex items-center justify-between gap-2 bg-card rounded-lg border border-border p-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={TIPO_COLORS[v.tipo]}>{TIPO_MOMENTO_LABELS[v.tipo]}</Badge>
                  <span className="text-sm font-medium text-foreground">{v.parceiroNome}</span>
                  {v.valor !== null && (
                    <span className="text-xs text-muted-foreground">
                      R$ {v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                <Button size="sm" variant="outline" onClick={() => abrirNova(v)}>
                  Alocar na grade
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Grade de conteúdo */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Grade de conteúdo{evento ? ` — ${evento.nome}` : ''}</CardTitle>
          <Button size="sm" onClick={() => abrirNova()}>
            <Plus size={14} className="mr-1" /> Adicionar momento
          </Button>
        </CardHeader>
        <CardContent>
          {pautasEvento.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum momento cadastrado. Monte a grade com credenciamento, check-in, abertura, pautas magnas e paralelas.
            </p>
          ) : (
            <div className="space-y-2">
              {pautasEvento.map(p => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    <Badge className={TIPO_COLORS[p.tipo]}>{TIPO_MOMENTO_LABELS[p.tipo]}</Badge>
                    {p.titulo && <span className="text-sm font-semibold text-foreground">{p.titulo}</span>}
                    {p.tematicaMacro && <Badge variant="outline" className="text-[10px]">{p.tematicaMacro}</Badge>}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                    {p.dia && <span>📅 {format(new Date(p.dia + 'T12:00:00'), "dd/MM", { locale: ptBR })}</span>}
                    {p.horario && <span>🕐 {p.horario}</span>}
                    {p.ministranteNome && (
                      <span>
                        🎤 {p.ministranteNome}
                        {p.ministranteTipo && ` (${MINISTRANTE_TIPO_LABELS[p.ministranteTipo]})`}
                      </span>
                    )}
                    {p.parceiroNome && <span>🤝 {p.parceiroNome}</span>}
                    {p.csat !== null && (
                      <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                        <Star size={12} /> {p.csat.toFixed(1)}
                      </span>
                    )}
                    {p.vendaId && <Badge variant="secondary" className="text-[10px]">Vendida VPNeg</Badge>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => abrirEdicao(p)}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deletePauta(p.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de momento/pauta */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar momento' : form.vendaId ? 'Alocar pauta vendida na grade' : 'Adicionar momento à grade'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Tipo de momento</Label>
                <Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v as TipoMomento })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TIPO_MOMENTO_LABELS).map(([k, label]) => (
                      <SelectItem key={k} value={k}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Temática macro</Label>
                <Select value={form.tematicaMacro} onValueChange={v => setForm({ ...form, tematicaMacro: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {TEMATICAS_MACRO.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Pauta específica (título / direcionamento)</Label>
              <Input
                value={form.titulo}
                onChange={e => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex.: Liderança de times de alta performance"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Dia</Label>
                <Input type="date" value={form.dia} onChange={e => setForm({ ...form, dia: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Horário</Label>
                <Input value={form.horario} onChange={e => setForm({ ...form, horario: e.target.value })} placeholder="Ex.: 14h às 15h30" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Quem ministra</Label>
                <Select value={form.ministranteTipo} onValueChange={v => setForm({ ...form, ministranteTipo: v as MinistranteTipo })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(MINISTRANTE_TIPO_LABELS).map(([k, label]) => (
                      <SelectItem key={k} value={k}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Nome do ministrante</Label>
                <Input value={form.ministranteNome} onChange={e => setForm({ ...form, ministranteNome: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Parceiro (se houver)</Label>
                <Input value={form.parceiroNome} onChange={e => setForm({ ...form, parceiroNome: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">CSAT da pauta (0 a 5)</Label>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={form.csat}
                  onChange={e => setForm({ ...form, csat: e.target.value })}
                  placeholder="Ex.: 4.5"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={salvar}>{editando ? 'Salvar alterações' : 'Adicionar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradeConteudoSection;
