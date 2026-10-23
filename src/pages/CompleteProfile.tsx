import { useState, useEffect } from 'react';
import { User as UserIcon, Building2, Loader2, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, TIPOS_USUARIO } from '@/hooks/useAuth';

interface EJOption {
  id: string;
  nome: string;
}

const CompleteProfile = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [nome, setNome] = useState(profile?.nome ?? '');
  const [tipoSolicitado, setTipoSolicitado] = useState('membro_ej');
  const [ejId, setEjId] = useState('');
  const [ejs, setEjs] = useState<EJOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsEJ = tipoSolicitado === 'diretor_ej' || tipoSolicitado === 'membro_ej';

  useEffect(() => {
    supabase
      .from('ejs')
      .select('id, nome')
      .order('nome')
      .then(({ data }) => setEjs((data as EJOption[]) ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setLoading(true);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        nome,
        tipo_solicitado: tipoSolicitado,
        ej_id: needsEJ && ejId ? ejId : null,
      })
      .eq('id', user.id);
    setLoading(false);
    if (updateError) {
      setError('Não foi possível salvar. Tente novamente.');
      return;
    }
    await refreshProfile();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          <h2 className="text-xl font-bold text-foreground mb-2">Complete seu cadastro</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Só falta nos dizer sua posição para enviarmos seu acesso para aprovação.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

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

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Enviar para aprovação
            </button>
          </form>

          <button
            onClick={signOut}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-full justify-center"
          >
            <LogOut size={16} />
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
