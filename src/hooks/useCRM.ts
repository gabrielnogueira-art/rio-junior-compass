import { useState, useEffect, useCallback } from 'react';
import { crmService } from '@/services/crmService';
import { CRMCard, CRMFase, CRMFieldDefinition, CRMTag, AIParsedMeeting } from '@/types/crm';
import { toast } from '@/hooks/use-toast';

export function useCRM() {
  const [fases, setFases] = useState<CRMFase[]>([]);
  const [cards, setCards] = useState<CRMCard[]>([]);
  const [tags, setTags] = useState<CRMTag[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(() => {
    setLoading(true);
    try {
      setFases(crmService.getFases());
      setCards(crmService.getCards());
      setTags(crmService.getTags());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // --- Cards ---
  const createCard = useCallback((cardData: Partial<CRMCard> & { titulo: string; faseId: string }) => {
    try {
      const created = crmService.createCard(cardData);
      setCards(crmService.getCards());
      toast({ title: 'Parceiro adicionado', description: `"${created.titulo}" foi adicionado com sucesso.` });
      return created;
    } catch (err: any) {
      toast({ title: 'Erro ao criar parceiro', description: err.message, variant: 'destructive' });
      throw err;
    }
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<CRMCard>) => {
    try {
      const updated = crmService.updateCard(id, updates);
      setCards(crmService.getCards());
      toast({ title: 'Parceiro atualizado', description: 'Informações salvas com sucesso.' });
      return updated;
    } catch (err: any) {
      toast({ title: 'Erro ao atualizar parceiro', description: err.message, variant: 'destructive' });
      throw err;
    }
  }, []);

  const moveCard = useCallback((id: string, novaFaseId: string) => {
    try {
      const card = crmService.moveCard(id, novaFaseId);
      const fase = crmService.getFaseById(novaFaseId);
      setCards(crmService.getCards());
      toast({ title: 'Card movido', description: `Mover para fase "${fase?.nome || novaFaseId}"` });
      return card;
    } catch (err: any) {
      toast({ title: 'Erro ao mover card', description: err.message, variant: 'destructive' });
      throw err;
    }
  }, []);

  const deleteCard = useCallback((id: string) => {
    try {
      crmService.deleteCard(id);
      setCards(crmService.getCards());
      toast({ title: 'Card removido', description: 'O parceiro foi excluído do CRM.' });
    } catch (err: any) {
      toast({ title: 'Erro ao excluir card', description: err.message, variant: 'destructive' });
      throw err;
    }
  }, []);

  // --- Fases ---
  const createFase = useCallback((nome: string, cor: string, descricao?: string) => {
    try {
      const nova = crmService.createFase(nome, cor, descricao);
      setFases(crmService.getFases());
      toast({ title: 'Fase criada', description: `Fase "${nome}" adicionada ao Kanban.` });
      return nova;
    } catch (err: any) {
      toast({ title: 'Erro ao criar fase', description: err.message, variant: 'destructive' });
      throw err;
    }
  }, []);

  const updateFase = useCallback((id: string, updates: Partial<CRMFase>) => {
    try {
      const updated = crmService.updateFase(id, updates);
      setFases(crmService.getFases());
      toast({ title: 'Fase atualizada', description: 'Configurações da fase salvas.' });
      return updated;
    } catch (err: any) {
      toast({ title: 'Erro ao atualizar fase', description: err.message, variant: 'destructive' });
      throw err;
    }
  }, []);

  const deleteFase = useCallback((id: string) => {
    try {
      crmService.deleteFase(id);
      setFases(crmService.getFases());
      toast({ title: 'Fase excluída', description: 'Fase removida do pipeline.' });
    } catch (err: any) {
      toast({ title: 'Não foi possível excluir', description: err.message, variant: 'destructive' });
      throw err;
    }
  }, []);

  const reorderFases = useCallback((orderedIds: string[]) => {
    crmService.reorderFases(orderedIds);
    setFases(crmService.getFases());
  }, []);

  // --- Campos Dinâmicos ---
  const addCampoToFase = useCallback((faseId: string, campo: Omit<CRMFieldDefinition, 'id'>) => {
    try {
      const added = crmService.addCampoToFase(faseId, campo);
      setFases(crmService.getFases());
      toast({ title: 'Campo adicionado', description: `Campo "${campo.label}" adicionado à fase.` });
      return added;
    } catch (err: any) {
      toast({ title: 'Erro ao adicionar campo', description: err.message, variant: 'destructive' });
      throw err;
    }
  }, []);

  const deleteCampoFromFase = useCallback((faseId: string, campoId: string) => {
    try {
      crmService.deleteCampoFromFase(faseId, campoId);
      setFases(crmService.getFases());
      toast({ title: 'Campo removido', description: 'O campo foi removido desta fase.' });
    } catch (err: any) {
      toast({ title: 'Erro ao remover campo', description: err.message, variant: 'destructive' });
      throw err;
    }
  }, []);

  // --- IA / Parser ---
  const parseMeeting = useCallback((text: string): AIParsedMeeting => {
    return crmService.parseMeeting(text);
  }, []);

  // Reset
  const resetToSeed = useCallback(() => {
    crmService.resetToSeed();
    loadAll();
    toast({ title: 'Dados redefinidos', description: 'Pipeline restaurado com o modelo padrão.' });
  }, [loadAll]);

  return {
    fases,
    cards,
    tags,
    loading,
    createCard,
    updateCard,
    moveCard,
    deleteCard,
    createFase,
    updateFase,
    deleteFase,
    reorderFases,
    addCampoToFase,
    deleteCampoFromFase,
    parseMeeting,
    resetToSeed,
    reload: loadAll
  };
}
