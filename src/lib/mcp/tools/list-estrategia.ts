import { defineTool } from '@lovable.dev/mcp-js';
import { z } from 'zod';
import { supabaseForUser } from '../supabase';

export default defineTool({
  name: 'list_estrategia',
  title: 'Consultar OKRs e ciclos',
  description: 'Consulta as OKRs estratégicas e os ciclos de um ano para o usuário aprovado, até 100 registros por grupo.',
  inputSchema: { ano: z.number().int().min(1).max(9998).describe('Ano das OKRs e dos ciclos.') },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ ano }, ctx) => {
    const client = await supabaseForUser(ctx);
    const [okrs, ciclos] = await Promise.all([
      client.from('okrs_estrategicas').select('id,titulo,descricao,ano').eq('ano', ano).order('id').limit(100),
      client.from('ciclos').select('id,nome,tipo,numero,ano,data_inicio,data_fim').eq('ano', ano).order('numero').limit(100),
    ]);
    if (okrs.error || ciclos.error) return { isError: true, content: [{ type: 'text', text: 'Não foi possível consultar a estratégia.' }] };
    const result = { okrs: okrs.data ?? [], ciclos: ciclos.data ?? [] };
    return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
  },
});