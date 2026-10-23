import { useMemo, useState } from 'react';
import { Plus, Loader2, Trash2, MapPin, Clock, CheckCircle2, XCircle, CircleDot, CalendarCheck } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useVisitasGuardioes, VisitaGuardiao, StatusVisita } from '@/hooks/useVisitasGuardioes';
import { useEJs } from '@/hooks/useEJs';

interface VisitasGuardioesSectionProps {
  selectedYear: number;
  modo: 'ddr' | 'op';
}

const fmtBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtData = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');

const STATUS_CONFIG: Record<StatusVisita, { label: string; classes: string; icon: typeof CircleDot }> = {
  solicitada: { label: 'Solicitada', classes: 'bg-secondary text-secondary-foreground', icon: CircleDot },
  aprovada: { label: 'Aprovada', classes: 'bg-primary/15 text-primary', icon: CalendarCheck },
  realizada: { label: 'Realizada', classes: 'bg-accent/20 text-accent-foreground', icon: CheckCircle2 },
  cancelada: { label: 'Cancelada', classes: 'bg-destructive/10 text-destructive', icon: XCircle },
};

const VisitasGuardioesSection = ({ selectedYear, modo }: VisitasGuardioesSectionProps) => {
  const { visitas, loading, solicitarVisita, atualizarVisita, excluirVisita } = useVisitasGuardioes(selectedYear);
  const { ejs } = useEJs();

  const [modalAberto, setModalAberto] = useState(false);
  const [excluindo, setExcluindo] = useState<VisitaGuardiao | null>(null);
  const [editandoGasto, setEditandoGasto] = useState<VisitaGuardiao | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Form de solicitação
  const [formEjId, setFormEjId] = useState('');
  const [formData, setFormData] = useState('');
  const [formHorario, setFormHorario] = useState('');
  const [formLocal, setFormLocal] = useState('');
  const [formMotivo, setFormMotivo] = useState('');

  // Form de gasto (OP)
  const [formGasto, setFormGasto] = useState('');
  const [formObs, setFormObs] = useState('');

  const totalGastos = useMemo(
    () => visitas.reduce((s, v) => s + (v.gasto ?? 0), 0),
    [visitas]
  );
  const realizadas = useMemo(() => visitas.filter((v) => v.status === 'realizada').length, [visitas]);

  const abrirModal = () => {
    setFormEjId('');
    setFormData('');
    setFormHorario('');
    setFormLocal('');
    setFormMotivo('');
    setModalAberto(true);
  };

  const handleSolicitar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEjId || !formData) return;
    setSalvando(true);
    try {
      await solicitarVisita({
        ejId: formEjId,
        data: formData,
        horario: formHorario || undefined,
        local: formLocal || undefined,
        motivo: formMotivo || undefined,
      });
      setModalAberto(false);
    } finally {
      setSalvando(false);
    }
  };

  const abrirGasto = (v: VisitaGuardiao) => {
    setFormGasto(v.gasto != null ? String(v.gasto) : '');
    setFormObs(v.observacoes ?? '');
    setEditandoGasto(v);
  };

  const handleSalvarGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoGasto) return;
    setSalvando(true);
    try {
      await atualizarVisita(editandoGasto.id, {
        gasto: formGasto ? parseFloat(formGasto.replace(',', '.')) : null,
        observacoes: formObs || null,
      });
      setEditandoGasto(null);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-elevated p-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Visitas em {selectedYear}</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{visitas.length}</p>
        </div>
        <div className="card-elevated p-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Realizadas</p>
          <p className="text-2xl font-extrabold text-primary mt-1">{realizadas}</p>
        </div>
        <div className="card-elevated p-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gastos com visitas</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{fmtBRL(totalGastos)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-foreground">
          {modo === 'ddr' ? 'Solicitações de visita' : 'Visitas e gastos'}
        </h3>
        <button onClick={abrirModal} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Solicitar visita
        </button>
      </div>

      {visitas.length === 0 ? (
        <div className="card-elevated p-10 text-center text-muted-foreground">
          Nenhuma visita dos guardiões registrada em {selectedYear}.
        </div>
      ) : (
        <div className="space-y-3">
          {visitas.map((v) => {
            const cfg = STATUS_CONFIG[v.status] ?? STATUS_CONFIG.solicitada;
            const Icon = cfg.icon;
            return (
              <div key={v.id} className="card-elevated p-4">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="grow min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground">{v.ejNome}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.classes}`}>
                        <Icon size={11} /> {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <CalendarCheck size={13} /> {fmtData(v.data)}
                      </span>
                      {v.horario && (
                        <span className="inline-flex items-center gap-1">
                          <Clock size={13} /> {v.horario}
                        </span>
                      )}
                      {v.local && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} /> {v.local}
                        </span>
                      )}
                    </div>
                    {v.motivo && <p className="text-sm text-muted-foreground">{v.motivo}</p>}
                    {v.observacoes && (
                      <p className="text-xs text-muted-foreground italic">Obs: {v.observacoes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {v.gasto != null && (
                      <span className="text-sm font-bold text-foreground">{fmtBRL(v.gasto)}</span>
                    )}

                    {modo === 'op' && (
                      <>
                        {v.status === 'solicitada' && (
                          <button
                            onClick={() => atualizarVisita(v.id, { status: 'aprovada' })}
                            className="btn-secondary text-xs py-1.5"
                          >
                            Aprovar
                          </button>
                        )}
                        {(v.status === 'aprovada' || v.status === 'solicitada') && (
                          <button
                            onClick={() => atualizarVisita(v.id, { status: 'realizada' })}
                            className="btn-primary text-xs py-1.5"
                          >
                            Marcar realizada
                          </button>
                        )}
                        <button onClick={() => abrirGasto(v)} className="btn-secondary text-xs py-1.5">
                          Gasto
                        </button>
                        {v.status !== 'cancelada' && v.status !== 'realizada' && (
                          <button
                            onClick={() => atualizarVisita(v.id, { status: 'cancelada' })}
                            className="text-xs py-1.5 px-3 rounded-lg font-bold text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                      </>
                    )}

                    <button
                      onClick={() => setExcluindo(v)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de solicitação */}
      {modalAberto && (
        <Modal title="Solicitar visita dos guardiões" onClose={() => setModalAberto(false)}>
          <form onSubmit={handleSolicitar} className="space-y-4">
            <div>
              <label className="label-sm">Empresa Júnior</label>
              <select value={formEjId} onChange={(e) => setFormEjId(e.target.value)} className="input-field">
                <option value="">Selecione a EJ...</option>
                {ejs.map((ej) => (
                  <option key={ej.id} value={ej.id}>
                    {ej.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-sm">Data</label>
                <input
                  type="date"
                  value={formData}
                  onChange={(e) => setFormData(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-sm">Horário</label>
                <input
                  type="time"
                  value={formHorario}
                  onChange={(e) => setFormHorario(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="label-sm">Local</label>
              <input
                type="text"
                value={formLocal}
                onChange={(e) => setFormLocal(e.target.value)}
                className="input-field"
                placeholder="Sede da EJ, campus..."
              />
            </div>
            <div>
              <label className="label-sm">Motivo</label>
              <textarea
                value={formMotivo}
                onChange={(e) => setFormMotivo(e.target.value)}
                className="input-field min-h-[80px]"
                placeholder="Por que a EJ precisa da visita?"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalAberto(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={salvando} className="btn-primary flex items-center gap-2">
                {salvando && <Loader2 size={14} className="animate-spin" />}
                Solicitar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de gasto (OP) */}
      {editandoGasto && (
        <Modal title={`Gasto da visita — ${editandoGasto.ejNome}`} onClose={() => setEditandoGasto(null)}>
          <form onSubmit={handleSalvarGasto} className="space-y-4">
            <div>
              <label className="label-sm">Gasto total (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formGasto}
                onChange={(e) => setFormGasto(e.target.value)}
                className="input-field"
                placeholder="350,00"
              />
            </div>
            <div>
              <label className="label-sm">Observações</label>
              <textarea
                value={formObs}
                onChange={(e) => setFormObs(e.target.value)}
                className="input-field min-h-[80px]"
                placeholder="Transporte, hospedagem, alimentação..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditandoGasto(null)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={salvando} className="btn-primary flex items-center gap-2">
                {salvando && <Loader2 size={14} className="animate-spin" />}
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirmação de exclusão */}
      {excluindo && (
        <ConfirmModal
          title="Excluir solicitação"
          message={`Isso excluirá a solicitação de visita de ${excluindo.ejNome} em ${fmtData(excluindo.data)}.`}
          onCancel={() => setExcluindo(null)}
          onConfirm={async () => {
            await excluirVisita(excluindo.id);
            setExcluindo(null);
          }}
        />
      )}
    </div>
  );
};

export default VisitasGuardioesSection;
