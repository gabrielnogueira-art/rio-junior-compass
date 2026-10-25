# Roadmap — RioJunior

## Fase 1 — Login e controle de acesso (CONCLUÍDA)
- Tela de login como tela inicial, com opção de conta Google
- Usuário solicita acesso e passa por aprovação de um administrador
- Tipos de usuário: Time RioJunior, Professor Orientador, Diretor de EJ, Membro de EJ
- Lideranças da RioJunior = administradores da plataforma
- Primeira conta = admin inicial, que libera os próximos e pode dar admin a outros

## Fase 2 — DDR: Reconhecimento de EJs (CONCLUÍDA)
- Eventos com "momento de palco" vinculados à calendarização
- Sistema identifica indicadores em dia (portal BJ) → EJ elegível ao reconhecimento
- Geração automática de certificado A4 horizontal: nome da EJ, indicador, texto padrão
- Upload de PNGs de assinatura (Presidente Executivo + Diretor DDR) com nomes abaixo
- Mini-editor estilo Canva: ajustar tamanho, rotação e texto do certificado

## Fase 3 — Operações: Anuidades (CONCLUÍDA)
- Controle de anuidade das EJs: valor total, nº de parcelas, parcelas pagas
- Flag de "suporte à anuidade" (facilitação/redução)

## Fase 4 — Interface DDR ↔ OP: Visitas dos Guardiões (CONCLUÍDA)
- Formulário de solicitação pela Diretoria da EJ: data, horário, local, motivo
- OP contabiliza gastos; DDR vê se a visita ocorreu ou não

## Fase 5 — PresEx: Acessibilidade e Abatimentos (CONCLUÍDA)
- Por estímulo presencial: nº de pessoas por caravana, EJ de origem, IES, região
- Recortes por região / IES / EJ, por evento
- Valor médio de ingresso × pessoas da caravana = receita gerada pela acessibilidade
- Itens do PF abatidos por parceiros (backdrop, folder etc.) = economia em R$

## Fase 6 — FE: Grade de Conteúdo + Interface VPNeg (CONCLUÍDA)
- Visualização dos eventos do ano na aba de Formação Empreendedora
- Grade de conteúdo por evento: credenciamento, check-in, abertura, pautas magnas e paralelas
- Pautas com temática macro (vendas, gestão de pessoas, cultura, marketing, financeiro), pauta específica, ministrante (parceiro VPNeg, parceiro PresEx, pós-júnior, interno), nome e CSAT
- FE define quantas pautas magnas/paralelas podem ser vendidas por evento
- Painel da VPNeg mostra cotas, registra vendas (parceiro, valor) e acompanha alocação
- Pauta vendida pela VPNeg aparece para a FE alocar na grade; controle de disponíveis atualiza automaticamente

## Fase 7 — Grade de conteúdo livre (CONCLUÍDA)
- Linhas e colunas editáveis, tópicos livres e colagem de células
- Páginas por evento, duplicação para preservar versões e salvamento persistente
- Referências: RJ 74°, ONDE e CentralRio; storytelling do ONDE fora deste escopo
- Preservar pautas e vendas já cadastradas

## Pendências futuras
- Presidência do Conselho (diretoria ainda placeholder)
- Integração Google Calendar (requer credenciais OAuth do Google Cloud Console)
- E-mail transacional (requer domínio próprio configurado)
