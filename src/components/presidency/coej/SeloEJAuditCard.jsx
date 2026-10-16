// src/components/SeloEJAuditCard.jsx
import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { SELO_EJ_DOCUMENTOS } from './database';

export default function SeloEJAuditCard({
  juridico,
  isMembroRole = false,
  onUpdateDocumentos
}) {
  const [expanded, setExpanded] = useState(false);
  const [documentosList, setDocumentosList] = useState(juridico.documentos_selo_ej || []);

  const totalDocs = SELO_EJ_DOCUMENTOS.length;
  const docsRegulares = documentosList.filter(d => d.status === 'Regular').length;
  const docsEmRenovacao = documentosList.filter(d => d.status === 'Em Renovação').length;
  const docsPendentes = documentosList.filter(d => d.status === 'Pendente').length;

  const pctConformidade = Math.round((docsRegulares / totalDocs) * 100);

  const handleToggleDocStatus = (docId) => {
    if (!isMembroRole) return; // apenas em modo membro ou admin para editar

    const updated = documentosList.map(d => {
      if (d.id === docId) {
        const nextStatus = d.status === 'Regular' ? 'Em Renovação' : d.status === 'Em Renovação' ? 'Pendente' : 'Regular';
        return { ...d, status: nextStatus };
      }
      return d;
    });

    setDocumentosList(updated);
    if (onUpdateDocumentos) {
      onUpdateDocumentos(updated);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="card-section-title" style={{ margin: 0 }}>
            <FileCheck2 size={20} color="var(--accent-emerald-400)" />
            <span>Auditoria Jurídica & Selo EJ Brasil Júnior (13 Documentos)</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Acompanhamento rigoroso de conformidade legal, fiscal, contábil e institucional perante a Lei nº 13.267/2016.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: pctConformidade === 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${pctConformidade === 100 ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: pctConformidade === 100 ? 'var(--accent-emerald-400)' : 'var(--accent-gold-400)'
          }}>
            <ShieldCheck size={16} />
            <span>{docsRegulares}/{totalDocs} Documentos Válidos ({pctConformidade}%)</span>
          </div>

          <button 
            onClick={() => setExpanded(!expanded)}
            className="btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
          >
            {expanded ? (
              <><span>Ocultar Lista</span> <ChevronUp size={14} /></>
            ) : (
              <><span>Ver 13 Documentos</span> <ChevronDown size={14} /></>
            )}
          </button>
        </div>
      </div>

      {/* Parâmetros de Regularidade Contábil / Fiscal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.75rem',
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '0.85rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Status Contábil:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
            <span className="badge-status regular" style={{ fontSize: '0.75rem' }}>Livro Diário OK</span>
            <span className="badge-status regular" style={{ fontSize: '0.75rem' }}>CRC Ativo</span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Certidões Negativas (CNDs):</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
            <span className="badge-status regular" style={{ fontSize: '0.75rem' }}>PGFN / Federal</span>
            <span className="badge-status regular" style={{ fontSize: '0.75rem' }}>FGTS Caixa</span>
            <span className="badge-status regular" style={{ fontSize: '0.75rem' }}>CNDT</span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Vínculo Institucional IES:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
            <span className="badge-status regular" style={{ fontSize: '0.75rem' }}>Portaria Vigente</span>
            <span className="badge-status regular" style={{ fontSize: '0.75rem' }}>Orientador COEJ</span>
          </div>
        </div>
      </div>

      {/* Lista dos 13 Documentos Oficiais (Expansível) */}
      {expanded && (
        <div style={{ overflowX: 'auto', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Nº</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Documento Obrigatório Selo EJ</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Categoria</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Status Atual</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Validade / Detalhes</th>
                {isMembroRole && <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Ação (Membro EJ)</th>}
              </tr>
            </thead>
            <tbody>
              {SELO_EJ_DOCUMENTOS.map((docDef, idx) => {
                const docInst = documentosList.find(d => d.id === docDef.id) || { status: 'Regular', validade: 'Vigente', obs: 'Cadastrado' };
                const isRegular = docInst.status === 'Regular';
                const isRenovacao = docInst.status === 'Em Renovação';

                return (
                  <tr key={docDef.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: '#fff' }}>
                      {docDef.nome}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {docDef.categoria}
                      </span>
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <span className={`badge-status ${isRegular ? 'regular' : isRenovacao ? 'andamento' : 'pendente'}`} style={{ fontSize: '0.725rem' }}>
                        {docInst.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)' }}>
                      {docInst.obs} ({docInst.validade})
                    </td>
                    {isMembroRole && (
                      <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleToggleDocStatus(docDef.id)}
                          className="btn-secondary"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}
                        >
                          Alterar Status
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {isMembroRole && (
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan-400)', marginTop: '0.75rem' }}>
              * Modo Membro da EJ ativo: você pode clicar em "Alterar Status" para registrar protocolos de renovação ou pendências documentais.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
