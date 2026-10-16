// src/components/Navbar.jsx
import React from 'react';
import { 
  Building2, 
  UserCheck, 
  FileText, 
  Award, 
  Database, 
  Printer, 
  Sun, 
  Moon, 
  ShieldCheck,
  ChevronDown,
  User,
  Users2
} from 'lucide-react';

export default function Navbar({
  currentProfessor,
  professorsList,
  onSelectProfessor,
  currentEJ,
  userRole = 'orientador', // 'orientador' ou 'membro_ej'
  onToggleUserRole,
  onOpenProfile,
  onOpenPrint,
  isDarkTheme,
  onToggleTheme
}) {
  const isAltaMaturidade = currentEJ.cluster === 'Cluster 4' || currentEJ.cluster === 'Cluster 5';
  const isMembro = userRole === 'membro_ej';

  return (
    <header className="topbar no-print">
      <div className="brand-section">
        <div className="brand-badge-circle">
          <Building2 size={24} />
        </div>
        <div className="brand-title">
          <div className="brand-name">Portal COEJ | RioJunior</div>
          <div className="brand-subtitle">
            Conselho de Orientadores de Empresas Juniores
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
        {/* NOVO: Alternador de Papel (Professor Orientador vs Membro da EJ) */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => onToggleUserRole('orientador')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              fontSize: '0.785rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              background: !isMembro ? 'var(--primary-600)' : 'transparent',
              color: !isMembro ? '#fff' : 'var(--text-muted)',
              boxShadow: !isMembro ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none'
            }}
            title="Visão de validação e fé pública do orientador"
          >
            <User size={14} />
            <span>Orientador COEJ</span>
          </button>

          <button
            onClick={() => onToggleUserRole('membro_ej')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              fontSize: '0.785rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              background: isMembro ? 'var(--accent-gold-500)' : 'transparent',
              color: isMembro ? '#1a0f00' : 'var(--text-muted)',
              boxShadow: isMembro ? '0 2px 8px rgba(245, 158, 11, 0.4)' : 'none'
            }}
            title="Visão da diretoria da EJ para preenchimento de dados internos"
          >
            <Users2 size={14} />
            <span>Membro da EJ</span>
          </button>
        </div>

        {/* Badge Dinâmico de Cluster & Região da RioJunior */}
        <div className={`cluster-pill ${isAltaMaturidade ? 'alta' : 'baixa'}`}>
          <span style={{
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            backgroundColor: isAltaMaturidade ? '#10b981' : '#f59e0b',
            display: 'inline-block'
          }} />
          <span>{currentEJ.nome}</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ fontSize: '0.75rem' }}>{currentEJ.regiao}</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>{currentEJ.cluster}</span>
        </div>

        {/* Seletor RLS de EJ / Professor (Para testes) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '0.35rem 0.65rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <ShieldCheck size={15} color="var(--accent-cyan-400)" />
          <select 
            value={currentProfessor.id_auth}
            onChange={(e) => {
              const selected = professorsList.find(p => p.id_auth === e.target.value);
              if (selected) onSelectProfessor(selected);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
            title="Alternar entre contas de demonstração vinculadas"
          >
            {professorsList.map((prof) => (
              <option key={prof.id_auth} value={prof.id_auth} style={{ background: '#0a1324', color: '#fff' }}>
                {prof.nome} ({prof.ies.split('(')[1]?.replace(')', '') || prof.ies})
              </option>
            ))}
          </select>
        </div>

        {/* Botão Perfil do Orientador */}
        <button 
          onClick={onOpenProfile}
          className="btn-secondary" 
          title="Ver perfil acadêmico e termo de orientação"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.785rem' }}
        >
          <UserCheck size={15} color="var(--primary-400)" />
          <span>{isMembro ? 'Orientador Vinculado' : 'Meu Perfil'}</span>
        </button>

        {/* Botão Relatório A4 / Imprimir */}
        <button 
          onClick={onOpenPrint}
          className="btn-gold"
          title="Exportar Relatório Trimestral em formato oficial A4"
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.785rem' }}
        >
          <Printer size={15} />
          <span>Relatório A4</span>
        </button>

        {/* Alternador de Tema */}
        <button 
          onClick={onToggleTheme}
          className="btn-secondary" 
          title="Alternar Tema Claro/Escuro"
          style={{ padding: '0.4rem', width: 32, height: 32, justifyContent: 'center' }}
        >
          {isDarkTheme ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#1d4ed8" />}
        </button>
      </div>
    </header>
  );
}
