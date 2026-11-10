import React, { ReactNode } from 'react';
import { Lock, Eye, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { GUILDAS_INFO } from '@/data/rolesGuildasData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface DirectorateAccessGuardProps {
  canEdit: boolean;
  directorateName: string;
  directorateShort: string;
  children: ReactNode;
}

const MUTATION_BUTTON_REGEX =
  /(^\+\s*|\b(salvar|adicionar|novo|nova|criar|excluir|remover|deletar|editar|aplicar|desligar|reintegrar|homologar|restaurar|duplicar|lançar|confirmar|cadastrar|importar|revogar|desvincular)\b)/i;

const ALLOWED_BUTTON_REGEX =
  /\b(exportar|planilha|excel|csv|pdf|fechar|cancelar|voltar|ver|visualizar|detalhes|filtrar|todos|todas|limpar|buscar|pesquisar)\b/i;

const SEARCH_PLACEHOLDER_REGEX = /(buscar|filtrar|pesquisar|procurar|search|filter)/i;

export function DirectorateAccessGuard({
  canEdit,
  directorateName,
  directorateShort,
  children,
}: DirectorateAccessGuardProps) {
  const { isActualAdmin, effectiveGuilda, setSimulatedViewMode } = useAuth();

  if (canEdit) {
    return <>{children}</>;
  }

  const notifyReadOnly = () => {
    toast({
      title: `Modo Somente Visualização (${directorateShort})`,
      description: `Apenas integrantes do time de ${directorateShort} e Administradores podem alterar dados nesta aba.`,
      variant: 'destructive',
    });
  };

  const isSearchOrFilterInput = (el: HTMLElement | null): boolean => {
    if (!el) return false;
    const input = el.closest('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
    if (!input) return false;
    if (input.type === 'search') return true;
    const placeholder = input.getAttribute('placeholder') || '';
    if (SEARCH_PLACEHOLDER_REGEX.test(placeholder)) return true;
    return false;
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const btn = target.closest('button, [role="button"], [role="checkbox"], [role="switch"]') as HTMLElement | null;
    if (!btn) return;

    // Permite abas e seletores de navegação
    if (btn.getAttribute('role') === 'tab' || btn.closest('[role="tablist"]')) {
      return;
    }

    // Bloqueia checkboxes e switches de edição
    const role = btn.getAttribute('role');
    if (role === 'checkbox' || role === 'switch') {
      e.preventDefault();
      e.stopPropagation();
      notifyReadOnly();
      return;
    }

    const text = (btn.innerText || btn.textContent || '').trim();
    const title = (btn.getAttribute('title') || btn.getAttribute('aria-label') || '').trim();

    // Permite botões explícitos de exportação, visualização, filtro ou fechamento
    if (ALLOWED_BUTTON_REGEX.test(text) || ALLOWED_BUTTON_REGEX.test(title)) {
      return;
    }

    // Bloqueia botões de criação, edição, exclusão ou salvamento
    if (MUTATION_BUTTON_REGEX.test(text) || MUTATION_BUTTON_REGEX.test(title)) {
      e.preventDefault();
      e.stopPropagation();
      notifyReadOnly();
      return;
    }
  };

  const handleChangeCapture = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Permite campos de busca/filtro
    if (isSearchOrFilterInput(target)) {
      return;
    }

    // Bloqueia edição de inputs de dados (números, textos de formulário, checkboxes, datas)
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      e.preventDefault();
      e.stopPropagation();
      notifyReadOnly();
    }
  };

  const handleSubmitCapture = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    notifyReadOnly();
  };

  const userGuildaLabel = effectiveGuilda
    ? `${effectiveGuilda} (${GUILDAS_INFO[effectiveGuilda]?.nome || effectiveGuilda})`
    : 'Visualização Geral';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <Lock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Modo Somente Visualização ({directorateName}):</strong> Esta aba pode ser visualizada por todo o time, mas apenas o time de <strong>{directorateShort}</strong> e <strong>ADMs</strong> podem fazer alterações.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-[11px] gap-1 border-amber-500/40 text-amber-800 dark:text-amber-300">
            <Eye className="h-3 w-3" /> Sua visão: {userGuildaLabel}
          </Badge>
          {isActualAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSimulatedViewMode('admin')}
              className="h-7 text-[11px] gap-1 border-primary/40 text-primary hover:bg-primary/10"
            >
              <ShieldCheck className="h-3 w-3" /> Voltar para ADM
            </Button>
          )}
        </div>
      </div>

      <div
        onClickCapture={handleClickCapture}
        onChangeCapture={handleChangeCapture}
        onSubmitCapture={handleSubmitCapture}
      >
        {children}
      </div>
    </div>
  );
}

