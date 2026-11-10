import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { processoSeletivoService } from '@/services/processoSeletivoService';
import { GuildaKey } from '@/data/rolesGuildasData';
import { membrosCartoesService } from '@/services/membrosCartoesService';
import {
  resolveAccountByEmail,
  ResolvedAccountLink,
  EffectiveUserType,
  saveStoredAccountLink,
} from '@/utils/accountLinkResolver';

export interface Profile {
  id: string;
  nome: string | null;
  email: string | null;
  tipo_solicitado: string | null;
  ej_id: string | null;
  status: string;
}

export type AdminSimulatedViewMode =
  | 'admin'
  | 'time_PRESEX'
  | 'time_VPNEG'
  | 'time_DDR'
  | 'time_FE'
  | 'time_OP'
  | 'time_PRESCON'
  | 'professor_orientador'
  | 'diretor_ej'
  | 'candidato_ps';

export const ADMIN_VIEW_MODES: Array<{
  id: AdminSimulatedViewMode;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    id: 'admin',
    label: '👑 Administrador (Acesso Total)',
    shortLabel: 'ADM Total',
    description: 'Acesso irrestrito a todas as abas, Gestão de Time/Jornada e edição completa.',
  },
  {
    id: 'time_PRESEX',
    label: '🏛️ Time RioJunior — PresEx',
    shortLabel: 'Time: PresEx',
    description: 'Vê todas as abas do time (exceto Gestão de Time/Jornada OP) e edita apenas PresEx.',
  },
  {
    id: 'time_VPNEG',
    label: '💼 Time RioJunior — VPNeg',
    shortLabel: 'Time: VPNeg',
    description: 'Vê todas as abas do time (exceto Gestão de Time/Jornada OP) e edita apenas VPNeg.',
  },
  {
    id: 'time_DDR',
    label: '🌐 Time RioJunior — DDR',
    shortLabel: 'Time: DDR',
    description: 'Vê todas as abas do time (exceto Gestão de Time/Jornada OP) e edita apenas DDR.',
  },
  {
    id: 'time_FE',
    label: '🎓 Time RioJunior — Formação Empreendedora (FE)',
    shortLabel: 'Time: FE',
    description: 'Vê todas as abas do time (exceto Gestão de Time/Jornada OP) e edita apenas FE.',
  },
  {
    id: 'time_OP',
    label: '⚙️ Time RioJunior — Operações (OP)',
    shortLabel: 'Time: OP',
    description: 'Vê abas do time e edita Operações (Gestão de Time e Jornada fica restrita aos ADMs).',
  },
  {
    id: 'time_PRESCON',
    label: '⚖️ Time RioJunior — Conselho (PresCon)',
    shortLabel: 'Time: Conselho',
    description: 'Visualiza as abas estratégicas em modo leitura.',
  },
  {
    id: 'professor_orientador',
    label: '👨‍🏫 Professor Orientador (Painel COEJ)',
    shortLabel: 'Professor (COEJ)',
    description: 'Acessa exclusivamente o Painel do COEJ restrito às suas EJs vinculadas.',
  },
  {
    id: 'diretor_ej',
    label: '🏢 Diretor / Membro de EJ (Painel COEJ)',
    shortLabel: 'Membro/Diretor EJ',
    description: 'Acessa exclusivamente os dados da sua Empresa Júnior no Painel do COEJ.',
  },
  {
    id: 'candidato_ps',
    label: '🚀 Candidato Externo (Portal Processo Seletivo)',
    shortLabel: 'Candidato PS',
    description: 'Acessa exclusivamente o Portal Gamificado do Processo Seletivo / Aditivo.',
  },
];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: string[];
  /** Verdadeiro se a conta logada realmente possui papel de ADM (mesmo simulando outra visão) */
  isActualAdmin: boolean;
  /** Verdadeiro se é ADM e está na visualização ADM Total */
  isAdmin: boolean;
  isExternalCandidate: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginAsLocalDev: () => void;
  loginAsCandidate: (email?: string, codigoAcesso?: string) => { ok: boolean; error?: string };
  isLocalhost: boolean;
  /** Dados resolvidos automaticamente pelo e-mail cadastrado */
  accountLink: ResolvedAccountLink;
  /** Modo de visualização simulado pelo ADM para testes */
  simulatedViewMode: AdminSimulatedViewMode;
  setSimulatedViewMode: (mode: AdminSimulatedViewMode) => void;
  /** EJ(s) selecionada(s) pelo ADM ao testar a visão de Professor Orientador / EJ */
  simulatedEjIds: string[];
  setSimulatedEjIds: (ejIds: string[]) => void;
  /** Tipo de usuário efetivo considerando simulação do ADM */
  effectiveUserType: EffectiveUserType;
  /** Guilda efetiva do membro do Time RioJunior (real ou simulada) */
  effectiveGuilda: GuildaKey | null;
  /** EJs permitidas para visualização quando Professor Orientador ou Membro/Diretor de EJ */
  allowedProfessorEjIds: string[];
  /** Permissões granulares de edição e visualização por diretoria */
  canEditPresEx: boolean;
  canEditVPNeg: boolean;
  canEditDDR: boolean;
  canEditFE: boolean;
  canEditOP: boolean;
  canViewGestaoTimeOP: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const TIPOS_USUARIO: Record<string, string> = {
  time_riojunior: 'Time RioJunior',
  professor_orientador: 'Professor Orientador',
  diretor_ej: 'Diretor de EJ',
  membro_ej: 'Membro de EJ',
  candidato_ps: 'Candidato — Processo Seletivo / Aditivo',
};

const LOCAL_DEV_STORAGE_KEY = 'riojunior_local_dev_user_v1';
const LOCAL_CANDIDATE_STORAGE_KEY = 'riojunior_external_candidate_session_v1';
const SIMULATED_VIEW_STORAGE_KEY = 'riojunior_admin_simulated_view_v1';
const SIMULATED_EJS_STORAGE_KEY = 'riojunior_admin_simulated_ejs_v1';

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

function buildCandidateSession(candEmail: string, candName: string, candId: string) {
  const user: User = {
    id: candId,
    app_metadata: {},
    user_metadata: { full_name: candName },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: candEmail,
  };
  const session: Session = {
    access_token: 'candidate-ps-token',
    refresh_token: 'candidate-ps-refresh',
    expires_in: 86400,
    token_type: 'bearer',
    user,
  };
  const profile: Profile = {
    id: candId,
    nome: candName,
    email: candEmail,
    tipo_solicitado: 'candidato_ps',
    ej_id: null,
    status: 'aprovado',
  };
  return { session, profile, roles: ['candidato_ps'] };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [membrosVersion, setMembrosVersion] = useState(0);

  const [simulatedViewMode, setSimulatedViewModeState] = useState<AdminSimulatedViewMode>(() => {
    if (typeof window === 'undefined') return 'admin';
    return (localStorage.getItem(SIMULATED_VIEW_STORAGE_KEY) as AdminSimulatedViewMode) || 'admin';
  });

  const [simulatedEjIds, setSimulatedEjIdsState] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ['ej_002'];
    try {
      const saved = localStorage.getItem(SIMULATED_EJS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return ['ej_002'];
  });

  const setSimulatedViewMode = useCallback((mode: AdminSimulatedViewMode) => {
    setSimulatedViewModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIMULATED_VIEW_STORAGE_KEY, mode);
    }
  }, []);

  const setSimulatedEjIds = useCallback((ejIds: string[]) => {
    const clean = ejIds.length > 0 ? ejIds : ['ej_002'];
    setSimulatedEjIdsState(clean);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIMULATED_EJS_STORAGE_KEY, JSON.stringify(clean));
    }
  }, []);

  // Escuta alterações no cadastro de membros para atualizar vínculo em tempo real
  useEffect(() => {
    const unsub = membrosCartoesService.subscribe(() => {
      setMembrosVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  const fetchProfileAndRoles = useCallback(async (userId: string, userEmail?: string | null) => {
    try {
      const [{ data: profileData }, { data: rolesData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('user_roles').select('role').eq('user_id', userId),
      ]);

      let finalProfile = (profileData as Profile | null) ?? null;
      const fetchedRoles = (rolesData ?? []).map((r) => r.role as string);

      // Vínculo automático por e-mail caso o usuário já esteja cadastrado na base
      const emailToResolve = finalProfile?.email || userEmail;
      if (emailToResolve) {
        const resolved = resolveAccountByEmail(
          emailToResolve,
          finalProfile?.ej_id,
          finalProfile?.tipo_solicitado
        );

        if (resolved.matched && finalProfile) {
          const needsProfileSync =
            (!finalProfile.nome && resolved.nomeCadastrado) ||
            (!finalProfile.tipo_solicitado && resolved.tipoUsuario) ||
            (!finalProfile.ej_id && resolved.ejId);

          if (needsProfileSync) {
            const updatedFields = {
              nome: finalProfile.nome || resolved.nomeCadastrado,
              tipo_solicitado: finalProfile.tipo_solicitado || resolved.tipoUsuario,
              ej_id: finalProfile.ej_id || resolved.ejId,
            };
            finalProfile = { ...finalProfile, ...updatedFields };
            // Atualiza silenciosamente no banco
            supabase
              .from('profiles')
              .update(updatedFields)
              .eq('id', userId)
              .then(() => {});
          }

          // Salva vínculo local para referência rápida
          saveStoredAccountLink({
            userId,
            email: emailToResolve,
            tipoUsuario: resolved.tipoUsuario,
            nome: resolved.nomeCadastrado || finalProfile.nome || undefined,
            guilda: resolved.guilda,
            cargo: resolved.cargo,
            membroId: resolved.membroId,
            ejId: resolved.ejId || finalProfile.ej_id,
            allowedEjIds: resolved.allowedEjIds,
            linkedAt: new Date().toISOString(),
          });
        }
      }

      setProfile(finalProfile);
      setRoles(fetchedRoles);
    } catch {
      setProfile(null);
      setRoles([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // 1. Verifica se há sessão de Candidato Externo do Processo Seletivo ativa
    const savedCandidateEmail = localStorage.getItem(LOCAL_CANDIDATE_STORAGE_KEY);
    if (savedCandidateEmail) {
      const cand = processoSeletivoService.getCandidatoByEmail(savedCandidateEmail);
      if (cand) {
        const built = buildCandidateSession(cand.email, cand.nome, cand.id);
        setSession(built.session);
        setProfile(built.profile);
        setRoles(built.roles);
        setLoading(false);
        return;
      }
    }

    // 2. Se estiver no localhost e houver sessão dev admin ativa
    if (isLocalhost && localStorage.getItem(LOCAL_DEV_STORAGE_KEY) === 'true') {
      setSession(DEV_SESSION);
      setProfile(DEV_PROFILE);
      setRoles(DEV_ROLES);
      setLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      if (localStorage.getItem(LOCAL_CANDIDATE_STORAGE_KEY)) return;
      if (isLocalhost && localStorage.getItem(LOCAL_DEV_STORAGE_KEY) === 'true') return;

      setSession(newSession);
      if (newSession?.user) {
        const userId = newSession.user.id;
        const userEmail = newSession.user.email;
        setTimeout(() => {
          if (!mounted) return;
          fetchProfileAndRoles(userId, userEmail).finally(() => {
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
      if (localStorage.getItem(LOCAL_CANDIDATE_STORAGE_KEY)) return;
      if (isLocalhost && localStorage.getItem(LOCAL_DEV_STORAGE_KEY) === 'true') {
        setSession(DEV_SESSION);
        setProfile(DEV_PROFILE);
        setRoles(DEV_ROLES);
        setLoading(false);
        return;
      }

      setSession(initialSession);
      if (initialSession?.user) {
        await fetchProfileAndRoles(initialSession.user.id, initialSession.user.email);
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
    localStorage.removeItem(LOCAL_CANDIDATE_STORAGE_KEY);
    localStorage.removeItem(SIMULATED_VIEW_STORAGE_KEY);
    setSimulatedViewModeState('admin');
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setRoles([]);
  }, []);

  const loginAsLocalDev = useCallback(() => {
    localStorage.removeItem(LOCAL_CANDIDATE_STORAGE_KEY);
    localStorage.setItem(LOCAL_DEV_STORAGE_KEY, 'true');
    setSession(DEV_SESSION);
    setProfile(DEV_PROFILE);
    setRoles(DEV_ROLES);
    setLoading(false);
  }, []);

  const loginAsCandidate = useCallback(
    (email?: string, codigoAcesso?: string): { ok: boolean; error?: string } => {
      const state = processoSeletivoService.getState();
      const target = email
        ? state.candidatos.find((c) => c.email.toLowerCase() === email.trim().toLowerCase())
        : state.candidatos[0];

      if (!target) {
        return {
          ok: false,
          error: 'E-mail de candidato não encontrado no Processo Seletivo atual.',
        };
      }

      if (
        codigoAcesso !== undefined &&
        target.codigoAcesso &&
        target.codigoAcesso.trim().toLowerCase() !== codigoAcesso.trim().toLowerCase()
      ) {
        return {
          ok: false,
          error: 'Código de acesso / senha do Processo Seletivo incorreto.',
        };
      }

      localStorage.removeItem(LOCAL_DEV_STORAGE_KEY);
      localStorage.setItem(LOCAL_CANDIDATE_STORAGE_KEY, target.email);
      const built = buildCandidateSession(target.email, target.nome, target.id);
      setSession(built.session);
      setProfile(built.profile);
      setRoles(built.roles);
      setLoading(false);
      return { ok: true };
    },
    []
  );

  const refreshProfile = useCallback(async () => {
    if (
      session?.user &&
      session.user.id !== DEV_USER_ID &&
      !localStorage.getItem(LOCAL_CANDIDATE_STORAGE_KEY)
    ) {
      await fetchProfileAndRoles(session.user.id, session.user.email);
    }
  }, [session, fetchProfileAndRoles]);

  // Vínculo automático resolvido por e-mail
  const accountLink = useMemo(() => {
    const email = profile?.email || session?.user?.email;
    return resolveAccountByEmail(email, profile?.ej_id, profile?.tipo_solicitado);
  }, [profile?.email, profile?.ej_id, profile?.tipo_solicitado, session?.user?.email, membrosVersion]);

  const isActualAdmin = roles.includes('admin');
  const activeSimulatedMode: AdminSimulatedViewMode = isActualAdmin ? simulatedViewMode : 'admin';
  const isAdmin = isActualAdmin && activeSimulatedMode === 'admin';

  // Determina o tipo de usuário efetivo (considerando simulação do ADM ou vínculo real do usuário)
  const effectiveUserType = useMemo<EffectiveUserType>(() => {
    if (isActualAdmin) {
      if (activeSimulatedMode === 'admin') return 'admin';
      if (activeSimulatedMode.startsWith('time_')) return 'time_riojunior';
      if (activeSimulatedMode === 'professor_orientador') return 'professor_orientador';
      if (activeSimulatedMode === 'diretor_ej') return 'diretor_ej';
      if (activeSimulatedMode === 'candidato_ps') return 'candidato_ps';
    }

    if (roles.includes('candidato_ps') || profile?.tipo_solicitado === 'candidato_ps') {
      return 'candidato_ps';
    }
    if (roles.includes('professor_orientador') || profile?.tipo_solicitado === 'professor_orientador') {
      return 'professor_orientador';
    }
    if (roles.includes('diretor_ej') || profile?.tipo_solicitado === 'diretor_ej') {
      return 'diretor_ej';
    }
    if (roles.includes('membro_ej') || profile?.tipo_solicitado === 'membro_ej') {
      return 'membro_ej';
    }
    if (roles.includes('time_riojunior') || profile?.tipo_solicitado === 'time_riojunior') {
      return 'time_riojunior';
    }

    // Fallback pelo vínculo automático do e-mail
    return accountLink.tipoUsuario || 'time_riojunior';
  }, [isActualAdmin, activeSimulatedMode, roles, profile?.tipo_solicitado, accountLink.tipoUsuario]);

  // Determina a guilda efetiva (quando Time RioJunior)
  const effectiveGuilda = useMemo<GuildaKey | null>(() => {
    if (isActualAdmin && activeSimulatedMode.startsWith('time_')) {
      return activeSimulatedMode.replace('time_', '') as GuildaKey;
    }
    return accountLink.guilda;
  }, [isActualAdmin, activeSimulatedMode, accountLink.guilda]);

  // EJs permitidas para Professor Orientador ou Diretor/Membro de EJ
  const allowedProfessorEjIds = useMemo<string[]>(() => {
    if (isActualAdmin && (activeSimulatedMode === 'professor_orientador' || activeSimulatedMode === 'diretor_ej')) {
      return simulatedEjIds;
    }
    if (accountLink.allowedEjIds.length > 0) {
      return accountLink.allowedEjIds;
    }
    if (profile?.ej_id) {
      return [profile.ej_id];
    }
    return [];
  }, [isActualAdmin, activeSimulatedMode, simulatedEjIds, accountLink.allowedEjIds, profile?.ej_id]);

  const isExternalCandidate = effectiveUserType === 'candidato_ps';

  // Permissões de Edição por Aba / Diretoria:
  // - ADMs na visão ADM editam tudo
  // - Time RioJunior visualiza todas as abas (exceto Gestão de Time/Jornada OP que é restrita aos ADMs)
  //   e edita apenas a aba da sua própria Guilda/Diretoria
  const canEditPresEx = isAdmin || (effectiveUserType === 'time_riojunior' && effectiveGuilda === 'PRESEX');
  const canEditVPNeg = isAdmin || (effectiveUserType === 'time_riojunior' && effectiveGuilda === 'VPNEG');
  const canEditDDR = isAdmin || (effectiveUserType === 'time_riojunior' && effectiveGuilda === 'DDR');
  const canEditFE = isAdmin || (effectiveUserType === 'time_riojunior' && effectiveGuilda === 'FE');
  const canEditOP = isAdmin || (effectiveUserType === 'time_riojunior' && effectiveGuilda === 'OP');
  const canViewGestaoTimeOP = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        roles,
        isActualAdmin,
        isAdmin,
        isExternalCandidate,
        loading,
        signOut,
        refreshProfile,
        loginAsLocalDev,
        loginAsCandidate,
        isLocalhost,
        accountLink,
        simulatedViewMode: activeSimulatedMode,
        setSimulatedViewMode,
        simulatedEjIds,
        setSimulatedEjIds,
        effectiveUserType,
        effectiveGuilda,
        allowedProfessorEjIds,
        canEditPresEx,
        canEditVPNeg,
        canEditDDR,
        canEditFE,
        canEditOP,
        canViewGestaoTimeOP,
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
