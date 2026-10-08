import { useState, useMemo } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  Building2, 
  TrendingUp, 
  Search, 
  Loader2, 
  FileText, 
  Award,
  Users,
  Grid,
  List,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { EJ } from '@/types';
import { REGIOES } from '@/data/mockData';
import { formatCurrency, formatPercentage, formatCNPJ } from '@/utils/formatters';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useEJs } from '@/hooks/useEJs';
import ContratosSection from '@/components/ddr/ContratosSection';
import ProdutosConexoesSection from '@/components/ddr/ProdutosConexoesSection';
import EJBlockCard from '@/components/ddr/EJBlockCard';
import EJProfileModal from '@/components/ddr/EJProfileModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DDRViewProps {
  selectedYear: number;
}

const DDRView = ({ selectedYear }: DDRViewProps) => {
  const { ejs, loading, createEJ, updateEJ, deleteEJ } = useEJs();
  const [ejToDelete, setEjToDelete] = useState<string | null>(null);
  const [selectedEJForProfile, setSelectedEJForProfile] = useState<EJ | null>(null);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegiao, setFilterRegiao] = useState<string>('');
  const [filterCluster, setFilterCluster] = useState<string>('');
  const [filterFarol, setFilterFarol] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('faturamento_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<EJ, 'id'> & { id?: string }>({
    nome: '',
    cluster: 1,
    cnpj: '',
    regiao: 'Centro Sul 1',
    localizacao: '',
    faturamentoMeta: 0,
    faturamentoAtual: 0,
    faturamentoQ1: 0,
    faturamentoQ2: 0,
    faturamentoQ3: 0,
    faturamentoQ4: 0
  });
  const [isEditing, setIsEditing] = useState(false);

  const openForm = (ej?: EJ) => {
    if (ej) {
      setFormData(ej);
      setIsEditing(true);
    } else {
      setFormData({
        nome: '',
        cluster: 1,
        cnpj: '',
        regiao: 'Centro Sul 1',
        localizacao: '',
        faturamentoMeta: 0,
        faturamentoAtual: 0,
        faturamentoQ1: 0,
        faturamentoQ2: 0,
        faturamentoQ3: 0,
        faturamentoQ4: 0
      });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const faturamentoAtual = (formData.faturamentoQ1 || 0) + (formData.faturamentoQ2 || 0) + (formData.faturamentoQ3 || 0) + (formData.faturamentoQ4 || 0);
    
    try {
      if (isEditing && formData.id) {
        await updateEJ(formData.id, { ...formData, faturamentoAtual });
      } else {
        await createEJ({ ...formData, faturamentoAtual });
      }
      setIsFormOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteClick = (id: string) => {
    setEjToDelete(id);
  };

  const confirmDelete = async () => {
    if (ejToDelete !== null) {
      await deleteEJ(ejToDelete);
      setEjToDelete(null);
    }
  };

  const filteredEjs = useMemo(() => {
    let result = ejs.filter(ej => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        ej.nome.toLowerCase().includes(term) ||
        (ej.localizacao && ej.localizacao.toLowerCase().includes(term)) ||
        (ej.ies && ej.ies.toLowerCase().includes(term)) ||
        (ej.cidade && ej.cidade.toLowerCase().includes(term)) ||
        (ej.cursos_admitidos && ej.cursos_admitidos.toLowerCase().includes(term));
      
      const matchesRegiao = !filterRegiao || ej.regiao === filterRegiao;
      const matchesCluster = !filterCluster || ej.cluster === Number(filterCluster);
      const matchesFarol = !filterFarol || ej.farol === filterFarol;

      return matchesSearch && matchesRegiao && matchesCluster && matchesFarol;
    });

    result.sort((a, b) => {
      if (sortBy === 'faturamento_desc') return b.faturamentoAtual - a.faturamentoAtual;
      if (sortBy === 'meta_desc') return b.faturamentoMeta - a.faturamentoMeta;
      if (sortBy === 'percentual_desc') {
        const pA = a.faturamentoMeta > 0 ? (a.faturamentoAtual / a.faturamentoMeta) : 0;
        const pB = b.faturamentoMeta > 0 ? (b.faturamentoAtual / b.faturamentoMeta) : 0;
        return pB - pA;
      }
      if (sortBy === 'membros_desc') {
        const mA = a.membros?.total_ativos || a.membros_ativos || 0;
        const mB = b.membros?.total_ativos || b.membros_ativos || 0;
        return mB - mA;
      }
      if (sortBy === 'nome_asc') return a.nome.localeCompare(b.nome);
      return 0;
    });

    return result;
  }, [ejs, searchTerm, filterRegiao, filterCluster, filterFarol, sortBy]);

  // Stats consolidadas
  const totalEjs = ejs.length;
  const totalFaturamento = ejs.reduce((acc, ej) => acc + ej.faturamentoAtual, 0);
  const totalMeta = ejs.reduce((acc, ej) => acc + ej.faturamentoMeta, 0);
  const avgProgress = formatPercentage(totalFaturamento, totalMeta);
  const totalMembros = ejs.reduce((acc, ej) => acc + (ej.membros?.total_ativos || ej.membros_ativos || 0), 0);
  const ejsNoVerde = ejs.filter(e => e.farol === 'verde' || e.farol === 'protagonista').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary/20 p-5 rounded-2xl border border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              DDR RioJunior 2026
            </span>
            <span className="text-xs text-muted-foreground">• Planejamento Estratégico da Rede 2025/2027</span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">Diretoria de Desenvolvimento da Rede (DDR)</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Acompanhamento das <strong>{totalEjs} Empresas Juniores do Estado do Rio de Janeiro</strong>, metas de faturamento executado mês a mês e indicadores PE Brasil Júnior.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-secondary p-1 rounded-xl border border-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid size={14} /> Bloquinhos
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List size={14} /> Tabela Geral
            </button>
          </div>

          <button 
            onClick={() => openForm()} 
            className="btn-primary flex items-center gap-2 text-xs py-2 px-3.5"
          >
            <Plus size={16} /> Nova EJ
          </button>
        </div>
      </div>

      <Tabs defaultValue="ejs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="ejs" className="flex items-center gap-2">
            <Building2 size={16} /> EJs ({totalEjs})
          </TabsTrigger>
          <TabsTrigger value="contratos" className="flex items-center gap-2">
            <FileText size={16} /> Contratos
          </TabsTrigger>
          <TabsTrigger value="conexoes" className="flex items-center gap-2">
            <Award size={16} /> Conexões
          </TabsTrigger>
        </TabsList>

        {/* EJs Tab */}
        <TabsContent value="ejs" className="space-y-6">
          {/* Delete Confirmation Modal */}
          {ejToDelete !== null && (
            <ConfirmModal
              title="Confirmar Exclusão"
              message="Essa ação excluirá a EJ permanentemente."
              onConfirm={confirmDelete}
              onCancel={() => setEjToDelete(null)}
            />
          )}

          {/* Form Modal */}
          {isFormOpen && (
            <Modal 
              title={isEditing ? `Editar ${formData.nome}` : "Nova Empresa Júnior"} 
              onClose={() => setIsFormOpen(false)}
            >
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="label-sm">Nome da EJ</label>
                    <input 
                      type="text" 
                      value={formData.nome} 
                      onChange={e => setFormData({...formData, nome: e.target.value})} 
                      className="input-field" 
                      placeholder="Nome da EJ" 
                    />
                  </div>
                  <div>
                    <label className="label-sm">CNPJ</label>
                    <input 
                      type="text" 
                      value={formData.cnpj} 
                      onChange={e => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})} 
                      className="input-field" 
                      placeholder="00.000.000/0000-00" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="label-sm">Região</label>
                    <select 
                      value={formData.regiao} 
                      onChange={e => setFormData({...formData, regiao: e.target.value})} 
                      className="input-field"
                    >
                      {REGIOES.map(regiao => (
                        <option key={regiao} value={regiao}>{regiao}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-sm">Cluster (Maturidade)</label>
                    <select 
                      value={formData.cluster} 
                      onChange={e => setFormData({...formData, cluster: Number(e.target.value) as EJ['cluster']})} 
                      className="input-field"
                    >
                      {[1, 2, 3, 4, 5].map(c => (
                        <option key={c} value={c}>Cluster {c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label-sm">Localização</label>
                  <input 
                    type="text" 
                    value={formData.localizacao} 
                    onChange={e => setFormData({...formData, localizacao: e.target.value})} 
                    className="input-field" 
                    placeholder="IES - Cidade" 
                  />
                </div>

                <div className="border-t border-border pt-5 mt-5">
                  <p className="label-sm mb-4">Faturamento</p>
                  <div className="grid grid-cols-2 gap-5 mb-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Meta Anual</label>
                      <input 
                        type="number" 
                        value={formData.faturamentoMeta} 
                        onChange={e => setFormData({...formData, faturamentoMeta: Number(e.target.value)})} 
                        className="input-field" 
                        placeholder="R$ 0,00" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Q1</label>
                      <input 
                        type="number" 
                        value={formData.faturamentoQ1 || ''} 
                        onChange={e => setFormData({...formData, faturamentoQ1: Number(e.target.value)})} 
                        className="input-field text-sm" 
                        placeholder="0" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Q2</label>
                      <input 
                        type="number" 
                        value={formData.faturamentoQ2 || ''} 
                        onChange={e => setFormData({...formData, faturamentoQ2: Number(e.target.value)})} 
                        className="input-field text-sm" 
                        placeholder="0" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Q3</label>
                      <input 
                        type="number" 
                        value={formData.faturamentoQ3 || ''} 
                        onChange={e => setFormData({...formData, faturamentoQ3: Number(e.target.value)})} 
                        className="input-field text-sm" 
                        placeholder="0" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Q4</label>
                      <input 
                        type="number" 
                        value={formData.faturamentoQ4 || ''} 
                        onChange={e => setFormData({...formData, faturamentoQ4: Number(e.target.value)})} 
                        className="input-field text-sm" 
                        placeholder="0" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-border">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {isEditing ? 'Salvar' : 'Cadastrar'}
                  </button>
                </div>
              </form>
            </Modal>
          )}

          {/* Stats Cards Consolidados */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="card-elevated p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground">{totalEjs}</p>
                  <p className="text-xs text-muted-foreground">EJs Federadas</p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-emerald-500">{formatCurrency(totalFaturamento)}</p>
                  <p className="text-xs text-muted-foreground">Faturamento da Rede</p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rio-gold/10 flex items-center justify-center text-rio-gold">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-foreground">{formatCurrency(totalMeta)}</p>
                  <p className="text-xs text-muted-foreground">Meta Global RJ</p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rio-purple/10 flex items-center justify-center text-rio-purple">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground">{totalMembros.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-muted-foreground">Membros Ativos</p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground">{avgProgress}%</p>
                  <p className="text-xs text-muted-foreground">Progresso Global ({ejsNoVerde} EJs no Verde)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="card-elevated p-4 space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nome da EJ, IES (UFRJ, UFF, UERJ...), cidade ou curso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              <select 
                value={filterRegiao} 
                onChange={(e) => setFilterRegiao(e.target.value)}
                className="input-field md:w-52"
              >
                <option value="">Todas as Regiões</option>
                {REGIOES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              <select 
                value={filterFarol} 
                onChange={(e) => setFilterFarol(e.target.value)}
                className="input-field md:w-44"
              >
                <option value="">Todos os Faróis</option>
                <option value="protagonista">⭐ Protagonista</option>
                <option value="verde">🟢 Verde</option>
                <option value="amarelo">🟡 Amarelo</option>
                <option value="vermelho">🔴 Atenção / Zerada</option>
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field md:w-52"
              >
                <option value="faturamento_desc">Maior Faturamento Realizado</option>
                <option value="meta_desc">Maior Meta Anual</option>
                <option value="percentual_desc">Maior % de Meta Batida</option>
                <option value="membros_desc">Mais Membros Ativos</option>
                <option value="nome_asc">Nome da EJ (A-Z)</option>
              </select>
            </div>

            {/* Cluster Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/40">
              <span className="text-xs text-muted-foreground font-semibold">Cluster:</span>
              <button
                onClick={() => setFilterCluster('')}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                  filterCluster === '' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                Todos ({totalEjs})
              </button>

              {[5, 4, 3, 2, 1].map(c => {
                const count = ejs.filter(e => e.cluster === c).length;
                const isSelected = filterCluster === String(c);
                return (
                  <button
                    key={c}
                    onClick={() => setFilterCluster(isSelected ? '' : String(c))}
                    className={`text-xs px-3 py-1 rounded-full font-bold transition-colors flex items-center gap-1.5 ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>Cluster {c}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-background/50">{count}</span>
                  </button>
                );
              })}

              <div className="ml-auto text-xs text-muted-foreground">
                Exibindo <strong>{filteredEjs.length}</strong> de {totalEjs} Empresas Juniores
              </div>
            </div>
          </div>

          {/* EJ Grid (Bloquinhos) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredEjs.map((ej) => (
                <EJBlockCard
                  key={ej.id}
                  ej={ej}
                  onClick={(selected) => setSelectedEJForProfile(selected)}
                  onEdit={(selected) => openForm(selected)}
                  onDelete={(id) => handleDeleteClick(id)}
                />
              ))}
            </div>
          )}

          {/* Tabela Geral Comparativa */}
          {viewMode === 'table' && (
            <div className="card-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-muted-foreground uppercase font-semibold">
                    <tr>
                      <th className="p-3.5">Empresa Júnior</th>
                      <th className="p-3.5">Cluster</th>
                      <th className="p-3.5">Região</th>
                      <th className="p-3.5">Meta Anual</th>
                      <th className="p-3.5">Realizado</th>
                      <th className="p-3.5">% Atingido</th>
                      <th className="p-3.5">Membros</th>
                      <th className="p-3.5">Farol</th>
                      <th className="p-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredEjs.map((ej) => {
                      const prog = formatPercentage(ej.faturamentoAtual, ej.faturamentoMeta);
                      return (
                        <tr 
                          key={ej.id} 
                          onClick={() => setSelectedEJForProfile(ej)}
                          className="hover:bg-secondary/20 cursor-pointer"
                        >
                          <td className="p-3.5">
                            <strong className="text-sm text-foreground block">{ej.nome}</strong>
                            <span className="text-muted-foreground">{ej.ies || ej.localizacao}</span>
                          </td>
                          <td className="p-3.5 font-bold">Cluster {ej.cluster}</td>
                          <td className="p-3.5 text-muted-foreground">{ej.regiao}</td>
                          <td className="p-3.5 text-muted-foreground font-semibold">{formatCurrency(ej.faturamentoMeta)}</td>
                          <td className="p-3.5 font-bold text-emerald-500">{formatCurrency(ej.faturamentoAtual)}</td>
                          <td className="p-3.5 font-bold">{prog}%</td>
                          <td className="p-3.5">{ej.membros?.total_ativos || ej.membros_ativos || 18}</td>
                          <td className="p-3.5 font-bold">{ej.farol_original || ej.farol || 'Amarelo'}</td>
                          <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1">
                              <button 
                                onClick={() => setSelectedEJForProfile(ej)}
                                className="px-2.5 py-1 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground rounded text-[11px] font-bold transition-colors"
                              >
                                Perfil
                              </button>
                              <button 
                                onClick={() => openForm(ej)}
                                className="p-1 text-muted-foreground hover:text-rio-gold rounded"
                              >
                                <Edit2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal de Perfil Completo da EJ */}
          {selectedEJForProfile && (
            <EJProfileModal 
              ej={selectedEJForProfile}
              onClose={() => setSelectedEJForProfile(null)}
            />
          )}

        </TabsContent>

        {/* Contratos Tab */}
        <TabsContent value="contratos">
          <ContratosSection />
        </TabsContent>

        {/* Conexoes Tab */}
        <TabsContent value="conexoes">
          <ProdutosConexoesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DDRView;
