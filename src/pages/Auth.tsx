import { useState, useEffect } from 'react';
import { Mail, Lock, User as UserIcon, Building2, Loader2, CheckCircle2, Sparkles, Terminal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { useAuth, TIPOS_USUARIO } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { oauthReturnPath } from '@/lib/oauth-return-path';

interface EJOption {
  id: string;
  nome: string;
}

const Auth = () => {
  const { loginAsLocalDev, isLocalhost, session } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const currentPath = window.location.pathname + window.location.search + window.location.hash;
  const next = oauthReturnPath(params.get('next') ?? (window.location.pathname === '/.lovable/oauth/consent' ? currentPath : '/'));
  const redirectTo = new URL(next, window.location.origin).href;
  useEffect(() => {
    if (session && window.location.pathname === '/login') navigate(next, { replace: true });
  }, [session, next, navigate]);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoSolicitado, setTipoSolicitado] = useState('membro_ej');
  const [ejId, setEjId] = useState('');
  const [ejs, setEjs] = useState<EJOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);

  const needsEJ = tipoSolicitado === 'diretor_ej' || tipoSolicitado === 'membro_ej';

  useEffect(() => {
    supabase
      .from('ejs')
      .select('id, nome')
      .order('nome')
      .then(({ data }) => setEjs((data as EJOption[]) ?? []));
  }, []);

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      if (isLocalhost) {
        // No localhost, o broker do Lovable /~oauth/initiate não existe.
        // Chamamos diretamente o Supabase OAuth com o provider google:
        const { error: supaError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
          },
        });
        if (supaError) {
          setError(`Google OAuth no localhost: ${supaError.message}. Recomendamos usar o botão de acesso rápido dev abaixo.`);
          setLoading(false);
        }
        return;
      }

      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: redirectTo,
      });
      if (result.error) {
        setError('Não foi possível entrar com o Google. Tente novamente.');
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Erro ao autenticar com o Google.');
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (signInError) {
      setError('E-mail ou senha incorretos. Verifique e tente novamente.');
    } else {
      navigate(next, { replace: true });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nome.trim() || !email.trim() || !senha) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (needsEJ && !ejId) {
      setError('Selecione a sua Empresa Júnior.');
      return;
    }

    setLoading(true);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          nome: nome.trim(),
          tipo_solicitado: tipoSolicitado,
          ej_id: needsEJ ? ejId : null,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (signUpData.user) {
      await supabase.from('profiles').upsert({
        id: signUpData.user.id,
        nome: nome.trim(),
        email: email.trim(),
        tipo_solicitado: tipoSolicitado,
        ej_id: needsEJ ? ejId : null,
        status: 'pendente',
      });
    }

    setLoading(false);
    setSignupDone(true);
  };

  const inputClass =
    'w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50';

  if (signupDone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl text-center space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Solicitação Enviada!</h2>
          <p className="text-sm text-muted-foreground">
            Seu cadastro foi recebido com sucesso. Um administrador da RioJunior analisará seu pedido em breve.
          </p>
          <button
            onClick={() => {
              setSignupDone(false);
              setMode('login');
            }}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-14 w-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
            RJ
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground leading-tight">RioJunior</span>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Sistema de Gestão
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          {/* Botão de Bypass Dev no Localhost */}
          {isLocalhost && (
            <div className="mb-6 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Terminal size={14} className="text-emerald-600" />
                <span>Ambiente de Desenvolvimento Localhost</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Como o broker OAuth do Lovable funciona apenas na nuvem, use o acesso rápido abaixo para testar tudo localmente como Administrador:
              </p>
              <button
                type="button"
                onClick={loginAsLocalDev}
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Sparkles size={14} />
                Entrar no Localhost (Admin Completo)
              </button>
            </div>
          )}

          {/* Mode tabs */}
          <div className="flex bg-secondary rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Solicitar acesso
            </button>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-background hover:bg-secondary transition-colors font-semibold text-sm text-foreground mb-6 disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">ou com e-mail</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder={mode === 'signup' ? 'Crie uma senha (mín. 6 caracteres)' : 'Sua senha'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={inputClass}
              />
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Qual é a sua posição?
                  </label>
                  <select
                    value={tipoSolicitado}
                    onChange={(e) => setTipoSolicitado(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {Object.entries(TIPOS_USUARIO).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {needsEJ && (
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <select
                      value={ejId}
                      onChange={(e) => setEjId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Selecione sua EJ...</option>
                      {ejs.map((ej) => (
                        <option key={ej.id} value={ej.id}>
                          {ej.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <p className="text-xs text-muted-foreground bg-secondary/60 rounded-lg p-3">
                  Seu acesso será analisado por um administrador antes de liberar o sistema.
                </p>
              </>
            )}

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === 'login' ? 'Entrar' : 'Solicitar acesso'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2025 RioJunior — Federação de Empresas Juniores do Estado do Rio de Janeiro
        </p>
      </div>
    </div>
  );
};

export default Auth;
