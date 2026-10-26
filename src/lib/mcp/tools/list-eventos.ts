import { defineTool } from '@lovable.dev/mcp-js';
import { z } from 'zod';
import { supabaseForUser } from '../supabase';

export default defineTool({
  name: 'list_eventos',
  title: 'Consultar calendarização',
  description: 'Consulta até 100 eventos de um ano, respeitando o acesso do usuário aprovado.',
  inputSchema: { ano: z.number().int().min(1).max(9998).describe('Ano dos eventos.'), limite: z.number().int().min(1).max(100).default(50).describe('Quantidade máxima de eventos.') },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ ano, limite }, ctx) => {
    const client = await supabaseForUser(ctx);
    const { data, error } = await client.from('eventos').select('id,nome,data_inicio,data_fim,tipo,pauta,diretorias,momento_palco').gte('data_inicio', `${String(ano).padStart(4, '0')}-01-01`).lt('data_inicio', `${String(ano + 1).padStart(4, '0')}-01-01`).order('data_inicio').limit(limite);
    if (error) return { isError: true, content: [{ type: 'text', text: 'Não foi possível consultar os eventos.' }] };
    return { content: [{ type: 'text', text: JSON.stringify(data ?? []) }], structuredContent: { eventos: data ?? [] } };
  },
});