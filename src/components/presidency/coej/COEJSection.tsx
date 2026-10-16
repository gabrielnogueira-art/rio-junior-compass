// src/components/presidency/coej/COEJSection.tsx
import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  BarChart3, 
  Award, 
  Database, 
  Printer, 
  Calendar, 
  RefreshCw, 
  Info, 
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Users2,
  GraduationCap,
  Search,
  CheckCircle2,
  FileText,
  User
} from 'lucide-react';

import { 
  getDatabase, 
  saveDatabase, 
  resetDatabase, 
  getDadosConsolidadosEJ 
} from './database';

import LowMaturityDashboard from './LowMaturityDashboard';
import HighMaturityDashboard from './HighMaturityDashboard';
import IESERecognitionTab from './IESERecognitionTab';
import TransparencyReportA4 from './TransparencyReportA4';
import DataFeedTab from './DataFeedTab';
import ProfessorProfileModal from './ProfessorProfileModal';
import './coej.css';

interface COEJSectionProps {
  selectedYear?: number;
}

export default function COEJSection({ selectedYear = 2026 }: COEJSectionProps) {
  const [db, setDb] = useState(() => getDatabase());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'iese' | 'datafeed' | 'report'>('dashboard');
  const [currentPeriod, setCurrentPeriod] = useState<string>('Trimestral (Q3)');
  const [selectedEJId, setSelectedEJId] = useState<string>('ej_002'); // Padrão: Nexus Consultoria Jr (UFF)
  const [userRole, setUserRole] = useState<'orientador' | 'membro_ej'>('orientador');
  const [searchEJ, setSearchEJ] = useState<string>('');
  
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Lista consolidada de EJs
  const listaEJs = useMemo(() => {
    return db.Empresas_Juniores || [];
  }, [db]);

  // EJ selecionada
  const currentEJ = useMemo(() => {
    return listaEJs.find((e: any) => e.id_ej === selectedEJId) || listaEJs[0] || {
      id_ej: 'ej_002',
      nome: 'Nexus Consultoria Júnior',
      cluster: 'Cluster 2',
      tipo_maturidade: 'Baixa',
      ies: 'Universidade Federal Fluminense (UFF)',
      regiao: 'Centro Norte',
      membros_ativos: 18
    };
  }, [listaEJs, selectedEJId]);

  // Dados consolidados da EJ selecionada
  const dadosConsolidados = useMemo(() => {
    return getDadosConsolidadosEJ(db, currentEJ.id_ej, currentPeriod);
  }, [db, currentEJ.id_ej, currentPeriod]);

  // Professor Orientador associado à EJ
  const currentProfessor = useMemo(() => {
    return dadosConsolidados.professor || (db.Usuarios_COEJ && db.Usuarios_COEJ[0]) || {
      id_auth: 'usr_001',
      nome: 'Prof. Dr. Geraldo Ferreira',
      ies: currentEJ.ies || 'Universidade Federal Fluminense (UFF)',
      titulacao: 'Doutor em Engenharia de Produção',
      departamento: 'Departamento de Engenharia'
    };
  }, [dadosConsolidados, db, currentEJ]);

  // Salvar Parecer / Atualização do Relatório
  const handleSaveReport = (updatedRelatorio: any) => {
    const updatedRelatorios = (db.Relatorios_Trimestrais || []).map((r: any) => 
      r.id_relatorio === updatedRelatorio.id_relatorio ? updatedRelatorio : r
    );
    if (!updatedRelatorios.some((r: any) => r.id_relatorio === updatedRelatorio.id_relatorio)) {
      updatedRelatorios.push(updatedRelatorio);
    }
    const newDb = { ...db, Relatorios_Trimestrais: updatedRelatorios };
    setDb(newDb);
    saveDatabase(newDb);
  };

  // Atualizar Indicadores de Mercado (Caixa, Despesas, Ticket Médio)
  const handleUpdateMercado = (updatedMercadoItem: any) => {
    const updatedMercado = (db.Indicadores_Mercado || []).map((m: any) => 
      m.id_relatorio === updatedMercadoItem.id_relatorio ? updatedMercadoItem : m
    );
    if (!updatedMercado.some((m: any) => m.id_relatorio === updatedMercadoItem.id_relatorio)) {
      updatedMercado.push(updatedMercadoItem);
    }
    const newDb = { ...db, Indicadores_Mercado: updatedMercado };
    setDb(newDb);
    saveDatabase(newDb);
  };

  // Atualizar Auditoria Jurídica / Selo EJ
  const handleUpdateJuridico = (updatedDocumentos: any) => {
    const updatedJuridico = (db.Auditoria_Juridica || []).map((j: any) => {
      if (j.id_ej === currentEJ.id_ej) {
        const regulares = updatedDocumentos.filter((d: any) => d.status === 'Regular').length;
        return {
          ...j,
          documentos_selo_ej: updatedDocumentos,
          selo_ej_conformidade: `${regulares}/13 Documentos Validados`
        };
      }
      return j;
    });
    const newDb = { ...db, Auditoria_Juridica: updatedJuridico };
    setDb(newDb);
    saveDatabase(newDb);
  };

  // Atualizar Indicadores Internos (CSAT, NPS, PCO, Permanência)
  const handleUpdateInterno = (updatedInternoItem: any) => {
    const updatedInterno = (db.Indicadores_Internos || []).map((i: any) => 
      i.id_ej === currentEJ.id_ej ? updatedInternoItem : i
    );
    if (!updatedInterno.some((i: any) => i.id_ej === currentEJ.id_ej)) {
      updatedInterno.push(updatedInternoItem);
    }
    const newDb = { ...db, Indicadores_Internos: updatedInterno };
    setDb(newDb);
    saveDatabase(newDb);
  };

  // Atualizar Execução Financeira (Entradas, Saídas, Fomento IES)
  const handleUpdateFinanceiro = (updatedFinanceiro: any) => {
    const exists = db.Execucao_Financeira && db.Execucao_Financeira.find((ef: any) => ef.id_ej === currentEJ.id_ej);
    let updatedList;
    if (exists) {
      updatedList = db.Execucao_Financeira.map((ef: any) => ef.id_ej === currentEJ.id_ej ? updatedFinanceiro : ef);
    } else {
      updatedList = [...(db.Execucao_Financeira || []), updatedFinanceiro];
    }
    const newDb = { ...db, Execucao_Financeira: updatedList };
    setDb(newDb);
    saveDatabase(newDb);
  };

  // Salvar IESE
  const handleSaveIESE = (updatedIESE: any) => {
    const exists = db.IESE_Avaliacoes && db.IESE_Avaliacoes.find((i: any) => i.id_ej === updatedIESE.id_ej);
    let updatedIESEList;
    if (exists) {
      updatedIESEList = db.IESE_Avaliacoes.map((i: any) => i.id_ej === updatedIESE.id_ej ? updatedIESE : i);
    } else {
      updatedIESEList = [...(db.IESE_Avaliacoes || []), updatedIESE];
    }
    const newDb = { ...db, IESE_Avaliacoes: updatedIESEList };
    setDb(newDb);
    saveDatabase(newDb);
  };

  // Importar Dados do Portal Brasil Júnior
  const handleImportBJData = (importedFields: any) => {
    const relatorioId = dadosConsolidados.relatorio.id_relatorio;
    const updatedMercado = (db.Indicadores_Mercado || []).map((m: any) => {
      if (m.id_relatorio === relatorioId) {
        return {
          ...m,
          ...importedFields
        };
      }
      return m;
    });

    const updatedEJs = (db.Empresas_Juniores || []).map((e: any) => {
      if (e.id_ej === currentEJ.id_ej && importedFields.membros_ativos) {
        return {
          ...e,
          membros_ativos: importedFields.membros_ativos
        };
      }
      return e;
    });

    const newDb = {
      ...db,
      Indicadores_Mercado: updatedMercado,
      Empresas_Juniores: updatedEJs
    };

    setDb(newDb);
    saveDatabase(newDb);
  };

  // Salvar Perfil do Professor
  const handleSaveProfile = (updatedProfile: any) => {
    const updatedList = (db.Usuarios_COEJ || []).map((u: any) => 
      u.id_auth === updatedProfile.id_auth ? updatedProfile : u
    );
    const newDb = { ...db, Usuarios_COEJ: updatedList };
    setDb(newDb);
    saveDatabase(newDb);
  };

  // Resetar Demo
  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados originais da demonstração do COEJ?')) {
      const reset = resetDatabase();
      setDb(reset);
    }
  };

  // Filtragem da lista de EJs
  const ejsFiltradas = useMemo(() => {
    if (!searchEJ.trim()) return listaEJs;
    const s = searchEJ.toLowerCase();
    return listaEJs.filter((ej: any) => 
      (ej.nome || '').toLowerCase().includes(s) ||
      (ej.ies || '').toLowerCase().includes(s) ||
      (ej.cidade || '').toLowerCase().includes(s) ||
      (ej.cluster || '').toLowerCase().includes(s)
    );
  }, [listaEJs, searchEJ]);

  return (
    <div className="coej-wrapper space-y-6">
      {/* Cabeçalho Institucional do COEJ */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900/80 to-blue-900/60 border border-blue-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <GraduationCap className="w-3.5 h-3.5" />
                COEJ • Conselho de Orientadores
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Presidência Executiva
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">• Lei Federal nº 13.267/2016</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Painel Integrado do Professor Orientador COEJ
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Ambiente de governança acadêmica e prestação de contas trimestral para acompanhamento de dados das 
              Empresas Juniores federadas da RioJunior. Permite a validação de horas de extensão curricularizada, 
              auditoria do <strong>Selo EJ (13 documentos)</strong>, análise de ticket médio e diagnóstico de demandas 
              de fomento institucional perante as IES.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowProfileModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition shadow-sm"
              title="Visualizar dados do Orientador vinculado à EJ"
            >
              <User className="w-4 h-4 text-blue-400" />
              <span>Perfil do Orientador</span>
            </button>

            <button
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition shadow-md shadow-amber-500/20"
              title="Gerar e imprimir relatório A4 formal com fé pública"
            >
              <Printer className="w-4 h-4" />
              <span>Relatório A4 (PDF)</span>
            </button>

            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 transition"
              title="Restaurar dados padrões de demonstração do COEJ"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Banner de Alternância de Perfil (Orientador vs Membro EJ) */}
      <div className="no-print">
        {userRole === 'membro_ej' ? (
          <div className="bg-gradient-to-r from-amber-500/20 via-slate-900/90 to-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/40">
                <Users2 className="text-amber-400 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  MODO ATIVO: PREENCHIMENTO PELA DIRETORIA DA EMPRESA JÚNIOR ({currentEJ.nome})
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Insira dados confidenciais de <strong>Caixa</strong> e <strong>Despesas</strong>, gerencie a lista de <strong>Desafios/Gargalos</strong>, e redija a <strong>Conclusão da EJ</strong> para homologação do Orientador.
                </div>
              </div>
            </div>
            <button 
              onClick={() => setUserRole('orientador')}
              className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition shadow"
            >
              Alternar para Visão do Orientador
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-900/30 via-slate-900/90 to-blue-950/40 border border-blue-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/40">
                <UserCheck className="text-blue-400 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  MODO ATIVO: PROFESSOR ORIENTADOR COEJ ({currentProfessor.nome})
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Orientador com fé pública perante a IES ({currentProfessor.ies || currentEJ.ies}) para homologar a prestação de contas, validar as horas de extensão curricular e emitir o parecer acadêmico conclusivo.
                </div>
              </div>
            </div>
            <button 
              onClick={() => setUserRole('membro_ej')}
              className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              Simular Edição pela EJ
            </button>
          </div>
        )}
      </div>

      {/* Barra de Filtros e Seleção de EJ */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
        {/* Seletor Rápido de EJs Demonstrativas e Dropdown Geral */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Federação RioJunior</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400 font-semibold">{currentEJ.nome}</span>
              <span>•</span>
              <span className="text-cyan-400">{currentEJ.ies}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {currentEJ.cluster} ({dadosConsolidados.isAltaMaturidade ? 'Alta Maturidade' : 'Menor Maturidade'})
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Orientador: <strong className="text-white">{currentProfessor.nome}</strong> • Titulação: {currentProfessor.titulacao || 'Docente Orientador'}
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400">Atalhos COEJ:</span>
            <button 
              onClick={() => setSelectedEJId('ej_002')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                selectedEJId === 'ej_002' 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
              }`}
            >
              Nexus Jr (Cluster 2 - UFF)
            </button>
            <button 
              onClick={() => setSelectedEJId('ej_001')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                selectedEJId === 'ej_001' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm' 
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
              }`}
            >
              Poli Jr (Cluster 5 - UFRJ)
            </button>
            <button 
              onClick={() => setSelectedEJId('ej_003')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                selectedEJId === 'ej_003' 
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm' 
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
              }`}
            >
              BioInova (Aspirante - UERJ)
            </button>
            <button 
              onClick={() => setSelectedEJId('ej_004')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                selectedEJId === 'ej_004' 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm' 
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
              }`}
            >
              Ibmec Jr (Cluster 4 - Ibmec)
            </button>
          </div>
        </div>

        {/* Dropdown de Todas as 75 EJs da RioJunior com busca */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-800/80">
          <div className="md:col-span-8 flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-1.5">
            <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-400 shrink-0">Selecionar Empresa Júnior ({listaEJs.length} EJs):</span>
            <select
              value={selectedEJId}
              onChange={(e) => setSelectedEJId(e.target.value)}
              className="w-full bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
            >
              {ejsFiltradas.map((ej: any) => (
                <option key={ej.id_ej} value={ej.id_ej} className="bg-slate-900 text-white">
                  {ej.nome} — {ej.ies} ({ej.cluster || 'Cluster 1'})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-1.5">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input 
              type="text"
              placeholder="Filtrar por nome, IES ou cluster..."
              value={searchEJ}
              onChange={(e) => setSearchEJ(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            {searchEJ && (
              <button 
                onClick={() => setSearchEJ('')}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Barra de Periodicidade */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Periodicidade:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                'Mensal', 
                'Bimestral', 
                'Trimestral (Q1)', 
                'Trimestral (Q2)', 
                'Trimestral (Q3)', 
                'Trimestral (Q4)', 
                'Semestral', 
                'Anual'
              ].map((period) => (
                <button
                  key={period}
                  onClick={() => setCurrentPeriod(period)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    currentPeriod === period
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 text-right">
            <span>{dadosConsolidados.mesesDecorridos} meses considerados no cálculo de eficiência produtiva</span>
          </div>
        </div>
      </div>

      {/* Abas Internas do COEJ */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard Adaptativo ({dadosConsolidados.isAltaMaturidade ? 'Maior Maturidade' : 'Menor Maturidade'})</span>
        </button>

        <button 
          onClick={() => setActiveTab('iese')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'iese'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Edital Reconhecimento IES (IESE)</span>
        </button>

        <button 
          onClick={() => setActiveTab('datafeed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'datafeed'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Alimentação de Dados & Brasil Júnior</span>
        </button>

        <button 
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'report'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Relatório Transparência A4 (PDF)</span>
        </button>
      </div>

      {/* Conteúdo Dinâmico conforme a Aba Ativa */}
      <div className="pt-2">
        {/* 1. DASHBOARD ADAPTATIVO */}
        {activeTab === 'dashboard' && (
          dadosConsolidados.isAltaMaturidade ? (
            <HighMaturityDashboard 
              data={dadosConsolidados}
              userRole={userRole}
              onSaveReport={handleSaveReport}
              onUpdateMercado={handleUpdateMercado}
              onUpdateJuridico={handleUpdateJuridico}
              onUpdateInterno={handleUpdateInterno}
              onUpdateFinanceiro={handleUpdateFinanceiro}
            />
          ) : (
            <LowMaturityDashboard 
              data={dadosConsolidados} 
              userRole={userRole}
              onSaveReport={handleSaveReport}
              onUpdateMercado={handleUpdateMercado}
              onUpdateJuridico={handleUpdateJuridico}
              onUpdateInterno={handleUpdateInterno}
              onUpdateFinanceiro={handleUpdateFinanceiro}
            />
          )
        )}

        {/* 2. EDITAL DE RECONHECIMENTO IES (IESE) */}
        {activeTab === 'iese' && (
          <IESERecognitionTab 
            ej={currentEJ}
            ieseAvaliacao={dadosConsolidados.iese}
            onSaveIESE={handleSaveIESE}
          />
        )}

        {/* 3. ALIMENTAÇÃO DE DADOS & PORTAL BJ */}
        {activeTab === 'datafeed' && (
          <DataFeedTab 
            db={db}
            currentEJ={currentEJ}
            onImportData={handleImportBJData}
          />
        )}

        {/* 4. RELATÓRIO DE TRANSPARÊNCIA A4 (PDF) */}
        {activeTab === 'report' && (
          <TransparencyReportA4 
            data={dadosConsolidados}
            currentProfessor={currentProfessor}
            periodo={`${selectedYear} - ${currentPeriod}`}
          />
        )}
      </div>

      {/* Modal do Perfil do Orientador */}
      {showProfileModal && (
        <ProfessorProfileModal 
          professor={currentProfessor}
          linkedEJ={currentEJ}
          onSaveProfile={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Modal Popup para Impressão A4 */}
      {showPrintModal && (
        <TransparencyReportA4 
          data={dadosConsolidados}
          currentProfessor={currentProfessor}
          periodo={`${selectedYear} - ${currentPeriod}`}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
