// src/components/FinancialExecutionCard.jsx
import React, { useState } from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Coins, 
  Plus, 
  Edit2, 
  Trash2, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Building, 
  GraduationCap, 
  FileCheck,
  Save,
  Check,
  AlertCircle
} from 'lucide-react';

export default function FinancialExecutionCard({
  execucaoFinanceira,
  isMembroRole = false,
  onUpdateFinanceiro
}) {
  const [entradas, setEntradas] = useState(execucaoFinanceira?.entradas || []);
  const [saidas, setSaidas] = useState(execucaoFinanceira?.saidas || []);
  const [diagnostico, setDiagnostico] = useState(execucaoFinanceira?.diagnostico_fomento_ies || {
    necessita_apoio_editais: true,
    urgencia: 'Alta',
    solicitacoes: [
      'Edital de auxílio deslocamento e hospedagem para membros no ENEJ',
      'Licenças de softwares técnicos para projetos de extensão',
      'Apoio institucional para taxas cartoriais de registro'
    ],
    valor_estimado_necessario: 6800,
    justificativa_ej: 'A EJ tem alta capacidade técnica, mas custos de transporte e cartório limitam reinvestimentos.',
    parecer_orientador_fomento: 'Recomendo que a Direção institua edital de fomento ou auxílio transporte para a EJ.'
  });

  const [novaEntrada, setNovaEntrada] = useState({ categoria: '', valor: '', descricao: '' });
  const [novaSaida, setNovaSaida] = useState({ categoria: '', valor: '', descricao: '' });
  const [showAddEntrada, setShowAddEntrada] = useState(false);
  const [showAddSaida, setShowAddSaida] = useState(false);
  const [novaSolicitacao, setNovaSolicitacao] = useState('');

  const [salvo, setSalvo] = useState(false);

  // Cálculos Financeiros
  const totalEntradas = entradas.reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
  const totalSaidas = saidas.reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
  const resultadoOperacional = totalEntradas - totalSaidas;

  // Handlers de Entradas
  const handleAddEntrada = (e) => {
    e.preventDefault();
    if (!novaEntrada.categoria || !novaEntrada.valor) return;
    const item = {
      id: `ent_${Date.now()}`,
      categoria: novaEntrada.categoria,
      descricao: novaEntrada.descricao || 'Entrada registrada pela EJ',
      valor: Number(novaEntrada.valor)
    };
    const updated = [...entradas, item];
    setEntradas(updated);
    setNovaEntrada({ categoria: '', valor: '', descricao: '' });
    setShowAddEntrada(false);
    triggerAutoSave(updated, saidas, diagnostico);
  };

  const handleDeleteEntrada = (id) => {
    const updated = entradas.filter(e => e.id !== id);
    setEntradas(updated);
    triggerAutoSave(updated, saidas, diagnostico);
  };

  // Handlers de Saídas
  const handleAddSaida = (e) => {
    e.preventDefault();
    if (!novaSaida.categoria || !novaSaida.valor) return;
    const item = {
      id: `sai_${Date.now()}`,
      categoria: novaSaida.categoria,
      descricao: novaSaida.descricao || 'Despesa registrada pela EJ',
      valor: Number(novaSaida.valor)
    };
    const updated = [...saidas, item];
    setSaidas(updated);
    setNovaSaida({ categoria: '', valor: '', descricao: '' });
    setShowAddSaida(false);
    triggerAutoSave(entradas, updated, diagnostico);
  };

  const handleDeleteSaida = (id) => {
    const updated = saidas.filter(s => s.id !== id);
    setSaidas(updated);
    triggerAutoSave(entradas, updated, diagnostico);
  };

  // Handlers de Solicitações para a IES
  const handleAddSolicitacao = () => {
    if (novaSolicitacao.trim()) {
      const updatedDiag = {
        ...diagnostico,
        solicitacoes: [...(diagnostico.solicitacoes || []), novaSolicitacao.trim()]
      };
      setDiagnostico(updatedDiag);
      setNovaSolicitacao('');
      triggerAutoSave(entradas, saidas, updatedDiag);
    }
  };

  const handleDeleteSolicitacao = (idx) => {
    const updatedList = diagnostico.solicitacoes.filter((_, i) => i !== idx);
    const updatedDiag = { ...diagnostico, solicitacoes: updatedList };
    setDiagnostico(updatedDiag);
    triggerAutoSave(entradas, saidas, updatedDiag);
  };

  const triggerAutoSave = (ent, sai, diag) => {
    if (onUpdateFinanceiro) {
      onUpdateFinanceiro({
        ...execucaoFinanceira,
        entradas: ent,
        saidas: sai,
        diagnostico_fomento_ies: diag
      });
    }
  };

  const handleManualSave = () => {
    triggerAutoSave(entradas, saidas, diagnostico);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="card-section-title" style={{ margin: 0 }}>
            <Coins size={22} color="var(--accent-gold-400)" />
            <span>Execução Financeira Detalhada (Entradas & Saídas das Atividades)</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Acompanhamento de custos envolvidos na operação da EJ e <strong>diagnóstico de demandas de fomento institucional perante a IES</strong>.
          </p>
        </div>

        <button 
          onClick={handleManualSave}
          className="btn-primary"
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          {salvo ? <Check size={16} /> : <Save size={16} />}
          <span>{salvo ? 'Execução Salva!' : 'Salvar Execução Financeira'}</span>
        </button>
      </div>

      {/* Cards de Resumo do Fluxo Operacional */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-emerald-400)', fontWeight: 700 }}>
              Total de Entradas (Receitas)
            </span>
            <ArrowUpRight size={18} color="var(--accent-emerald-400)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald-400)', marginTop: '0.25rem' }}>
            R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {entradas.length} fontes de receita registradas
          </div>
        </div>

        <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-rose-400)', fontWeight: 700 }}>
              Total de Saídas (Despesas Operacionais)
            </span>
            <ArrowDownRight size={18} color="var(--accent-rose-400)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-rose-400)', marginTop: '0.25rem' }}>
            R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {saidas.length} centros de custos operacionais
          </div>
        </div>

        <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-400)', fontWeight: 700 }}>
              Resultado Operacional (Q3)
            </span>
            <Coins size={18} color="var(--primary-400)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: resultadoOperacional >= 0 ? 'var(--accent-cyan-400)' : 'var(--accent-rose-400)', marginTop: '0.25rem' }}>
            R$ {resultadoOperacional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {resultadoOperacional >= 0 ? 'Superávit Reinvestível na Associação' : 'Déficit no Exercício'}
          </div>
        </div>
      </div>

      {/* Grid de Entradas vs Saídas Detalhadas */}
      <div className="dashboard-section-grid" style={{ marginBottom: '1.5rem' }}>
        {/* Coluna 1: Entradas (Receitas) */}
        <div className="col-span-6 glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-emerald-400)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowUpRight size={17} />
              <span>Receitas e Entradas do Trimestre</span>
            </span>

            {isMembroRole && (
              <button 
                onClick={() => setShowAddEntrada(!showAddEntrada)}
                className="btn-secondary"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
              >
                + Nova Entrada
              </button>
            )}
          </div>

          {showAddEntrada && (
            <form onSubmit={handleAddEntrada} style={{ background: 'rgba(0,0,0,0.35)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Categoria / Origem (Ex: Patrocínio, Projeto)" 
                  value={novaEntrada.categoria} 
                  onChange={(e) => setNovaEntrada({ ...novaEntrada, categoria: e.target.value })} 
                  required 
                  style={{ background: '#0a1324', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', fontSize: '0.8rem', color: '#fff' }}
                />
                <input 
                  type="number" 
                  placeholder="Valor (R$)" 
                  value={novaEntrada.valor} 
                  onChange={(e) => setNovaEntrada({ ...novaEntrada, valor: e.target.value })} 
                  required 
                  style={{ background: '#0a1324', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', fontSize: '0.8rem', color: '#fff' }}
                />
              </div>
              <input 
                type="text" 
                placeholder="Descrição / Detalhes" 
                value={novaEntrada.descricao} 
                onChange={(e) => setNovaEntrada({ ...novaEntrada, descricao: e.target.value })} 
                style={{ width: '100%', background: '#0a1324', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', fontSize: '0.8rem', color: '#fff', marginBottom: '0.5rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                <button type="button" onClick={() => setShowAddEntrada(false)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}>Confirmar Entrada</button>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {entradas.map((ent, idx) => (
              <div key={ent.id || idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{ent.categoria}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{ent.descricao}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-emerald-400)' }}>
                    R$ {Number(ent.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  {isMembroRole && (
                    <button onClick={() => handleDeleteEntrada(ent.id)} style={{ color: 'var(--accent-rose-400)', opacity: 0.7 }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna 2: Saídas (Despesas Operacionais & Atividades) */}
        <div className="col-span-6 glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-rose-400)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowDownRight size={17} />
              <span>Gastos com Atividades da EJ (Despesas)</span>
            </span>

            {isMembroRole && (
              <button 
                onClick={() => setShowAddSaida(!showAddSaida)}
                className="btn-secondary"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
              >
                + Nova Despesa
              </button>
            )}
          </div>

          {showAddSaida && (
            <form onSubmit={handleAddSaida} style={{ background: 'rgba(0,0,0,0.35)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Centro de Custo (Ex: Evento MEJ, Cartório)" 
                  value={novaSaida.categoria} 
                  onChange={(e) => setNovaSaida({ ...novaSaida, categoria: e.target.value })} 
                  required 
                  style={{ background: '#0a1324', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', fontSize: '0.8rem', color: '#fff' }}
                />
                <input 
                  type="number" 
                  placeholder="Valor (R$)" 
                  value={novaSaida.valor} 
                  onChange={(e) => setNovaSaida({ ...novaSaida, valor: e.target.value })} 
                  required 
                  style={{ background: '#0a1324', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', fontSize: '0.8rem', color: '#fff' }}
                />
              </div>
              <input 
                type="text" 
                placeholder="Finalidade do Gasto" 
                value={novaSaida.descricao} 
                onChange={(e) => setNovaSaida({ ...novaSaida, descricao: e.target.value })} 
                style={{ width: '100%', background: '#0a1324', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', fontSize: '0.8rem', color: '#fff', marginBottom: '0.5rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                <button type="button" onClick={() => setShowAddSaida(false)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}>Confirmar Despesa</button>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {saidas.map((sai, idx) => (
              <div key={sai.id || idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{sai.categoria}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{sai.descricao}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-rose-400)' }}>
                    R$ {Number(sai.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  {isMembroRole && (
                    <button onClick={() => handleDeleteSaida(sai.id)} style={{ color: 'var(--accent-rose-400)', opacity: 0.7 }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEÇÃO ESTRATÉGICA: DIAGNÓSTICO DE CAPTAÇÃO & DEMANDAS DE FOMENTO À IES */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(30, 58, 138, 0.2) 100%)',
        border: '1.5px solid rgba(245, 158, 11, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold-400)' }}>
              <Building size={20} />
              <span style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Insumo para a IES: Mapeamento de Editais e Apoio Institucional Direto
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
              Identificação de entraves financeiros da EJ que podem ser solucionados através de <strong>editais internos de fomento</strong>, auxílio transporte a eventos MEJ ou apoio da Pró-Reitoria de Extensão.
            </p>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '0.5rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Custeio Estimado Necessário</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold-400)' }}>
              R$ {Number(diagnostico.valor_estimado_necessario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Lista de Demandas da EJ para a IES */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Principais Solicitações de Apoio Identificadas pela EJ:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.4rem' }}>
            {(diagnostico.solicitacoes || []).map((sol, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-gold-400)" />
                  <span style={{ color: '#fff' }}>{sol}</span>
                </div>
                {isMembroRole && (
                  <button onClick={() => handleDeleteSolicitacao(idx)} style={{ color: 'var(--accent-rose-400)', opacity: 0.7 }}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isMembroRole && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
              <input 
                type="text" 
                placeholder="Adicionar nova demanda institucional (Ex: Edital de bolsas, computadores, taxas cartoriais)..." 
                value={novaSolicitacao}
                onChange={(e) => setNovaSolicitacao(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSolicitacao()}
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.8rem',
                  color: '#fff',
                  outline: 'none'
                }}
              />
              <button onClick={handleAddSolicitacao} className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}>
                + Adicionar Demanda
              </button>
            </div>
          )}
        </div>

        {/* Parecer do Professor Orientador: Recomendação à Congregação / IES */}
        <div style={{ borderTop: '1px solid rgba(245, 158, 11, 0.25)', paddingTop: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-emerald-400)', textTransform: 'uppercase' }}>
              Parecer do Professor Orientador para Concessão de Apoio / Edital da IES:
            </span>
            <span className="badge-status regular" style={{ fontSize: '0.725rem' }}>
              Chancela COEJ / Orientador
            </span>
          </div>

          {!isMembroRole ? (
            <textarea
              rows={2}
              value={diagnostico.parecer_orientador_fomento}
              onChange={(e) => {
                const updated = { ...diagnostico, parecer_orientador_fomento: e.target.value };
                setDiagnostico(updated);
                triggerAutoSave(entradas, saidas, updated);
              }}
              placeholder="Descreva a recomendação formal para a Diretoria do Centro Universitário ou Pró-Reitoria..."
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.55rem',
                fontSize: '0.825rem',
                color: '#fff',
                outline: 'none'
              }}
            />
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', margin: '0.25rem 0' }}>
              "{diagnostico.parecer_orientador_fomento || 'Aguardando parecer do orientador sobre as demandas de fomento.'}"
            </p>
          )}
          <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Este diagnóstico fornece evidência direta para que o Conselho Universitário / Colegiado paute suporte orçamentário específico à empresa júnior.
          </div>
        </div>
      </div>
    </div>
  );
}
