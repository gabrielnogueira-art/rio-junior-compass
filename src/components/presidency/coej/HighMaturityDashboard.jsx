// src/components/HighMaturityDashboard.jsx
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Users, 
  Award, 
  Activity, 
  Briefcase, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  GraduationCap, 
  Save, 
  Check,
  Scale,
  Edit2,
  Trash2,
  Plus,
  Star,
  HeartHandshake,
  MessageSquare
} from 'lucide-react';
import MetricCard from './MetricCard';
import TicketMedioAnalytics from './TicketMedioAnalytics';
import SeloEJAuditCard from './SeloEJAuditCard';
import FinancialExecutionCard from './FinancialExecutionCard';

export default function HighMaturityDashboard({
  data,
  userRole = 'orientador',
  onSaveReport,
  onUpdateMercado,
  onUpdateJuridico,
  onUpdateInterno,
  onUpdateFinanceiro
}) {
  const { ej, relatorio, mercado, execucaoFinanceira, extensao, juridico, interno, mesesDecorridos, eficienciaPorMembroMes } = data;

  const isMembro = userRole === 'membro_ej';

  // Desafios com CRUD
  const [desafios, setDesafios] = useState(relatorio.desafios || []);
  const [novoDesafio, setNovoDesafio] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Gargalos e Conclusão da EJ
  const [gargalos, setGargalos] = useState(relatorio.gargalos || '');
  const [conclusaoEJ, setConclusaoEJ] = useState(relatorio.conclusao_ej || '');

  // Dados Financeiros Confidenciais (Preenchidos pela EJ)
  const [caixaAtual, setCaixaAtual] = useState(mercado.caixa_atual || 0);
  const [despesasTrimestre, setDespesasTrimestre] = useState(mercado.despesas || 0);

  // Qualidade e PCO
  const [csatClientes, setCsatClientes] = useState(interno.csat_clientes || 9.6);
  const [npsClientes, setNpsClientes] = useState(interno.nps_clientes || 88);
  const [pcoMembros, setPcoMembros] = useState(interno.pco_clima_membros || 92.0);
  const [tempoPermanencia, setTempoPermanencia] = useState(interno.tempo_medio_permanencia_meses || 18.5);

  // Parecer e Homologação do Orientador
  const [parecerOrientador, setParecerOrientador] = useState(relatorio.parecer_orientador || '');
  const [statusAprovacao, setStatusAprovacao] = useState(relatorio.status_aprovacao_orientador || 'Homologado pelo Orientador');

  const [salvoFeedback, setSalvoFeedback] = useState(false);

  // Cálculos de Alcance de Meta
  const faturamentoReal = mercado.faturamento_realizado || mercado.receita_total || 0;
  const faturamentoPrev = mercado.faturamento_previsto || 1;
  const percentualAlcance = mercado.percentual_meta_alcancada || Number(((faturamentoReal / faturamentoPrev) * 100).toFixed(1));
  const crescimentoTrimestre = mercado.crescimento_trimestre_pct || 28.4;

  // CRUD Desafios
  const handleAddDesafio = () => {
    if (novoDesafio.trim()) {
      setDesafios([...desafios, novoDesafio.trim()]);
      setNovoDesafio('');
    }
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditingText(desafios[index]);
  };

  const handleSaveEdit = (index) => {
    if (editingText.trim()) {
      const updated = [...desafios];
      updated[index] = editingText.trim();
      setDesafios(updated);
      setEditingIndex(null);
      setEditingText('');
    }
  };

  const handleDeleteDesafio = (index) => {
    setDesafios(desafios.filter((_, idx) => idx !== index));
  };

  const handleSalvarTudo = () => {
    onSaveReport({
      ...relatorio,
      desafios,
      gargalos,
      conclusao_ej: conclusaoEJ,
      parecer_orientador: parecerOrientador,
      status_aprovacao_orientador: statusAprovacao,
      data_homologacao: new Date().toISOString().split('T')[0]
    });

    if (onUpdateMercado) {
      onUpdateMercado({
        ...mercado,
        caixa_atual: Number(caixaAtual),
        despesas: Number(despesasTrimestre)
      });
    }

    if (onUpdateInterno) {
      onUpdateInterno({
        ...interno,
        csat_clientes: Number(csatClientes),
        nps_clientes: Number(npsClientes),
        pco_clima_membros: Number(pcoMembros),
        tempo_medio_permanencia_meses: Number(tempoPermanencia)
      });
    }

    setSalvoFeedback(true);
    setTimeout(() => setSalvoFeedback(false), 3000);
  };

  return (
    <div className="high-maturity-dashboard">
      {/* Banner de Eficiência Produtiva por Membro / Mês */}
      <div className="efficiency-banner" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 28, 53, 0.7) 100%)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Sparkles size={18} color="var(--accent-emerald-400)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
              Eficiência Produtiva por Membro / Mês
            </span>
            <span className="badge-status regular" style={{ fontSize: '0.7rem' }}>
              Cluster {ej.cluster.replace('Cluster ', '')} (Alta Maturidade & Escala)
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Métrica de produtividade econômica de valor por integrante ativo da EJ:
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="efficiency-formula-tag" style={{ color: 'var(--accent-emerald-400)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            Receita Total (R$ {faturamentoReal.toLocaleString('pt-BR')}) ÷ ({mesesDecorridos} meses × {ej.membros_ativos} membros)
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald-400)' }}>
              R$ {eficienciaPorMembroMes.toFixed(2)}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}> /mês</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de 4 Métricas Principais */}
      <div className="metrics-grid-4">
        <MetricCard
          label="Crescimento no Trimestre"
          value={`+${crescimentoTrimestre}%`}
          subtext={`Variação vs trimestre anterior (${mercado.projetos_vendidos} contratos fechados)`}
          icon={ArrowUpRight}
          badgeText="Escala Contínua"
          badgeType="positive"
          theme="emerald"
        />

        <MetricCard
          label="Receita & Meta Trimestral"
          value={`R$ ${faturamentoReal.toLocaleString('pt-BR')}`}
          subtext={`Previsto: R$ ${faturamentoPrev.toLocaleString('pt-BR')} (${percentualAlcance}% da Meta)`}
          icon={DollarSign}
          badgeText={`${percentualAlcance}% Alcançado`}
          badgeType="positive"
          theme="blue"
        />

        <MetricCard
          label="Caixa & Liquidez"
          value={`R$ ${Number(caixaAtual).toLocaleString('pt-BR')}`}
          subtext={`Despesas Q3: R$ ${Number(despesasTrimestre).toLocaleString('pt-BR')}`}
          icon={Target}
          badgeText="Alta Solvência"
          badgeType="positive"
          theme="gold"
        />

        <MetricCard
          label="Qualidade & Clima (NPS / PCO)"
          value={`NPS +${npsClientes}`}
          subtext={`PCO Membros: ${pcoMembros}% | CSAT: ${csatClientes}/10`}
          icon={Activity}
          badgeText="Zona de Excelência"
          badgeType="positive"
          theme="cyan"
        />
      </div>

      {/* NOVO: ANÁLISE DE TICKET MÉDIO EM 3 NÍVEIS */}
      <TicketMedioAnalytics 
        mercado={mercado} 
        isEditMode={isMembro}
        onUpdateMercado={onUpdateMercado}
      />

      {/* NOVO: AUDITORIA JURÍDICA & SELO EJ BRASIL JÚNIOR (13 DOCUMENTOS) */}
      <SeloEJAuditCard 
        juridico={juridico} 
        isMembroRole={isMembro}
        onUpdateDocumentos={onUpdateJuridico}
      />

      {/* NOVO: EXECUÇÃO FINANCEIRA DETALHADA & MAPEAMENTO DE FOMENTO DA IES */}
      <FinancialExecutionCard
        execucaoFinanceira={execucaoFinanceira}
        isMembroRole={isMembro}
        onUpdateFinanceiro={onUpdateFinanceiro}
      />

      {/* Seção 1: Resumo Estratégico & Pipeline de Projetos */}
      <div className="dashboard-section-grid">
        {/* Destaques Estratégicos */}
        <div className="col-span-6 glass-card" style={{ padding: '1.5rem' }}>
          <div className="card-section-title">
            <TrendingUp size={20} color="var(--accent-emerald-400)" />
            <span>Resumo de Performance Estratégica</span>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Execução da Meta Orçamentária</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-emerald-400)' }}>{percentualAlcance}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill emerald" 
                style={{ width: `${Math.min(100, percentualAlcance)}%` }} 
              />
            </div>
          </div>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Destaques Estratégicos Chancelados:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {(relatorio.destaques_estrategicos || [
              'Crescimento de receita acima de 25% com diversificação de carteira',
              'Renovação total da chancela de Extensão Universitária junto à IES',
              'Contratos B2B de grande impacto com empresas do polo fluminense'
            ]).map((destaque, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.85rem',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}>
                <CheckCircle size={16} color="var(--accent-emerald-400)" />
                <span>{destaque}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline de Projetos */}
        <div className="col-span-6 glass-card" style={{ padding: '1.5rem' }}>
          <div className="card-section-title">
            <Briefcase size={20} color="var(--primary-400)" />
            <span>Execução & Pipeline de Contratos</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Concluídos</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald-400)', marginTop: '0.2rem' }}>
                {mercado.projetos_concluidos}
              </div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Em Execução</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan-400)', marginTop: '0.2rem' }}>
                {mercado.projetos_em_execucao}
              </div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aprovados P/ Início</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold-400)', marginTop: '0.2rem' }}>
                {mercado.projetos_aprovados}
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Principais Entregas de Impacto Extensionista:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(relatorio.principais_entregas || [
              'Plano Diretor e Modelagem de Processos para Cooperativa Fluminense',
              'Laudo e Retrofit Energético em complexo predial',
              'Modelagem computacional e automação industrial'
            ]).map((entrega, idx) => (
              <div key={idx} style={{
                fontSize: '0.825rem',
                color: 'var(--text-main)',
                padding: '0.5rem 0.75rem',
                background: 'rgba(59, 130, 246, 0.06)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--primary-500)'
              }}>
                {entrega}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seção 2: Qualidade (CSAT/NPS) e Gestão de Pessoas (PCO/Permanência) */}
      <div className="dashboard-section-grid">
        <div className="col-span-6 glass-card" style={{ padding: '1.5rem' }}>
          <div className="card-section-title">
            <Star size={20} color="var(--accent-gold-400)" />
            <span>Qualidade com Clientes (CSAT & NPS)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CSAT dos Clientes</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold-400)', marginTop: '0.2rem' }}>
                {csatClientes} / 10
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald-400)', marginTop: '0.2rem' }}>Satisfação Máxima</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>NPS (Net Promoter Score)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald-400)', marginTop: '0.2rem' }}>
                +{npsClientes}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Zona de Promotores</div>
            </div>
          </div>
        </div>

        <div className="col-span-6 glass-card" style={{ padding: '1.5rem' }}>
          <div className="card-section-title">
            <HeartHandshake size={20} color="var(--accent-cyan-400)" />
            <span>PCO (Clima Organizacional) & Tempo de Permanência</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PCO Interno</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan-400)', marginTop: '0.2rem' }}>
                {pcoMembros}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Meta da EJ: {interno.meta_pco || 85}%</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tempo Médio de Permanência</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {tempoPermanencia} meses
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald-400)', marginTop: '0.2rem' }}>Retenção Saudável &gt; 1 ano</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 3: Desafios e Gargalos da EJ (CRUD Completo) */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="card-section-title" style={{ margin: 0 }}>
              <AlertCircle size={20} color="var(--accent-gold-400)" />
              <span>Desafios Estratégicos & Gargalos da EJ (Gestão Interna)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Mapeamento de desafios relatados pela EJ com opção de inserir, editar e excluir itens.
            </p>
          </div>

          {isMembro && (
            <span className="metric-badge neutral" style={{ fontSize: '0.75rem' }}>
              Modo Membro EJ: Inserção, Edição e Exclusão Habilitadas
            </span>
          )}
        </div>

        {/* Lista de Desafios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
          {desafios.map((desafio, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              {editingIndex === idx ? (
                <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                  <input 
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--primary-500)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.4rem 0.65rem',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button onClick={() => handleSaveEdit(idx)} className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                    Salvar
                  </button>
                  <button onClick={() => setEditingIndex(null)} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', flex: 1 }}>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: 'var(--accent-emerald-400)',
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{desafio}</span>
                  </div>

                  {isMembro && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                      <button 
                        onClick={() => handleStartEdit(idx)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
                        title="Editar desafio"
                      >
                        <Edit2 size={14} color="var(--primary-400)" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDesafio(idx)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
                        title="Excluir desafio"
                      >
                        <Trash2 size={14} color="var(--accent-rose-400)" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Input Adicionar Desafio (Modo Membro) */}
        {isMembro && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input 
              type="text"
              placeholder="Digite um novo desafio estratégico da empresa júnior..."
              value={novoDesafio}
              onChange={(e) => setNovoDesafio(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddDesafio()}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.55rem 0.85rem',
                fontSize: '0.85rem',
                color: '#fff',
                outline: 'none'
              }}
            />
            <button onClick={handleAddDesafio} className="btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
              <Plus size={16} />
              <span>Adicionar Desafio</span>
            </button>
          </div>
        )}

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Gargalos Operacionais Críticos:
          </label>
          {isMembro ? (
            <textarea
              rows={2}
              value={gargalos}
              onChange={(e) => setGargalos(e.target.value)}
              placeholder="Ex: Alocação simultânea de gerentes sênior em múltiplos projetos..."
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem',
                color: '#fff',
                fontSize: '0.85rem',
                marginTop: '0.35rem',
                outline: 'none'
              }}
            />
          ) : (
            <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginTop: '0.35rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
              {gargalos || 'Nenhum gargalo crítico apontado no momento.'}
            </div>
          )}
        </div>
      </div>

      {/* Seção 4: Conclusão da EJ & Homologação Oficial do Orientador */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
        <div className="card-section-title">
          <MessageSquare size={22} color="var(--accent-emerald-400)" />
          <span>Conclusão da Diretoria da EJ & Parecer Homologatório do Orientador</span>
        </div>

        {/* 1. Conclusão da EJ */}
        <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-emerald-400)', textTransform: 'uppercase' }}>
              Autodeclaração / Conclusão da Diretoria da EJ:
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Responsável: {ej.membro_responsavel?.nome || 'Diretor Presidente'}
            </span>
          </div>

          {isMembro ? (
            <textarea
              rows={3}
              value={conclusaoEJ}
              onChange={(e) => setConclusaoEJ(e.target.value)}
              placeholder='Conclui-se, diante dos dados apresentados, que a empresa júnior atingiu os objetivos...'
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          ) : (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{conclusaoEJ || 'Conclui-se, diante dos dados apresentados, que a EJ cumpriu os objetivos do trimestre.'}"
            </p>
          )}
        </div>

        {/* 2. Parecer do Orientador */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
                Homologação e Parecer Conclusivo do Orientador COEJ:
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Validação de fé pública acadêmica para IES e RioJunior
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {!isMembro ? (
                <select 
                  value={statusAprovacao}
                  onChange={(e) => setStatusAprovacao(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.45rem 0.85rem',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Homologado pelo Orientador">✔ Homologado com Distinção (Concordo Plenamente)</option>
                  <option value="Aprovado com Ressalvas">⚠ Aprovado com Ressalvas</option>
                  <option value="Pendente de Ajustes da EJ">✖ Necessita Ajustes da Diretoria</option>
                </select>
              ) : (
                <span className="badge-status regular" style={{ fontSize: '0.8rem' }}>
                  {statusAprovacao}
                </span>
              )}

              <button 
                onClick={handleSalvarTudo}
                className="btn-primary" 
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              >
                {salvoFeedback ? <Check size={16} /> : <Save size={16} />}
                <span>{salvoFeedback ? 'Dados Salvos!' : isMembro ? 'Salvar Dados da EJ' : 'Salvar Homologação'}</span>
              </button>
            </div>
          </div>

          {!isMembro ? (
            <textarea 
              rows={3}
              value={parecerOrientador}
              onChange={(e) => setParecerOrientador(e.target.value)}
              placeholder="Homologo com louvor o relatório trimestral. Atesto a regularidade das informações e cumprimento das diretrizes de extensão..."
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          ) : (
            <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {parecerOrientador ? `"${parecerOrientador}"` : 'Aguardando parecer conclusivo do orientador.'}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <span>Em conformidade com a Lei Federal nº 13.267/2016 e Manual do Professor Orientador COEJ.</span>
            <span>Data de Homologação: {relatorio.data_homologacao || 'Pendente'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
