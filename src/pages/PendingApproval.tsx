import { Clock, XCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const PendingApproval = () => {
  const { profile, signOut } = useAuth();
  const rejeitado = profile?.status === 'rejeitado';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 text-center shadow-xl">
        <div className="h-14 w-14 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg mb-6">
          RJ
        </div>

        {rejeitado ? (
          <>
            <div className="h-16 w-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <XCircle size={32} className="text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Acesso não aprovado</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Sua solicitação de acesso não foi aprovada. Se você acredita que isso é um engano,
              entre em contato com a diretoria da RioJunior.
            </p>
          </>
        ) : (
          <>
            <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Clock size={32} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Aguardando aprovação</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Recebemos sua solicitação de acesso{profile?.nome ? `, ${profile.nome.split(' ')[0]}` : ''}.
              Um administrador da RioJunior vai validar seu cadastro e liberar seu acesso em breve.
            </p>
          </>
        )}

        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={16} />
          Sair da conta
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
