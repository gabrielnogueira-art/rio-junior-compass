import { useState } from 'react';
import { 
  Settings, Plus, Trash2, Edit2, GripVertical, Check, X,
  Type, AlignLeft, Hash, DollarSign, Calendar, Clock, 
  Tag, List, CheckSquare, User, Paperclip, Phone, Mail,
  FileCheck, Database, Layers, Sparkles
} from 'lucide-react';
import { CRMFase, CRMFieldDefinition, CRMFieldType, CRMTag } from '@/types/crm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CRMConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  fases: CRMFase[];
  tags: CRMTag[];
  onCreateFase: (nome: string, cor: string, descricao?: string) => void;
  onUpdateFase: (id: string, updates: Partial<CRMFase>) => void;
  onDeleteFase: (id: string) => void;
  onAddFieldToFase: (faseId: string, campo: Omit<CRMFieldDefinition, 'id'>) => void;
  onDeleteFieldFromFase: (faseId: string, campoId: string) => void;
  onResetToSeed: () => void;
}

const AVAILABLE_FIELD_TYPES: { tipo: CRMFieldType; label: string; icon: any; desc: string }[] = [
  { tipo: 'texto_curto', label: 'Texto curto', icon: Type, desc: 'Uma linha de texto livre' },
  { tipo: 'texto_longo', label: 'Texto longo', icon: AlignLeft, desc: 'Múltiplas linhas para descrições' },
  { tipo: 'moeda', label: 'Moeda (R$)', icon: DollarSign, desc: 'Valores monetários com formatação' },
  { tipo: 'data', label: 'Data', icon: Calendar, desc: 'Seletor de calendário DD/MM/AAAA' },
  { tipo: 'data_hora', label: 'Data e hora', icon: Clock, desc: 'Data combinada com horário' },
  { tipo: 'data_vencimento', label: 'Data de vencimento', icon: Clock, desc: 'Data com alerta de prazo e atraso' },
  { tipo: 'etiquetas', label: 'Etiquetas', icon: Tag, desc: 'Tags multi-seleção coloridas' },
  { tipo: 'selecao_unica', label: 'Seleção de única opção', icon: List, desc: 'Menu suspenso com uma escolha' },
  { tipo: 'selecao_lista', label: 'Seleção de lista', icon: List, desc: 'Lista múltipla de itens' },
  { tipo: 'checkbox', label: 'Checkbox', icon: CheckSquare, desc: 'Caixa de marcação Sim/Não' },
  { tipo: 'responsavel', label: 'Responsável', icon: User, desc: 'Atribuição a membros da federação' },
  { tipo: 'anexo', label: 'Anexo / Documentos', icon: Paperclip, desc: 'Upload de propostas, PDFs e arquivos' },
  { tipo: 'telefone', label: 'Número de telefone', icon: Phone, desc: 'Telefone ou WhatsApp' },
  { tipo: 'email', label: 'Email', icon: Mail, desc: 'Endereço de e-mail com validação' },
  { tipo: 'numerico', label: 'Numérico', icon: Hash, desc: 'Apenas números inteiros ou decimais' },
  { tipo: 'tempo', label: 'Tempo', icon: Clock, desc: 'Duração em minutos ou horas' }
];

export const CRMConfigModal = ({
  isOpen,
  onClose,
  fases,
  tags,
  onCreateFase,
  onUpdateFase,
  onDeleteFase,
  onAddFieldToFase,
  onDeleteFieldFromFase,
  onResetToSeed
}: CRMConfigModalProps) => {
  const [activeTab, setActiveTab] = useState<'fases' | 'campos' | 'etiquetas'>('campos');
  
  // Nova fase state
  const [novaFaseNome, setNovaFaseNome] = useState('');
  const [novaFaseCor, setNovaFaseCor] = useState('#3b82f6');
  const [novaFaseDesc, setNovaFaseDesc] = useState('');

  // Adicionar campo state
  const [targetFaseId, setTargetFaseId] = useState(fases[0]?.id || '');
  const [novoCampoLabel, setNovoCampoLabel] = useState('');
  const [selectedFieldType, setSelectedFieldType] = useState<CRMFieldType>('texto_curto');

  const handleCreateFase = () => {
    if (!novaFaseNome.trim()) return;
    onCreateFase(novaFaseNome.trim(), novaFaseCor, novaFaseDesc);
    setNovaFaseNome('');
    setNovaFaseDesc('');
  };

  const handleAddField = () => {
    if (!novoCampoLabel.trim() || !targetFaseId) return;
    onAddFieldToFase(targetFaseId, {
      label: novoCampoLabel.trim(),
      tipo: selectedFieldType
    });
    setNovoCampoLabel('');
  };

  const currentFaseObj = fases.find(f => f.id === targetFaseId) || fases[0];

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] h-[90vh] p-0 flex flex-col bg-background text-foreground border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/60 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Settings size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Configurações do Pipe — [VPNEG 26] CRM</h2>
              <p className="text-xs text-muted-foreground">
                Personalize fases do pipeline, crie novos campos e configure formulários de acompanhamento.
              </p>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8 text-muted-foreground">
            <X size={16} />
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 border-b border-border bg-muted/10 shrink-0">
            <TabsList className="bg-transparent h-11 p-0 gap-4">
              <TabsTrigger 
                value="campos" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-xs font-semibold"
              >
                Construtor de Formulário & Tipos de Campo
              </TabsTrigger>
              <TabsTrigger 
                value="fases" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-xs font-semibold"
              >
                Fases do Pipeline ({fases.length})
              </TabsTrigger>
              <TabsTrigger 
                value="etiquetas" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-xs font-semibold"
              >
                Etiquetas / Tags ({tags.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Construtor de Formulário & Tipos de Campo (Matching screenshots 00-19-11, 00-19-30, 00-19-50) */}
          <TabsContent value="campos" className="flex-1 grid grid-cols-12 min-h-0 m-0 p-0 overflow-hidden">
            {/* Lado Esquerdo: Paleta de Tipos de Campo Disponíveis */}
            <div className="col-span-4 border-r border-border p-5 overflow-y-auto space-y-3 bg-card/30">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tipos de Campo Disponíveis
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Clique para selecionar o formato do campo
                </p>
              </div>

              <div className="space-y-1.5">
                {AVAILABLE_FIELD_TYPES.map(ft => {
                  const Icon = ft.icon;
                  const isSelected = selectedFieldType === ft.tipo;
                  return (
                    <button
                      key={ft.tipo}
                      onClick={() => setSelectedFieldType(ft.tipo)}
                      className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm' 
                          : 'border-border/60 hover:bg-muted/40 text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`p-1.5 rounded ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <Icon size={14} />
                        </span>
                        <div>
                          <p className="font-semibold leading-tight">{ft.label}</p>
                          <p className="text-[10px] text-muted-foreground">{ft.desc}</p>
                        </div>
                      </div>
                      {isSelected && <Check size={14} className="text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lado Direito: Visualização e Edição da Fase Selecionada */}
            <div className="col-span-8 p-6 overflow-y-auto space-y-5">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Selecione a Fase para Personalizar</Label>
                  <Select value={targetFaseId} onValueChange={setTargetFaseId}>
                    <SelectTrigger className="w-72 h-9 text-xs font-bold bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fases.map(f => (
                        <SelectItem key={f.id} value={f.id}>
                          <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.cor }} />
                            {f.nome} ({f.campos?.length || 0} campos)
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Badge variant="outline" className="text-xs" style={{ borderColor: currentFaseObj?.cor, color: currentFaseObj?.cor }}>
                  {currentFaseObj?.nome}
                </Badge>
              </div>

              {/* Input para adicionar campo selecionado à fase */}
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
                <p className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Plus size={14} className="text-primary" /> Adicionar Novo Campo à Fase
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Nome / Título do Campo</Label>
                    <Input 
                      placeholder="Ex: Link da Proposta, Data da RD, Cota Escolhida..."
                      value={novoCampoLabel}
                      onChange={e => setNovoCampoLabel(e.target.value)}
                      className="h-8 text-xs bg-card"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <Button 
                      size="sm" 
                      onClick={handleAddField}
                      disabled={!novoCampoLabel.trim()}
                      className="h-8 text-xs gap-1.5"
                    >
                      <Plus size={13} /> Inserir Campo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lista dos Campos Atuais da Fase */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Campos Ativos nesta Fase ({currentFaseObj?.campos?.length || 0})
                  </p>
                </div>

                {(!currentFaseObj?.campos || currentFaseObj.campos.length === 0) ? (
                  <div className="text-center py-8 border border-dashed border-border rounded-xl">
                    <p className="text-xs text-muted-foreground">Nenhum campo personalizado cadastrado nesta fase.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentFaseObj.campos.map(campo => {
                      const typeDef = AVAILABLE_FIELD_TYPES.find(t => t.tipo === campo.tipo);
                      const Icon = typeDef?.icon || Type;

                      return (
                        <div 
                          key={campo.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/60 hover:bg-card transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="p-2 rounded bg-muted/60 text-muted-foreground">
                              <Icon size={14} />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                {campo.label}
                                {campo.obrigatorio && (
                                  <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4">Obrigatório</Badge>
                                )}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                Tipo: {typeDef?.label || campo.tipo}
                              </p>
                            </div>
                          </div>

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => onDeleteFieldFromFase(currentFaseObj.id, campo.id)}
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Fases do Pipeline */}
          <TabsContent value="fases" className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Criar Nova Fase */}
            <div className="p-4 rounded-xl border border-border bg-card/40 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Criar Nova Fase no Kanban
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-[11px]">Nome da Fase</Label>
                  <Input 
                    placeholder="Ex: Negociação Final, Onboarding..."
                    value={novaFaseNome}
                    onChange={e => setNovaFaseNome(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Cor de Destaque</Label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={novaFaseCor}
                      onChange={e => setNovaFaseCor(e.target.value)}
                      className="h-8 w-10 p-0 rounded border cursor-pointer"
                    />
                    <Input 
                      value={novaFaseCor}
                      onChange={e => setNovaFaseCor(e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1 flex flex-col justify-end">
                  <Button size="sm" onClick={handleCreateFase} disabled={!novaFaseNome.trim()} className="h-8 text-xs gap-1">
                    <Plus size={14} /> Adicionar Fase
                  </Button>
                </div>
              </div>
            </div>

            {/* Lista de Fases Existentes */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Fases Configuradas (Ordem do Kanban)
              </h3>
              <div className="space-y-2">
                {fases.map((f, idx) => (
                  <div 
                    key={f.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-6">#{idx + 1}</span>
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: f.cor }} />
                      <div>
                        <p className="text-xs font-bold text-foreground">{f.nome}</p>
                        <p className="text-[11px] text-muted-foreground">{f.descricao || 'Sem descrição'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {f.campos?.length || 0} campos
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteFase(f.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Precisa voltar ao padrão original do Pipefy?
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  if (confirm('Restaurar o modelo padrão do Pipefy com todas as fases e parceiros originais?')) {
                    onResetToSeed();
                  }
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Restaurar Padrão Pipefy
              </Button>
            </div>
          </TabsContent>

          {/* TAB 3: Etiquetas / Tags */}
          <TabsContent value="etiquetas" className="flex-1 p-6 overflow-y-auto space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Etiquetas Cadastradas
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tags.map(tag => (
                <div key={tag.id} className="p-3 rounded-lg border border-border bg-card/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tag.cor }} />
                    <span className="text-xs font-semibold text-foreground">{tag.nome}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase font-mono">
                    {tag.categoria || 'geral'}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
