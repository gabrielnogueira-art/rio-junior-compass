import { useMemo, useState } from 'react';
import { Plus, Loader2, Trash2, Check, Undo2, HandHeart, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useAnuidades, AnuidadeResumoEJ, AnuidadeParcela } from '@/hooks/useAnuidades';
import { useEJs } from '@/hooks/useEJs';

interface AnuidadesSectionProps {
  selectedYear: number;
}

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const fmtData = (d: string | null) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR') : '—';

const AnuidadesSection = ({ selectedYear }: AnuidadesSectionProps) => {
  const { parcelas, loading, criarAnuidade, marcarPaga, desmarcarPaga, toggleSuporte, excluirAnuidade } =
    useAnuidades(selectedYear);
  const { ejs } = useEJs();

  const [modalAberto, setModalAberto] = useState(false);
  const [excluindo, setExcluindo] = useState<AnuidadeResumoEJ | null>(null);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Form state
  const [formEjId, setFormEjId] = useState('');
  const [formValor, setFormValor] = useState('');
  const [formParcelas, setFormParcelas] = useState('');
  const [formVencimento, setFormVencimento] = useState('');
  const [formSuporte, setFormSuporte] = useState(false);

  const resumos = useMemo<AnuidadeResumoEJ[]>(() => {
    const map = new Map<string, AnuidadeResumoEJ>();
    for (const p of parcelas) {
      const key = `${p.ejId}-${p.ano}`;
      const atual = map.get(key) ?? {
        ejId: p.ejId,
        ejNome: p.ejNome ?? 'EJ',
        ano: p.ano,
        valorTotal: 0,
        totalParcelas: 0,
        parcelasPagas: 0,
        valorPago: 0,
        suporteAnuidade: p.suporteAnuidade,
        parcelas: [],
      };
      atual.valorTotal += p.valor;
      atual.totalParcelas += 1;
      if (p.status === 'paga') {
        atual.parcelasPagas += 1;
        atual.valorPago += p.valor;
      }
      atual.suporteAnuidade = atual.suporteAnuidade || p.suporteAnuidade;
      atual.parcelas.push(p);
      map.set(key, atual);
    }
    return Array.from(map.values()).sort((a, b) => a.ejNome.localeCompare(b.ejNome));
  }, [parcelas]);

  const totais = useMemo(() => {
    const esperado = resumos.reduce((s, r) => s + r.valorTotal, 0);
    const recebido = resumos.reduce((s, r) => s + r.valorPago, 0);
    return { esperado, recebido };
  }, [resumos]);

  const ejsSemAnuidade = useMemo(
    () => ejs.filter((ej) => !resumos.some((r) => r.ejId === ej.id)),
    [ejs, resumos]
  );

  const abrirModal = () => {
    setFormEjId('');
    setFormValor('');
    setFormParcelas('');
    setFormVencimento(`${selectedYear}-02-10`);
    setFormSuporte(false);
    setModalAberto(true);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEjId) return;
    const valorTotal = parseFloat(formValor.replace(',', '.')) || 0;
    const totalParcelas = parseInt(formParcelas, 10) || 1;
    if (valorTotal <= 0 || totalParcelas < 1 || !formVencimento) return;
    setSalvando(true);
    try {
      await criarAnuidade({
        ejId: formEjId,
        ano: selectedYear,
        valorTotal,
        totalParcelas,
        primeiroVencimento: formVencimento,
        suporteAnuidade: formSuporte,
      });
      setModalAberto(false);
    } finally {
      setSalvando(false);
    }
  };

  const handleToggleParcela = async (p: AnuidadeParcela) => {
    if (p.status === 'paga') {
      await desmarcarPaga(p.id);
    } else {
      await marcarPaga(p.id, new Date().toISOString().slice(0, 10));
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
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Previsto em {selectedYear}</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{fmtBRL(totais.esperado)}</p>
        </div>
        <div className="card-elevated p-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recebido</p>
          <p className="text-2xl font-extrabold text-primary mt-1">{fmtBRL(totais.recebido)}</p>
        </div>
        <div className="card-elevated p-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">EJs com anuidade</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{resumos.length}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-foreground">Anuidades por EJ</h3>
        <button onClick={abrirModal} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nova anuidade
        </button>
      </div>

      {resumos.length === 0 ? (
        <div className="card-elevated p-10 text-center text-muted-foreground">
          Nenhuma anuidade cadastrada para {selectedYear}. Clique em "Nova anuidade" para começar.
        </div>
      ) : (
        <div className="space-y-3">
          {resumos.map((r) => {
            const key = `${r.ejId}-${r.ano}`;
            const aberto = expandido === key;
            const progresso = r.totalParcelas > 0 ? (r.parcelasPagas / r.totalParcelas) * 100 : 0;
            return (
              <div key={key} className="card-elevated overflow-hidden">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/40 transition-colors"
                  onClick={() => setExpandido(aberto ? null : key)}
                >
                  <div className="grow min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground truncate">{r.ejNome}</span>
                      {r.suporteAnuidade && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">
                          <HandHeart size={11} /> Suporte à anuidade
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="h-2 grow max-w-xs bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${progresso}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-semibold whitespace-nowrap">
                        {r.parcelasPagas}/{r.totalParcelas} parcelas
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">{fmtBRL(r.valorPago)}</p>
                    <p className="text-xs text-muted-foreground">de {fmtBRL(r.valorTotal)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSuporte(r.ejId, r.ano, !r.suporteAnuidade);
                      }}
                      title={r.suporteAnuidade ? 'Remover suporte' : 'Ativar suporte à anuidade'}
                      className={`p-2 rounded-lg transition-colors ${
                        r.suporteAnuidade
                          ? 'text-accent bg-accent/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <HandHeart size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExcluindo(r);
                      }}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    {aberto ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </div>
                </div>

                {aberto && (
                  <div className="border-t border-border divide-y divide-border">
                    {r.parcelas.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <button
                          onClick={() => handleToggleParcela(p)}
                          className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            p.status === 'paga'
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {p.status === 'paga' && <Check size={13} />}
                        </button>
                        <span className="font-semibold text-foreground w-24">
                          Parcela {p.parcelaNumero ?? '—'}/{p.totalParcelas ?? r.totalParcelas}
                        </span>
                        <span className="text-muted-foreground">Vence {fmtData(p.dataVencimento)}</span>
                        <span className="grow" />
                        {p.status === 'paga' && (
                          <span className="text-xs text-primary font-semibold">Paga em {fmtData(p.dataPagamento)}</span>
                        )}
                        <span className="font-bold text-foreground">{fmtBRL(p.valor)}</span>
                        {p.status === 'paga' && (
                          <button
                            onClick={() => desmarcarPaga(p.id)}
                            title="Reverter para pendente"
                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <Undo2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal nova anuidade */}
      {modalAberto && (
        <Modal title={`Nova anuidade — ${selectedYear}`} onClose={() => setModalAberto(false)}>
          <form onSubmit={handleSalvar} className="space-y-4">
            <div>
              <label className="label-sm">Empresa Júnior</label>
              <select
                value={formEjId}
                onChange={(e) => setFormEjId(e.target.value)}
                className="input-field"
              >
                <option value="">Selecione a EJ...</option>
                {ejsSemAnuidade.map((ej) => (
                  <option key={ej.id} value={ej.id}>
                    {ej.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-sm">Valor total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formValor}
                  onChange={(e) => setFormValor(e.target.value)}
                  className="input-field"
                  placeholder="1200,00"
                />
              </div>
              <div>
                <label className="label-sm">Nº de parcelas</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={formParcelas}
                  onChange={(e) => setFormParcelas(e.target.value)}
                  className="input-field"
                  placeholder="10"
                />
              </div>
            </div>
            <div>
              <label className="label-sm">Vencimento da 1ª parcela</label>
              <input
                type="date"
                value={formVencimento}
                onChange={(e) => setFormVencimento(e.target.value)}
                className="input-field"
              />
              <p className="text-xs text-muted-foreground mt-1">
                As demais parcelas vencem no mesmo dia dos meses seguintes.
              </p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formSuporte}
                onChange={(e) => setFormSuporte(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-sm text-foreground">
                EJ com suporte à anuidade (facilitação/redução)
              </span>
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalAberto(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={salvando} className="btn-primary flex items-center gap-2">
                {salvando && <Loader2 size={14} className="animate-spin" />}
                Criar anuidade
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirmação de exclusão */}
      {excluindo && (
        <ConfirmModal
          title="Excluir anuidade"
          message={`Isso excluirá todas as ${excluindo.totalParcelas} parcelas da anuidade de ${excluindo.ejNome} em ${excluindo.ano}.`}
          onCancel={() => setExcluindo(null)}
          onConfirm={async () => {
            await excluirAnuidade(excluindo.ejId, excluindo.ano);
            setExcluindo(null);
          }}
        />
      )}
    </div>
  );
};

export default AnuidadesSection;
