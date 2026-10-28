import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { calcularCronograma, PresidenciaEventoInput } from '@/utils/backwardsScheduling';

export interface PresidenciaEvento {
  id: string;
  nomeEvento: string;
  dataEvento: string;
  periodicidade: string;
  prazoIdvBrainstorm: number | null;
  prazoIdvTerceirizada: number | null;
  prazoPfElaboracao: number | null;
  prazoPfAprovacaoCa: number | null;
  prazoAvisoPrevio: number | null;
  prazoColetaPesquisa: number | null;
  prazoAberturaCoordenadoria: number | null;
  prazoArticulacaoLocal: number | null;
  dataMarcoZero: string | null;
  dataIdvInicioBrainstorm: string | null;
  dataIdvInicioTerceirizada: string | null;
  dataPfInicioElaboracao: string | null;
  dataPfAprovacaoCa: string | null;
  dataPesquisaLancamento: string | null;
  dataPesquisaAvisoPrevio: string | null;
  dataPesquisaLimiteColeta: string | null;
  dataAberturaCoordenadoria: string | null;
  dataArticulacaoLocal: string | null;
  status: string;
}

export const INITIAL_PRESIDENCIA_EVENTOS: PresidenciaEvento[] = [
  {
    id: 'ev_onde',
    nomeEvento: 'ONDE',
    dataEvento: '2026-04-25',
    periodicidade: 'anual',
    prazoAberturaCoordenadoria: 21,
    prazoArticulacaoLocal: 60,
    prazoIdvBrainstorm: 5,
    prazoIdvTerceirizada: 5,
    prazoPfElaboracao: 5,
    prazoPfAprovacaoCa: 7,
    prazoAvisoPrevio: 4,
    prazoColetaPesquisa: 7,
    dataMarcoZero: '2026-03-09',
    dataIdvInicioBrainstorm: '2026-02-27',
    dataIdvInicioTerceirizada: '2026-03-04',
    dataPfInicioElaboracao: '2026-02-25',
    dataPfAprovacaoCa: '2026-03-02',
    dataPesquisaLancamento: '2026-03-02',
    dataPesquisaAvisoPrevio: '2026-02-26',
    dataPesquisaLimiteColeta: '2026-03-09',
    dataAberturaCoordenadoria: '2026-02-04',
    dataArticulacaoLocal: '2025-12-27',
    status: 'planejamento'
  },
  {
    id: 'ev_centralrio',
    nomeEvento: 'CentralRio',
    dataEvento: '2026-06-20',
    periodicidade: 'anual',
    prazoAberturaCoordenadoria: 21,
    prazoArticulacaoLocal: 60,
    prazoIdvBrainstorm: 5,
    prazoIdvTerceirizada: 5,
    prazoPfElaboracao: 5,
    prazoPfAprovacaoCa: 7,
    prazoAvisoPrevio: 4,
    prazoColetaPesquisa: 7,
    dataMarcoZero: '2026-05-04',
    dataIdvInicioBrainstorm: '2026-04-24',
    dataIdvInicioTerceirizada: '2026-04-29',
    dataPfInicioElaboracao: '2026-04-22',
    dataPfAprovacaoCa: '2026-04-27',
    dataPesquisaLancamento: '2026-04-27',
    dataPesquisaAvisoPrevio: '2026-04-23',
    dataPesquisaLimiteColeta: '2026-05-04',
    dataAberturaCoordenadoria: '2026-04-01',
    dataArticulacaoLocal: '2026-02-21',
    status: 'planejamento'
  },
  {
    id: 'ev_enej',
    nomeEvento: 'ENEJ',
    dataEvento: '2026-08-26',
    periodicidade: 'anual',
    prazoAberturaCoordenadoria: null,
    prazoArticulacaoLocal: null,
    prazoIdvBrainstorm: null,
    prazoIdvTerceirizada: null,
    prazoPfElaboracao: null,
    prazoPfAprovacaoCa: null,
    prazoAvisoPrevio: 15,
    prazoColetaPesquisa: 60,
    dataMarcoZero: '2026-06-29',
    dataIdvInicioBrainstorm: null,
    dataIdvInicioTerceirizada: null,
    dataPfInicioElaboracao: null,
    dataPfAprovacaoCa: null,
    dataPesquisaLancamento: '2026-04-30',
    dataPesquisaAvisoPrevio: '2026-04-15',
    dataPesquisaLimiteColeta: '2026-06-29',
    dataAberturaCoordenadoria: null,
    dataArticulacaoLocal: null,
    status: 'planejamento'
  },
  {
    id: 'ev_efej',
    nomeEvento: 'EFEJ',
    dataEvento: '2026-10-16',
    periodicidade: 'anual',
    prazoAberturaCoordenadoria: 21,
    prazoArticulacaoLocal: 60,
    prazoIdvBrainstorm: 5,
    prazoIdvTerceirizada: 5,
    prazoPfElaboracao: 5,
    prazoPfAprovacaoCa: 7,
    prazoAvisoPrevio: 4,
    prazoColetaPesquisa: 7,
    dataMarcoZero: '2026-08-24',
    dataIdvInicioBrainstorm: '2026-08-14',
    dataIdvInicioTerceirizada: '2026-08-19',
    dataPfInicioElaboracao: '2026-08-12',
    dataPfAprovacaoCa: '2026-08-17',
    dataPesquisaLancamento: '2026-08-17',
    dataPesquisaAvisoPrevio: '2026-08-13',
    dataPesquisaLimiteColeta: '2026-08-24',
    dataAberturaCoordenadoria: '2026-07-22',
    dataArticulacaoLocal: '2026-06-13',
    status: 'planejamento'
  }
];

const STORAGE_KEY = 'riojunior_presidencia_eventos_v2';

export function usePresidenciaEventos() {
  const [eventos, setEventos] = useState<PresidenciaEvento[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRESIDENCIA_EVENTOS;
  });
  const [loading, setLoading] = useState(false);

  const fetchEventos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('presidencia_eventos')
        .select('*')
        .order('data_evento', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: PresidenciaEvento[] = data.map((e: any) => ({
          id: e.id,
          nomeEvento: e.nome_evento,
          dataEvento: e.data_evento,
          periodicidade: e.periodicidade || 'anual',
          prazoIdvBrainstorm: e.prazo_idv_brainstorm,
          prazoIdvTerceirizada: e.prazo_idv_terceirizada,
          prazoPfElaboracao: e.prazo_pf_elaboracao,
          prazoPfAprovacaoCa: e.prazo_pf_aprovacao_ca,
          prazoAvisoPrevio: e.prazo_aviso_previo,
          prazoColetaPesquisa: e.prazo_coleta_pesquisa,
          prazoAberturaCoordenadoria: e.prazo_abertura_coordenadoria,
          prazoArticulacaoLocal: e.prazo_articulacao_local,
          dataMarcoZero: e.data_marco_zero,
          dataIdvInicioBrainstorm: e.data_idv_inicio_brainstorm,
          dataIdvInicioTerceirizada: e.data_idv_inicio_terceirizada,
          dataPfInicioElaboracao: e.data_pf_inicio_elaboracao,
          dataPfAprovacaoCa: e.data_pf_aprovacao_ca,
          dataPesquisaLancamento: e.data_pesquisa_lancamento,
          dataPesquisaAvisoPrevio: e.data_pesquisa_aviso_previo,
          dataPesquisaLimiteColeta: e.data_pesquisa_limite_coleta,
          dataAberturaCoordenadoria: e.data_abertura_coordenadoria,
          dataArticulacaoLocal: e.data_articulacao_local,
          status: e.status || 'planejamento',
        }));

        setEventos(mapped);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        } catch {}
      }
    } catch (error) {
      console.warn('Erro ao carregar do Supabase, utilizando cache local:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const createEvento = async (input: PresidenciaEventoInput) => {
    const cronograma = calcularCronograma(input);
    const tempId = 'ev_' + Date.now().toString(36);
    const novo: PresidenciaEvento = {
      id: tempId,
      nomeEvento: input.nomeEvento,
      dataEvento: input.dataEvento,
      periodicidade: 'anual',
      prazoIdvBrainstorm: input.prazoIdvBrainstorm,
      prazoIdvTerceirizada: input.prazoIdvTerceirizada,
      prazoPfElaboracao: input.prazoPfElaboracao,
      prazoPfAprovacaoCa: input.prazoPfAprovacaoCa,
      prazoAvisoPrevio: input.prazoAvisoPrevio,
      prazoColetaPesquisa: input.prazoColetaPesquisa,
      prazoAberturaCoordenadoria: input.prazoAberturaCoordenadoria,
      prazoArticulacaoLocal: input.prazoArticulacaoLocal,
      dataMarcoZero: cronograma.dataMarcoZero,
      dataIdvInicioBrainstorm: cronograma.dataIdvInicioBrainstorm,
      dataIdvInicioTerceirizada: cronograma.dataIdvInicioTerceirizada,
      dataPfInicioElaboracao: cronograma.dataPfInicioElaboracao,
      dataPfAprovacaoCa: cronograma.dataPfAprovacaoCa,
      dataPesquisaLancamento: cronograma.dataPesquisaLancamento,
      dataPesquisaAvisoPrevio: cronograma.dataPesquisaAvisoPrevio,
      dataPesquisaLimiteColeta: cronograma.dataPesquisaLimiteColeta,
      dataAberturaCoordenadoria: cronograma.dataAberturaCoordenadoria,
      dataArticulacaoLocal: cronograma.dataArticulacaoLocal,
      status: 'planejamento'
    };

    setEventos(prev => {
      const updated = [...prev, novo].sort((a, b) => a.dataEvento.localeCompare(b.dataEvento));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      const { data, error } = await supabase
        .from('presidencia_eventos')
        .insert({
          nome_evento: input.nomeEvento,
          data_evento: input.dataEvento,
          prazo_idv_brainstorm: input.prazoIdvBrainstorm,
          prazo_idv_terceirizada: input.prazoIdvTerceirizada,
          prazo_pf_elaboracao: input.prazoPfElaboracao,
          prazo_pf_aprovacao_ca: input.prazoPfAprovacaoCa,
          prazo_aviso_previo: input.prazoAvisoPrevio,
          prazo_coleta_pesquisa: input.prazoColetaPesquisa,
          prazo_abertura_coordenadoria: input.prazoAberturaCoordenadoria,
          prazo_articulacao_local: input.prazoArticulacaoLocal,
          data_marco_zero: cronograma.dataMarcoZero,
          data_idv_inicio_brainstorm: cronograma.dataIdvInicioBrainstorm,
          data_idv_inicio_terceirizada: cronograma.dataIdvInicioTerceirizada,
          data_pf_inicio_elaboracao: cronograma.dataPfInicioElaboracao,
          data_pf_aprovacao_ca: cronograma.dataPfAprovacaoCa,
          data_pesquisa_lancamento: cronograma.dataPesquisaLancamento,
          data_pesquisa_aviso_previo: cronograma.dataPesquisaAvisoPrevio,
          data_pesquisa_limite_coleta: cronograma.dataPesquisaLimiteColeta,
          data_abertura_coordenadoria: cronograma.dataAberturaCoordenadoria,
          data_articulacao_local: cronograma.dataArticulacaoLocal,
        } as any)
        .select()
        .single();

      if (!error && data) {
        setEventos(prev => prev.map(e => e.id === tempId ? { ...e, id: data.id } : e));
      }
    } catch {}

    toast({ title: 'Evento criado com cronograma calculado!' });
  };

  const updateEvento = async (id: string, input: PresidenciaEventoInput) => {
    const cronograma = calcularCronograma(input);

    setEventos(prev => {
      const updated = prev.map(e => e.id === id ? {
        ...e,
        nomeEvento: input.nomeEvento,
        dataEvento: input.dataEvento,
        prazoIdvBrainstorm: input.prazoIdvBrainstorm,
        prazoIdvTerceirizada: input.prazoIdvTerceirizada,
        prazoPfElaboracao: input.prazoPfElaboracao,
        prazoPfAprovacaoCa: input.prazoPfAprovacaoCa,
        prazoAvisoPrevio: input.prazoAvisoPrevio,
        prazoColetaPesquisa: input.prazoColetaPesquisa,
        prazoAberturaCoordenadoria: input.prazoAberturaCoordenadoria,
        prazoArticulacaoLocal: input.prazoArticulacaoLocal,
        dataMarcoZero: cronograma.dataMarcoZero,
        dataIdvInicioBrainstorm: cronograma.dataIdvInicioBrainstorm,
        dataIdvInicioTerceirizada: cronograma.dataIdvInicioTerceirizada,
        dataPfInicioElaboracao: cronograma.dataPfInicioElaboracao,
        dataPfAprovacaoCa: cronograma.dataPfAprovacaoCa,
        dataPesquisaLancamento: cronograma.dataPesquisaLancamento,
        dataPesquisaAvisoPrevio: cronograma.dataPesquisaAvisoPrevio,
        dataPesquisaLimiteColeta: cronograma.dataPesquisaLimiteColeta,
        dataAberturaCoordenadoria: cronograma.dataAberturaCoordenadoria,
        dataArticulacaoLocal: cronograma.dataArticulacaoLocal,
      } : e).sort((a, b) => a.dataEvento.localeCompare(b.dataEvento));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase
        .from('presidencia_eventos')
        .update({
          nome_evento: input.nomeEvento,
          data_evento: input.dataEvento,
          prazo_idv_brainstorm: input.prazoIdvBrainstorm,
          prazo_idv_terceirizada: input.prazoIdvTerceirizada,
          prazo_pf_elaboracao: input.prazoPfElaboracao,
          prazo_pf_aprovacao_ca: input.prazoPfAprovacaoCa,
          prazo_aviso_previo: input.prazoAvisoPrevio,
          prazo_coleta_pesquisa: input.prazoColetaPesquisa,
          prazo_abertura_coordenadoria: input.prazoAberturaCoordenadoria,
          prazo_articulacao_local: input.prazoArticulacaoLocal,
          data_marco_zero: cronograma.dataMarcoZero,
          data_idv_inicio_brainstorm: cronograma.dataIdvInicioBrainstorm,
          data_idv_inicio_terceirizada: cronograma.dataIdvInicioTerceirizada,
          data_pf_inicio_elaboracao: cronograma.dataPfInicioElaboracao,
          data_pf_aprovacao_ca: cronograma.dataPfAprovacaoCa,
          data_pesquisa_lancamento: cronograma.dataPesquisaLancamento,
          data_pesquisa_aviso_previo: cronograma.dataPesquisaAvisoPrevio,
          data_pesquisa_limite_coleta: cronograma.dataPesquisaLimiteColeta,
          data_abertura_coordenadoria: cronograma.dataAberturaCoordenadoria,
          data_articulacao_local: cronograma.dataArticulacaoLocal,
        } as any)
        .eq('id', id);
    } catch {}

    toast({ title: 'Evento atualizado e cronograma recalculado!' });
  };

  const deleteEvento = async (id: string) => {
    setEventos(prev => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase
        .from('presidencia_eventos')
        .delete()
        .eq('id', id);
    } catch {}

    toast({ title: 'Evento excluído!' });
  };

  return { eventos, loading, createEvento, updateEvento, deleteEvento, refetch: fetchEventos };
}
