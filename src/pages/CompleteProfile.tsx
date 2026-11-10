import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, TIPOS_USUARIO } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, LogOut, CheckCircle2, Sparkles } from 'lucide-react';
import { DDR_EMPRESAS_JUNIORES } from '@/data/ddrDatabase';
import { resolveAccountByEmail, saveStoredAccountLink } from '@/utils/accountLinkResolver';
const logoHeader = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48"><text x="0" y="36" font-family="Arial,sans-serif" font-weight="700" font-size="32" fill="%231e4fa3">Rio<tspan fill="%2316a34a">Junior</tspan></text></svg>'.replace(/%23/g, '#'));

export default function CompleteProfile() {
  const { user, profile, loading: authLoading, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const autoResolved = useMemo(
    () => resolveAccountByEmail(user?.email || profile?.email, profile?.ej_id, profile?.tipo_solicitado),
    [user?.email, profile?.email, profile?.ej_id, profile?.tipo_solicitado]
  );

  const [nome, setNome] = useState('');
  const [tipoSolicitado, setTipoSolicitado] = useState('');
  const [ejId, setEjId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setNome(profile.nome || autoResolved.nomeCadastrado || user?.user_metadata?.full_name || '');
      setTipoSolicitado(
        profile.tipo_solicitado || (autoResolved.matched ? autoResolved.tipoUsuario : '')
      );
      setEjId(profile.ej_id || autoResolved.ejId || '');
      if (profile.status === 'aprovado') {
        navigate('/', { replace: true });
      }
    } else if (autoResolved.matched) {
      setNome(autoResolved.nomeCadastrado || user?.user_metadata?.full_name || '');
      setTipoSolicitado(autoResolved.tipoUsuario);
      setEjId(autoResolved.ejId || '');
    }
  }, [profile, user, autoResolved, navigate]);

  const needsEj = ['professor_orientador', 'diretor_ej', 'membro_ej'].includes(tipoSolicitado);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!nome.trim() || !tipoSolicitado) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha seu nome e o tipo de acesso.',
        variant: 'destructive',
      });
      return;
    }
    if (needsEj && !ejId) {
      toast({
        title: 'Selecione sua EJ',
        description: 'Este perfil exige vínculo com uma Empresa Júnior.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    const finalEjId = needsEj ? ejId : autoResolved.ejId || null;

    const { error } = await supabase
      .from('profiles')
      .update({
        nome: nome.trim(),
        tipo_solicitado: tipoSolicitado,
        ej_id: finalEjId,
      })
      .eq('id', user.id);

    // Registra o vínculo automático da conta com os dados cadastrados do e-mail
    if (user.email) {
      saveStoredAccountLink({
        userId: user.id,
        email: user.email,
        tipoUsuario: (tipoSolicitado as any) || autoResolved.tipoUsuario,
        nome: nome.trim(),
        guilda: autoResolved.guilda,
        cargo: autoResolved.cargo,
        membroId: autoResolved.membroId,
        ejId: finalEjId,
        allowedEjIds:
          autoResolved.allowedEjIds.length > 0
            ? autoResolved.allowedEjIds
            : finalEjId
            ? [finalEjId]
            : [],
        linkedAt: new Date().toISOString(),
      });
    }

    setSubmitting(false);

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      return;
    }

    await refreshProfile();
    toast({
      title: 'Solicitação enviada e vinculada!',
      description: autoResolved.matched
        ? `Sua conta foi vinculada automaticamente ao cadastro (${autoResolved.resumoVinculo}). Aguarde aprovação do ADM.`
        : 'Um administrador irá analisar seu pedido de acesso.',
    });
    navigate('/', { replace: true });
  };

  const ejsOrdenadas = [...DDR_EMPRESAS_JUNIORES].sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg shadow-xl border-border/60">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <img src={logoHeader} alt="RioJunior" className="h-14 w-auto object-contain" />
          </div>
          <CardTitle className="text-xl font-bold">Complete seu cadastro</CardTitle>
          <CardDescription>
            Informe seu vínculo com o Movimento Empresa Júnior para solicitar acesso ao painel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {autoResolved.matched && (
            <div className="mb-4 p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Cadastro prévio identificado pelo seu e-mail!</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                O e-mail <strong>{autoResolved.email}</strong> já consta na base oficial da RioJunior. Ao solicitar e ser aprovado, sua conta ficará vinculada automaticamente a:
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Badge className="bg-emerald-600 text-white text-[11px] gap-1">
                  <Sparkles className="h-3 w-3" />
                  {autoResolved.resumoVinculo}
                </Badge>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail da solicitação</Label>
              <Input id="email" value={user?.email ?? ''} disabled className="bg-muted/40" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Qual é a sua relação com a RioJunior? *</Label>
              <Select value={tipoSolicitado} onValueChange={setTipoSolicitado}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPOS_USUARIO).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {needsEj && (
              <div className="space-y-2">
                <Label htmlFor="ej">Empresa Júnior vinculada *</Label>
                <Select value={ejId} onValueChange={setEjId}>
                  <SelectTrigger id="ej">
                    <SelectValue placeholder="Selecione sua EJ" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {ejsOrdenadas.map((ej) => (
                      <SelectItem key={ej.id} value={ej.id}>
                        {ej.nome} {ej.ies ? `— ${ej.ies}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" /> Sair
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  'Solicitar acesso e vincular conta'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
