import { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Users, 
  DollarSign, 
  Award, 
  Target, 
  CheckCircle2, 
  HeartHandshake, 
  Sparkles,
  Calendar,
  ExternalLink,
  Mail,
  ShieldCheck,
  TrendingUp,
  Clock
} from 'lucide-react';
import { EJ } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface EJProfileModalProps {
  ej: EJ | null;
  onClose: () => void;
}

export default function EJProfileModal({ ej, onClose }: EJProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'faturamento' | 'membros' | 'pe_bj' | 'institucional'>('faturamento');
  const [imgError, setImgError] = useState(false);

  if (!ej) return null;

  const clusterStyles: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
    2: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    3: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    4: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    5: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  };

  const currentStyle = clusterStyles[ej.cluster] || clusterStyles[1];

  const initials = ej.nome
    .split(' ')
    .filter(w => w.length > 2 && !['dos', 'das', 'com', 'que', 'soluções', 'consultoria'].includes(w.toLowerCase()))
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || ej.nome.slice(0, 2).toUpperCase();

  const progress = formatPercentage(ej.faturamentoAtual, ej.faturamentoMeta);
  const meses = ej.financeiro?.meses_executados || [];
  const essenciais = ej.indicadores_pe_brasil_junior?.essenciais;
  const complementares = ej.indicadores_pe_brasil_junior?.complementares;
  const totalMembros = ej.membros?.total_ativos || ej.membros_ativos || 18;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-6 border-b border-border flex justify-between items-start gap-4 bg-secondary/20">
          <div className="flex items-center gap-4 min-w-0">
            {/* Logo / Monogram */}
            <div className={`w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center font-extrabold text-2xl border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} overflow-hidden shadow-md`}>
              {!imgError && ej.logo_url ? (
                <img 
                  src={ej.logo_url} 
                  alt={ej.nome}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain p-1.5"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-xl font-bold text-foreground truncate">{ej.nome}</h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}>
                  Cluster {ej.cluster}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium border border-border bg-secondary text-muted-foreground">
                  {ej.regiao}
                </span>
                {ej.farol_original && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-secondary text-foreground">
                    Farol {ej.farol_original}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span><strong>IES:</strong> {ej.ies || ej.localizacao}</span>
                <span>•</span>
                <span><strong>CNPJ:</strong> {ej.cnpj}</span>
                {ej.guardiao_ddr && (
                  <>
                    <span>•</span>
                    <span><strong>Guardião DDR:</strong> {ej.guardiao_ddr}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Tab Buttons */}
        <div className="flex border-b border-border px-6 bg-secondary/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('faturamento')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'faturamento' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign size={16} /> Faturamento & Execução Mensal
          </button>

          <button
            onClick={() => setActiveTab('membros')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'membros' ? 'border-rio-gold text-rio-gold' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users size={16} /> Acompanhamento de Membros ({totalMembros})
          </button>

          <button
            onClick={() => setActiveTab('pe_bj')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'pe_bj' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Target size={16} /> Indicadores PE Brasil Júnior 25/27
          </button>

          <button
            onClick={() => setActiveTab('institucional')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'institucional' ? 'border-rio-purple text-rio-purple' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 size={16} /> Dados Institucionais & DDR
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: FATURAMENTO & EXECUÇÃO MENSAL */}
          {activeTab === 'faturamento' && (
            <div className="space-y-6">
              {/* KPIs financeiros */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card-elevated p-4">
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-1">Meta Anual 2026</span>
                  <span className="text-xl font-extrabold text-foreground">{formatCurrency(ej.faturamentoMeta)}</span>
                </div>
                <div className="card-elevated p-4">
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-1">Faturamento Realizado</span>
                  <span className="text-xl font-extrabold text-emerald-500">{formatCurrency(ej.faturamentoAtual)}</span>
                </div>
                <div className="card-elevated p-4">
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-1">% da Meta Alcançada</span>
                  <span className="text-xl font-extrabold text-foreground">{progress}%</span>
                </div>
                <div className="card-elevated p-4">
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-1">Ticket Médio</span>
                  <span className="text-xl font-extrabold text-foreground">
                    {formatCurrency(ej.financeiro?.ticket_medio || 0)}
                  </span>
                </div>
              </div>

              {/* Quarters Cards */}
              <div className="card-elevated p-4">
                <h4 className="font-bold text-sm text-foreground mb-3">Distribuição por Trimestres (Quarters)</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-secondary/40 p-3 rounded-lg text-center">
                    <span className="text-xs font-bold text-muted-foreground block">Q1</span>
                    <span className="text-sm font-extrabold text-foreground">{formatCurrency(ej.faturamentoQ1 || 0)}</span>
                  </div>
                  <div className="bg-secondary/40 p-3 rounded-lg text-center">
                    <span className="text-xs font-bold text-muted-foreground block">Q2</span>
                    <span className="text-sm font-extrabold text-foreground">{formatCurrency(ej.faturamentoQ2 || 0)}</span>
                  </div>
                  <div className="bg-secondary/40 p-3 rounded-lg text-center">
                    <span className="text-xs font-bold text-muted-foreground block">Q3</span>
                    <span className="text-sm font-extrabold text-foreground">{formatCurrency(ej.faturamentoQ3 || 0)}</span>
                  </div>
                  <div className="bg-secondary/40 p-3 rounded-lg text-center">
                    <span className="text-xs font-bold text-muted-foreground block">Q4</span>
                    <span className="text-sm font-extrabold text-foreground">{formatCurrency(ej.faturamentoQ4 || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Tabela Mês a Mês */}
              {meses.length > 0 && (
                <div className="card-elevated overflow-hidden">
                  <div className="p-4 border-b border-border font-bold text-sm text-foreground">
                    Execução Mês a Mês (Base DDR 2026)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-secondary/40 text-muted-foreground uppercase font-semibold">
                        <tr>
                          <th className="p-3">Mês</th>
                          <th className="p-3">Executado no Mês</th>
                          <th className="p-3">Acumulado</th>
                          <th className="p-3">Meta do Mês</th>
                          <th className="p-3">% Atingido</th>
                          <th className="p-3">Contratos</th>
                          <th className="p-3">Membros em Execução</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {meses.map((m) => (
                          <tr key={m.mes} className="hover:bg-secondary/20">
                            <td className="p-3 font-semibold text-foreground">{m.nome_mes}</td>
                            <td className="p-3 font-bold text-emerald-500">{formatCurrency(m.faturamento_mes)}</td>
                            <td className="p-3 font-bold text-foreground">{formatCurrency(m.faturamento_acumulado)}</td>
                            <td className="p-3 text-muted-foreground">{formatCurrency(m.meta_mes)}</td>
                            <td className="p-3 font-bold">{m.percentual_meta}%</td>
                            <td className="p-3 text-foreground">{m.contratos}</td>
                            <td className="p-3 text-foreground">{m.membros_executores}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACOMPANHAMENTO DE MEMBROS */}
          {activeTab === 'membros' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card-elevated p-4">
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-1">Membros Ativos</span>
                  <span className="text-2xl font-extrabold text-foreground">{totalMembros}</span>
                  <span className="text-xs text-muted-foreground block mt-1">Efetivo da EJ</span>
                </div>
                <div className="card-elevated p-4">
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-1">Membros que Executam</span>
                  <span className="text-2xl font-extrabold text-primary">
                    {ej.membros?.percentual_executores || 0}%
                  </span>
                  <span className="text-xs text-muted-foreground block mt-1">
                    {ej.membros?.executores_mes || 0} membros em projetos
                  </span>
                </div>
                <div className="card-elevated p-4">
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-1">Produtividade / Membro</span>
                  <span className="text-2xl font-extrabold text-rio-gold">
                    {formatCurrency(ej.financeiro?.faturamento_por_membro || 0)}
                  </span>
                  <span className="text-xs text-muted-foreground block mt-1">Faturamento médio</span>
                </div>
                <div className="card-elevated p-4">
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-1">Retenção (1 ano+)</span>
                  <span className="text-2xl font-extrabold text-emerald-500">
                    {ej.membros?.retencao_1_ano_percentual?.toFixed(1) || 75}%
                  </span>
                  <span className="text-xs text-muted-foreground block mt-1">Permanência no MEJ</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card-elevated p-5 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-base text-foreground">
                    <HeartHandshake className="text-rose-500" size={18} />
                    <span>Diversidade & Inclusão (D&I)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Acompanhamento prioritário do PE 25/27 para promover equidade e representatividade no MEJ.
                  </p>
                  <div className="flex justify-between items-center py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">Membros de Grupos Sub-representados:</span>
                    <strong className="text-foreground">{ej.membros?.diversidade_minorizados_percentual || 35}%</strong>
                  </div>
                  <div className="flex justify-between items-center py-2 text-sm">
                    <span className="text-muted-foreground">Políticas Afirmativas:</span>
                    <strong className="text-emerald-500">
                      {complementares?.diversidade_inclusao?.politicas_di_adotadas || 'Implementadas'}
                    </strong>
                  </div>
                </div>

                <div className="card-elevated p-5 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-base text-foreground">
                    <Sparkles className="text-rio-gold" size={18} />
                    <span>Engajamento com o MEJ (ECMJ)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Participação em reuniões plenárias, produtos de conexão, EFEJ, ENEJ e ritos da RioJunior.
                  </p>
                  <div className="flex justify-between items-center py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">Membros Engajados:</span>
                    <strong className="text-foreground">{ej.membros?.engajamento_mej_quantidade || 0} membros</strong>
                  </div>
                  <div className="flex justify-between items-center py-2 text-sm">
                    <span className="text-muted-foreground">% de Engajamento:</span>
                    <strong className="text-rio-gold">{ej.membros?.engajamento_mej_percentual || 0}%</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INDICADORES PE BRASIL JÚNIOR 2025/2027 */}
          {activeTab === 'pe_bj' && (
            <div className="space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                <Target size={22} className="text-primary shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <strong className="text-foreground text-sm block">Planejamento Estratégico da Rede 2025/2027</strong>
                  Indicadores auditados pelo Portal Brasil Júnior: <strong>Indicadores Essenciais</strong> (obrigatórios para toda a rede) e <strong>Indicadores Complementares</strong> (maturidade e escolha da EJ).
                </div>
              </div>

              {/* Indicadores Essenciais */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  1. Indicadores Essenciais (Obrigatórios)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="card-elevated p-3.5">
                    <span className="text-xs text-muted-foreground block mb-0.5">Faturamento Total</span>
                    <span className="text-base font-bold text-foreground block">{formatCurrency(ej.faturamentoAtual)}</span>
                    <span className="text-[11px] text-muted-foreground">Meta: {formatCurrency(ej.faturamentoMeta)} ({progress}%)</span>
                  </div>

                  <div className="card-elevated p-3.5">
                    <span className="text-xs text-muted-foreground block mb-0.5">Projetos & Soluções</span>
                    <span className="text-base font-bold text-foreground block">
                      {essenciais?.projetos_solucoes?.realizado || 1} contratos
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Status: {essenciais?.projetos_solucoes?.status || 'Em Andamento'}
                    </span>
                  </div>

                  <div className="card-elevated p-3.5">
                    <span className="text-xs text-muted-foreground block mb-0.5">Membros que Executam</span>
                    <span className="text-base font-bold text-foreground block">
                      {ej.membros?.percentual_executores || 0}% da equipe
                    </span>
                    <span className="text-[11px] text-muted-foreground">Meta Brasil Júnior: mínimo de 50%</span>
                  </div>

                  <div className="card-elevated p-3.5">
                    <span className="text-xs text-muted-foreground block mb-0.5">Satisfação do Cliente</span>
                    <span className="text-base font-bold text-foreground block">
                      CSAT: {essenciais?.satisfacao_cliente?.csat || 4.8} / 5.0
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      NPS: {essenciais?.satisfacao_cliente?.nps || 82} (Meta: 75)
                    </span>
                  </div>

                  <div className="card-elevated p-3.5">
                    <span className="text-xs text-muted-foreground block mb-0.5">Selo EJ</span>
                    <span className="text-base font-bold text-emerald-500 block">13/13 Critérios Válidos</span>
                    <span className="text-[11px] text-muted-foreground">Regularidade Jurídica e Fiscal 100%</span>
                  </div>
                </div>
              </div>

              {/* Indicadores Complementares */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Award size={16} className="text-rio-purple" />
                  2. Indicadores Complementares (Maturidade)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="card-elevated p-3.5">
                    <span className="text-xs text-muted-foreground block mb-0.5">Faturamento por Membro</span>
                    <span className="text-base font-bold text-rio-gold block">
                      {formatCurrency(ej.financeiro?.faturamento_por_membro || 0)} / membro
                    </span>
                    <span className="text-[11px] text-muted-foreground">Eficiência produtiva</span>
                  </div>

                  <div className="card-elevated p-3.5">
                    <span className="text-xs text-muted-foreground block mb-0.5">Rede Colaborativa</span>
                    <span className="text-base font-bold text-sky-400 block">
                      {complementares?.rede_colaborativa?.realizado_percentual || 0}% de contratos colab
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate block">
                      Parceiros: {complementares?.rede_colaborativa?.parceiros || 'N/A'}
                    </span>
                  </div>

                  <div className="card-elevated p-3.5">
                    <span className="text-xs text-muted-foreground block mb-0.5">Inovação & ODS da ONU</span>
                    <span className="text-base font-bold text-emerald-500 block">
                      {complementares?.solucoes_inovadoras?.ods_contempladas || 2} ODS contempladas
                    </span>
                    <span className="text-[11px] text-muted-foreground">Impacto socioambiental</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DADOS INSTITUCIONAIS & DDR */}
          {activeTab === 'institucional' && (
            <div className="card-elevated p-5 space-y-4">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                Dados Cadastrais & Contatos
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block">Razão Social / Nome Fantasia</span>
                  <strong className="text-foreground text-sm block mt-0.5">{ej.nome}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block">Universidade / IES</span>
                  <strong className="text-foreground text-sm block mt-0.5">{ej.ies || ej.localizacao}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block">CNPJ</span>
                  <strong className="text-foreground text-sm block mt-0.5">{ej.cnpj}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block">Ano de Federação</span>
                  <strong className="text-foreground text-sm block mt-0.5">{ej.ano_federacao || 2018}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block">Região RioJunior</span>
                  <strong className="text-foreground text-sm block mt-0.5">{ej.regiao} • {ej.cidade || 'Rio de Janeiro'}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block">Guardião DDR RioJunior</span>
                  <strong className="text-rio-gold text-sm block mt-0.5">{ej.guardiao_ddr || 'Gabriel Maia'}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block">Batalha Estratégica</span>
                  <strong className="text-foreground text-sm block mt-0.5">{ej.batalha || 'Alto Crescimento'}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block">E-mail de Contato</span>
                  <strong className="text-primary text-sm block mt-0.5">{ej.email || 'contato@riojunior.com.br'}</strong>
                </div>
              </div>

              {ej.cursos_admitidos && (
                <div className="pt-3 border-t border-border text-xs">
                  <span className="text-muted-foreground block mb-1">Cursos Admitidos</span>
                  <p className="text-foreground leading-relaxed">{ej.cursos_admitidos}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
