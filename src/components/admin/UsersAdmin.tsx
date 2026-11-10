import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TIPOS_USUARIO } from '@/hooks/useAuth';
import { DDR_EMPRESAS_JUNIORES } from '@/data/ddrDatabase';
import { GUILDAS_INFO, GuildaKey } from '@/data/rolesGuildasData';
import { resolveAccountByEmail, saveStoredAccountLink } from '@/utils/accountLinkResolver';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, ShieldCheck, Loader2, Users, RefreshCw, Link2, Sparkles } from 'lucide-react';

interface UserRow {
  id: string;
  nome: string | null;
  email: string | null;
  tipo_solicitado: string | null;
  ej_id: string | null;
  status: string;
  created_at: string;
  roles: string[];
}

const ROLE_OPTIONS: Record<string, string> = {
  admin: '👑 Administrador (acesso total)',
  ...TIPOS_USUARIO,
};

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Record<string, string>>({});
  const [selectedGuilda, setSelectedGuilda] = useState<Record<string, string>>({});
  const [syncingAll, setSyncingAll] = useState(false);

  const ejMap = new Map(DDR_EMPRESAS_JUNIORES.map((e) => [e.id, e.nome]));

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('*'),
    ]);

    const rolesByUser = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role);
      rolesByUser.set(r.user_id, arr);
    });

    const rows: UserRow[] = (profiles ?? []).map((p: any) => ({
      ...p,
      roles: rolesByUser.get(p.id) ?? [],
    }));
    setUsers(rows);

    const defaultsRole: Record<string, string> = {};
    const defaultsGuilda: Record<string, string> = {};
    rows.forEach((u) => {
      const resolved = resolveAccountByEmail(u.email, u.ej_id, u.tipo_solicitado);
      defaultsRole[u.id] =
        u.roles[0] ?? (resolved.matched ? resolved.tipoUsuario : u.tipo_solicitado ?? 'time_riojunior');
      if (resolved.guilda) {
        defaultsGuilda[u.id] = resolved.guilda;
      }
    });
    setSelectedRole(defaultsRole);
    setSelectedGuilda(defaultsGuilda);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (u: UserRow) => {
    const resolved = resolveAccountByEmail(u.email, u.ej_id, u.tipo_solicitado);
    const role = selectedRole[u.id] || (resolved.matched ? resolved.tipoUsuario : u.tipo_solicitado || 'time_riojunior');
    const guildaOverride = (selectedGuilda[u.id] as GuildaKey | undefined) || resolved.guilda || null;

    setActingId(u.id);

    const finalNome = u.nome || resolved.nomeCadastrado || null;
    const finalTipo = role === 'admin' ? (u.tipo_solicitado || resolved.tipoUsuario || 'time_riojunior') : role;
    const finalEjId = u.ej_id || resolved.ejId || null;

    const { error: pErr } = await supabase
      .from('profiles')
      .update({
        status: 'aprovado',
        nome: finalNome,
        tipo_solicitado: finalTipo,
        ej_id: finalEjId,
      })
      .eq('id', u.id);

    if (pErr) {
      setActingId(null);
      toast({ title: 'Erro ao aprovar', description: pErr.message, variant: 'destructive' });
      return;
    }

    await supabase.from('user_roles').delete().eq('user_id', u.id);
    const { error: rErr } = await supabase
      .from('user_roles')
      .insert({ user_id: u.id, role: role as any });

    // Salva o vínculo automático da conta com os dados cadastrados do e-mail
    if (u.email) {
      saveStoredAccountLink({
        userId: u.id,
        email: u.email,
        tipoUsuario: (role === 'admin' ? 'admin' : (role as any)),
        nome: finalNome || undefined,
        guilda: guildaOverride,
        cargo: resolved.cargo,
        membroId: resolved.membroId,
        ejId: finalEjId,
        allowedEjIds:
          resolved.allowedEjIds.length > 0
            ? resolved.allowedEjIds
            : finalEjId
            ? [finalEjId]
            : [],
        linkedAt: new Date().toISOString(),
      });
    }

    setActingId(null);

    if (rErr) {
      toast({ title: 'Erro ao atribuir papel', description: rErr.message, variant: 'destructive' });
      return;
    }

    toast({
      title: 'Acesso aprovado e conta vinculada!',
      description: resolved.matched
        ? `${finalNome || u.email} foi aprovado(a) e vinculado(a) automaticamente a: ${resolved.resumoVinculo}.`
        : `${finalNome || u.email} recebeu acesso como ${ROLE_OPTIONS[role] || role}.`,
    });
    load();
  };

  const syncAllMatchedAccounts = async () => {
    setSyncingAll(true);
    let linkedCount = 0;

    for (const u of users) {
      if (!u.email) continue;
      const resolved = resolveAccountByEmail(u.email, u.ej_id, u.tipo_solicitado);
      if (resolved.matched) {
        const finalNome = u.nome || resolved.nomeCadastrado;
        const finalEjId = u.ej_id || resolved.ejId;
        const finalTipo = u.tipo_solicitado || resolved.tipoUsuario;

        await supabase
          .from('profiles')
          .update({
            nome: finalNome,
            tipo_solicitado: finalTipo,
            ej_id: finalEjId,
          })
          .eq('id', u.id);

        saveStoredAccountLink({
          userId: u.id,
          email: u.email,
          tipoUsuario: resolved.tipoUsuario,
          nome: finalNome || undefined,
          guilda: resolved.guilda,
          cargo: resolved.cargo,
          membroId: resolved.membroId,
          ejId: finalEjId,
          allowedEjIds: resolved.allowedEjIds,
          linkedAt: new Date().toISOString(),
        });
        linkedCount++;
      }
    }

    setSyncingAll(false);
    toast({
      title: 'Vínculos sincronizados pelo e-mail!',
      description: `${linkedCount} conta(s) foram vinculadas automaticamente aos cadastros da base.`,
    });
    load();
  };

  const reject = async (u: UserRow) => {
    setActingId(u.id);
    await supabase.from('user_roles').delete().eq('user_id', u.id);
    const { error } = await supabase.from('profiles').update({ status: 'rejeitado' }).eq('id', u.id);
    setActingId(null);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Acesso revogado/rejeitado' });
    load();
  };

  const pendentes = users.filter((u) => u.status === 'pendente');
  const aprovados = users.filter((u) => u.status === 'aprovado');
  const rejeitados = users.filter((u) => u.status === 'rejeitado');

  const renderList = (list: UserRow[]) => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }
    if (list.length === 0) {
      return <p className="text-center text-sm text-muted-foreground py-8">Nenhum registro nesta categoria.</p>;
    }
    return (
      <div className="space-y-3">
        {list.map((u) => {
          const resolved = resolveAccountByEmail(u.email, u.ej_id, u.tipo_solicitado);
          const currentRole = selectedRole[u.id] ?? '';
          const isTimeRole = currentRole === 'time_riojunior';

          return (
            <div
              key={u.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-border/60 bg-card/50"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">
                    {u.nome || resolved.nomeCadastrado || '(Sem nome preenchido)'}
                  </span>
                  {u.roles.includes('admin') && (
                    <Badge className="gap-1 bg-primary/20 text-primary border-primary/40">
                      <ShieldCheck className="h-3 w-3" /> Admin
                    </Badge>
                  )}
                  {u.roles
                    .filter((r) => r !== 'admin')
                    .map((r) => (
                      <Badge key={r} variant="secondary">
                        {TIPOS_USUARIO[r] ?? r}
                      </Badge>
                    ))}
                  {(selectedGuilda[u.id] || resolved.guilda) && (
                    <Badge variant="outline" className="font-bold text-xs border-primary/40 text-primary">
                      Guilda: {selectedGuilda[u.id] || resolved.guilda}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground truncate">{u.email}</p>

                {/* Vínculo Automático pelo E-mail */}
                {resolved.matched ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs">
                    <Link2 className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      <strong>Vínculo automático pelo e-mail:</strong> {resolved.resumoVinculo}
                    </span>
                    {resolved.membroStatus === 'desligado' && (
                      <Badge variant="destructive" className="text-[10px] ml-1 py-0 px-1.5">
                        {resolved.pedidoDesligamento ? 'Pedido de Desligamento' : 'Desligado'}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    E-mail sem correspondência direta pré-cadastrada — defina a função/guilda ao aprovar.
                  </p>
                )}

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-0.5">
                  {u.tipo_solicitado && (
                    <span>
                      Solicitado: <strong>{TIPOS_USUARIO[u.tipo_solicitado] ?? u.tipo_solicitado}</strong>
                    </span>
                  )}
                  {(u.ej_id || resolved.ejId) && (
                    <span>
                      • EJ:{' '}
                      <strong>
                        {ejMap.get((u.ej_id || resolved.ejId)!) ?? resolved.ejNome ?? (u.ej_id || resolved.ejId)}
                      </strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Select
                  value={currentRole}
                  onValueChange={(v) => setSelectedRole((s) => ({ ...s, [u.id]: v }))}
                >
                  <SelectTrigger className="w-52 h-9 text-xs">
                    <SelectValue placeholder="Papel / Função" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_OPTIONS).map(([k, label]) => (
                      <SelectItem key={k} value={k}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isTimeRole && (
                  <Select
                    value={selectedGuilda[u.id] || resolved.guilda || 'OP'}
                    onValueChange={(v) => setSelectedGuilda((s) => ({ ...s, [u.id]: v }))}
                  >
                    <SelectTrigger className="w-40 h-9 text-xs">
                      <SelectValue placeholder="Guilda" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(GUILDAS_INFO).map((g) => (
                        <SelectItem key={g} value={g} className="text-xs">
                          {g} — {GUILDAS_INFO[g as GuildaKey].nome.split(' ')[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Button
                  size="sm"
                  onClick={() => approve(u)}
                  disabled={actingId === u.id}
                  className="gap-1"
                >
                  {actingId === u.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {u.status === 'aprovado' ? 'Atualizar & Vincular' : 'Aprovar & Vincular'}
                </Button>

                {u.status !== 'rejeitado' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => reject(u)}
                    disabled={actingId === u.id}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <XCircle className="h-4 w-4" />
                    {u.status === 'aprovado' ? 'Revogar' : 'Rejeitar'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" /> Gestão de Acessos & Vínculo Automático por E-mail
          </CardTitle>
          <CardDescription>
            Ao aprovar uma solicitação, o sistema vincula automaticamente a conta aos dados cadastrados daquele e-mail (Guilda, Cargo ou EJ no COEJ).
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={syncAllMatchedAccounts}
            disabled={loading || syncingAll}
            className="gap-1.5 text-xs"
          >
            {syncingAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-primary" />}
            Vincular Contas pelo E-mail
          </Button>
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pendentes">
          <TabsList className="mb-4">
            <TabsTrigger value="pendentes">Pendentes ({pendentes.length})</TabsTrigger>
            <TabsTrigger value="aprovados">Aprovados ({aprovados.length})</TabsTrigger>
            <TabsTrigger value="rejeitados">Rejeitados ({rejeitados.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pendentes">{renderList(pendentes)}</TabsContent>
          <TabsContent value="aprovados">{renderList(aprovados)}</TabsContent>
          <TabsContent value="rejeitados">{renderList(rejeitados)}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
