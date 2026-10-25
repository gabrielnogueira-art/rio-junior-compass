import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  nome: string | null;
  email: string | null;
  tipo_solicitado: string | null;
  ej_id: string | null;
  status: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: string[];
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginAsLocalDev: () => void;
  isLocalhost: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const TIPOS_USUARIO: Record<string, string> = {
  time_riojunior: 'Time RioJunior',
  professor_orientador: 'Professor Orientador',
  diretor_ej: 'Diretor de EJ',
  membro_ej: 'Membro de EJ',
};

const LOCAL_DEV_STORAGE_KEY = 'riojunior_local_dev_user_v1';

export const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const DEV_USER_ID = '00000000-0000-0000-0000-000000000001';

const DEV_PROFILE: Profile = {
  id: DEV_USER_ID,
  nome: 'Administrador (Localhost)',
  email: 'presidencia@riojunior.com.br',
  tipo_solicitado: 'time_riojunior',
  ej_id: null,
  status: 'aprovado',
};

const DEV_ROLES = ['admin', 'time_riojunior'];

const DEV_USER: User = {
  id: DEV_USER_ID,
  app_metadata: {},
  user_metadata: { full_name: 'Administrador (Localhost)' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'presidencia@riojunior.com.br',
};

const DEV_SESSION: Session = {
  access_token: 'dev-token-bypass',
  refresh_token: 'dev-refresh-token',
  expires_in: 86400,
  token_type: 'bearer',
  user: DEV_USER,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndRoles = useCallback(async (userId: string) => {
    try {
      const [{ data: profileData }, { data: rolesData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('user_roles').select('role').eq('user_id', userId),
      ]);
      setProfile(profileData as Profile | null);
      setRoles((rolesData ?? []).map((r) => r.role as string));
    } catch {
      setProfile(null);
      setRoles([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Se estiver no localhost e houver sessão dev ativa
    if (isLocalhost && localStorage.getItem(LOCAL_DEV_STORAGE_KEY) === 'true') {
      setSession(DEV_SESSION);
      setProfile(DEV_PROFILE);
      setRoles(DEV_ROLES);
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      if (isLocalhost && localStorage.getItem(LOCAL_DEV_STORAGE_KEY) === 'true') return;

      setSession(newSession);
      if (newSession?.user) {
        const userId = newSession.user.id;
        setTimeout(() => {
          if (!mounted) return;
          fetchProfileAndRoles(userId).finally(() => {
            if (mounted) setLoading(false);
          });
        }, 0);
      } else {
        setProfile(null);
        setRoles([]);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!mounted) return;
      if (isLocalhost && localStorage.getItem(LOCAL_DEV_STORAGE_KEY) === 'true') {
        setSession(DEV_SESSION);
        setProfile(DEV_PROFILE);
        setRoles(DEV_ROLES);
        setLoading(false);
        return;
      }

      setSession(initialSession);
      if (initialSession?.user) {
        await fetchProfileAndRoles(initialSession.user.id);
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfileAndRoles]);

  const signOut = useCallback(async () => {
    localStorage.removeItem(LOCAL_DEV_STORAGE_KEY);
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setRoles([]);
  }, []);

  const loginAsLocalDev = useCallback(() => {
    localStorage.setItem(LOCAL_DEV_STORAGE_KEY, 'true');
    setSession(DEV_SESSION);
    setProfile(DEV_PROFILE);
    setRoles(DEV_ROLES);
    setLoading(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user && session.user.id !== DEV_USER_ID) {
      await fetchProfileAndRoles(session.user.id);
    }
  }, [session, fetchProfileAndRoles]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        roles,
        isAdmin: roles.includes('admin'),
        loading,
        signOut,
        refreshProfile,
        loginAsLocalDev,
        isLocalhost,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
