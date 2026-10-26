import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface Details {
  client?: { name?: string; client_name?: string; redirect_uri?: string };
  redirect_uri?: string;
  scope?: string;
  scopes?: string[];
  redirect_url?: string;
  redirect_to?: string;
}
type OAuthResult = { data: Details | null; error: { message: string } | null };
interface OAuthApi {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
}
const oauth = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get('authorization_id') ?? '';
  const { user, profile, signOut } = useAuth();
  const [details, setDetails] = useState<Details | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setError('');
    setDetails(null);
    const load = async () => {
      if (!authorizationId) throw new Error('Solicitação inválida: abra novamente a conexão no seu agente.');
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) throw new Error('Esta solicitação expirou ou não está disponível. Abra novamente a conexão no agente.');
      const redirect = data?.redirect_url ?? data?.redirect_to;
      if (redirect && !data?.client) { window.location.assign(redirect); return; }
      if (!data?.client) throw new Error('Não foi possível identificar o aplicativo solicitante.');
      setDetails(data);
    };
    load().catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : 'Não foi possível carregar a solicitação.'); });
    return () => { active = false; };
  }, [authorizationId, retry]);

  async function decide(approve: boolean) {
    if (busy || !details || profile?.status !== 'aprovado') return;
    setBusy(true);
    setError('');
    try {
      const { data, error } = approve ? await oauth.approveAuthorization(authorizationId) : await oauth.denyAuthorization(authorizationId);
      if (error) throw new Error(approve ? 'Não foi possível permitir a conexão. Tente novamente.' : 'Não foi possível cancelar a conexão. Tente novamente.');
      const redirect = data?.redirect_url ?? data?.redirect_to;
      if (!redirect) throw new Error('O aplicativo não retornou um destino. Abra novamente a conexão no agente.');
      window.location.assign(redirect);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir a solicitação.');
      setBusy(false);
    }
  }
  const name = details?.client?.name ?? details?.client?.client_name ?? 'agente';
  const scopes = details?.scopes ?? details?.scope?.split(' ').filter(Boolean) ?? [];
  const labels: Record<string, string> = { openid: 'Identificar sua conta', email: 'Compartilhar seu endereço de e-mail', profile: 'Compartilhar seu perfil básico' };
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <section className="w-full max-w-lg space-y-6 text-foreground">
        <p className="font-bold text-primary">RioJunior</p>
        <h1 className="text-2xl font-bold">Conectar {name} à RioJunior</h1>
        <p className="text-sm text-muted-foreground">Conta: {user?.email}</p>
        {error && <p role="alert" className="text-destructive">{error}</p>}
        {!details && !error && <p role="status">Carregando solicitação…</p>}
        {details && <>
          <p>{name} poderá consultar eventos, OKRs e ciclos como você, sem alterar registros.</p>
          <p className="text-sm break-all text-muted-foreground">Destino: {details.redirect_uri ?? details.client?.redirect_uri ?? 'Informado pelo aplicativo solicitante'}</p>
          {scopes.length > 0 && <ul className="list-disc pl-5 text-sm space-y-2">{scopes.map(scope => <li key={scope}>{labels[scope] ?? `Permissão adicional solicitada: ${scope}`}</li>)}</ul>}
          <p className="text-sm text-muted-foreground">Sua aprovação e as permissões do app continuam valendo.</p>
          <div className="flex flex-wrap gap-3">
            <Button disabled={busy} onClick={() => decide(true)}>Permitir conexão</Button>
            <Button variant="outline" disabled={busy} onClick={() => decide(false)}>Cancelar conexão</Button>
          </div>
        </>}
        {error && !details && <Button variant="outline" onClick={() => setRetry(value => value + 1)}>Tentar novamente</Button>}
        <Button variant="ghost" disabled={busy} onClick={() => signOut()}>Trocar conta</Button>
      </section>
    </main>
  );
}