import { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isToolUIPart, type UIMessage } from 'ai';
import { MessageCircle, Paperclip, X, Compass, Mic, MicOff } from 'lucide-react';
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
import { ImportReview } from './ImportReview';

export default function RioAssistant({ section, year }: { section: string; year: number }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<UIMessage[] | null>(null);
  const [loadError, setLoadError] = useState('');
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
  return <>
    <Button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-30 shadow-lg gap-2" aria-label="Abrir assistente Gemini"><MessageCircle />Assistente</Button>
    {open && <aside data-assistant-panel role="dialog" aria-label="Assistente RioJunior" className="fixed z-40 right-0 top-0 h-[100dvh] w-full sm:w-[460px] bg-card text-card-foreground border-l border-border shadow-xl flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-border shrink-0"><div className="flex gap-3 items-center"><span className="h-10 w-10 grid place-items-center bg-primary text-primary-foreground rounded-md font-bold">RJ</span><div><h2 className="font-bold">Assistente RioJunior</h2><p className="text-xs text-muted-foreground">Gemini · {year}</p></div></div><Button size="icon" variant="ghost" aria-label="Fechar assistente" onClick={() => setOpen(false)}><X /></Button></header>
      {loadError ? <p role="alert" className="p-4 text-destructive">{loadError}</p> : history && user ? <ChatWindow key={user.id} initial={history} section={section} year={year} onHistoryChange={setHistory} /> : <div className="p-4"><Shimmer>Carregando histórico…</Shimmer></div>}
    </aside>}
  </>;
}

function ChatWindow({ initial, section, year, onHistoryChange }: { initial: UIMessage[]; section: string; year: number; onHistoryChange: (messages: UIMessage[]) => void }) {
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
  const transport = useMemo(() => new DefaultChatTransport({
    api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rio-assistant`,
    fetch: async (input, init) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Entre novamente para usar o assistente.');
      const headers = new Headers(init?.headers);
      headers.set('apikey', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
      headers.set('Authorization', `Bearer ${session.access_token}`);
      const response = await fetch(input, { ...init, headers });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Não foi possível conversar com o assistente.');
      }
      return response;
    },
  }), []);
  const { messages, sendMessage, status, stop } = useChat({ messages: initial, transport, onError: error => setError(error.message), onFinish: () => textarea.current?.focus() });
  const busy = status === 'submitted' || status === 'streaming';
  useEffect(() => { onHistoryChange(messages); }, [messages, onHistoryChange]);
  useEffect(() => { textarea.current?.focus(); }, []);
  async function send(text: string) {
    if (busy || (!text.trim() && !attachment)) return;
    setError('');
    try {
      let fileParts: { type: 'file'; url: string; mediaType: string; filename: string }[] = [];
      let fullText = text;
      if (attachment) {
        if (!attachment.size || attachment.size > 5 * 1024 * 1024) throw new Error('Envie um arquivo não vazio de até 5 MB.');
        const extension = attachment.name.split('.').slice(-1)[0]?.toLowerCase();
        if (extension === 'xlsx' || extension === 'xls') {
          const workbook = XLSX.read(await attachment.arrayBuffer(), { type: 'array' });
          fullText += `\nArquivo ${attachment.name}:\n` + workbook.SheetNames.map(name => `${name}\n${XLSX.utils.sheet_to_csv(workbook.Sheets[name])}`).join('\n');
        } else if (['csv', 'ofx', 'txt'].includes(extension ?? '')) fullText += `\nArquivo ${attachment.name}:\n${await attachment.text()}`;
        else if (['application/pdf', 'image/png', 'image/jpeg', 'image/webp'].includes(attachment.type)) {
          const url = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(attachment); });
          fileParts = [{ type: 'file', url, mediaType: attachment.type, filename: attachment.name }];
        } else throw new Error('Envie PDF, imagem, Excel, CSV, OFX ou TXT.');
      }
      if (fullText.length > 200000) throw new Error('Divida o extrato em arquivos menores.');
      const context = { section, year, visible: readVisiblePage(), banks: movimentacoesService.getTaxonomy().contas };
      const parts = [{ type: 'text' as const, text: fullText || 'Analise o arquivo anexado.' }, ...fileParts];
      setDraft(''); setAttachment(null);
      await sendMessage({ parts }, { body: { context } });
      textarea.current?.focus();
    } catch (error) { setDraft(text); setError(error instanceof Error ? error.message : 'Não foi possível enviar o arquivo.'); }
  }
  return <>
    <Conversation className="min-h-0"><ConversationContent className="gap-5">
      {!messages.length && <div className="py-10 text-center space-y-3"><p className="text-lg font-bold">Olá, vamos olhar os dados?</p><p className="text-sm text-muted-foreground">RioJunior</p></div>}
      {messages.map(message => <Message key={message.id} from={message.role}><MessageContent className={message.role === 'user' ? 'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground' : ''}>
        {message.parts.map((part, index) => {
          if (part.type === 'text') return <MessageResponse key={index}>{part.text}</MessageResponse>;
          if (part.type === 'file') return <span key={index} className="text-xs">{part.filename ?? 'Arquivo anexado'}</span>;
          if (part.type === 'reasoning') return <details key={index} className="text-xs text-muted-foreground"><summary>Análise</summary><MessageResponse>{part.text}</MessageResponse></details>;
          if (isToolUIPart(part)) {
            const title = part.type === 'tool-propor_importacao' ? 'Preparar extrato' : 'Analisar página';
            const output = 'output' in part ? part.output : undefined;
            const proposals = output && typeof output === 'object' && 'lancamentos' in output ? output.lancamentos : undefined;
            return <div key={index}><Tool defaultOpen={false}><ToolHeader type="dynamic-tool" toolName={title} state={part.state} title={title} /><ToolContent><ToolOutput output={proposals ? 'Extrato preparado para revisão. Nenhum lançamento alterado.' : output ? 'Dados da página consultados.' : undefined} errorText={'errorText' in part ? part.errorText : undefined} /></ToolContent></Tool>{proposals && <ImportReview value={proposals} />}</div>;
          }
          return null;
        })}
      </MessageContent></Message>)}
      {status === 'submitted' && <Shimmer>Analisando…</Shimmer>}
    </ConversationContent><ConversationScrollButton /></Conversation>
    <div className="p-4 border-t border-border shrink-0 space-y-3">
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={busy} onClick={() => send('Analise os dados visíveis nesta página e destaque prioridades, riscos e próximos passos.')}><Compass size={14} />Analisar página</Button><span className="text-xs text-muted-foreground truncate">{section}</span></div>
      {attachment && <div className="flex items-center justify-between text-xs"><span className="truncate">{attachment.name}</span><Button size="icon-sm" variant="ghost" aria-label="Remover anexo" onClick={() => setAttachment(null)}><X /></Button></div>}
      <input type="file" ref={fileInput} aria-label="Anexar arquivo ao assistente" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.ofx,.csv,.txt" onChange={event => setAttachment(event.target.files?.[0] ?? null)} />
      <PromptInput onSubmit={() => send(draft)}><PromptInputTextarea ref={textarea} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Pergunte sobre esta página ou envie um extrato…" className="min-h-24" /><PromptInputFooter className="justify-between"><div className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Anexar extrato ou arquivo" disabled={busy} onClick={() => fileInput.current?.click()}>
              <Paperclip />
            </Button>
            <Button 
              type="button" 
              variant={isRecording ? 'destructive' : 'ghost'} 
              size="icon-sm" 
              aria-label={isRecording ? 'Parar gravação de áudio' : 'Falar por áudio'} 
              disabled={busy} 
              onClick={toggleRecording}
              className={isRecording ? 'animate-pulse text-white' : ''}
              title={isRecording ? 'Ouvindo... Clique para pausar' : 'Falar por áudio (Voz para texto)'}
            >
              {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
            </Button>
            {isRecording && <span className="text-[10px] text-red-500 font-semibold animate-pulse">Ouvindo…</span>}
          </div><PromptInputSubmit status={status} onStop={stop} disabled={!busy && !draft.trim() && !attachment} aria-label={busy ? 'Interromper resposta' : 'Enviar mensagem'} /></PromptInputFooter></PromptInput>
    </div>
  </>;
}