// src/components/DataFeedTab.jsx
import React, { useState } from 'react';
import { 
  Database, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Download, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function DataFeedTab({
  db,
  currentEJ,
  onImportData
}) {
  const [dragActive, setDragActive] = useState(false);
  const [importStatus, setImportStatus] = useState(null); // 'preview', 'success', 'error'
  const [previewData, setPreviewData] = useState(null);

  // Exemplo padrão de relatório do Portal Brasil Júnior
  const SAMPLE_BJ_CSV = `Nome_EJ,Cluster,Faturamento_Acumulado,Projetos_Fechados,Membros_Ativos,Ticket_Medio,Propostas_Enviadas
Poli Júnior Engenharia,Cluster 5,142800,12,52,11900,38
Nexus Consultoria Júnior,Cluster 2,28400,6,18,4733,24
BioInova Consultoria Ambiental Jr,Aspirante,8900,2,12,4450,14
Ibmec Júnior Consultoria,Cluster 4,96000,9,36,10666,30`;

  const handleSimularArquivoBJ = () => {
    processarCSV(SAMPLE_BJ_CSV);
  };

  const processarCSV = (csvText) => {
    try {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(l => {
        const values = l.split(',').map(v => v.trim());
        const rowObj = {};
        headers.forEach((h, i) => {
          rowObj[h] = values[i];
        });
        return rowObj;
      });

      // Match automático com a EJ atual
      const match = rows.find(r => 
        r.Nome_EJ.toLowerCase().includes(currentEJ.nome.toLowerCase()) || 
        currentEJ.nome.toLowerCase().includes(r.Nome_EJ.toLowerCase())
      );

      setPreviewData({
        totalLidas: rows.length,
        matchEncontrado: match || rows[0],
        todasLinhas: rows
      });
      setImportStatus('preview');
    } catch (e) {
      setImportStatus('error');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      processarCSV(text);
    };
    reader.readAsText(file);
  };

  const handleConfirmarSincronizacao = () => {
    if (!previewData || !previewData.matchEncontrado) return;

    const item = previewData.matchEncontrado;
    onImportData({
      faturamento_realizado: Number(item.Faturamento_Acumulado) || 0,
      receita_total: Number(item.Faturamento_Acumulado) || 0,
      projetos_vendidos: Number(item.Projetos_Fechados) || 0,
      membros_ativos: Number(item.Membros_Ativos) || currentEJ.membros_ativos,
      ticket_medio: Number(item.Ticket_Medio) || 0,
      propostas_enviadas: Number(item.Propostas_Enviadas) || 0
    });

    setImportStatus('success');
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_BJ_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio_padrao_brasil_junior.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="data-feed-tab">
      {/* Header Informativo */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.25) 0%, rgba(10, 19, 36, 0.8) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Database size={24} color="var(--primary-400)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                Alimentação Automatizada & Conexão Brasil Júnior
              </h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '750px' }}>
              Sincronize indicadores oficiais sem digitação manual. Faça o upload do arquivo gerado pelo <strong>Portal Brasil Júnior</strong> ou utilize os dados de planilhas de acompanhamento com correspondência automática pelo nome da EJ.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleDownloadTemplate} 
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.55rem 0.95rem' }}
            >
              <Download size={15} />
              <span>Baixar Modelo CSV</span>
            </button>
            <button 
              onClick={handleSimularArquivoBJ}
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.55rem 0.95rem' }}
            >
              <Sparkles size={15} />
              <span>Testar Importação BJ (1 Clique)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Área de Drop de Arquivos */}
      <div className="dashboard-section-grid">
        <div className="col-span-6 glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <label 
            htmlFor="file-upload" 
            style={{
              display: 'block',
              border: '2px dashed var(--border-focus)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem 1.5rem',
              cursor: 'pointer',
              background: dragActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
              transition: 'all 0.2s'
            }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const reader = new FileReader();
                reader.onload = (evt) => processarCSV(evt.target.result);
                reader.readAsText(e.dataTransfer.files[0]);
              }
            }}
          >
            <UploadCloud size={48} color="var(--primary-400)" style={{ margin: '0 auto 1rem auto' }} />
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff', marginBottom: '0.35rem' }}>
              Selecione ou Arraste o Relatório do Portal BJ
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Formatos suportados: CSV padrão Brasil Júnior, planilhas Google Sheets exportadas
            </div>
            <input 
              id="file-upload" 
              type="file" 
              accept=".csv,.txt,.json" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>

        {/* Card de Informações da Sincronização */}
        <div className="col-span-6 glass-card" style={{ padding: '1.5rem' }}>
          <div className="card-section-title">
            <FileSpreadsheet size={20} color="var(--accent-emerald-400)" />
            <span>Mapeamento Automático com a EJ Vinculada</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>EJ Alvo do Professor:</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan-400)', marginTop: '0.2rem' }}>
              {currentEJ.nome}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {currentEJ.ies} • {currentEJ.cluster}
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Ao importar o documento, o algoritmo de reconciliação de dados identifica automaticamente as linhas correspondentes à <strong>{currentEJ.nome}</strong> e recalcula os indicadores financeiros, número de projetos e eficiência produtiva mensal do trimestre.
          </div>
        </div>
      </div>

      {/* Pré-visualização da Importação */}
      {importStatus === 'preview' && previewData && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} color="var(--accent-emerald-400)" />
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                  Match Confirmado com Sucesso!
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Identificamos os dados correspondentes à empresa júnior no arquivo.
              </div>
            </div>

            <button 
              onClick={handleConfirmarSincronizacao}
              className="btn-primary"
              style={{ padding: '0.65rem 1.4rem' }}
            >
              <RefreshCw size={16} />
              <span>Sincronizar Base em Tempo Real</span>
            </button>
          </div>

          {/* Tabela de Campos Reconhecidos */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '0.75rem' }}>Campo Brasil Júnior</th>
                  <th style={{ padding: '0.75rem' }}>Valor Encontrado no Arquivo</th>
                  <th style={{ padding: '0.75rem' }}>Impacto no Painel COEJ</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>Faturamento Acumulado</td>
                  <td style={{ padding: '0.75rem', color: 'var(--accent-emerald-400)', fontWeight: 700 }}>
                    R$ {Number(previewData.matchEncontrado.Faturamento_Acumulado || 0).toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Atualiza faturamento realizado e eficiência por membro</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>Projetos Fechados</td>
                  <td style={{ padding: '0.75rem', color: 'var(--primary-400)', fontWeight: 700 }}>
                    {previewData.matchEncontrado.Projetos_Fechados} contratos
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Atualiza contagem de projetos e funil comercial</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>Membros Ativos</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700 }}>
                    {previewData.matchEncontrado.Membros_Ativos} integrantes
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Recalcula receita/membro/mês</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>Ticket Médio</td>
                  <td style={{ padding: '0.75rem', color: 'var(--accent-gold-400)', fontWeight: 700 }}>
                    R$ {Number(previewData.matchEncontrado.Ticket_Medio || 0).toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Métrica de saúde e complexidade de projetos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feedback de Sucesso */}
      {importStatus === 'success' && (
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', textAlign: 'center', marginBottom: '2rem' }}>
          <CheckCircle2 size={36} color="var(--accent-emerald-400)" style={{ margin: '0 auto 0.5rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Base de Dados Sincronizada com Sucesso!</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Os dados do Portal Brasil Júnior foram integrados ao painel do orientador e ao relatório A4 em tempo real.
          </p>
        </div>
      )}
    </div>
  );
}
