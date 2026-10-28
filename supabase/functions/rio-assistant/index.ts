import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { streamText, convertToModelMessages, validateUIMessages, tool, stepCountIs, hasToolCall, type UIMessage } from 'npm:ai@7.0.154';
import { z } from 'npm:zod@3.25.76';
import { createLovableAiGatewayProvider } from '../_shared/gateway-helpers.ts';

const bodySchema = z.object({ 
  messages: z.array(z.unknown()).min(1), 
  context: z.object({ 
    section: z.string().max(100), 
    year: z.number().int(), 
    visible: z.string().max(60000), 
    banks: z.array(z.string().max(100)).max(100) 
  }) 
});

const movement = z.object({ 
  data: z.string(), 
  descricao: z.string().min(1).max(500), 
  valor: z.number().positive(), 
  tipo: z.enum(['Receita', 'Despesa']), 
  banco: z.string().max(100), 
  documento: z.string().nullable().optional() 
});

// Send only recent, compact history to the model; the full history stays stored.
const forModel = (messages: UIMessage[]): UIMessage[] => {
  const recent = messages.slice(-12);
  const firstUser = recent.findIndex(message => message.role === 'user');
  return recent.slice(Math.max(firstUser, 0)).map((message, index, list) => index === list.length - 1 ? message : ({
    ...message,
    parts: message.parts.map(part => part.type === 'text' && part.text.length > 4000 ? { ...part, text: part.text.slice(0, 4000) + '\n[…conteúdo anterior resumido…]' } : part).filter(part => part.type !== 'file'),
  })).filter(message => message.parts.some(part => part.type === 'text' || part.type.startsWith('tool-')));
};

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const fail = (message: string, status: number) => new Response(JSON.stringify({ error: message }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const authorization = req.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) return fail('Entre na sua conta para usar o assistente.', 401);
    
    const client = createClient(
      Deno.env.get('SUPABASE_URL') ?? '', 
      Deno.env.get('SUPABASE_ANON_KEY') ?? '', 
      { global: { headers: { Authorization: authorization } }, auth: { persistSession: false, autoRefreshToken: false } }
    );
    
    const { data: claims, error: claimsError } = await client.auth.getClaims(authorization.slice(7));
    const userId = claims?.claims?.sub;
    if (claimsError || !userId) return fail('Sua sessão expirou. Entre novamente.', 401);
    
    const { data: profile, error: profileError } = await client.from('profiles').select('status').eq('id', userId).maybeSingle();
    if (profileError || profile?.status !== 'aprovado') return fail('Seu acesso precisa ser aprovado.', 403);
    
    const raw = await req.text();
    if (raw.length > 15000000) return fail('O arquivo é muito grande para esta conversa.', 400);
    
    const parsed = bodySchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return fail('Mensagem ou dados da página inválidos.', 400);
    
    const { context } = parsed.data;
    const submitted = await validateUIMessages({ messages: parsed.data.messages });
    const last = submitted.at(-1);
    if (!last || last.role !== 'user') return fail('Envie uma nova mensagem para o assistente.', 400);
    
    for (const part of last.parts) {
      if (part.type === 'file' && (!part.url.startsWith('data:') || !['application/pdf', 'image/png', 'image/jpeg', 'image/webp'].includes(part.mediaType))) {
        return fail('Anexe PDF, imagem ou envie planilhas como texto.', 400);
      }
    }
    
    const { data: stored, error: readError } = await client.from('ai_conversations').select('*').eq('user_id', userId).maybeSingle();
    if (readError) return fail('Não foi possível carregar seu histórico.', 500);
    if (stored?.paused_reason) return fail(stored.paused_reason, 403);
    
    const previous = Array.isArray(stored?.messages) && stored.messages.length ? await validateUIMessages({ messages: stored.messages }) : [];
    const complete = (message: UIMessage): UIMessage => ({ ...message, parts: message.parts.filter(part => !part.type.startsWith('tool-') || ('state' in part && (part.state === 'output-available' || part.state === 'output-error'))) });
    const messages: UIMessage[] = [...previous.filter(message => message.id !== last.id), last].map(complete).filter(message => message.parts.length > 0);
    
    const { error: saveError } = await client.from('ai_conversations').upsert({ user_id: userId, messages, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (saveError) return fail('Não foi possível salvar sua mensagem.', 500);

    // Suporte prioritário para API Key do Gemini do usuário (Google AI Studio / Gemini Pro)
    const userGeminiKey = req.headers.get('x-gemini-api-key') || Deno.env.get('GEMINI_API_KEY');
    const userGeminiModel = req.headers.get('x-gemini-model') || 'gemini-2.0-flash';
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');

    if (!userGeminiKey && !lovableKey) {
      return fail('O assistente ainda não está configurado. Conecte sua chave do Gemini Pro nas configurações.', 401);
    }

    let upstreamFailure: { status: number; message: string } | undefined;
    let markFirstResponse: () => void = () => {};
    const firstResponse = new Promise<void>(resolve => { markFirstResponse = resolve; });
    const timeout = AbortSignal.timeout(120000);
    const abortSignal = AbortSignal.any([req.signal, timeout]);

    const { createOpenAICompatible } = await import('npm:@ai-sdk/openai-compatible@3.0.79');
    let modelInstance: any;

    if (userGeminiKey) {
      // Conexão direta com Google AI Studio (Gemini Pro) via endpoint oficial OpenAI-compatible
      const geminiDirect = createOpenAICompatible({
        name: 'google-gemini',
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        headers: {
          'Authorization': Bearer ,
        },
        fetch: async (input, init) => {
          try {
            const response = await fetch(input, init);
            if (!response.ok) {
              const payload = await response.clone().json().catch(() => ({}));
              const message = payload.error?.message || payload.message || 'Falha na resposta da API Google Gemini.';
              upstreamFailure = { status: response.status, message };
            }
            return response;
          } finally {
            markFirstResponse();
          }
        }
      });
      modelInstance = geminiDirect(userGeminiModel);
    } else {
      // Fallback para Lovable AI Gateway
      const gateway = createLovableAiGatewayProvider(lovableKey!, undefined, { baseURL: 'https://ai.gateway.lovable.dev/v1' });
      const provider = createOpenAICompatible({ 
        name: 'lovable', 
        baseURL: 'https://ai.gateway.lovable.dev/v1', 
        headers: { 'Lovable-API-Key': lovableKey!, 'X-Lovable-AIG-SDK': 'vercel-ai-sdk' }, 
        fetch: async (input, init) => {
          try {
            const response = await gateway.fetch(input, init);
            if (!response.ok) {
              const payload = await response.clone().json().catch(() => ({}));
              const message = payload.message ?? payload.error?.message ?? 'Não foi possível obter uma resposta do assistente.';
              upstreamFailure = { status: response.status, message };
              if (response.status === 403 || response.status === 402) {
                const { error } = await client.from('ai_conversations').update({ paused_reason: message }).eq('user_id', userId);
                if (error) console.error('Could not persist assistant pause');
              }
            }
            return response;
          } finally {
            markFirstResponse();
          }
        } 
      });
      modelInstance = provider('google/gemini-3.8-flash');
    }

    const systemPrompt = Você é o assistente oficial de gestão estratégica e financeira da RioJunior.
Responda em português, com análises objetivas e recomendações práticas para a diretoria. Use os dados fornecidos. Contexto atual: seção , ano .
Bancos cadastrados no sistema: .

REGRA FUNDAMENTAL PARA EXTRATOS BANCÁRIOS:
Sempre que o usuário enviar ou mencionar um extrato bancário, planilha financeira, arquivo com movimentações ou linhas de débito/crédito (CSV, XLSX, OFX, TXT ou PDF):
1. Extraia todos os lançamentos reais (data, descrição, valor positivo, se é Receita para entrada ou Despesa para saída, e o banco).
2. Ignore linhas de 'saldo anterior', 'saldo do dia' ou resumos de saldo.
3. ACIONE OBRIGATORIAMENTE a ferramenta 'propor_importacao' com a lista dos lançamentos para que o usuário possa confirmar e o Caixa da RioJunior seja atualizado.
NÃO responda apenas com texto livre se houver transações de extrato para importar.

<conteudo_visivel_da_pagina>

</conteudo_visivel_da_pagina>;

    const result = streamText({
      model: modelInstance,
      system: systemPrompt,
      messages: await convertToModelMessages(forModel(messages), { ignoreIncompleteToolCalls: true }),
      providerOptions: { lovable: { reasoningEffort: 'low' } },
      abortSignal,
      maxRetries: 0,
      stopWhen: [hasToolCall('propor_importacao'), stepCountIs(1)],
      onError: ({ error }) => { 
        console.error('Assistant stream error', error instanceof Error ? ${error.name}:  : 'UnknownError'); 
        markFirstResponse(); 
      },
      tools: {
        propor_importacao: tool({ 
          description: 'Prepara lançamentos de um extrato para conferência e importação no Caixa da RioJunior.', 
          inputSchema: z.object({ 
            lancamentos: z.array(movement).min(1).max(1000) 
          }), 
          execute: async ({ lancamentos }) => {
            const normalized = lancamentos.map(item => {
              // Normaliza a data
              let dateStr = item.data.trim();
              if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
                const [d, m, y] = dateStr.split('/');
                dateStr = ${y}--;
              }
              // Normaliza o banco para um dos bancos disponíveis
              let bankName = (item.banco || '').trim();
              const bLower = bankName.toLowerCase();
              let matched = context.banks.find(b => bLower.includes(b.toLowerCase()) || b.toLowerCase().includes(bLower));
              if (!matched) {
                if (bLower.includes('cora')) matched = 'Cora';
                else if (bLower.includes('asaas')) matched = 'Asaas';
                else if (bLower.includes('pagbank') || bLower.includes('pagseguro')) matched = 'PagBank';
                else if (bLower.includes('brasil') || bLower.includes('bb')) matched = 'Banco do Brasil';
                else if (bLower.includes('bradesco')) matched = 'Bradesco';
                else matched = context.banks[0] || 'Cora';
              }
              return {
                ...item,
                data: dateStr,
                banco: matched
              };
            });
            return { 
              lancamentos: normalized, 
              status: 'aguardando_revisao', 
              aviso: 'Lançamentos extraídos e preparados para conferência e atualização do Caixa.' 
            };
          } 
        }),
      },
    });

    const response = result.toUIMessageStreamResponse({ 
      headers: corsHeaders, 
      originalMessages: messages, 
      sendReasoning: true, 
      onError: () => timeout.aborted ? 'O assistente demorou demais para responder. Tente uma pergunta mais curta ou um arquivo menor.' : upstreamFailure?.message ?? 'Não foi possível concluir a resposta. Sua mensagem foi preservada.', 
      onFinish: async ({ messages: complete }) => {
        const { error } = await client.from('ai_conversations').update({ 
          messages: complete.map(complete2 => ({ 
            ...complete2, 
            parts: complete2.parts.filter(part => !part.type.startsWith('tool-') || ('state' in part && (part.state === 'output-available' || part.state === 'output-error'))) 
          })), 
          updated_at: new Date().toISOString() 
        }).eq('user_id', userId);
        if (error) console.error('Could not save assistant reply');
      } 
    });

    await Promise.race([firstResponse, new Promise(resolve => setTimeout(resolve, 20000))]);
    if (upstreamFailure) {
      await response.body?.cancel().catch(() => {});
      return fail(upstreamFailure.message, upstreamFailure.status);
    }
    return response;
  } catch (error) {
    if (req.signal.aborted) return fail('Resposta interrompida.', 499);
    console.error('Assistant request failed', error instanceof Error ? error.name : 'UnknownError');
    return fail('Não foi possível processar esta mensagem. Confira o arquivo ou verifique a conexão com a API do Gemini.', 400);
  }
});
