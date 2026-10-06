import { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  RotateCcw, 
  FolderTree, 
  Layers, 
  ArrowDownCircle, 
  ArrowUpCircle,
  AlertCircle,
  Save,
  Tag
} from 'lucide-react';
import { TaxonomyRioJunior } from '@/types';
import { toast } from 'sonner';

interface ManageTaxonomyModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxonomy: TaxonomyRioJunior;
  onSaveTaxonomy: (updatedTaxonomy: TaxonomyRioJunior) => void;
  onResetTaxonomy: () => void;
}

export const ManageTaxonomyModal = ({
  isOpen,
  onClose,
  taxonomy,
  onSaveTaxonomy,
  onResetTaxonomy
}: ManageTaxonomyModalProps) => {
  const [activeTipo, setActiveTipo] = useState<'Despesa' | 'Receita'>('Despesa');
  
  // Local working copy of categoriesByType and subcategoriesByCategory
  const [draftCategoriesByType, setDraftCategoriesByType] = useState<{
    Despesa: string[];
    Receita: string[];
  }>({
    Despesa: [],
    Receita: []
  });

  const [draftSubcategoriesByCategory, setDraftSubcategoriesByCategory] = useState<Record<string, string[]>>({});
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Add category state
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Edit category state
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  // Add subcategory state
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  // Edit subcategory state
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [editedSubcategoryName, setEditedSubcategoryName] = useState('');

  // Initialize draft whenever modal opens or taxonomy changes
  useEffect(() => {
    if (isOpen) {
      const catsByType = {
        Despesa: [...(taxonomy?.categoriesByType?.Despesa || [])],
        Receita: [...(taxonomy?.categoriesByType?.Receita || [])]
      };
      
      const subsByCat: Record<string, string[]> = {};
      if (taxonomy?.subcategoriesByCategory) {
        Object.entries(taxonomy.subcategoriesByCategory).forEach(([cat, subs]) => {
          subsByCat[cat] = [...subs];
        });
      }

      setDraftCategoriesByType(catsByType);
      setDraftSubcategoriesByCategory(subsByCat);

      const firstCat = catsByType[activeTipo][0] || '';
      setSelectedCategory(firstCat);
      setEditingCategory(null);
      setEditingSubcategory(null);
      setNewCategoryName('');
      setNewSubcategoryName('');
    }
  }, [isOpen, taxonomy]);

  // When activeTipo changes, select first category of that tipo
  const handleTipoChange = (newTipo: 'Despesa' | 'Receita') => {
    setActiveTipo(newTipo);
    const cats = draftCategoriesByType[newTipo] || [];
    setSelectedCategory(cats[0] || '');
    setEditingCategory(null);
    setEditingSubcategory(null);
  };

  // --- Category Actions ---
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    const currentCats = draftCategoriesByType[activeTipo] || [];
    if (currentCats.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('Esta categoria já existe!');
      return;
    }

    const updatedList = [...currentCats, trimmed];
    setDraftCategoriesByType(prev => ({
      ...prev,
      [activeTipo]: updatedList
    }));

    setDraftSubcategoriesByCategory(prev => ({
      ...prev,
      [trimmed]: prev[trimmed] || []
    }));

    setSelectedCategory(trimmed);
    setNewCategoryName('');
    toast.success(`Categoria "${trimmed}" adicionada!`);
  };

  const handleStartEditCategory = (cat: string) => {
    setEditingCategory(cat);
    setEditedCategoryName(cat);
  };

  const handleSaveEditCategory = (oldCat: string) => {
    const trimmed = editedCategoryName.trim();
    if (!trimmed || trimmed === oldCat) {
      setEditingCategory(null);
      return;
    }

    const currentCats = draftCategoriesByType[activeTipo] || [];
    if (currentCats.some(c => c.toLowerCase() === trimmed.toLowerCase() && c !== oldCat)) {
      toast.error('Já existe outra categoria com este nome!');
      return;
    }

    // Update in categoriesByType
    setDraftCategoriesByType(prev => ({
      ...prev,
      [activeTipo]: prev[activeTipo].map(c => c === oldCat ? trimmed : c)
    }));

    // Update in subcategoriesByCategory
    setDraftSubcategoriesByCategory(prev => {
      const copy = { ...prev };
      const existingSubs = copy[oldCat] || [];
      delete copy[oldCat];
      copy[trimmed] = existingSubs;
      return copy;
    });

    if (selectedCategory === oldCat) {
      setSelectedCategory(trimmed);
    }

    setEditingCategory(null);
    toast.success(`Categoria renomeada para "${trimmed}"`);
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${catToDelete}" e todas as suas subcategorias?`)) {
      return;
    }

    const currentCats = draftCategoriesByType[activeTipo] || [];
    const updatedList = currentCats.filter(c => c !== catToDelete);

    setDraftCategoriesByType(prev => ({
      ...prev,
      [activeTipo]: updatedList
    }));

    setDraftSubcategoriesByCategory(prev => {
      const copy = { ...prev };
      delete copy[catToDelete];
      return copy;
    });

    if (selectedCategory === catToDelete) {
      setSelectedCategory(updatedList[0] || '');
    }

    toast.success(`Categoria "${catToDelete}" excluída.`);
  };

  // --- Subcategory Actions ---
  const currentSubcategories = selectedCategory ? (draftSubcategoriesByCategory[selectedCategory] || []) : [];

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error('Selecione uma categoria primeiro!');
      return;
    }

    const trimmed = newSubcategoryName.trim();
    if (!trimmed) return;

    if (currentSubcategories.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('Esta subcategoria já existe nesta categoria!');
      return;
    }

    const updatedSubs = [...currentSubcategories, trimmed];
    setDraftSubcategoriesByCategory(prev => ({
      ...prev,
      [selectedCategory]: updatedSubs
    }));

    setNewSubcategoryName('');
    toast.success(`Subcategoria "${trimmed}" adicionada!`);
  };

  const handleStartEditSubcategory = (sub: string) => {
    setEditingSubcategory(sub);
    setEditedSubcategoryName(sub);
  };

  const handleSaveEditSubcategory = (oldSub: string) => {
    const trimmed = editedSubcategoryName.trim();
    if (!trimmed || trimmed === oldSub) {
      setEditingSubcategory(null);
      return;
    }

    if (currentSubcategories.some(s => s.toLowerCase() === trimmed.toLowerCase() && s !== oldSub)) {
      toast.error('Já existe outra subcategoria com este nome!');
      return;
    }

    const updatedSubs = currentSubcategories.map(s => s === oldSub ? trimmed : s);
    setDraftSubcategoriesByCategory(prev => ({
      ...prev,
      [selectedCategory]: updatedSubs
    }));

    setEditingSubcategory(null);
    toast.success(`Subcategoria renomeada para "${trimmed}"`);
  };

  const handleDeleteSubcategory = (subToDelete: string) => {
    const updatedSubs = currentSubcategories.filter(s => s !== subToDelete);
    setDraftSubcategoriesByCategory(prev => ({
      ...prev,
      [selectedCategory]: updatedSubs
    }));
    toast.success(`Subcategoria "${subToDelete}" excluída.`);
  };

  // --- Save / Reset Actions ---
  const handleSaveAll = () => {
    // Reconstruct full unique lists
    const allCatsSet = new Set([
      ...draftCategoriesByType.Despesa,
      ...draftCategoriesByType.Receita
    ]);

    const allSubsSet = new Set<string>();
    Object.values(draftSubcategoriesByCategory).forEach(subs => {
      subs.forEach(s => allSubsSet.add(s));
    });

    const updatedTaxonomy: TaxonomyRioJunior = {
      ...taxonomy,
      categorias: Array.from(allCatsSet),
      subcategorias: Array.from(allSubsSet),
      categoriesByType: draftCategoriesByType,
      subcategoriesByCategory: draftSubcategoriesByCategory
    };

    onSaveTaxonomy(updatedTaxonomy);
    toast.success('Estrutura de categorias e subcategorias salva com sucesso!');
    onClose();
  };

  const handleResetToDefaults = () => {
    if (confirm('Deseja restaurar todas as categorias e subcategorias para o padrão original da planilha? Modificações manuais serão desfeitas.')) {
      onResetTaxonomy();
      toast.success('Categorias restauradas para o padrão oficial da RioJunior!');
      onClose();
    }
  };

  if (!isOpen) return null;

  const activeCategories = draftCategoriesByType[activeTipo] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[92vh] animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <FolderTree size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Gerenciar Categorias & Subcategorias
              </h3>
              <p className="text-xs text-muted-foreground">
                Adicione, edite ou exclua as opções oficiais que alimentam os lançamentos e filtros
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tipo Tabs (Despesas / Receitas) */}
        <div className="px-6 pt-4 pb-2 border-b border-border bg-card">
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => handleTipoChange('Despesa')}
              className={`py-2 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border ${
                activeTipo === 'Despesa'
                  ? 'bg-destructive/10 text-destructive border-destructive shadow-sm'
                  : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              <ArrowDownCircle size={16} />
              <span>Despesas ({draftCategoriesByType.Despesa.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleTipoChange('Receita')}
              className={`py-2 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border ${
                activeTipo === 'Receita'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-sm'
                  : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              <ArrowUpCircle size={16} />
              <span>Receitas ({draftCategoriesByType.Receita.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Body: Split Columns */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          
          {/* Column 1: Categorias */}
          <div className="flex flex-col h-full overflow-hidden bg-background/50">
            <div className="p-4 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Tag size={13} className="text-primary" /> Categorias de {activeTipo}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {activeCategories.length} categorias
                </span>
              </div>

              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Nova categoria de ${activeTipo}...`}
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-input bg-card text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                />
                <button
                  type="submit"
                  disabled={!newCategoryName.trim()}
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs flex items-center gap-1 transition-all disabled:opacity-50"
                >
                  <Plus size={14} />
                  <span>Adicionar</span>
                </button>
              </form>
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {activeCategories.length === 0 ? (
                <div className="text-center py-10 px-4 text-muted-foreground text-xs">
                  Nenhuma categoria cadastrada para {activeTipo}.
                </div>
              ) : (
                activeCategories.map(cat => {
                  const isSelected = selectedCategory === cat;
                  const subsCount = (draftSubcategoriesByCategory[cat] || []).length;
                  const isEditingThis = editingCategory === cat;

                  return (
                    <div
                      key={cat}
                      onClick={() => !isEditingThis && setSelectedCategory(cat)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 border-primary shadow-sm font-bold text-primary'
                          : 'bg-card border-border hover:border-primary/40 text-foreground'
                      }`}
                    >
                      {isEditingThis ? (
                        <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editedCategoryName}
                            onChange={e => setEditedCategoryName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEditCategory(cat);
                              if (e.key === 'Escape') setEditingCategory(null);
                            }}
                            autoFocus
                            className="flex-1 px-2.5 py-1 text-xs rounded border border-primary bg-background text-foreground outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditCategory(cat)}
                            className="p-1 rounded bg-primary text-primary-foreground hover:opacity-90"
                            title="Salvar alteração"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="p-1 rounded bg-muted text-muted-foreground hover:bg-muted/80"
                            title="Cancelar"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-xs truncate">{cat}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                              isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                            }`}>
                              {subsCount}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEditCategory(cat);
                              }}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              title="Editar nome"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(cat);
                              }}
                              className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                              title="Excluir categoria"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: Subcategorias */}
          <div className="flex flex-col h-full overflow-hidden bg-background">
            <div className="p-4 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider truncate">
                  <Layers size={13} className="text-blue-500" />
                  {selectedCategory ? `Subcategorias de "${selectedCategory}"` : 'Subcategorias'}
                </span>
                {selectedCategory && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {currentSubcategories.length} itens
                  </span>
                )}
              </div>

              {/* Add Subcategory Form */}
              <form onSubmit={handleAddSubcategory} className="flex gap-2">
                <input
                  type="text"
                  disabled={!selectedCategory}
                  placeholder={selectedCategory ? `Nova subcategoria em ${selectedCategory}...` : 'Selecione uma categoria ao lado...'}
                  value={newSubcategoryName}
                  onChange={e => setNewSubcategoryName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-input bg-card text-foreground text-xs focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!selectedCategory || !newSubcategoryName.trim()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 transition-all disabled:opacity-50"
                >
                  <Plus size={14} />
                  <span>Adicionar</span>
                </button>
              </form>
            </div>

            {/* Subcategories List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {!selectedCategory ? (
                <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center space-y-2">
                  <AlertCircle size={28} className="text-muted-foreground/60" />
                  <p className="text-xs font-medium text-muted-foreground">
                    Selecione uma categoria à esquerda para visualizar e gerenciar suas subcategorias.
                  </p>
                </div>
              ) : currentSubcategories.length === 0 ? (
                <div className="text-center py-10 px-4 text-muted-foreground text-xs space-y-1">
                  <p>Nenhuma subcategoria vinculada à categoria <strong>{selectedCategory}</strong>.</p>
                  <p className="text-[11px] text-muted-foreground/80">Use o campo acima para adicionar.</p>
                </div>
              ) : (
                currentSubcategories.map(sub => {
                  const isEditingThis = editingSubcategory === sub;

                  return (
                    <div
                      key={sub}
                      className="group flex items-center justify-between p-2.5 rounded-xl border border-border/80 bg-card hover:border-blue-500/40 transition-all"
                    >
                      {isEditingThis ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={editedSubcategoryName}
                            onChange={e => setEditedSubcategoryName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEditSubcategory(sub);
                              if (e.key === 'Escape') setEditingSubcategory(null);
                            }}
                            autoFocus
                            className="flex-1 px-2.5 py-1 text-xs rounded border border-blue-500 bg-background text-foreground outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditSubcategory(sub)}
                            className="p-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                            title="Salvar alteração"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSubcategory(null)}
                            className="p-1 rounded bg-muted text-muted-foreground hover:bg-muted/80"
                            title="Cancelar"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs text-foreground font-medium truncate">{sub}</span>

                          <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleStartEditSubcategory(sub)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              title="Editar nome"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubcategory(sub)}
                              className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                              title="Excluir subcategoria"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/30">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-input bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            title="Voltar para a lista oficial original de categorias da planilha"
          >
            <RotateCcw size={13} />
            <span>Restaurar Padrões da Planilha</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-input bg-background hover:bg-muted text-foreground text-xs font-semibold transition-all"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow"
            >
              <Save size={15} />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
