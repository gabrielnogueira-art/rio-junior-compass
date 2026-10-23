# Plano — Fases 2 a 5 do Roadmap RioJunior

## Fase 2 — DDR: Reconhecimento de EJs com certificado

**Banco de dados:**
- `eventos`: nova coluna `momento_palco` (boolean) — marca eventos da calendarização que têm momento de reconhecimento.
- Nova tabela `certificados`: ej_id, evento_id, indicador (texto), texto_certificado, emitido_em, config_editor (jsonb: tamanho da fonte, rotação, posição dos elementos).
- Nova tabela `assinaturas_certificado`: cargo ('presidente_executivo' | 'diretor_ddr'), nome, url do PNG (storage).
- Bucket de storage `assinaturas` (público) para os PNGs de assinatura.

**Interface (nova aba "Reconhecimento" no DDR):**
- Lista de eventos com `momento_palco = true` (marcável na calendarização).
- Por evento: EJs elegíveis = EJs com todos os indicadores (entregas de documentos do portal BJ) em dia.
- Botão "Gerar certificado" por EJ: gera certificado A4 horizontal (paisagem) com nome da EJ, indicador, texto padrão, assinaturas do Presidente Executivo e Diretor DDR (PNG + nome abaixo).
- Mini-editor: ajustar texto, tamanho da fonte e rotação dos elementos; salvar config por certificado.
- Download/impressão do certificado (impressão em A4 paisagem via CSS print).
- Upload e gestão das assinaturas PNG na própria aba.

## Fase 3 — Operações: Anuidades

**Banco de dados:**
- Tabela `anuidades` já existe (por parcela). Adicionar colunas: `parcela_numero` (int), `total_parcelas` (int), `suporte_anuidade` (boolean — facilitação/redução).

**Interface (nova aba "Anuidades" em Operações):**
- Visão por EJ e ano: valor total, nº de parcelas, parcelas pagas (barra de progresso), flag de suporte.
- Criar anuidade: valor total + nº de parcelas → gera as parcelas automaticamente com vencimentos mensais.
- Marcar parcela como paga (data de pagamento); juros por parcela já existentes na tabela.
- Resumo: total esperado vs. recebido no ano.

## Fase 4 — Interface DDR ↔ OP: Visitas dos Guardiões

**Banco de dados:**
- Nova tabela `visitas_guardioes`: ej_id (solicitante), data, horario, local, motivo, status ('solicitada' | 'aprovada' | 'realizada' | 'cancelada'), gasto (numeric, preenchido por OP), observacoes.

**Interface:**
- Nova aba "Visitas dos Guardiões" no DDR: formulário de solicitação (data, horário, local, motivo) + lista com status e se a visita ocorreu.
- Em Operações: mesma lista com campos de gasto e confirmação de realização (contabiliza gasto).
- RLS: todos os aprovados leem; diretor_ej/membro_ej criam solicitações para a própria EJ; time_riojunior/admin atualizam.

## Fase 5 — PresEx: Acessibilidade e Abatimentos

**Banco de dados:**
- Nova tabela `caravanas`: evento_id (presidencia_eventos), ej_id, ies (texto), regiao (texto), num_pessoas (int), valor_medio_ingresso (numeric).
- Nova tabela `abatimentos_pf`: evento_id (presidencia_eventos), item (texto, ex: backdrop, folder), parceiro_nome, valor (numeric).

**Interface (nova aba "Acessibilidade" na Presidência Executiva):**
- Por evento: registro de caravanas (EJ de origem, IES, região, nº de pessoas, valor médio do ingresso).
- Cálculo automático: receita gerada pela acessibilidade = Σ (pessoas × valor médio do ingresso).
- Registro de itens do PF abatidos por parceiros → economia total em R$.
- Recortes/agregações por região, IES e EJ (tabelas-resumo e totais por evento e no ano).

## Ordem de execução
1. Migração única com todas as tabelas/colunas + bucket de storage.
2. Fase 3 (anuidades — mais simples) → Fase 4 (visitas) → Fase 5 (acessibilidade) → Fase 2 (certificados — mais complexa).
3. Verificação no navegador ao final de cada fase.

## Detalhes técnicos
- Seguir os padrões existentes: hooks com supabase client, modais com formulários, `selectedYear` global, tokens de cor semânticos (sem cores fixas), valores monetários em reais na UI.
- RLS em todas as tabelas novas: leitura para aprovados; escrita para time_riojunior/admin (visitas também aceitam insert de diretor_ej/membro_ej na própria EJ).
- Certificado: componente React com proporção A4 paisagem (297×210mm), impressão via `window.print()` com CSS `@page { size: A4 landscape }`.
