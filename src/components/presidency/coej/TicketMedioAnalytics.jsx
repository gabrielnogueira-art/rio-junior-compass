// src/components/TicketMedioAnalytics.jsx
import React, { useState } from 'react';
import { 
  Target, 
  Layers, 
  Briefcase, 
  GraduationCap, 
  DollarSign, 
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';

export default function TicketMedioAnalytics({
  mercado,
  isEditMode = false,
  onUpdateMercado
}) {
  const [activeSubTab, setActiveSubTab] = useState('servico'); // 'geral', 'curso', 'servico'

  const ticketGeral = mercado.ticket_medio || 0;
  const porCurso = mercado.ticket_medio_por_curso || [];
  const porServico = mercado.ticket_medio_por_servico || [];

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="card-section-title" style={{ margin: 0 }}>
            <Target size={20} color="var(--accent-gold-400)" />
            <span>Análise de Ticket Médio em 3 Níveis</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Acompanhamento on-page de precificação: visão geral da EJ, segmentação por curso e complexidade por projeto.
          </p>
        </div>

        {/* Seletor de Nível */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveSubTab('geral')}
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.785rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              background: activeSubTab === 'geral' ? 'var(--primary-600)' : 'transparent',
              color: activeSubTab === 'geral' ? '#fff' : 'var(--text-muted)'
            }}
          >
            1. Geral da EJ
          </button>
          <button
            onClick={() => setActiveSubTab('curso')}
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.785rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              background: activeSubTab === 'curso' ? 'var(--primary-600)' : 'transparent',
              color: activeSubTab === 'curso' ? '#fff' : 'var(--text-muted)'
            }}
          >
            2. Por Curso
          </button>
          <button
            onClick={() => setActiveSubTab('servico')}
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.785rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              background: activeSubTab === 'servico' ? 'var(--primary-600)' : 'transparent',
              color: activeSubTab === 'servico' ? '#fff' : 'var(--text-muted)'
            }}
          >
            3. Por Projeto / Serviço
          </button>
        </div>
      </div>

      {/* 1. VISÃO GERAL DA EJ */}
      {activeSubTab === 'geral' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ticket Médio Geral (EJ)</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-gold-400)', marginTop: '0.25rem' }}>
              R$ {Number(ticketGeral).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              Base: {mercado.projetos_vendidos || 0} contratos fechados no exercício
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Faturamento por Projeto Médio</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald-400)', marginTop: '0.25rem' }}>
              R$ {((mercado.faturamento_realizado || mercado.receita_total) / (mercado.projetos_vendidos || 1)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              Receita Realizada Total ÷ Projetos Fechados
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Complexidade Operacional</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-cyan-400)', marginTop: '0.45rem' }}>
              {ticketGeral >= 10000 ? 'Projetos de Alto Valor (B2B Corporativo)' : 'Projetos de Entrada & Tração (PME)'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              Alinhado ao porte e maturidade do cluster
            </div>
          </div>
        </div>
      )}

      {/* 2. VISÃO POR CURSO */}
      {activeSubTab === 'curso' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {porCurso.map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.15rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <GraduationCap size={16} color="var(--primary-400)" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{item.curso}</span>
                  </div>
                  <span className="metric-badge neutral" style={{ fontSize: '0.7rem' }}>
                    {item.total_projetos} contratos
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-gold-400)' }}>
                    R$ {Number(item.ticket_medio).toLocaleString('pt-BR')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ticket médio do curso</span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.45rem', marginTop: '0.45rem' }}>
                  Volume faturado pelo curso: <strong>R$ {Number(item.faturamento_total).toLocaleString('pt-BR')}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. VISÃO POR PROJETO / SERVIÇO ESPECÍFICO */}
      {activeSubTab === 'servico' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.75rem' }}>Serviço / Escopo Técnico</th>
                <th style={{ padding: '0.75rem' }}>Curso Vinculado</th>
                <th style={{ padding: '0.75rem' }}>Complexidade / Porte</th>
                <th style={{ padding: '0.75rem' }}>Qtd. Fechada</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Ticket Médio do Serviço</th>
              </tr>
            </thead>
            <tbody>
              {porServico.map((srv, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>
                    {srv.servico}
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                    {srv.curso}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: srv.complexidade.includes('Alta') ? 'rgba(244, 63, 94, 0.18)' : 'rgba(59, 130, 246, 0.18)',
                      color: srv.complexidade.includes('Alta') ? 'var(--accent-rose-400)' : 'var(--primary-400)'
                    }}>
                      {srv.complexidade}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-main)', fontWeight: 600 }}>
                    {srv.qtd_projetos}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 800, color: 'var(--accent-gold-400)' }}>
                    R$ {Number(srv.ticket_medio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
