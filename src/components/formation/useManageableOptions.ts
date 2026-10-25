import { useState, useEffect, useCallback } from 'react';

export interface OptionItem {
  id: string;
  label: string;
  isCustom?: boolean;
  color?: string;
}

export const DEFAULT_TIPOS_MOMENTO: OptionItem[] = [
  { id: 'magna', label: 'Pauta Magna', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  { id: 'paralela', label: 'Pauta Paralela', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  { id: 'credenciamento', label: 'Credenciamento', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
  { id: 'checkin', label: 'Check-in', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
  { id: 'abertura', label: 'Abertura', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  { id: 'almoco_intervalo', label: 'Almoço / Intervalo', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  { id: 'encerramento', label: 'Encerramento', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
  { id: 'happy_hour', label: 'Happy Hour / Integração', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800' },
  { id: 'outro', label: 'Outro', color: 'bg-muted text-muted-foreground border-border' },
];

export const DEFAULT_TEMATICAS_MACRO: OptionItem[] = [
  { id: 'Vendas', label: 'Vendas' },
  { id: 'Gestão de Pessoas', label: 'Gestão de Pessoas' },
  { id: 'Cultura', label: 'Cultura' },
  { id: 'Marketing', label: 'Marketing' },
  { id: 'Financeiro', label: 'Financeiro' },
  { id: 'Estratégia & Liderança', label: 'Estratégia & Liderança' },
  { id: 'Operações & Processos', label: 'Operações & Processos' },
  { id: 'Inovação & IA', label: 'Inovação & IA' },
  { id: 'Outra', label: 'Outra' },
];

export const DEFAULT_MINISTRANTES: OptionItem[] = [
  { id: 'parceiro_vpneg', label: 'Parceiro VPNeg' },
  { id: 'parceiro_presex', label: 'Parceiro PresEx' },
  { id: 'pos_junior', label: 'Pós-Júnior' },
  { id: 'interno', label: 'Interno (RioJunior)' },
  { id: 'convidado_externo', label: 'Convidado Externo' },
  { id: 'outro', label: 'Outro' },
];

const STORAGE_KEY = 'riojunior_grade_custom_options_v2';

interface CustomOptionsStorage {
  tiposMomento: OptionItem[];
  tematicasMacro: OptionItem[];
  ministrantes: OptionItem[];
}

export function useManageableOptions() {
  const [tiposMomento, setTiposMomento] = useState<OptionItem[]>(DEFAULT_TIPOS_MOMENTO);
  const [tematicasMacro, setTematicasMacro] = useState<OptionItem[]>(DEFAULT_TEMATICAS_MACRO);
  const [ministrantes, setMinistrantes] = useState<OptionItem[]>(DEFAULT_MINISTRANTES);

  // Carrega do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: CustomOptionsStorage = JSON.parse(saved);
        if (parsed.tiposMomento?.length) setTiposMomento(parsed.tiposMomento);
        if (parsed.tematicasMacro?.length) setTematicasMacro(parsed.tematicasMacro);
        if (parsed.ministrantes?.length) setMinistrantes(parsed.ministrantes);
      }
    } catch (e) {
      console.warn('Erro ao carregar opções personalizadas do localStorage:', e);
    }
  }, []);

  // Salva no localStorage
  const saveToStorage = useCallback((
    newTipos = tiposMomento,
    newTematicas = tematicasMacro,
    newMinistrantes = ministrantes
  ) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tiposMomento: newTipos,
        tematicasMacro: newTematicas,
        ministrantes: newMinistrantes,
      }));
    } catch (e) {
      console.warn('Erro ao salvar opções personalizadas:', e);
    }
  }, [tiposMomento, tematicasMacro, ministrantes]);

  // Ações para Tipos de Momento
  const addTipoMomento = useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return null;
    const id = trimmed.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_');
    if (tiposMomento.some(t => t.id === id || t.label.toLowerCase() === trimmed.toLowerCase())) {
      return tiposMomento.find(t => t.id === id || t.label.toLowerCase() === trimmed.toLowerCase())!.id;
    }
    const newItem: OptionItem = {
      id,
      label: trimmed,
      isCustom: true,
      color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    };
    const next = [...tiposMomento, newItem];
    setTiposMomento(next);
    saveToStorage(next, tematicasMacro, ministrantes);
    return id;
  }, [tiposMomento, tematicasMacro, ministrantes, saveToStorage]);

  const removeTipoMomento = useCallback((id: string) => {
    const next = tiposMomento.filter(t => t.id !== id);
    setTiposMomento(next);
    saveToStorage(next, tematicasMacro, ministrantes);
  }, [tiposMomento, tematicasMacro, ministrantes, saveToStorage]);

  // Ações para Temáticas Macro
  const addTematicaMacro = useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return null;
    if (tematicasMacro.some(t => t.label.toLowerCase() === trimmed.toLowerCase())) {
      return tematicasMacro.find(t => t.label.toLowerCase() === trimmed.toLowerCase())!.id;
    }
    const newItem: OptionItem = { id: trimmed, label: trimmed, isCustom: true };
    const next = [...tematicasMacro, newItem];
    setTematicasMacro(next);
    saveToStorage(tiposMomento, next, ministrantes);
    return trimmed;
  }, [tiposMomento, tematicasMacro, ministrantes, saveToStorage]);

  const removeTematicaMacro = useCallback((id: string) => {
    const next = tematicasMacro.filter(t => t.id !== id);
    setTematicasMacro(next);
    saveToStorage(tiposMomento, next, ministrantes);
  }, [tiposMomento, tematicasMacro, ministrantes, saveToStorage]);

  // Ações para Ministrantes
  const addMinistrante = useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return null;
    const id = trimmed.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_');
    if (ministrantes.some(m => m.id === id || m.label.toLowerCase() === trimmed.toLowerCase())) {
      return ministrantes.find(m => m.id === id || m.label.toLowerCase() === trimmed.toLowerCase())!.id;
    }
    const newItem: OptionItem = { id, label: trimmed, isCustom: true };
    const next = [...ministrantes, newItem];
    setMinistrantes(next);
    saveToStorage(tiposMomento, tematicasMacro, next);
    return id;
  }, [tiposMomento, tematicasMacro, ministrantes, saveToStorage]);

  const removeMinistrante = useCallback((id: string) => {
    const next = ministrantes.filter(m => m.id !== id);
    setMinistrantes(next);
    saveToStorage(tiposMomento, tematicasMacro, next);
  }, [tiposMomento, tematicasMacro, ministrantes, saveToStorage]);

  // Helper para cor de badge de tipo
  const getTipoColor = useCallback((tipoId: string) => {
    const found = tiposMomento.find(t => t.id === tipoId);
    if (found?.color) return found.color;
    if (tipoId === 'magna') return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200';
    if (tipoId === 'paralela') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200';
    if (tipoId === 'credenciamento' || tipoId === 'checkin') return 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300 border-slate-200';
    if (tipoId === 'abertura') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200';
    if (tipoId === 'almoco_intervalo') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200';
    if (tipoId === 'encerramento') return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200';
    if (tipoId === 'happy_hour') return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200';
    return 'bg-muted text-muted-foreground border-border';
  }, [tiposMomento]);

  const getTipoLabel = useCallback((tipoId: string) => {
    const found = tiposMomento.find(t => t.id === tipoId);
    return found ? found.label : (tipoId.charAt(0).toUpperCase() + tipoId.slice(1).replace(/_/g, ' '));
  }, [tiposMomento]);

  const getMinistranteLabel = useCallback((ministranteId: string) => {
    const found = ministrantes.find(m => m.id === ministranteId);
    return found ? found.label : ministranteId;
  }, [ministrantes]);

  return {
    tiposMomento,
    tematicasMacro,
    ministrantes,
    addTipoMomento,
    removeTipoMomento,
    addTematicaMacro,
    removeTematicaMacro,
    addMinistrante,
    removeMinistrante,
    getTipoColor,
    getTipoLabel,
    getMinistranteLabel,
  };
}
