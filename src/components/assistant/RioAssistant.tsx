import { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isToolUIPart, type UIMessage } from 'ai';
import { MessageCircle, Paperclip, X, Compass, Mic, MicOff, Sparkles, Settings2, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { Tool, ToolHeader, ToolContent, ToolOutput } from '@/components/ai-elements/tool';
import { readVisiblePage } from '@/lib/assistant-context';
import { movimentacoesService } from '@/services/movimentacoesService';
import { BankStatementService } from '@/services/bankStatementService';
import { geminiSettingsService } from '@/services/geminiSettingsService';
import { ImportReview } from './ImportReview';
import { GeminiConfigModal } from './GeminiConfigModal';

export default function RioAssistant({ section, year }: { section: string; year: number }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<UIMessage[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(geminiSettingsService.hasCustomKey());

  useEffect(() => {
    const handleConfigChange = () => {
      setHasCustomKey(geminiSettingsService.hasCustomKey());
    };
    window.addEventListener('rio-gemini-config-changed', handleConfigChange);
    return () => window.removeEventListener('rio-gemini-config-changed', handleConfigChange);
  }, []);

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase.from('ai_conversations').select('messages').eq('user_id', user.id).maybeSingle().then(({ data, error }) => {
      if (!active) return;
      if (error) setLoadError('Não foi possível carregar seu histórico.');
      else setHistory(Array.isArray(data?.messages) ? data.messages as unknown as UIMessage[] : []);
    });
    return () => { active = false; };
  }, [user]);

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="fixed bottom-6 right-6 z-30 shadow-lg gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" 
        aria-label="Abrir assistente Gemini"
      >
        <Sparkles size={17} className="animate-pulse text-amber-300" />
        Assistente Gemini
      </Button>

      {open && (
        <aside 
          data-assistant-panel 
          role="dialog" 
          aria-label="Assistente RioJunior" 
          className="fixed z-40 right-0 top-0 h-[100dvh] w-full sm:w-[490px] bg-card text-card-foreground border-l border-border shadow-2xl flex flex-col"
        >
          {/* Header */}
          <header className="flex items-center justify-between p-3.5 border-b border-border bg-card/80 backdrop-blur shrink-0">
            <div className="flex gap-2.5 items-center">
              <span className="h-9 w-9 grid place-items-center bg-gradient-to-tr from-primary to-blue-600 text-primary-foreground rounded-lg font-bold shadow">
                RJ
              </span>
              <div>
                <h2 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  Assistente RioJunior
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span>Gemini • {year}</span>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setIsGeminiModalOpen(true)}
                    className="hover:underline flex items-center gap-1 font-medium"
                    title="Clique para configurar chave de API do Gemini Pro"
                  >
                    {hasCustomKey ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Gemini Pro (API Direta)
                      </span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        Lovable Gateway
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Configurar conexão Gemini"
                onClick={() => setIsGeminiModalOpen(true)}
                title="Configurações da Conexão Gemini"
              >
                <Settings2 size={16} />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Fechar assistente" 
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
          </header>

          {loadError ? (
            <p role="alert" className="p-4 text-destructive text-sm">{loadError}</p>
          ) : history && user ? (
            <ChatWindow 
              key={user.id} 
              initial={history} 
              section={section} 
              year={year} 
              onHistoryChange={setHistory} 
              onOpenConfig={() => setIsGeminiModalOpen(true)}
            />
          ) : (
            <div className="p-4"><Shimmer>Carregando histórico...</Shimmer></div>
          )}
        </aside>
      )}

      <GeminiConfigModal 
        isOpen={isGeminiModalOpen} 
        onClose={() => setIsGeminiModalOpen(false)} 
      />
    </>
  );
}

function ChatWindow({ 
  initial, 
  section, 
  year, 
  onHistoryChange,
  onOpenConfig 
}: { 
  initial: UIMessage[]; 
  section: string; 
  year: number; 
  onHistoryChange: (messages: UIMessage[]) => void;
  onOpenConfig: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Seu navegador não suporta reconhecimento de voz direto.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        setError('');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setDraft(prev => (prev ? prev + ' ' : '') + transcript.trim());
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error(err);
      setIsRecording(false);
      setError('Não foi possível iniciar o microfone.');
    }
  };

  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [fallbackProposals, setFallbackProposals] = useState<any[] | null>(null);

  const transport = useMemo(() => new DefaultChatTransport({
    api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rio-assistant`,
    fetch: async (input, init) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Entre novamente para usar o assistente.');
      
      const headers = new Headers(init?.headers);
      headers.set('apikey', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
      headers.set('Authorization', `Bearer ${session.access_token}`);

      // Envia a chave do Gemini Pro se configurada pelo usuário
      if (geminiSettingsService.hasCustomKey()) {
        headers.set('x-gemini-api-key', geminiSettingsService.getApiKey());
        headers.set('x-gemini-model', geminiSettingsService.getModel());
      }

      const response = await fetch(input, { ...init, headers });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Não foi possível conversar com o assistente.');
      }
      return response;
    },
  }), []);

  const { messages, sendMessage, status, stop } = useChat({ 
    messages: initial, 
    transport, 
    onError: err => {
      setError(err.message);
    }, 
    onFinish: () => textarea.current?.focus() 
  });

  const busy = status === 'submitted' || status === 'streaming';

  useEffect(() => { 
    onHistoryChange(messages); 
  }, [messages, onHistoryChange]);

  useEffect(() => { 
    textarea.current?.focus(); 
  }, []);

  async function send(text: string) {
    if (busy || (!text.trim() && !attachment)) return;
    setError('');
    setFallbackProposals(null);

    try {
      let fileParts: { type: 'file'; url: string; mediaType: string; filename: string }[] = [];
      let fullText = text;
      let localExtractedTransactions: any[] = [];

      if (attachment) {
        if (!attachment.size || attachment.size > 15 * 1024 * 1024) {
          throw new Error('Envie um arquivo de até 15 MB.');
        }

        const extension = attachment.name.split('.').slice(-1)[0]?.toLowerCase();
        const defaultBank = movimentacoesService.getTaxonomy().contas[0] || 'Cora';
        const existingTxs = movimentacoesService.getAllTransactions();
        const taxonomy = movimentacoesService.getTaxonomy();

        if (extension === 'xlsx' || extension === 'xls') {
          const buffer = await attachment.arrayBuffer();
          // Pré-processamento local de contingência
          try {
            localExtractedTransactions = BankStatementService.parseExcel(buffer, defaultBank, existingTxs, taxonomy);
          } catch (e) {
            console.warn('Local excel parse fallback error:', e);
          }
          const workbook = XLSX.read(buffer, { type: 'array' });
          fullText += `\n[Extrato Bancário Arquivo ${attachment.name}]:\n` + 
            workbook.SheetNames.map(name => `${name}\n${XLSX.utils.sheet_to_csv(workbook.Sheets[name])}`).join('\n');
        } else if (['csv', 'ofx', 'txt'].includes(extension ?? '')) {
          const rawText = await attachment.text();
          try {
            if (extension === 'csv') {
              localExtractedTransactions = BankStatementService.parseCSV(rawText, defaultBank, existingTxs, taxonomy);
            } else if (extension === 'ofx') {
              localExtractedTransactions = BankStatementService.parseOFX(rawText, defaultBank, existingTxs, taxonomy);
            } else if (extension === 'txt') {
              localExtractedTransactions = BankStatementService.parsePastedText(rawText, defaultBank, existingTxs, taxonomy);
            }
          } catch (e) {
            console.warn('Local text parse fallback error:', e);
          }
          fullText += `\n[Extrato Bancário Arquivo ${attachment.name}]:\n${rawText}`;
        } else if (['application/pdf', 'image/png', 'image/jpeg', 'image/webp'].includes(attachment.type)) {
          const url = await new Promise<string>((resolve, reject) => { 
            const reader = new FileReader(); 
            reader.onload = () => resolve(String(reader.result)); 
            reader.onerror = reject; 
            reader.readAsDataURL(attachment); 
          });
          fileParts = [{ type: 'file', url, mediaType: attachment.type, filename: attachment.name }];
        } else {
          throw new Error('Envie PDF, imagem, Excel, CSV, OFX ou TXT.');
        }

        // Se encontrou transações no arquivo, salva para contingência e orienta a IA taxativamente
        if (localExtractedTransactions.length > 0) {
          setFallbackProposals(localExtractedTransactions);
          fullText += `\n\n[INSTRUÇÃO OBRIGATÓRIA]: Foram identificados ${localExtractedTransactions.length} lançamentos neste extrato. Use imediatamente a ferramenta propor_importacao com esses lançamentos para atualização do Caixa da RioJunior.`;
        }
      }

      if (fullText.length > 350000) {
        throw new Error('O arquivo excede o limite de tamanho para envio direto. Divida em períodos menores.');
      }

      const context = { 
        section, 
        year, 
        visible: readVisiblePage(), 
        banks: movimentacoesService.getTaxonomy().contas 
      };

      const parts = [{ type: 'text' as const, text: fullText || 'Analise este extrato bancário e proponha os lançamentos para o caixa.' }, ...fileParts];
      setDraft(''); 
      setAttachment(null);
      
      try {
        await sendMessage({ parts }, { body: { context } });
      } catch (sendErr: any) {
        // Se a chamada remota da IA falhar mas temos transações extraídas localmente do extrato:
        if (localExtractedTransactions.length > 0) {
          setError('A conexão com o servidor de IA oscilou, mas seus lançamentos foram extraídos com sucesso localmente. Revise e confirme abaixo:');
        } else {
          throw sendErr;
        }
      }

      textarea.current?.focus();
    } catch (error) { 
      setDraft(text); 
      setError(error instanceof Error ? error.message : 'Não foi possível enviar o arquivo.'); 
    }
  }

  return (
    <>
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-4 p-4">
          {!messages.length && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-white flex items-center justify-center mx-auto shadow-lg">
                <Sparkles size={24} />
              </div>
              <p className="text-base font-bold">Assistente Financeiro RioJunior</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Envie extratos em <strong>PDF, XLSX, CSV, OFX ou TXT</strong> para atualizar o Caixa, ou faça perguntas sobre as finanças e metas.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenConfig}
                  className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Settings2 size={13} />
                  Configurar chave pessoal do Gemini Pro
                </button>
              </div>
            </div>
          )}

          {messages.map(message => (
            <Message key={message.id} from={message.role}>
              <MessageContent className={message.role === 'user' ? 'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground' : ''}>
                {message.parts.map((part, index) => {
                  if (part.type === 'text') {
                    return <MessageResponse key={index}>{part.text}</MessageResponse>;
                  }
                  if (part.type === 'file') {
                    return (
                      <div key={index} className="flex items-center gap-1.5 text-xs bg-muted/40 p-1.5 rounded border border-border/50">
                        <FileSpreadsheet size={13} className="text-primary" />
                        <span className="truncate">{part.filename ?? 'Arquivo anexado'}</span>
                      </div>
                    );
                  }
                  if (part.type === 'reasoning') {
                    return (
                      <details key={index} className="text-xs text-muted-foreground">
                        <summary>Análise do Assistente</summary>
                        <MessageResponse>{part.text}</MessageResponse>
                      </details>
                    );
                  }
                  if (isToolUIPart(part)) {
                    const title = part.type === 'tool-propor_importacao' ? 'Preparar extrato' : 'Analisar página';
                    const output = 'output' in part ? part.output : undefined;
                    const proposals = output && typeof output === 'object' && 'lancamentos' in output ? output.lancamentos : undefined;
                    return (
                      <div key={index} className="space-y-2">
                        <Tool defaultOpen={false}>
                          <ToolHeader type="dynamic-tool" toolName={title} state={part.state} title={title} />
                          <ToolContent>
                            <ToolOutput 
                              output={proposals ? 'Extrato pronto para conferência e importação no Caixa.' : output ? 'Dados consultados com sucesso.' : undefined} 
                              errorText={'errorText' in part ? part.errorText : undefined} 
                            />
                          </ToolContent>
                        </Tool>
                        {proposals && <ImportReview value={proposals} />}
                      </div>
                    );
                  }
                  return null;
                })}
              </MessageContent>
            </Message>
          ))}

          {/* Contingência Local: Se a IA falhar mas extraímos transações do extrato localmente */}
          {fallbackProposals && fallbackProposals.length > 0 && !messages.some(m => m.parts.some(p => isToolUIPart(p) && p.type === 'tool-propor_importacao')) && (
            <div className="border border-border rounded-xl p-3 bg-card shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 size={15} />
                <span>Extrato extraído e pronto para importação no Caixa:</span>
              </div>
              <ImportReview value={fallbackProposals} />
            </div>
          )}

          {status === 'submitted' && <Shimmer>O Gemini está analisando o extrato...</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input Footer */}
      <div className="p-3.5 border-t border-border bg-card shrink-0 space-y-2.5">
        {error && (
          <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
            {error.includes('gateway') || error.includes('limite') || error.includes('créditos') ? (
              <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={onOpenConfig}>
                Usar Gemini Pro
              </Button>
            ) : null}
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={busy} 
            onClick={() => send('Analise a situação financeira e operacional visível nesta página, destacando prioridades, riscos de caixa e próximos passos recomendados.')}
            className="text-[11px] h-7 gap-1.5"
          >
            <Compass size={13} className="text-primary" />
            Analisar página atual
          </Button>
          <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">{section}</span>
        </div>

        {attachment && (
          <div className="flex items-center justify-between text-xs p-2 rounded-md bg-muted/40 border border-border">
            <div className="flex items-center gap-2 truncate">
              <FileSpreadsheet size={14} className="text-emerald-400 shrink-0" />
              <span className="truncate font-medium">{attachment.name}</span>
              <span className="text-[10px] text-muted-foreground">({(attachment.size / 1024).toFixed(0)} KB)</span>
            </div>
            <Button size="icon" variant="ghost" className="h-6 w-6" aria-label="Remover anexo" onClick={() => setAttachment(null)}>
              <X size={14} />
            </Button>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInput} 
          aria-label="Anexar extrato bancário ou planilha" 
          className="hidden" 
          accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.ofx,.csv,.txt" 
          onChange={event => setAttachment(event.target.files?.[0] ?? null)} 
        />

        <PromptInput onSubmit={() => send(draft)}>
          <PromptInputTextarea 
            ref={textarea} 
            value={draft} 
            onChange={event => setDraft(event.target.value)} 
            placeholder="Anexe seu extrato (PDF, XLSX, CSV, OFX) ou pergunte sobre as finanças..." 
            className="min-h-20 text-xs" 
          />
          <PromptInputFooter className="justify-between items-center">
            <div className="flex items-center gap-1">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Anexar extrato ou arquivo" 
                disabled={busy} 
                onClick={() => fileInput.current?.click()}
                title="Anexar Extrato (PDF, XLSX, CSV, OFX, TXT)"
              >
                <Paperclip size={16} />
              </Button>
              <Button 
                type="button" 
                variant={isRecording ? 'destructive' : 'ghost'} 
                size="icon" 
                className={`h-8 w-8 ${isRecording ? 'animate-pulse text-white' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label={isRecording ? 'Parar gravação de voz' : 'Falar por áudio'} 
                disabled={busy} 
                onClick={toggleRecording}
                title={isRecording ? 'Ouvindo... Clique para parar' : 'Falar por áudio (Voz para texto)'}
              >
                {isRecording ? <MicOff size={15} /> : <Mic size={16} />}
              </Button>
              {isRecording && <span className="text-[10px] text-red-500 font-semibold animate-pulse">Ouvindo...</span>}
            </div>

            <PromptInputSubmit 
              status={status} 
              onStop={stop} 
              disabled={!busy && !draft.trim() && !attachment} 
              aria-label={busy ? 'Interromper resposta' : 'Enviar mensagem'} 
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </>
  );
}
