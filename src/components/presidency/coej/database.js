import { DDR_EMPRESAS_JUNIORES } from '@/data/ddrDatabase';
// src/data/database.js
// Modelagem Relacional do Banco de Dados - COEJ & RioJunior
// Implementa isolamento RLS, Selo EJ (13 Documentos), 3 Níveis de Ticket Médio,
// Execução Financeira Detalhada (Entradas & Saídas / Fomento IES), PCO, CSAT, NPS e Extensão.

const STORAGE_KEY = 'riojunior_coej_db_v3';

export const SELO_EJ_DOCUMENTOS = [
  { id: 'doc_1', nome: 'Estatuto Social Registrado em Cartório', categoria: 'Jurídico', obrigatorio: true },
  { id: 'doc_2', nome: 'Ata de Eleição e Posse Registrada', categoria: 'Jurídico', obrigatorio: true },
  { id: 'doc_3', nome: 'Cartão CNPJ Ativo na Receita Federal', categoria: 'Fiscal', obrigatorio: true },
  { id: 'doc_4', nome: 'Certidão Conjunta Negativa de Tributos Federais (PGFN)', categoria: 'Fiscal', obrigatorio: true },
  { id: 'doc_5', nome: 'Certificado de Regularidade do FGTS (CRF Caixa)', categoria: 'Trabalhista', obrigatorio: true },
  { id: 'doc_6', nome: 'Certidão Negativa de Débitos Trabalhistas (CNDT)', categoria: 'Trabalhista', obrigatorio: true },
  { id: 'doc_7', nome: 'Certidão Negativa Estadual', categoria: 'Fiscal', obrigatorio: true },
  { id: 'doc_8', nome: 'Certidão Negativa Municipal', categoria: 'Fiscal', obrigatorio: true },
  { id: 'doc_9', nome: 'Livro Diário / Balanço Patrimonial Assinado por Contador', categoria: 'Contábil', obrigatorio: true },
  { id: 'doc_10', nome: 'Declaração de Vínculo Contábil com Profissional Habilitado', categoria: 'Contábil', obrigatorio: true },
  { id: 'doc_11', nome: 'Conta Bancária Ativa em Nome da Associação', categoria: 'Financeiro', obrigatorio: true },
  { id: 'doc_12', nome: 'Termo de Reconhecimento Institucional da IES', categoria: 'Institucional', obrigatorio: true },
  { id: 'doc_13', nome: 'Termo de Voluntariado dos Membros Ativos', categoria: 'Trabalhista', obrigatorio: true },
];

export const INITIAL_DATABASE = {
  // 1. Tabela Usuarios_COEJ
  Usuarios_COEJ: [
    {
      id_auth: 'usr_001',
      nome: 'Prof. Dr. Geraldo Ferreira',
      email: 'geraldoferreira@id.uff.br',
      foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      id_ej_vinculada: 'ej_002', // Nexus Consultoria Jr (Cluster 2 - Menor)
      status_cadastro: 'Ativo',
      titulacao: 'Doutor em Engenharia de Produção',
      departamento: 'Departamento de Engenharia de Produção - Escola de Engenharia',
      ies: 'Universidade Federal Fluminense (UFF)',
      termo_etica_aceito: true,
      horas_extensao_semanais: 8,
      data_posse: '2024-02-15'
    },
    {
      id_auth: 'usr_002',
      nome: 'Profa. Dra. Alice Pires',
      email: 'alice@poli.ufrj.br',
      foto_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      id_ej_vinculada: 'ej_001', // Poli Júnior Rio (Cluster 5 - Maior)
      status_cadastro: 'Ativo',
      titulacao: 'Pós-Doutora em Gestão e Inovação Tecnológica',
      departamento: 'Escola Politécnica da UFRJ',
      ies: 'Universidade Federal do Rio de Janeiro (UFRJ)',
      termo_etica_aceito: true,
      horas_extensao_semanais: 10,
      data_posse: '2023-08-01'
    },
    {
      id_auth: 'usr_003',
      nome: 'Prof. Dr. Marcus Seixas',
      email: 'marcus_seixas@uerj.br',
      foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      id_ej_vinculada: 'ej_003', // BioInova Jr (Aspirante)
      status_cadastro: 'Ativo',
      titulacao: 'Doutor em Ciências Biológicas & Biotecnologia',
      departamento: 'Instituto de Biologia Roberto Alcântara Gomes',
      ies: 'Universidade do Estado do Rio de Janeiro (UERJ)',
      termo_etica_aceito: true,
      horas_extensao_semanais: 6,
      data_posse: '2024-09-10'
    },
    {
      id_auth: 'usr_004',
      nome: 'Prof. Me. Rodrigo Alvim',
      email: 'rodrigo.alvim@ibmec.edu.br',
      foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      id_ej_vinculada: 'ej_004', // Ibmec Jr (Cluster 4)
      status_cadastro: 'Ativo',
      titulacao: 'Mestre em Finanças e Estratégia',
      departamento: 'Faculdade de Economia e Administração',
      ies: 'Instituto Brasileiro de Mercado de Capitais (Ibmec-RJ)',
      termo_etica_aceito: true,
      horas_extensao_semanais: 8,
      data_posse: '2024-01-20'
    }
  ],

  // 2. Tabela Empresas_Juniores (Bases consolidadas de DDR)
  Empresas_Juniores: [
    {
      id_ej: 'ej_001',
      nome: 'Poli Júnior Engenharia',
      cluster: 'Cluster 5',
      tipo_maturidade: 'Alta',
      ies: 'Universidade Federal do Rio de Janeiro (UFRJ)',
      cidade: 'Rio de Janeiro',
      regiao: 'Metropolitana 1',
      membros_ativos: 52,
      cursos_admitidos: 'Engenharia Civil, Engenharia de Produção, Engenharia Mecânica, Engenharia Elétrica, Engenharia de Computação',
      ano_fundacao: 1993,
      contato_presidencia: 'Lucas Fontes (Presidente Executivo) - (21) 98877-6655',
      email_ej: 'presidencia@polijunior.com.br',
      website: 'www.polijunior.com.br',
      membro_responsavel: {
        nome: 'Lucas Fontes',
        cargo: 'Diretor Presidente',
        email: 'presidencia@polijunior.com.br'
      }
    },
    {
      id_ej: 'ej_002',
      nome: 'Nexus Consultoria Júnior',
      cluster: 'Cluster 2',
      tipo_maturidade: 'Baixa',
      ies: 'Universidade Federal Fluminense (UFF)',
      cidade: 'Niterói',
      regiao: 'Metropolitana 2 / Leste',
      membros_ativos: 18,
      cursos_admitidos: 'Engenharia de Produção, Administração e Ciências Econômicas',
      ano_fundacao: 2018,
      contato_presidencia: 'Beatriz Vasconcelos (Diretora-Presidente) - (21) 97766-5544',
      email_ej: 'contato@nexusjunior.uff.br',
      website: 'www.nexusjunior.uff.br',
      membro_responsavel: {
        nome: 'Beatriz Vasconcelos',
        cargo: 'Diretora-Presidente',
        email: 'beatriz.vasconcelos@nexusjunior.uff.br'
      }
    },
    {
      id_ej: 'ej_003',
      nome: 'BioInova Consultoria Ambiental Jr',
      cluster: 'Aspirante',
      tipo_maturidade: 'Baixa',
      ies: 'Universidade do Estado do Rio de Janeiro (UERJ)',
      cidade: 'Rio de Janeiro',
      regiao: 'Centro-Sul 1',
      membros_ativos: 12,
      cursos_admitidos: 'Ciências Biológicas, Ecologia e Engenharia Ambiental',
      ano_fundacao: 2023,
      contato_presidencia: 'Gabriel Ramos (Diretor-Presidente) - (21) 96655-4433',
      email_ej: 'presidencia@bioinovajr.uerj.br',
      website: 'www.bioinovajr.uerj.br',
      membro_responsavel: {
        nome: 'Gabriel Ramos',
        cargo: 'Presidente',
        email: 'gabriel.ramos@bioinovajr.uerj.br'
      }
    },
    {
      id_ej: 'ej_004',
      nome: 'Ibmec Júnior Consultoria',
      cluster: 'Cluster 4',
      tipo_maturidade: 'Alta',
      ies: 'Instituto Brasileiro de Mercado de Capitais (Ibmec-RJ)',
      cidade: 'Rio de Janeiro',
      regiao: 'Metropolitana 1',
      membros_ativos: 36,
      cursos_admitidos: 'Administração de Empresas, Economia e Relações Internacionais',
      ano_fundacao: 2004,
      contato_presidencia: 'Camila Duarte (Presidente) - (21) 95544-3322',
      email_ej: 'contato@ibmecjr.com.br',
      website: 'www.ibmecjr.com.br',
      membro_responsavel: {
        nome: 'Camila Duarte',
        cargo: 'Presidente',
        email: 'camila.duarte@ibmecjr.com.br'
      }
    }
  ],

  // 3. Tabela Relatorios_Trimestrais
  Relatorios_Trimestrais: [
    {
      id_relatorio: 'rel_nexus_2025_q3',
      id_ej: 'ej_002',
      trimestre_ano: '2025_Q3',
      tipo_maturidade: 'Baixa',
      desafios: [
        'Funil de conversão de propostas para fechamento ainda abaixo de 40%',
        'Adequação contábil para renovação da Certidão Negativa de Débitos (CND)',
        'Dificuldade de conciliação de horários de aulas com reuniões presenciais de projeto',
        'Necessidade de apoio de docentes especializados para validação de layout industrial'
      ],
      gargalos: 'Pouca autonomia dos trainees recém-empossados na condução da etapa de diagnóstico inicial com clientes.',
      conclusao_ej: 'Conclui-se, diante dos dados apresentados, que a Nexus Consultoria Júnior superou a meta de faturamento trimestral em 113.6% e avançou na estruturação dos processos de extensão na Escola de Engenharia, necessitando apoio docente para homologação dos projetos técnicos e captação de novos clientes industriais.',
      status_aprovacao_orientador: 'Homologado pelo Orientador',
      parecer_orientador: 'Atesto a veracidade dos dados apresentados pela diretoria da Nexus. Acompanhei os projetos desenvolvidos e confirmo que a EJ cumpriu os objetivos pedagógicos e extensionistas. Recomendo estreitar articulação com o Departamento de Engenharia de Produção para captação de projetos de layout fabril.',
      data_homologacao: '2025-10-04',
      atividades_realizadas: [
        'Treinamento intensivo de Metodologia Scrum e OKRs para novos membros',
        '2 reuniões formais com a Coordenação de Curso da UFF',
        'Participação com 8 membros no Encontro Fluminense de Empresas Juniores (EFEJ)',
        'Implementação de CRM digital para controle de propostas enviadas'
      ],
      proximas_entregas: {
        meta_financeira: 35000,
        meta_projetos: 8,
        acoes_com_ies: 'Apresentação dos resultados da ação de extensão na Semana da Ciência e Tecnologia da UFF.'
      }
    },
    {
      id_relatorio: 'rel_poli_2025_q3',
      id_ej: 'ej_001',
      trimestre_ano: '2025_Q3',
      tipo_maturidade: 'Alta',
      desafios: [
        'Manutenção da taxa de retenção durante o período de provas finais da graduação',
        'Ajuste nos prazos de fornecedores de software para entregas de engenharia civil',
        'Ampliação da carteira de contratos B2B com médias e grandes empresas fluminenses'
      ],
      gargalos: 'Alocação simultânea de gerentes sênior em mais de 3 projetos de alta complexidade técnica.',
      conclusao_ej: 'Conclui-se, diante dos dados apresentados, que a Poli Júnior consolidou um trimestre histórico de faturamento (R$ 142.800), atingindo 119% da meta trimestral com excelente índice de satisfação de clientes (NPS 88) e validação de mais de 1.200 horas de extensão.',
      status_aprovacao_orientador: 'Homologado pelo Orientador',
      parecer_orientador: 'Homologo com louvor o relatório trimestral. A Poli Júnior mantém padrão de excelência na gestão técnica, transparência jurídica plena (13/13 documentos Selo EJ) e articulação extensionista exemplar junto à Decania do Centro de Tecnologia da UFRJ.',
      data_homologacao: '2025-10-06',
      destaques_estrategicos: [
        'Crescimento de +28.4% na receita em relação ao trimestre anterior (Q2)',
        'Fechamento do maior projeto da história da EJ no setor de Eficiência Energética (R$ 48.000)',
        'Renovação total da chancela de Extensão Universitária junto à Pró-Reitoria (PR-5 UFRJ)'
      ],
      principais_entregas: [
        'Plano Diretor de Logística para Cooperativa Agroecológica Fluminense',
        'Retrofit e laudo de estabilidade predial para centro comunitário na Baixada',
        'Modelagem BIM aplicada a empreendimento habitacional de interesse social'
      ],
      estrategia_trimestre: {
        meta_financeira: 120000,
        meta_impacto: 50000,
        projetos_prioritarios: 'Plataforma de Descarbonização Industrial e Auditoria Energética Hospitalar',
        acoes_relacionamento_ies: 'Realização de Hackathon conjunto com o Parque Tecnológico da UFRJ e oferta de bolsas sociais de alimentação para trainees vulneráveis.'
      }
    }
  ],

  // 4. Tabela Indicadores_Mercado
  Indicadores_Mercado: [
    {
      id_relatorio: 'rel_nexus_2025_q3',
      receita_total: 28400,
      faturamento_previsto: 25000,
      faturamento_realizado: 28400,
      despesas: 9150,
      caixa_atual: 19250,
      propostas_enviadas: 24,
      projetos_vendidos: 6,
      projetos_concluidos: 4,
      projetos_em_execucao: 3,
      projetos_aprovados: 2,
      projetos_impacto: 2,
      ticket_medio: 4733.33,
      percentual_meta_alcancada: 113.6,
      crescimento_trimestre_pct: 18.2,

      ticket_medio_por_curso: [
        { curso: 'Engenharia de Produção', ticket_medio: 5400, total_projetos: 3, faturamento_total: 16200 },
        { curso: 'Administração', ticket_medio: 4200, total_projetos: 2, faturamento_total: 8400 },
        { curso: 'Ciências Econômicas', ticket_medio: 3800, total_projetos: 1, faturamento_total: 3800 }
      ],

      ticket_medio_por_servico: [
        { servico: 'Mapeamento e Otimização de Processos (BPM)', curso: 'Engenharia de Produção', ticket_medio: 5800, qtd_projetos: 2, complexidade: 'Média/Alta' },
        { servico: 'Planejamento Estratégico & OKRs', curso: 'Administração', ticket_medio: 4200, qtd_projetos: 2, complexidade: 'Média' },
        { servico: 'Layout Industrial & Cronoanálise', curso: 'Engenharia de Produção', ticket_medio: 5000, qtd_projetos: 1, complexidade: 'Alta' },
        { servico: 'Estudo de Viabilidade Econômica (EVTE)', curso: 'Ciências Econômicas', ticket_medio: 3800, qtd_projetos: 1, complexidade: 'Média' }
      ]
    },
    {
      id_relatorio: 'rel_poli_2025_q3',
      receita_total: 142800,
      faturamento_previsto: 120000,
      faturamento_realizado: 142800,
      despesas: 38200,
      caixa_atual: 104600,
      propostas_enviadas: 38,
      projetos_vendidos: 12,
      projetos_concluidos: 9,
      projetos_em_execucao: 6,
      projetos_aprovados: 4,
      projetos_impacto: 5,
      ticket_medio: 11900.00,
      percentual_meta_alcancada: 119.0,
      crescimento_trimestre_pct: 28.4,

      ticket_medio_por_curso: [
        { curso: 'Engenharia Elétrica / Energia', ticket_medio: 16000, total_projetos: 4, faturamento_total: 64000 },
        { curso: 'Engenharia Civil', ticket_medio: 12500, total_projetos: 4, faturamento_total: 50000 },
        { curso: 'Engenharia Mecânica / Automação', ticket_medio: 9500, total_projetos: 2, faturamento_total: 19000 },
        { curso: 'Engenharia de Computação', ticket_medio: 9900, total_projetos: 2, faturamento_total: 19800 }
      ],

      ticket_medio_por_servico: [
        { servico: 'Laudo de Eficiência Energética & Retrofit', curso: 'Engenharia Elétrica / Energia', ticket_medio: 24000, qtd_projetos: 2, complexidade: 'Alta' },
        { servico: 'Projeto Estrutural e Modelagem BIM', curso: 'Engenharia Civil', ticket_medio: 14000, qtd_projetos: 3, complexidade: 'Alta' },
        { servico: 'Automação e Otimização Térmica', curso: 'Engenharia Mecânica / Automação', ticket_medio: 9500, qtd_projetos: 2, complexidade: 'Média' },
        { servico: 'Sistemas Web de Monitoramento Industrial', curso: 'Engenharia de Computação', ticket_medio: 9900, qtd_projetos: 2, complexidade: 'Média' }
      ]
    }
  ],

  // 5. NOVA TABELA: Execucao_Financeira (Entradas, Saídas e Diagnóstico de Fomento IES)
  Execucao_Financeira: [
    // Nexus Jr (Menor Maturidade)
    {
      id_ej: 'ej_002',
      id_relatorio: 'rel_nexus_2025_q3',
      saldo_inicial_caixa: 0,
      entradas: [
        { id: 'ent_1', categoria: 'Contratos de Projetos / Consultoria', descricao: 'Receita líquida de 6 projetos executados no Q3', valor: 28400, tipo: 'projetos' },
        { id: 'ent_2', categoria: 'Minicursos & Workshops Acadêmicos', descricao: 'Inscrições em curso aberto de BPM para a graduação', valor: 0, tipo: 'eventos' },
        { id: 'ent_3', categoria: 'Patrocínios & Parcerias Privadas', descricao: 'Apoio de empresa júnior parceira em evento regional', valor: 0, tipo: 'patrocinio' },
        { id: 'ent_4', categoria: 'Editais / Fomento Institucional da IES', descricao: 'Auxílio de extensão ou fomento direto (Atualmente Zerado)', valor: 0, tipo: 'fomento_ies' }
      ],
      saidas: [
        { id: 'sai_1', categoria: 'Capacitações & Eventos do MEJ (EFEJ / ENEJ)', descricao: 'Inscrições e custeio de transporte dos membros para eventos oficiais', valor: 3100 },
        { id: 'sai_2', categoria: 'Execução de Projetos & Licenças de Software', descricao: 'Ferramentas de modelagem e materiais diretos de consultoria', valor: 2200 },
        { id: 'sai_3', categoria: 'Despesas Jurídico-Contábeis & Cartório', descricao: 'Honorários contábeis e custas cartoriais de ata de eleição', valor: 1850 },
        { id: 'sai_4', categoria: 'Marketing, Prospecção & Comercial', descricao: 'Assinatura de CRM, hospedagem do site e material institucional', valor: 1100 },
        { id: 'sai_5', categoria: 'Administrativo, Sala & Material de Apoio', descricao: 'Suprimentos de escritório e manutenção básica da sala da EJ', valor: 900 }
      ],
      // Diagnóstico para a IES (Gera insumos para editais internos)
      diagnostico_fomento_ies: {
        necessita_apoio_editais: true,
        urgencia: 'Alta',
        solicitacoes: [
          'Edital de auxílio deslocamento e hospedagem para 6 membros no Encontro Nacional (ENEJ)',
          'Licenças acadêmicas de softwares técnicos (BPMN e Mapeamento) para atendimento à comunidade',
          'Apoio orçamentário da IES para isenção/custeio de taxas cartoriais de registro da gestão'
        ],
        valor_estimado_necessario: 6800,
        justificativa_ej: 'A Nexus tem alta capacidade de entrega técnica, porém a ausência de editais de fomento na IES sobrecarrega o caixa da associação para custear viagens a eventos formativos e taxas de cartório, reduzindo nossa margem de reinvestimento na infraestrutura acadêmica.',
        parecer_orientador_fomento: 'Recomendo formalmente que a Direção da Escola de Engenharia e a Pró-Reitoria de Extensão da UFF instituam edital de apoio financeiro ou auxílio transporte aos membros da Nexus, permitindo a representação da universidade no ENEJ.'
      }
    },
    // Poli Jr (Cluster 5)
    {
      id_ej: 'ej_001',
      id_relatorio: 'rel_poli_2025_q3',
      saldo_inicial_caixa: 0,
      entradas: [
        { id: 'ent_101', categoria: 'Contratos de Projetos / Consultoria B2B', descricao: '12 projetos de engenharia civil, elétrica e produção', valor: 142800, tipo: 'projetos' },
        { id: 'ent_102', categoria: 'Minicursos & Treinamentos Técnicos', descricao: 'Semana de capacitação em software BIM para a graduação', valor: 0, tipo: 'eventos' },
        { id: 'ent_103', categoria: 'Bolsas & Fomento de Extensão (PR-5 / Parque UFRJ)', descricao: 'Auxílio de apoio a projetos de sustentabilidade comunitária', valor: 0, tipo: 'fomento_ies' }
      ],
      saidas: [
        { id: 'sai_101', categoria: 'Capacitações, Vivência & Eventos MEJ', descricao: 'Delegação de 22 membros no ENEJ e imersões da RioJunior', valor: 14500 },
        { id: 'sai_102', categoria: 'Execução de Projetos, Softwares & Laudos', descricao: 'Softwares de engenharia estrutural, EPIs e vistorias em campo', valor: 11800 },
        { id: 'sai_103', categoria: 'Jurídico, Contábil & Auditoria Externa', descricao: 'Auditoria fiscal anual e adequação a normas regulamentares', valor: 4900 },
        { id: 'sai_104', categoria: 'Marketing, Vendas & Prospecção B2B', descricao: 'Campanhas institucionais e prospecção corporativa', valor: 4200 },
        { id: 'sai_105', categoria: 'Infraestrutura da Sede & Manutenção de TI', descricao: 'Servidores locais, redes e manutenção de bancadas na UFRJ', valor: 2800 }
      ],
      diagnostico_fomento_ies: {
        necessita_apoio_editais: false,
        urgencia: 'Moderada / Parcerias',
        solicitacoes: [
          'Acesso a laboratórios especializados do Centro de Tecnologia para ensaios de materiais',
          'Intermediação da IES em convênios de inovação com grandes concessionárias estaduais'
        ],
        valor_estimado_necessario: 0,
        justificativa_ej: 'A Poli Júnior é autossustentável financeiramente, demandando apoio institucional voltado à infraestrutura laboratorial e facilitação de convênios.',
        parecer_orientador_fomento: 'A Poli Júnior demonstra plena solvência e sustentabilidade. O foco de apoio institucional deve residir na cessão de uso de laboratórios de ensaios do CT.'
      }
    }
  ],

  // 6. Tabela Indicadores_IES_Extensao
  Indicadores_IES_Extensao: [
    {
      id_ej: 'ej_002',
      id_relatorio: 'rel_nexus_2025_q3',
      alunos_graduacao_capacitados: 45,
      alunos_impactados_projetos: 120,
      horas_extensao_membros: 240,
      horas_capacitacao_externa: 80,
      horas_extensao_validadas: 320,
      acoes_extensao: 3,
      parcerias_ies: 2,
      parcerias_mercado_governo: 3,
      visibilidade_gerada: '8 postagens técnicas no LinkedIn, 1 matéria no portal oficial da Escola de Engenharia UFF'
    },
    {
      id_ej: 'ej_001',
      id_relatorio: 'rel_poli_2025_q3',
      alunos_graduacao_capacitados: 160,
      alunos_impactados_projetos: 450,
      horas_extensao_membros: 980,
      horas_capacitacao_externa: 260,
      horas_extensao_validadas: 1240,
      acoes_extensao: 6,
      parcerias_ies: 4,
      parcerias_mercado_governo: 8,
      visibilidade_gerada: 'Painel no Inova UFRJ, menção honrosa no Prêmio RioJunior de Extensão Universitária'
    }
  ],

  // 7. Tabela Auditoria_Juridica
  Auditoria_Juridica: [
    {
      id_ej: 'ej_002',
      status_juridico: 'Regular',
      selo_ej_conformidade: '11/13 Documentos Validados',
      entregas_contabeis: 'OK',
      status_detalhado_contabil: 'Livro Diário 2024 escriturado e CND Federal válida até 12/2025.',
      documentos_selo_ej: [
        { id: 'doc_1', status: 'Regular', validade: 'Indeterminada', obs: 'Estatuto registrado no RCPJ Niterói' },
        { id: 'doc_2', status: 'Em Renovação', validade: '2025-11-15', obs: 'Nova ata de posse em trâmite de registro' },
        { id: 'doc_3', status: 'Regular', validade: 'Indeterminada', obs: 'CNPJ Ativo e sem restrições' },
        { id: 'doc_4', status: 'Regular', validade: '2025-12-30', obs: 'Certidão PGFN emitida' },
        { id: 'doc_5', status: 'Regular', validade: '2025-10-31', obs: 'CRF Caixa regular' },
        { id: 'doc_6', status: 'Regular', validade: '2026-01-15', obs: 'CNDT válida' },
        { id: 'doc_7', status: 'Regular', validade: '2025-12-15', obs: 'Fazenda Estadual RJ regular' },
        { id: 'doc_8', status: 'Regular', validade: '2025-11-30', obs: 'Prefeitura de Niterói regular' },
        { id: 'doc_9', status: 'Regular', validade: '2025-12-31', obs: 'Balanço 2024 assinado com CRC ativo' },
        { id: 'doc_10', status: 'Regular', validade: '2025-12-31', obs: 'Contrato de assessoria contábil vigente' },
        { id: 'doc_11', status: 'Regular', validade: 'Indeterminada', obs: 'Conta PJ Itaú ativa' },
        { id: 'doc_12', status: 'Regular', validade: '2026-08-01', obs: 'Portaria de Reconhecimento UFF PR-3' },
        { id: 'doc_13', status: 'Pendente', validade: '2025-10-15', obs: 'Coleta de assinaturas dos 4 novos trainees' }
      ],
      riscos_identificados: [
        'Registro em cartório da nova ata de eleição e posse da Diretoria 2025/2026 (Prazo: 30 dias)',
        'Finalização dos termos de voluntariado dos membros recém-admitidos no processo seletivo'
      ]
    },
    {
      id_ej: 'ej_001',
      status_juridico: 'Regular',
      selo_ej_conformidade: '13/13 Documentos Validados (Selo 100%)',
      entregas_contabeis: 'OK',
      status_detalhado_contabil: 'Auditoria contábil completa com parecer sem ressalvas e CNDs válidas.',
      documentos_selo_ej: [
        { id: 'doc_1', status: 'Regular', validade: 'Indeterminada', obs: 'Registrado no 1º RCPJ Rio' },
        { id: 'doc_2', status: 'Regular', validade: '2026-02-01', obs: 'Ata devidamente averbada' },
        { id: 'doc_3', status: 'Regular', validade: 'Indeterminada', obs: 'CNPJ ativo' },
        { id: 'doc_4', status: 'Regular', validade: '2026-03-10', obs: 'CND Federal sem pendências' },
        { id: 'doc_5', status: 'Regular', validade: '2025-11-20', obs: 'CRF regular' },
        { id: 'doc_6', status: 'Regular', validade: '2026-02-15', obs: 'CNDT regular' },
        { id: 'doc_7', status: 'Regular', validade: '2026-01-30', obs: 'SEFAZ-RJ regular' },
        { id: 'doc_8', status: 'Regular', validade: '2026-02-28', obs: 'SMF-Rio regular' },
        { id: 'doc_9', status: 'Regular', validade: '2025-12-31', obs: 'Livro Diário auditado' },
        { id: 'doc_10', status: 'Regular', validade: '2026-06-30', obs: 'Contrato contábil ativo' },
        { id: 'doc_11', status: 'Regular', validade: 'Indeterminada', obs: 'Conta Banco do Brasil PJ' },
        { id: 'doc_12', status: 'Regular', validade: '2027-04-10', obs: 'Resolução Decania Poli/UFRJ' },
        { id: 'doc_13', status: 'Regular', validade: '2025-12-31', obs: '100% dos termos arquivados digitalmente' }
      ],
      riscos_identificados: [
        'Revisão periódica de conformidade com LGPD nos termos de consentimento de clientes externos'
      ]
    }
  ],

  // 8. Tabela Indicadores_Internos
  Indicadores_Internos: [
    {
      id_ej: 'ej_002',
      id_relatorio: 'rel_nexus_2025_q3',
      membros_ativos: 18,
      taxa_evasao: 5.5,
      tempo_medio_permanencia_meses: 14.2,
      horas_capacitacao_membro: 26,
      csat_clientes: 9.1,
      nps_clientes: 76,
      pco_clima_membros: 84.5,
      meta_pco: 80.0
    },
    {
      id_ej: 'ej_001',
      id_relatorio: 'rel_poli_2025_q3',
      membros_ativos: 52,
      taxa_evasao: 3.8,
      tempo_medio_permanencia_meses: 18.5,
      horas_capacitacao_membro: 42,
      csat_clientes: 9.6,
      nps_clientes: 88,
      pco_clima_membros: 92.0,
      meta_pco: 85.0
    }
  ],

  // 9. Tabela IESE_Avaliacoes
  IESE_Avaliacoes: [
    {
      id_ej: 'ej_002',
      trimestre: '2025_Q3',
      dimensoes: {
        cultura_empreendedora: {
          reunioes_formais_coordenacao: true,
          participacao_semana_calouros: true,
          eventos_empreendedorismo_promovidos: true,
          disciplinas_empreendedorismo_apoio: false,
          pontos: 75
        },
        infraestrutura_capital: {
          espaco_fisico_dedicado: true,
          apoio_administrativo_secretaria: true,
          computadores_internet_dedicada: true,
          acesso_editais_internos_fomento: false,
          auxilio_deslocamento_eventos_mej: false,
          pontos: 60
        },
        extensao_articulacao: {
          curricularizacao_extensao_formal: true,
          horas_extensao_validadas_orientador: true,
          parceria_institucional_governo_mercado: true,
          divulgacao_canais_oficiais_ies: true,
          pontos: 85
        }
      },
      parecer_articulador_orientador: 'A UFF oferece excelente suporte através da Escola de Engenharia com sala física. Necessitamos avançar na liberação de edital de fomento a viagens para o Encontro Nacional (ENEJ).',
      selo_previsao: 'Prata - IES Apoiadora do Empreendedorismo'
    },
    {
      id_ej: 'ej_001',
      trimestre: '2025_Q3',
      dimensoes: {
        cultura_empreendedora: {
          reunioes_formais_coordenacao: true,
          participacao_semana_calouros: true,
          eventos_empreendedorismo_promovidos: true,
          disciplinas_empreendedorismo_apoio: true,
          pontos: 95
        },
        infraestrutura_capital: {
          espaco_fisico_dedicado: true,
          apoio_administrativo_secretaria: true,
          computadores_internet_dedicada: true,
          acesso_editais_internos_fomento: true,
          auxilio_deslocamento_eventos_mej: true,
          pontos: 90
        },
        extensao_articulacao: {
          curricularizacao_extensao_formal: true,
          horas_extensao_validadas_orientador: true,
          parceria_institucional_governo_mercado: true,
          divulgacao_canais_oficiais_ies: true,
          pontos: 100
        }
      },
      parecer_articulador_orientador: 'A UFRJ mantém histórico referencial de articulação e apoio estrutural à Poli Júnior via Decania e Parque Tecnológico.',
      selo_previsao: 'Diamante - IES de Excelência Empreendedora'
    }
  ]
};


// Função auxiliar para mapear as 75 EJs da RioJunior
function getMapeamentoEJsCompletas(baseEJs = []) {
  if (!DDR_EMPRESAS_JUNIORES || !Array.isArray(DDR_EMPRESAS_JUNIORES)) {
    return baseEJs;
  }

  const existingIds = new Set(baseEJs.map(e => e.id_ej));
  const merged = [...baseEJs];

  DDR_EMPRESAS_JUNIORES.forEach(ddrEj => {
    const id = ddrEj.id_ej || ddrEj.id;
    if (!existingIds.has(id)) {
      const clusterNum = typeof ddrEj.cluster === 'number' 
        ? ddrEj.cluster 
        : parseInt(String(ddrEj.cluster).replace(/\D/g, '') || '1', 10);
      const isAlta = clusterNum >= 4;

      merged.push({
        id_ej: id,
        nome: ddrEj.nome,
        cluster: typeof ddrEj.cluster === 'number' ? `Cluster ${ddrEj.cluster}` : (ddrEj.cluster || 'Cluster 1'),
        tipo_maturidade: isAlta ? 'Alta' : 'Baixa',
        ies: ddrEj.ies || 'Universidade Estadual / Federal do RJ',
        cidade: ddrEj.cidade || 'Rio de Janeiro',
        regiao: ddrEj.regiao || 'Metropolitana',
        membros_ativos: ddrEj.membros_ativos || (isAlta ? 40 : 18),
        cursos_admitidos: ddrEj.cursos_admitidos || 'Engenharias, Gestão e Ciências Aplicadas',
        ano_fundacao: ddrEj.ano_fundacao || 2018,
        cnpj: ddrEj.cnpj || '',
        email_ej: ddrEj.email || 'contato@riojunior.com.br',
        website: ddrEj.website || 'https://riojunior.com.br',
        contato_presidencia: `Presidência ${ddrEj.nome}`,
        financeiro: ddrEj.financeiro || null,
        farol: ddrEj.farol || 'verde'
      });
      existingIds.add(id);
    }
  });

  return merged;
}


// Geradores dinâmicos para suportar todas as 75 EJs da RioJunior
function getProfessorParaEJ(db, ej) {
  const vinculado = db.Usuarios_COEJ.find(u => u.id_ej_vinculada === ej.id_ej);
  if (vinculado) return vinculado;

  const iesUpper = (ej.ies || '').toUpperCase();
  if (iesUpper.includes('UFF')) return db.Usuarios_COEJ.find(u => u.id_auth === 'usr_001') || db.Usuarios_COEJ[0];
  if (iesUpper.includes('UFRJ')) return db.Usuarios_COEJ.find(u => u.id_auth === 'usr_002') || db.Usuarios_COEJ[0];
  if (iesUpper.includes('UERJ')) return db.Usuarios_COEJ.find(u => u.id_auth === 'usr_003') || db.Usuarios_COEJ[0];
  if (iesUpper.includes('IBMEC')) return db.Usuarios_COEJ.find(u => u.id_auth === 'usr_004') || db.Usuarios_COEJ[0];

  // Professor virtual para a IES da EJ
  return {
    id_auth: `usr_${ej.id_ej}`,
    nome: `Prof. Orientador COEJ (${ej.ies ? ej.ies.split(' ')[0] : 'RJ'})`,
    email: `orientador.${ej.id_ej}@riojunior.com.br`,
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    id_ej_vinculada: ej.id_ej,
    status_cadastro: 'Ativo',
    titulacao: 'Doutor / Mestre Orientador Institucional',
    departamento: 'Coordenação de Extensão e Inovação',
    ies: ej.ies || 'Federação RioJunior',
    termo_etica_aceito: true,
    horas_extensao_semanais: 8,
    data_posse: '2024-03-01'
  };
}

function gerarRelatorioDinamico(ej, trimestre) {
  const isAlta = ej.cluster === 'Cluster 4' || ej.cluster === 'Cluster 5';
  return {
    id_relatorio: `rel_${ej.id_ej}_${trimestre}`,
    id_ej: ej.id_ej,
    trimestre_ano: trimestre,
    tipo_maturidade: isAlta ? 'Alta' : 'Baixa',
    desafios: isAlta ? [
      'Manutenção da retenção de consultores seniores durante o período letivo',
      'Prospecção ativa de contratos B2B de maior valor agregado',
      'Otimização do ciclo de desenvolvimento com metodologias ágeis'
    ] : [
      'Aprimoramento do funil de vendas e conversão de propostas comerciais',
      'Estruturação contínua do onboarding de novos trainees',
      'Adequação documental para validação plena do Selo EJ Brasil Júnior',
      'Apoio docente na homologação técnica dos projetos de extensão'
    ],
    gargalos: isAlta 
      ? 'Alocação simultânea de gerentes sênior em múltiplos projetos estratégicos.' 
      : 'Autonomia dos membros recém-empossados na condução da etapa inicial de diagnóstico.',
    conclusao_ej: `Conclui-se, diante dos dados apresentados, que a ${ej.nome} cumpriu suas metas no exercício, consolidando horas de extensão curricularizada e impacto positivo na comunidade acadêmica e empresarial perante a ${ej.ies}.`,
    status_aprovacao_orientador: 'Homologado pelo Orientador',
    parecer_orientador: `Homologo o relatório de prestação de contas da ${ej.nome}. Atesto a regularidade das atividades pedagógicas e extensionistas, em total conformidade com a Lei Federal nº 13.267/2016 e as diretrizes acadêmicas da ${ej.ies}.`,
    data_homologacao: '2025-10-05',
    atividades_realizadas: [
      'Capacitação interna em ferramentas de gestão e metodologias ágeis',
      `Reuniões formais com a Coordenação de Curso da ${ej.ies}`,
      'Participação em eventos oficiais do MEJ Fluminense (EFEJ / RioJunior)',
      'Execução e entrega de projetos técnicos com chancela extensionista'
    ],
    proximas_entregas: {
      meta_financeira: isAlta ? 90000 : 28000,
      meta_projetos: isAlta ? 9 : 4,
      acoes_com_ies: `Apresentação dos resultados da ação de extensão na Semana Acadêmica da ${ej.ies}.`
    }
  };
}

function gerarMercadoDinamico(ej, relatorioId) {
  const faturamento = ej.financeiro?.faturamento_realizado || (ej.cluster === 'Cluster 5' ? 140000 : ej.cluster === 'Cluster 4' ? 70000 : 25000);
  const meta = ej.financeiro?.meta_anual || (faturamento * 1.35);
  const ticket = ej.financeiro?.ticket_medio || (ej.cluster === 'Cluster 5' ? 12000 : ej.cluster === 'Cluster 4' ? 8500 : 4500);
  const qtdProjetos = Math.max(1, Math.round(faturamento / (ticket || 1)));
  const cursoPrincipal = (ej.cursos_admitidos || 'Engenharia e Gestão').split(',')[0].trim();

  return {
    id_relatorio: relatorioId,
    receita_total: faturamento,
    faturamento_previsto: Math.round(meta / 4),
    faturamento_realizado: faturamento,
    despesas: Math.round(faturamento * 0.32),
    caixa_atual: Math.round(faturamento * 0.68),
    propostas_enviadas: qtdProjetos * 3,
    projetos_vendidos: qtdProjetos,
    projetos_concluidos: Math.max(1, qtdProjetos - 1),
    projetos_em_execucao: 2,
    projetos_aprovados: 1,
    projetos_impacto: Math.max(1, Math.round(qtdProjetos / 2)),
    ticket_medio: ticket,
    percentual_meta_alcancada: Math.round((faturamento / (meta || 1)) * 100),
    crescimento_trimestre_pct: 18.5,
    ticket_medio_por_curso: [
      { curso: cursoPrincipal, ticket_medio: Math.round(ticket * 1.15), total_projetos: Math.max(1, Math.round(qtdProjetos * 0.65)), faturamento_total: Math.round(faturamento * 0.72) },
      { curso: 'Projetos Multidisciplinares', ticket_medio: Math.round(ticket * 0.85), total_projetos: Math.max(1, Math.round(qtdProjetos * 0.35)), faturamento_total: Math.round(faturamento * 0.28) }
    ],
    ticket_medio_por_servico: [
      { servico: `Consultoria Especializada em ${cursoPrincipal}`, curso: cursoPrincipal, ticket_medio: Math.round(ticket * 1.2), qtd_projetos: Math.max(1, Math.round(qtdProjetos * 0.5)), complexidade: 'Alta' },
      { servico: 'Projetos de Extensão e Diagnóstico Organizacional', curso: 'Multidisciplinar', ticket_medio: Math.round(ticket * 0.8), qtd_projetos: Math.max(1, Math.round(qtdProjetos * 0.5)), complexidade: 'Média' }
    ]
  };
}

function gerarExecucaoFinanceiraDinamica(ej) {
  const faturamento = ej.financeiro?.faturamento_realizado || 25000;
  return {
    id_ej: ej.id_ej,
    id_relatorio: `rel_${ej.id_ej}_2025_Q3`,
    saldo_inicial_caixa: 0,
    entradas: [
      { id: 'ent_1', categoria: 'Contratos de Projetos / Consultoria', descricao: `Receita líquida de contratos da ${ej.nome}`, valor: faturamento, tipo: 'projetos' },
      { id: 'ent_2', categoria: 'Workshops e Cursos Abertos', descricao: 'Capacitações abertas à comunidade universitária', valor: Math.round(faturamento * 0.08), tipo: 'eventos' }
    ],
    saidas: [
      { id: 'sai_1', categoria: 'Capacitações & Eventos do MEJ (EFEJ / ENEJ)', descricao: 'Custeio de passagens e inscrições em eventos oficiais', valor: Math.round(faturamento * 0.18) },
      { id: 'sai_2', categoria: 'Execução de Projetos & Licenças de Software', descricao: 'Softwares técnicos e insumos diretos de projetos', valor: Math.round(faturamento * 0.14) },
      { id: 'sai_3', categoria: 'Despesas Jurídico-Contábeis & Cartório', descricao: 'Honorários de contabilidade e taxas cartoriais', valor: Math.round(faturamento * 0.08) },
      { id: 'sai_4', categoria: 'Marketing, Prospecção & Comercial', descricao: 'Divulgação institucional e captação de clientes', valor: Math.round(faturamento * 0.06) }
    ],
    diagnostico_fomento_ies: {
      necessita_apoio_editais: true,
      urgencia: 'Alta',
      solicitacoes: [
        'Edital de auxílio deslocamento e hospedagem para membros em eventos oficiais do MEJ',
        `Acesso a laboratórios e cessão de licenças acadêmicas de software na ${ej.ies}`,
        'Apoio institucional no custeio das taxas cartoriais de averbação da diretoria'
      ],
      valor_estimado_necessario: 5500,
      justificativa_ej: `A ${ej.nome} tem excelência executiva, demandando apoio institucional da ${ej.ies} para redução de custos cartoriais e fomento a capacitações.`,
      parecer_orientador_fomento: `Recomendo que a Direção da Unidade e Pró-Reitoria de Extensão da ${ej.ies} implementem edital de fomento ou auxílio transporte para a EJ.`
    }
  };
}

function gerarJuridicoDinamico(ej) {
  return {
    id_ej: ej.id_ej,
    status_juridico: 'Regular',
    selo_ej_conformidade: '12/13 Documentos Validados',
    entregas_contabeis: 'OK',
    status_detalhado_contabil: 'Livro Diário escriturado, CRC ativo e CNDs federal, estadual e municipal regulares.',
    documentos_selo_ej: SELO_EJ_DOCUMENTOS.map((doc, i) => ({
      id: doc.id,
      status: i === 12 ? 'Pendente' : (i === 1 ? 'Em Renovação' : 'Regular'),
      validade: i === 12 ? '2025-11-30' : (i === 1 ? '2025-12-15' : 'Indeterminada'),
      obs: `Documento regularizado perante cartório e instâncias da ${ej.ies}.`
    })),
    riscos_identificados: [
      'Acompanhamento do calendário de renovação de certidões perante a Receita Federal e Prefeitura',
      'Assinatura tempestiva dos termos de voluntariado com os novos membros do processo seletivo'
    ]
  };
}

function gerarInternoDinamico(ej) {
  return {
    id_ej: ej.id_ej,
    membros_ativos: ej.membros_ativos || 18,
    taxa_evasao: 4.2,
    tempo_medio_permanencia_meses: 16.0,
    horas_capacitacao_membro: 32,
    csat_clientes: 9.3,
    nps_clientes: 82,
    pco_clima_membros: 88.5,
    meta_pco: 80.0
  };
}

function gerarExtensaoDinamica(ej) {
  const membros = ej.membros_ativos || 18;
  return {
    id_ej: ej.id_ej,
    alunos_graduacao_capacitados: membros * 3,
    alunos_impactados_projetos: membros * 8,
    horas_extensao_membros: membros * 22,
    horas_capacitacao_externa: membros * 6,
    horas_extensao_validadas: membros * 28,
    acoes_extensao: 4,
    parcerias_ies: 2,
    parcerias_mercado_governo: 3,
    visibilidade_gerada: `Divulgação nos canais oficiais e eventos acadêmicos da ${ej.ies}`
  };
}

function gerarIESEDinamico(ej) {
  return {
    id_ej: ej.id_ej,
    trimestre: '2025_Q3',
    dimensoes: {
      cultura_empreendedora: {
        reunioes_formais_coordenacao: true,
        participacao_semana_calouros: true,
        eventos_empreendedorismo_promovidos: true,
        disciplinas_empreendedorismo_apoio: true,
        pontos: 85
      },
      infraestrutura_capital: {
        espaco_fisico_dedicado: true,
        apoio_administrativo_secretaria: true,
        computadores_internet_dedicada: true,
        acesso_editais_internos_fomento: false,
        auxilio_deslocamento_eventos_mej: false,
        pontos: 65
      },
      extensao_articulacao: {
        curricularizacao_extensao_formal: true,
        horas_extensao_validadas_orientador: true,
        parceria_institucional_governo_mercado: true,
        divulgacao_canais_oficiais_ies: true,
        pontos: 90
      }
    },
    parecer_articulador_orientador: `A ${ej.ies} apoia a ${ej.nome} com espaço físico e incentivo acadêmico, recomendando-se ampliar a oferta de editais de fomento financeiro.`,
    selo_previsao: 'Ouro - IES Promotora do Empreendedorismo Universitário'
  };
}

// Funções de Inicialização e Persistência
export function getDatabase() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATABASE));
      const init = { ...INITIAL_DATABASE, Empresas_Juniores: getMapeamentoEJsCompletas(INITIAL_DATABASE.Empresas_Juniores) };
    return init;
    }
    const parsed = JSON.parse(raw);
    parsed.Empresas_Juniores = getMapeamentoEJsCompletas(parsed.Empresas_Juniores || INITIAL_DATABASE.Empresas_Juniores);
    return parsed;
  } catch (e) {
    console.error('Erro ao ler banco local:', e);
    return INITIAL_DATABASE;
  }
}

export function saveDatabase(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Erro ao salvar no banco local:', e);
  }
}

export function resetDatabase() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATABASE));
  return INITIAL_DATABASE;
}

// Helper: Cálculo de Eficiência Produtiva
export function calcularEficienciaProdutiva(receitaAcumulada, mesesDecorridos, numMembros) {
  if (!mesesDecorridos || !numMembros || mesesDecorridos <= 0 || numMembros <= 0) return 0;
  return Number((receitaAcumulada / (mesesDecorridos * numMembros)).toFixed(2));
}

// Helper consolidado da EJ
export function getDadosConsolidadosEJ(db, idEj, trimestre = '2025_Q3') {
  // Garantir lista completa
  const todasEJs = getMapeamentoEJsCompletas(db.Empresas_Juniores || []);
  const ej = todasEJs.find(e => e.id_ej === idEj) || db.Empresas_Juniores.find(e => e.id_ej === idEj) || todasEJs[0] || db.Empresas_Juniores[0];

  let relatorio = (db.Relatorios_Trimestrais && db.Relatorios_Trimestrais.find(r => r.id_ej === ej.id_ej && r.trimestre_ano === trimestre))
    || (db.Relatorios_Trimestrais && db.Relatorios_Trimestrais.find(r => r.id_ej === ej.id_ej));
  
  if (!relatorio) {
    relatorio = gerarRelatorioDinamico(ej, trimestre);
  }

  let mercado = db.Indicadores_Mercado && db.Indicadores_Mercado.find(m => m.id_relatorio === relatorio.id_relatorio);
  if (!mercado) {
    mercado = gerarMercadoDinamico(ej, relatorio.id_relatorio);
  }

  let execucaoFinanceira = db.Execucao_Financeira && db.Execucao_Financeira.find(ef => ef.id_ej === ej.id_ej);
  if (!execucaoFinanceira) {
    execucaoFinanceira = gerarExecucaoFinanceiraDinamica(ej);
  }

  let extensao = db.Indicadores_IES_Extensao && db.Indicadores_IES_Extensao.find(ex => ex.id_ej === ej.id_ej);
  if (!extensao) {
    extensao = gerarExtensaoDinamica(ej);
  }

  let juridico = db.Auditoria_Juridica && db.Auditoria_Juridica.find(j => j.id_ej === ej.id_ej);
  if (!juridico) {
    juridico = gerarJuridicoDinamico(ej);
  }

  let interno = db.Indicadores_Internos && db.Indicadores_Internos.find(i => i.id_ej === ej.id_ej);
  if (!interno) {
    interno = gerarInternoDinamico(ej);
  }

  let iese = db.IESE_Avaliacoes && db.IESE_Avaliacoes.find(ie => ie.id_ej === ej.id_ej);
  if (!iese) {
    iese = gerarIESEDinamico(ej);
  }

  const professor = getProfessorParaEJ(db, ej);

  const mesesDecorridos = trimestre.includes('Q1') ? 3 : trimestre.includes('Q2') ? 6 : trimestre.includes('Q3') ? 9 : 12;
  const receitaAcumulada = mercado.receita_total || mercado.faturamento_realizado || 0;
  const numMembros = ej.membros_ativos || interno.membros_ativos || 1;
  const eficienciaPorMembroMes = calcularEficienciaProdutiva(receitaAcumulada, mesesDecorridos, numMembros);

  const isAltaMaturidade = ej.cluster === 'Cluster 4' || ej.cluster === 'Cluster 5' || String(ej.cluster).includes('4') || String(ej.cluster).includes('5');

  return {
    ej,
    professor,
    relatorio,
    mercado,
    execucaoFinanceira,
    extensao,
    juridico,
    interno,
    iese,
    mesesDecorridos,
    eficienciaPorMembroMes,
    isAltaMaturidade
  };
}
