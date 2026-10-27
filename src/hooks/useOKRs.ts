import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OKREstrategica, Objetivo, KeyResult, Ciclo } from '@/types';
import { toast } from 'sonner';

const STORAGE_KEYS = {
  OKRS: 'riojunior_okrs_v2',
  OBJETIVOS: 'riojunior_objetivos_v2',
  KRS: 'riojunior_krs_v2',
  CICLOS: 'riojunior_ciclos_v2'
};

// Dados oficiais extraídos de [6. Estratégia / OKR's Estratégicas.pdf]
export const INITIAL_OKRS_ESTRATEGICAS_2026: OKREstrategica[] = [
  {
    id: 'okr_est_001',
    titulo: 'Desenvolver a maturidade organizacional da RioJunior',
    descricao: 'Aprimoramento contínuo da governança, saúde financeira, processos internos e formação de lideranças.',
    ano: 2026
  },
  {
    id: 'okr_est_002',
    titulo: 'Posicionar a RioJunior como protagonista no MEJ Brasil',
    descricao: 'Liderança e representatividade através de parcerias estratégicas, editais, oportunidades de mercado e projetos de impacto.',
    ano: 2026
  },
  {
    id: 'okr_est_003',
    titulo: 'Consolidar uma Federação que gere evolução e desenvolvimento sustentável às EJs da Rede',
    descricao: 'Crescimento e fortalecimento do ecossistema com foco em federação de novas EJs, selo EJ, maturidade e transição de cluster.',
    ano: 2026
  },
  {
    id: 'okr_est_004',
    titulo: 'Garantir acesso amplo, estruturado e qualificado à vivência empresarial para as EJs da rede.',
    descricao: 'Democratização do acesso aos eventos, acessibilidade logística e econômica e excelência de experiência e conteúdo.',
    ano: 2026
  }
];

export const INITIAL_OBJETIVOS_2026: Objetivo[] = [
  {
    id: 'obj_est_001',
    okrEstrategicaId: 'okr_est_001',
    titulo: 'Desenvolver a maturidade organizacional da RioJunior',
    descricao: 'Governança, faturamento, caixa mínimo e estruturação de processos.',
    nivel: 'estrategico'
  },
  {
    id: 'obj_est_002',
    okrEstrategicaId: 'okr_est_002',
    titulo: 'Posicionar a RioJunior como protagonista no MEJ Brasil',
    descricao: 'Oportunidades externas, parcerias institucionais e projetos de impacto social.',
    nivel: 'estrategico'
  },
  {
    id: 'obj_est_003',
    okrEstrategicaId: 'okr_est_003',
    titulo: 'Consolidar uma Federação que gere evolução e desenvolvimento sustentável às EJs da Rede',
    descricao: 'Expansão da rede, maturidade das EJs e evolução de cluster.',
    nivel: 'estrategico'
  },
  {
    id: 'obj_est_004',
    okrEstrategicaId: 'okr_est_004',
    titulo: 'Garantir acesso amplo, estruturado e qualificado à vivência empresarial para as EJs da rede.',
    descricao: 'Presença das EJs em eventos, acessibilidade logística/econômica e CSAT.',
    nivel: 'estrategico'
  }
];

export const INITIAL_KEY_RESULTS_2026: KeyResult[] = [
  // Objetivo 1
  {
    id: 'kr_001',
    objetivoId: 'obj_est_001',
    titulo: 'Garantir ao menos 250K de faturamento anual',
    tipoMetrica: 'valor',
    meta: 25000000, // R$ 250.000,00
    atual: 5499673, // R$ 54.996,73 (22%)
    unidade: 'R$'
  },
  {
    id: 'kr_002',
    objetivoId: 'obj_est_001',
    titulo: 'Alcançar 50K de caixa mínimo em Dezembro',
    tipoMetrica: 'valor',
    meta: 5000000, // R$ 50.000,00
    atual: 5538305, // R$ 55.383,05 (100%)
    unidade: 'R$'
  },
  {
    id: 'kr_003',
    objetivoId: 'obj_est_001',
    titulo: 'Ter 2 processos mapeados e estruturados por frente até Novembro',
    tipoMetrica: 'quantidade',
    meta: 46,
    atual: 8, // 17%
    unidade: 'processos'
  },
  {
    id: 'kr_004',
    objetivoId: 'obj_est_001',
    titulo: 'Garantir que cada Diretoria da RioJunior tenha ao menos 1 candidato saindo do Time',
    tipoMetrica: 'quantidade',
    meta: 5,
    atual: 4, // 80%
    unidade: 'diretorias'
  },

  // Objetivo 2
  {
    id: 'kr_005',
    objetivoId: 'obj_est_002',
    titulo: 'Impactar 20 EJs por meio de oportunidades externas (projetos, editais, hackatons, parcerias) geradas pela Federação',
    tipoMetrica: 'quantidade',
    meta: 20,
    atual: 8, // 40%
    unidade: 'EJs'
  },
  {
    id: 'kr_006',
    objetivoId: 'obj_est_002',
    titulo: 'Firmar 2 parcerias com organizações institucionais ou de mercado, sem ações fechadas à no mínimo 3 anos, com pelo menos uma iniciativa concreta',
    tipoMetrica: 'quantidade',
    meta: 2,
    atual: 2, // 100%
    unidade: 'parcerias'
  },
  {
    id: 'kr_007',
    objetivoId: 'obj_est_002',
    titulo: 'Ter ao menos 8 Projetos de Impacto aprovados na rede até o dia 12/12/2026',
    tipoMetrica: 'quantidade',
    meta: 8,
    atual: 2, // 25%
    unidade: 'projetos'
  },

  // Objetivo 3
  {
    id: 'kr_008',
    objetivoId: 'obj_est_003',
    titulo: 'Ter em Dezembro ao menos 74 EJs na Rede',
    tipoMetrica: 'quantidade',
    meta: 74,
    atual: 70, // 95%
    unidade: 'EJs'
  },
  {
    id: 'kr_009',
    objetivoId: 'obj_est_003',
    titulo: 'Ter 70% das EJs Federadas Protagonista ou Excelente até Novembro',
    tipoMetrica: 'quantidade',
    meta: 52,
    atual: 20, // 38%
    unidade: 'EJs'
  },
  {
    id: 'kr_010',
    objetivoId: 'obj_est_003',
    titulo: 'Garantir que 15 EJs evoluam de cluster até Dezembro',
    tipoMetrica: 'quantidade',
    meta: 15,
    atual: 6, // 40%
    unidade: 'EJs'
  },

  // Objetivo 4
  {
    id: 'kr_011',
    objetivoId: 'obj_est_004',
    titulo: 'Garantir que 60% das EJs da Rede estejam presentes em eventos.',
    tipoMetrica: 'quantidade',
    meta: 45,
    atual: 45, // 100%
    unidade: 'EJs'
  },
  {
    id: 'kr_012',
    objetivoId: 'obj_est_004',
    titulo: 'Garantir que 16 EJs tenham sua presença viabilizada em eventos por meio de ações de acessibilidade econômica e logística.',
    tipoMetrica: 'quantidade',
    meta: 16,
    atual: 14, // 88%
    unidade: 'EJs'
  },
  {
    id: 'kr_013',
    objetivoId: 'obj_est_004',
    titulo: 'Atingir CSAT com média mínima de 4,3 nos nossos 6 eventos do ano',
    tipoMetrica: 'quantidade',
    meta: 4.3,
    atual: 3.075, // 72%
    unidade: 'CSAT'
  }
];

export const useOKRs = () => {
  const [okrsEstrategicas, setOkrsEstrategicas] = useState<OKREstrategica[]>(() => {
    if (typeof window === 'undefined') return INITIAL_OKRS_ESTRATEGICAS_2026;
    const cached = localStorage.getItem(STORAGE_KEYS.OKRS);
    if (cached) {
      try { return JSON.parse(cached); } catch { }
    }
    return INITIAL_OKRS_ESTRATEGICAS_2026;
  });

  const [objetivos, setObjetivos] = useState<Objetivo[]>(() => {
    if (typeof window === 'undefined') return INITIAL_OBJETIVOS_2026;
    const cached = localStorage.getItem(STORAGE_KEYS.OBJETIVOS);
    if (cached) {
      try { return JSON.parse(cached); } catch { }
    }
    return INITIAL_OBJETIVOS_2026;
  });

  const [keyResults, setKeyResults] = useState<KeyResult[]>(() => {
    if (typeof window === 'undefined') return INITIAL_KEY_RESULTS_2026;
    const cached = localStorage.getItem(STORAGE_KEYS.KRS);
    if (cached) {
      try { return JSON.parse(cached); } catch { }
    }
    return INITIAL_KEY_RESULTS_2026;
  });

  const [ciclos, setCiclos] = useState<Ciclo[]>(() => {
    if (typeof window === 'undefined') return [];
    const cached = localStorage.getItem(STORAGE_KEYS.CICLOS);
    if (cached) {
      try { return JSON.parse(cached); } catch { }
    }
    return [];
  });

  const [loading, setLoading] = useState(false);

  // Sincroniza dados com o Supabase com fallback seguro para estado local
  const fetchData = async () => {
    try {
      // 1. OKRs Estratégicas
      const { data: okrsData } = await supabase
        .from('okrs_estrategicas')
        .select('*')
        .order('ano', { ascending: false });

      // 2. Objetivos
      const { data: objetivosData } = await supabase
        .from('objetivos')
        .select('*')
        .order('created_at', { ascending: true });

      // 3. Key Results
      const { data: krsData } = await supabase
        .from('key_results')
        .select('*')
        .order('created_at', { ascending: true });

      // 4. Ciclos
      const { data: ciclosData } = await supabase
        .from('ciclos')
        .select('*')
        .order('ano', { ascending: false })
        .order('numero', { ascending: true });

      if (okrsData && okrsData.length > 0) {
        const mappedOKRs = okrsData.map(okr => ({
          id: okr.id,
          titulo: okr.titulo,
          descricao: okr.descricao || undefined,
          ano: okr.ano
        }));
        setOkrsEstrategicas(mappedOKRs);
        localStorage.setItem(STORAGE_KEYS.OKRS, JSON.stringify(mappedOKRs));
      } else {
        localStorage.setItem(STORAGE_KEYS.OKRS, JSON.stringify(INITIAL_OKRS_ESTRATEGICAS_2026));
      }

      if (objetivosData && objetivosData.length > 0) {
        const mappedObjs = objetivosData.map(obj => ({
          id: obj.id,
          titulo: obj.titulo,
          descricao: obj.descricao || undefined,
          nivel: obj.nivel as Objetivo['nivel'],
          okrEstrategicaId: obj.okr_estrategica_id || undefined,
          diretoria: obj.diretoria || undefined,
          objetivoPaiId: obj.objetivo_pai_id || undefined,
          cicloId: obj.ciclo_id || undefined
        }));
        setObjetivos(mappedObjs);
        localStorage.setItem(STORAGE_KEYS.OBJETIVOS, JSON.stringify(mappedObjs));
      } else {
        localStorage.setItem(STORAGE_KEYS.OBJETIVOS, JSON.stringify(INITIAL_OBJETIVOS_2026));
      }

      if (krsData && krsData.length > 0) {
        const mappedKRs = krsData.map(kr => ({
          id: kr.id,
          objetivoId: kr.objetivo_id,
          titulo: kr.titulo,
          descricao: kr.descricao || undefined,
          tipoMetrica: kr.tipo_metrica as KeyResult['tipoMetrica'],
          meta: Number(kr.meta),
          atual: Number(kr.atual),
          unidade: kr.unidade || undefined
        }));
        setKeyResults(mappedKRs);
        localStorage.setItem(STORAGE_KEYS.KRS, JSON.stringify(mappedKRs));
      } else {
        localStorage.setItem(STORAGE_KEYS.KRS, JSON.stringify(INITIAL_KEY_RESULTS_2026));
      }

      if (ciclosData && ciclosData.length > 0) {
        const mappedCiclos = ciclosData.map(c => ({
          id: c.id,
          nome: c.nome,
          tipo: c.tipo as Ciclo['tipo'],
          numero: c.numero,
          ano: c.ano,
          dataInicio: c.data_inicio || undefined,
          dataFim: c.data_fim || undefined
        }));
        setCiclos(mappedCiclos);
        localStorage.setItem(STORAGE_KEYS.CICLOS, JSON.stringify(mappedCiclos));
      }
    } catch (error: any) {
      console.warn('Conexão remota Supabase indisponível, usando dados locais de OKRs:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD Ciclos
  const createCiclo = async (data: Omit<Ciclo, 'id'>) => {
    const tempId = 'ciclo_' + Date.now().toString(36);
    const newCicloItem: Ciclo = { ...data, id: tempId };
    setCiclos(prev => {
      const updated = [...prev, newCicloItem];
      localStorage.setItem(STORAGE_KEYS.CICLOS, JSON.stringify(updated));
      return updated;
    });

    try {
      const { data: newCiclo, error } = await supabase
        .from('ciclos')
        .insert({
          nome: data.nome,
          tipo: data.tipo,
          numero: data.numero,
          ano: data.ano,
          data_inicio: data.dataInicio || null,
          data_fim: data.dataFim || null
        })
        .select()
        .single();

      if (!error && newCiclo) {
        setCiclos(prev => prev.map(c => c.id === tempId ? { ...c, id: newCiclo.id } : c));
      }
      toast.success('Ciclo criado com sucesso!');
      return newCiclo || newCicloItem;
    } catch {
      toast.success('Ciclo salvo localmente!');
      return newCicloItem;
    }
  };

  const updateCiclo = async (id: string, data: Partial<Ciclo>) => {
    setCiclos(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...data } : c);
      localStorage.setItem(STORAGE_KEYS.CICLOS, JSON.stringify(updated));
      return updated;
    });

    try {
      const updateData: any = {};
      if (data.nome !== undefined) updateData.nome = data.nome;
      if (data.tipo !== undefined) updateData.tipo = data.tipo;
      if (data.numero !== undefined) updateData.numero = data.numero;
      if (data.ano !== undefined) updateData.ano = data.ano;
      if (data.dataInicio !== undefined) updateData.data_inicio = data.dataInicio || null;
      if (data.dataFim !== undefined) updateData.data_fim = data.dataFim || null;

      await supabase.from('ciclos').update(updateData).eq('id', id);
    } catch {}
    toast.success('Ciclo atualizado!');
  };

  const deleteCiclo = async (id: string) => {
    setCiclos(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CICLOS, JSON.stringify(updated));
      return updated;
    });
    try {
      await supabase.from('ciclos').delete().eq('id', id);
    } catch {}
    toast.success('Ciclo excluído!');
  };

  // CRUD OKRs Estratégicas
  const createOKREstrategica = async (data: Omit<OKREstrategica, 'id'>) => {
    const tempId = 'okr_' + Date.now().toString(36);
    const newOKR: OKREstrategica = { ...data, id: tempId };
    setOkrsEstrategicas(prev => {
      const updated = [...prev, newOKR];
      localStorage.setItem(STORAGE_KEYS.OKRS, JSON.stringify(updated));
      return updated;
    });

    try {
      const { data: created, error } = await supabase
        .from('okrs_estrategicas')
        .insert({
          titulo: data.titulo,
          descricao: data.descricao || null,
          ano: data.ano
        })
        .select()
        .single();

      if (!error && created) {
        setOkrsEstrategicas(prev => prev.map(o => o.id === tempId ? { ...o, id: created.id } : o));
      }
      toast.success('OKR estratégica criada!');
      return created || newOKR;
    } catch {
      toast.success('OKR salva localmente!');
      return newOKR;
    }
  };

  const updateOKREstrategica = async (id: string, data: Partial<OKREstrategica>) => {
    setOkrsEstrategicas(prev => {
      const updated = prev.map(o => o.id === id ? { ...o, ...data } : o);
      localStorage.setItem(STORAGE_KEYS.OKRS, JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase
        .from('okrs_estrategicas')
        .update({
          titulo: data.titulo,
          descricao: data.descricao || null,
          ano: data.ano
        })
        .eq('id', id);
    } catch {}
    toast.success('OKR estratégica atualizada!');
  };

  const deleteOKREstrategica = async (id: string) => {
    setOkrsEstrategicas(prev => {
      const updated = prev.filter(o => o.id !== id);
      localStorage.setItem(STORAGE_KEYS.OKRS, JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase.from('okrs_estrategicas').delete().eq('id', id);
    } catch {}
    toast.success('OKR excluída!');
  };

  // CRUD Objetivos
  const createObjetivo = async (data: Omit<Objetivo, 'id'>) => {
    const tempId = 'obj_' + Date.now().toString(36);
    const newObj: Objetivo = { ...data, id: tempId };
    setObjetivos(prev => {
      const updated = [...prev, newObj];
      localStorage.setItem(STORAGE_KEYS.OBJETIVOS, JSON.stringify(updated));
      return updated;
    });

    try {
      const { data: created, error } = await supabase
        .from('objetivos')
        .insert({
          titulo: data.titulo,
          descricao: data.descricao || null,
          nivel: data.nivel,
          okr_estrategica_id: data.okrEstrategicaId || null,
          diretoria: data.diretoria || null,
          objetivo_pai_id: data.objetivoPaiId || null,
          ciclo_id: data.cicloId || null
        })
        .select()
        .single();

      if (!error && created) {
        setObjetivos(prev => prev.map(o => o.id === tempId ? { ...o, id: created.id } : o));
      }
      toast.success('Objetivo criado!');
      return created || newObj;
    } catch {
      toast.success('Objetivo salvo localmente!');
      return newObj;
    }
  };

  const updateObjetivo = async (id: string, data: Partial<Objetivo>) => {
    setObjetivos(prev => {
      const updated = prev.map(o => o.id === id ? { ...o, ...data } : o);
      localStorage.setItem(STORAGE_KEYS.OBJETIVOS, JSON.stringify(updated));
      return updated;
    });

    try {
      const updateData: any = {};
      if (data.titulo !== undefined) updateData.titulo = data.titulo;
      if (data.descricao !== undefined) updateData.descricao = data.descricao || null;
      if (data.nivel !== undefined) updateData.nivel = data.nivel;
      if (data.okrEstrategicaId !== undefined) updateData.okr_estrategica_id = data.okrEstrategicaId || null;
      if (data.diretoria !== undefined) updateData.diretoria = data.diretoria || null;
      if (data.objetivoPaiId !== undefined) updateData.objetivo_pai_id = data.objetivoPaiId || null;
      if (data.cicloId !== undefined) updateData.ciclo_id = data.cicloId || null;

      await supabase.from('objetivos').update(updateData).eq('id', id);
    } catch {}
    toast.success('Objetivo atualizado!');
  };

  const deleteObjetivo = async (id: string) => {
    setObjetivos(prev => {
      const updated = prev.filter(o => o.id !== id);
      localStorage.setItem(STORAGE_KEYS.OBJETIVOS, JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase.from('objetivos').delete().eq('id', id);
    } catch {}
    toast.success('Objetivo excluído!');
  };

  // CRUD Key Results
  const createKeyResult = async (data: Omit<KeyResult, 'id'>) => {
    const tempId = 'kr_' + Date.now().toString(36);
    const newKR: KeyResult = { ...data, id: tempId };
    setKeyResults(prev => {
      const updated = [...prev, newKR];
      localStorage.setItem(STORAGE_KEYS.KRS, JSON.stringify(updated));
      return updated;
    });

    try {
      const { data: created, error } = await supabase
        .from('key_results')
        .insert({
          objetivo_id: data.objetivoId,
          titulo: data.titulo,
          descricao: data.descricao || null,
          tipo_metrica: data.tipoMetrica,
          meta: data.meta,
          atual: data.atual || 0,
          unidade: data.unidade || null
        })
        .select()
        .single();

      if (!error && created) {
        setKeyResults(prev => prev.map(k => k.id === tempId ? { ...k, id: created.id } : k));
      }
      toast.success('Key Result criado!');
      return created || newKR;
    } catch {
      toast.success('Key Result salvo localmente!');
      return newKR;
    }
  };

  const updateKeyResult = async (id: string, data: Partial<KeyResult>) => {
    setKeyResults(prev => {
      const updated = prev.map(kr => kr.id === id ? { ...kr, ...data } : kr);
      localStorage.setItem(STORAGE_KEYS.KRS, JSON.stringify(updated));
      return updated;
    });

    try {
      const updateData: any = {};
      if (data.titulo !== undefined) updateData.titulo = data.titulo;
      if (data.descricao !== undefined) updateData.descricao = data.descricao || null;
      if (data.tipoMetrica !== undefined) updateData.tipo_metrica = data.tipoMetrica;
      if (data.meta !== undefined) updateData.meta = data.meta;
      if (data.atual !== undefined) updateData.atual = data.atual;
      if (data.unidade !== undefined) updateData.unidade = data.unidade || null;

      await supabase.from('key_results').update(updateData).eq('id', id);
    } catch {}
    toast.success('Key Result atualizado!');
  };

  const deleteKeyResult = async (id: string) => {
    setKeyResults(prev => {
      const updated = prev.filter(kr => kr.id !== id);
      localStorage.setItem(STORAGE_KEYS.KRS, JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase.from('key_results').delete().eq('id', id);
    } catch {}
    toast.success('Key Result excluído!');
  };

  // Funções Auxiliares
  const getObjetivosByOKR = (okrId: string) => {
    return objetivos.filter(obj => obj.okrEstrategicaId === okrId && obj.nivel === 'estrategico');
  };

  const getObjetivosByDiretoriaAndCiclo = (diretoria: string, cicloId?: string) => {
    return objetivos.filter(obj =>
      obj.diretoria === diretoria &&
      obj.nivel === 'tatico' &&
      (!cicloId || obj.cicloId === cicloId)
    );
  };

  const getKeyResultsByObjetivo = (objetivoId: string) => {
    return keyResults.filter(kr => kr.objetivoId === objetivoId);
  };

  const calculateProgress = (krs: KeyResult[]) => {
    if (krs.length === 0) return 0;
    const totalProgress = krs.reduce((acc, kr) => {
      const progress = kr.meta > 0 ? (kr.atual / kr.meta) * 100 : 0;
      return acc + Math.min(progress, 100);
    }, 0);
    return Math.round(totalProgress / krs.length);
  };

  const countCompletedKRs = (krs: KeyResult[]) => {
    return krs.filter(kr => kr.atual >= kr.meta).length;
  };

  return {
    okrsEstrategicas,
    objetivos,
    keyResults,
    ciclos,
    loading,
    refetch: fetchData,
    createCiclo,
    updateCiclo,
    deleteCiclo,
    createOKREstrategica,
    updateOKREstrategica,
    deleteOKREstrategica,
    createObjetivo,
    updateObjetivo,
    deleteObjetivo,
    createKeyResult,
    updateKeyResult,
    deleteKeyResult,
    getObjetivosByOKR,
    getObjetivosByDiretoriaAndCiclo,
    getKeyResultsByObjetivo,
    calculateProgress,
    countCompletedKRs
  };
};
