import { useState } from 'react';
import { 
  CRMCard, CRMFase, CRMTag 
} from '@/types/crm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MoreHorizontal, ArrowRight, Trash2, Building2, Calendar, Clock } from 'lucide-react';

interface CRMListViewProps {
  fases: CRMFase[];
  cards: CRMCard[];
  tags: CRMTag[];
  onCardClick: (card: CRMCard) => void;
  onQuickMoveCard: (cardId: string, faseId: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export const CRMListView = ({
  fases,
  cards,
  tags,
  onCardClick,
  onQuickMoveCard,
  onDeleteCard
}: CRMListViewProps) => {
  const [search, setSearch] = useState('');

  const filteredCards = cards.filter(c => 
    c.titulo.toLowerCase().includes(search.toLowerCase()) ||
    (c.responsavelNome && c.responsavelNome.toLowerCase().includes(search.toLowerCase()))
  );

  const getFase = (faseId: string) => {
    return fases.find(f => f.id === faseId) || { nome: faseId, cor: '#64748b' };
  };

  const getTagColor = (tagName: string) => {
    const t = tags.find(x => x.nome.toLowerCase() === tagName.toLowerCase());
    return t ? t.cor : '#64748b';
  };

  const calculateDaysInPhase = (card: CRMCard) => {
    const lastHistory = card.historico && card.historico.length > 0
      ? card.historico[card.historico.length - 1].data
      : card.criadoEm;
    const diffTime = Math.abs(new Date().getTime() - new Date(lastHistory).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} dias`;
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
          <Input 
            placeholder="Procurar parceiros na tabela..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 pl-9 text-xs bg-background"
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          Total: {filteredCards.length} parceiros
        </span>
      </div>

      {/* Table (Pipefy List style) */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                <th className="py-3 px-4 w-10">
                  <input type="checkbox" className="rounded border-border" />
                </th>
                <th className="py-3 px-4 font-bold">Fase atual</th>
                <th className="py-3 px-4 font-bold">Título / Parceiro</th>
                <th className="py-3 px-4 font-bold">Data de vencimento</th>
                <th className="py-3 px-4 font-bold">Responsáveis</th>
                <th className="py-3 px-4 font-bold">Etiquetas</th>
                <th className="py-3 px-4 font-bold">Tempo na fase</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    Nenhum parceiro encontrado com os termos pesquisados.
                  </td>
                </tr>
              ) : (
                filteredCards.map(card => {
                  const fase = getFase(card.faseId);
                  const daysInPhase = calculateDaysInPhase(card);

                  return (
                    <tr 
                      key={card.id}
                      onClick={() => onCardClick(card)}
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-border" />
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="outline" 
                          className="font-bold text-[11px]"
                          style={{ borderColor: fase.cor, color: fase.cor }}
                        >
                          {fase.nome}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-foreground">
                        {card.titulo}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {card.dataVencimento ? (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                            <Clock size={12} /> {card.dataVencimento}
                          </span>
                        ) : (
                          'Vazio'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[9px]">
                            {card.responsavelNome ? card.responsavelNome.slice(0, 2).toUpperCase() : 'RJ'}
                          </span>
                          <span className="text-muted-foreground truncate max-w-[130px]">
                            {card.responsavelNome || 'RioJunior'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 flex-wrap max-w-xs">
                          {card.etiquetas?.slice(0, 3).map(t => {
                            const cor = getTagColor(t);
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
                          {card.etiquetas && card.etiquetas.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{card.etiquetas.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono">
                        {daysInPhase}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => onCardClick(card)}
                        >
                          <MoreHorizontal size={14} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
