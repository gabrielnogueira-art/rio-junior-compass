import { useState, useEffect, useCallback } from 'react';
import {
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldOff,
  Loader2,
  Clock,
  Users as UsersIcon,
  Building2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, TIPOS_USUARIO } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UserRow {
  id: string;
  nome: string | null;
  email: string | null;
  tipo_solicitado: string | null;
  ej_id: string | null;
  status: string;
  created_at: string;
  ejs?: { nome: string } | null;
}

type AppRole = 'admin' | 'time_riojunior' | 'professor_orientador' | 'diretor_ej' | 'membro_ej';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  ...TIPOS_USUARIO,
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pendente: { label: 'Pendente', className: 'bg-yellow-500/10 text-yellow-600' },
  aprovado: { label: 'Aprovado', className: 'bg-green-500/10 text-green-600' },
  rejeitado: { label: 'Rejeitado', className: 'bg-destructive/10 text-destructive' },
};

const UsersAdmin = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [rolesByUser, setRolesByUser] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [roleChoice, setRoleChoice] = useState<Record<string, AppRole>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase
        .from('profiles')
        .select('*, ejs(nome)')
        .order('created_at', { ascending: false }),
      supabase.from('user_roles').select('user_id, role'),
    ]);
    setUsers((profiles as UserRow[]) ?? []);
    const map: Record<string, string[]> = {};
    (roles ?? []).forEach((r) => {
      if (!map[r.user_id]) map[r.user_id] = [];
      map[r.user_id].push(r.role as string);
    });
    setRolesByUser(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const runAction = async (userId: string, fn: () => PromiseLike<{ error: unknown }>) => {
    setActionLoading(userId);
    const { error } = await fn();
    setActionLoading(null);
    if (error) {
      toast.error('Não foi possível concluir a ação. Tente novamente.');
      return;
    }
    await fetchData();
  };

  const approve = (u: UserRow) => {
    const role = roleChoice[u.id] ?? ((u.tipo_solicitado as AppRole) || 'membro_ej');
    return runAction(u.id, () =>
      supabase.rpc('admin_approve_user', { _user_id: u.id, _role: role })
    ).then(() => toast.success(`${u.nome ?? u.email} aprovado como ${ROLE_LABELS[role]}.`));
  };

  const reject = (u: UserRow) =>
    runAction(u.id, () => supabase.rpc('admin_reject_user', { _user_id: u.id })).then(() =>
      toast.success('Solicitação rejeitada.')
    );

  const toggleAdmin = (u: UserRow) => {
    const isAdmin = (rolesByUser[u.id] ?? []).includes('admin');
    if (isAdmin) {
      return runAction(u.id, () =>
        supabase.rpc('admin_revoke_role', { _user_id: u.id, _role: 'admin' })
      ).then(() => toast.success('Admin removido.'));
    }
    return runAction(u.id, () =>
      supabase.rpc('admin_grant_role', { _user_id: u.id, _role: 'admin' })
    ).then(() => toast.success(`${u.nome ?? u.email} agora é administrador.`));
  };

  const pendentes = users.filter((u) => u.status === 'pendente');
  const demais = users.filter((u) => u.status !== 'pendente');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  const renderUserCard = (u: UserRow, isPending: boolean) => {
    const userRoles = rolesByUser[u.id] ?? [];
    const isAdmin = userRoles.includes('admin');
    const isSelf = u.id === currentUser?.id;
    const status = STATUS_LABELS[u.status] ?? STATUS_LABELS.pendente;

    return (
      <div
        key={u.id}
        className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <UsersIcon size={18} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-foreground truncate">
                {u.nome ?? 'Sem nome'} {isSelf && <span className="text-xs text-muted-foreground">(você)</span>}
              </p>
              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${status.className}`}>
            {status.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {u.tipo_solicitado && (
            <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
              {TIPOS_USUARIO[u.tipo_solicitado] ?? u.tipo_solicitado}
            </span>
          )}
          {u.ejs?.nome && (
            <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium inline-flex items-center gap-1">
              <Building2 size={12} /> {u.ejs.nome}
            </span>
          )}
          {userRoles.map((r) => (
            <span
              key={r}
              className="px-2 py-1 rounded-full bg-primary/10 text-primary font-bold"
            >
              {ROLE_LABELS[r] ?? r}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
          {isPending && (
            <>
              <select
                value={roleChoice[u.id] ?? (u.tipo_solicitado as AppRole) ?? 'membro_ej'}
                onChange={(e) =>
                  setRoleChoice((prev) => ({ ...prev, [u.id]: e.target.value as AppRole }))
                }
                className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => approve(u)}
                disabled={actionLoading === u.id}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50"
              >
                {actionLoading === u.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <UserCheck size={14} />
                )}
                Aprovar
              </button>
              <button
                onClick={() => reject(u)}
                disabled={actionLoading === u.id}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 disabled:opacity-50"
              >
                <UserX size={14} />
                Rejeitar
              </button>
            </>
          )}

          {!isPending && u.status === 'aprovado' && (
            <button
              onClick={() => toggleAdmin(u)}
              disabled={actionLoading === u.id || (isSelf && isAdmin)}
              title={isSelf && isAdmin ? 'Você não pode remover seu próprio admin' : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50 ${
                isAdmin
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              {isAdmin ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
              {isAdmin ? 'Remover admin' : 'Tornar admin'}
            </button>
          )}

          {!isPending && u.status === 'rejeitado' && (
            <button
              onClick={() => approve(u)}
              disabled={actionLoading === u.id}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50"
            >
              <UserCheck size={14} />
              Aprovar mesmo assim
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestão de Usuários</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aprove solicitações de acesso e gerencie os administradores da plataforma.
        </p>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-yellow-600" />
          <h2 className="text-lg font-bold text-foreground">
            Aguardando aprovação ({pendentes.length})
          </h2>
        </div>
        {pendentes.length === 0 ? (
          <p className="text-sm text-muted-foreground bg-card border border-border rounded-xl p-6 text-center">
            Nenhuma solicitação pendente no momento.
          </p>
        ) : (
          <div className="grid gap-3">{pendentes.map((u) => renderUserCard(u, true))}</div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <UsersIcon size={18} className="text-primary" />
          <h2 className="text-lg font-bold text-foreground">Todos os usuários ({demais.length})</h2>
        </div>
        {demais.length === 0 ? (
          <p className="text-sm text-muted-foreground bg-card border border-border rounded-xl p-6 text-center">
            Nenhum usuário aprovado ainda.
          </p>
        ) : (
          <div className="grid gap-3">{demais.map((u) => renderUserCard(u, false))}</div>
        )}
      </section>
    </div>
  );
};

export default UsersAdmin;
