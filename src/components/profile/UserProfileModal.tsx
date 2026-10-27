// src/components/profile/UserProfileModal.tsx
// Perfil Individual de Usuário da RioJunior com Sistema de Advertências e Cartões

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Briefcase,
  Mail,
  Calendar,
  IdCard,
  MapPin,
  CheckCircle2,
  XCircle,
  FileText,
  Save,
  Pencil,
  Info,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  membrosCartoesService,
  MembroRioJunior,
  CartaoAdvertencia,
  MembroCardStats
} from '@/services/membrosCartoesService';
import {
  getGuildaInfo,
  getPapeisByGuilda,
  getObjetivoPapel,
  GUILDAS_INFO,
  GuildaKey
} from '@/data/rolesGuildasData';
import { toast } from '@/hooks/use-toast';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetMemberEmail?: string;
}

export function UserProfileModal({ open, onOpenChange, targetMemberEmail }: UserProfileModalProps) {
  const { profile } = useAuth();
  const [membros, setMembros] = useState<MembroRioJunior[]>(membrosCartoesService.getMembros());
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<MembroRioJunior>>({});

  // Atualiza lista caso haja alterações no serviço
  useEffect(() => {
    const unsub = membrosCartoesService.subscribe(() => {
      setMembros(membrosCartoesService.getMembros());
    });
    return unsub;
  }, []);

  // Identifica o membro vinculado pelo e-mail
  const loggedEmail = targetMemberEmail || profile?.email || 'presidencia@riojunior.com.br';

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      return;
    }
    // Procura membro por e-mail
    const matched = membros.find(
      m => (m.email || '').toLowerCase().trim() === loggedEmail.toLowerCase().trim()
    );
    if (matched) {
      setSelectedMemberId(matched.id);
    } else if (membros.length > 0 && !selectedMemberId) {
      setSelectedMemberId(membros[0].id);
    }
  }, [open, loggedEmail, membros]);

  const currentMember = useMemo(() => {
    return membros.find(m => m.id === selectedMemberId) || membros[0];
  }, [membros, selectedMemberId]);

  // Carrega cartões e calcula estatísticas regulamentares
  const memberCards = useMemo(() => {
    if (!currentMember) return [];
    return membrosCartoesService.getCartoesByMembro(currentMember.id);
  }, [currentMember]);

  const stats: MembroCardStats = useMemo(() => {
    return membrosCartoesService.calculateCardStats(memberCards);
  }, [memberCards]);

  const guildaInfo = useMemo(() => {
    return getGuildaInfo(currentMember?.guilda || 'OP');
  }, [currentMember]);

  const objetivoPapel = useMemo(() => {
    if (!currentMember) return '';
    return getObjetivoPapel(currentMember.guilda, currentMember.cargo);
  }, [currentMember]);

  // Iniciar edição
  const handleStartEdit = () => {
    if (!currentMember) return;
    setEditForm({
      nome: currentMember.nome,
      email: currentMember.email,
      guilda: currentMember.guilda,
      cargo: currentMember.cargo,
      cpf: currentMember.cpf,
      identidade: currentMember.identidade,
      orgaoExpedidor: currentMember.orgaoExpedidor,
      endereco: currentMember.endereco,
      nacionalidade: currentMember.nacionalidade,
      estadoCivil: currentMember.estadoCivil,
      profissao: currentMember.profissao
    });
    setIsEditing(true);
  };

  // Salvar edição
  const handleSaveEdit = () => {
    if (!currentMember) return;
    const updated: MembroRioJunior = {
      ...currentMember,
      nome: editForm.nome || currentMember.nome,
      email: editForm.email || currentMember.email,
      guilda: (editForm.guilda as GuildaKey) || currentMember.guilda,
      cargo: editForm.cargo || currentMember.cargo,
      cpf: editForm.cpf || currentMember.cpf,
      identidade: editForm.identidade || currentMember.identidade,
      orgaoExpedidor: editForm.orgaoExpedidor || currentMember.orgaoExpedidor,
      endereco: editForm.endereco || currentMember.endereco,
      nacionalidade: editForm.nacionalidade || currentMember.nacionalidade,
      estadoCivil: editForm.estadoCivil || currentMember.estadoCivil,
      profissao: editForm.profissao || currentMember.profissao
    };
    membrosCartoesService.saveMembro(updated);
    setIsEditing(false);
    toast({
      title: 'Dados cadastrais atualizados!',
      description: 'As informações do seu perfil foram gravadas com sucesso.'
    });
  };

  if (!currentMember) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-sidebar-border bg-card">
        {/* Top Header com Tema RioJunior */}
        <div className="relative bg-gradient-to-r from-[#0f1c35] via-[#16274b] to-[#1e3a8a] p-6 text-white border-b border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl ring-4 ring-white/10 shrink-0">
                {currentMember.nome ? currentMember.nome.charAt(0) : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-white tracking-tight">{currentMember.nome}</h2>
                  <Badge className="bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 text-[11px]">
                    {guildaInfo.sigla}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail size={13} className="text-amber-400" />
                    {currentMember.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={13} className="text-amber-400" />
                    {currentMember.cargo}
                  </span>
                </div>
              </div>
            </div>

            {/* Alternador de Membro (para visualização/teste da plataforma) */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/15 max-w-xs shrink-0">
              <Label className="text-[10px] text-amber-200 uppercase font-bold tracking-wider block mb-1">
                Visualizar Membro (Vinculado por e-mail):
              </Label>
              <Select value={selectedMemberId} onValueChange={(id) => { setSelectedMemberId(id); setIsEditing(false); }}>
                <SelectTrigger className="h-8 text-xs bg-slate-900/60 text-white border-white/20">
                  <SelectValue placeholder="Selecione um membro" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {membros.map(m => (
                    <SelectItem key={m.id} value={m.id} className="text-xs">
                      {m.nome} ({m.guilda})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Corpo do Perfil */}
        <div className="p-6 space-y-6">
          {/* Card Principal de Advertências e Cartões (Regras da RioJunior) */}
          <div className="rounded-2xl border border-border p-5 bg-gradient-to-br from-card to-muted/20 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
                  <ShieldAlert size={18} className="text-amber-500" />
                  Sistema de Advertências da RioJunior
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Acompanhamento individual de cartões atribuídos pela Guilda de Operações (OP).
                </p>
              </div>

              {/* Status do Membro Badge */}
              <div className="flex items-center gap-2">
                {stats.isDesligamento ? (
                  <Badge variant="destructive" className="px-3 py-1 text-xs gap-1.5 animate-pulse">
                    <XCircle size={14} /> Desligamento da RioJunior
                  </Badge>
                ) : stats.totalVermelhos === 1 ? (
                  <Badge className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 text-xs gap-1.5">
                    <AlertTriangle size={14} /> Alerta Crítico (1 Vermelho)
                  </Badge>
                ) : stats.amarelosCount > 0 ? (
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 text-xs gap-1.5">
                    <AlertTriangle size={14} /> Em Atenção ({stats.amarelosCount} Amarelo)
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-xs gap-1.5">
                    <CheckCircle2 size={14} /> Regular / Conforme
                  </Badge>
                )}
              </div>
            </div>

            {/* Painel de Contadores de Cartões */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              {/* Cartões Amarelos (Infrações Moderadas) */}
              <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-500/10 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                    Cartões Amarelos
                  </span>
                  <div className="w-4 h-6 rounded-xs bg-amber-400 shadow-sm border border-amber-600"></div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-900 dark:text-amber-200">
                    {stats.amarelosCount}
                  </span>
                  <span className="text-xs text-amber-700 dark:text-amber-400">
                    {stats.amarelosCount === 1 ? 'infração moderada' : 'infrações moderadas'}
                  </span>
                </div>
                {stats.vermelhosConvertidos > 0 && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 font-medium">
                    ⚡ {stats.vermelhosConvertidos * 2} amarelos viraram {stats.vermelhosConvertidos} vermelho
                  </p>
                )}
              </div>

              {/* Cartões Vermelhos (Infrações Graves + Conversões) */}
              <div className="rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-500/10 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide">
                    Cartões Vermelhos
                  </span>
                  <div className="w-4 h-6 rounded-xs bg-rose-500 shadow-sm border border-rose-700"></div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-rose-900 dark:text-rose-200">
                    {stats.totalVermelhos}
                  </span>
                  <span className="text-xs text-rose-700 dark:text-rose-400">
                    de 2 máximos permitidos
                  </span>
                </div>
                <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-1 font-medium">
                  {stats.vermelhosDiretosCount} diretos + {stats.vermelhosConvertidos} por conversão
                </p>
              </div>

              {/* Medidor de Limite para Desligamento */}
              <div className="sm:col-span-2 rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-foreground">Escala para Desligamento Formal</span>
                    <span className={stats.totalVermelhos >= 2 ? 'text-destructive font-bold' : 'text-muted-foreground'}>
                      {stats.totalVermelhos} / 2 Vermelhos
                    </span>
                  </div>
                  {/* Barra de Progresso Customizada */}
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex gap-1 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stats.totalVermelhos >= 1 ? 'bg-rose-500 flex-1' : 'bg-transparent flex-1'
                      }`}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stats.totalVermelhos >= 2 ? 'bg-destructive flex-1' : 'bg-transparent flex-1'
                      }`}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                  <strong>Regra Regulamentar:</strong> 2 cartões amarelos convertem em 1 vermelho. O acúmulo de 2 cartões vermelhos resulta no <strong>desligamento da RioJunior</strong>.
                </div>
              </div>
            </div>

            {/* Histórico Detalhado dos Cartões Desta Pessoa */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Histórico de Aplicações ({memberCards.length})
              </h4>
              {memberCards.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground bg-muted/20">
                  <CheckCircle2 size={24} className="mx-auto mb-1.5 text-emerald-500 opacity-60" />
                  Nenhum cartão ou advertência registrado para este membro. Excelente conduta!
                </div>
              ) : (
                <div className="space-y-2">
                  {memberCards.map(c => (
                    <div
                      key={c.id}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs ${
                        c.tipo === 'vermelho'
                          ? 'bg-rose-500/5 border-rose-300 dark:border-rose-900/50'
                          : 'bg-amber-500/5 border-amber-300 dark:border-amber-900/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-3.5 h-5 rounded-xs shrink-0 mt-0.5 shadow-xs ${
                            c.tipo === 'vermelho' ? 'bg-rose-500' : 'bg-amber-400'
                          }`}
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-foreground">
                              {c.tipo === 'vermelho' ? 'Cartão Vermelho (Infração Grave)' : 'Cartão Amarelo (Infração Moderada)'}
                            </span>
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                              {c.categoria}
                            </Badge>
                          </div>
                          <p className="text-foreground/90 font-medium">{c.motivo}</p>
                          {c.observacoes && (
                            <p className="text-muted-foreground text-[11px] italic">
                              Obs: {c.observacoes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 text-muted-foreground text-[11px]">
                        <div>📅 {c.data}</div>
                        <div className="text-primary font-medium">{c.aplicadoPor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Abas de Dados da Guilda, Papel e Informações Cadastrais */}
          <Tabs defaultValue="papel" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="papel" className="gap-2">
                <Briefcase size={14} />
                <span>Guilda & Frente de Atuação</span>
              </TabsTrigger>
              <TabsTrigger value="cadastro" className="gap-2">
                <IdCard size={14} />
                <span>Dados Cadastrais & Contato</span>
              </TabsTrigger>
            </TabsList>

            {/* ABA 1: Guilda e Cargo / Papel */}
            <TabsContent value="papel" className="space-y-4 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guilda */}
                <div className="rounded-xl border border-border p-4 bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground uppercase font-bold">Guilda (Diretoria)</Label>
                    <Badge variant="outline" className="font-bold text-primary">
                      {guildaInfo.sigla}
                    </Badge>
                  </div>
                  <h4 className="text-base font-bold text-foreground">{guildaInfo.nome}</h4>
                  <p className="text-xs text-muted-foreground">{guildaInfo.descricao}</p>
                </div>

                {/* Cargo / Frente */}
                <div className="rounded-xl border border-border p-4 bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground uppercase font-bold">Cargo / Frente Mapeada</Label>
                    <Badge variant="secondary" className="text-[10px]">
                      Mapeamento 2027
                    </Badge>
                  </div>
                  <h4 className="text-base font-bold text-foreground">{currentMember.cargo}</h4>
                  <p className="text-xs text-muted-foreground">
                    Atuação estratégica alinhada ao organograma oficial da Federação.
                  </p>
                </div>
              </div>

              {/* Objetivo do Papel Oficial */}
              {objetivoPapel && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1.5">
                  <h5 className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Sparkles size={14} />
                    Objetivo do Papel (Mapeamento Oficial de Papéis RioJunior 2027):
                  </h5>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    "{objetivoPapel}"
                  </p>
                </div>
              )}
            </TabsContent>

            {/* ABA 2: Dados Cadastrais Editáveis */}
            <TabsContent value="cadastro" className="space-y-4 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Informações sincronizadas com a planilha oficial <strong>[RIOJUNIOR] Dados de Membros 2026</strong>.
                </span>
                {!isEditing ? (
                  <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={handleStartEdit}>
                    <Pencil size={12} /> Editar Dados
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-xs" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button size="sm" className="text-xs gap-1.5" onClick={handleSaveEdit}>
                      <Save size={12} /> Salvar
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <Label className="text-xs">Nome Completo</Label>
                    <Input
                      value={editForm.nome || ''}
                      onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">E-mail Institucional</Label>
                    <Input
                      value={editForm.email || ''}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Guilda (Diretoria)</Label>
                    <Select
                      value={editForm.guilda}
                      onValueChange={(val: GuildaKey) => {
                        const papeis = getPapeisByGuilda(val);
                        setEditForm({
                          ...editForm,
                          guilda: val,
                          cargo: papeis[0]?.nome || editForm.cargo
                        });
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(GUILDAS_INFO).map(g => (
                          <SelectItem key={g} value={g} className="text-xs">
                            {GUILDAS_INFO[g as GuildaKey].nome} ({g})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Cargo / Papel</Label>
                    <Select
                      value={editForm.cargo}
                      onValueChange={val => setEditForm({ ...editForm, cargo: val })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getPapeisByGuilda(editForm.guilda || currentMember.guilda).map(p => (
                          <SelectItem key={p.nome} value={p.nome} className="text-xs">
                            {p.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">CPF</Label>
                    <Input
                      value={editForm.cpf || ''}
                      onChange={e => setEditForm({ ...editForm, cpf: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Identidade / Órgão</Label>
                    <div className="flex gap-2">
                      <Input
                        value={editForm.identidade || ''}
                        onChange={e => setEditForm({ ...editForm, identidade: e.target.value })}
                        className="h-8 text-xs flex-1"
                        placeholder="Número"
                      />
                      <Input
                        value={editForm.orgaoExpedidor || ''}
                        onChange={e => setEditForm({ ...editForm, orgaoExpedidor: e.target.value })}
                        className="h-8 text-xs w-28"
                        placeholder="Órgão"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs">Endereço Residencial</Label>
                    <Input
                      value={editForm.endereco || ''}
                      onChange={e => setEditForm({ ...editForm, endereco: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">CPF</span>
                    <span className="font-semibold text-foreground">{currentMember.cpf || 'Não informado'}</span>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Identidade / Órgão</span>
                    <span className="font-semibold text-foreground">
                      {currentMember.identidade || 'Não informada'} ({currentMember.orgaoExpedidor || 'DETRAN-RJ'})
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Profissão / Estado Civil</span>
                    <span className="font-semibold text-foreground capitalize">
                      {currentMember.profissao || 'Estudante'} • {currentMember.estadoCivil || 'Solteiro'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Data de Entrada</span>
                    <span className="font-semibold text-foreground">{currentMember.dataEntrada}</span>
                  </div>
                  <div className="sm:col-span-2 p-3 rounded-lg border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Endereço</span>
                    <span className="font-semibold text-foreground">{currentMember.endereco || 'Não informado'}</span>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="p-4 border-t border-border bg-muted/10 flex justify-between sm:justify-between items-center">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Info size={13} className="text-primary" />
            <span>Perfil sincronizado por e-mail com a base de Membros da RioJunior.</span>
          </div>
          <Button variant="default" size="sm" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
