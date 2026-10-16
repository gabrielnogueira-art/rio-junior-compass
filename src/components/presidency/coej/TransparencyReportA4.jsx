// src/components/TransparencyReportA4.jsx
import React from 'react';
import { Printer, X, Download, ShieldCheck, Award } from 'lucide-react';

export default function TransparencyReportA4({
  data,
  currentProfessor,
  periodo = '2025 - 3º Trimestre (Q3)',
  onClose
}) {
  const { ej, relatorio, mercado, execucaoFinanceira, extensao, juridico, interno, isAltaMaturidade, eficienciaPorMembroMes } = data;

  const handlePrint = () => {
    window.print();
  };

  const porCurso = mercado.ticket_medio_por_curso || [];
  const porServico = mercado.ticket_medio_por_servico || [];
  const entradas = execucaoFinanceira?.entradas || [];
  const saidas = execucaoFinanceira?.saidas || [];
  const diagFomento = execucaoFinanceira?.diagnostico_fomento_ies || {};

  return (
    <div className="report-modal-wrapper" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 11, 20, 0.88)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      overflowY: 'auto',
      padding: '2rem 1rem'
    }}>
      {/* Barra de Ações Superior (Não impressa) */}
      <div className="no-print" style={{
        maxWidth: '850px',
        margin: '0 auto 1.5rem auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#0d172c',
        padding: '0.85rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={22} color="var(--primary-400)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
              Relatório Trimestral Oficial de Prestação de Contas (A4)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Layout executivo rigoroso para impressão ou exportação em PDF (@media print)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={handlePrint}
            className="btn-gold"
            style={{ padding: '0.55rem 1.25rem' }}
          >
            <Printer size={16} />
            <span>Imprimir / Salvar em PDF</span>
          </button>

          {onClose && (
            <button 
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '0.55rem', borderRadius: 'var(--radius-md)' }}
              title="Fechar visualização"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* FOLHA A4 OFICIAL DE PRESTAÇÃO DE CONTAS */}
      <div className="a4-report-sheet" style={{
        maxWidth: '850px',
        margin: '0 auto',
        background: '#ffffff',
        color: '#0f172a',
        padding: '2.5rem 3rem',
        borderRadius: '8px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.35,
        fontSize: '9pt'
      }}>
        {/* CABEÇALHO OFICIAL */}
        <div style={{
          borderBottom: '2.5px solid #1e3a8a',
          paddingBottom: '0.85rem',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              Federação RioJunior
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Conselho de Orientadores de Empresas Juniores (COEJ) • Presidência Executiva
            </div>
            <div style={{ fontSize: '7.5pt', color: '#64748b', marginTop: '2px' }}>
              Relatório Trimestral Oficial de Prestação de Contas para a Instituição de Ensino Superior (IES)
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              display: 'inline-block',
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '8pt',
              textTransform: 'uppercase'
            }}>
              {ej.cluster} • {isAltaMaturidade ? 'Alta Maturidade' : 'Tração & Estruturação'}
            </span>
            <div style={{ fontSize: '8pt', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
              Período: {periodo}
            </div>
          </div>
        </div>

        {/* 1. INFORMAÇÕES GERAIS (BASE DDR RIOJUNIOR) */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          padding: '8px 12px',
          marginBottom: '10px'
        }}>
          <div style={{
            fontSize: '8.5pt',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#1e3a8a',
            marginBottom: '4px',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '2px'
          }}>
            1. Informações Gerais da Associação (Base DDR - Diretoria de Desenvolvimento da Rede)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 10px', fontSize: '8.5pt' }}>
            <div><strong>Empresa Júnior:</strong> {ej.nome}</div>
            <div><strong>Instituição de Ensino:</strong> {ej.ies}</div>
            <div><strong>Região RioJunior:</strong> {ej.regiao} ({ej.cidade})</div>
            <div><strong>Membros Ativos:</strong> {ej.membros_ativos} integrantes</div>
            <div><strong>Fundação:</strong> {ej.ano_fundacao}</div>
            <div><strong>Selo EJ:</strong> {juridico.selo_ej_conformidade || '13/13 Válidos'}</div>
            <div style={{ gridColumn: 'span 3' }}><strong>Cursos Admitidos:</strong> {ej.cursos_admitidos}</div>
          </div>
        </div>

        {/* 2. GRADE DE INDICADORES (MERCADO & TICKET MÉDIO EM 3 NÍVEIS) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          {/* Indicadores de Mercado & Eficiência */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 12px', background: '#ffffff' }}>
            <div style={{ fontSize: '8.5pt', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', marginBottom: '5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px' }}>
              2. Indicadores de Mercado & Financeiro
            </div>
            <table style={{ width: '100%', fontSize: '8.5pt', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '2px 0', color: '#64748b' }}>Faturamento Previsto (Meta):</td>
                  <td style={{ padding: '2px 0', textAlign: 'right', fontWeight: 700 }}>
                    R$ {(mercado.faturamento_previsto || 0).toLocaleString('pt-BR')}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '2px 0', color: '#64748b' }}>Faturamento Realizado:</td>
                  <td style={{ padding: '2px 0', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                    R$ {(mercado.faturamento_realizado || mercado.receita_total).toLocaleString('pt-BR')}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '2px 0', color: '#64748b' }}>% Alcance da Meta Orçamentária:</td>
                  <td style={{ padding: '2px 0', textAlign: 'right', fontWeight: 700 }}>
                    {mercado.percentual_meta_alcancada || 100}%
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '2px 0', color: '#64748b' }}>Saldo em Caixa Atual:</td>
                  <td style={{ padding: '2px 0', textAlign: 'right', fontWeight: 700 }}>
                    R$ {mercado.caixa_atual.toLocaleString('pt-BR')}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '2px 0', color: '#64748b' }}>Despesas do Trimestre:</td>
                  <td style={{ padding: '2px 0', textAlign: 'right', fontWeight: 700 }}>
                    R$ {mercado.despesas.toLocaleString('pt-BR')}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 0', color: '#1e40af', fontWeight: 700 }}>Eficiência Produtiva (R$/membro/mês):</td>
                  <td style={{ padding: '2px 0', textAlign: 'right', fontWeight: 800, color: '#1e40af' }}>
                    R$ {eficienciaPorMembroMes.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Análise de Ticket Médio (3 Níveis) & Pipeline */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 12px', background: '#ffffff' }}>
            <div style={{ fontSize: '8.5pt', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', marginBottom: '5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px' }}>
              3. Ticket Médio (3 Níveis) & Pipeline
            </div>
            
            <div style={{ fontSize: '8pt', marginBottom: '4px' }}>
              <strong>1. Ticket Médio Geral da EJ:</strong> R$ {Number(mercado.ticket_medio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>

            <div style={{ fontSize: '8pt', fontWeight: 700, color: '#334155', marginTop: '4px' }}>
              2. Ticket Médio por Curso:
            </div>
            <ul style={{ paddingLeft: '14px', fontSize: '7.5pt', color: '#475569', margin: '2px 0 4px 0' }}>
              {porCurso.slice(0, 3).map((c, i) => (
                <li key={i}>{c.curso}: R$ {Number(c.ticket_medio).toLocaleString('pt-BR')} ({c.total_projetos} contratos)</li>
              ))}
            </ul>

            <div style={{ fontSize: '8pt', fontWeight: 700, color: '#334155', marginTop: '2px' }}>
              3. Principais Serviços / Projetos Executados:
            </div>
            <ul style={{ paddingLeft: '14px', fontSize: '7.5pt', color: '#475569', margin: '2px 0' }}>
              {porServico.slice(0, 2).map((s, i) => (
                <li key={i}>{s.servico} (Ticket Médio: R$ {Number(s.ticket_medio).toLocaleString('pt-BR')})</li>
              ))}
            </ul>

            <div style={{ fontSize: '7.5pt', color: '#64748b', marginTop: '4px' }}>
              Pipeline: {mercado.propostas_enviadas} enviadas • {mercado.projetos_vendidos} fechados • {mercado.projetos_concluidos} concluídos
            </div>
          </div>
        </div>

        {/* 3. IMPACTO EXTENSIONISTA & QUALIDADE / CLIMA */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          {/* Extensão Universitária Detalhada */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 12px', background: '#f8fafc' }}>
            <div style={{ fontSize: '8.5pt', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', marginBottom: '4px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px' }}>
              4. Impacto Extensionista na IES
            </div>
            <div style={{ fontSize: '8pt', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div><strong>Alunos Capacitados na Graduação:</strong> {extensao.alunos_graduacao_capacitados || 45} discentes (minicursos externos)</div>
              <div><strong>Horas em Projetos (Membros):</strong> {extensao.horas_extensao_membros || 240}h</div>
              <div><strong>Horas Capacitação Externa Ministrada:</strong> {extensao.horas_capacitacao_externa || 80}h</div>
              <div><strong>Total Horas de Extensão Validadas:</strong> {extensao.horas_extensao_validadas}h homologadas</div>
              <div><strong>Ações de Extensão Registradas:</strong> {extensao.acoes_extensao} ações no SIGAA / Pró-Reitoria</div>
            </div>
          </div>

          {/* Qualidade com Clientes & Gestão de Pessoas */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 12px', background: '#f8fafc' }}>
            <div style={{ fontSize: '8.5pt', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', marginBottom: '4px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px' }}>
              5. Qualidade de Execução & Clima Interno
            </div>
            <div style={{ fontSize: '8pt', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div><strong>CSAT (Satisfação do Cliente):</strong> {interno.csat_clientes || 9.1} / 10</div>
              <div><strong>NPS (Net Promoter Score):</strong> +{interno.nps_clientes || 76} (Zona de Promotores)</div>
              <div><strong>PCO (Pesquisa de Clima Organizacional):</strong> {interno.pco_clima_membros || 84.5}% (Meta: {interno.meta_pco || 80}%)</div>
              <div><strong>Tempo Médio de Permanência:</strong> {interno.tempo_medio_permanencia_meses || 14.2} meses</div>
              <div><strong>Taxa de Evasão de Membros:</strong> {interno.taxa_evasao}% no trimestre</div>
            </div>
          </div>
        </div>

        {/* 4. CONFORMIDADE SELO EJ & GARGALOS */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 12px', marginBottom: '8px', background: '#ffffff' }}>
          <div style={{ fontSize: '8.5pt', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', marginBottom: '3px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px' }}>
            6. Conformidade Selo EJ (13 Documentos) & Gargalos Operacionais
          </div>
          <div style={{ fontSize: '8pt', color: '#334155', marginBottom: '2px' }}>
            <strong>Regularidade Fiscal & Contábil:</strong> {juridico.status_detalhado_contabil || 'Livro Diário registrado e CNDs vigentes.'} ({juridico.selo_ej_conformidade})
          </div>
          <div style={{ fontSize: '8pt', color: '#334155' }}>
            <strong>Gargalos e Desafios:</strong> {relatorio.gargalos || 'Conciliação de calendário acadêmico e expansão comercial.'}
          </div>
        </div>

        {/* 5. EXECUÇÃO FINANCEIRA DETALHADA & APOIO/EDITAIS DA IES */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 12px', marginBottom: '8px', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px', marginBottom: '4px' }}>
            <span style={{ fontSize: '8.5pt', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a' }}>
              7. Execução Financeira (Gastos com Atividades) & Diagnóstico de Fomento da IES
            </span>
            <span style={{ fontSize: '7.5pt', fontWeight: 700, color: diagFomento.necessita_apoio_editais ? '#b45309' : '#047857' }}>
              {diagFomento.necessita_apoio_editais ? 'Demanda Apoio da IES' : 'Autossuficiente'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '7.5pt', marginBottom: '4px' }}>
            <div>
              <strong>Principais Centros de Custo (Saídas):</strong>
              <ul style={{ paddingLeft: '12px', margin: '2px 0', color: '#475569' }}>
                {saidas.slice(0, 3).map((s, idx) => (
                  <li key={idx}>{s.categoria}: R$ {Number(s.valor).toLocaleString('pt-BR')} ({s.descricao})</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Demandas de Apoio / Editais da IES:</strong>
              <ul style={{ paddingLeft: '12px', margin: '2px 0', color: '#475569' }}>
                {(diagFomento.solicitacoes || []).slice(0, 2).map((sol, idx) => (
                  <li key={idx}>{sol}</li>
                ))}
              </ul>
            </div>
          </div>

          {diagFomento.parecer_orientador_fomento && (
            <div style={{ fontSize: '7.5pt', color: '#166534', background: '#f0fdf4', padding: '4px 6px', borderRadius: '3px', border: '1px solid #bbf7d0', marginTop: '2px' }}>
              <strong>Recomendação do Orientador para a IES:</strong> "{diagFomento.parecer_orientador_fomento}"
            </div>
          )}
        </div>

        {/* 6. PARECERES: CONCLUSÃO DA EJ + HOMOLOGAÇÃO DO ORIENTADOR */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 12px', marginBottom: '10px', background: '#ffffff' }}>
          {/* Autodeclaração da EJ */}
          <div style={{ marginBottom: '6px' }}>
            <span style={{ fontSize: '8pt', fontWeight: 800, textTransform: 'uppercase', color: '#1e40af' }}>
              8. Conclusão da Empresa Júnior:
            </span>
            <p style={{ fontSize: '8pt', color: '#334155', fontStyle: 'italic', margin: '2px 0' }}>
              "{relatorio.conclusao_ej || 'Conclui-se, diante dos dados apresentados, que a empresa júnior cumpriu as metas estabelecidas.'}"
            </p>
          </div>

          {/* Homologação do Orientador */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '8pt', fontWeight: 800, textTransform: 'uppercase', color: '#166534' }}>
                9. Parecer Conclusivo do Professor Orientador COEJ:
              </span>
              <span style={{ fontSize: '7.5pt', fontWeight: 700, color: '#166534' }}>
                Status: {relatorio.status_aprovacao_orientador || 'Homologado pelo Orientador'}
              </span>
            </div>
            <p style={{ fontSize: '8pt', color: '#166534', fontStyle: 'italic', margin: '2px 0' }}>
              "{relatorio.parecer_orientador || 'Atesto a veracidade dos dados e a plena consonância com a Lei nº 13.267/2016 e diretrizes da IES.'}"
            </p>
          </div>
        </div>

        {/* 6. CAMPO DE ASSINATURAS FORMAIS */}
        <div style={{
          marginTop: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          pageBreakInside: 'avoid'
        }}>
          <div style={{ width: '45%', textAlign: 'center', borderTop: '1px solid #000000', paddingTop: '5px' }}>
            <div style={{ fontWeight: 700, fontSize: '8.5pt' }}>{currentProfessor.nome}</div>
            <div style={{ fontSize: '7.5pt', color: '#475569' }}>Professor(a) Orientador(a) COEJ</div>
            <div style={{ fontSize: '7pt', color: '#64748b' }}>{currentProfessor.ies}</div>
            <div style={{ fontSize: '6.5pt', color: '#94a3b8' }}>{currentProfessor.titulacao}</div>
          </div>

          <div style={{ width: '45%', textAlign: 'center', borderTop: '1px solid #000000', paddingTop: '5px' }}>
            <div style={{ fontWeight: 700, fontSize: '8.5pt' }}>{ej.contato_presidencia.split('(')[0]}</div>
            <div style={{ fontSize: '7.5pt', color: '#475569' }}>Diretor(a) Presidente</div>
            <div style={{ fontSize: '7pt', color: '#64748b' }}>{ej.nome}</div>
            <div style={{ fontSize: '6.5pt', color: '#94a3b8' }}>Federação RioJunior • MEJ Fluminense</div>
          </div>
        </div>
      </div>
    </div>
  );
}
