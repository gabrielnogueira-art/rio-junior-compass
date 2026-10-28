import { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, User, Phone, Mail, Tag, Paperclip, 
  Sparkles, Trash2, CheckCircle2, ChevronRight, Plus, 
  AlertCircle, Building2, FileText, CheckSquare, DollarSign,
  ArrowRight, ShieldAlert, Share2, MoreVertical
} from 'lucide-react';
import { CRMCard, CRMFase, CRMFieldDefinition, CRMFieldType, CRMTag } from '@/types/crm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CRMCardModalProps {
  card: CRMCard | null;
  fases: CRMFase[];
  tags: CRMTag[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<CRMCard>) => void;
  onMove: (id: string, novaFaseId: string) => void;
  onDelete: (id: string) => void;
  onAddFieldToFase: (faseId: string, campo: Omit<CRMFieldDefinition, 'id'>) => void;
}

export const CRMCardModal = ({
  card,
  fases,
  tags,
  isOpen,
  onClose,
  onUpdate,
  onMove,
  onDelete,
  onAddFieldToFase
}: CRMCardModalProps) => {
  if (!card) return null;

  const currentFase = fases.find(f => f.id === card.faseId) || fases[0];
  
  // Local state for editing fields
  const [titulo, setTitulo] = useState(card.titulo);
  const [responsavelNome, setResponsavelNome] = useState(card.responsavelNome || '');
  const [pontoContato, setPontoContato] = useState(card.pontoContato || '');
  const [email, setEmail] = useState(card.email || '');
  const [dataAbertura, setDataAbertura] = useState(card.dataAbertura || '');
  const [dataVencimento, setDataVencimento] = useState(card.dataVencimento || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(card.etiquetas || []);
  const [valores, setValores] = useState<Record<string, any>>(card.valores || {});
  const [activeTab, setActiveTab] = useState<'parceiro' | 'atividades' | 'anexos' | 'historico'>('parceiro');

  // Novo campo popover
  const [novoCampoOpen, setNovoCampoOpen] = useState(false);
  const [novoCampoLabel, setNovoCampoLabel] = useState('');
  const [novoCampoTipo, setNovoCampoTipo] = useState<CRMFieldType>('texto_curto');

  useEffect(() => {
    if (card) {
      setTitulo(card.titulo);
      setResponsavelNome(card.responsavelNome || '');
      setPontoContato(card.pontoContato || '');
      setEmail(card.email || '');
      setDataAbertura(card.dataAbertura || '');
      setDataVencimento(card.dataVencimento || '');
      setSelectedTags(card.etiquetas || []);
      setValores(card.valores || {});
    }
  }, [card]);

  const handleFieldValueChange = (fieldId: string, val: any) => {
    setValores(prev => ({ ...prev, [fieldId]: val }));
  };

  const handleSave = () => {
    onUpdate(card.id, {
      titulo,
      responsavelNome,
      pontoContato,
      email,
      dataAbertura,
      dataVencimento,
      etiquetas: selectedTags,
      valores
    });
  };

  const handleToggleTag = (tagNome: string) => {
    setSelectedTags(prev => 
      prev.includes(tagNome) ? prev.filter(t => t !== tagNome) : [...prev, tagNome]
    );
  };

  const handleCriarCampo = () => {
    if (!novoCampoLabel.trim()) return;
    onAddFieldToFase(currentFase.id, {
      label: novoCampoLabel.trim(),
      tipo: novoCampoTipo
    });
    setNovoCampoLabel('');
    setNovoCampoOpen(false);
  };

  // Sugestão de IA para próxima fase
  const handleAIMoveSuggest = () => {
    const nextFaseIndex = fases.findIndex(f => f.id === currentFase.id) + 1;
    if (nextFaseIndex < fases.length) {
      onMove(card.id, fases[nextFaseIndex].id);
    }
  };

  const formatCurrency = (val: any) => {
    if (val === undefined || val === null || val === '') return '';
    const num = Number(val);
    if (isNaN(num)) return val;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[92vh] h-[92vh] p-0 flex flex-col overflow-hidden bg-background text-foreground border-border shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/60 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              <Building2 size={18} />
            </div>
            <div>
              <Input 
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                onBlur={handleSave}
                className="text-lg font-bold h-8 px-2 border-transparent hover:border-border focus:border-primary max-w-sm"
              />
              <div className="flex items-center gap-2 mt-0.5 px-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <User size={11} /> {responsavelNome || 'Sem responsável'}
                </span>
                {dataVencimento && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Clock size={11} /> Vencimento: {dataVencimento}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleSave} className="gap-1.5 h-8">
              <CheckCircle2 size={14} className="text-emerald-500" /> Salvar alterações
            </Button>
            <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8 text-muted-foreground">
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Sub-bar with Pipefy badges & tabs */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-border/60 bg-muted/20 text-xs shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-medium">Etiquetas:</span>
            {selectedTags.map(tag => {
              const tagDef = tags.find(t => t.nome === tag);
              return (
                <Badge 
                  key={tag}
                  variant="outline"
                  className="gap-1 text-[11px] font-medium"
                  style={{ borderColor: tagDef?.cor, color: tagDef?.cor }}
                >
                  {tag}
                  <button onClick={() => handleToggleTag(tag)} className="hover:opacity-75">×</button>
                </Badge>
              );
            })}

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground">
                  <Plus size={12} className="mr-1" /> Adicionar etiqueta
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 space-y-1">
                <p className="text-xs font-semibold px-2 py-1 text-muted-foreground">Selecione etiquetas</p>
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {tags.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleToggleTag(t.nome)}
                      className="w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between hover:bg-muted"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.cor }} />
                        {t.nome}
                      </span>
                      {selectedTags.includes(t.nome) && <CheckCircle2 size={12} className="text-primary" />}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant={activeTab === 'parceiro' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => setActiveTab('parceiro')}
            >
              Parceiro Potencial
            </Button>
            <Button 
              variant={activeTab === 'anexos' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => setActiveTab('anexos')}
            >
              Anexos {card.anexos?.length ? `(${card.anexos.length})` : ''}
            </Button>
            <Button 
              variant={activeTab === 'historico' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => setActiveTab('historico')}
            >
              Histórico
            </Button>
          </div>
        </div>

        {/* 3-Column Body (Pipefy style) */}
        <div className="flex-1 grid grid-cols-12 min-h-0 overflow-hidden">
          {/* Coluna 1: Formulário Inicial (Left Pane - 4 cols) */}
          <div className="col-span-4 border-r border-border p-5 overflow-y-auto space-y-4 bg-card/30">
            <div className="border-b border-border/70 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Building2 size={14} className="text-primary" /> Formulário Inicial
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Dados cadastrais e informações de captação
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground">Nome da Empresa / Parceiro</Label>
                <Input 
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  onBlur={handleSave}
                  className="h-8 text-xs bg-card"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground">Responsável Interno</Label>
                <Input 
                  value={responsavelNome}
                  onChange={e => setResponsavelNome(e.target.value)}
                  onBlur={handleSave}
                  placeholder="Ex: Rian Mendes, Presidência..."
                  className="h-8 text-xs bg-card"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Phone size={12} /> Ponto de Contato (Telefone/WhatsApp)
                </Label>
                <Input 
                  value={pontoContato}
                  onChange={e => setPontoContato(e.target.value)}
                  onBlur={handleSave}
                  placeholder="+55 21 99999-9999"
                  className="h-8 text-xs bg-card"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Mail size={12} /> E-mail de Contato
                </Label>
                <Input 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={handleSave}
                  placeholder="contato@empresa.com"
                  className="h-8 text-xs bg-card"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} /> Abertura
                  </Label>
                  <Input 
                    type="date"
                    value={dataAbertura}
                    onChange={e => setDataAbertura(e.target.value)}
                    onBlur={handleSave}
                    className="h-8 text-xs bg-card"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> Vencimento
                  </Label>
                  <Input 
                    type="date"
                    value={dataVencimento}
                    onChange={e => setDataVencimento(e.target.value)}
                    onBlur={handleSave}
                    className="h-8 text-xs bg-card"
                  />
                </div>
              </div>
            </div>

            {/* Quick Histórico Box */}
            <div className="pt-3 border-t border-border/60">
              <p className="text-[11px] font-semibold text-muted-foreground mb-2">Fase Atual & Histórico</p>
              <div className="rounded-lg border border-border p-3 bg-card/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: currentFase.cor }}>
                    {currentFase.nome}
                  </span>
                  <Badge variant="outline" className="text-[10px]">Ativo</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {currentFase.descricao || 'Fase de acompanhamento no pipeline.'}
                </p>
              </div>
            </div>
          </div>

          {/* Coluna 2: Campos da Fase Atual (Middle Pane - 5 cols) */}
          <div className="col-span-5 p-5 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: currentFase.cor }} />
                  <h3 className="text-sm font-bold text-foreground">
                    Fase: {currentFase.nome}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Campos de acompanhamento específicos desta fase
                </p>
              </div>

              {/* Botão para Adicionar Novo Campo Personalizado */}
              <Popover open={novoCampoOpen} onOpenChange={setNovoCampoOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                    <Plus size={12} /> Novo Campo
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3 space-y-3" align="end">
                  <p className="text-xs font-bold text-foreground">Adicionar Campo à Fase</p>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Nome do Campo</Label>
                    <Input 
                      placeholder="Ex: Resumo da RD, Valor Cota..."
                      value={novoCampoLabel}
                      onChange={e => setNovoCampoLabel(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Tipo de Campo</Label>
                    <Select value={novoCampoTipo} onValueChange={(v: any) => setNovoCampoTipo(v)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="texto_curto">Texto curto</SelectItem>
                        <SelectItem value="texto_longo">Texto longo</SelectItem>
                        <SelectItem value="moeda">Moeda / Dinheiro (R$)</SelectItem>
                        <SelectItem value="data">Data</SelectItem>
                        <SelectItem value="etiquetas">Etiquetas / Tags</SelectItem>
                        <SelectItem value="checkbox">Checkbox (Sim/Não)</SelectItem>
                        <SelectItem value="anexo">Anexo / Arquivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setNovoCampoOpen(false)}>
                      Cancelar
                    </Button>
                    <Button size="sm" className="h-7 text-xs" onClick={handleCriarCampo}>
                      Adicionar
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Lista de Campos da Fase */}
            <div className="space-y-4">
              {(!currentFase.campos || currentFase.campos.length === 0) ? (
                <div className="text-center py-10 px-4 border border-dashed border-border rounded-xl">
                  <p className="text-xs text-muted-foreground mb-2">Nenhum campo configurado nesta fase ainda.</p>
                  <Button variant="outline" size="sm" onClick={() => setNovoCampoOpen(true)} className="text-xs">
                    <Plus size={12} className="mr-1" /> Criar primeiro campo
                  </Button>
                </div>
              ) : (
                currentFase.campos.map(campo => {
                  const val = valores[campo.id] ?? '';

                  return (
                    <div key={campo.id} className="space-y-1.5 p-3 rounded-lg border border-border/60 bg-card/40">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          {campo.label}
                          {campo.obrigatorio && <span className="text-destructive">*</span>}
                        </Label>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">
                          {campo.tipo.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Renderizador por Tipo de Campo */}
                      {campo.tipo === 'texto_longo' ? (
                        <Textarea 
                          value={val}
                          onChange={e => handleFieldValueChange(campo.id, e.target.value)}
                          onBlur={handleSave}
                          placeholder={campo.placeholder || 'Digite aqui...'}
                          rows={3}
                          className="text-xs bg-card"
                        />
                      ) : campo.tipo === 'moeda' ? (
                        <div className="relative">
                          <span className="absolute left-2.5 top-2 text-xs text-muted-foreground font-semibold">R$</span>
                          <Input 
                            type="number"
                            value={val}
                            onChange={e => handleFieldValueChange(campo.id, e.target.value ? Number(e.target.value) : '')}
                            onBlur={handleSave}
                            placeholder="0,00"
                            className="h-8 text-xs pl-8 bg-card"
                          />
                        </div>
                      ) : campo.tipo === 'data' ? (
                        <Input 
                          type="date"
                          value={val}
                          onChange={e => handleFieldValueChange(campo.id, e.target.value)}
                          onBlur={handleSave}
                          className="h-8 text-xs bg-card"
                        />
                      ) : campo.tipo === 'checkbox' ? (
                        <div className="flex items-center gap-2 pt-1">
                          <input 
                            type="checkbox"
                            checked={Boolean(val)}
                            onChange={e => {
                              handleFieldValueChange(campo.id, e.target.checked);
                              handleSave();
                            }}
                            className="h-4 w-4 rounded border-border"
                          />
                          <span className="text-xs text-muted-foreground">Confirmado / Realizado</span>
                        </div>
                      ) : campo.tipo === 'anexo' ? (
                        <div className="border border-dashed border-border rounded-lg p-3 text-center bg-muted/10 space-y-1">
                          <Paperclip size={16} className="mx-auto text-muted-foreground" />
                          <p className="text-xs font-medium text-foreground">
                            {val ? String(val) : 'Nenhum documento anexado'}
                          </p>
                          <Input 
                            type="text"
                            placeholder="Nome do arquivo ou link..."
                            value={val}
                            onChange={e => handleFieldValueChange(campo.id, e.target.value)}
                            onBlur={handleSave}
                            className="h-7 text-xs bg-card mt-1"
                          />
                        </div>
                      ) : (
                        <Input 
                          value={val}
                          onChange={e => handleFieldValueChange(campo.id, e.target.value)}
                          onBlur={handleSave}
                          placeholder={campo.placeholder || 'Digite aqui...'}
                          className="h-8 text-xs bg-card"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Coluna 3: Ações e Mover de Fase (Right Pane - 3 cols) */}
          <div className="col-span-3 border-l border-border p-5 overflow-y-auto space-y-5 bg-card/20">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Mover card para fase
              </h3>
              
              {/* Botões coloridos para cada fase de destino */}
              <div className="space-y-2">
                {fases.map(fase => {
                  const isCurrent = fase.id === currentFase.id;
                  return (
                    <button
                      key={fase.id}
                      disabled={isCurrent}
                      onClick={() => onMove(card.id, fase.id)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                        isCurrent 
                          ? 'border-primary/50 bg-primary/10 text-primary cursor-default opacity-90'
                          : 'border-border/80 hover:border-foreground/40 hover:bg-muted/40 text-foreground'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: fase.cor }} />
                        <span className="truncate">{fase.nome}</span>
                      </span>
                      {isCurrent ? (
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">Atual</Badge>
                      ) : (
                        <ArrowRight size={13} className="text-muted-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ações com IA */}
            <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-2.5">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Sparkles size={14} /> Automações de IA
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Sugira a próxima etapa de negociação com base nos dados preenchidos.
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleAIMoveSuggest}
                className="w-full text-xs h-8 gap-1.5 border-primary/30 hover:bg-primary/10 text-primary"
              >
                <Sparkles size={12} /> Avançar para próxima fase
              </Button>
            </div>

            {/* Exclusão do Card */}
            <div className="pt-4 border-t border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  if (confirm(`Tem certeza que deseja excluir o parceiro "${card.titulo}"?`)) {
                    onDelete(card.id);
                    onClose();
                  }
                }}
                className="w-full text-xs text-destructive hover:bg-destructive/10 justify-start gap-2 h-8"
              >
                <Trash2 size={13} /> Excluir parceiro do CRM
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
