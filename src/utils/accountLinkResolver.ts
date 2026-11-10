// src/utils/accountLinkResolver.ts
// Resolve e vincula automaticamente contas de usuários (por e-mail ou vínculo salvo)
// aos dados cadastrados da RioJunior (Time RioJunior / Guildas, Professores COEJ, EJs e Candidatos PS).

import { GuildaKey, GUILDAS_INFO } from '@/data/rolesGuildasData';
import { membrosCartoesService, MembroRioJunior } from '@/services/membrosCartoesService';
import { processoSeletivoService, PSCandidato } from '@/services/processoSeletivoService';
import { getDatabase } from '@/components/presidency/coej/database.js';

export type EffectiveUserType =
  | 'admin'
  | 'time_riojunior'
  | 'professor_orientador'
  | 'diretor_ej'
  | 'membro_ej'
  | 'candidato_ps';

export interface ResolvedAccountLink {
  email: string;
  matched: boolean;
  source: 'membro_riojunior' | 'professor_coej' | 'ej_cadastrada' | 'candidato_ps' | 'manual_link' | 'none';
  tipoUsuario: EffectiveUserType;
  nomeCadastrado: string | null;
  guilda: GuildaKey | null;
  guildaNome: string | null;
  cargo: string | null;
  membroId: string | null;
  membroStatus: MembroRioJunior['status'] | null;
  pedidoDesligamento?: boolean;
  professorId: string | null;
  ies: string | null;
  ejId: string | null;
  ejNome: string | null;
  allowedEjIds: string[];
  candidatoId: string | null;
  resumoVinculo: string;
}

export interface StoredManualLink {
  userId?: string;
  email: string;
  tipoUsuario: EffectiveUserType;
  nome?: string;
  guilda?: GuildaKey | null;
  cargo?: string | null;
  membroId?: string | null;
  ejId?: string | null;
  allowedEjIds?: string[];
  linkedAt: string;
}

const ACCOUNT_LINKS_STORAGE_KEY = 'riojunior_account_links_v1';

export function getStoredAccountLinks(): Record<string, StoredManualLink> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ACCOUNT_LINKS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveStoredAccountLink(link: StoredManualLink): void {
  if (typeof window === 'undefined') return;
  const normEmail = (link.email || '').trim().toLowerCase();
  if (!normEmail) return;
  const current = getStoredAccountLinks();
  current[normEmail] = {
    ...current[normEmail],
    ...link,
    email: normEmail,
    linkedAt: new Date().toISOString(),
  };
  localStorage.setItem(ACCOUNT_LINKS_STORAGE_KEY, JSON.stringify(current));
}

/**
 * Busca automaticamente nos bancos cadastrados da RioJunior se o e-mail pertence a:
 * 1. Membro cadastrado do Time RioJunior (membrosCartoesService) -> retorna guilda, cargo, nome, status
 * 2. Professor Orientador no COEJ (Usuarios_COEJ) -> retorna EJs vinculadas, IES, nome
 * 3. Diretor / Responsável de EJ federada (Empresas_Juniores) -> retorna EJ vinculada
 * 4. Candidato do Processo Seletivo (processoSeletivoService) -> retorna dados do candidato
 */
export function resolveAccountByEmail(
  email?: string | null,
  profileEjId?: string | null,
  profileTipoSolicitado?: string | null
): ResolvedAccountLink {
  const normEmail = (email || '').trim().toLowerCase();
  const storedLinks = getStoredAccountLinks();
  const manual = normEmail ? storedLinks[normEmail] : undefined;

  if (!normEmail) {
    return {
      email: '',
      matched: false,
      source: 'none',
      tipoUsuario: (profileTipoSolicitado as EffectiveUserType) || 'time_riojunior',
      nomeCadastrado: null,
      guilda: null,
      guildaNome: null,
      cargo: null,
      membroId: null,
      membroStatus: null,
      professorId: null,
      ies: null,
      ejId: profileEjId || null,
      ejNome: null,
      allowedEjIds: profileEjId ? [profileEjId] : [],
      candidatoId: null,
      resumoVinculo: 'Sem e-mail informado',
    };
  }

  // 1. Verifica na base oficial de membros do Time RioJunior
  const membro: MembroRioJunior | undefined = membrosCartoesService.getMembroByEmail(normEmail);
  if (membro) {
    const gKey = manual?.guilda || membro.guilda;
    const gInfo = GUILDAS_INFO[gKey];
    const isPedidoDesligamento =
      !!membro.pedidoDesligamento || membro.desligamentoManual?.tipo === 'pedido_desligamento';
    return {
      email: normEmail,
      matched: true,
      source: 'membro_riojunior',
      tipoUsuario: 'time_riojunior',
      nomeCadastrado: membro.nome,
      guilda: gKey,
      guildaNome: gInfo?.nome || gKey,
      cargo: membro.cargo,
      membroId: membro.id,
      membroStatus: membro.status,
      pedidoDesligamento: isPedidoDesligamento,
      professorId: null,
      ies: null,
      ejId: null,
      ejNome: null,
      allowedEjIds: [],
      candidatoId: null,
      resumoVinculo: `${membro.nome} • Guilda ${gKey} (${membro.cargo})`,
    };
  }

  // 2. Verifica na base de Professores Orientadores do COEJ
  try {
    const db = getDatabase();
    const profMatches = (db.Usuarios_COEJ || []).filter(
      (u: any) => (u.email || '').trim().toLowerCase() === normEmail
    );

    if (profMatches.length > 0) {
      const mainProf = profMatches[0];
      const linkedIds = new Set<string>();
      profMatches.forEach((p: any) => {
        if (p.id_ej_vinculada) linkedIds.add(p.id_ej_vinculada);
        if (Array.isArray(p.ejs_vinculadas)) {
          p.ejs_vinculadas.forEach((id: string) => linkedIds.add(id));
        }
      });
      if (profileEjId) linkedIds.add(profileEjId);
      if (manual?.ejId) linkedIds.add(manual.ejId);
      if (manual?.allowedEjIds) manual.allowedEjIds.forEach((id) => linkedIds.add(id));

      const allowedEjIds = Array.from(linkedIds);
      const firstEj = (db.Empresas_Juniores || []).find((e: any) => e.id_ej === allowedEjIds[0]);

      return {
        email: normEmail,
        matched: true,
        source: 'professor_coej',
        tipoUsuario: 'professor_orientador',
        nomeCadastrado: mainProf.nome,
        guilda: null,
        guildaNome: null,
        cargo: mainProf.titulacao || 'Professor Orientador COEJ',
        membroId: null,
        membroStatus: null,
        professorId: mainProf.id_auth,
        ies: mainProf.ies || firstEj?.ies || null,
        ejId: allowedEjIds[0] || null,
        ejNome: firstEj?.nome || null,
        allowedEjIds,
        candidatoId: null,
        resumoVinculo: `${mainProf.nome} • Professor Orientador (${firstEj?.nome || mainProf.ies || 'COEJ'})`,
      };
    }

    // 3. Verifica na base de Empresas Juniores (e-mail institucional da EJ ou presidente/responsável)
    const ejMatch = (db.Empresas_Juniores || []).find(
      (e: any) =>
        (e.email_ej || '').trim().toLowerCase() === normEmail ||
        (e.membro_responsavel?.email || '').trim().toLowerCase() === normEmail
    );

    if (ejMatch) {
      const allowedEjIds = Array.from(new Set([ejMatch.id_ej, ...(profileEjId ? [profileEjId] : [])]));
      return {
        email: normEmail,
        matched: true,
        source: 'ej_cadastrada',
        tipoUsuario: (profileTipoSolicitado as EffectiveUserType) === 'membro_ej' ? 'membro_ej' : 'diretor_ej',
        nomeCadastrado: ejMatch.membro_responsavel?.nome || `Presidência ${ejMatch.nome}`,
        guilda: null,
        guildaNome: null,
        cargo: ejMatch.membro_responsavel?.cargo || 'Diretor(a) de EJ',
        membroId: null,
        membroStatus: null,
        professorId: null,
        ies: ejMatch.ies || null,
        ejId: ejMatch.id_ej,
        ejNome: ejMatch.nome,
        allowedEjIds,
        candidatoId: null,
        resumoVinculo: `${ejMatch.nome} (${ejMatch.ies})`,
      };
    }
  } catch (err) {
    console.error('Erro ao consultar base COEJ para vínculo automático:', err);
  }

  // 4. Verifica na base de Candidatos do Processo Seletivo
  try {
    const psState = processoSeletivoService.getState();
    const cand: PSCandidato | undefined = (psState.candidatos || []).find(
      (c) => (c.email || '').trim().toLowerCase() === normEmail
    );
    if (cand) {
      return {
        email: normEmail,
        matched: true,
        source: 'candidato_ps',
        tipoUsuario: 'candidato_ps',
        nomeCadastrado: cand.nome,
        guilda: cand.guildaAlvo,
        guildaNome: GUILDAS_INFO[cand.guildaAlvo]?.nome || cand.guildaAlvo,
        cargo: cand.frenteAlvo,
        membroId: null,
        membroStatus: null,
        professorId: null,
        ies: cand.ies,
        ejId: null,
        ejNome: cand.ejOrigem,
        allowedEjIds: [],
        candidatoId: cand.id,
        resumoVinculo: `${cand.nome} • Candidato PS (${cand.guildaAlvo} - ${cand.frenteAlvo})`,
      };
    }
  } catch (err) {
    console.error('Erro ao consultar candidatos PS:', err);
  }

  // 5. Verifica se há um vínculo manual salvo pelo ADM
  if (manual) {
    const gKey = manual.guilda || null;
    const allowed = manual.allowedEjIds?.length
      ? manual.allowedEjIds
      : manual.ejId
      ? [manual.ejId]
      : profileEjId
      ? [profileEjId]
      : [];
    return {
      email: normEmail,
      matched: true,
      source: 'manual_link',
      tipoUsuario: manual.tipoUsuario,
      nomeCadastrado: manual.nome || null,
      guilda: gKey,
      guildaNome: gKey ? GUILDAS_INFO[gKey]?.nome || gKey : null,
      cargo: manual.cargo || null,
      membroId: manual.membroId || null,
      membroStatus: null,
      professorId: null,
      ies: null,
      ejId: manual.ejId || profileEjId || null,
      ejNome: null,
      allowedEjIds: allowed,
      candidatoId: null,
      resumoVinculo: manual.guilda
        ? `Vínculo manual • Guilda ${manual.guilda}`
        : `Vínculo manual • ${manual.tipoUsuario}`,
    };
  }

  // Sem match direto nas bases: usa dados do profile se houver
  const fallbackAllowed = profileEjId ? [profileEjId] : [];
  return {
    email: normEmail,
    matched: false,
    source: 'none',
    tipoUsuario: (profileTipoSolicitado as EffectiveUserType) || 'time_riojunior',
    nomeCadastrado: null,
    guilda: null,
    guildaNome: null,
    cargo: null,
    membroId: null,
    membroStatus: null,
    professorId: null,
    ies: null,
    ejId: profileEjId || null,
    ejNome: null,
    allowedEjIds: fallbackAllowed,
    candidatoId: null,
    resumoVinculo: 'E-mail ainda não listado na base pré-cadastrada',
  };
}

