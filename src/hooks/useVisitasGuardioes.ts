import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type StatusVisita = 'solicitada' | 'aprovada' | 'realizada' | 'cancelada';

export interface VisitaGuardiao {
  id: string;
  ejId: string;
  data: string;
  horario: string | null;
  local: string | null;
  motivo: string | null;
  status: StatusVisita;
  gasto: number | null;
  observacoes: string | null;
  ejNome?: string;
}

export function useVisitasGuardioes(ano?: number) {
  const [visitas, setVisitas] = useState<VisitaGuardiao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisitas = useCallback(async () => {
    try {
      let query = supabase
        .from('visitas_guardioes')
        .select('*, ejs!visitas_guardioes_ej_id_fkey(nome)')
        .order('data', { ascending: false });

      if (ano) {
        query = query
          .gte('data', `${ano}-01-01`)
          .lte('data', `${ano}-12-31`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setVisitas(
        (data || []).map((v: any) => ({
          id: v.id,
          ejId: v.ej_id,
          data: v.data,
          horario: v.horario,
          local: v.local,
          motivo: v.motivo,
          status: v.status as StatusVisita,
          gasto: v.gasto != null ? Number(v.gasto) : null,
          observacoes: v.observacoes,
          ejNome: v.ejs?.nome,
        }))
      );
    } catch (error) {
      console.error('Erro ao carregar visitas:', error);
      toast({ title: 'Erro ao carregar visitas dos guardiões', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [ano]);

  useEffect(() => {
    fetchVisitas();
  }, [fetchVisitas]);

  const solicitarVisita = async (visita: {
    ejId: string;
    data: string;
    horario?: string;
    local?: string;
    motivo?: string;
  }) => {
    try {
      const { error } = await supabase.from('visitas_guardioes').insert({
        ej_id: visita.ejId,
        data: visita.data,
        horario: visita.horario || null,
        local: visita.local || null,
        motivo: visita.motivo || null,
        status: 'solicitada',
      });
      if (error) throw error;
      await fetchVisitas();
      toast({ title: 'Visita solicitada!' });
    } catch (error) {
      console.error('Erro ao solicitar visita:', error);
      toast({ title: 'Erro ao solicitar visita', variant: 'destructive' });
      throw error;
    }
  };

  const atualizarVisita = async (
    id: string,
    campos: Partial<Pick<VisitaGuardiao, 'status' | 'gasto' | 'observacoes' | 'data' | 'horario' | 'local' | 'motivo'>>
  ) => {
    try {
      const updateData: any = {};
      if (campos.status !== undefined) updateData.status = campos.status;
      if (campos.gasto !== undefined) updateData.gasto = campos.gasto;
      if (campos.observacoes !== undefined) updateData.observacoes = campos.observacoes;
      if (campos.data !== undefined) updateData.data = campos.data;
      if (campos.horario !== undefined) updateData.horario = campos.horario;
      if (campos.local !== undefined) updateData.local = campos.local;
      if (campos.motivo !== undefined) updateData.motivo = campos.motivo;

      const { error } = await supabase.from('visitas_guardioes').update(updateData).eq('id', id);
      if (error) throw error;
      await fetchVisitas();
      toast({ title: 'Visita atualizada!' });
    } catch (error) {
      console.error('Erro ao atualizar visita:', error);
      toast({ title: 'Erro ao atualizar visita', variant: 'destructive' });
      throw error;
    }
  };

  const excluirVisita = async (id: string) => {
    try {
      const { error } = await supabase.from('visitas_guardioes').delete().eq('id', id);
      if (error) throw error;
      await fetchVisitas();
      toast({ title: 'Solicitação excluída!' });
    } catch (error) {
      console.error('Erro ao excluir visita:', error);
      toast({ title: 'Erro ao excluir visita', variant: 'destructive' });
      throw error;
    }
  };

  return { visitas, loading, solicitarVisita, atualizarVisita, excluirVisita, refetch: fetchVisitas };
}
