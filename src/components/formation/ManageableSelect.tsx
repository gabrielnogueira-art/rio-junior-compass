import React, { useState } from 'react';
import { Plus, Trash2, Settings2, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { OptionItem } from './useManageableOptions';
import { Badge } from '@/components/ui/badge';

interface ManageableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: OptionItem[];
  onAddOption: (label: string) => string | null;
  onRemoveOption: (id: string) => void;
  placeholder?: string;
  showBadgeColor?: boolean;
}

export function ManageableSelect({
  label,
  value,
  onChange,
  options,
  onAddOption,
  onRemoveOption,
  placeholder = 'Selecione',
  showBadgeColor = false,
}: ManageableSelectProps) {
  const [manageOpen, setManageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newOptionName, setNewOptionName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newOptionName.trim()) return;
    const newId = onAddOption(newOptionName.trim());
    if (newId) {
      onChange(newId);
    }
    setNewOptionName('');
    setIsAdding(false);
  };

  const selectedOption = options.find(o => o.id === value);

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-foreground">{label}</label>
          <button
            type="button"
            onClick={() => setManageOpen(true)}
            className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            title="Gerenciar opções desta lista"
          >
            <Settings2 size={11} />
            <span>Editar opções</span>
          </button>
        </div>

        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder}>
              {selectedOption ? (
                <span className="flex items-center gap-1.5 truncate">
                  {showBadgeColor && selectedOption.color && (
                    <span className="h-2 w-2 rounded-full bg-primary/70 shrink-0" />
                  )}
                  {selectedOption.label}
                </span>
              ) : (
                placeholder
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {options.map(opt => (
              <SelectItem key={opt.id} value={opt.id}>
                <div className="flex items-center justify-between gap-2 w-full">
                  <span>{opt.label}</span>
                  {opt.isCustom && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 ml-auto text-muted-foreground">
                      Personalizado
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}

            <div className="p-1 border-t border-border mt-1 pt-1">
              {!isAdding ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsAdding(true);
                  }}
                  className="flex items-center gap-1.5 w-full text-xs text-primary font-medium py-1.5 px-2 rounded-md hover:bg-primary/10 transition-colors"
                >
                  <Plus size={13} />
                  <span>+ Adicionar nova opção</span>
                </button>
              ) : (
                <div className="p-1 space-y-1.5" onClick={e => e.stopPropagation()}>
                  <Input
                    size={1}
                    value={newOptionName}
                    onChange={e => setNewOptionName(e.target.value)}
                    placeholder="Nome da nova opção..."
                    className="h-7 text-xs"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAdd(e);
                      } else if (e.key === 'Escape') {
                        setIsAdding(false);
                      }
                    }}
                  />
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px] px-2"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="h-6 text-[10px] px-2"
                      onClick={handleAdd}
                      disabled={!newOptionName.trim()}
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SelectContent>
        </Select>
      </div>

      {/* Modal de Gerenciamento das Opções */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Settings2 size={16} />
              Gerenciar Opções: {label}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-xs text-muted-foreground">
              Adicione novas opções ou remova itens que não façam mais sentido para o evento. As alterações ficam salvas no seu navegador.
            </p>

            <form onSubmit={handleAdd} className="flex gap-2">
              <Input
                value={newOptionName}
                onChange={e => setNewOptionName(e.target.value)}
                placeholder="Ex.: Nova categoria..."
                className="h-9 text-xs"
              />
              <Button type="submit" size="sm" className="h-9 shrink-0 gap-1" disabled={!newOptionName.trim()}>
                <Plus size={14} /> Adicionar
              </Button>
            </form>

            <div className="border border-border rounded-lg max-h-60 overflow-y-auto divide-y divide-border">
              {options.map(opt => (
                <div key={opt.id} className="flex items-center justify-between p-2.5 text-xs hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{opt.label}</span>
                    {opt.isCustom ? (
                      <Badge variant="outline" className="text-[10px] text-cyan-600 border-cyan-300">Personalizado</Badge>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Padrão</span>
                    )}
                  </div>
                  {opt.isCustom ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      onClick={() => onRemoveOption(opt.id)}
                      title="Excluir opção"
                    >
                      <Trash2 size={12} />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm(`Remover a opção padrão "${opt.label}"?`)) {
                          onRemoveOption(opt.id);
                        }
                      }}
                      title="Remover opção"
                    >
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setManageOpen(false)}>Concluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
