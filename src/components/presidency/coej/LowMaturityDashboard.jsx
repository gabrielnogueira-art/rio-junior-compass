// src/components/LowMaturityDashboard.jsx
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  FileCheck, 
  Users, 
  GraduationCap, 
  Coins, 
  Building, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  Save,
  Check,
  Edit2,
  Trash2,
  Plus,
  HeartHandshake,
  MessageSquare,
  Star,
  FileText
} from 'lucide-react';
import MetricCard from './MetricCard';
import TicketMedioAnalytics from './TicketMedioAnalytics';
import SeloEJAuditCard from './SeloEJAuditCard';
import FinancialExecutionCard from './FinancialExecutionCard';

export default function LowMaturityDashboard({
  data,
  userRole = 'orientador', // 'orientador' ou 'membro_ej'
  onSaveReport,
  onUpdateMercado,
  onUpdateJuridico,
  onUpdateInterno,
  onUpdateFinanceiro
}) {
  const { ej, relatorio, mercado, execucaoFinanceira, extensao, juridico, interno, mesesDecorridos, eficienciaPorMembroMes } = data;

  const isMembro = userRole === 'membro_ej';

  // Desafios com CRUD completo (Adicionar, Editar, Excluir)
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
  const [csatClientes, setCsatClientes] = useState(interno.csat_clientes || 9.1);
  const [npsClientes, setNpsClientes] = useState(interno.nps_clientes || 76);
  const [pcoMembros, setPcoMembros] = useState(interno.pco_clima_membros || 84.5);
  const [tempoPermanencia, setTempoPermanencia] = useState(interno.tempo_medio_permanencia_meses || 14.2);

  // Parecer e Homologação do Orientador
  const [parecerOrientador, setParecerOrientador] = useState(relatorio.parecer_orientador || '');
  const [statusAprovacao, setStatusAprovacao] = useState(relatorio.status_aprovacao_orientador || 'Homologado pelo Orientador');

  const [salvoFeedback, setSalvoFeedback] = useState(false);

  const taxaConversao = mercado.propostas_enviadas > 0 
    ? ((mercado.projetos_vendidos / mercado.propostas_enviadas) * 100).toFixed(1) 
    : 0;

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

  // Salvar tudo
  const handleSalvarTudo = () => {
    // Atualiza Relatório
    onSaveReport({
      ...relatorio,
      desafios,
      gargalos,
      conclusao_ej: conclusaoEJ,
      parecer_orientador: parecerOrientador,
      status_aprovacao_orientador: statusAprovacao,
      data_homologacao: new Date().toISOString().split('T')[0]
    });

    // Se estiver em modo membro, atualiza também caixa e despesas internas
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
    <div className="low-maturity-dashboard">
      {/* Banner de Eficiência Produtiva por Membro / Mês */}
      <div className="efficiency-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Sparkles size={18} color="var(--accent-gold-400)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
              Eficiência Produtiva por Membro
            </span>
            <span className="badge-status andamento" style={{ fontSize: '0.7rem' }}>
              Cluster {ej.cluster.replace('Cluster ', '')} (Tração Operacional)
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Receita gerada por integrante ativo ao mês na EJ:
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="efficiency-formula-tag">
            Receita Acumulada (R$ {mercado.receita_total.toLocaleString('pt-BR')}) ÷ ({mesesDecorridos} meses × {ej.membros_ativos} membros)
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan-400)' }}>
              R$ {eficienciaPorMembroMes.toFixed(2)}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}> /membro/mês</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de 4 Métricas Principais */}
      <div className="metrics-grid-4">
        <MetricCard
          label="Propostas vs Fechamento"
          value={`${mercado.projetos_vendidos} fechados`}
          subtext={`${mercado.propostas_enviadas} enviadas (${taxaConversao}% de conversão)`}
          icon={Send}
          badgeText={taxaConversao >= 25 ? 'Boa Conversão' : 'Em Ajuste'}
          badgeType={taxaConversao >= 25 ? 'positive' : 'warning'}
          theme="blue"
        />

        <MetricCard
          label="Faturamento Realizado"
          value={`R$ ${(mercado.faturamento_realizado || mercado.receita_total).toLocaleString('pt-BR')}`}
          subtext={`Meta Prevista: R$ ${(mercado.faturamento_previsto || 0).toLocaleString('pt-BR')}`}
          icon={TrendingUp}
          badgeText={`${mercado.percentual_meta_alcancada || 100}% da Meta`}
          badgeType="positive"
          theme="emerald"
        />

        <MetricCard
          label="Caixa Atual da EJ"
          value={`R$ ${Number(caixaAtual).toLocaleString('pt-BR')}`}
          subtext={`Despesas do Trimestre: R$ ${Number(despesasTrimestre).toLocaleString('pt-BR')}`}
          icon={Coins}
          badgeText={caixaAtual > despesasTrimestre ? 'Superávit' : 'Alerta'}
          badgeType={caixaAtual > despesasTrimestre ? 'positive' : 'warning'}
          theme="gold"
        />

        <MetricCard
          label="Impacto Acadêmico na IES"
          value={`${extensao.alunos_graduacao_capacitados || 45} discentes`}
          subtext={`${extensao.horas_extensao_validadas}h de extensão validadas`}
          icon={GraduationCap}
          badgeText={`${extensao.acoes_extensao} ações ativas`}
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

      {/* Seção 2: Qualidade de Execução (CSAT / NPS) vs Clima Organizacional (PCO) */}
      <div className="dashboard-section-grid">
        {/* Card de Qualidade do Cliente (CSAT & NPS) */}
        <div className="col-span-6 glass-card" style={{ padding: '1.5rem' }}>
          <div className="card-section-title">
            <Star size={20} color="var(--accent-gold-400)" />
            <span>Qualidade de Execução com Clientes (CSAT & NPS)</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Acompanhamento para assegurar que a EJ não foca apenas em volume de vendas, mas em excelência na entrega dos serviços.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CSAT (Satisfação do Cliente)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold-400)', marginTop: '0.2rem' }}>
                {csatClientes} <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>/10</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald-400)', marginTop: '0.25rem' }}>
                Índice de Satisfação Médio dos Clientes
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>NPS (Net Promoter Score)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald-400)', marginTop: '0.2rem' }}>
                +{npsClientes}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Zona de Excelência (Recomendação)
              </div>
            </div>
          </div>
        </div>

        {/* Card de Clima Organizacional (PCO) & Permanência */}
        <div className="col-span-6 glass-card" style={{ padding: '1.5rem' }}>
          <div className="card-section-title">
            <HeartHandshake size={20} color="var(--accent-cyan-400)" />
            <span>Clima Organizacional (PCO) & Permanência</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PCO (Pesquisa de Clima)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan-400)', marginTop: '0.2rem' }}>
                {pcoMembros}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Meta da EJ: {interno.meta_pco || 80}%
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tempo Médio de Permanência</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {tempoPermanencia} <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>meses</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald-400)', marginTop: '0.25rem' }}>
                Meta da Rede &gt; 12 meses (Retenção OK)
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
            Taxa de Evasão no Trimestre: <strong>{interno.taxa_evasao}%</strong> • Horas de Treinamento por Membro: <strong>{interno.horas_capacitacao_membro}h</strong>
          </div>
        </div>
      </div>

      {/* Seção 3: Detalhamento de Extensão & Impacto IES */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <div className="card-section-title">
          <GraduationCap size={20} color="var(--primary-400)" />
          <span>Detalhamento do Impacto Extensionista na IES</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capacitados na Graduação</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan-400)', marginTop: '0.15rem' }}>
              {extensao.alunos_graduacao_capacitados || 45} discentes
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Minicursos e workshops abertos na IES
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Horas em Projetos (Membros)</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald-400)', marginTop: '0.15rem' }}>
              {extensao.horas_extensao_membros || 240}h
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Horas de execução direta da equipe
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Horas Capacitação Externa</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold-400)', marginTop: '0.15rem' }}>
              {extensao.horas_capacitacao_externa || 80}h
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Carga horária ministrada na universidade
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Horas Validadas Orientador</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-400)', marginTop: '0.15rem' }}>
              {extensao.horas_extensao_validadas}h
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Total homologado para curricularização
            </div>
          </div>
        </div>
      </div>

      {/* Seção 4: Desafios e Gargalos da EJ (CRUD Completo de Inserir, Editar e Excluir) */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="card-section-title" style={{ margin: 0 }}>
              <AlertTriangle size={20} color="var(--accent-gold-400)" />
              <span>Desafios e Gargalos Identificados (Gestão da EJ)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Espaço destinado à diretoria da empresa júnior para relatar entraves operacionais e necessidades de apoio institucional.
            </p>
          </div>

          {isMembro && (
            <span className="metric-badge neutral" style={{ fontSize: '0.75rem' }}>
              Modo Membro EJ: Inserção, Edição e Exclusão Habilitadas
            </span>
          )}
        </div>

        {/* Lista de Desafios com Edição e Exclusão */}
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
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: 'var(--accent-gold-400)',
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

        {/* Input para Adicionar Novo Desafio (Disponível para a EJ) */}
        {isMembro && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input 
              type="text"
              placeholder="Digite um novo desafio ou necessidade da empresa júnior..."
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

        {/* Gargalos Operacionais */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Gargalos Operacionais Críticos:
          </label>
          {isMembro ? (
            <textarea
              rows={2}
              value={gargalos}
              onChange={(e) => setGargalos(e.target.value)}
              placeholder="Ex: Alocação de horários entre membros e aulas presenciais na IES..."
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

      {/* Seção 5: Conclusão da EJ & Homologação Oficial do Orientador */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(96, 165, 250, 0.35)' }}>
        <div className="card-section-title">
          <MessageSquare size={22} color="var(--primary-400)" />
          <span>Conclusão da Empresa Júnior & Homologação do Orientador</span>
        </div>

        {/* 1. Conclusão da EJ */}
        <div style={{ background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-400)', textTransform: 'uppercase' }}>
              Autodeclaração / Conclusão da Diretoria da EJ:
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Submetido por: {ej.membro_responsavel?.nome || 'Diretoria'}
            </span>
          </div>

          {isMembro ? (
            <textarea
              rows={3}
              value={conclusaoEJ}
              onChange={(e) => setConclusaoEJ(e.target.value)}
              placeholder='Conclui-se, diante dos dados apresentados, que a empresa júnior cumpriu...'
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

        {/* 2. Homologação do Orientador */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
                Parecer & Validação do Professor Orientador COEJ:
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Verificação de autenticidade (impede mascaramento de dados perante a IES e RioJunior)
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
                  <option value="Homologado pelo Orientador">✔ Homologado pelo Orientador (Concordo Plenamente)</option>
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
              placeholder="Atesto a veracidade dos dados apresentados pela diretoria e confirmo a consonância com as diretrizes da IES..."
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
            <span>Art. 4º da Lei Federal nº 13.267/2016 e Resolução de Extensão Universitária.</span>
            <span>Última homologação: {relatorio.data_homologacao || 'Pendente'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
