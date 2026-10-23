import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AnuidadeParcela {
  id: string;
  ejId: string;
  ano: number;
  valor: number;
  dataVencimento: string;
  dataPagamento: string | null;
  status: string;
  jurosPercentual: number | null;
  valorJuros: number | null;
  parcelaNumero: number | null;
  totalParcelas: number | null;
  suporteAnuidade: boolean;
  ejNome?: string;
}

export interface AnuidadeResumoEJ {
  ejId: string;
  ejNome: string;
  ano: number;
  valorTotal: number;
  totalParcelas: number;
  parcelasPagas: number;
  valorPago: number;
  suporteAnuidade: boolean;
  parcelas: AnuidadeParcela[];
}

export function useAnuidades(ano?: number) {
  const [parcelas, setParcelas] = useState<AnuidadeParcela[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnuidades = useCallback(async () => {
    try {
      let query = supabase
        .from('anuidades')
        .select('*, ejs!anuidades_ej_id_fkey(nome)')
        .order('data_vencimento', { ascending: true });

      if (ano) {
        query = query.eq('ano', ano);
      }

      const { data, error } = await query;
      if (error) throw error;

      const mapped: AnuidadeParcela[] = (data || []).map((a: any) => ({
        id: a.id,
        ejId: a.ej_id,
        ano: a.ano,
        valor: Number(a.valor),
        dataVencimento: a.data_vencimento,
        dataPagamento: a.data_pagamento,
        status: a.status,
        jurosPercentual: a.juros_percentual != null ? Number(a.juros_percentual) : null,
        valorJuros: a.valor_juros != null ? Number(a.valor_juros) : null,
        parcelaNumero: a.parcela_numero,
        totalParcelas: a.total_parcelas,
        suporteAnuidade: a.suporte_anuidade ?? false,
        ejNome: a.ejs?.nome,
      }));

      setParcelas(mapped);
    } catch (error) {
      console.error('Erro ao carregar anuidades:', error);
      toast({ title: 'Erro ao carregar anuidades', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [ano]);

  useEffect(() => {
    fetchAnuidades();
  }, [fetchAnuidades]);

  const criarAnuidade = async (params: {
    ejId: string;
    ano: number;
    valorTotal: number;
    totalParcelas: number;
    primeiroVencimento: string;
    suporteAnuidade: boolean;
  }) => {
    try {
      const valorParcela = Math.round((params.valorTotal / params.totalParcelas) * 100) / 100;
      const base = new Date(params.primeiroVencimento + 'T12:00:00');

      const rows = Array.from({ length: params.totalParcelas }, (_, i) => {
        const venc = new Date(base);
        venc.setMonth(venc.getMonth() + i);
        const vencStr = venc.toISOString().slice(0, 10);
        // A última parcela absorve a diferença de arredondamento
        const valor =
          i === params.totalParcelas - 1
            ? Math.round((params.valorTotal - valorParcela * (params.totalParcelas - 1)) * 100) / 100
            : valorParcela;
        return {
          ej_id: params.ejId,
          ano: params.ano,
          valor,
          data_vencimento: vencStr,
          status: 'pendente',
          parcela_numero: i + 1,
          total_parcelas: params.totalParcelas,
          suporte_anuidade: params.suporteAnuidade,
        };
      });

      const { error } = await supabase.from('anuidades').insert(rows);
      if (error) throw error;

      await fetchAnuidades();
      toast({ title: 'Anuidade criada!' });
    } catch (error) {
      console.error('Erro ao criar anuidade:', error);
      toast({ title: 'Erro ao criar anuidade', variant: 'destructive' });
      throw error;
    }
  };

  const marcarPaga = async (id: string, dataPagamento: string) => {
    try {
      const { error } = await supabase
        .from('anuidades')
        .update({ status: 'paga', data_pagamento: dataPagamento })
        .eq('id', id);
      if (error) throw error;
      await fetchAnuidades();
      toast({ title: 'Parcela marcada como paga!' });
    } catch (error) {
      console.error('Erro ao marcar parcela:', error);
      toast({ title: 'Erro ao atualizar parcela', variant: 'destructive' });
      throw error;
    }
  };

  const desmarcarPaga = async (id: string) => {
    try {
      const { error } = await supabase
        .from('anuidades')
        .update({ status: 'pendente', data_pagamento: null })
        .eq('id', id);
      if (error) throw error;
      await fetchAnuidades();
      toast({ title: 'Parcela revertida para pendente' });
    } catch (error) {
      console.error('Erro ao reverter parcela:', error);
      toast({ title: 'Erro ao atualizar parcela', variant: 'destructive' });
      throw error;
    }
  };

  const toggleSuporte = async (ejId: string, ano: number, suporte: boolean) => {
    try {
      const { error } = await supabase
        .from('anuidades')
        .update({ suporte_anuidade: suporte })
        .eq('ej_id', ejId)
        .eq('ano', ano);
      if (error) throw error;
      await fetchAnuidades();
      toast({ title: suporte ? 'Suporte à anuidade ativado' : 'Suporte à anuidade removido' });
    } catch (error) {
      console.error('Erro ao atualizar suporte:', error);
      toast({ title: 'Erro ao atualizar suporte', variant: 'destructive' });
      throw error;
    }
  };

  const excluirAnuidade = async (ejId: string, ano: number) => {
    try {
      const { error } = await supabase
        .from('anuidades')
        .delete()
        .eq('ej_id', ejId)
        .eq('ano', ano);
      if (error) throw error;
      await fetchAnuidades();
      toast({ title: 'Anuidade excluída!' });
    } catch (error) {
      console.error('Erro ao excluir anuidade:', error);
      toast({ title: 'Erro ao excluir anuidade', variant: 'destructive' });
      throw error;
    }
  };

  return {
    parcelas,
    loading,
    criarAnuidade,
    marcarPaga,
    desmarcarPaga,
    toggleSuporte,
    excluirAnuidade,
    refetch: fetchAnuidades,
  };
}
