import { useEffect, useRef, useState } from 'react';
import Spreadsheet, { type Point, type CellBase, type Matrix } from 'react-spreadsheet';
import { Plus, Copy, Trash2, Save, Undo2, Redo2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { createPage, duplicatePage, insertColumn, insertRow, normalizeData, type GradePage } from '@/lib/contentWorkbook';
import { TIPO_MOMENTO_LABELS, type PautaEvento } from '@/hooks/useGradeConteudo';

interface Props { eventoId: string; pautas: PautaEvento[] }

export default function GradeLivreEditor({ eventoId, pautas }: Props) {
  const { roles } = useAuth();
  const canEdit = roles.includes('admin') || roles.includes('time_riojunior');
  const [pages, setPages] = useState<GradePage[]>([]);
  const [activeId, setActiveId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [point, setPoint] = useState<Point>({ row: 0, column: 0 });
  const [past, setPast] = useState<GradePage[][]>([]);
  const [future, setFuture] = useState<GradePage[][]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const revision = useRef(0);
  const active = pages.find(page => page.id === activeId) ?? pages[0];

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error: loadError } = await supabase.from('grades_livres').select('paginas').eq('evento_id', eventoId).maybeSingle();
      if (cancelled) return;
      if (loadError) { setError(true); setLoading(false); return; }
      const stored = data?.paginas as unknown as GradePage[] | undefined;
      const initial = stored?.length ? stored : [createPage()];
      setPages(initial); setActiveId(initial[0].id); setLoading(false);
    };
    void load();
    return () => { cancelled = true; };
  }, [eventoId]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const change = (next: GradePage[]) => {
    if (!canEdit) return;
    setPast(history => [...history.slice(-49), structuredClone(pages)]);
    setFuture([]); setPages(next); setDirty(true); revision.current += 1;
  };
  const changeData = (data: Matrix<CellBase>) => {
    if (active) change(pages.map(page => page.id === active.id ? { ...page, data: normalizeData(data) } : page));
  };
  const save = async () => {
    if (!canEdit || saving) return;
    setSaving(true);
    const currentRevision = revision.current;
    const { error: saveError } = await supabase.from('grades_livres').upsert({ evento_id: eventoId, paginas: JSON.parse(JSON.stringify(pages)) }, { onConflict: 'evento_id' });
    setSaving(false);
    if (saveError) { toast({ title: 'Não foi possível salvar a grade. Suas alterações continuam abertas.', variant: 'destructive' }); return; }
    if (revision.current === currentRevision) setDirty(false);
    toast({ title: 'Páginas da grade salvas!' });
  };
  const addPage = (copy = false) => {
    const page = copy && active ? duplicatePage(active) : createPage(`Página ${pages.length + 1}`);
    change([...pages, page]); setActiveId(page.id); setPoint({ row: 0, column: 0 });
  };
  const undo = () => {
    const previous = past[past.length - 1]; if (!previous) return;
    setFuture(history => [...history, pages]); setPages(previous); setPast(past.slice(0, -1)); setDirty(true); revision.current += 1;
  };
  const redo = () => {
    const next = future[future.length - 1]; if (!next) return;
    setPast(history => [...history, pages]); setPages(next); setFuture(future.slice(0, -1)); setDirty(true); revision.current += 1;
  };
  const importMoments = () => {
    const page = createPage('Momentos cadastrados', ['Dia', 'Horário', 'Tipo de atividade', 'Descrição / tema', 'Temática', 'Palestrante', 'Parceiro', 'CSAT', 'Venda VPNeg']);
    page.data = [page.data[0], ...pautas.map(p => [p.dia ?? '', p.horario, TIPO_MOMENTO_LABELS[p.tipo], p.titulo, p.tematicaMacro, p.ministranteNome, p.parceiroNome, p.csat === null ? '' : String(p.csat), p.vendaId ? 'Vendida VPNeg' : ''].map(value => ({ value })))];
    change([...pages, page]); setActiveId(page.id);
  };
  const tool = (label: string, icon: React.ReactNode, action: () => void, disabled = false) => (
    <Tooltip><TooltipTrigger asChild><Button aria-label={label} variant="ghost" size="icon" onClick={action} disabled={disabled || !canEdit}>{icon}</Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>
  );

  if (loading) return <p className="py-8 text-muted-foreground">Carregando páginas...</p>;
  if (error) return <p className="py-8 text-destructive">Não foi possível carregar as páginas. Atualize a página para tentar novamente.</p>;
  if (!active) return null;

  return <section className="space-y-3 min-w-0" aria-label="Grade livre">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Input aria-label="Nome da página" className="w-64 font-semibold" value={active.name} disabled={!canEdit} onChange={e => change(pages.map(p => p.id === active.id ? { ...p, name: e.target.value } : p))} />
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground" role="status">{saving ? 'Salvando…' : dirty ? 'Alterações não salvas' : 'Sem alterações pendentes'}</span>
        <Button size="sm" onClick={save} disabled={!canEdit || saving}><Save size={14} className="mr-2" />Salvar grade</Button>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-1 border-y border-border py-2">
      {tool('Desfazer', <Undo2 size={16} />, undo, past.length === 0)}
      {tool('Refazer', <Redo2 size={16} />, redo, future.length === 0)}
      <span className="mx-2 h-6 border-l border-border" />
      {tool('Inserir linha acima', <ArrowUp size={16} />, () => changeData(insertRow(active.data, point.row)))}
      {tool('Inserir linha abaixo', <ArrowDown size={16} />, () => changeData(insertRow(active.data, point.row + 1)))}
      {tool('Inserir coluna à esquerda', <ArrowLeft size={16} />, () => changeData(insertColumn(active.data, point.column)))}
      {tool('Inserir coluna à direita', <ArrowRight size={16} />, () => changeData(insertColumn(active.data, point.column + 1)))}
      <Button size="sm" variant="outline" disabled={!canEdit} onClick={() => changeData(insertRow(active.data, active.data.length))}><Plus size={14} className="mr-1" />Linha</Button>
      <Button size="sm" variant="outline" disabled={!canEdit} onClick={() => changeData(insertColumn(active.data, active.data[0]?.length ?? 0))}><Plus size={14} className="mr-1" />Coluna</Button>
      <Button size="sm" variant="ghost" disabled={!canEdit || active.data.length <= 1} onClick={() => changeData(active.data.filter((_, row) => row !== point.row))}>Excluir linha</Button>
      <Button size="sm" variant="ghost" disabled={!canEdit || (active.data[0]?.length ?? 0) <= 1} onClick={() => changeData(active.data.map(row => row.filter((_, col) => col !== point.column)))}>Excluir coluna</Button>
      <span className="ml-auto text-xs text-muted-foreground">{active.data.length} linhas · {active.data[0]?.length ?? 0} colunas</span>
    </div>
    <div className="grade-sheet overflow-auto max-h-[65vh] border border-border rounded-md">
      <Spreadsheet key={active.id} data={canEdit ? active.data : active.data.map(row => row.map(cell => ({ ...cell, readOnly: true })))} onChange={changeData} onActivate={setPoint} />
    </div>
    <div className="flex flex-wrap items-center gap-1 border-b border-border pb-3">
      {pages.map(page => <Button key={page.id} size="sm" variant={page.id === active.id ? 'secondary' : 'ghost'} onClick={() => { setActiveId(page.id); setPoint({ row: 0, column: 0 }); }} className="max-w-64 truncate">{page.name || 'Sem título'}</Button>)}
      {tool('Nova página', <Plus size={16} />, () => addPage())}
      {tool('Duplicar página', <Copy size={16} />, () => addPage(true))}
      {tool('Excluir página', <Trash2 size={16} />, () => setDeleteOpen(true), pages.length <= 1)}
      {pautas.length > 0 && <Button size="sm" variant="outline" disabled={!canEdit} onClick={importMoments}>Copiar momentos cadastrados</Button>}
    </div>
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}><DialogContent><DialogHeader><DialogTitle>Excluir “{active.name}”?</DialogTitle></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button><Button variant="destructive" onClick={() => { const next = pages.filter(p => p.id !== active.id); change(next); setActiveId(next[0]?.id ?? ''); setDeleteOpen(false); }}>Excluir página</Button></DialogFooter></DialogContent></Dialog>
  </section>;
}