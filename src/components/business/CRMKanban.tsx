import { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, Sparkles, Settings, Calendar, 
  Clock, Paperclip, AlertTriangle, ArrowRight, User, 
  Building2, ChevronRight, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { CRMCard, CRMFase, CRMTag } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CRMKanbanProps {
  fases: CRMFase[];
  cards: CRMCard[];
  tags: CRMTag[];
  onCardClick: (card: CRMCard) => void;
  onQuickAddCard: (faseId: string) => void;
  onOpenAssistantModal: () => void;
  onOpenConfigModal: () => void;
  onQuickMoveCard: (cardId: string, targetFaseId: string) => void;
}

export const CRMKanban = ({
  fases,
  cards,
  tags,
  onCardClick,
  onQuickAddCard,
  onOpenAssistantModal,
  onOpenConfigModal,
  onQuickMoveCard
}: CRMKanbanProps) => {
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [filterTemp, setFilterTemp] = useState<string>('all');

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchSearch = card.titulo.toLowerCase().includes(search.toLowerCase()) ||
        (card.responsavelNome && card.responsavelNome.toLowerCase().includes(search.toLowerCase())) ||
        (card.pontoContato && card.pontoContato.toLowerCase().includes(search.toLowerCase()));

      const matchTag = filterTag === 'all' || (card.etiquetas && card.etiquetas.includes(filterTag));
      const matchTemp = filterTemp === 'all' || (card.etiquetas && card.etiquetas.includes(filterTemp));

      return matchSearch && matchTag && matchTemp;
    });
  }, [cards, search, filterTag, filterTemp]);

  const getCardsByFase = (faseId: string) => {
    return filteredCards.filter(c => c.faseId === faseId);
  };

  const getTagColor = (tagName: string) => {
    const t = tags.find(x => x.nome.toLowerCase() === tagName.toLowerCase());
    return t ? t.cor : '#64748b';
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/60 p-3 rounded-xl border border-border backdrop-blur">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
            <Input 
              placeholder="Procurar parceiros, contatos ou responsáveis..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 pl-9 text-xs bg-background"
            />
          </div>

          <Select value={filterTemp} onValueChange={setFilterTemp}>
            <SelectTrigger className="w-32 h-9 text-xs bg-background">
              <SelectValue placeholder="Temperatura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Quente">Quente</SelectItem>
              <SelectItem value="Morno">Morno</SelectItem>
              <SelectItem value="Frio">Frio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            onClick={onOpenAssistantModal}
            size="sm"
            className="h-9 text-xs gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm font-semibold"
          >
            <Sparkles size={14} /> Inserir via IA (Transcrição / Áudio)
          </Button>

          <Button 
            onClick={() => onQuickAddCard(fases[0]?.id || 'contato_aberto')}
            size="sm"
            className="h-9 text-xs gap-1.5"
          >
            <Plus size={14} /> Novo Parceiro
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenConfigModal}
            className="h-9 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Settings size={14} /> Configurações
          </Button>
        </div>
      </div>

      {/* Horizontal Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 items-start min-h-[580px] w-max">
          {fases.map(fase => {
            const faseCards = getCardsByFase(fase.id);

            return (
              <div 
                key={fase.id}
                className="w-72 sm:w-80 flex flex-col bg-muted/20 border border-border/80 rounded-xl overflow-hidden shrink-0 shadow-sm"
              >
                {/* Column Header (Pipefy style) */}
                <div 
                  className="p-3 border-b border-border/80 bg-card/70 flex items-center justify-between"
                  style={{ borderTop: `3px solid ${fase.cor}` }}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-foreground truncate max-w-[170px]" title={fase.nome}>
                      {fase.nome}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] h-5 px-1.5 font-bold rounded-full bg-muted font-mono"
                    >
                      {faseCards.length}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onQuickAddCard(fase.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      title="Adicionar parceiro nesta fase"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[140px]">
                  {faseCards.length === 0 ? (
                    <div className="h-28 border border-dashed border-border/60 rounded-lg flex flex-col items-center justify-center p-3 text-center">
                      <p className="text-[11px] text-muted-foreground">Nenhum parceiro nesta fase</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={() => onQuickAddCard(fase.id)}
                        className="text-[11px] h-6 p-0 text-primary mt-1"
                      >
                        + Adicionar
                      </Button>
                    </div>
                  ) : (
                    faseCards.map(card => {
                      const tagsList = card.etiquetas || [];
                      const isExpired = card.dataVencimento && new Date(card.dataVencimento) < new Date();

                      return (
                        <div
                          key={card.id}
                          onClick={() => onCardClick(card)}
                          className="p-3 bg-card rounded-lg border border-border/70 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer space-y-2.5 group"
                        >
                          {/* Tags Pills (Pipefy style) */}
                          <div className="flex items-center gap-1 flex-wrap">
                            {tagsList.map(t => {
                              const cor = getTagColor(t);
                              const isTemp = ['quente', 'morno', 'frio'].includes(t.toLowerCase());
                              return (
                                <span
                                  key={t}
                                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                  style={{ 
                                    backgroundColor: `${cor}20`, 
                                    color: cor,
                                    border: `1px solid ${cor}40`
                                  }}
                                >
                                  {t}
                                </span>
                              );
                            })}
                          </div>

                          {/* Partner Title */}
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {card.titulo}
                            </h4>
                          </div>

                          {/* Specific Highlights from Card Values */}
                          {card.valores?.valor_fechado && (
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              R$ {Number(card.valores.valor_fechado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          )}

                          {card.valores?.valor_proposta && !card.valores?.valor_fechado && (
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                              Proposta: R$ {Number(card.valores.valor_proposta).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          )}

                          {/* Dates & Status indicators (Expirado, Atrasado, Data Abertura, RD, AP) */}
                          <div className="space-y-1 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                            {isExpired && (
                              <div className="flex items-center gap-1 text-destructive font-semibold text-[10px]">
                                <AlertTriangle size={11} /> Expirado / Atrasado
                              </div>
                            )}

                            {card.dataAbertura && (
                              <div className="flex items-center gap-1 text-[10px]">
                                <Calendar size={10} />
                                <span>ABERTURA: {card.dataAbertura}</span>
                              </div>
                            )}

                            {card.valores?.data_rd && (
                              <div className="flex items-center gap-1 text-[10px]">
                                <Clock size={10} />
                                <span>DATA DA RD: {card.valores.data_rd}</span>
                              </div>
                            )}

                            {card.valores?.data_ap && (
                              <div className="flex items-center gap-1 text-[10px]">
                                <Clock size={10} />
                                <span>DATA DA AP: {card.valores.data_ap}</span>
                              </div>
                            )}
                          </div>

                          {/* Footer with Assignee & Attachments */}
                          <div className="flex items-center justify-between pt-1.5 border-t border-border/40">
                            <div className="flex items-center gap-1.5">
                              <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[9px]">
                                {card.responsavelNome ? card.responsavelNome.slice(0, 2).toUpperCase() : 'RJ'}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                                {card.responsavelNome || 'RioJunior'}
                              </span>
                            </div>

                            {card.anexos && card.anexos.length > 0 && (
                              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Paperclip size={11} /> {card.anexos.length}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}

          {/* "+ Nova Fase" Button Column at the end (matching snapshot 23-29-14) */}
          <div className="w-56 shrink-0 pt-1">
            <Button 
              variant="outline" 
              onClick={onOpenConfigModal}
              className="w-full h-12 border-dashed border-2 border-border/80 text-xs font-bold gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50"
            >
              <Plus size={16} /> Nova Fase
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
