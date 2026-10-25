import { useState, useMemo } from 'react';
import { Briefcase, Plus, Trash2, CalendarRange, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEventos } from '@/hooks/useEventos';
import { useGradeConteudo } from '@/hooks/useGradeConteudo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BusinessViewProps {
  selectedYear: number;
}

const BusinessView = ({ selectedYear }: BusinessViewProps) => {
  const { eventos, loading: eventosLoading } = useEventos();
  const { pautas, vendas, loading, getConfig, registrarVenda, deleteVenda } = useGradeConteudo();

  const eventosAno = useMemo(
    () => eventos.filter(e => new Date(e.dataInicio + 'T12:00:00').getFullYear() === selectedYear),
    [eventos, selectedYear]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ eventoId: '', tipo: 'magna' as 'magna' | 'paralela', parceiroNome: '', valor: '' });

  const abrirModal = (eventoId?: string) => {
    setForm({ eventoId: eventoId || eventosAno[0]?.id || '', tipo: 'magna', parceiroNome: '', valor: '' });
    setModalOpen(true);
  };

  const salvar = async () => {
    if (!form.eventoId || !form.parceiroNome.trim()) return;
    await registrarVenda(form.eventoId, form.tipo, form.parceiroNome.trim(), form.valor !== '' ? Number(form.valor) : null);
    setModalOpen(false);
  };

  const totalVendido = vendas
    .filter(v => eventosAno.some(e => e.id === v.eventoId))
    .reduce((acc, v) => acc + (v.valor || 0), 0);

  if (eventosLoading || loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando painel de negócios...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Briefcase className="text-primary" size={22} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">VP de Negócios</h1>
          <p className="text-sm text-muted-foreground">
            Venda de pautas dos eventos — cotas sincronizadas com a grade da Formação Empreendedora
          </p>
        </div>
        <Button size="sm" onClick={() => abrirModal()} disabled={eventosAno.length === 0}>
          <Plus size={14} className="mr-1" /> Registrar venda
        </Button>
      </div>

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
            <p className="text-2xl font-bold text-foreground">
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

      {/* Cotas por evento */}
      {eventosAno.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <CalendarRange size={40} className="mx-auto mb-3 opacity-40" />
            <p>Nenhum evento cadastrado em {selectedYear}.</p>
            <p className="text-sm">As cotas de pautas vendáveis aparecem aqui quando a Formação Empreendedora definir a grade de cada evento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {eventosAno.map(e => {
            const config = getConfig(e.id);
            const vendasEvento = vendas.filter(v => v.eventoId === e.id);
            const vendidasMagnas = vendasEvento.filter(v => v.tipo === 'magna').length;
            const vendidasParalelas = vendasEvento.filter(v => v.tipo === 'paralela').length;
            
            // Cotas totais (sempre pelo menos a quantidade de pautas existentes na grade)
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
                  <Button size="sm" variant="outline" onClick={() => abrirModal(e.id)}>
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

      {/* Modal de venda de pauta */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar venda de pauta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Evento</Label>
              <Select value={form.eventoId} onValueChange={v => setForm({ ...form, eventoId: v })}>
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
              <Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v as 'magna' | 'paralela' })}>
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
                value={form.parceiroNome}
                onChange={e => setForm({ ...form, parceiroNome: e.target.value })}
                placeholder="Ex.: Stone, Falconi, Ambev..."
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Valor da cota (R$)</Label>
              <Input
                type="number"
                min={0}
                step={100}
                value={form.valor}
                onChange={e => setForm({ ...form, valor: e.target.value })}
                placeholder="Ex.: 5000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={salvar} disabled={!form.parceiroNome.trim()}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessView;
