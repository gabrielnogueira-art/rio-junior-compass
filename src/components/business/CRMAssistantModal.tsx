import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Mic, MicOff, Check, ArrowRight, Building2, 
  DollarSign, Calendar, AlertCircle, FileText, RefreshCw, X, Play
} from 'lucide-react';
import { CRMCard, CRMFase, AIParsedMeeting } from '@/types/crm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CRMAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  fases: CRMFase[];
  cards: CRMCard[];
  onParse: (text: string) => AIParsedMeeting;
  onCreateCard: (card: Partial<CRMCard> & { titulo: string; faseId: string }) => CRMCard;
  onUpdateCard: (id: string, updates: Partial<CRMCard>) => void;
  onMoveCard: (id: string, novaFaseId: string) => void;
}

export const CRMAssistantModal = ({
  isOpen,
  onClose,
  fases,
  cards,
  onParse,
  onCreateCard,
  onUpdateCard,
  onMoveCard
}: CRMAssistantModalProps) => {
  const [meetingText, setMeetingText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [analyzedResult, setAnalyzedResult] = useState<AIParsedMeeting | null>(null);
  const [selectedAction, setSelectedAction] = useState<'criar_novo' | 'atualizar_existente'>('criar_novo');
  const [targetCardId, setTargetCardId] = useState<string>('');
  const [targetFaseId, setTargetFaseId] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Check speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
    }
  }, []);

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz direto. Digite ou cole o texto da reunião.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds(s => s + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setMeetingText(transcript);
      };

      recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        stopRecording();
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const handleAnalyze = () => {
    if (!meetingText.trim()) return;
    const res = onParse(meetingText);
    setAnalyzedResult(res);
    setSelectedAction(res.acaoSugerida);
    setTargetFaseId(res.faseSugerida);
    if (res.cardExistenteId) {
      setTargetCardId(res.cardExistenteId);
    } else if (cards.length > 0) {
      setTargetCardId(cards[0].id);
    }
  };

  const handleApply = () => {
    if (!analyzedResult) return;

    if (selectedAction === 'criar_novo') {
      const novaFase = targetFaseId || analyzedResult.faseSugerida;
      onCreateCard({
        titulo: analyzedResult.parceiroNome || 'Novo Parceiro',
        faseId: novaFase,
        responsavelNome: analyzedResult.responsavel || 'Rian Mendes',
        etiquetas: [
          analyzedResult.temperatura,
          analyzedResult.segmento || 'Produtos/Serviços',
          analyzedResult.origem || 'Relacionamento do ano anterior'
        ],
        valores: {
          dores_identificadas: analyzedResult.doresIdentificadas,
          formato_participacao: analyzedResult.formatoProposta,
          valor_proposta: analyzedResult.valorProposta,
          observacoes: meetingText,
          cota_parceiro: analyzedResult.valorProposta,
          contraproposta_parceiro: analyzedResult.contraproposta
        }
      });
    } else {
      // Atualizar parceiro existente
      if (!targetCardId) return;
      const targetCard = cards.find(c => c.id === targetCardId);
      if (!targetCard) return;

      const updatedValores = {
        ...targetCard.valores,
        dores_identificadas: analyzedResult.doresIdentificadas || targetCard.valores?.dores_identificadas,
        formato_participacao: analyzedResult.formatoProposta || targetCard.valores?.formato_participacao,
        valor_proposta: analyzedResult.valorProposta || targetCard.valores?.valor_proposta,
        contraproposta_parceiro: analyzedResult.contraproposta || targetCard.valores?.contraproposta_parceiro,
        observacoes: (targetCard.valores?.observacoes ? targetCard.valores.observacoes + '\n\n' : '') + meetingText
      };

      onUpdateCard(targetCardId, {
        valores: updatedValores,
        etiquetas: Array.from(new Set([...(targetCard.etiquetas || []), analyzedResult.temperatura]))
      });

      if (targetFaseId && targetFaseId !== targetCard.faseId) {
        onMoveCard(targetCardId, targetFaseId);
      }
    }

    // Reset and close
    setMeetingText('');
    setAnalyzedResult(null);
    onClose();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const fillSample = (tipo: 'rd' | 'ap' | 'fechamento') => {
    if (tipo === 'rd') {
      setMeetingText(
        `Reunião de Diagnóstico (RD) realizada com a Ambev nesta manhã. Conversamos com a gerente de talentos Júlia. A dor principal deles é atração de universitários nas áreas de engenharia e tecnologia para o programa de estágio. Estão dispostos a investir em torno de 20 mil reais em cotas de patrocínio e palestra magna no evento de Formação Empreendedora. Temperatura do lead: muito quente! Próximo passo: agendar Apresentação de Proposta (AP) para o dia 15 de maio.`
      );
    } else if (tipo === 'ap') {
      setMeetingText(
        `Apresentação de Proposta (AP) realizada com a Falconi. Apresentamos a Cota Parceiro no valor de R$ 30.000,00 com stand e momento de palco no EFEJ. O diretor gostou bastante, mas fez uma contraproposta pedindo desconto de 10% ou inclusão de 2 workshops exclusivos com as EJs de cluster 4 e 5. Alinhar com a equipe jurídica e enviar minuta até sexta-feira.`
      );
    } else {
      setMeetingText(
        `Alinhamento final com a Stone: Contrato assinado e parceria fechada no valor de R$ 25.000,00! Eles confirmaram a presença no evento e o comprovante da primeira parcela já foi emitido. Adicionar aos parceiros confirmados e alocar pauta na grade de conteúdo.`
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background text-foreground border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center">
              <Sparkles size={18} />
            </span>
            <span>Inserir via IA — Transcrição ou Resumo de Reunião</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Cole a ata/transcrição da reunião comercial ou grave o áudio do que foi conversado. A IA criará ou atualizará o card no CRM Pipefy automaticamente.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Quick sample chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-muted-foreground text-[11px] font-medium">Exemplos rápidos:</span>
            <Button variant="outline" size="sm" className="h-6 text-[11px] py-0" onClick={() => fillSample('rd')}>
              Exemplo RD (Ambev)
            </Button>
            <Button variant="outline" size="sm" className="h-6 text-[11px] py-0" onClick={() => fillSample('ap')}>
              Exemplo AP (Falconi)
            </Button>
            <Button variant="outline" size="sm" className="h-6 text-[11px] py-0" onClick={() => fillSample('fechamento')}>
              Exemplo Fechamento (Stone)
            </Button>
          </div>

          {/* Text Area & Audio controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Resumo, Transcrição ou Áudio da Reunião</Label>
              {isRecording ? (
                <div className="flex items-center gap-2">
                  <span className="animate-pulse h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="text-xs font-mono text-red-500 font-bold">
                    Gravando ({formatTime(recordingSeconds)})
                  </span>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="h-7 text-xs gap-1"
                    onClick={stopRecording}
                  >
                    <MicOff size={13} /> Parar Gravação
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                  onClick={startRecording}
                >
                  <Mic size={13} /> Gravar Áudio da Reunião
                </Button>
              )}
            </div>

            <Textarea 
              rows={5}
              placeholder="Ex: Reunião com Ambev realizada hoje. Conversamos com a diretoria de inovação, o interesse principal é a cota de 25k para o EFEJ 2026. Próximo passo é enviar a proposta detalhada até dia 20..."
              value={meetingText}
              onChange={e => setMeetingText(e.target.value)}
              className="text-xs bg-card leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleAnalyze} 
              disabled={!meetingText.trim()}
              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow"
            >
              <Sparkles size={16} /> Analisar com IA
            </Button>
          </div>

          {/* AI Analysis Preview Box */}
          {analyzedResult && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-4 animate-in fade-in-50">
              <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground text-xs font-bold">
                    Diagnóstico IA
                  </Badge>
                  <span className="text-xs font-bold text-foreground">
                    Parceiro: {analyzedResult.parceiroNome}
                  </span>
                </div>
                <Badge variant="outline" className={`text-xs ${
                  analyzedResult.temperatura === 'Quente' ? 'text-red-500 border-red-300' :
                  analyzedResult.temperatura === 'Morno' ? 'text-amber-500 border-amber-300' : 'text-blue-500 border-blue-300'
                }`}>
                  Lead {analyzedResult.temperatura}
                </Badge>
              </div>

              {/* Action Selector: Criar Novo ou Atualizar Existente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Ação no CRM</Label>
                  <Select value={selectedAction} onValueChange={(v: any) => setSelectedAction(v)}>
                    <SelectTrigger className="h-8 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="criar_novo">Criar Novo Card de Parceiro</SelectItem>
                      <SelectItem value="atualizar_existente">Atualizar Parceiro Existente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedAction === 'atualizar_existente' ? (
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Selecione o Parceiro Existente</Label>
                    <Select value={targetCardId} onValueChange={setTargetCardId}>
                      <SelectTrigger className="h-8 text-xs bg-card">
                        <SelectValue placeholder="Selecione o card" />
                      </SelectTrigger>
                      <SelectContent>
                        {cards.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.titulo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Nome da Empresa</Label>
                    <Input 
                      value={analyzedResult.parceiroNome} 
                      onChange={e => setAnalyzedResult({ ...analyzedResult, parceiroNome: e.target.value })}
                      className="h-8 text-xs bg-card" 
                    />
                  </div>
                )}
              </div>

              {/* Fase de Destino Sugerida */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Fase no Pipeline (Kanban)</Label>
                <Select value={targetFaseId} onValueChange={setTargetFaseId}>
                  <SelectTrigger className="h-8 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fases.map(f => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Structured Extracted Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg border border-border bg-card/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Dores Identificadas</span>
                  <p className="text-foreground leading-relaxed">{analyzedResult.doresIdentificadas || 'N/A'}</p>
                </div>

                <div className="p-2.5 rounded-lg border border-border bg-card/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Formato & Cota Proposta</span>
                  <p className="text-foreground leading-relaxed">{analyzedResult.formatoProposta || 'N/A'}</p>
                  {analyzedResult.valorProposta && (
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      R$ {analyzedResult.valorProposta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </div>

                <div className="p-2.5 rounded-lg border border-border bg-card/60 space-y-1 md:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Próximos Passos & Follow-up</span>
                  <p className="text-foreground leading-relaxed">{analyzedResult.proximosPassos || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            disabled={!analyzedResult}
            onClick={handleApply}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Check size={16} /> Aplicar no CRM
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
