import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  ChevronRight, 
  Award, 
  Edit2, 
  Trash2,
  DollarSign
} from 'lucide-react';
import { EJ } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface EJBlockCardProps {
  ej: EJ;
  onClick: (ej: EJ) => void;
  onEdit?: (ej: EJ) => void;
  onDelete?: (id: string) => void;
}

export default function EJBlockCard({ ej, onClick, onEdit, onDelete }: EJBlockCardProps) {
  const [imgError, setImgError] = useState(false);

  const clusterStyles: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
    2: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    3: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    4: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    5: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  };

  const currentStyle = clusterStyles[ej.cluster] || clusterStyles[1];

  const farolConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
    azul: { label: 'Meta Batida', dot: 'bg-blue-400', text: 'text-blue-400', bg: 'bg-blue-500/15' },
    verde: { label: 'Outubro', dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    amarelo: { label: 'Setembro', dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/15' },
    vermelho: { label: 'Agosto ou Menos', dot: 'bg-rose-400', text: 'text-rose-400', bg: 'bg-rose-500/15' },
    preto: { label: 'Zerada', dot: 'bg-zinc-400', text: 'text-zinc-300', bg: 'bg-zinc-800' }
  };

  const farol = (ej.farol && farolConfig[ej.farol]) || farolConfig.vermelho;

  const initials = ej.nome
    .split(' ')
    .filter(w => w.length > 2 && !['dos', 'das', 'com', 'que', 'soluções', 'consultoria'].includes(w.toLowerCase()))
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || ej.nome.slice(0, 2).toUpperCase();

  const progress = formatPercentage(ej.faturamentoAtual, ej.faturamentoMeta);
  const percentClamped = Math.min(100, Math.max(0, Number(progress) || 0));

  const totalMembros = ej.membros?.total_ativos || ej.membros_ativos || 18;

  return (
    <div 
      className="card-elevated p-4 group relative cursor-pointer hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
      onClick={() => onClick(ej)}
    >
      {/* Top action buttons */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(ej);
              }} 
              className="p-1 text-muted-foreground hover:text-rio-gold hover:bg-rio-gold/10 rounded transition-colors"
              title="Editar"
            >
              <Edit2 size={13} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(ej.id);
              }} 
              className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
              title="Excluir"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      )}

      <div>
        {/* Header: Logo + Nome + Farol */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center font-bold text-base border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} overflow-hidden`}>
            {!imgError && ej.logo_url ? (
              <img 
                src={ej.logo_url} 
                alt={ej.nome}
                onError={() => setImgError(true)}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="min-w-0 flex-1 pr-6">
            <h3 className="font-bold text-foreground text-base leading-snug truncate" title={ej.nome}>
              {ej.nome}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate mt-0.5" title={ej.localizacao || ej.ies}>
              <MapPin size={11} className="shrink-0 text-primary" />
              <span className="truncate">{ej.localizacao || ej.ies || ej.cidade}</span>
            </div>
          </div>
        </div>

        {/* Badges: Cluster, Região, Farol */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          <span className={`text-[10.5px] px-2 py-0.5 rounded-md font-bold border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}>
            Cluster {ej.cluster}
          </span>

          <span className="text-[10.5px] px-2 py-0.5 rounded-md font-medium border border-border bg-secondary/50 text-muted-foreground">
            {ej.regiao}
          </span>

          <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ml-auto ${farol.bg} ${farol.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${farol.dot}`} />
            Farol {ej.farol_original || farol.label}
          </span>
        </div>

        {/* Faturamento Progress Section */}
        <div className="bg-secondary/40 rounded-lg p-2.5 mb-3 border border-border/40">
          <div className="flex justify-between items-baseline mb-1">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Realizado</span>
              <span className="text-sm font-extrabold text-foreground">{formatCurrency(ej.faturamentoAtual)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Meta Anual</span>
              <span className="text-xs font-semibold text-muted-foreground">{formatCurrency(ej.faturamentoMeta)}</span>
            </div>
          </div>

          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-1.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                Number(progress) >= 100 ? 'bg-emerald-500' : Number(progress) >= 50 ? 'bg-amber-500' : 'bg-primary'
              }`}
              style={{ width: `${percentClamped}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-muted-foreground mt-1">
            <span>Atingimento da Meta</span>
            <span className="font-bold text-foreground">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Footer: Membros e Botão Acessar Perfil */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
        <span className="flex items-center gap-1.5" title="Membros ativos da EJ">
          <Users size={12} className="text-rio-gold" />
          <strong className="text-foreground font-semibold">{totalMembros}</strong> membros
        </span>

        <span className="flex items-center gap-0.5 text-primary font-bold text-xs group-hover:translate-x-0.5 transition-transform">
          <span>Ver Perfil</span>
          <ChevronRight size={13} />
        </span>
      </div>
    </div>
  );
}
