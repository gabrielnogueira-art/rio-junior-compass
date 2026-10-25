import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type TipoMomento =
  | 'credenciamento'
  | 'checkin'
  | 'abertura'
  | 'magna'
  | 'paralela'
  | 'almoco_intervalo'
  | 'encerramento'
  | 'happy_hour'
  | 'outro'
  | (string & {});

export type MinistranteTipo =
  | 'parceiro_vpneg'
  | 'parceiro_presex'
  | 'pos_junior'
  | 'interno'
  | 'convidado_externo'
  | 'outro'
  | (string & {});

export const TIPO_MOMENTO_LABELS: Record<string, string> = {
  credenciamento: 'Credenciamento',
  checkin: 'Check-in',
  abertura: 'Abertura',
  magna: 'Pauta Magna',
  paralela: 'Pauta Paralela',
  almoco_intervalo: 'Almoço / Intervalo',
  encerramento: 'Encerramento',
  happy_hour: 'Happy Hour / Integração',
  outro: 'Outro',
};

export const TEMATICAS_MACRO = [
  'Vendas',
  'Gestão de Pessoas',
  'Cultura',
  'Marketing',
  'Financeiro',
  'Estratégia & Liderança',
  'Operações & Processos',
  'Inovação & IA',
  'Outra',
];

export const MINISTRANTE_TIPO_LABELS: Record<string, string> = {
  parceiro_vpneg: 'Parceiro VPNeg',
  parceiro_presex: 'Parceiro PresEx',
  pos_junior: 'Pós-Júnior',
  interno: 'Interno (RioJunior)',
  convidado_externo: 'Convidado Externo',
  outro: 'Outro',
};

export interface GradeConfig {
  id: string;
  eventoId: string;
  magnasVendaveis: number;
  paralelasVendaveis: number;
  magnasNaGrade?: number;
  paralelasNaGrade?: number;
}

export interface PautaEvento {
  id: string;
  eventoId: string;
  tipo: TipoMomento;
  titulo: string;
  tematicaMacro: string;
  dia: string | null;
  horario: string;
  ministranteTipo: MinistranteTipo | null;
  ministranteNome: string;
  parceiroNome: string;
  csat: number | null;
  vendaId: string | null;
  ordem: number;
}

export interface PautaVendida {
  id: string;
  eventoId: string;
  tipo: 'magna' | 'paralela';
  parceiroNome: string;
  valor: number | null;
  status: 'vendida' | 'alocada';
}

export interface PautaEventoInput {
  eventoId: string;
  tipo: TipoMomento;
  titulo: string;
  tematicaMacro: string;
  dia: string | null;
  horario: string;
  ministranteTipo: MinistranteTipo | null;
  ministranteNome: string;
  parceiroNome: string;
  csat: number | null;
  vendaId?: string | null;
  ordem?: number;
}

export function useGradeConteudo() {
  const [configs, setConfigs] = useState<GradeConfig[]>([]);
  const [pautas, setPautas] = useState<PautaEvento[]>([]);
  const [vendas, setVendas] = useState<PautaVendida[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [cfgRes, pautasRes, vendasRes] = await Promise.all([
        supabase.from('grade_evento_config' as any).select('*'),
        supabase.from('pautas_evento' as any).select('*').order('ordem', { ascending: true }),
        supabase.from('pautas_vendidas' as any).select('*').order('created_at', { ascending: false }),
      ]);

      if (cfgRes.error) throw cfgRes.error;
      if (pautasRes.error) throw pautasRes.error;
      if (vendasRes.error) throw vendasRes.error;

      setConfigs((cfgRes.data || []).map((c: any) => ({
        id: c.id,
        eventoId: c.evento_id,
        magnasVendaveis: c.magnas_vendaveis,
        paralelasVendaveis: c.paralelas_vendaveis,
      })));

      setPautas((pautasRes.data || []).map((p: any) => ({
        id: p.id,
        eventoId: p.evento_id,
        tipo: p.tipo as TipoMomento,
        titulo: p.titulo || '',
        tematicaMacro: p.tematica_macro || '',
        dia: p.dia,
        horario: p.horario || '',
        ministranteTipo: p.ministrante_tipo as MinistranteTipo | null,
        ministranteNome: p.ministrante_nome || '',
        parceiroNome: p.parceiro_nome || '',
        csat: p.csat,
        vendaId: p.venda_id,
        ordem: p.ordem,
      })));

      setVendas((vendasRes.data || []).map((v: any) => ({
        id: v.id,
        eventoId: v.evento_id,
        tipo: v.tipo as 'magna' | 'paralela',
        parceiroNome: v.parceiro_nome,
        valor: v.valor,
        status: v.status as 'vendida' | 'alocada',
      })));
    } catch (error) {
      console.error('Erro ao carregar grade de conteúdo:', error);
      toast({ title: 'Erro ao carregar grade de conteúdo', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Retorna a configuração do evento combinando com a contagem real da grade
  const getConfig = useCallback((eventoId: string) => {
    const cfg = configs.find(c => c.eventoId === eventoId);
    const pautasEv = pautas.filter(p => p.eventoId === eventoId);
    const magnasNaGrade = pautasEv.filter(p => p.tipo === 'magna').length;
    const paralelasNaGrade = pautasEv.filter(p => p.tipo === 'paralela').length;

    // As cotas vendáveis são sempre no mínimo o número de pautas magnas/paralelas já cadastradas na grade
    const magnasVendaveis = Math.max(cfg?.magnasVendaveis ?? 0, magnasNaGrade);
    const paralelasVendaveis = Math.max(cfg?.paralelasVendaveis ?? 0, paralelasNaGrade);

    return {
      id: cfg?.id || '',
      eventoId,
      magnasVendaveis,
      paralelasVendaveis,
      magnasNaGrade,
      paralelasNaGrade,
      configuradaMagnas: cfg?.magnasVendaveis ?? 0,
      configuradaParalelas: cfg?.paralelasVendaveis ?? 0,
    };
  }, [configs, pautas]);

  const saveConfig = async (eventoId: string, magnasVendaveis: number, paralelasVendaveis: number) => {
    try {
      const existing = configs.find(c => c.eventoId === eventoId);
      if (existing) {
        const { error } = await supabase
          .from('grade_evento_config' as any)
          .update({ magnas_vendaveis: magnasVendaveis, paralelas_vendaveis: paralelasVendaveis } as any)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('grade_evento_config' as any)
          .insert({ evento_id: eventoId, magnas_vendaveis: magnasVendaveis, paralelas_vendaveis: paralelasVendaveis } as any);
        if (error) throw error;
      }
      await fetchAll();
      toast({ title: 'Cotas de pautas salvas!' });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({ title: 'Erro ao salvar cotas', variant: 'destructive' });
      throw error;
    }
  };

  const syncCotasComGrade = async (eventoId: string) => {
    try {
      const pautasEv = pautas.filter(p => p.eventoId === eventoId);
      const magnas = pautasEv.filter(p => p.tipo === 'magna').length;
      const paralelas = pautasEv.filter(p => p.tipo === 'paralela').length;
      await saveConfig(eventoId, magnas, paralelas);
      toast({ title: 'Cotas sincronizadas com as pautas da grade!' });
    } catch (error) {
      console.error('Erro ao sincronizar cotas:', error);
      toast({ title: 'Erro ao sincronizar cotas', variant: 'destructive' });
    }
  };

  const addPauta = async (input: PautaEventoInput) => {
    try {
      const { error } = await supabase
        .from('pautas_evento' as any)
        .insert({
          evento_id: input.eventoId,
          tipo: input.tipo,
          titulo: input.titulo || null,
          tematica_macro: input.tematicaMacro || null,
          dia: input.dia || null,
          horario: input.horario || null,
          ministrante_tipo: input.ministranteTipo || null,
          ministrante_nome: input.ministranteNome || null,
          parceiro_nome: input.parceiroNome || null,
          csat: input.csat,
          venda_id: input.vendaId || null,
          ordem: input.ordem ?? pautas.filter(p => p.eventoId === input.eventoId).length,
        } as any);
      if (error) throw error;

      // Se a pauta veio de uma venda da VPNeg, marca a venda como alocada
      if (input.vendaId) {
        await supabase
          .from('pautas_vendidas' as any)
          .update({ status: 'alocada' } as any)
          .eq('id', input.vendaId);
      }

      // Se foi adicionada uma pauta magna ou paralela, garante que a cota vendável reflita na tabela
      if (input.tipo === 'magna' || input.tipo === 'paralela') {
        const pautasEv = pautas.filter(p => p.eventoId === input.eventoId);
        const magnasNaGrade = pautasEv.filter(p => p.tipo === 'magna').length + (input.tipo === 'magna' ? 1 : 0);
        const paralelasNaGrade = pautasEv.filter(p => p.tipo === 'paralela').length + (input.tipo === 'paralela' ? 1 : 0);
        const existingCfg = configs.find(c => c.eventoId === input.eventoId);
        const nextMagnas = Math.max(existingCfg?.magnasVendaveis ?? 0, magnasNaGrade);
        const nextParalelas = Math.max(existingCfg?.paralelasVendaveis ?? 0, paralelasNaGrade);

        if (!existingCfg || existingCfg.magnasVendaveis < nextMagnas || existingCfg.paralelasVendaveis < nextParalelas) {
          if (existingCfg) {
            await supabase.from('grade_evento_config' as any).update({
              magnas_vendaveis: nextMagnas,
              paralelas_vendaveis: nextParalelas,
            } as any).eq('id', existingCfg.id);
          } else {
            await supabase.from('grade_evento_config' as any).insert({
              evento_id: input.eventoId,
              magnas_vendaveis: nextMagnas,
              paralelas_vendaveis: nextParalelas,
            } as any);
          }
        }
      }

      await fetchAll();
      toast({ title: 'Momento adicionado à grade!' });
    } catch (error) {
      console.error('Erro ao adicionar pauta:', error);
      toast({ title: 'Erro ao adicionar momento', variant: 'destructive' });
      throw error;
    }
  };

  const updatePauta = async (id: string, input: Partial<PautaEventoInput>) => {
    try {
      const { error } = await supabase
        .from('pautas_evento' as any)
        .update({
          tipo: input.tipo,
          titulo: input.titulo || null,
          tematica_macro: input.tematicaMacro || null,
          dia: input.dia || null,
          horario: input.horario || null,
          ministrante_tipo: input.ministranteTipo || null,
          ministrante_nome: input.ministranteNome || null,
          parceiro_nome: input.parceiroNome || null,
          csat: input.csat,
        } as any)
        .eq('id', id);
      if (error) throw error;
      await fetchAll();
      toast({ title: 'Momento atualizado!' });
    } catch (error) {
      console.error('Erro ao atualizar pauta:', error);
      toast({ title: 'Erro ao atualizar momento', variant: 'destructive' });
      throw error;
    }
  };

  const deletePauta = async (id: string) => {
    try {
      const pauta = pautas.find(p => p.id === id);
      const { error } = await supabase
        .from('pautas_evento' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;

      // Se a pauta estava vinculada a uma venda, a venda volta a ficar pendente de alocação
      if (pauta?.vendaId) {
        await supabase
          .from('pautas_vendidas' as any)
          .update({ status: 'vendida' } as any)
          .eq('id', pauta.vendaId);
      }

      await fetchAll();
      toast({ title: 'Momento removido da grade!' });
    } catch (error) {
      console.error('Erro ao excluir pauta:', error);
      toast({ title: 'Erro ao remover momento', variant: 'destructive' });
      throw error;
    }
  };

  const registrarVenda = async (eventoId: string, tipo: 'magna' | 'paralela', parceiroNome: string, valor: number | null) => {
    try {
      const { error } = await supabase
        .from('pautas_vendidas' as any)
        .insert({ evento_id: eventoId, tipo, parceiro_nome: parceiroNome, valor } as any);
      if (error) throw error;
      await fetchAll();
      toast({ title: 'Venda de pauta registrada! A Formação Empreendedora já pode alocá-la na grade.' });
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      toast({ title: 'Erro ao registrar venda', variant: 'destructive' });
      throw error;
    }
  };

  const deleteVenda = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pautas_vendidas' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchAll();
      toast({ title: 'Venda removida!' });
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      toast({ title: 'Erro ao remover venda', variant: 'destructive' });
      throw error;
    }
  };

  return {
    configs,
    pautas,
    vendas,
    loading,
    getConfig,
    saveConfig,
    syncCotasComGrade,
    addPauta,
    updatePauta,
    deletePauta,
    registrarVenda,
    deleteVenda,
    refetch: fetchAll,
  };
}
