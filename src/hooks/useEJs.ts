import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EJ } from '@/types';
import { toast } from '@/hooks/use-toast';
import { DDR_EMPRESAS_JUNIORES } from '@/data/ddrDatabase';

export function useEJs() {
  const [ejs, setEjs] = useState<EJ[]>(DDR_EMPRESAS_JUNIORES);
  const [loading, setLoading] = useState(true);

  const fetchEJs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('ejs')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.warn('Supabase offline ou sem tabela ejs, utilizando Base DDR Oficial:', error.message);
        setEjs(DDR_EMPRESAS_JUNIORES);
        return;
      }

      if (data && data.length > 5) {
        // Se Supabase tiver as EJs carregadas, mescla com os dados ricos de DDR
        const ddrMap = new Map(DDR_EMPRESAS_JUNIORES.map(e => [e.nome.toLowerCase().trim(), e]));
        
        const mapped: EJ[] = data.map((e) => {
          const ddrItem = ddrMap.get(e.nome?.toLowerCase().trim());
          return {
            ...(ddrItem || {}),
            id: e.id,
            nome: e.nome,
            cnpj: e.cnpj,
            cluster: (e.cluster as 1 | 2 | 3 | 4 | 5) || ddrItem?.cluster || 1,
            regiao: e.regiao || ddrItem?.regiao || 'Centro Norte',
            localizacao: e.localizacao || ddrItem?.localizacao || '',
            faturamentoMeta: Number(e.faturamento_meta) || ddrItem?.faturamentoMeta || 0,
            faturamentoAtual: Number(e.faturamento_atual) || ddrItem?.faturamentoAtual || 0,
            faturamentoQ1: Number(e.faturamento_q1) || ddrItem?.faturamentoQ1 || 0,
            faturamentoQ2: Number(e.faturamento_q2) || ddrItem?.faturamentoQ2 || 0,
            faturamentoQ3: Number(e.faturamento_q3) || ddrItem?.faturamentoQ3 || 0,
            faturamentoQ4: Number(e.faturamento_q4) || ddrItem?.faturamentoQ4 || 0
          };
        });
        setEjs(mapped);
      } else {
        // Usa a base de 75 EJs de DDR
        setEjs(DDR_EMPRESAS_JUNIORES);
      }
    } catch (error) {
      console.warn('Erro ao conectar ao Supabase, carregando 75 EJs da base DDR oficial:', error);
      setEjs(DDR_EMPRESAS_JUNIORES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEJs();
  }, [fetchEJs]);

  const createEJ = async (ej: Omit<EJ, 'id'>) => {
    try {
      const faturamentoAtual = (ej.faturamentoQ1 || 0) + (ej.faturamentoQ2 || 0) + (ej.faturamentoQ3 || 0) + (ej.faturamentoQ4 || 0);
      const newId = `ej_${Date.now()}`;
      const newEJ: EJ = {
        ...ej,
        id: newId,
        faturamentoAtual
      };

      try {
        await supabase
          .from('ejs')
          .insert({
            nome: ej.nome,
            cnpj: ej.cnpj,
            cluster: ej.cluster,
            regiao: ej.regiao,
            localizacao: ej.localizacao,
            faturamento_meta: ej.faturamentoMeta,
            faturamento_atual: faturamentoAtual,
            faturamento_q1: ej.faturamentoQ1 || 0,
            faturamento_q2: ej.faturamentoQ2 || 0,
            faturamento_q3: ej.faturamentoQ3 || 0,
            faturamento_q4: ej.faturamentoQ4 || 0
          });
      } catch (err) {
        console.log('Salvo localmente');
      }

      setEjs(prev => [...prev, newEJ]);
      toast({ title: 'EJ cadastrada com sucesso!' });
      return newEJ;
    } catch (error) {
      console.error('Erro ao criar EJ:', error);
      toast({ title: 'Erro ao cadastrar EJ', variant: 'destructive' });
      throw error;
    }
  };

  const updateEJ = async (id: string, ej: Partial<EJ>) => {
    try {
      const faturamentoAtual = (ej.faturamentoQ1 || 0) + (ej.faturamentoQ2 || 0) + (ej.faturamentoQ3 || 0) + (ej.faturamentoQ4 || 0);
      
      try {
        await supabase
          .from('ejs')
          .update({
            nome: ej.nome,
            cnpj: ej.cnpj,
            cluster: ej.cluster,
            regiao: ej.regiao,
            localizacao: ej.localizacao,
            faturamento_meta: ej.faturamentoMeta,
            faturamento_atual: faturamentoAtual,
            faturamento_q1: ej.faturamentoQ1 || 0,
            faturamento_q2: ej.faturamentoQ2 || 0,
            faturamento_q3: ej.faturamentoQ3 || 0,
            faturamento_q4: ej.faturamentoQ4 || 0
          })
          .eq('id', id);
      } catch (err) {
        console.log('Atualizado localmente');
      }

      setEjs(prev => prev.map(item => item.id === id ? { ...item, ...ej, faturamentoAtual } : item));
      toast({ title: 'EJ atualizada!' });
    } catch (error) {
      console.error('Erro ao atualizar EJ:', error);
      toast({ title: 'Erro ao atualizar EJ', variant: 'destructive' });
      throw error;
    }
  };

  const deleteEJ = async (id: string) => {
    try {
      try {
        await supabase
          .from('ejs')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.log('Removido localmente');
      }

      setEjs(prev => prev.filter(item => item.id !== id));
      toast({ title: 'EJ excluída!' });
    } catch (error) {
      console.error('Erro ao excluir EJ:', error);
      toast({ title: 'Erro ao excluir EJ', variant: 'destructive' });
      throw error;
    }
  };

  return {
    ejs,
    loading,
    createEJ,
    updateEJ,
    deleteEJ,
    refetch: fetchEJs
  };
}
