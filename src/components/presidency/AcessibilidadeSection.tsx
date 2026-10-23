import { useMemo, useState } from 'react';
import { Plus, Loader2, Trash2, Bus, Handshake, Users, TrendingDown, DollarSign } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useAcessibilidade, Caravana, AbatimentoPF } from '@/hooks/useAcessibilidade';
import { useEJs } from '@/hooks/useEJs';
import { REGIOES } from '@/data/mockData';
import type { PresidenciaEvento } from '@/hooks/usePresidenciaEventos';

interface AcessibilidadeSectionProps {
  eventos: PresidenciaEvento[];
}

const fmtBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const AcessibilidadeSection = ({ eventos }: AcessibilidadeSectionProps) => {
  const { caravanas, abatimentos, loading, addCaravana, deleteCaravana, addAbatimento, deleteAbatimento } =
    useAcessibilidade();
  const { ejs } = useEJs();

  const [modalCaravana, setModalCaravana] = useState(false);
  const [modalAbatimento, setModalAbatimento] = useState(false);
  const [excluindoCaravana, setExcluindoCaravana] = useState<Caravana | null>(null);
  const [excluindoAbatimento, setExcluindoAbatimento] = useState<AbatimentoPF | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [recorte, setRecorte] = useState<'regiao' | 'ies' | 'ej'>('regiao');

  // Form caravana
  const [cEventoId, setCEventoId] = useState('');
  const [cEjId, setCEjId] = useState('');
  const [cIes, setCIes] = useState('');
  const [cRegiao, setCRegiao] = useState('');
  const [cPessoas, setCPessoas] = useState('');
  const [cValorMedio, setCValorMedio] = useState('');

  // Form abatimento
  const [aEventoId, setAEventoId] = useState('');
  const [aItem, setAItem] = useState('');
  const [aParceiro, setAParceiro] = useState('');
  const [aValor, setAValor] = useState('');

  const nomeEvento = (id: string) => eventos.find((e) => e.id === id)?.nomeEvento ?? 'Evento';

  const totalPessoas = useMemo(() => caravanas.reduce((s, c) => s + c.numPessoas, 0), [caravanas]);
  const receitaIngressos = useMemo(
    () => caravanas.reduce((s, c) => s + c.numPessoas * c.valorMedioIngresso, 0),
    [caravanas]
  );
  const economiaParceiros = useMemo(() => abatimentos.reduce((s, a) => s + a.valor, 0), [abatimentos]);

  const recortes = useMemo(() => {
    const map = new Map<string, { pessoas: number; receita: number; caravanas: number }>();
    for (const c of caravanas) {
      const chave =
        recorte === 'regiao'
          ? c.regiao || 'Sem região'
          : recorte === 'ies'
            ? c.ies || 'Sem IES'
            : c.ejNome || 'Sem EJ';
      const atual = map.get(chave) ?? { pessoas: 0, receita: 0, caravanas: 0 };
      atual.pessoas += c.numPessoas;
      atual.receita += c.numPessoas * c.valorMedioIngresso;
      atual.caravanas += 1;
      map.set(chave, atual);
    }
    return Array.from(map.entries())
      .map(([nome, dados]) => ({ nome, ...dados }))
      .sort((a, b) => b.pessoas - a.pessoas);
  }, [caravanas, recorte]);

  const abrirCaravana = () => {
    setCEventoId(eventos[0]?.id ?? '');
    setCEjId('');
    setCIes('');
    setCRegiao('');
    setCPessoas('');
    setCValorMedio('');
    setModalCaravana(true);
  };

  const abrirAbatimento = () => {
    setAEventoId(eventos[0]?.id ?? '');
    setAItem('');
    setAParceiro('');
    setAValor('');
    setModalAbatimento(true);
  };

  const handleSalvarCaravana = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cEventoId) return;
    setSalvando(true);
    try {
      await addCaravana({
        eventoId: cEventoId,
        ejId: cEjId || null,
        ies: cIes || null,
        regiao: cRegiao || null,
        numPessoas: parseInt(cPessoas, 10) || 0,
        valorMedioIngresso: parseFloat(cValorMedio.replace(',', '.')) || 0,
      });
      setModalCaravana(false);
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvarAbatimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aEventoId || !aItem) return;
    setSalvando(true);
    try {
      await addAbatimento({
        eventoId: aEventoId,
        item: aItem,
        parceiroNome: aParceiro || null,
        valor: parseFloat(aValor.replace(',', '.')) || 0,
      });
      setModalAbatimento(false);
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
    <div className="space-y-8">
      {/* Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users size={14} />
            <p className="text-xs font-bold uppercase tracking-wider">Pessoas em caravanas</p>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-1">{totalPessoas}</p>
        </div>
        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign size={14} />
            <p className="text-xs font-bold uppercase tracking-wider">Receita de ingressos</p>
          </div>
          <p className="text-2xl font-extrabold text-primary mt-1">{fmtBRL(receitaIngressos)}</p>
          <p className="text-xs text-muted-foreground mt-1">Σ pessoas × valor médio do ingresso</p>
        </div>
        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingDown size={14} />
            <p className="text-xs font-bold uppercase tracking-wider">Economia via parceiros</p>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-1">{fmtBRL(economiaParceiros)}</p>
          <p className="text-xs text-muted-foreground mt-1">Itens do PF abatidos por parceiros</p>
        </div>
      </div>

      {/* Caravanas */}
      <div className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Bus size={18} className="text-primary" /> Caravanas
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(['regiao', 'ies', 'ej'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRecorte(r)}
                  className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                    recorte === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {r === 'regiao' ? 'Por região' : r === 'ies' ? 'Por IES' : 'Por EJ'}
                </button>
              ))}
            </div>
            <button onClick={abrirCaravana} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Registrar caravana
            </button>
          </div>
        </div>

        {/* Recortes */}
        {recortes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recortes.map((r) => (
              <div key={r.nome} className="card-elevated p-4">
                <p className="font-bold text-foreground truncate">{r.nome}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-muted-foreground">{r.pessoas} pessoas</span>
                  <span className="font-semibold text-foreground">{fmtBRL(r.receita)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{r.caravanas} caravana(s)</p>
              </div>
            ))}
          </div>
        )}

        {caravanas.length === 0 ? (
          <div className="card-elevated p-10 text-center text-muted-foreground">
            Nenhuma caravana registrada ainda.
          </div>
        ) : (
          <div className="card-elevated divide-y divide-border">
            {caravanas.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-4 py-3 flex-wrap">
                <div className="grow min-w-0">
                  <p className="font-semibold text-foreground">
                    {c.ejNome ?? 'Caravana'} → {nomeEvento(c.eventoId)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[c.ies, c.regiao].filter(Boolean).join(' · ') || 'Sem origem informada'}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {c.numPessoas} pessoas × {fmtBRL(c.valorMedioIngresso)}
                </div>
                <div className="text-sm font-bold text-foreground whitespace-nowrap">
                  {fmtBRL(c.numPessoas * c.valorMedioIngresso)}
                </div>
                <button
                  onClick={() => setExcluindoCaravana(c)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Abatimentos do PF */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Handshake size={18} className="text-primary" /> Itens do PF abatidos por parceiros
          </h3>
          <button onClick={abrirAbatimento} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Registrar abatimento
          </button>
        </div>

        {abatimentos.length === 0 ? (
          <div className="card-elevated p-10 text-center text-muted-foreground">
            Nenhum abatimento registrado ainda.
          </div>
        ) : (
          <div className="card-elevated divide-y divide-border">
            {abatimentos.map((a) => (
              <div key={a.id} className="flex items-center gap-4 px-4 py-3 flex-wrap">
                <div className="grow min-w-0">
                  <p className="font-semibold text-foreground">{a.item}</p>
                  <p className="text-xs text-muted-foreground">
                    {nomeEvento(a.eventoId)}
                    {a.parceiroNome ? ` · Parceiro: ${a.parceiroNome}` : ''}
                  </p>
                </div>
                <div className="text-sm font-bold text-foreground whitespace-nowrap">{fmtBRL(a.valor)}</div>
                <button
                  onClick={() => setExcluindoAbatimento(a)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal caravana */}
      {modalCaravana && (
        <Modal title="Registrar caravana" onClose={() => setModalCaravana(false)}>
          <form onSubmit={handleSalvarCaravana} className="space-y-4">
            <div>
              <label className="label-sm">Evento de destino</label>
              <select value={cEventoId} onChange={(e) => setCEventoId(e.target.value)} className="input-field">
                <option value="">Selecione o evento...</option>
                {eventos.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.nomeEvento}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-sm">EJ de origem</label>
              <select
                value={cEjId}
                onChange={(e) => {
                  setCEjId(e.target.value);
                  const ej = ejs.find((x) => x.id === e.target.value);
                  if (ej) {
                    setCRegiao(ej.regiao ?? '');
                  }
                }}
                className="input-field"
              >
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
                <label className="label-sm">IES</label>
                <input
                  type="text"
                  value={cIes}
                  onChange={(e) => setCIes(e.target.value)}
                  className="input-field"
                  placeholder="UFRJ, PUC-Rio..."
                />
              </div>
              <div>
                <label className="label-sm">Região</label>
                <select value={cRegiao} onChange={(e) => setCRegiao(e.target.value)} className="input-field">
                  <option value="">Selecione...</option>
                  {REGIOES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-sm">Nº de pessoas</label>
                <input
                  type="number"
                  min="0"
                  value={cPessoas}
                  onChange={(e) => setCPessoas(e.target.value)}
                  className="input-field"
                  placeholder="40"
                />
              </div>
              <div>
                <label className="label-sm">Valor médio do ingresso (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={cValorMedio}
                  onChange={(e) => setCValorMedio(e.target.value)}
                  className="input-field"
                  placeholder="150,00"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalCaravana(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={salvando} className="btn-primary flex items-center gap-2">
                {salvando && <Loader2 size={14} className="animate-spin" />}
                Registrar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal abatimento */}
      {modalAbatimento && (
        <Modal title="Registrar abatimento do PF" onClose={() => setModalAbatimento(false)}>
          <form onSubmit={handleSalvarAbatimento} className="space-y-4">
            <div>
              <label className="label-sm">Evento</label>
              <select value={aEventoId} onChange={(e) => setAEventoId(e.target.value)} className="input-field">
                <option value="">Selecione o evento...</option>
                {eventos.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.nomeEvento}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-sm">Item do planejamento financeiro</label>
              <input
                type="text"
                value={aItem}
                onChange={(e) => setAItem(e.target.value)}
                className="input-field"
                placeholder="Coffee break, camisetas, espaço..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-sm">Parceiro</label>
                <input
                  type="text"
                  value={aParceiro}
                  onChange={(e) => setAParceiro(e.target.value)}
                  className="input-field"
                  placeholder="Nome do parceiro"
                />
              </div>
              <div>
                <label className="label-sm">Valor abatido (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={aValor}
                  onChange={(e) => setAValor(e.target.value)}
                  className="input-field"
                  placeholder="2000,00"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalAbatimento(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={salvando} className="btn-primary flex items-center gap-2">
                {salvando && <Loader2 size={14} className="animate-spin" />}
                Registrar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirmações */}
      {excluindoCaravana && (
        <ConfirmModal
          title="Excluir caravana"
          message={`Isso excluirá o registro da caravana de ${excluindoCaravana.ejNome ?? 'origem não informada'}.`}
          onCancel={() => setExcluindoCaravana(null)}
          onConfirm={async () => {
            await deleteCaravana(excluindoCaravana.id);
            setExcluindoCaravana(null);
          }}
        />
      )}
      {excluindoAbatimento && (
        <ConfirmModal
          title="Excluir abatimento"
          message={`Isso excluirá o abatimento "${excluindoAbatimento.item}" (${fmtBRL(excluindoAbatimento.valor)}).`}
          onCancel={() => setExcluindoAbatimento(null)}
          onConfirm={async () => {
            await deleteAbatimento(excluindoAbatimento.id);
            setExcluindoAbatimento(null);
          }}
        />
      )}
    </div>
  );
};

export default AcessibilidadeSection;
