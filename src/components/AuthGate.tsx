import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Auth from '@/pages/Auth';
import PendingApproval from '@/pages/PendingApproval';
import CompleteProfile from '@/pages/CompleteProfile';

const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-14 w-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
        RJ
      </div>
      <Loader2 size={24} className="animate-spin text-primary" />
    </div>
  </div>
);

const AuthGate = ({ children }: { children: ReactNode }) => {
  const { session, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!session) return <Auth />;
  if (!profile) return <LoadingScreen />;
  if (!profile.tipo_solicitado) return <CompleteProfile />;
  if (profile.status !== 'aprovado') return <PendingApproval />;

  return <>{children}</>;
};

export default AuthGate;
