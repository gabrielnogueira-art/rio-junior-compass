import { useEffect, useMemo, useState } from 'react';
import { Award, Loader2, Trash2, FileBadge, CheckCircle2, XCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import CertificadoEditor from '@/components/ddr/CertificadoEditor';
import AssinaturasSection from '@/components/ddr/AssinaturasSection';
import { useCertificados, Certificado } from '@/hooks/useCertificados';
import { useEventos } from '@/hooks/useEventos';
import { useEJs } from '@/hooks/useEJs';
import { supabase } from '@/integrations/supabase/client';

interface ReconhecimentoSectionProps {
  selectedYear: number;
}

const ReconhecimentoSection = ({ selectedYear }: ReconhecimentoSectionProps) => {
  const { certificados, assinaturas, loading, emitirCertificado, atualizarCertificado, excluirCertificado, salvarAssinatura } =
    useCertificados();
  const { eventos } = useEventos();
  const { ejs } = useEJs();

  const [eventoSelecionado, setEventoSelecionado] = useState('');
  const [editando, setEditando] = useState<Certificado | null>(null);
  const [excluindo, setExcluindo] = useState<Certificado | null>(null);
  const [emitindo, setEmitindo] = useState<string | null>(null); // `${ejId}-${indicador}`

  // Indicadores (documentos) e entregas para calcular EJs em dia
  const [indicadores, setIndicadores] = useState<{ id: string; nome: string }[]>([]);
  const [entregas, setEntregas] = useState<{ ej_id: string; documento_id: string; entregue: boolean }[]>([]);

  useEffect(() => {
    const carregar = async () => {
      const [{ data: docs }, { data: ents }] = await Promise.all([
        supabase.from('documentos').select('id, nome').order('etapa'),
        supabase.from('entregas_documentos').select('ej_id, documento_id, entregue'),
      ]);
      setIndicadores(docs || []);
      setEntregas(ents || []);
    };
    carregar();
  }, []);

  const eventosPalco = useMemo(
    () =>
      eventos.filter((ev) => {
        if (!ev.momentoPalco) return false;
        const ano = new Date(ev.dataInicio + 'T12:00:00').getFullYear();
        return ano === selectedYear;
      }),
    [eventos, selectedYear]
  );

  useEffect(() => {
    if (!eventoSelecionado && eventosPalco.length > 0) {
      setEventoSelecionado(eventosPalco[0].id);
    }
  }, [eventosPalco, eventoSelecionado]);

  /** EJ está em dia quando todos os indicadores têm entrega marcada */
  const ejsEmDia = useMemo(() => {
    if (indicadores.length === 0) return new Set<string>();
    const porEJ = new Map<string, Set<string>>();
    for (const ent of entregas) {
      if (!ent.entregue) continue;
      if (!porEJ.has(ent.ej_id)) porEJ.set(ent.ej_id, new Set());
      porEJ.get(ent.ej_id)!.add(ent.documento_id);
    }
    const emDia = new Set<string>();
    for (const ej of ejs) {
      const entregues = porEJ.get(ej.id);
      if (entregues && indicadores.every((ind) => entregues.has(ind.id))) {
        emDia.add(ej.id);
      }
    }
    return emDia;
  }, [ejs, entregas, indicadores]);

  const certificadosDoEvento = useMemo(
    () => certificados.filter((c) => c.eventoId === eventoSelecionado),
    [certificados, eventoSelecionado]
  );

  const jaEmitido = (ejId: string, indicador: string) =>
    certificadosDoEvento.some((c) => c.ejId === ejId && c.indicador === indicador);

  const handleEmitir = async (ejId: string, indicador: string) => {
    const chave = `${ejId}-${indicador}`;
    setEmitindo(chave);
    try {
      await emitirCertificado({ ejId, eventoId: eventoSelecionado, indicador });
    } finally {
      setEmitindo(null);
    }
  };

  const eventoAtual = eventosPalco.find((e) => e.id === eventoSelecionado);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Award size={18} className="text-primary" /> Reconhecimento de EJs
        </h3>
        <select
          value={eventoSelecionado}
          onChange={(e) => setEventoSelecionado(e.target.value)}
          className="input-field max-w-xs"
        >
          {eventosPalco.length === 0 && <option value="">Nenhum evento com momento de palco em {selectedYear}</option>}
          {eventosPalco.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.nome}
            </option>
          ))}
        </select>
      </div>

      {eventosPalco.length === 0 ? (
        <div className="card-elevated p-10 text-center text-muted-foreground">
          Nenhum evento com "momento de palco" em {selectedYear}. Marque essa opção ao criar o evento na
          Calendarização.
        </div>
      ) : (
        <>
          {/* EJs elegíveis × indicadores */}
          <div className="card-elevated p-5 space-y-4">
            <h4 className="font-bold text-foreground">EJs com indicadores em dia</h4>
            {indicadores.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum indicador cadastrado ainda — os indicadores são os documentos/etapas de acompanhamento das EJs.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-bold text-muted-foreground">EJ</th>
                      <th className="text-left py-2 pr-4 font-bold text-muted-foreground">Situação</th>
                      {indicadores.map((ind) => (
                        <th key={ind.id} className="text-center py-2 px-2 font-bold text-muted-foreground">
                          {ind.nome}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ejs.map((ej) => {
                      const emDia = ejsEmDia.has(ej.id);
                      return (
                        <tr key={ej.id} className={emDia ? '' : 'opacity-50'}>
                          <td className="py-2.5 pr-4 font-semibold text-foreground whitespace-nowrap">{ej.nome}</td>
                          <td className="py-2.5 pr-4">
                            {emDia ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                                <CheckCircle2 size={13} /> Em dia
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                                <XCircle size={13} /> Pendências
                              </span>
                            )}
                          </td>
                          {indicadores.map((ind) => {
                            const emitido = jaEmitido(ej.id, ind.nome);
                            const chave = `${ej.id}-${ind.nome}`;
                            return (
                              <td key={ind.id} className="py-2.5 px-2 text-center">
                                {emitido ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                                    <FileBadge size={13} /> Emitido
                                  </span>
                                ) : (
                                  <button
                                    disabled={!emDia || emitindo === chave}
                                    onClick={() => handleEmitir(ej.id, ind.nome)}
                                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
                                  >
                                    {emitindo === chave && <Loader2 size={11} className="animate-spin" />}
                                    Emitir
                                  </button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Certificados emitidos */}
          <div className="space-y-3">
            <h4 className="font-bold text-foreground">
              Certificados emitidos{eventoAtual ? ` — ${eventoAtual.nome}` : ''}
            </h4>
            {certificadosDoEvento.length === 0 ? (
              <div className="card-elevated p-8 text-center text-muted-foreground">
                Nenhum certificado emitido para este evento ainda.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certificadosDoEvento.map((c) => (
                  <div key={c.id} className="card-elevated p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileBadge size={18} className="text-primary" />
                    </div>
                    <div className="grow min-w-0">
                      <p className="font-bold text-foreground truncate">{c.ejNome}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.indicador}</p>
                    </div>
                    <button onClick={() => setEditando(c)} className="btn-secondary text-xs py-1.5">
                      Ver / Editar
                    </button>
                    <button
                      onClick={() => setExcluindo(c)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <AssinaturasSection assinaturas={assinaturas} onSalvar={salvarAssinatura} />

      {/* Editor do certificado */}
      {editando && (
        <Modal
          title={`Certificado — ${editando.ejNome}`}
          onClose={() => setEditando(null)}
        >
          <CertificadoEditor
            ejNome={editando.ejNome ?? ''}
            eventoNome={eventoAtual?.nome ?? ''}
            indicador={editando.indicador}
            textoInicial={editando.textoCertificado}
            configInicial={editando.configEditor}
            assinaturas={assinaturas}
            onSalvar={async (texto, config) => {
              await atualizarCertificado(editando.id, { textoCertificado: texto, configEditor: config });
            }}
          />
        </Modal>
      )}

      {/* Confirmação de exclusão */}
      {excluindo && (
        <ConfirmModal
          title="Excluir certificado"
          message={`Isso excluirá o certificado de "${excluindo.indicador}" emitido para ${excluindo.ejNome}.`}
          onCancel={() => setExcluindo(null)}
          onConfirm={async () => {
            await excluirCertificado(excluindo.id);
            setExcluindo(null);
          }}
        />
      )}
    </div>
  );
};

export default ReconhecimentoSection;
