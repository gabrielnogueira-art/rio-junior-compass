import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Caravana {
  id: string;
  eventoId: string;
  ejId: string | null;
  ies: string | null;
  regiao: string | null;
  numPessoas: number;
  valorMedioIngresso: number;
  ejNome?: string;
}

export interface AbatimentoPF {
  id: string;
  eventoId: string;
  item: string;
  parceiroNome: string | null;
  valor: number;
}

export function useAcessibilidade() {
  const [caravanas, setCaravanas] = useState<Caravana[]>([]);
  const [abatimentos, setAbatimentos] = useState<AbatimentoPF[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDados = useCallback(async () => {
    try {
      const [{ data: carData, error: carErr }, { data: abaData, error: abaErr }] = await Promise.all([
        supabase
          .from('caravanas')
          .select('*, ejs!caravanas_ej_id_fkey(nome)')
          .order('created_at', { ascending: false }),
        supabase.from('abatimentos_pf').select('*').order('created_at', { ascending: false }),
      ]);
      if (carErr) throw carErr;
      if (abaErr) throw abaErr;

      setCaravanas(
        (carData || []).map((c: any) => ({
          id: c.id,
          eventoId: c.evento_id,
          ejId: c.ej_id,
          ies: c.ies,
          regiao: c.regiao,
          numPessoas: c.num_pessoas,
          valorMedioIngresso: Number(c.valor_medio_ingresso),
          ejNome: c.ejs?.nome,
        }))
      );
      setAbatimentos(
        (abaData || []).map((a: any) => ({
          id: a.id,
          eventoId: a.evento_id,
          item: a.item,
          parceiroNome: a.parceiro_nome,
          valor: Number(a.valor),
        }))
      );
    } catch (error) {
      console.error('Erro ao carregar acessibilidade:', error);
      toast({ title: 'Erro ao carregar dados de acessibilidade', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const addCaravana = async (c: Omit<Caravana, 'id' | 'ejNome'>) => {
    try {
      const { error } = await supabase.from('caravanas').insert({
        evento_id: c.eventoId,
        ej_id: c.ejId || null,
        ies: c.ies || null,
        regiao: c.regiao || null,
        num_pessoas: c.numPessoas,
        valor_medio_ingresso: c.valorMedioIngresso,
      });
      if (error) throw error;
      await fetchDados();
      toast({ title: 'Caravana registrada!' });
    } catch (error) {
      console.error('Erro ao registrar caravana:', error);
      toast({ title: 'Erro ao registrar caravana', variant: 'destructive' });
      throw error;
    }
  };

  const deleteCaravana = async (id: string) => {
    try {
      const { error } = await supabase.from('caravanas').delete().eq('id', id);
      if (error) throw error;
      await fetchDados();
      toast({ title: 'Caravana excluída!' });
    } catch (error) {
      console.error('Erro ao excluir caravana:', error);
      toast({ title: 'Erro ao excluir caravana', variant: 'destructive' });
      throw error;
    }
  };

  const addAbatimento = async (a: Omit<AbatimentoPF, 'id'>) => {
    try {
      const { error } = await supabase.from('abatimentos_pf').insert({
        evento_id: a.eventoId,
        item: a.item,
        parceiro_nome: a.parceiroNome || null,
        valor: a.valor,
      });
      if (error) throw error;
      await fetchDados();
      toast({ title: 'Abatimento registrado!' });
    } catch (error) {
      console.error('Erro ao registrar abatimento:', error);
      toast({ title: 'Erro ao registrar abatimento', variant: 'destructive' });
      throw error;
    }
  };

  const deleteAbatimento = async (id: string) => {
    try {
      const { error } = await supabase.from('abatimentos_pf').delete().eq('id', id);
      if (error) throw error;
      await fetchDados();
      toast({ title: 'Abatimento excluído!' });
    } catch (error) {
      console.error('Erro ao excluir abatimento:', error);
      toast({ title: 'Erro ao excluir abatimento', variant: 'destructive' });
      throw error;
    }
  };

  return {
    caravanas,
    abatimentos,
    loading,
    addCaravana,
    deleteCaravana,
    addAbatimento,
    deleteAbatimento,
    refetch: fetchDados,
  };
}
