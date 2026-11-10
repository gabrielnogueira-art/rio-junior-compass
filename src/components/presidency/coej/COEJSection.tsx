import React, { useState, useEffect, useMemo } from 'react';
import { getDatabase, saveDatabase, resetDatabase, getDadosConsolidadosEJ } from './database.js';
import { Building2, GraduationCap, ShieldCheck, RefreshCw, Landmark, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import OverviewDashboard from './views/OverviewDashboard.jsx';
import MercadoFinanceiroView from './views/MercadoFinanceiroView.jsx';
import ExtensaoIESView from './views/ExtensaoIESView.jsx';
import JuridicoInternoView from './views/JuridicoInternoView.jsx';
import RelatorioFormModal from './views/RelatorioFormModal.jsx';
import OrientadorPainelModal from './views/OrientadorPainelModal.jsx';
import RelatorioInstitucionalPrintModal from './views/RelatorioInstitucionalPrintModal.jsx';
import IESEPainelView from './views/IESEPainelView.jsx';
import CadastroProfessorModal from './views/CadastroProfessorModal.jsx';
import CadastroEJModal from './views/CadastroEJModal.jsx';
import './coej.css';

interface COEJSectionProps {
  /** Quando verdadeiro, restringe o painel COEJ às EJs vinculadas ao Professor ou Membro/Diretor de EJ */
  restrictedMode?: 'orientador' | 'membro_ej' | null;
  allowedEjIds?: string[];
}

export default function COEJSection({ restrictedMode = null, allowedEjIds = [] }: COEJSectionProps) {
  const { isAdmin, effectiveUserType, allowedProfessorEjIds, accountLink } = useAuth();
  const [db, setDb] = useState(() => getDatabase());

  const effectiveRestriction: 'orientador' | 'membro_ej' | null = useMemo(() => {
    if (restrictedMode) return restrictedMode;
    if (!isAdmin) {
      if (effectiveUserType === 'professor_orientador') return 'orientador';
      if (effectiveUserType === 'diretor_ej' || effectiveUserType === 'membro_ej') return 'membro_ej';
    }
    return null;
  }, [restrictedMode, isAdmin, effectiveUserType]);

  const effectiveAllowedEjIds = useMemo(() => {
    const ids = allowedEjIds.length > 0 ? allowedEjIds : allowedProfessorEjIds;
    return ids;
  }, [allowedEjIds, allowedProfessorEjIds]);

  const [userRole, setUserRole] = useState<string>(() => {
    if (effectiveRestriction === 'orientador') return 'orientador';
    if (effectiveRestriction === 'membro_ej') return 'membro_ej';
    return 'orientador';
  });

  // Lista de EJs visíveis (restrita às EJs do professor/membro quando aplicável)
  const listaEJs = useMemo(() => {
    const todas = db.Empresas_Juniores || [];
    if (effectiveRestriction && effectiveAllowedEjIds.length > 0) {
      const filtradas = todas.filter((ej: any) => effectiveAllowedEjIds.includes(ej.id_ej));
      if (filtradas.length > 0) return filtradas;
    }
    // Se for professor orientador e tiver IES vinculada no cadastro, filtra pelas EJs daquela IES/professor
    if (effectiveRestriction === 'orientador' && accountLink.ies) {
      const iesNorm = accountLink.ies.toUpperCase();
      const porIes = todas.filter((ej: any) => (ej.ies || '').toUpperCase().includes(iesNorm));
      if (porIes.length > 0) return porIes;
    }
    return todas;
  }, [db.Empresas_Juniores, effectiveRestriction, effectiveAllowedEjIds, accountLink.ies]);

  const [selectedEjId, setSelectedEjId] = useState<string>(() => {
    if (effectiveAllowedEjIds.length > 0) return effectiveAllowedEjIds[0];
    return 'ej_002';
  });

  useEffect(() => {
    if (effectiveRestriction === 'orientador') {
      setUserRole('orientador');
    } else if (effectiveRestriction === 'membro_ej') {
      setUserRole('membro_ej');
    }
  }, [effectiveRestriction]);

  useEffect(() => {
    if (listaEJs.length > 0 && !listaEJs.some((e: any) => e.id_ej === selectedEjId)) {
      setSelectedEjId(listaEJs[0].id_ej);
    }
  }, [listaEJs, selectedEjId]);

  const [activeTab, setActiveTab] = useState('overview');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showOrientadorModal, setShowOrientadorModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showProfModal, setShowProfModal] = useState(false);
  const [showEJModal, setShowEJModal] = useState(false);

  useEffect(() => {
    saveDatabase(db);
  }, [db]);

  const dadosAtuais = getDadosConsolidadosEJ(db, selectedEjId, '2025_Q3');

  const handleUpdateDatabase = (newDb: any) => {
    setDb({ ...newDb });
  };

  const handleResetDemo = () => {
    if (window.confirm('Deseja restaurar os dados originais de demonstração do COEJ?')) {
      const fresh = resetDatabase();
      setDb({ ...fresh });
    }
  };

  return (
    <div className="coej-scope">
      <div className="coej-wrapper">
        {/* Banner de isolamento quando Professor Orientador ou Membro/Diretor de EJ */}
        {effectiveRestriction && (
          <div
            style={{
              marginBottom: '0.85rem',
              padding: '0.65rem 1rem',
              borderRadius: '0.75rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.78rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={15} style={{ color: '#10b981', flexShrink: 0 }} />
              <span>
                <strong>
                  {effectiveRestriction === 'orientador'
                    ? 'Painel Exclusivo do Professor Orientador (COEJ):'
                    : 'Painel Exclusivo da Empresa Júnior (COEJ):'}
                </strong>{' '}
                Exibindo especificamente os dados da(s) sua(s) Empresa(s) Júnior(es) vinculada(s) ({listaEJs.map((e: any) => e.nome).join(', ')}).
              </span>
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.15rem 0.55rem',
                borderRadius: '999px',
                background: 'rgba(16, 185, 129, 0.18)',
                color: '#10b981',
              }}
            >
              {listaEJs.length} {listaEJs.length === 1 ? 'EJ vinculada' : 'EJs vinculadas'}
            </span>
          </div>
        )}

        {/* Top Header */}
        <header className="top-header">
          <div className="header-inner">
            <div className="brand-box">
              <div className="brand-logo">RJ</div>
              <div>
                <div className="brand-title">Portal COEJ &amp; Governança</div>
                <span className="brand-subtitle">
                  RioJunior • Acompanhamento Trimestral, Selo EJ, Extensão &amp; Fomento IES
                </span>
              </div>
            </div>

            <div className="role-switcher-bar">
              {/* EJ Selector (filtrado para as EJs do professor quando em modo restrito) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {effectiveRestriction ? 'Sua EJ:' : 'EJ:'}
                </span>
                <select
                  className="ej-selector"
                  value={selectedEjId}
                  onChange={(e) => setSelectedEjId(e.target.value)}
                >
                  {listaEJs.map((ej: any) => (
                    <option key={ej.id_ej} value={ej.id_ej}>
                      {ej.nome} ({ej.cluster} • {ej.tipo_maturidade} Maturidade)
                    </option>
                  ))}
                </select>
              </div>

              {/* Role Switcher interno do COEJ — visível apenas para o Time RioJunior / ADMs */}
              {!effectiveRestriction && (
                <div className="role-pill-group">
                  <button
                    className={`role-pill ${userRole === 'membro_ej' ? 'active' : ''}`}
                    onClick={() => setUserRole('membro_ej')}
                    title="Visão da Diretoria da EJ (Envia Relatórios e Solicita Apoio/Editais)"
                  >
                    <Building2 size={14} /> Membro EJ
                  </button>
                  <button
                    className={`role-pill ${userRole === 'orientador' ? 'active' : ''}`}
                    onClick={() => setUserRole('orientador')}
                    title="Visão do Professor Orientador (Homologa Relatório, Valida Extensão e Articula IES)"
                  >
                    <GraduationCap size={14} /> Prof. Orientador
                  </button>
                  <button
                    className={`role-pill ${userRole === 'admin_riojunior' ? 'active' : ''}`}
                    onClick={() => setUserRole('admin_riojunior')}
                    title="Visão Governança RioJunior (Auditoria Global e Ranking IESE)"
                  >
                    <ShieldCheck size={14} /> RioJunior
                  </button>
                  <button
                    className={`role-pill ${userRole === 'reitor_ies' ? 'active' : ''}`}
                    onClick={() => setUserRole('reitor_ies')}
                    title="Visão Reitoria / Pró-Reitoria de Extensão (REUNI)"
                  >
                    <Landmark size={14} /> REUNI (Reitoria)
                  </button>
                </div>
              )}

              {!effectiveRestriction && (
                <button className="btn btn-outline" onClick={handleResetDemo} title="Restaurar Dados Demo">
                  <RefreshCw size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="nav-tabs-bar">
            <button
              className={`nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              1. Visão Geral &amp; Parecer COEJ
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'mercado' ? 'active' : ''}`}
              onClick={() => setActiveTab('mercado')}
            >
              2. Mercado &amp; Execução Financeira (Entradas/Saídas)
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'extensao' ? 'active' : ''}`}
              onClick={() => setActiveTab('extensao')}
            >
              3. Impacto Acadêmico, Extensão &amp; Fomento IES
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'juridico' ? 'active' : ''}`}
              onClick={() => setActiveTab('juridico')}
            >
              4. Auditoria Selo EJ (13 Docs), PCO &amp; NPS
            </button>
            {!effectiveRestriction && (
              <button
                className={`nav-tab-btn ${activeTab === 'iese' ? 'active' : ''}`}
                onClick={() => setActiveTab('iese')}
              >
                5. Índice IESE &amp; Chancela REUNI
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="main-container">
          {activeTab === 'overview' && (
            <OverviewDashboard
              dados={dadosAtuais}
              userRole={userRole}
              onOpenFormModal={() => setShowFormModal(true)}
              onOpenOrientadorModal={() => setShowOrientadorModal(true)}
              onOpenPrintModal={() => setShowPrintModal(true)}
              onOpenProfModal={() => setShowProfModal(true)}
              onOpenEJModal={() => setShowEJModal(true)}
              onChangeTab={setActiveTab}
            />
          )}

          {activeTab === 'mercado' && (
            <MercadoFinanceiroView
              dados={dadosAtuais}
              userRole={userRole}
              db={db}
              onUpdateDb={handleUpdateDatabase}
              onOpenFormModal={() => setShowFormModal(true)}
            />
          )}

          {activeTab === 'extensao' && (
            <ExtensaoIESView
              dados={dadosAtuais}
              userRole={userRole}
              db={db}
              onUpdateDb={handleUpdateDatabase}
              onOpenOrientadorModal={() => setShowOrientadorModal(true)}
            />
          )}

          {activeTab === 'juridico' && (
            <JuridicoInternoView
              dados={dadosAtuais}
              userRole={userRole}
              db={db}
              onUpdateDb={handleUpdateDatabase}
            />
          )}

          {activeTab === 'iese' && !effectiveRestriction && (
            <IESEPainelView
              dados={dadosAtuais}
              db={db}
              userRole={userRole}
              onUpdateDb={handleUpdateDatabase}
              onSelectEj={(id: string) => setSelectedEjId(id)}
            />
          )}
        </main>

        {/* Modals */}
        {showFormModal && (
          <RelatorioFormModal
            dados={dadosAtuais}
            db={db}
            onUpdateDb={handleUpdateDatabase}
            onClose={() => setShowFormModal(false)}
          />
        )}

        {showOrientadorModal && (
          <OrientadorPainelModal
            dados={dadosAtuais}
            db={db}
            onUpdateDb={handleUpdateDatabase}
            onClose={() => setShowOrientadorModal(false)}
          />
        )}

        {showPrintModal && (
          <RelatorioInstitucionalPrintModal
            dados={dadosAtuais}
            onClose={() => setShowPrintModal(false)}
          />
        )}

        {showProfModal && (
          <CadastroProfessorModal
            dados={dadosAtuais}
            db={db}
            onUpdateDb={handleUpdateDatabase}
            onClose={() => setShowProfModal(false)}
          />
        )}

        {showEJModal && (
          <CadastroEJModal
            dados={dadosAtuais}
            db={db}
            onUpdateDb={handleUpdateDatabase}
            onClose={() => setShowEJModal(false)}
          />
        )}
      </div>
    </div>
  );
}
