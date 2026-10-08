// src/data/ddrDatabase.ts
// Base de Dados Oficial DDR RioJunior 2026 - Diretoria de Desenvolvimento da Rede
// Contém todas as 75 Empresas Juniores federadas do Estado do Rio de Janeiro
// Acompanhamento mês a mês de faturamento executado, metas, número de membros e
// Indicadores Essenciais e Complementares do Planejamento Estratégico da Rede 2025/2027 (Brasil Júnior).

import { EJ } from '@/types';

export const DDR_KPIREDE_CONSOLIDADO = {
  "totalEJs": 75,
  "totalFaturamento": 2849609.1899999995,
  "totalMeta": 4448233.65,
  "percentualGlobal": 64.06,
  "totalMembros": 2017,
  "totalProjetos": 409,
  "ejsNoVerde": 50,
  "clusterStats": {
    "Cluster 1": {
      "count": 49,
      "faturamento": 395585.99999999994,
      "meta": 293669.55,
      "membros": 1085
    },
    "Cluster 2": {
      "count": 13,
      "faturamento": 220813.52000000002,
      "meta": 257726.1,
      "membros": 380
    },
    "Cluster 3": {
      "count": 5,
      "faturamento": 165053,
      "meta": 282838,
      "membros": 154
    },
    "Cluster 4": {
      "count": 1,
      "faturamento": 220610.28,
      "meta": 408000,
      "membros": 41
    },
    "Cluster 5": {
      "count": 7,
      "faturamento": 1847546.39,
      "meta": 3206000,
      "membros": 357
    }
  }
};

export const DDR_REGIOES = [
  "Centro Norte",
  "Centro Sul 1",
  "Centro Sul 2",
  "Centro-Sul 1",
  "Centro-Sul 2",
  "Norte",
  "Sul"
] as const;

export const DDR_CLUSTERS = [
  { id: 5, nome: 'Cluster 5 (Gigantes)', cor: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  { id: 4, nome: 'Cluster 4 (Alta Escala)', cor: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.4)' },
  { id: 3, nome: 'Cluster 3 (Consolidação)', cor: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.4)' },
  { id: 2, nome: 'Cluster 2 (Tração)', cor: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' },
  { id: 1, nome: 'Cluster 1 (Fundação)', cor: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.4)' }
];

export const DDR_EMPRESAS_JUNIORES: EJ[] = [
  {
    "id": "ej_078",
    "id_ej": "ej_078",
    "nome": "Agrha Consultoria",
    "slug": "agrha-consultoria",
    "logo_url": "/logos/agrha-consultoria.png",
    "cluster": 2,
    "cnpj": "19.813.363/0001-74",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Niterói",
    "cidade": "Niterói",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Ciência Ambiental, Engenharia Agrícola E Ambiental, Engenharia De Recursos Hídricos E Do Meio Ambiente",
    "ano_fundacao": 2014,
    "ano_federacao": 2014,
    "email": "marketing@agrha.com",
    "website": "https://www.agrha.com/",
    "membros_ativos": 17,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 17818.9,
    "faturamentoAtual": 300,
    "faturamentoQ1": 2300,
    "faturamentoQ2": 0,
    "faturamentoQ3": 4000,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 17818.9,
      "faturamento_realizado": 300,
      "percentual_alcance": 1.68,
      "ticket_medio": 300,
      "faturamento_por_membro": 17.65,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 10000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 10000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 2300,
          "faturamento_acumulado": 2300,
          "meta_mes": 10000,
          "percentual_meta": 23,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2300,
          "meta_mes": 10000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2300,
          "meta_mes": 10000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2300,
          "meta_mes": 10000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 4000,
          "faturamento_acumulado": 6300,
          "meta_mes": 10000,
          "percentual_meta": 40,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6300,
          "meta_mes": 10000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6300,
          "meta_mes": 10000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6300,
          "meta_mes": 10000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6300,
          "meta_mes": 10000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6300,
          "meta_mes": 10000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 17,
      "executores_mes": 3,
      "percentual_executores": 17.65,
      "faturamento_por_membro_mes": 1.4705882352941178,
      "retencao_1_ano_percentual": 82.6086956521739,
      "diversidade_minorizados_percentual": 40,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 17818.9,
          "realizado": 300,
          "percentual": 1.68,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 17.65,
          "quantidade_executores": 3,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 17.65,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 300,
          "parceiros": "Lignum Ambiental Jr."
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 40,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 2,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1159",
    "id_ej": "ej_1159",
    "nome": "AlQualis Jr.",
    "slug": "alqualis-jr",
    "logo_url": "/logos/alqualis-jr.png",
    "cluster": 1,
    "cnpj": "27.072.071/0001-56",
    "regiao": "Norte",
    "localizacao": "INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA FLUMINENSE - Bom Jesus do Itabapoana",
    "cidade": "Bom Jesus do Itabapoana",
    "ies": "INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA FLUMINENSE",
    "cursos_admitidos": "Ciência E Tecnologia De Alimentos",
    "ano_fundacao": 2018,
    "ano_federacao": 2018,
    "email": "contato@alqualisjunior.com.br",
    "website": "http://www.alqualisjunior.com.br",
    "membros_ativos": 12,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 29900,
    "faturamentoAtual": 94983.4,
    "faturamentoQ1": 0,
    "faturamentoQ2": 26000,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 29900,
      "faturamento_realizado": 94983.4,
      "percentual_alcance": 317.67,
      "ticket_medio": 0,
      "faturamento_por_membro": 7915.28,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 95000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 95000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 95000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 95000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 26000,
          "faturamento_acumulado": 26000,
          "meta_mes": 95000,
          "percentual_meta": 27.4,
          "contratos": 1,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 26000,
          "meta_mes": 95000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 26000,
          "meta_mes": 95000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 26000,
          "meta_mes": 95000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 26000,
          "meta_mes": 95000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 26000,
          "meta_mes": 95000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 26000,
          "meta_mes": 95000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 26000,
          "meta_mes": 95000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 659.6069444444444,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 29900,
          "realizado": 94983.4,
          "percentual": 317.67,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 4,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 7915.28,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1873",
    "id_ej": "ej_1873",
    "nome": "Âmbar Consultoria Ambiental Júnior",
    "slug": "ambar-consultoria-ambiental-junior",
    "logo_url": "/logos/ambar-consultoria-ambiental-junior.png",
    "cluster": 1,
    "cnpj": "30.599.648/0001-97",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Abi - Ciências Biológicas, Abi - Engenharia, Ciências Biológicas, Ciências Biológicas - Biologia Marinha, Ciências Biológicas - Biologia Vegetal, Ciências Biológicas - Ecologia, Ciências Biológicas - Zoologia, Ciências Matemáticas E Da Terra, Engenharia Ambiental, Engenharia Civil, Geografia, Geologia, Meteorologia",
    "ano_fundacao": 2020,
    "ano_federacao": 2020,
    "email": "ambarconsultoriajr@gmail.com",
    "website": "https://ambarconsultoriajr.com.br",
    "membros_ativos": 16,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CAOS",
    "faturamentoMeta": 6000,
    "faturamentoAtual": 3593.15,
    "faturamentoQ1": 0,
    "faturamentoQ2": 550,
    "faturamentoQ3": 300,
    "faturamentoQ4": 3150,
    "financeiro": {
      "meta_anual": 6000,
      "faturamento_realizado": 3593.15,
      "percentual_alcance": 59.89,
      "ticket_medio": 0,
      "faturamento_por_membro": 224.57,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 550,
          "faturamento_acumulado": 550,
          "meta_mes": 15000,
          "percentual_meta": 3.7,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 550,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 550,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 550,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 300,
          "faturamento_acumulado": 850,
          "meta_mes": 15000,
          "percentual_meta": 2,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 850,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 3150,
          "faturamento_acumulado": 4000,
          "meta_mes": 15000,
          "percentual_meta": 21,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4000,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4000,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 16,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 18.714322916666667,
      "retencao_1_ano_percentual": 71.4285714285714,
      "diversidade_minorizados_percentual": 85,
      "engajamento_mej_quantidade": 5,
      "engajamento_mej_percentual": 31.3
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 6000,
          "realizado": 3593.15,
          "percentual": 59.89,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 224.57,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 85,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 31.3,
          "membros": 5
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1631",
    "id_ej": "ej_1631",
    "nome": "Argos Consultoria Internacional",
    "slug": "argos-consultoria-internacional",
    "logo_url": "/logos/argos-consultoria-internacional.png",
    "cluster": 1,
    "cnpj": "23.359.387/0001-72",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Niterói",
    "cidade": "Niterói",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Relações Internacionais",
    "ano_fundacao": 2019,
    "ano_federacao": 2019,
    "email": "presidencia@argosjr.com",
    "website": "https://argosjr.com/",
    "membros_ativos": 45,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 10146.78,
    "faturamentoAtual": 3337.34,
    "faturamentoQ1": 0,
    "faturamentoQ2": 4314.97,
    "faturamentoQ3": 3719.52,
    "faturamentoQ4": 788.79,
    "financeiro": {
      "meta_anual": 10146.78,
      "faturamento_realizado": 3337.34,
      "percentual_alcance": 32.89,
      "ticket_medio": 0,
      "faturamento_por_membro": 74.16,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 20303.11,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 20303.11,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 20303.11,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 20303.11,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 3885.87,
          "faturamento_acumulado": 3885.87,
          "meta_mes": 20303.11,
          "percentual_meta": 19.1,
          "contratos": 2,
          "membros_executores": 12
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 429.1,
          "faturamento_acumulado": 4744.07,
          "meta_mes": 20303.11,
          "percentual_meta": 2.1,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 414,
          "faturamento_acumulado": 5158.07,
          "meta_mes": 20303.11,
          "percentual_meta": 2,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 3305.52,
          "faturamento_acumulado": 8463.59,
          "meta_mes": 20303.11,
          "percentual_meta": 16.3,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8463.59,
          "meta_mes": 20303.11,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8463.59,
          "meta_mes": 20303.11,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 788.79,
          "faturamento_acumulado": 9252.38,
          "meta_mes": 20303.11,
          "percentual_meta": 3.9,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9252.38,
          "meta_mes": 20303.11,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 45,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 6.18025925925926,
      "retencao_1_ano_percentual": 55.4054054054054,
      "diversidade_minorizados_percentual": 80,
      "engajamento_mej_quantidade": 6,
      "engajamento_mej_percentual": 13.3
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 10146.78,
          "realizado": 3337.34,
          "percentual": 32.89,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 74.16,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 80,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 13.3,
          "membros": 6
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3597",
    "id_ej": "ej_3597",
    "nome": "Ártemis Soluções Veterinárias",
    "slug": "artemis-solucoes-veterinarias",
    "logo_url": "/logos/artemis-solucoes-veterinarias.png",
    "cluster": 1,
    "cnpj": "63.247.319/0001-36",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Seropédica",
    "cidade": "Seropédica",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Medicina Veterinária",
    "ano_fundacao": 2025,
    "ano_federacao": 2025,
    "email": "contato@artemis-solucoes-veterinarias.com.br",
    "website": "https://artemis-solucoes-veterinarias.com.br",
    "membros_ativos": 32,
    "farol": "protagonista",
    "farol_original": "Amarelo",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 9660,
    "faturamentoAtual": 11515,
    "faturamentoQ1": 11514.99,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 9660,
      "faturamento_realizado": 11515,
      "percentual_alcance": 119.2,
      "ticket_medio": 35.984375,
      "faturamento_por_membro": 359.84,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 3838.33,
          "faturamento_acumulado": 3838.33,
          "meta_mes": 805,
          "percentual_meta": 476.8,
          "contratos": 1,
          "membros_executores": 25
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 3838.33,
          "faturamento_acumulado": 7676.66,
          "meta_mes": 805,
          "percentual_meta": 476.8,
          "contratos": 1,
          "membros_executores": 25
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 3838.33,
          "faturamento_acumulado": 11514.99,
          "meta_mes": 805,
          "percentual_meta": 476.8,
          "contratos": 1,
          "membros_executores": 25
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11514.99,
          "meta_mes": 805,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11514.99,
          "meta_mes": 805,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11514.99,
          "meta_mes": 805,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11514.99,
          "meta_mes": 805,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11514.99,
          "meta_mes": 805,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11514.99,
          "meta_mes": 805,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11514.99,
          "meta_mes": 805,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11514.99,
          "meta_mes": 805,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11514.99,
          "meta_mes": 805,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 32,
      "executores_mes": 25,
      "percentual_executores": 78.13,
      "faturamento_por_membro_mes": 35.984375,
      "retencao_1_ano_percentual": 20.5882352941176,
      "diversidade_minorizados_percentual": 90,
      "engajamento_mej_quantidade": 29,
      "engajamento_mej_percentual": 90.6
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 9660,
          "realizado": 11515,
          "percentual": 119.2,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 4,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 78.13,
          "quantidade_executores": 25,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 75,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 359.84,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 8400,
          "parceiros": "Multi Jr"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 90,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 90.6,
          "membros": 29
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 4,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1934",
    "id_ej": "ej_1934",
    "nome": "Auger PD&I",
    "slug": "auger-pd-i",
    "logo_url": "/logos/auger-pd-i.png",
    "cluster": 1,
    "cnpj": "26.516.876/0001-89",
    "regiao": "Centro-Sul 1",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Ciências Biológicas: Biofísica, Nanotecnologia",
    "ano_fundacao": 2021,
    "ano_federacao": 2021,
    "email": "comercial@augernano.com",
    "website": "https://auger-pd-i.com.br",
    "membros_ativos": 7,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 1020.78,
    "faturamentoQ1": 0,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 1020.78,
      "percentual_alcance": 68.05,
      "ticket_medio": 0,
      "faturamento_por_membro": 145.83,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15240.59,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 7,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 12.152142857142858,
      "retencao_1_ano_percentual": 87.5,
      "diversidade_minorizados_percentual": 75,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 1020.78,
          "percentual": 68.05,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 145.83,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 75,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1160",
    "id_ej": "ej_1160",
    "nome": "Aurea",
    "slug": "aurea",
    "logo_url": "/logos/aurea.png",
    "cluster": 3,
    "cnpj": "27.447.124/0001-76",
    "regiao": "Norte",
    "localizacao": "INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA FLUMINENSE - Campos dos Goytacazes",
    "cidade": "Campos dos Goytacazes",
    "ies": "INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA FLUMINENSE",
    "cursos_admitidos": "Arquitetura E Urbanismo, Design Gráfico, Engenharia De Computação, Engenharia De Controle E Automação, Engenharia Elétrica, Engenharia Mecânica, Sistemas De Informação",
    "ano_fundacao": 2018,
    "ano_federacao": 2018,
    "email": "contato@aureaej.com",
    "website": "http://www.aureaej.com",
    "membros_ativos": 55,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 41231,
    "faturamentoAtual": 28363,
    "faturamentoQ1": 23411.2,
    "faturamentoQ2": 1350,
    "faturamentoQ3": 8727,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 41231,
      "faturamento_realizado": 28363,
      "percentual_alcance": 68.79,
      "ticket_medio": 69.17804878,
      "faturamento_por_membro": 515.69,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 52943.91,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 5357,
          "faturamento_acumulado": 5357,
          "meta_mes": 52943.91,
          "percentual_meta": 10.1,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 18054.2,
          "faturamento_acumulado": 23411.2,
          "meta_mes": 52943.91,
          "percentual_meta": 34.1,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 23411.2,
          "meta_mes": 52943.91,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 23411.2,
          "meta_mes": 52943.91,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 1350,
          "faturamento_acumulado": 24761.2,
          "meta_mes": 52943.91,
          "percentual_meta": 2.5,
          "contratos": 1,
          "membros_executores": 10
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 8727,
          "faturamento_acumulado": 33488.2,
          "meta_mes": 52943.91,
          "percentual_meta": 16.5,
          "contratos": 2,
          "membros_executores": 8
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 33488.2,
          "meta_mes": 52943.91,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 33488.2,
          "meta_mes": 52943.91,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 33488.2,
          "meta_mes": 52943.91,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 33488.2,
          "meta_mes": 52943.91,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 33488.2,
          "meta_mes": 52943.91,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 55,
      "executores_mes": 21,
      "percentual_executores": 54.55,
      "faturamento_por_membro_mes": 69.17804878,
      "retencao_1_ano_percentual": 56.8965517241379,
      "diversidade_minorizados_percentual": 55,
      "engajamento_mej_quantidade": 25,
      "engajamento_mej_percentual": 45.5
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 41231,
          "realizado": 28363,
          "percentual": 68.79,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 5,
          "realizado": 8,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 54.55,
          "quantidade_executores": 21,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 61.54,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 515.69,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 2000,
          "parceiros": "expresse! consultoria"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 55,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 153.67,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 45.5,
          "membros": 25
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_466",
    "id_ej": "ej_466",
    "nome": "Ayra Consultoria",
    "slug": "ayra-consultoria",
    "logo_url": "/logos/ayra-consultoria.png",
    "cluster": 5,
    "cnpj": "05.333.233/0001-20",
    "regiao": "Centro-Sul 1",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Abi - Comunicação Social, Administração, Biblioteconomia E Gestão De Unidades De Informação, Ciências Contábeis, Ciências Econômicas",
    "ano_fundacao": 2003,
    "ano_federacao": 2003,
    "email": "presidente@ayraconsultoria.com",
    "website": "https://www.ayraconsultoria.com.br/",
    "membros_ativos": 30,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Impacto",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 360000,
    "faturamentoAtual": 115649.5,
    "faturamentoQ1": 10177.1,
    "faturamentoQ2": 66849.8,
    "faturamentoQ3": 153690.1,
    "faturamentoQ4": 42568.240000000005,
    "financeiro": {
      "meta_anual": 360000,
      "faturamento_realizado": 115649.5,
      "percentual_alcance": 32.12,
      "ticket_medio": 502.823913,
      "faturamento_por_membro": 3854.98,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 320000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 1943.1,
          "faturamento_acumulado": 1943.1,
          "meta_mes": 320000,
          "percentual_meta": 0.6,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 8234,
          "faturamento_acumulado": 10177.1,
          "meta_mes": 320000,
          "percentual_meta": 2.6,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 15094.8,
          "faturamento_acumulado": 25271.9,
          "meta_mes": 320000,
          "percentual_meta": 4.7,
          "contratos": 2,
          "membros_executores": 5
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 16955,
          "faturamento_acumulado": 42226.9,
          "meta_mes": 320000,
          "percentual_meta": 5.3,
          "contratos": 4,
          "membros_executores": 12
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 34800,
          "faturamento_acumulado": 80926.9,
          "meta_mes": 320000,
          "percentual_meta": 10.9,
          "contratos": 3,
          "membros_executores": 9
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 14250,
          "faturamento_acumulado": 95176.9,
          "meta_mes": 320000,
          "percentual_meta": 4.5,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 20420.1,
          "faturamento_acumulado": 115597,
          "meta_mes": 320000,
          "percentual_meta": 6.4,
          "contratos": 4,
          "membros_executores": 12
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 119020,
          "faturamento_acumulado": 234617,
          "meta_mes": 320000,
          "percentual_meta": 37.2,
          "contratos": 13,
          "membros_executores": 20
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 23900,
          "faturamento_acumulado": 258517,
          "meta_mes": 320000,
          "percentual_meta": 7.5,
          "contratos": 3,
          "membros_executores": 3
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 18668.24,
          "faturamento_acumulado": 277185.24,
          "meta_mes": 320000,
          "percentual_meta": 5.8,
          "contratos": 2,
          "membros_executores": 2
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 277185.24,
          "meta_mes": 320000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 30,
      "executores_mes": 15,
      "percentual_executores": 66.67,
      "faturamento_por_membro_mes": 502.823913,
      "retencao_1_ano_percentual": 51.063829787234,
      "diversidade_minorizados_percentual": 55,
      "engajamento_mej_quantidade": 13,
      "engajamento_mej_percentual": 43.3
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 360000,
          "realizado": 115649.5,
          "percentual": 32.12,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 45,
          "realizado": 11,
          "percentual": 24.4,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 66.67,
          "quantidade_executores": 15,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 6.9,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 3854.98,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 55,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 43.3,
          "membros": 13
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3174",
    "id_ej": "ej_3174",
    "nome": "Carioca Jr",
    "slug": "carioca-jr",
    "logo_url": "/logos/carioca-jr.png",
    "cluster": 1,
    "cnpj": "51.235.900/0001-59",
    "regiao": "Centro Sul 1",
    "localizacao": "CENTRO UNIVERSITÁRIO UNICARIOCA - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "CENTRO UNIVERSITÁRIO UNICARIOCA",
    "cursos_admitidos": "Administração, Análise E Desenvolvimento De Sistemas, Biomedicina, Ciência Da Computação, Ciências Contábeis, Comunicação Social - Jornalismo, Comunicação Social - Publicidade E Propaganda, Design, Direito, Engenharia Civil, Engenharia De Computação, Engenharia De Produção, Engenharia Elétrica, Gestão Comercial, Gestão De Recursos Humanos, Gestão Financeira, Jornalismo, Logística, Marketing, Pedagogia, Processos Gerenciais, Publicidade E Propaganda, Redes De Computadores, Serviço Social",
    "ano_fundacao": 2023,
    "ano_federacao": 2023,
    "email": "contato@carioca-jr.com.br",
    "website": "https://www.cariocajr.com.br/",
    "membros_ativos": 1,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 1667,
    "faturamentoQ1": 0,
    "faturamentoQ2": 1200,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 1667,
      "percentual_alcance": 111.13,
      "ticket_medio": 0,
      "faturamento_por_membro": 1667,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2005.6,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2005.6,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2005.6,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2005.6,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2005.6,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 1200,
          "faturamento_acumulado": 1200,
          "meta_mes": 2005.6,
          "percentual_meta": 59.8,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1200,
          "meta_mes": 2005.6,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1200,
          "meta_mes": 2005.6,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1200,
          "meta_mes": 2005.6,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1200,
          "meta_mes": 2005.6,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1200,
          "meta_mes": 2005.6,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1200,
          "meta_mes": 2005.6,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 1,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 138.91666666666666,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 1667,
          "percentual": 111.13,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 1667,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_2581",
    "id_ej": "ej_2581",
    "nome": "CASE Empresa Júnior",
    "slug": "case-empresa-junior",
    "logo_url": "/logos/case-empresa-junior.png",
    "cluster": 1,
    "cnpj": "26.676.739/0001-01",
    "regiao": "Norte",
    "localizacao": "FACULDADE PROFESSOR MIGUEL ÂNGELO DA SILVA SANTOS - Macaé",
    "cidade": "Macaé",
    "ies": "FACULDADE PROFESSOR MIGUEL ÂNGELO DA SILVA SANTOS",
    "cursos_admitidos": "Administração, Engenharia De Produção, Matemática, Sistema De Informação",
    "ano_fundacao": 2020,
    "ano_federacao": 2020,
    "email": "contato@caseej.com.br",
    "website": "https://caseej.com/",
    "membros_ativos": 7,
    "farol": "protagonista",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 3000,
    "faturamentoAtual": 16140,
    "faturamentoQ1": 600,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 3000,
      "faturamento_realizado": 16140,
      "percentual_alcance": 538,
      "ticket_medio": 89.66666667,
      "faturamento_por_membro": 2305.71,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 6065,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 6065,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 600,
          "faturamento_acumulado": 600,
          "meta_mes": 6065,
          "percentual_meta": 9.9,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 6065,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 6065,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 6065,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 6065,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 6065,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 6065,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 6065,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 6065,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 6065,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 7,
      "executores_mes": 4,
      "percentual_executores": 57.14,
      "faturamento_por_membro_mes": 89.66666667,
      "retencao_1_ano_percentual": 63.6363636363636,
      "diversidade_minorizados_percentual": 20,
      "engajamento_mej_quantidade": 5,
      "engajamento_mej_percentual": 71.4
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 3000,
          "realizado": 16140,
          "percentual": 538,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 4,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 57.14,
          "quantidade_executores": 4,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 2305.71,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 20,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 71.4,
          "membros": 5
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_2930",
    "id_ej": "ej_2930",
    "nome": "Catena Consultoria Eng. UFRJ",
    "slug": "catena-consultoria-eng-ufrj",
    "logo_url": "/logos/catena-consultoria-eng-ufrj.png",
    "cluster": 1,
    "cnpj": "41.680.675/0001-06",
    "regiao": "Norte",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Macaé",
    "cidade": "Macaé",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Abi - Engenharia, Engenharia Civil, Engenharia De Produção, Engenharia Mecânica",
    "ano_fundacao": 2021,
    "ano_federacao": 2021,
    "email": "catena.ufrj@gmail.com",
    "website": "http://www.catenaconsultoria.com.br",
    "membros_ativos": 17,
    "farol": "verde",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CAOS",
    "faturamentoMeta": 2530,
    "faturamentoAtual": 2340,
    "faturamentoQ1": 0,
    "faturamentoQ2": 2200,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 2530,
      "faturamento_realizado": 2340,
      "percentual_alcance": 92.49,
      "ticket_medio": 0,
      "faturamento_por_membro": 137.65,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1872,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1872,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1872,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 2200,
          "faturamento_acumulado": 2200,
          "meta_mes": 1872,
          "percentual_meta": 117.5,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2200,
          "meta_mes": 1872,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2200,
          "meta_mes": 1872,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2200,
          "meta_mes": 1872,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2200,
          "meta_mes": 1872,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2200,
          "meta_mes": 1872,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2200,
          "meta_mes": 1872,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2200,
          "meta_mes": 1872,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2200,
          "meta_mes": 1872,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 17,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 11.470588235294118,
      "retencao_1_ano_percentual": 66.6666666666667,
      "diversidade_minorizados_percentual": 80,
      "engajamento_mej_quantidade": 1,
      "engajamento_mej_percentual": 5.9
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 2530,
          "realizado": 2340,
          "percentual": 92.49,
          "status": "Em Andamento"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 137.65,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 80,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 5.9,
          "membros": 1
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_059",
    "id_ej": "ej_059",
    "nome": "CEFET Jr.",
    "slug": "cefet-jr",
    "logo_url": "/logos/cefet-jr.png",
    "cluster": 5,
    "cnpj": "04.585.938/0001-71",
    "regiao": "Centro-Sul 2",
    "localizacao": "CENTRO FEDERAL DE EDUCAÇÃO TECNOLÓGICA CELSO SUCKOW DA FONSECA - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "CENTRO FEDERAL DE EDUCAÇÃO TECNOLÓGICA CELSO SUCKOW DA FONSECA",
    "cursos_admitidos": "Administração, Ciência Da Computação, Engenharia Ambiental, Engenharia De Controle E Automação, Engenharia De Produção, Engenharia De Telecomunicações, Engenharia Elétrica, Engenharia Eletrônica, Engenharia Mecânica, Línguas Estrangeiras Aplicadas Às Negociações Internacionais",
    "ano_fundacao": 2002,
    "ano_federacao": 2002,
    "email": "vicepresidencia@cefetjr.com",
    "website": "http://cefetjr.com/",
    "membros_ativos": 80,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Impacto",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 500000,
    "faturamentoAtual": 266743.46,
    "faturamentoQ1": 53099.990000000005,
    "faturamentoQ2": 91290.29999999999,
    "faturamentoQ3": 93674.26000000001,
    "faturamentoQ4": 13795.2,
    "financeiro": {
      "meta_anual": 500000,
      "faturamento_realizado": 266743.46,
      "percentual_alcance": 53.35,
      "ticket_medio": 544.3744082,
      "faturamento_por_membro": 3334.29,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 28999.99,
          "faturamento_acumulado": 29000,
          "meta_mes": 1000001,
          "percentual_meta": 2.9,
          "contratos": 2,
          "membros_executores": 4
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 24100,
          "faturamento_acumulado": 53100,
          "meta_mes": 1000001,
          "percentual_meta": 2.4,
          "contratos": 2,
          "membros_executores": 4
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 53100,
          "meta_mes": 1000001,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 78018.9,
          "faturamento_acumulado": 131118.9,
          "meta_mes": 1000001,
          "percentual_meta": 7.8,
          "contratos": 3,
          "membros_executores": 10
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 131118.9,
          "meta_mes": 1000001,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 13271.4,
          "faturamento_acumulado": 144390.3,
          "meta_mes": 1000001,
          "percentual_meta": 1.3,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 58302.12,
          "faturamento_acumulado": 202692.42,
          "meta_mes": 1000001,
          "percentual_meta": 5.8,
          "contratos": 4,
          "membros_executores": 4
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 21804.14,
          "faturamento_acumulado": 224496.56,
          "meta_mes": 1000001,
          "percentual_meta": 2.2,
          "contratos": 2,
          "membros_executores": 2
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 13568,
          "faturamento_acumulado": 238064.56,
          "meta_mes": 1000001,
          "percentual_meta": 1.4,
          "contratos": 2,
          "membros_executores": 12
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 238064.56,
          "meta_mes": 1000001,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 13795.2,
          "faturamento_acumulado": 251859.76,
          "meta_mes": 1000001,
          "percentual_meta": 1.4,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 251859.76,
          "meta_mes": 1000001,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 80,
      "executores_mes": 28,
      "percentual_executores": 42.5,
      "faturamento_por_membro_mes": 544.3744082,
      "retencao_1_ano_percentual": 55.7692307692308,
      "diversidade_minorizados_percentual": 60,
      "engajamento_mej_quantidade": 68,
      "engajamento_mej_percentual": 85
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 500000,
          "realizado": 266743.46,
          "percentual": 53.35,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 63,
          "realizado": 15,
          "percentual": 23.8,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 42.5,
          "quantidade_executores": 28,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 13.04,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 3334.29,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 7677.2,
          "parceiros": "Estratégia Jr.,Focus Consultoria"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 60,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 85,
          "membros": 68
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 1,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_429",
    "id_ej": "ej_429",
    "nome": "CETA Jr.",
    "slug": "ceta-jr",
    "logo_url": "/logos/ceta-jr.png",
    "cluster": 3,
    "cnpj": "19.329.516/0001-02",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Seropédica",
    "cidade": "Seropédica",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Engenharia De Alimentos",
    "ano_fundacao": 2015,
    "ano_federacao": 2015,
    "email": "projetos@cetajr.com",
    "website": "https://www.cetajrconsultoria.com/",
    "membros_ativos": 8,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Impacto",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 31600,
    "faturamentoAtual": 31615.09,
    "faturamentoQ1": 113.15,
    "faturamentoQ2": 8846.18,
    "faturamentoQ3": 12263.79,
    "faturamentoQ4": 7450.36,
    "financeiro": {
      "meta_anual": 31600,
      "faturamento_realizado": 31615.09,
      "percentual_alcance": 100.05,
      "ticket_medio": 451.6441429,
      "faturamento_por_membro": 3951.89,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 90000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 113.15,
          "faturamento_acumulado": 563.15,
          "meta_mes": 90000,
          "percentual_meta": 0.1,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 563.15,
          "meta_mes": 90000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 8846.18,
          "faturamento_acumulado": 9409.33,
          "meta_mes": 90000,
          "percentual_meta": 9.8,
          "contratos": 4,
          "membros_executores": 12
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9409.33,
          "meta_mes": 90000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9409.33,
          "meta_mes": 90000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 86.11,
          "faturamento_acumulado": 9495.44,
          "meta_mes": 90000,
          "percentual_meta": 0.1,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9495.44,
          "meta_mes": 90000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 12177.68,
          "faturamento_acumulado": 21673.12,
          "meta_mes": 90000,
          "percentual_meta": 13.5,
          "contratos": 3,
          "membros_executores": 11
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 5172.53,
          "faturamento_acumulado": 26845.65,
          "meta_mes": 90000,
          "percentual_meta": 5.7,
          "contratos": 3,
          "membros_executores": 8
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 2277.83,
          "faturamento_acumulado": 29488.48,
          "meta_mes": 90000,
          "percentual_meta": 2.5,
          "contratos": 2,
          "membros_executores": 7
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 29488.48,
          "meta_mes": 90000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 8,
      "executores_mes": 8,
      "percentual_executores": 100,
      "faturamento_por_membro_mes": 451.6441429,
      "retencao_1_ano_percentual": 41.1764705882353,
      "diversidade_minorizados_percentual": 90,
      "engajamento_mej_quantidade": 8,
      "engajamento_mej_percentual": 100
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 31600,
          "realizado": 31615.09,
          "percentual": 100.05,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 4,
          "realizado": 23,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 100,
          "quantidade_executores": 8,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 50,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 3951.89,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 6283.08,
          "parceiros": "Fórmula Consultoria,Farmac Jr.,Fórmula Consultoria"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 90,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 49.33,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 100,
          "membros": 8
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 5,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1649",
    "id_ej": "ej_1649",
    "nome": "CONPLEQ Consultoria",
    "slug": "conpleq-consultoria",
    "logo_url": "/logos/conpleq-consultoria.png",
    "cluster": 1,
    "cnpj": "23.891.261/0001-44",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO",
    "cursos_admitidos": "Engenharia Química, Química",
    "ano_fundacao": 2019,
    "ano_federacao": 2019,
    "email": "conpleq@conpleq.com.br",
    "website": "https://www.conpleq.com.br/#",
    "membros_ativos": 30,
    "farol": "protagonista",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 4000,
    "faturamentoAtual": 7448,
    "faturamentoQ1": 0,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 4000,
      "faturamento_realizado": 7448,
      "percentual_alcance": 186.2,
      "ticket_medio": 744.8,
      "faturamento_por_membro": 248.27,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 7362.711999999999,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 30,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 744.8,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 4000,
          "realizado": 7448,
          "percentual": 186.2,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 248.27,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 213,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 3,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1648",
    "id_ej": "ej_1648",
    "nome": "Destro Consultoria Jurídica",
    "slug": "destro-consultoria-juridica",
    "logo_url": "/logos/destro-consultoria-juridica.png",
    "cluster": 1,
    "cnpj": "30.448.715/0001-72",
    "regiao": "Centro-Sul 1",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Direito",
    "ano_fundacao": 2019,
    "ano_federacao": 2019,
    "email": "gestaodepessoas@destroconjur.com.br",
    "website": "https://www.destroconjur.com.br/",
    "membros_ativos": 49,
    "farol": "protagonista",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 5000,
    "faturamentoQ1": 0,
    "faturamentoQ2": 30,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 5000,
      "percentual_alcance": 333.33,
      "ticket_medio": 41.66666667,
      "faturamento_por_membro": 102.04,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 10720,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 10720,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 10720,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 30,
          "faturamento_acumulado": 30,
          "meta_mes": 10720,
          "percentual_meta": 0.3,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 30,
          "meta_mes": 10720,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 30,
          "meta_mes": 10720,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 30,
          "meta_mes": 10720,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 30,
          "meta_mes": 10720,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 30,
          "meta_mes": 10720,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 30,
          "meta_mes": 10720,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 30,
          "meta_mes": 10720,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 30,
          "meta_mes": 10720,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 49,
      "executores_mes": 17,
      "percentual_executores": 34.69,
      "faturamento_por_membro_mes": 41.66666667,
      "retencao_1_ano_percentual": 33.8461538461538,
      "diversidade_minorizados_percentual": 90,
      "engajamento_mej_quantidade": 12,
      "engajamento_mej_percentual": 24.5
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 5000,
          "percentual": 333.33,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 4,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 34.69,
          "quantidade_executores": 17,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 102.04,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 90,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 24.5,
          "membros": 12
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 1,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_2969",
    "id_ej": "ej_2969",
    "nome": "ECOLagos Educação Ambiental",
    "slug": "ecolagos-educacao-ambiental",
    "logo_url": "/logos/ecolagos-educacao-ambiental.png",
    "cluster": 1,
    "cnpj": "44.416.441/0001-44",
    "regiao": "Norte",
    "localizacao": "UNIVERSIDADE ESTADUAL DO NORTE FLUMINENSE DARCY RIBEIRO - Macaé",
    "cidade": "Macaé",
    "ies": "UNIVERSIDADE ESTADUAL DO NORTE FLUMINENSE DARCY RIBEIRO",
    "cursos_admitidos": "Ciências Biológicas",
    "ano_fundacao": 2021,
    "ano_federacao": 2021,
    "email": "ej.ecolagos@gmail.com",
    "website": "https://ejecolagos.wixsite.com/ecolagos?fbclid=IwAR1E10llpr4gEO2n2xUchdqsGEJpu5495zaHnBheWkTVPKBJjm-VcE5b3MM",
    "membros_ativos": 12,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CAOS",
    "faturamentoMeta": 10603.91999999999,
    "faturamentoAtual": 730,
    "faturamentoQ1": 0,
    "faturamentoQ2": 19.9,
    "faturamentoQ3": 9200.9,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 10603.91999999999,
      "faturamento_realizado": 730,
      "percentual_alcance": 6.88,
      "ticket_medio": 0,
      "faturamento_por_membro": 60.83,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 8500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 8500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 8500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 19.9,
          "faturamento_acumulado": 19.9,
          "meta_mes": 8500,
          "percentual_meta": 0.2,
          "contratos": 1,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 19.9,
          "meta_mes": 8500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 19.9,
          "meta_mes": 8500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 19.9,
          "meta_mes": 8500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 19.9,
          "meta_mes": 8500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 9200.9,
          "faturamento_acumulado": 9220.8,
          "meta_mes": 8500,
          "percentual_meta": 108.2,
          "contratos": 1,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9220.8,
          "meta_mes": 8500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9220.8,
          "meta_mes": 8500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9220.8,
          "meta_mes": 8500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 5.069444444444445,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 10603.91999999999,
          "realizado": 730,
          "percentual": 6.88,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 60.83,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_374",
    "id_ej": "ej_374",
    "nome": "Economus Consultoria Júnior",
    "slug": "economus-consultoria-junior",
    "logo_url": "/logos/economus-consultoria-junior.png",
    "cluster": 1,
    "cnpj": "04.340.194/0001-25",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO",
    "cursos_admitidos": "Ciência Da Computação, Ciência Econômica, Ciências Atuariais, Estatística, Matemática, Relações Internacionais",
    "ano_fundacao": 2014,
    "ano_federacao": 2014,
    "email": "comercial@economusconsultoria.com.br",
    "website": "https://economusconsultoria.com",
    "membros_ativos": 44,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 18000,
    "faturamentoAtual": 12000,
    "faturamentoQ1": 0,
    "faturamentoQ2": 1080,
    "faturamentoQ3": 8300,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 18000,
      "faturamento_realizado": 12000,
      "percentual_alcance": 66.67,
      "ticket_medio": 17.91044776,
      "faturamento_por_membro": 272.73,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 1080,
          "faturamento_acumulado": 1080,
          "meta_mes": 30000,
          "percentual_meta": 3.6,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1080,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 8300,
          "faturamento_acumulado": 9380,
          "meta_mes": 30000,
          "percentual_meta": 27.7,
          "contratos": 1,
          "membros_executores": 8
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9380,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9380,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9380,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9380,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9380,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 44,
      "executores_mes": 6,
      "percentual_executores": 25,
      "faturamento_por_membro_mes": 17.91044776,
      "retencao_1_ano_percentual": 31.0344827586207,
      "diversidade_minorizados_percentual": 75,
      "engajamento_mej_quantidade": 23,
      "engajamento_mej_percentual": 52.3
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 18000,
          "realizado": 12000,
          "percentual": 66.67,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 25,
          "quantidade_executores": 6,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 25,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 272.73,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 75,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 211,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 52.3,
          "membros": 23
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 3,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3210",
    "id_ej": "ej_3210",
    "nome": "Eficiência Júnior",
    "slug": "eficiencia-junior",
    "logo_url": "/logos/eficiencia-junior.png",
    "cluster": 1,
    "cnpj": "43.510.354/0001-99",
    "regiao": "Centro Norte",
    "localizacao": "CENTRO FEDERAL DE EDUCAÇÃO TECNOLÓGICA CELSO SUCKOW DA FONSECA - Nova Friburgo",
    "cidade": "Nova Friburgo",
    "ies": "CENTRO FEDERAL DE EDUCAÇÃO TECNOLÓGICA CELSO SUCKOW DA FONSECA",
    "cursos_admitidos": "Engenharia Elétrica, Física, Gestão De Turismo, Sistemas De Informação",
    "ano_fundacao": 2022,
    "ano_federacao": 2022,
    "email": "contato@eficiencia-junior.com.br",
    "website": "https://eficiencia-junior.com.br",
    "membros_ativos": 5,
    "farol": "vermelho",
    "farol_original": "Zerada",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 1000,
    "faturamentoQ1": 0,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 1000,
      "percentual_alcance": 66.67,
      "ticket_medio": 5.882352941,
      "faturamento_por_membro": 200,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 5,
      "executores_mes": 3,
      "percentual_executores": 60,
      "faturamento_por_membro_mes": 5.882352941,
      "retencao_1_ano_percentual": 40,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 1,
      "engajamento_mej_percentual": 20
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 1000,
          "percentual": 66.67,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 60,
          "quantidade_executores": 3,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 200,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 20,
          "membros": 1
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 1,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_072",
    "id_ej": "ej_072",
    "nome": "EJCM",
    "slug": "ejcm",
    "logo_url": "/logos/ejcm.png",
    "cluster": 2,
    "cnpj": "39.081.849/0001-72",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Ciência Da Computação, Ciências Matemáticas E Da Terra, Ciências Matemáticas E Da Terra - Analista De Suporte À Decisão, Comunicação Visual Design, Desenho Industrial - Projeto De Produto, Engenharia Eletrônica E De Computação",
    "ano_fundacao": 1998,
    "ano_federacao": 1998,
    "email": "contato@ejcm.com.br",
    "website": "http://www.ejcm.com.br",
    "membros_ativos": 62,
    "farol": "protagonista",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CRIA",
    "faturamentoMeta": 23500,
    "faturamentoAtual": 61300,
    "faturamentoQ1": 0,
    "faturamentoQ2": 0,
    "faturamentoQ3": 2570,
    "faturamentoQ4": 18625.28,
    "financeiro": {
      "meta_anual": 23500,
      "faturamento_realizado": 61300,
      "percentual_alcance": 260.85,
      "ticket_medio": 191.5625,
      "faturamento_por_membro": 988.71,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 26000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 26000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 26000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 26000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 26000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 26000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 2570,
          "faturamento_acumulado": 2570,
          "meta_mes": 26000,
          "percentual_meta": 9.9,
          "contratos": 1,
          "membros_executores": 10
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2570,
          "meta_mes": 26000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2570,
          "meta_mes": 26000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2570,
          "meta_mes": 26000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 18625.28,
          "faturamento_acumulado": 21195.28,
          "meta_mes": 26000,
          "percentual_meta": 71.6,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 21195.28,
          "meta_mes": 26000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 62,
      "executores_mes": 21,
      "percentual_executores": 32.26,
      "faturamento_por_membro_mes": 191.5625,
      "retencao_1_ano_percentual": 40,
      "diversidade_minorizados_percentual": 65,
      "engajamento_mej_quantidade": 23,
      "engajamento_mej_percentual": 37.1
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 23500,
          "realizado": 61300,
          "percentual": 260.85,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 32.26,
          "quantidade_executores": 21,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 988.71,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 65,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 37.1,
          "membros": 23
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_470",
    "id_ej": "ej_470",
    "nome": "Empresa Júnior Meta Consultoria",
    "slug": "empresa-junior-meta-consultoria",
    "logo_url": "/logos/empresa-junior-meta-consultoria.png",
    "cluster": 5,
    "cnpj": "00.498.057/0001-62",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Niterói",
    "cidade": "Niterói",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Arquitetura E Urbanismo, Ciência Da Computação, Engenharia Civil, Engenharia De Produção, Engenharia De Telecomunicações, Engenharia Elétrica, Engenharia Mecânica, Sistemas De Informação",
    "ano_fundacao": 1998,
    "ano_federacao": 1998,
    "email": "contato@metaconsultoria.com",
    "website": "http://www.metaconsultoria.com/",
    "membros_ativos": 73,
    "farol": "verde",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Impacto",
    "classificacao": "CRIA",
    "faturamentoMeta": 280000,
    "faturamentoAtual": 243750,
    "faturamentoQ1": 19804.71,
    "faturamentoQ2": 66106.56999999999,
    "faturamentoQ3": 51632,
    "faturamentoQ4": 30885,
    "financeiro": {
      "meta_anual": 280000,
      "faturamento_realizado": 243750,
      "percentual_alcance": 87.05,
      "ticket_medio": 3482.142857,
      "faturamento_por_membro": 3339.04,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 5450,
          "faturamento_acumulado": 5450,
          "meta_mes": 197000,
          "percentual_meta": 2.8,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 5450,
          "meta_mes": 197000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 14354.71,
          "faturamento_acumulado": 19804.71,
          "meta_mes": 197000,
          "percentual_meta": 7.3,
          "contratos": 4,
          "membros_executores": 14
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 47995.81,
          "faturamento_acumulado": 70300.52,
          "meta_mes": 197000,
          "percentual_meta": 24.4,
          "contratos": 4,
          "membros_executores": 12
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 70300.52,
          "meta_mes": 197000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 18110.76,
          "faturamento_acumulado": 88411.28,
          "meta_mes": 197000,
          "percentual_meta": 9.2,
          "contratos": 3,
          "membros_executores": 6
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 30152,
          "faturamento_acumulado": 118563.28,
          "meta_mes": 197000,
          "percentual_meta": 15.3,
          "contratos": 5,
          "membros_executores": 3
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 4815,
          "faturamento_acumulado": 123378.28,
          "meta_mes": 197000,
          "percentual_meta": 2.4,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 16665,
          "faturamento_acumulado": 140043.28,
          "meta_mes": 197000,
          "percentual_meta": 8.5,
          "contratos": 3,
          "membros_executores": 6
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 30885,
          "faturamento_acumulado": 170928.28,
          "meta_mes": 197000,
          "percentual_meta": 15.7,
          "contratos": 3,
          "membros_executores": 6
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 170928.28,
          "meta_mes": 197000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 170928.28,
          "meta_mes": 197000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 73,
      "executores_mes": 48,
      "percentual_executores": 78.08,
      "faturamento_por_membro_mes": 3482.142857,
      "retencao_1_ano_percentual": 59.4827586206897,
      "diversidade_minorizados_percentual": 50,
      "engajamento_mej_quantidade": 55,
      "engajamento_mej_percentual": 75.3
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 280000,
          "realizado": 243750,
          "percentual": 87.05,
          "status": "Em Andamento"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 35,
          "realizado": 17,
          "percentual": 48.6,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 78.08,
          "quantidade_executores": 48,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 60.87,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 3339.04,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 6700,
          "parceiros": "P&Q Engenharia Jr"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 50,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 41.78,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 75.3,
          "membros": 55
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 5,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_755",
    "id_ej": "ej_755",
    "nome": "Engloba Consultoria",
    "slug": "engloba-consultoria",
    "logo_url": "/logos/engloba-consultoria.png",
    "cluster": 1,
    "cnpj": "28.559.262/0001-00",
    "regiao": "Norte",
    "localizacao": "UNIVERSIDADE ESTADUAL DO NORTE FLUMINENSE DARCY RIBEIRO - Campos dos Goytacazes",
    "cidade": "Campos dos Goytacazes",
    "ies": "UNIVERSIDADE ESTADUAL DO NORTE FLUMINENSE DARCY RIBEIRO",
    "cursos_admitidos": "Agronomia, Engenharia Civil, Engenharia De Produção, Engenharia Metalúrgica",
    "ano_fundacao": 2017,
    "ano_federacao": 2017,
    "email": "contato@englobaconsultoria.com.br",
    "website": "https://www.englobaconsultoria.com.br",
    "membros_ativos": 35,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 10530,
    "faturamentoAtual": 7027,
    "faturamentoQ1": 4760,
    "faturamentoQ2": 2445,
    "faturamentoQ3": 920,
    "faturamentoQ4": 900,
    "financeiro": {
      "meta_anual": 10530,
      "faturamento_realizado": 7027,
      "percentual_alcance": 66.73,
      "ticket_medio": 41.33529412,
      "faturamento_por_membro": 200.77,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 10740,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 1500,
          "faturamento_acumulado": 1500,
          "meta_mes": 10740,
          "percentual_meta": 14,
          "contratos": 1,
          "membros_executores": 7
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 3260,
          "faturamento_acumulado": 4760,
          "meta_mes": 10740,
          "percentual_meta": 30.4,
          "contratos": 1,
          "membros_executores": 11
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4760,
          "meta_mes": 10740,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 945,
          "faturamento_acumulado": 5705,
          "meta_mes": 10740,
          "percentual_meta": 8.8,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 1500,
          "faturamento_acumulado": 7205,
          "meta_mes": 10740,
          "percentual_meta": 14,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 7205,
          "meta_mes": 10740,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 920,
          "faturamento_acumulado": 8125,
          "meta_mes": 10740,
          "percentual_meta": 8.6,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8125,
          "meta_mes": 10740,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8125,
          "meta_mes": 10740,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 900,
          "faturamento_acumulado": 9025,
          "meta_mes": 10740,
          "percentual_meta": 8.4,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9025,
          "meta_mes": 10740,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 35,
      "executores_mes": 14,
      "percentual_executores": 42.86,
      "faturamento_por_membro_mes": 41.33529412,
      "retencao_1_ano_percentual": 84.7826086956522,
      "diversidade_minorizados_percentual": 65,
      "engajamento_mej_quantidade": 21,
      "engajamento_mej_percentual": 60
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 10530,
          "realizado": 7027,
          "percentual": 66.73,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 5,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 42.86,
          "quantidade_executores": 14,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 50,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 200.77,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 65,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 60,
          "membros": 21
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 1,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_2579",
    "id_ej": "ej_2579",
    "nome": "Env Júnior - Soluções Sustentáveis",
    "slug": "env-junior-solucoes-sustentaveis",
    "logo_url": "/logos/env-junior-solucoes-sustentaveis.png",
    "cluster": 1,
    "cnpj": "40.629.957/0001-16",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Niterói",
    "cidade": "Niterói",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Ciências Biológicas, Engenharia Agrícola E Ambiental",
    "ano_fundacao": 2021,
    "ano_federacao": 2021,
    "email": "contato@envjunior.com",
    "website": "https://www.envjunior.com.br/",
    "membros_ativos": 13,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 1000,
    "faturamentoQ1": 0,
    "faturamentoQ2": 45,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 1000,
      "percentual_alcance": 66.67,
      "ticket_medio": 20,
      "faturamento_por_membro": 76.92,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 45,
          "faturamento_acumulado": 45,
          "meta_mes": 5000,
          "percentual_meta": 0.9,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 45,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 45,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 45,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 45,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 45,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 45,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 45,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 45,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 13,
      "executores_mes": 3,
      "percentual_executores": 28,
      "faturamento_por_membro_mes": 20,
      "retencao_1_ano_percentual": 63.1578947368421,
      "diversidade_minorizados_percentual": 95,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 1000,
          "percentual": 66.67,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 28,
          "quantidade_executores": 3,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 50,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 76.92,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 95,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_272",
    "id_ej": "ej_272",
    "nome": "ESPM Jr.",
    "slug": "espm-jr",
    "logo_url": "/logos/espm-jr.png",
    "cluster": 5,
    "cnpj": "03.419.601/0001-21",
    "regiao": "Centro-Sul 1",
    "localizacao": "ESCOLA SUPERIOR DE PROPAGANDA E MARKETING DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "ESCOLA SUPERIOR DE PROPAGANDA E MARKETING DO RIO DE JANEIRO",
    "cursos_admitidos": "Administração, Comunicação Social - Publicidade E Propaganda, Design, Jornalismo",
    "ano_fundacao": 2011,
    "ano_federacao": 2011,
    "email": "diretoriapresidencia@espmjr.com",
    "website": "http://www.espmjr.com/",
    "membros_ativos": 34,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 320000,
    "faturamentoAtual": 243517,
    "faturamentoQ1": 137385.99,
    "faturamentoQ2": 25340,
    "faturamentoQ3": 53199.2,
    "faturamentoQ4": 72068.6,
    "financeiro": {
      "meta_anual": 320000,
      "faturamento_realizado": 243517,
      "percentual_alcance": 76.1,
      "ticket_medio": 2213.790909,
      "faturamento_por_membro": 7162.26,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 125685.99,
          "faturamento_acumulado": 126934,
          "meta_mes": 310000,
          "percentual_meta": 40.5,
          "contratos": 7,
          "membros_executores": 21
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 11700,
          "faturamento_acumulado": 138634,
          "meta_mes": 310000,
          "percentual_meta": 3.8,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 138634,
          "meta_mes": 310000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 138634,
          "meta_mes": 310000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 25340,
          "faturamento_acumulado": 163974,
          "meta_mes": 310000,
          "percentual_meta": 8.2,
          "contratos": 2,
          "membros_executores": 6
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 163974,
          "meta_mes": 310000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 23100,
          "faturamento_acumulado": 188274,
          "meta_mes": 310000,
          "percentual_meta": 7.5,
          "contratos": 2,
          "membros_executores": 8
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 22347.2,
          "faturamento_acumulado": 211821.2,
          "meta_mes": 310000,
          "percentual_meta": 7.2,
          "contratos": 2,
          "membros_executores": 6
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 7752,
          "faturamento_acumulado": 219573.2,
          "meta_mes": 310000,
          "percentual_meta": 2.5,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 50220.2,
          "faturamento_acumulado": 269793.4,
          "meta_mes": 310000,
          "percentual_meta": 16.2,
          "contratos": 4,
          "membros_executores": 9
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 11750.4,
          "faturamento_acumulado": 281543.8,
          "meta_mes": 310000,
          "percentual_meta": 3.8,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 10098,
          "faturamento_acumulado": 291641.8,
          "meta_mes": 310000,
          "percentual_meta": 3.3,
          "contratos": 1,
          "membros_executores": 3
        }
      ]
    },
    "membros": {
      "total_ativos": 34,
      "executores_mes": 19,
      "percentual_executores": 67.65,
      "faturamento_por_membro_mes": 2213.790909,
      "retencao_1_ano_percentual": 45,
      "diversidade_minorizados_percentual": 95,
      "engajamento_mej_quantidade": 19,
      "engajamento_mej_percentual": 55.9
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 320000,
          "realizado": 243517,
          "percentual": 76.1,
          "status": "Em Andamento"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 40,
          "realizado": 21,
          "percentual": 52.5,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 67.65,
          "quantidade_executores": 19,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 8.7,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 7162.26,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 13140,
          "parceiros": "expresse! consultoria"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 95,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 258,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 55.9,
          "membros": 19
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 1,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1647",
    "id_ej": "ej_1647",
    "nome": "Estratégia Jr.",
    "slug": "estrategia-jr",
    "logo_url": "/logos/estrategia-jr.png",
    "cluster": 2,
    "cnpj": "16.587.285/0001-49",
    "regiao": "Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Campos dos Goytacazes",
    "cidade": "Campos dos Goytacazes",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Ciências Econômicas, Ciências Sociais, Geografia, História, Psicologia, Serviço Social",
    "ano_fundacao": 2019,
    "ano_federacao": 2019,
    "email": "estrategiajr@gmail.com",
    "website": "http://estrategiajrconsultoria.com.br/",
    "membros_ativos": 27,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 20000,
    "faturamentoAtual": 11850,
    "faturamentoQ1": 2487.63,
    "faturamentoQ2": 4325,
    "faturamentoQ3": 6315,
    "faturamentoQ4": 2680,
    "financeiro": {
      "meta_anual": 20000,
      "faturamento_realizado": 11850,
      "percentual_alcance": 59.25,
      "ticket_medio": 91.15384615,
      "faturamento_por_membro": 438.89,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 1310,
          "faturamento_acumulado": 1310,
          "meta_mes": 22000,
          "percentual_meta": 6,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 1177.63,
          "faturamento_acumulado": 2487.63,
          "meta_mes": 22000,
          "percentual_meta": 5.4,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2487.63,
          "meta_mes": 22000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2487.63,
          "meta_mes": 22000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 2900,
          "faturamento_acumulado": 5987.63,
          "meta_mes": 22000,
          "percentual_meta": 13.2,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 1425,
          "faturamento_acumulado": 7412.63,
          "meta_mes": 22000,
          "percentual_meta": 6.5,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 3750,
          "faturamento_acumulado": 11162.63,
          "meta_mes": 22000,
          "percentual_meta": 17,
          "contratos": 1,
          "membros_executores": 9
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11162.63,
          "meta_mes": 22000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 2565,
          "faturamento_acumulado": 13727.63,
          "meta_mes": 22000,
          "percentual_meta": 11.7,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 2680,
          "faturamento_acumulado": 16407.63,
          "meta_mes": 22000,
          "percentual_meta": 12.2,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 16407.63,
          "meta_mes": 22000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 16407.63,
          "meta_mes": 22000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 27,
      "executores_mes": 5,
      "percentual_executores": 25.93,
      "faturamento_por_membro_mes": 91.15384615,
      "retencao_1_ano_percentual": 54.5454545454545,
      "diversidade_minorizados_percentual": 90,
      "engajamento_mej_quantidade": 14,
      "engajamento_mej_percentual": 51.9
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 20000,
          "realizado": 11850,
          "percentual": 59.25,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 4,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 25.93,
          "quantidade_executores": 5,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 438.89,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 2000,
          "parceiros": "CEFET Jr."
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 90,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 51.9,
          "membros": 14
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1671",
    "id_ej": "ej_1671",
    "nome": "Etica Jr",
    "slug": "etica-jr",
    "logo_url": "/logos/etica-jr.png",
    "cluster": 1,
    "cnpj": "01.594.040/0001-71",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO - Resende",
    "cidade": "Resende",
    "ies": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO",
    "cursos_admitidos": "Engenharia De Produção, Engenharia Mecânica, Engenharia Química",
    "ano_fundacao": 2019,
    "ano_federacao": 2019,
    "email": "etica.jr@gmail.com",
    "website": "https://eticajrconsultoria.com/",
    "membros_ativos": 13,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 5200,
    "faturamentoAtual": 7000,
    "faturamentoQ1": 0,
    "faturamentoQ2": 1000,
    "faturamentoQ3": 3500,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 5200,
      "faturamento_realizado": 7000,
      "percentual_alcance": 134.62,
      "ticket_medio": 31.81818182,
      "faturamento_por_membro": 538.46,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 42000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 42000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 42000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 1000,
          "faturamento_acumulado": 1000,
          "meta_mes": 42000,
          "percentual_meta": 2.4,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1000,
          "meta_mes": 42000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1000,
          "meta_mes": 42000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 3500,
          "faturamento_acumulado": 4500,
          "meta_mes": 42000,
          "percentual_meta": 8.3,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4500,
          "meta_mes": 42000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4500,
          "meta_mes": 42000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4500,
          "meta_mes": 42000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4500,
          "meta_mes": 42000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4500,
          "meta_mes": 42000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 13,
      "executores_mes": 6,
      "percentual_executores": 46.15,
      "faturamento_por_membro_mes": 31.81818182,
      "retencao_1_ano_percentual": 60,
      "diversidade_minorizados_percentual": 85,
      "engajamento_mej_quantidade": 2,
      "engajamento_mej_percentual": 15.4
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 5200,
          "realizado": 7000,
          "percentual": 134.62,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 46.15,
          "quantidade_executores": 6,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 538.46,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 85,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 15.4,
          "membros": 2
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 1,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_2970",
    "id_ej": "ej_2970",
    "nome": "Evolution Soluções Ambientais",
    "slug": "evolution-solucoes-ambientais",
    "logo_url": "/logos/evolution-solucoes-ambientais.png",
    "cluster": 1,
    "cnpj": "44.463.877/0001-94",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE VEIGA DE ALMEIDA - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE VEIGA DE ALMEIDA",
    "cursos_admitidos": "Administração, Ciências Biológicas, Ciências Contábeis, Comunicação Social - Publicidade E Propaganda, Direito, Engenharia Ambiental, Engenharia De Computação, Engenharia De Produção, Geografia, Gestão De Recursos Humanos, Jornalismo, Psicologia",
    "ano_fundacao": 2021,
    "ano_federacao": 2021,
    "email": "diretoriaej.logistica@gmail.com",
    "website": "https://consultoriaevolution.wixsite.com/ejevolution",
    "membros_ativos": 18,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 45,
    "faturamentoQ1": 0,
    "faturamentoQ2": 10,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 45,
      "percentual_alcance": 3,
      "ticket_medio": 0.3214285714,
      "faturamento_por_membro": 2.5,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 10,
          "faturamento_acumulado": 587,
          "meta_mes": 1500,
          "percentual_meta": 0.7,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 587,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 587,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 587,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 587,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 587,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 587,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 587,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 587,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 18,
      "executores_mes": 6,
      "percentual_executores": 38,
      "faturamento_por_membro_mes": 0.3214285714,
      "retencao_1_ano_percentual": 28,
      "diversidade_minorizados_percentual": 90,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 45,
          "percentual": 3,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 38,
          "quantidade_executores": 6,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 100,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 2.5,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 90,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 1,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1016",
    "id_ej": "ej_1016",
    "nome": "Expand Jr. - Consultoria Internacional",
    "slug": "expand-jr-consultoria-internacional",
    "logo_url": "/logos/expand-jr-consultoria-internacional.png",
    "cluster": 1,
    "cnpj": "28.318.312/0001-67",
    "regiao": "Centro-Sul 1",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Relações Internacionais",
    "ano_fundacao": 2018,
    "ano_federacao": 2018,
    "email": "contato@expandjr.com",
    "website": "https://expandjunior.com/",
    "membros_ativos": 67,
    "farol": "protagonista",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 2352.15,
    "faturamentoQ1": 0,
    "faturamentoQ2": 220,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 2352.15,
      "percentual_alcance": 156.81,
      "ticket_medio": 3.312887324,
      "faturamento_por_membro": 35.11,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 27621,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 27621,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 27621,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 220,
          "faturamento_acumulado": 220,
          "meta_mes": 27621,
          "percentual_meta": 0.8,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 220,
          "meta_mes": 27621,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 220,
          "meta_mes": 27621,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 220,
          "meta_mes": 27621,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 220,
          "meta_mes": 27621,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 220,
          "meta_mes": 27621,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 220,
          "meta_mes": 27621,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 220,
          "meta_mes": 27621,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 220,
          "meta_mes": 27621,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 67,
      "executores_mes": 16,
      "percentual_executores": 28.36,
      "faturamento_por_membro_mes": 3.312887324,
      "retencao_1_ano_percentual": 18.5567010309278,
      "diversidade_minorizados_percentual": 80,
      "engajamento_mej_quantidade": 16,
      "engajamento_mej_percentual": 23.9
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 2352.15,
          "percentual": 156.81,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 28.36,
          "quantidade_executores": 16,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 35.11,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 80,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 23.9,
          "membros": 16
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_386",
    "id_ej": "ej_386",
    "nome": "expresse! consultoria",
    "slug": "expresse-consultoria",
    "logo_url": "/logos/expresse-consultoria.png",
    "cluster": 2,
    "cnpj": "19.092.442/0001-33",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO",
    "cursos_admitidos": "Jornalismo, Relações Públicas",
    "ano_fundacao": 2015,
    "ano_federacao": 2015,
    "email": "projetos@expresseconsultoria.com.br",
    "website": "http://expresseconsultoria.com.br/",
    "membros_ativos": 11,
    "farol": "protagonista",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 26335,
    "faturamentoAtual": 29576,
    "faturamentoQ1": 0,
    "faturamentoQ2": 0,
    "faturamentoQ3": 4100,
    "faturamentoQ4": 21842,
    "financeiro": {
      "meta_anual": 26335,
      "faturamento_realizado": 29576,
      "percentual_alcance": 112.31,
      "ticket_medio": 68.78139535,
      "faturamento_por_membro": 2688.73,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 22883,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 22883,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 22883,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 22883,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 22883,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 22883,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 200,
          "faturamento_acumulado": 200,
          "meta_mes": 22883,
          "percentual_meta": 0.9,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 1500,
          "faturamento_acumulado": 1700,
          "meta_mes": 22883,
          "percentual_meta": 6.6,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 2400,
          "faturamento_acumulado": 27380,
          "meta_mes": 22883,
          "percentual_meta": 10.5,
          "contratos": 2,
          "membros_executores": 5
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 21842,
          "faturamento_acumulado": 49222,
          "meta_mes": 22883,
          "percentual_meta": 95.5,
          "contratos": 2,
          "membros_executores": 8
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 49222,
          "meta_mes": 22883,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 49222,
          "meta_mes": 22883,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 11,
      "executores_mes": 10,
      "percentual_executores": 90.91,
      "faturamento_por_membro_mes": 68.78139535,
      "retencao_1_ano_percentual": 89.4736842105263,
      "diversidade_minorizados_percentual": 100,
      "engajamento_mej_quantidade": 6,
      "engajamento_mej_percentual": 54.5
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 26335,
          "realizado": 29576,
          "percentual": 112.31,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 4,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 90.91,
          "quantidade_executores": 10,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 2688.73,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 100,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 54.5,
          "membros": 6
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 2,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3365",
    "id_ej": "ej_3365",
    "nome": "Fácil Consultoria",
    "slug": "facil-consultoria",
    "logo_url": "/logos/facil-consultoria.png",
    "cluster": 1,
    "cnpj": "03.463.571/0001-50",
    "regiao": "Centro Norte",
    "localizacao": "CENTRO UNIVERSITÁRIO SERRA DOS ÓRGÃOS - Teresópolis",
    "cidade": "Teresópolis",
    "ies": "CENTRO UNIVERSITÁRIO SERRA DOS ÓRGÃOS",
    "cursos_admitidos": "Administração, Arquitetura E Urbanismo, Biomedicina, Ciência Da Computação, Ciências Contábeis, Direito, Enfermagem, Engenharia Civil, Engenharia De Produção, Farmácia, Fisioterapia, Medicina, Medicina Veterinária, Nutrição, Odontologia, Psicologia",
    "ano_fundacao": 2023,
    "ano_federacao": 2023,
    "email": "contato@facil-consultoria.com.br",
    "website": "https://facil-consultoria.com.br",
    "membros_ativos": 5,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 1200,
    "faturamentoQ1": 0,
    "faturamentoQ2": 800,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 1200,
      "percentual_alcance": 80,
      "ticket_medio": 2.222222222,
      "faturamento_por_membro": 240,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 3700,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 3700,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 3700,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 3700,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 800,
          "faturamento_acumulado": 800,
          "meta_mes": 3700,
          "percentual_meta": 21.6,
          "contratos": 2,
          "membros_executores": 2
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 800,
          "meta_mes": 3700,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 800,
          "meta_mes": 3700,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 800,
          "meta_mes": 3700,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 800,
          "meta_mes": 3700,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 800,
          "meta_mes": 3700,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 800,
          "meta_mes": 3700,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 800,
          "meta_mes": 3700,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 5,
      "executores_mes": 5,
      "percentual_executores": 100,
      "faturamento_por_membro_mes": 2.222222222,
      "retencao_1_ano_percentual": 100,
      "diversidade_minorizados_percentual": 100,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 1200,
          "percentual": 80,
          "status": "Em Andamento"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 100,
          "quantidade_executores": 5,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 240,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 100,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3162",
    "id_ej": "ej_3162",
    "nome": "FAMATH Júnior",
    "slug": "famath-junior",
    "logo_url": "/logos/famath-junior.png",
    "cluster": 1,
    "cnpj": "26.354.884/0001-76",
    "regiao": "Centro Norte",
    "localizacao": "Faculdade Maria Thereza - Niterói",
    "cidade": "Niterói",
    "ies": "Faculdade Maria Thereza",
    "cursos_admitidos": "Administração, Ciências Biológicas, Pedagogia, Psicologia",
    "ano_fundacao": 2021,
    "ano_federacao": 2021,
    "email": "empresajunior@famath.com.br",
    "website": "https://famath-junior.com.br",
    "membros_ativos": 12,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 2009,
    "faturamentoQ1": 0,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 2009,
      "percentual_alcance": 133.93,
      "ticket_medio": 0,
      "faturamento_por_membro": 167.42,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2407.2,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 13.95138888888889,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 2009,
          "percentual": 133.93,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 167.42,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3178",
    "id_ej": "ej_3178",
    "nome": "Farmac Jr.",
    "slug": "farmac-jr",
    "logo_url": "/logos/farmac-jr.png",
    "cluster": 1,
    "cnpj": "43.908.737/0001-10",
    "regiao": "Norte",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Macaé",
    "cidade": "Macaé",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Farmácia, Nutrição, Química",
    "ano_fundacao": 2021,
    "ano_federacao": 2021,
    "email": "farmacjr@gmail.com",
    "website": "https://farmacjr.com/",
    "membros_ativos": 22,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 5000,
    "faturamentoAtual": 1145,
    "faturamentoQ1": 1760,
    "faturamentoQ2": 1480,
    "faturamentoQ3": 1105,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 5000,
      "faturamento_realizado": 1145,
      "percentual_alcance": 22.9,
      "ticket_medio": 0,
      "faturamento_por_membro": 52.05,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 1760,
          "faturamento_acumulado": 1760,
          "meta_mes": 5000,
          "percentual_meta": 35.2,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1760,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1760,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 880,
          "faturamento_acumulado": 2640,
          "meta_mes": 5000,
          "percentual_meta": 17.6,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 600,
          "faturamento_acumulado": 3240,
          "meta_mes": 5000,
          "percentual_meta": 12,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3240,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3240,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 1105,
          "faturamento_acumulado": 4345,
          "meta_mes": 5000,
          "percentual_meta": 22.1,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4345,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4345,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4345,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4345,
          "meta_mes": 5000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 22,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 4.337121212121212,
      "retencao_1_ano_percentual": 50,
      "diversidade_minorizados_percentual": 85,
      "engajamento_mej_quantidade": 3,
      "engajamento_mej_percentual": 13.6
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 5000,
          "realizado": 1145,
          "percentual": 22.9,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 52.05,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 85,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 13.6,
          "membros": 3
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1475",
    "id_ej": "ej_1475",
    "nome": "FGV Jr.",
    "slug": "fgv-jr",
    "logo_url": "/logos/fgv-jr.png",
    "cluster": 4,
    "cnpj": "06.140.373/0001-44",
    "regiao": "Centro-Sul 1",
    "localizacao": "ESCOLA BRASILEIRA DE ADMINISTRAÇÃO PÚBLICA E DE EMPRESAS - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "ESCOLA BRASILEIRA DE ADMINISTRAÇÃO PÚBLICA E DE EMPRESAS",
    "cursos_admitidos": "Administração",
    "ano_fundacao": 2019,
    "ano_federacao": 2019,
    "email": "mercado@fgvjr.com",
    "website": "http://www.fgvjr.com/",
    "membros_ativos": 41,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Impacto",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 408000,
    "faturamentoAtual": 220610.28,
    "faturamentoQ1": 92928.78,
    "faturamentoQ2": 87980.68,
    "faturamentoQ3": 156523.97,
    "faturamentoQ4": 50700.880000000005,
    "financeiro": {
      "meta_anual": 408000,
      "faturamento_realizado": 220610.28,
      "percentual_alcance": 54.07,
      "ticket_medio": 1297.707529,
      "faturamento_por_membro": 5380.74,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 35000,
          "faturamento_acumulado": 40000,
          "meta_mes": 230166.3225,
          "percentual_meta": 15.2,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 33900,
          "faturamento_acumulado": 73900,
          "meta_mes": 230166.3225,
          "percentual_meta": 14.7,
          "contratos": 2,
          "membros_executores": 7
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 24028.78,
          "faturamento_acumulado": 97928.78,
          "meta_mes": 230166.3225,
          "percentual_meta": 10.4,
          "contratos": 4,
          "membros_executores": 10
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 38189.22,
          "faturamento_acumulado": 136118,
          "meta_mes": 230166.3225,
          "percentual_meta": 16.6,
          "contratos": 4,
          "membros_executores": 13
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 27252.46,
          "faturamento_acumulado": 163370.46,
          "meta_mes": 230166.3225,
          "percentual_meta": 11.8,
          "contratos": 2,
          "membros_executores": 6
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 22539,
          "faturamento_acumulado": 185909.46,
          "meta_mes": 230166.3225,
          "percentual_meta": 9.8,
          "contratos": 3,
          "membros_executores": 6
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 49963.35,
          "faturamento_acumulado": 235872.81,
          "meta_mes": 230166.3225,
          "percentual_meta": 21.7,
          "contratos": 3,
          "membros_executores": 9
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 49154.55,
          "faturamento_acumulado": 285027.36,
          "meta_mes": 230166.3225,
          "percentual_meta": 21.4,
          "contratos": 4,
          "membros_executores": 13
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 57406.07,
          "faturamento_acumulado": 342433.43,
          "meta_mes": 230166.3225,
          "percentual_meta": 24.9,
          "contratos": 5,
          "membros_executores": 11
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 32347.8,
          "faturamento_acumulado": 374781.23,
          "meta_mes": 230166.3225,
          "percentual_meta": 14.1,
          "contratos": 3,
          "membros_executores": 8
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 18353.08,
          "faturamento_acumulado": 393134.31,
          "meta_mes": 230166.3225,
          "percentual_meta": 8,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 393134.31,
          "meta_mes": 230166.3225,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 41,
      "executores_mes": 36,
      "percentual_executores": 92.68,
      "faturamento_por_membro_mes": 1297.707529,
      "retencao_1_ano_percentual": 50,
      "diversidade_minorizados_percentual": 70,
      "engajamento_mej_quantidade": 26,
      "engajamento_mej_percentual": 63.4
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 408000,
          "realizado": 220610.28,
          "percentual": 54.07,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 51,
          "realizado": 21,
          "percentual": 41.2,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 92.68,
          "quantidade_executores": 36,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 5380.74,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 70,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 63.4,
          "membros": 26
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_747",
    "id_ej": "ej_747",
    "nome": "Flora Júnior",
    "slug": "flora-junior",
    "logo_url": "/logos/flora-junior.png",
    "cluster": 2,
    "cnpj": "05.916.514/0001-05",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Seropédica",
    "cidade": "Seropédica",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Engenharia Florestal",
    "ano_fundacao": 2017,
    "ano_federacao": 2017,
    "email": "contato@florajunior.com",
    "website": "https://florajr.signaljr.com.br/",
    "membros_ativos": 23,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 23652.07,
    "faturamentoAtual": 12525,
    "faturamentoQ1": 8145.62,
    "faturamentoQ2": 250,
    "faturamentoQ3": 12171.39,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 23652.07,
      "faturamento_realizado": 12525,
      "percentual_alcance": 52.96,
      "ticket_medio": 15.09036145,
      "faturamento_por_membro": 544.57,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 5500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 7695.62,
          "faturamento_acumulado": 7695.62,
          "meta_mes": 5500,
          "percentual_meta": 139.9,
          "contratos": 2,
          "membros_executores": 9
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 450,
          "faturamento_acumulado": 8145.62,
          "meta_mes": 5500,
          "percentual_meta": 8.2,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8145.62,
          "meta_mes": 5500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8145.62,
          "meta_mes": 5500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 250,
          "faturamento_acumulado": 8395.62,
          "meta_mes": 5500,
          "percentual_meta": 4.5,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 1958,
          "faturamento_acumulado": 10353.62,
          "meta_mes": 5500,
          "percentual_meta": 35.6,
          "contratos": 2,
          "membros_executores": 6
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 10353.62,
          "meta_mes": 5500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 10213.39,
          "faturamento_acumulado": 20567.01,
          "meta_mes": 5500,
          "percentual_meta": 185.7,
          "contratos": 2,
          "membros_executores": 7
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 20567.01,
          "meta_mes": 5500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 20567.01,
          "meta_mes": 5500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 20567.01,
          "meta_mes": 5500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 23,
      "executores_mes": 15,
      "percentual_executores": 65.22,
      "faturamento_por_membro_mes": 15.09036145,
      "retencao_1_ano_percentual": 34.7826086956522,
      "diversidade_minorizados_percentual": 80,
      "engajamento_mej_quantidade": 17,
      "engajamento_mej_percentual": 73.9
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 23652.07,
          "realizado": 12525,
          "percentual": 52.96,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 6,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 65.22,
          "quantidade_executores": 15,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 66.67,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 544.57,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 132,
          "parceiros": "SOLARMATERIAIS"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 80,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 14.33,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 73.9,
          "membros": 17
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 4,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_042",
    "id_ej": "ej_042",
    "nome": "Fluxo Consultoria",
    "slug": "fluxo-consultoria",
    "logo_url": "/logos/fluxo-consultoria.png",
    "cluster": 5,
    "cnpj": "72.387.608/0001-21",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Arquitetura E Urbanismo, Comunicação Visual Design, Engenharia Ambiental, Engenharia (Ciclo Básico), Engenharia Civil, Engenharia De Alimentos, Engenharia De Bioprocessos, Engenharia De Computação E Informação, Engenharia De Controle E Automação, Engenharia De Materiais, Engenharia De Produção, Engenharia Elétrica, Engenharia Eletrônica E De Computação, Engenharia Mecânica, Engenharia Metalúrgica, Engenharia Naval E Oceânica, Engenharia Nuclear, Engenharia Química",
    "ano_fundacao": 1998,
    "ano_federacao": 1998,
    "email": "fluxo@poli.ufrj.br",
    "website": "http://fluxoconsultoria.poli.ufrj.br/",
    "membros_ativos": 71,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Impacto",
    "classificacao": "CRIA",
    "faturamentoMeta": 1450000,
    "faturamentoAtual": 833613.24,
    "faturamentoQ1": 356143.97,
    "faturamentoQ2": 595385.6699999999,
    "faturamentoQ3": 152054.26,
    "faturamentoQ4": 165353.93,
    "financeiro": {
      "meta_anual": 1450000,
      "faturamento_realizado": 833613.24,
      "percentual_alcance": 57.49,
      "ticket_medio": 1852.473867,
      "faturamento_por_membro": 11741.03,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 42443,
          "faturamento_acumulado": 42443,
          "meta_mes": 1250000,
          "percentual_meta": 3.4,
          "contratos": 4,
          "membros_executores": 11
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 21659,
          "faturamento_acumulado": 64102,
          "meta_mes": 1250000,
          "percentual_meta": 1.7,
          "contratos": 2,
          "membros_executores": 6
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 292041.97,
          "faturamento_acumulado": 356143.97,
          "meta_mes": 1250000,
          "percentual_meta": 23.4,
          "contratos": 17,
          "membros_executores": 33
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 86147.2,
          "faturamento_acumulado": 442291.17,
          "meta_mes": 1250000,
          "percentual_meta": 6.9,
          "contratos": 7,
          "membros_executores": 17
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 251873.36,
          "faturamento_acumulado": 694164.53,
          "meta_mes": 1250000,
          "percentual_meta": 20.1,
          "contratos": 15,
          "membros_executores": 21
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 257365.11,
          "faturamento_acumulado": 951529.64,
          "meta_mes": 1250000,
          "percentual_meta": 20.6,
          "contratos": 24,
          "membros_executores": 16
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 93249.26,
          "faturamento_acumulado": 1044778.9,
          "meta_mes": 1250000,
          "percentual_meta": 7.5,
          "contratos": 5,
          "membros_executores": 8
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 19042,
          "faturamento_acumulado": 1063820.9,
          "meta_mes": 1250000,
          "percentual_meta": 1.5,
          "contratos": 2,
          "membros_executores": 2
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 39763,
          "faturamento_acumulado": 1103583.9,
          "meta_mes": 1250000,
          "percentual_meta": 3.2,
          "contratos": 6,
          "membros_executores": 7
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 121417,
          "faturamento_acumulado": 1225000.9,
          "meta_mes": 1250000,
          "percentual_meta": 9.7,
          "contratos": 5,
          "membros_executores": 10
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 43936.93,
          "faturamento_acumulado": 1268937.83,
          "meta_mes": 1250000,
          "percentual_meta": 3.5,
          "contratos": 4,
          "membros_executores": 12
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1268937.83,
          "meta_mes": 1250000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 71,
      "executores_mes": 43,
      "percentual_executores": 63.38,
      "faturamento_por_membro_mes": 1852.473867,
      "retencao_1_ano_percentual": 87.3684210526316,
      "diversidade_minorizados_percentual": 55,
      "engajamento_mej_quantidade": 29,
      "engajamento_mej_percentual": 40.8
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1450000,
          "realizado": 833613.24,
          "percentual": 57.49,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 181,
          "realizado": 57,
          "percentual": 31.5,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 63.38,
          "quantidade_executores": 43,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 28.92,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 11741.03,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 55,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 40.8,
          "membros": 29
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_375",
    "id_ej": "ej_375",
    "nome": "Focus Consultoria",
    "slug": "focus-consultoria",
    "logo_url": "/logos/focus-consultoria.png",
    "cluster": 2,
    "cnpj": "11.503.720/0001-96",
    "regiao": "Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Rio das Ostras",
    "cidade": "Rio das Ostras",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Ciência Da Computação, Engenharia De Produção, Produção Cultural, Psicologia",
    "ano_fundacao": 2011,
    "ano_federacao": 2011,
    "email": "contato@consultoriafocus.com",
    "website": "http://www.consultoriafocus.com/",
    "membros_ativos": 43,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CRIA",
    "faturamentoMeta": 25000,
    "faturamentoAtual": 10958.97,
    "faturamentoQ1": 0,
    "faturamentoQ2": 3900,
    "faturamentoQ3": 2639,
    "faturamentoQ4": 7213.55,
    "financeiro": {
      "meta_anual": 25000,
      "faturamento_realizado": 10958.97,
      "percentual_alcance": 43.84,
      "ticket_medio": 84.29976923,
      "faturamento_por_membro": 254.86,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 70000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 70000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 70000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 70000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 3900,
          "faturamento_acumulado": 9350,
          "meta_mes": 70000,
          "percentual_meta": 5.6,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9350,
          "meta_mes": 70000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 2639,
          "faturamento_acumulado": 11989,
          "meta_mes": 70000,
          "percentual_meta": 3.8,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11989,
          "meta_mes": 70000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11989,
          "meta_mes": 70000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11989,
          "meta_mes": 70000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11989,
          "meta_mes": 70000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 7213.55,
          "faturamento_acumulado": 19202.55,
          "meta_mes": 70000,
          "percentual_meta": 10.3,
          "contratos": 1,
          "membros_executores": 3
        }
      ]
    },
    "membros": {
      "total_ativos": 43,
      "executores_mes": 9,
      "percentual_executores": 34.88,
      "faturamento_por_membro_mes": 84.29976923,
      "retencao_1_ano_percentual": 46.1538461538462,
      "diversidade_minorizados_percentual": 65,
      "engajamento_mej_quantidade": 40,
      "engajamento_mej_percentual": 93
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 25000,
          "realizado": 10958.97,
          "percentual": 43.84,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 34.88,
          "quantidade_executores": 9,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 33.33,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 254.86,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 8515.8,
          "parceiros": "CEFET Jr."
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 65,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 93,
          "membros": 40
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_277",
    "id_ej": "ej_277",
    "nome": "Fórmula Consultoria",
    "slug": "formula-consultoria",
    "logo_url": "/logos/formula-consultoria.png",
    "cluster": 2,
    "cnpj": "14.530.783/0001-20",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Farmácia",
    "ano_fundacao": 2016,
    "ano_federacao": 2016,
    "email": "comercial@formulajr.com.br",
    "website": "http://formulajr.com.br/",
    "membros_ativos": 54,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 24000,
    "faturamentoAtual": 15934.22,
    "faturamentoQ1": 180,
    "faturamentoQ2": 2957.9,
    "faturamentoQ3": 4818,
    "faturamentoQ4": 10538.9,
    "financeiro": {
      "meta_anual": 24000,
      "faturamento_realizado": 15934.22,
      "percentual_alcance": 66.39,
      "ticket_medio": 45.52634286,
      "faturamento_por_membro": 295.08,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 45000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 180,
          "faturamento_acumulado": 180,
          "meta_mes": 45000,
          "percentual_meta": 0.4,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 180,
          "meta_mes": 45000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 180,
          "meta_mes": 45000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 2957.9,
          "faturamento_acumulado": 3137.9,
          "meta_mes": 45000,
          "percentual_meta": 6.6,
          "contratos": 3,
          "membros_executores": 9
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3137.9,
          "meta_mes": 45000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 2016,
          "faturamento_acumulado": 5153.9,
          "meta_mes": 45000,
          "percentual_meta": 4.5,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 5153.9,
          "meta_mes": 45000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 2802,
          "faturamento_acumulado": 7955.9,
          "meta_mes": 45000,
          "percentual_meta": 6.2,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 10538.9,
          "faturamento_acumulado": 18494.8,
          "meta_mes": 45000,
          "percentual_meta": 23.4,
          "contratos": 13,
          "membros_executores": 26
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 18494.8,
          "meta_mes": 45000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 18494.8,
          "meta_mes": 45000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 54,
      "executores_mes": 32,
      "percentual_executores": 64.81,
      "faturamento_por_membro_mes": 45.52634286,
      "retencao_1_ano_percentual": 50.8196721311475,
      "diversidade_minorizados_percentual": 90,
      "engajamento_mej_quantidade": 23,
      "engajamento_mej_percentual": 42.6
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 24000,
          "realizado": 15934.22,
          "percentual": 66.39,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 17,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 64.81,
          "quantidade_executores": 32,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.74,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 94.44,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 295.08,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 366.664,
          "faturamento_colaborativo": 2333.32,
          "parceiros": "CETA Jr. ,CETA Jr. ,33.663.683/0001-16"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 90,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 42.6,
          "membros": 23
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 8,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3482",
    "id_ej": "ej_3482",
    "nome": "Healtech Junior",
    "slug": "healtech-junior",
    "logo_url": "/logos/healtech-junior.png",
    "cluster": 1,
    "cnpj": "55.211.768/0001-04",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Nova Friburgo",
    "cidade": "Nova Friburgo",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Biomedicina, Fonoaudiologia, Odontologia",
    "ano_fundacao": 2024,
    "ano_federacao": 2024,
    "email": "contato@healtech-junior.com.br",
    "website": "https://healtechjunior.wixsite.com/healtechjunior",
    "membros_ativos": 4,
    "farol": "vermelho",
    "farol_original": "Amarelo",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 3000,
    "faturamentoAtual": 2000.8,
    "faturamentoQ1": 500,
    "faturamentoQ2": 167,
    "faturamentoQ3": 1088.8,
    "faturamentoQ4": 245,
    "financeiro": {
      "meta_anual": 3000,
      "faturamento_realizado": 2000.8,
      "percentual_alcance": 0,
      "ticket_medio": 666.9333333333333,
      "faturamento_por_membro": 500.2,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 2000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 500,
          "faturamento_acumulado": 500,
          "meta_mes": 2000,
          "percentual_meta": 25,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 167,
          "faturamento_acumulado": 667,
          "meta_mes": 2000,
          "percentual_meta": 8.3,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 667,
          "meta_mes": 2000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 667,
          "meta_mes": 2000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 667,
          "meta_mes": 2000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 1088.8,
          "faturamento_acumulado": 1755.8,
          "meta_mes": 2000,
          "percentual_meta": 54.4,
          "contratos": 2,
          "membros_executores": 5
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1755.8,
          "meta_mes": 2000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1755.8,
          "meta_mes": 2000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1755.8,
          "meta_mes": 2000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 245,
          "faturamento_acumulado": 2000.8,
          "meta_mes": 2000,
          "percentual_meta": 12.3,
          "contratos": 1,
          "membros_executores": 3
        }
      ]
    },
    "membros": {
      "total_ativos": 4,
      "executores_mes": 0,
      "percentual_executores": 25,
      "faturamento_por_membro_mes": 41.68333333333333,
      "retencao_1_ano_percentual": 44.4444444444444,
      "diversidade_minorizados_percentual": 75,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 3000,
          "realizado": 2000.8,
          "percentual": 0,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 3,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 25,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 500.2,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 75,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_015",
    "id_ej": "ej_015",
    "nome": "Hidros Consultoria",
    "slug": "hidros-consultoria",
    "logo_url": "/logos/hidros-consultoria.png",
    "cluster": 3,
    "cnpj": "03.334.068/0001-03",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO",
    "cursos_admitidos": "Administração, Ciência Da Computação, Ciências Contábeis, Engenharia Ambiental E Sanitária, Engenharia Cartográfica, Engenharia Civil, Engenharia De Computação, Engenharia De Produção, Engenharia Elétrica, Engenharia Mecânica",
    "ano_fundacao": 1998,
    "ano_federacao": 1998,
    "email": "presidencia@hidrosconsultoria.com.br",
    "website": "http://www.hidrosconsultoria.com.br/",
    "membros_ativos": 56,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 110000,
    "faturamentoAtual": 81298.07,
    "faturamentoQ1": 15664.64,
    "faturamentoQ2": 23965.510000000002,
    "faturamentoQ3": 39754.72,
    "faturamentoQ4": 20580.050000000003,
    "financeiro": {
      "meta_anual": 110000,
      "faturamento_realizado": 81298.07,
      "percentual_alcance": 73.91,
      "ticket_medio": 246.3577879,
      "faturamento_por_membro": 1451.75,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 6635.53,
          "faturamento_acumulado": 6635.53,
          "meta_mes": 30000,
          "percentual_meta": 22.1,
          "contratos": 4,
          "membros_executores": 7
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 2250,
          "faturamento_acumulado": 8885.53,
          "meta_mes": 30000,
          "percentual_meta": 7.5,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 6779.11,
          "faturamento_acumulado": 15664.64,
          "meta_mes": 30000,
          "percentual_meta": 22.6,
          "contratos": 4,
          "membros_executores": 7
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 6524.84,
          "faturamento_acumulado": 32669.48,
          "meta_mes": 30000,
          "percentual_meta": 21.7,
          "contratos": 3,
          "membros_executores": 5
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 4709.75,
          "faturamento_acumulado": 37379.23,
          "meta_mes": 30000,
          "percentual_meta": 15.7,
          "contratos": 3,
          "membros_executores": 6
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 12730.92,
          "faturamento_acumulado": 50110.15,
          "meta_mes": 30000,
          "percentual_meta": 42.4,
          "contratos": 5,
          "membros_executores": 8
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 2923.2,
          "faturamento_acumulado": 53033.35,
          "meta_mes": 30000,
          "percentual_meta": 9.7,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 7998.09,
          "faturamento_acumulado": 61031.44,
          "meta_mes": 30000,
          "percentual_meta": 26.7,
          "contratos": 3,
          "membros_executores": 5
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 28833.43,
          "faturamento_acumulado": 89864.87,
          "meta_mes": 30000,
          "percentual_meta": 96.1,
          "contratos": 4,
          "membros_executores": 6
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 8065.16,
          "faturamento_acumulado": 97930.03,
          "meta_mes": 30000,
          "percentual_meta": 26.9,
          "contratos": 2,
          "membros_executores": 3
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 6061.47,
          "faturamento_acumulado": 103991.5,
          "meta_mes": 30000,
          "percentual_meta": 20.2,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 6453.42,
          "faturamento_acumulado": 110444.92,
          "meta_mes": 30000,
          "percentual_meta": 21.5,
          "contratos": 1,
          "membros_executores": 2
        }
      ]
    },
    "membros": {
      "total_ativos": 56,
      "executores_mes": 37,
      "percentual_executores": 71.43,
      "faturamento_por_membro_mes": 246.3577879,
      "retencao_1_ano_percentual": 26.3157894736842,
      "diversidade_minorizados_percentual": 65,
      "engajamento_mej_quantidade": 40,
      "engajamento_mej_percentual": 71.4
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 110000,
          "realizado": 81298.07,
          "percentual": 73.91,
          "status": "Em Andamento"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 14,
          "realizado": 23,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 71.43,
          "quantidade_executores": 37,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 61.54,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 1451.75,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 2028,
          "parceiros": "Ibmec Jr. Soluções"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 65,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 43.29,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 71.4,
          "membros": 40
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 1,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_706",
    "id_ej": "ej_706",
    "nome": "Horizonte Soluções Geofísicas",
    "slug": "horizonte-solucoes-geofisicas",
    "logo_url": "/logos/horizonte-solucoes-geofisicas.png",
    "cluster": 1,
    "cnpj": "23.158.549/0001-04",
    "regiao": "Centro Sul 2",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Niterói",
    "cidade": "Niterói",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Geofisica",
    "ano_fundacao": 2017,
    "ano_federacao": 2017,
    "email": "contato@horizontegeofisica.com.br",
    "website": "https://horizontegeofisica.com/",
    "membros_ativos": 17,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 4024.999999999999,
    "faturamentoAtual": 8762.5,
    "faturamentoQ1": 3500,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 4024.999999999999,
      "faturamento_realizado": 8762.5,
      "percentual_alcance": 217.7,
      "ticket_medio": 97.36111111,
      "faturamento_por_membro": 515.44,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 3500,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 10,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3500,
          "meta_mes": 35175,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 17,
      "executores_mes": 17,
      "percentual_executores": 100,
      "faturamento_por_membro_mes": 97.36111111,
      "retencao_1_ano_percentual": 100,
      "diversidade_minorizados_percentual": 60,
      "engajamento_mej_quantidade": 4,
      "engajamento_mej_percentual": 23.5
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 4024.999999999999,
          "realizado": 8762.5,
          "percentual": 217.7,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 100,
          "quantidade_executores": 17,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 515.44,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 60,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 23.5,
          "membros": 4
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 1,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_157",
    "id_ej": "ej_157",
    "nome": "Ibmec Jr. Soluções",
    "slug": "ibmec-jr-solucoes",
    "logo_url": "/logos/ibmec-jr-solucoes.png",
    "cluster": 1,
    "cnpj": "01.419.692/0001-70",
    "regiao": "Centro-Sul 1",
    "localizacao": "Centro Universitário IBMEC - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "Centro Universitário IBMEC",
    "cursos_admitidos": "Administração, Ciência De Dados E Inteligência Artificial, Ciências Contábeis, Ciências Econômicas, Comunicação Social - Publicidade E Propaganda, Direito, Engenharia Civil, Engenharia De Computação, Engenharia De Produção, Engenharia Mecânica, Jornalismo, Relações Internacionais",
    "ano_fundacao": 1996,
    "ano_federacao": 1996,
    "email": "presidencia@ibmecjr.com.br",
    "website": "https://ibmecjr.com.br/",
    "membros_ativos": 83,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 20000,
    "faturamentoAtual": 500,
    "faturamentoQ1": 4000,
    "faturamentoQ2": 0,
    "faturamentoQ3": 11025,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 20000,
      "faturamento_realizado": 500,
      "percentual_alcance": 2.5,
      "ticket_medio": 1.111111111,
      "faturamento_por_membro": 6.02,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 140000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 140000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 4000,
          "faturamento_acumulado": 4000,
          "meta_mes": 140000,
          "percentual_meta": 2.9,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4000,
          "meta_mes": 140000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4000,
          "meta_mes": 140000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4000,
          "meta_mes": 140000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 11025,
          "faturamento_acumulado": 15025,
          "meta_mes": 140000,
          "percentual_meta": 7.9,
          "contratos": 2,
          "membros_executores": 8
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15025,
          "meta_mes": 140000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15025,
          "meta_mes": 140000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15025,
          "meta_mes": 140000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15025,
          "meta_mes": 140000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15025,
          "meta_mes": 140000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 83,
      "executores_mes": 4,
      "percentual_executores": 4.82,
      "faturamento_por_membro_mes": 1.111111111,
      "retencao_1_ano_percentual": 47.7064220183486,
      "diversidade_minorizados_percentual": 55,
      "engajamento_mej_quantidade": 38,
      "engajamento_mej_percentual": 45.8
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 20000,
          "realizado": 500,
          "percentual": 2.5,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 4.82,
          "quantidade_executores": 4,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 6.02,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 500,
          "parceiros": "Hidros Consultoria"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 55,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 45.8,
          "membros": 38
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_113",
    "id_ej": "ej_113",
    "nome": "IME Júnior",
    "slug": "ime-junior",
    "logo_url": "/logos/ime-junior.png",
    "cluster": 1,
    "cnpj": "11.461.491/0001-94",
    "regiao": "Centro-Sul 1",
    "localizacao": "INSTITUTO MILITAR DE ENGENHARIA - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "INSTITUTO MILITAR DE ENGENHARIA",
    "cursos_admitidos": "Engenharia Da Computação, Engenharia De Comunicações, Engenharia De Fortificação E Construção, Engenharia Elétrica, Engenharia Eletrônica, Engenharia Mecânica E De Armamento, Engenharia Mecânica E De Automóveis, Engenharia Química",
    "ano_fundacao": 2011,
    "ano_federacao": 2011,
    "email": "contato@imejunior.com.br",
    "website": "http://imejunior.com.br",
    "membros_ativos": 45,
    "farol": "protagonista",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 15000,
    "faturamentoAtual": 15290,
    "faturamentoQ1": 950,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 6930,
    "financeiro": {
      "meta_anual": 15000,
      "faturamento_realizado": 15290,
      "percentual_alcance": 101.93,
      "ticket_medio": 56.62962963,
      "faturamento_por_membro": 339.78,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 10832,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 10832,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 950,
          "faturamento_acumulado": 950,
          "meta_mes": 10832,
          "percentual_meta": 8.8,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 950,
          "meta_mes": 10832,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 950,
          "meta_mes": 10832,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 950,
          "meta_mes": 10832,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 950,
          "meta_mes": 10832,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 950,
          "meta_mes": 10832,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 950,
          "meta_mes": 10832,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 6930,
          "faturamento_acumulado": 7880,
          "meta_mes": 10832,
          "percentual_meta": 64,
          "contratos": 1,
          "membros_executores": 8
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 7880,
          "meta_mes": 10832,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 7880,
          "meta_mes": 10832,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 45,
      "executores_mes": 14,
      "percentual_executores": 31.11,
      "faturamento_por_membro_mes": 56.62962963,
      "retencao_1_ano_percentual": 57.4074074074074,
      "diversidade_minorizados_percentual": 40,
      "engajamento_mej_quantidade": 4,
      "engajamento_mej_percentual": 8.9
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 15000,
          "realizado": 15290,
          "percentual": 101.93,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 31.11,
          "quantidade_executores": 14,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 50,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 339.78,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 40,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 146,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 8.9,
          "membros": 4
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1653",
    "id_ej": "ej_1653",
    "nome": "Ímpeto Empresa Júnior Jurídica",
    "slug": "impeto-empresa-junior-juridica",
    "logo_url": "/logos/impeto-empresa-junior-juridica.png",
    "cluster": 1,
    "cnpj": "29.262.903/0001-22",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Volta Redonda",
    "cidade": "Volta Redonda",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Direito",
    "ano_fundacao": 2019,
    "ano_federacao": 2019,
    "email": "impetoejj@gmail.com",
    "website": "https://impeto-empresa-junior-juridica.com.br",
    "membros_ativos": 31,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 19205,
    "faturamentoAtual": 11664,
    "faturamentoQ1": 2800,
    "faturamentoQ2": 3400,
    "faturamentoQ3": 12000,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 19205,
      "faturamento_realizado": 11664,
      "percentual_alcance": 60.73,
      "ticket_medio": 11664,
      "faturamento_por_membro": 376.26,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 9400,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 1300,
          "faturamento_acumulado": 1300,
          "meta_mes": 9400,
          "percentual_meta": 13.8,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 1500,
          "faturamento_acumulado": 2800,
          "meta_mes": 9400,
          "percentual_meta": 16,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 700,
          "faturamento_acumulado": 3500,
          "meta_mes": 9400,
          "percentual_meta": 7.4,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 2700,
          "faturamento_acumulado": 6200,
          "meta_mes": 9400,
          "percentual_meta": 28.7,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6200,
          "meta_mes": 9400,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 12000,
          "faturamento_acumulado": 18200,
          "meta_mes": 9400,
          "percentual_meta": 127.7,
          "contratos": 1,
          "membros_executores": 7
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 18200,
          "meta_mes": 9400,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 18200,
          "meta_mes": 9400,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 18200,
          "meta_mes": 9400,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 18200,
          "meta_mes": 9400,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 18200,
          "meta_mes": 9400,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 31,
      "executores_mes": 0,
      "percentual_executores": 12.9,
      "faturamento_por_membro_mes": 31.35483870967742,
      "retencao_1_ano_percentual": 67.4418604651163,
      "diversidade_minorizados_percentual": 95,
      "engajamento_mej_quantidade": 10,
      "engajamento_mej_percentual": 32.3
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 19205,
          "realizado": 11664,
          "percentual": 60.73,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 12.9,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 376.26,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 95,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 32.3,
          "membros": 10
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_372",
    "id_ej": "ej_372",
    "nome": "IN Junior",
    "slug": "in-junior",
    "logo_url": "/logos/in-junior.png",
    "cluster": 1,
    "cnpj": "23.916.843/0001-38",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Niterói",
    "cidade": "Niterói",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Ciência Da Computação, Sistemas De Computação, Sistemas De Informação",
    "ano_fundacao": 2016,
    "ano_federacao": 2016,
    "email": "rian.breno@injunior.com.br",
    "website": "https://injunior.com.br",
    "membros_ativos": 56,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 19000,
    "faturamentoAtual": 59025.66,
    "faturamentoQ1": 0,
    "faturamentoQ2": 9467.57,
    "faturamentoQ3": 0,
    "faturamentoQ4": 2590.59,
    "financeiro": {
      "meta_anual": 19000,
      "faturamento_realizado": 59025.66,
      "percentual_alcance": 310.66,
      "ticket_medio": 5902.566000000001,
      "faturamento_por_membro": 1054.03,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 9467.57,
          "faturamento_acumulado": 9467.57,
          "meta_mes": 30000,
          "percentual_meta": 31.6,
          "contratos": 2,
          "membros_executores": 3
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9467.57,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9467.57,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9467.57,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9467.57,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9467.57,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 2590.59,
          "faturamento_acumulado": 12058.16,
          "meta_mes": 30000,
          "percentual_meta": 8.6,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12058.16,
          "meta_mes": 30000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 56,
      "executores_mes": 18,
      "percentual_executores": 42.86,
      "faturamento_por_membro_mes": 87.83580357142857,
      "retencao_1_ano_percentual": 62.1212121212121,
      "diversidade_minorizados_percentual": 50,
      "engajamento_mej_quantidade": 20,
      "engajamento_mej_percentual": 35.7
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 19000,
          "realizado": 59025.66,
          "percentual": 310.66,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 10,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 42.86,
          "quantidade_executores": 18,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 63.64,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 1054.03,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 50,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 177,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 35.7,
          "membros": 20
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 3,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_018",
    "id_ej": "ej_018",
    "nome": "Iniciativa Consultoria",
    "slug": "iniciativa-consultoria",
    "logo_url": "/logos/iniciativa-consultoria.png",
    "cluster": 2,
    "cnpj": "05.210.982/0001-60",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO",
    "cursos_admitidos": "Administração, Ciência Econômica, Ciências Contábeis, Relações Internacionais",
    "ano_fundacao": 2003,
    "ano_federacao": 2003,
    "email": "contato@iniciativaconsultoria.com.br",
    "website": "http://www.iniciativaconsultoria.com.br/",
    "membros_ativos": 41,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 31607.13,
    "faturamentoAtual": 49898.81,
    "faturamentoQ1": 0,
    "faturamentoQ2": 0,
    "faturamentoQ3": 8631.99,
    "faturamentoQ4": 4180,
    "financeiro": {
      "meta_anual": 31607.13,
      "faturamento_realizado": 49898.81,
      "percentual_alcance": 157.87,
      "ticket_medio": 8316.468333333332,
      "faturamento_por_membro": 1217.04,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 28733.75,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 28733.75,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 28733.75,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 28733.75,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 28733.75,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 28733.75,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 1631.99,
          "faturamento_acumulado": 1631.99,
          "meta_mes": 28733.75,
          "percentual_meta": 5.7,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 7000,
          "faturamento_acumulado": 8631.99,
          "meta_mes": 28733.75,
          "percentual_meta": 24.4,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8631.99,
          "meta_mes": 28733.75,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 1500,
          "faturamento_acumulado": 10131.99,
          "meta_mes": 28733.75,
          "percentual_meta": 5.2,
          "contratos": 1,
          "membros_executores": 18
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 2680,
          "faturamento_acumulado": 12811.99,
          "meta_mes": 28733.75,
          "percentual_meta": 9.3,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12811.99,
          "meta_mes": 28733.75,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 41,
      "executores_mes": 7,
      "percentual_executores": 17.07,
      "faturamento_por_membro_mes": 101.42034552845529,
      "retencao_1_ano_percentual": 25.4901960784314,
      "diversidade_minorizados_percentual": 75,
      "engajamento_mej_quantidade": 22,
      "engajamento_mej_percentual": 53.7
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 31607.13,
          "realizado": 49898.81,
          "percentual": 157.87,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 4,
          "realizado": 6,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 17.07,
          "quantidade_executores": 7,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 1217.04,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 75,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 53.7,
          "membros": 22
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 5,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_448",
    "id_ej": "ej_448",
    "nome": "Insight Consultoria",
    "slug": "insight-consultoria",
    "logo_url": "/logos/insight-consultoria.png",
    "cluster": 1,
    "cnpj": "07.538.397/0001-19",
    "regiao": "Centro-Sul 1",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Psicologia",
    "ano_fundacao": 2006,
    "ano_federacao": 2006,
    "email": "insightconsultoria@insightjunior.com.br",
    "website": "http://www.insightjunior.com.br/",
    "membros_ativos": 21,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CRIA",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 2004,
    "faturamentoQ1": 0,
    "faturamentoQ2": 200,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 2004,
      "percentual_alcance": 133.6,
      "ticket_medio": 2004,
      "faturamento_por_membro": 95.43,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 35434.27,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 35434.27,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 35434.27,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 35434.27,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 200,
          "faturamento_acumulado": 200,
          "meta_mes": 35434.27,
          "percentual_meta": 0.6,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 200,
          "meta_mes": 35434.27,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 200,
          "meta_mes": 35434.27,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 200,
          "meta_mes": 35434.27,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 200,
          "meta_mes": 35434.27,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 200,
          "meta_mes": 35434.27,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 200,
          "meta_mes": 35434.27,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 200,
          "meta_mes": 35434.27,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 21,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 7.9523809523809526,
      "retencao_1_ano_percentual": 42.8571428571429,
      "diversidade_minorizados_percentual": 100,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 2004,
          "percentual": 133.6,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 95.43,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 100,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3579",
    "id_ej": "ej_3579",
    "nome": "Lacom Jr",
    "slug": "lacom-jr",
    "logo_url": "/logos/lacom-jr.png",
    "cluster": 1,
    "cnpj": "60.685.415/0001-78",
    "regiao": "Centro Norte",
    "localizacao": "#N/A - #N/A",
    "cidade": "#N/A",
    "ies": "#N/A",
    "cursos_admitidos": "#N/A",
    "ano_fundacao": 2026,
    "ano_federacao": 2026,
    "email": "contato@lacom-jr.com.br",
    "website": "https://lacom-jr.com.br",
    "membros_ativos": 7,
    "farol": "protagonista",
    "farol_original": "Amarelo",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 2500,
    "faturamentoQ1": 2499.9900000000002,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 2500,
      "percentual_alcance": 166.67,
      "ticket_medio": 5.681818182,
      "faturamento_por_membro": 357.14,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 833.33,
          "faturamento_acumulado": 833.33,
          "meta_mes": 125,
          "percentual_meta": 666.7,
          "contratos": 1,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 833.33,
          "faturamento_acumulado": 1666.66,
          "meta_mes": 125,
          "percentual_meta": 666.7,
          "contratos": 1,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 833.33,
          "faturamento_acumulado": 2499.99,
          "meta_mes": 125,
          "percentual_meta": 666.7,
          "contratos": 1,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2499.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2499.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2499.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2499.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2499.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2499.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2499.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2499.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2499.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 7,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 5.681818182,
      "retencao_1_ano_percentual": 25,
      "diversidade_minorizados_percentual": 90,
      "engajamento_mej_quantidade": 4,
      "engajamento_mej_percentual": 57.1
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 2500,
          "percentual": 166.67,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 357.14,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 90,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 57.1,
          "membros": 4
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_948",
    "id_ej": "ej_948",
    "nome": "Legado Consultoria Júnior",
    "slug": "legado-consultoria-junior",
    "logo_url": "/logos/legado-consultoria-junior.png",
    "cluster": 5,
    "cnpj": "29.403.478/0001-44",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Engenharia De Alimentos, Engenharia De Bioprocessos, Engenharia Química, Química Industrial",
    "ano_fundacao": 2018,
    "ano_federacao": 2018,
    "email": "comercial@legadoconsultoriajr.com.br",
    "website": "http://legadoconsultoriajr.com.br/",
    "membros_ativos": 33,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 144000,
    "faturamentoAtual": 65035.39,
    "faturamentoQ1": 35340.240000000005,
    "faturamentoQ2": 31607.35,
    "faturamentoQ3": 11418.82,
    "faturamentoQ4": 51442.68,
    "financeiro": {
      "meta_anual": 144000,
      "faturamento_realizado": 65035.39,
      "percentual_alcance": 45.16,
      "ticket_medio": 147.8077045,
      "faturamento_por_membro": 1970.77,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 20513.88,
          "faturamento_acumulado": 20513.88,
          "meta_mes": 120000,
          "percentual_meta": 17.1,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 5704.56,
          "faturamento_acumulado": 26218.44,
          "meta_mes": 120000,
          "percentual_meta": 4.8,
          "contratos": 3,
          "membros_executores": 6
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 9121.8,
          "faturamento_acumulado": 41340.24,
          "meta_mes": 120000,
          "percentual_meta": 7.6,
          "contratos": 6,
          "membros_executores": 14
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 5760.5,
          "faturamento_acumulado": 49130.74,
          "meta_mes": 120000,
          "percentual_meta": 4.8,
          "contratos": 6,
          "membros_executores": 13
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 49130.74,
          "meta_mes": 120000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 25846.85,
          "faturamento_acumulado": 74977.59,
          "meta_mes": 120000,
          "percentual_meta": 21.5,
          "contratos": 3,
          "membros_executores": 11
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 3620.8,
          "faturamento_acumulado": 80498.39,
          "meta_mes": 120000,
          "percentual_meta": 3,
          "contratos": 4,
          "membros_executores": 4
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 5358.2,
          "faturamento_acumulado": 86513.39,
          "meta_mes": 120000,
          "percentual_meta": 4.5,
          "contratos": 6,
          "membros_executores": 16
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 2439.82,
          "faturamento_acumulado": 94940.01,
          "meta_mes": 120000,
          "percentual_meta": 2,
          "contratos": 6,
          "membros_executores": 13
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 12409.38,
          "faturamento_acumulado": 107569.39,
          "meta_mes": 120000,
          "percentual_meta": 10.3,
          "contratos": 16,
          "membros_executores": 26
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 37443.3,
          "faturamento_acumulado": 145322.69,
          "meta_mes": 120000,
          "percentual_meta": 31.2,
          "contratos": 6,
          "membros_executores": 9
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 1590,
          "faturamento_acumulado": 148862.69,
          "meta_mes": 120000,
          "percentual_meta": 1.3,
          "contratos": 2,
          "membros_executores": 3
        }
      ]
    },
    "membros": {
      "total_ativos": 33,
      "executores_mes": 31,
      "percentual_executores": 93.94,
      "faturamento_por_membro_mes": 147.8077045,
      "retencao_1_ano_percentual": 48.936170212766,
      "diversidade_minorizados_percentual": 65,
      "engajamento_mej_quantidade": 32,
      "engajamento_mej_percentual": 97
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 144000,
          "realizado": 65035.39,
          "percentual": 45.16,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 18,
          "realizado": 26,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 93.94,
          "quantidade_executores": 31,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 40,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 1970.77,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 4537.85,
          "parceiros": "20.656.089/0001-56,Núcleo Consultoria Jr,Núcleo Consultoria Jr,Núcleo Consultoria Jr"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 65,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 46.07,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 97,
          "membros": 32
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1158",
    "id_ej": "ej_1158",
    "nome": "LEVE Consultoria e Gestão de Projetos",
    "slug": "leve-consultoria-e-gestao-de-projetos",
    "logo_url": "/logos/leve-consultoria-e-gestao-de-projetos.png",
    "cluster": 3,
    "cnpj": "28.435.594/0001-82",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Niterói",
    "cidade": "Niterói",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Hotelaria, Turismo",
    "ano_fundacao": 2018,
    "ano_federacao": 2018,
    "email": "leveconsultoria.ej@gmail.com",
    "website": "https://ejleve.com.br/",
    "membros_ativos": 12,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 60000,
    "faturamentoAtual": 1991.84,
    "faturamentoQ1": 0,
    "faturamentoQ2": 8980,
    "faturamentoQ3": 0,
    "faturamentoQ4": 7808,
    "financeiro": {
      "meta_anual": 60000,
      "faturamento_realizado": 1991.84,
      "percentual_alcance": 3.32,
      "ticket_medio": 2.399807229,
      "faturamento_por_membro": 165.99,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 87500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 87500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 87500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 6280,
          "faturamento_acumulado": 6280,
          "meta_mes": 87500,
          "percentual_meta": 7.2,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 2700,
          "faturamento_acumulado": 8980,
          "meta_mes": 87500,
          "percentual_meta": 3.1,
          "contratos": 1,
          "membros_executores": 7
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8980,
          "meta_mes": 87500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8980,
          "meta_mes": 87500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8980,
          "meta_mes": 87500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8980,
          "meta_mes": 87500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 5390,
          "faturamento_acumulado": 14370,
          "meta_mes": 87500,
          "percentual_meta": 6.2,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 2418,
          "faturamento_acumulado": 16788,
          "meta_mes": 87500,
          "percentual_meta": 2.8,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 16788,
          "meta_mes": 87500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 2.399807229,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 60000,
          "realizado": 1991.84,
          "percentual": 3.32,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 8,
          "realizado": 2,
          "percentual": 25,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 100,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 165.99,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 3,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_608",
    "id_ej": "ej_608",
    "nome": "Lignum Ambiental Jr.",
    "slug": "lignum-ambiental-jr",
    "logo_url": "/logos/lignum-ambiental-jr.png",
    "cluster": 3,
    "cnpj": "26.277.974/0001-00",
    "regiao": "Norte",
    "localizacao": "INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA FLUMINENSE - Campos dos Goytacazes",
    "cidade": "Campos dos Goytacazes",
    "ies": "INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA FLUMINENSE",
    "cursos_admitidos": "Engenharia Ambiental",
    "ano_fundacao": 2017,
    "ano_federacao": 2017,
    "email": "lignumambientaljr@gmail.com",
    "website": "https://www.lignumambientaljr.com.br",
    "membros_ativos": 23,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 40007,
    "faturamentoAtual": 21785,
    "faturamentoQ1": 0,
    "faturamentoQ2": 1515,
    "faturamentoQ3": 705,
    "faturamentoQ4": 34000,
    "financeiro": {
      "meta_anual": 40007,
      "faturamento_realizado": 21785,
      "percentual_alcance": 54.45,
      "ticket_medio": 1980.4545454545455,
      "faturamento_por_membro": 947.17,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 34500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 34500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 34500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 15,
          "faturamento_acumulado": 15,
          "meta_mes": 34500,
          "percentual_meta": 0,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 1500,
          "faturamento_acumulado": 1515,
          "meta_mes": 34500,
          "percentual_meta": 4.3,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1515,
          "meta_mes": 34500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1515,
          "meta_mes": 34500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 525,
          "faturamento_acumulado": 2040,
          "meta_mes": 34500,
          "percentual_meta": 1.5,
          "contratos": 1,
          "membros_executores": 8
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 180,
          "faturamento_acumulado": 2220,
          "meta_mes": 34500,
          "percentual_meta": 0.5,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2220,
          "meta_mes": 34500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 34000,
          "faturamento_acumulado": 36220,
          "meta_mes": 34500,
          "percentual_meta": 98.6,
          "contratos": 8,
          "membros_executores": 15
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 36220,
          "meta_mes": 34500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 23,
      "executores_mes": 17,
      "percentual_executores": 95.65,
      "faturamento_por_membro_mes": 78.93115942028986,
      "retencao_1_ano_percentual": 52,
      "diversidade_minorizados_percentual": 95,
      "engajamento_mej_quantidade": 11,
      "engajamento_mej_percentual": 47.8
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 40007,
          "realizado": 21785,
          "percentual": 54.45,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 5,
          "realizado": 11,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 95.65,
          "quantidade_executores": 17,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 21.05,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 947.17,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 500,
          "parceiros": "Agrha Consultoria"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 95,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 47.8,
          "membros": 11
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 8,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_403",
    "id_ej": "ej_403",
    "nome": "Límina Consultoria Júnior",
    "slug": "limina-consultoria-junior",
    "logo_url": "/logos/limina-consultoria-junior.png",
    "cluster": 1,
    "cnpj": "24.848.754/0001-64",
    "regiao": "Centro-Sul 1",
    "localizacao": "UNIVERSIDADE FEDERAL DO ESTADO DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO ESTADO DO RIO DE JANEIRO",
    "cursos_admitidos": "Administração Pública, Engenharia De Produção, Sistemas De Informação",
    "ano_fundacao": 2016,
    "ano_federacao": 2016,
    "email": "contato@patamarconsultoria.com",
    "website": "https://www.liminaconsultoria.com/",
    "membros_ativos": 38,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CRIA",
    "faturamentoMeta": 25000,
    "faturamentoAtual": 34275,
    "faturamentoQ1": 7400,
    "faturamentoQ2": 3300,
    "faturamentoQ3": 2040,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 25000,
      "faturamento_realizado": 34275,
      "percentual_alcance": 137.1,
      "ticket_medio": 0,
      "faturamento_por_membro": 901.97,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 7400,
          "faturamento_acumulado": 7400,
          "meta_mes": 35000,
          "percentual_meta": 21.1,
          "contratos": 1,
          "membros_executores": 9
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 7400,
          "meta_mes": 35000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 7400,
          "meta_mes": 35000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 2700,
          "faturamento_acumulado": 10100,
          "meta_mes": 35000,
          "percentual_meta": 7.7,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 600,
          "faturamento_acumulado": 13600,
          "meta_mes": 35000,
          "percentual_meta": 1.7,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 13600,
          "meta_mes": 35000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 2040,
          "faturamento_acumulado": 15640,
          "meta_mes": 35000,
          "percentual_meta": 5.8,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15640,
          "meta_mes": 35000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15640,
          "meta_mes": 35000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15640,
          "meta_mes": 35000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15640,
          "meta_mes": 35000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15640,
          "meta_mes": 35000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 38,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 75.16447368421052,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 25000,
          "realizado": 34275,
          "percentual": 137.1,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 901.97,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3570",
    "id_ej": "ej_3570",
    "nome": "Maralto Empresa Júnior de Oceanografia",
    "slug": "maralto-empresa-junior-de-oceanografia",
    "logo_url": "/logos/maralto-empresa-junior-de-oceanografia.png",
    "cluster": 1,
    "cnpj": "52.384.014/0001-50",
    "regiao": "Centro Sul 1",
    "localizacao": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO",
    "cursos_admitidos": "Oceanografia",
    "ano_fundacao": 2025,
    "ano_federacao": 2025,
    "email": "contato@maralto-empresa-junior-de-oceanografia.com.br",
    "website": "https://maraltoej.wixsite.com/maraltoej",
    "membros_ativos": 11,
    "farol": "protagonista",
    "farol_original": "Amarelo",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 7000,
    "faturamentoQ1": 6999.99,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 7000,
      "percentual_alcance": 466.67,
      "ticket_medio": 7000,
      "faturamento_por_membro": 636.36,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 2333.33,
          "faturamento_acumulado": 2333.33,
          "meta_mes": 125,
          "percentual_meta": 1866.7,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 2333.33,
          "faturamento_acumulado": 4666.66,
          "meta_mes": 125,
          "percentual_meta": 1866.7,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 2333.33,
          "faturamento_acumulado": 6999.99,
          "meta_mes": 125,
          "percentual_meta": 1866.7,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 6999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 11,
      "executores_mes": 5,
      "percentual_executores": 45.45,
      "faturamento_por_membro_mes": 53.03030303030303,
      "retencao_1_ano_percentual": 78.5714285714286,
      "diversidade_minorizados_percentual": 85,
      "engajamento_mej_quantidade": 2,
      "engajamento_mej_percentual": 18.2
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 7000,
          "percentual": 466.67,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 45.45,
          "quantidade_executores": 5,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 636.36,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 85,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 18.2,
          "membros": 2
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3335",
    "id_ej": "ej_3335",
    "nome": "Med.Co Jr",
    "slug": "med-co-jr",
    "logo_url": "/logos/med-co-jr.png",
    "cluster": 1,
    "cnpj": "38.304.216/0001-13",
    "regiao": "Centro Sul 1",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Medicina",
    "ano_fundacao": 2023,
    "ano_federacao": 2023,
    "email": "contato@med-co-jr.com.br",
    "website": "https://medcojr.com/",
    "membros_ativos": 12,
    "farol": "vermelho",
    "farol_original": "Zerada",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 0,
    "faturamentoQ1": 0,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 0,
      "percentual_alcance": 0,
      "ticket_medio": 0,
      "faturamento_por_membro": 0,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 0,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 0,
          "percentual": 0,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 0,
          "meta_csat": 3.5,
          "nps": 0,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Regular"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 0,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_279",
    "id_ej": "ej_279",
    "nome": "Mensurar Júnior",
    "slug": "mensurar-junior",
    "logo_url": "/logos/mensurar-junior.png",
    "cluster": 2,
    "cnpj": "15.204.184/0001-89",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Seropédica",
    "cidade": "Seropédica",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Engenharia De Agrimensura E Cartográfica",
    "ano_fundacao": 2016,
    "ano_federacao": 2016,
    "email": "presidencia@mensurarjunior.com",
    "website": "https://www.mensurarjunior.com/",
    "membros_ativos": 12,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 12500,
    "faturamentoAtual": 12351.66,
    "faturamentoQ1": 0,
    "faturamentoQ2": 2000,
    "faturamentoQ3": 6470,
    "faturamentoQ4": 28806.4,
    "financeiro": {
      "meta_anual": 12500,
      "faturamento_realizado": 12351.66,
      "percentual_alcance": 98.81,
      "ticket_medio": 3087.915,
      "faturamento_por_membro": 1029.31,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 10368.53,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 10368.53,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 10368.53,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 2000,
          "faturamento_acumulado": 2000,
          "meta_mes": 10368.53,
          "percentual_meta": 19.3,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2000,
          "meta_mes": 10368.53,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2000,
          "meta_mes": 10368.53,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2000,
          "meta_mes": 10368.53,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 6470,
          "faturamento_acumulado": 8470,
          "meta_mes": 10368.53,
          "percentual_meta": 62.4,
          "contratos": 2,
          "membros_executores": 4
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 8470,
          "meta_mes": 10368.53,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 1306.4,
          "faturamento_acumulado": 9776.4,
          "meta_mes": 10368.53,
          "percentual_meta": 12.6,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9776.4,
          "meta_mes": 10368.53,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 27500,
          "faturamento_acumulado": 37276.4,
          "meta_mes": 10368.53,
          "percentual_meta": 265.2,
          "contratos": 1,
          "membros_executores": 3
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 16.67,
      "faturamento_por_membro_mes": 85.77541666666667,
      "retencao_1_ano_percentual": 25,
      "diversidade_minorizados_percentual": 70,
      "engajamento_mej_quantidade": 3,
      "engajamento_mej_percentual": 25
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 12500,
          "realizado": 12351.66,
          "percentual": 98.81,
          "status": "Em Andamento"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 4,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 16.67,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 1029.31,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 70,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 25,
          "membros": 3
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3207",
    "id_ej": "ej_3207",
    "nome": "Minerva Consultoria",
    "slug": "minerva-consultoria",
    "logo_url": "/logos/minerva-consultoria.png",
    "cluster": 1,
    "cnpj": "43.408.159/0001-52",
    "regiao": "Centro-Sul 1",
    "localizacao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Ciências Econômicas",
    "ano_fundacao": 2022,
    "ano_federacao": 2022,
    "email": "contato@minerva-consultoria.com.br",
    "website": "https://minervaconsultoria.com.br/",
    "membros_ativos": 11,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 667,
    "faturamentoQ1": 0,
    "faturamentoQ2": 100,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 667,
      "percentual_alcance": 44.47,
      "ticket_medio": 0,
      "faturamento_por_membro": 60.64,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 100,
          "faturamento_acumulado": 100,
          "meta_mes": 1500,
          "percentual_meta": 6.7,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 100,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 100,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 100,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 100,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 100,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 100,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 100,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 100,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 11,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 5.053030303030303,
      "retencao_1_ano_percentual": 50,
      "diversidade_minorizados_percentual": 85,
      "engajamento_mej_quantidade": 1,
      "engajamento_mej_percentual": 9.1
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 667,
          "percentual": 44.47,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 60.64,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 85,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 9.1,
          "membros": 1
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_378",
    "id_ej": "ej_378",
    "nome": "Multi Jr",
    "slug": "multi-jr",
    "logo_url": "/logos/multi-jr.png",
    "cluster": 1,
    "cnpj": "02.577.076/0001-00",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Seropédica",
    "cidade": "Seropédica",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Administração, Administração Pública, Ciências Contábeis, Ciências Econômicas, Jornalismo",
    "ano_fundacao": 2010,
    "ano_federacao": 2010,
    "email": "admfin@multiconsultoria.org.br",
    "website": "http://www.multiconsultoria.org.br/",
    "membros_ativos": 24,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 1500.1,
    "faturamentoAtual": 9900,
    "faturamentoQ1": 0,
    "faturamentoQ2": 842.65,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500.1,
      "faturamento_realizado": 9900,
      "percentual_alcance": 659.96,
      "ticket_medio": 36.66666667,
      "faturamento_por_membro": 412.5,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 28800,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 28800,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 28800,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 147,
          "faturamento_acumulado": 147,
          "meta_mes": 28800,
          "percentual_meta": 0.5,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 147,
          "meta_mes": 28800,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 695.65,
          "faturamento_acumulado": 842.65,
          "meta_mes": 28800,
          "percentual_meta": 2.4,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 842.65,
          "meta_mes": 28800,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 842.65,
          "meta_mes": 28800,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 842.65,
          "meta_mes": 28800,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 842.65,
          "meta_mes": 28800,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 842.65,
          "meta_mes": 28800,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 842.65,
          "meta_mes": 28800,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 24,
      "executores_mes": 7,
      "percentual_executores": 29.17,
      "faturamento_por_membro_mes": 36.66666667,
      "retencao_1_ano_percentual": 64.2857142857143,
      "diversidade_minorizados_percentual": 80,
      "engajamento_mej_quantidade": 13,
      "engajamento_mej_percentual": 56
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500.1,
          "realizado": 9900,
          "percentual": 659.96,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 3,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 29.17,
          "quantidade_executores": 7,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 50,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 412.5,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 8400,
          "parceiros": "Ártemis Soluções Veterinárias"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 80,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 56,
          "membros": 13
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_416",
    "id_ej": "ej_416",
    "nome": "Núcleo Consultoria Jr",
    "slug": "nucleo-consultoria-jr",
    "logo_url": "/logos/nucleo-consultoria-jr.png",
    "cluster": 2,
    "cnpj": "20.173.915/0001-06",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Seropédica",
    "cidade": "Seropédica",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Engenharia De Materiais, Engenharia Química, Farmácia",
    "ano_fundacao": 2014,
    "ano_federacao": 2014,
    "email": "presidencia@nucleoconsultoriajr.com",
    "website": "https://www.nucleoconsultoriajr.com/",
    "membros_ativos": 35,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 18513,
    "faturamentoAtual": 6758.85,
    "faturamentoQ1": 11506.77,
    "faturamentoQ2": 3038.85,
    "faturamentoQ3": 1087.17,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 18513,
      "faturamento_realizado": 6758.85,
      "percentual_alcance": 36.51,
      "ticket_medio": 21.80274194,
      "faturamento_por_membro": 193.11,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 1457.86,
          "faturamento_acumulado": 1457.86,
          "meta_mes": 60000,
          "percentual_meta": 2.4,
          "contratos": 1,
          "membros_executores": 11
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 9328.99,
          "faturamento_acumulado": 10786.85,
          "meta_mes": 60000,
          "percentual_meta": 15.5,
          "contratos": 6,
          "membros_executores": 8
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 719.92,
          "faturamento_acumulado": 11506.77,
          "meta_mes": 60000,
          "percentual_meta": 1.2,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 715.96,
          "faturamento_acumulado": 12222.73,
          "meta_mes": 60000,
          "percentual_meta": 1.2,
          "contratos": 2,
          "membros_executores": 5
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12222.73,
          "meta_mes": 60000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 2322.89,
          "faturamento_acumulado": 14545.62,
          "meta_mes": 60000,
          "percentual_meta": 3.9,
          "contratos": 3,
          "membros_executores": 10
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 299.97,
          "faturamento_acumulado": 14845.59,
          "meta_mes": 60000,
          "percentual_meta": 0.5,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 347.6,
          "faturamento_acumulado": 15193.19,
          "meta_mes": 60000,
          "percentual_meta": 0.6,
          "contratos": 2,
          "membros_executores": 4
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 439.6,
          "faturamento_acumulado": 15632.79,
          "meta_mes": 60000,
          "percentual_meta": 0.7,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15632.79,
          "meta_mes": 60000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15632.79,
          "meta_mes": 60000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 15632.79,
          "meta_mes": 60000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 35,
      "executores_mes": 28,
      "percentual_executores": 77.14,
      "faturamento_por_membro_mes": 21.80274194,
      "retencao_1_ano_percentual": 47.2222222222222,
      "diversidade_minorizados_percentual": 85,
      "engajamento_mej_quantidade": 22,
      "engajamento_mej_percentual": 62.9
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 18513,
          "realizado": 6758.85,
          "percentual": 36.51,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 15,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 77.14,
          "quantidade_executores": 28,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 50,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 193.11,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 438,
          "parceiros": "Legado Consultoria Júnior,Legado Consultoria Júnior"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 85,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 14.6,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 62.9,
          "membros": 22
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 2,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_148",
    "id_ej": "ej_148",
    "nome": "Opção Consultoria",
    "slug": "opcao-consultoria",
    "logo_url": "/logos/opcao-consultoria.png",
    "cluster": 1,
    "cnpj": "02.744.184/0001-20",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Niterói",
    "cidade": "Niterói",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Ciências Econômicas, Comunicação Social - Publicidade E Propaganda",
    "ano_fundacao": 2007,
    "ano_federacao": 2007,
    "email": "marketing@opcaoconsultoria.com.br",
    "website": "https://opcaoconsultoria.com.br/",
    "membros_ativos": 15,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 10000,
    "faturamentoAtual": 3340.6,
    "faturamentoQ1": 0,
    "faturamentoQ2": 5000,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 10000,
      "faturamento_realizado": 3340.6,
      "percentual_alcance": 33.41,
      "ticket_medio": 13.91916667,
      "faturamento_por_membro": 222.71,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 32500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 32500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 32500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 3500,
          "faturamento_acumulado": 3500,
          "meta_mes": 32500,
          "percentual_meta": 10.8,
          "contratos": 1,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 1500,
          "faturamento_acumulado": 5000,
          "meta_mes": 32500,
          "percentual_meta": 4.6,
          "contratos": 1,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 5000,
          "meta_mes": 32500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 5000,
          "meta_mes": 32500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 5000,
          "meta_mes": 32500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 5000,
          "meta_mes": 32500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 5000,
          "meta_mes": 32500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 5000,
          "meta_mes": 32500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 5000,
          "meta_mes": 32500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 15,
      "executores_mes": 2,
      "percentual_executores": 13.33,
      "faturamento_por_membro_mes": 13.91916667,
      "retencao_1_ano_percentual": 82.7586206896552,
      "diversidade_minorizados_percentual": 50,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 10000,
          "realizado": 3340.6,
          "percentual": 33.41,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 13.33,
          "quantidade_executores": 2,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 222.71,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 50,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 1,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_382",
    "id_ej": "ej_382",
    "nome": "P&Q Engenharia Jr",
    "slug": "p-q-engenharia-jr",
    "logo_url": "/logos/p-q-engenharia-jr.png",
    "cluster": 5,
    "cnpj": "15.167.546/0001-09",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Niterói",
    "cidade": "Niterói",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Engenharia De Petróleo, Engenharia Química, Química, Química Industrial",
    "ano_fundacao": 2015,
    "ano_federacao": 2015,
    "email": "diretoria@peqengenhariajr.com.br",
    "website": "http://www.peqengenhariajr.com.br/",
    "membros_ativos": 36,
    "farol": "amarelo",
    "farol_original": "Amarelo",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 152000,
    "faturamentoAtual": 79237.8,
    "faturamentoQ1": 26231,
    "faturamentoQ2": 35076,
    "faturamentoQ3": 56989,
    "faturamentoQ4": 32965,
    "financeiro": {
      "meta_anual": 152000,
      "faturamento_realizado": 79237.8,
      "percentual_alcance": 52.13,
      "ticket_medio": 344.5121739,
      "faturamento_por_membro": 2201.05,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 1678,
          "faturamento_acumulado": 1678,
          "meta_mes": 150000,
          "percentual_meta": 1.1,
          "contratos": 2,
          "membros_executores": 6
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 12953,
          "faturamento_acumulado": 14631,
          "meta_mes": 150000,
          "percentual_meta": 8.6,
          "contratos": 7,
          "membros_executores": 16
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 11600,
          "faturamento_acumulado": 26231,
          "meta_mes": 150000,
          "percentual_meta": 7.7,
          "contratos": 5,
          "membros_executores": 13
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 24134,
          "faturamento_acumulado": 50365,
          "meta_mes": 150000,
          "percentual_meta": 16.1,
          "contratos": 13,
          "membros_executores": 20
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 8760,
          "faturamento_acumulado": 59125,
          "meta_mes": 150000,
          "percentual_meta": 5.8,
          "contratos": 5,
          "membros_executores": 13
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 2182,
          "faturamento_acumulado": 61307,
          "meta_mes": 150000,
          "percentual_meta": 1.5,
          "contratos": 2,
          "membros_executores": 6
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 786,
          "faturamento_acumulado": 62093,
          "meta_mes": 150000,
          "percentual_meta": 0.5,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 2252,
          "faturamento_acumulado": 64345,
          "meta_mes": 150000,
          "percentual_meta": 1.5,
          "contratos": 2,
          "membros_executores": 6
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 53951,
          "faturamento_acumulado": 118296,
          "meta_mes": 150000,
          "percentual_meta": 36,
          "contratos": 10,
          "membros_executores": 22
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 5015,
          "faturamento_acumulado": 123311,
          "meta_mes": 150000,
          "percentual_meta": 3.3,
          "contratos": 5,
          "membros_executores": 13
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 24091,
          "faturamento_acumulado": 147402,
          "meta_mes": 150000,
          "percentual_meta": 16.1,
          "contratos": 9,
          "membros_executores": 20
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 3859,
          "faturamento_acumulado": 151261,
          "meta_mes": 150000,
          "percentual_meta": 2.6,
          "contratos": 3,
          "membros_executores": 8
        }
      ]
    },
    "membros": {
      "total_ativos": 36,
      "executores_mes": 34,
      "percentual_executores": 94.44,
      "faturamento_por_membro_mes": 344.5121739,
      "retencao_1_ano_percentual": 55.1724137931034,
      "diversidade_minorizados_percentual": 65,
      "engajamento_mej_quantidade": 25,
      "engajamento_mej_percentual": 69.4
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 152000,
          "realizado": 79237.8,
          "percentual": 52.13,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 19,
          "realizado": 39,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 94.44,
          "quantidade_executores": 34,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 2201.05,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 7000,
          "parceiros": "Empresa Júnior Meta Consultoria"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 65,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 69.4,
          "membros": 25
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 4,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_037",
    "id_ej": "ej_037",
    "nome": "Pacto Consultoria Jr.",
    "slug": "pacto-consultoria-jr",
    "logo_url": "/logos/pacto-consultoria-jr.png",
    "cluster": 1,
    "cnpj": "00.944.114/0001-90",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Niterói",
    "cidade": "Niterói",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Administração, Administração Pública, Ciências Atuariais, Ciências Contábeis, Processos Gerenciais",
    "ano_fundacao": 2013,
    "ano_federacao": 2013,
    "email": "lmarinho@pactoconsultoriajr.com",
    "website": "http://www.pactoconsultoriajr.com.br/",
    "membros_ativos": 9,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 4000,
    "faturamentoAtual": 2700,
    "faturamentoQ1": 0,
    "faturamentoQ2": 600,
    "faturamentoQ3": 2500,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 4000,
      "faturamento_realizado": 2700,
      "percentual_alcance": 67.5,
      "ticket_medio": 4.35483871,
      "faturamento_por_membro": 300,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 78733.9,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 78733.9,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 78733.9,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 600,
          "faturamento_acumulado": 600,
          "meta_mes": 78733.9,
          "percentual_meta": 0.8,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 78733.9,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 78733.9,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 78733.9,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 600,
          "meta_mes": 78733.9,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 2500,
          "faturamento_acumulado": 3100,
          "meta_mes": 78733.9,
          "percentual_meta": 3.2,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3100,
          "meta_mes": 78733.9,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3100,
          "meta_mes": 78733.9,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 3100,
          "meta_mes": 78733.9,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 9,
      "executores_mes": 3,
      "percentual_executores": 33.33,
      "faturamento_por_membro_mes": 4.35483871,
      "retencao_1_ano_percentual": 70,
      "diversidade_minorizados_percentual": 70,
      "engajamento_mej_quantidade": 6,
      "engajamento_mej_percentual": 66.7
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 4000,
          "realizado": 2700,
          "percentual": 67.5,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 33.33,
          "quantidade_executores": 3,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 300,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 70,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 31,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 66.7,
          "membros": 6
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1621",
    "id_ej": "ej_1621",
    "nome": "Papo Design",
    "slug": "papo-design",
    "logo_url": "/logos/papo-design.png",
    "cluster": 1,
    "cnpj": "28.401.597/0001-03",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Niterói",
    "cidade": "Niterói",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Comunicação Social - Publicidade E Propaganda, Desenho Industrial",
    "ano_fundacao": 2019,
    "ano_federacao": 2019,
    "email": "contato@papodesign.com.br",
    "website": "https://www.papodesign.com.br/",
    "membros_ativos": 41,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 2001.51,
    "faturamentoQ1": 0,
    "faturamentoQ2": 0,
    "faturamentoQ3": 1260,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 2001.51,
      "percentual_alcance": 133.43,
      "ticket_medio": 1000.755,
      "faturamento_por_membro": 48.82,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 9631,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 9631,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 9631,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 9631,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 9631,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 9631,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 9631,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 1260,
          "faturamento_acumulado": 1905,
          "meta_mes": 9631,
          "percentual_meta": 13.1,
          "contratos": 2,
          "membros_executores": 6
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1905,
          "meta_mes": 9631,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1905,
          "meta_mes": 9631,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1905,
          "meta_mes": 9631,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1905,
          "meta_mes": 9631,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 41,
      "executores_mes": 14,
      "percentual_executores": 34.15,
      "faturamento_por_membro_mes": 4.068109756097561,
      "retencao_1_ano_percentual": 23.5294117647059,
      "diversidade_minorizados_percentual": 90,
      "engajamento_mej_quantidade": 17,
      "engajamento_mej_percentual": 41.5
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 2001.51,
          "percentual": 133.43,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 34.15,
          "quantidade_executores": 14,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 48.82,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 90,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 82,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 41.5,
          "membros": 17
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_2611",
    "id_ej": "ej_2611",
    "nome": "Potentia Assessoria e Consultoria Política",
    "slug": "potentia-assessoria-e-consultoria-politica",
    "logo_url": "/logos/potentia-assessoria-e-consultoria-politica.png",
    "cluster": 1,
    "cnpj": "24.048.005/0001-52",
    "regiao": "Centro-Sul 1",
    "localizacao": "UNIVERSIDADE FEDERAL DO ESTADO DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE FEDERAL DO ESTADO DO RIO DE JANEIRO",
    "cursos_admitidos": "Ciência Política",
    "ano_fundacao": 2020,
    "ano_federacao": 2020,
    "email": "contato@potentiaconsultoria.com.br",
    "website": "http://potentiaconsultoria.com.br/",
    "membros_ativos": 12,
    "farol": "vermelho",
    "farol_original": "Zerada",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 0,
    "faturamentoQ1": 0,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 0,
      "percentual_alcance": 0,
      "ticket_medio": 0,
      "faturamento_por_membro": 0,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 12000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 0,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 0,
          "percentual": 0,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 0,
          "meta_csat": 3.5,
          "nps": 0,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Regular"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 0,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_354",
    "id_ej": "ej_354",
    "nome": "Pulso Consultoria",
    "slug": "pulso-consultoria",
    "logo_url": "/logos/pulso-consultoria.png",
    "cluster": 2,
    "cnpj": "06.940.313/0001-06",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Volta Redonda",
    "cidade": "Volta Redonda",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Administração, Ciências Contábeis, Engenharia De Produção",
    "ano_fundacao": 2011,
    "ano_federacao": 2011,
    "email": "fabriciosilva@pulsoconsultoria.com.br",
    "website": "http://www.pulsoconsultoria.com.br/",
    "membros_ativos": 14,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 18000,
    "faturamentoAtual": 5298,
    "faturamentoQ1": 4362.52,
    "faturamentoQ2": 0,
    "faturamentoQ3": 6972.16,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 18000,
      "faturamento_realizado": 5298,
      "percentual_alcance": 29.43,
      "ticket_medio": 5298,
      "faturamento_por_membro": 378.43,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 4362.52,
          "faturamento_acumulado": 4362.52,
          "meta_mes": 15000,
          "percentual_meta": 29.1,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4362.52,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4362.52,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4362.52,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 1422.16,
          "faturamento_acumulado": 5784.68,
          "meta_mes": 15000,
          "percentual_meta": 9.5,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 5784.68,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 5550,
          "faturamento_acumulado": 11334.68,
          "meta_mes": 15000,
          "percentual_meta": 37,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11334.68,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11334.68,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 11334.68,
          "meta_mes": 15000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 14,
      "executores_mes": 1,
      "percentual_executores": 57.14,
      "faturamento_por_membro_mes": 31.535714285714285,
      "retencao_1_ano_percentual": 66.6666666666667,
      "diversidade_minorizados_percentual": 60,
      "engajamento_mej_quantidade": 11,
      "engajamento_mej_percentual": 78.6
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 18000,
          "realizado": 5298,
          "percentual": 29.43,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 57.14,
          "quantidade_executores": 1,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 20,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 378.43,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 60,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 78.6,
          "membros": 11
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3483",
    "id_ej": "ej_3483",
    "nome": "QualiVet",
    "slug": "qualivet",
    "logo_url": "/logos/qualivet.png",
    "cluster": 1,
    "cnpj": "56.881.804/0001-00",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE ESTÁCIO DE SÁ - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE ESTÁCIO DE SÁ",
    "cursos_admitidos": "Medicina Veterinária",
    "ano_fundacao": 2024,
    "ano_federacao": 2024,
    "email": "contato@qualivet.com.br",
    "website": "https://qualivet.com.br",
    "membros_ativos": 12,
    "farol": "vermelho",
    "farol_original": "Amarelo",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 1868.749999999999,
    "faturamentoAtual": 1775,
    "faturamentoQ1": 1175,
    "faturamentoQ2": 450,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1868.749999999999,
      "faturamento_realizado": 1775,
      "percentual_alcance": 0,
      "ticket_medio": 0,
      "faturamento_por_membro": 147.92,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 1175,
          "faturamento_acumulado": 1175,
          "meta_mes": 1500,
          "percentual_meta": 78.3,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 450,
          "faturamento_acumulado": 1775,
          "meta_mes": 1500,
          "percentual_meta": 30,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1775,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1775,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1775,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1775,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1775,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1775,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1775,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1775,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 12.32638888888889,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1868.749999999999,
          "realizado": 1775,
          "percentual": 0,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 147.92,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_2636",
    "id_ej": "ej_2636",
    "nome": "RootLocus Automação JR",
    "slug": "rootlocus-automacao-jr",
    "logo_url": "/logos/rootlocus-automacao-jr.png",
    "cluster": 1,
    "cnpj": "28.967.038/0001-57",
    "regiao": "Norte",
    "localizacao": "INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA FLUMINENSE - Macaé",
    "cidade": "Macaé",
    "ies": "INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA FLUMINENSE",
    "cursos_admitidos": "Engenharia De Controle E Automação, Engenharia Elétrica",
    "ano_fundacao": 2020,
    "ano_federacao": 2020,
    "email": "contato@rootlocus.com.br",
    "website": "https://www.rootlocus.com.br/",
    "membros_ativos": 12,
    "farol": "protagonista",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 6000,
    "faturamentoQ1": 0,
    "faturamentoQ2": 50,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 6000,
      "percentual_alcance": 400,
      "ticket_medio": 0,
      "faturamento_por_membro": 500,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 9600,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 9600,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 9600,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 50,
          "faturamento_acumulado": 50,
          "meta_mes": 9600,
          "percentual_meta": 0.5,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 50,
          "meta_mes": 9600,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 50,
          "meta_mes": 9600,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 50,
          "meta_mes": 9600,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 50,
          "meta_mes": 9600,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 50,
          "meta_mes": 9600,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 50,
          "meta_mes": 9600,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 50,
          "meta_mes": 9600,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 50,
          "meta_mes": 9600,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 41.666666666666664,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 6000,
          "percentual": 400,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 500,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_598",
    "id_ej": "ej_598",
    "nome": "Rural Consultoria Junior",
    "slug": "rural-consultoria-junior",
    "logo_url": "/logos/rural-consultoria-junior.png",
    "cluster": 2,
    "cnpj": "19.414.583/0001-25",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Seropédica",
    "cidade": "Seropédica",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Agronomia",
    "ano_fundacao": 2017,
    "ano_federacao": 2017,
    "email": "atendimentoruralconsultoria@gmail.com",
    "website": "https://ruralconsultoriajr.com.br",
    "membros_ativos": 25,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 8000,
    "faturamentoAtual": 3754.01,
    "faturamentoQ1": 4308.1,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 23614.75,
    "financeiro": {
      "meta_anual": 8000,
      "faturamento_realizado": 3754.01,
      "percentual_alcance": 46.93,
      "ticket_medio": 31.28341667,
      "faturamento_por_membro": 150.16,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 3069.71,
          "faturamento_acumulado": 3129.71,
          "meta_mes": 6000,
          "percentual_meta": 51.2,
          "contratos": 2,
          "membros_executores": 6
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 1238.39,
          "faturamento_acumulado": 4368.1,
          "meta_mes": 6000,
          "percentual_meta": 20.6,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4368.1,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4368.1,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4368.1,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4368.1,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4368.1,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 4368.1,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 467.84,
          "faturamento_acumulado": 4835.94,
          "meta_mes": 6000,
          "percentual_meta": 7.8,
          "contratos": 1,
          "membros_executores": 7
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 23146.91,
          "faturamento_acumulado": 27982.85,
          "meta_mes": 6000,
          "percentual_meta": 385.8,
          "contratos": 2,
          "membros_executores": 16
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 27982.85,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 25,
      "executores_mes": 12,
      "percentual_executores": 68,
      "faturamento_por_membro_mes": 31.28341667,
      "retencao_1_ano_percentual": 48,
      "diversidade_minorizados_percentual": 80,
      "engajamento_mej_quantidade": 11,
      "engajamento_mej_percentual": 44
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 8000,
          "realizado": 3754.01,
          "percentual": 46.93,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 4,
          "percentual": 100,
          "status": "Atingido"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 68,
          "quantidade_executores": 12,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.17,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 83.33,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 150.16,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 80,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 44,
          "membros": 11
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 8,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_586",
    "id_ej": "ej_586",
    "nome": "Salto Consultoria",
    "slug": "salto-consultoria",
    "logo_url": "/logos/salto-consultoria.png",
    "cluster": 1,
    "cnpj": "26.288.823/0001-58",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE VEIGA DE ALMEIDA - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE VEIGA DE ALMEIDA",
    "cursos_admitidos": "Administração, Ciência Da Computação, Ciência Econômica, Ciências Contábeis, Comunicação Social - Publicidade E Propaganda, Design Gráfico, Direito, Engenharia Ambiental, Engenharia Civil, Engenharia De Computação, Engenharia De Petróleo, Engenharia Elétrica, Psicologia, Relações Internacionais",
    "ano_fundacao": 2017,
    "ano_federacao": 2017,
    "email": "presidencia@saltoconsultoria.com",
    "website": "https://www.saltoconsultoria.com/",
    "membros_ativos": 23,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 7000,
    "faturamentoAtual": 4980,
    "faturamentoQ1": 0,
    "faturamentoQ2": 1750,
    "faturamentoQ3": 1120,
    "faturamentoQ4": 1200,
    "financeiro": {
      "meta_anual": 7000,
      "faturamento_realizado": 4980,
      "percentual_alcance": 71.14,
      "ticket_medio": 4980,
      "faturamento_por_membro": 216.52,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 4000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 4000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 4000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 1500,
          "faturamento_acumulado": 1500,
          "meta_mes": 4000,
          "percentual_meta": 37.5,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 250,
          "faturamento_acumulado": 1750,
          "meta_mes": 4000,
          "percentual_meta": 6.3,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1750,
          "meta_mes": 4000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1750,
          "meta_mes": 4000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 480,
          "faturamento_acumulado": 2230,
          "meta_mes": 4000,
          "percentual_meta": 12,
          "contratos": 1,
          "membros_executores": 10
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 640,
          "faturamento_acumulado": 2870,
          "meta_mes": 4000,
          "percentual_meta": 16,
          "contratos": 1,
          "membros_executores": 13
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2870,
          "meta_mes": 4000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2870,
          "meta_mes": 4000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 1200,
          "faturamento_acumulado": 4070,
          "meta_mes": 4000,
          "percentual_meta": 30,
          "contratos": 1,
          "membros_executores": 8
        }
      ]
    },
    "membros": {
      "total_ativos": 23,
      "executores_mes": 0,
      "percentual_executores": 26.09,
      "faturamento_por_membro_mes": 18.043478260869566,
      "retencao_1_ano_percentual": 35.2941176470588,
      "diversidade_minorizados_percentual": 70,
      "engajamento_mej_quantidade": 6,
      "engajamento_mej_percentual": 26.1
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 7000,
          "realizado": 4980,
          "percentual": 71.14,
          "status": "Em Andamento"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 26.09,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 216.52,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 70,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 26.1,
          "membros": 6
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_542",
    "id_ej": "ej_542",
    "nome": "Serra Jr. Engenharia",
    "slug": "serra-jr-engenharia",
    "logo_url": "/logos/serra-jr-engenharia.png",
    "cluster": 1,
    "cnpj": "05.242.209/0001-85",
    "regiao": "Centro Norte",
    "localizacao": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO - Nova Friburgo",
    "cidade": "Nova Friburgo",
    "ies": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO",
    "cursos_admitidos": "Engenharia De Computação, Engenharia Mecânica",
    "ano_fundacao": 2025,
    "ano_federacao": 2025,
    "email": "presidente@serrajr.eng.br",
    "website": "https://serrajr.com.br/",
    "membros_ativos": 24,
    "farol": "protagonista",
    "farol_original": "Amarelo",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 13000,
    "faturamentoQ1": 12999.99,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 13000,
      "percentual_alcance": 866.67,
      "ticket_medio": 185.7142857,
      "faturamento_por_membro": 541.67,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 4333.33,
          "faturamento_acumulado": 4333.33,
          "meta_mes": 125,
          "percentual_meta": 3466.7,
          "contratos": 1,
          "membros_executores": 12
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 4333.33,
          "faturamento_acumulado": 8666.66,
          "meta_mes": 125,
          "percentual_meta": 3466.7,
          "contratos": 1,
          "membros_executores": 12
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 4333.33,
          "faturamento_acumulado": 12999.99,
          "meta_mes": 125,
          "percentual_meta": 3466.7,
          "contratos": 1,
          "membros_executores": 12
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 12999.99,
          "meta_mes": 125,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 24,
      "executores_mes": 12,
      "percentual_executores": 50,
      "faturamento_por_membro_mes": 185.7142857,
      "retencao_1_ano_percentual": 62.5,
      "diversidade_minorizados_percentual": 60,
      "engajamento_mej_quantidade": 21,
      "engajamento_mej_percentual": 87.5
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 13000,
          "percentual": 866.67,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 50,
          "quantidade_executores": 12,
          "status": "Atingido"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 541.67,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 60,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 130,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 87.5,
          "membros": 21
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_1556",
    "id_ej": "ej_1556",
    "nome": "Signal Jr",
    "slug": "signal-jr",
    "logo_url": "/logos/signal-jr.png",
    "cluster": 1,
    "cnpj": "30.197.100/0001-10",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Seropédica",
    "cidade": "Seropédica",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Administração, Matemática - Licenciatura Ou Bacharelado, Sistemas De Informação",
    "ano_fundacao": 2019,
    "ano_federacao": 2019,
    "email": "presidencia.signal@gmail.com",
    "website": "https://www.signaljunior.com.br/",
    "membros_ativos": 27,
    "farol": "protagonista",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 3500,
    "faturamentoAtual": 5065,
    "faturamentoQ1": 0,
    "faturamentoQ2": 1272.22,
    "faturamentoQ3": 1400,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 3500,
      "faturamento_realizado": 5065,
      "percentual_alcance": 144.71,
      "ticket_medio": 33.76666667,
      "faturamento_por_membro": 187.59,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 3500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 3500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 3500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 1272.22,
          "faturamento_acumulado": 1272.22,
          "meta_mes": 3500,
          "percentual_meta": 36.3,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1272.22,
          "meta_mes": 3500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1272.22,
          "meta_mes": 3500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1272.22,
          "meta_mes": 3500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 1272.22,
          "meta_mes": 3500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 1400,
          "faturamento_acumulado": 2672.22,
          "meta_mes": 3500,
          "percentual_meta": 40,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2672.22,
          "meta_mes": 3500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2672.22,
          "meta_mes": 3500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 2672.22,
          "meta_mes": 3500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 27,
      "executores_mes": 8,
      "percentual_executores": 37.04,
      "faturamento_por_membro_mes": 33.76666667,
      "retencao_1_ano_percentual": 54.5454545454545,
      "diversidade_minorizados_percentual": 75,
      "engajamento_mej_quantidade": 12,
      "engajamento_mej_percentual": 44.4
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 3500,
          "realizado": 5065,
          "percentual": 144.71,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 37.04,
          "quantidade_executores": 8,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 187.59,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 2500,
          "parceiros": "UFFTech"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 75,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 44.4,
          "membros": 12
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 1,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_2555",
    "id_ej": "ej_2555",
    "nome": "SOLARMATERIAIS",
    "slug": "solarmateriais",
    "logo_url": "/logos/solarmateriais.png",
    "cluster": 2,
    "cnpj": "35.521.153/0001-69",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Seropédica",
    "cidade": "Seropédica",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Arquitetura E Urbanismo, Engenharia Agrícola E Ambiental, Engenharia De Materiais, Engenharia Florestal, Engenharia Química",
    "ano_fundacao": 2021,
    "ano_federacao": 2021,
    "email": "solarmateriais.ufrrj@gmail.com",
    "website": "https://solarmateriaisrj.wixsite.com/consultoria",
    "membros_ativos": 16,
    "farol": "verde",
    "farol_original": "Verde",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 8800,
    "faturamentoAtual": 308,
    "faturamentoQ1": 7200.4,
    "faturamentoQ2": 629.5,
    "faturamentoQ3": 274.99,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 8800,
      "faturamento_realizado": 308,
      "percentual_alcance": 3.5,
      "ticket_medio": 0.4219178082,
      "faturamento_por_membro": 19.25,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 611,
          "faturamento_acumulado": 611,
          "meta_mes": 6000,
          "percentual_meta": 10.2,
          "contratos": 1,
          "membros_executores": 4
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 589.4,
          "faturamento_acumulado": 1200.4,
          "meta_mes": 6000,
          "percentual_meta": 9.8,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 6000,
          "faturamento_acumulado": 11931.4,
          "meta_mes": 6000,
          "percentual_meta": 100,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 629.5,
          "faturamento_acumulado": 13070.9,
          "meta_mes": 6000,
          "percentual_meta": 10.5,
          "contratos": 2,
          "membros_executores": 18
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 13070.9,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 13070.9,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 15.99,
          "faturamento_acumulado": 13086.89,
          "meta_mes": 6000,
          "percentual_meta": 0.3,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 13086.89,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 259,
          "faturamento_acumulado": 13345.89,
          "meta_mes": 6000,
          "percentual_meta": 4.3,
          "contratos": 1,
          "membros_executores": 5
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 13345.89,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 13345.89,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 13345.89,
          "meta_mes": 6000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 16,
      "executores_mes": 3,
      "percentual_executores": 25,
      "faturamento_por_membro_mes": 0.4219178082,
      "retencao_1_ano_percentual": 50,
      "diversidade_minorizados_percentual": 85,
      "engajamento_mej_quantidade": 13,
      "engajamento_mej_percentual": 81.3
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 8800,
          "realizado": 308,
          "percentual": 3.5,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 25,
          "quantidade_executores": 3,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 19.25,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 308,
          "parceiros": "Flora Júnior"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 85,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 81.3,
          "membros": 13
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 1,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_383",
    "id_ej": "ej_383",
    "nome": "Titanus Soluções Sustentáveis",
    "slug": "titanus-solucoes-sustentaveis",
    "logo_url": "/logos/titanus-solucoes-sustentaveis.png",
    "cluster": 1,
    "cnpj": "19.105.420/0001-60",
    "regiao": "Centro-Sul 2",
    "localizacao": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO - Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "ies": "UNIVERSIDADE DO ESTADO DO RIO DE JANEIRO",
    "cursos_admitidos": "Ciências Biológicas, Engenharia Ambiental E Sanitária",
    "ano_fundacao": 2014,
    "ano_federacao": 2014,
    "email": "contato@titanus.com.br",
    "website": "http://www.titanus.com.br/",
    "membros_ativos": 12,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 20,
    "faturamentoQ1": 0,
    "faturamentoQ2": 20,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 20,
      "percentual_alcance": 1.33,
      "ticket_medio": 0,
      "faturamento_por_membro": 1.67,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 11216,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 11216,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 11216,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 20,
          "faturamento_acumulado": 20,
          "meta_mes": 11216,
          "percentual_meta": 0.2,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 20,
          "meta_mes": 11216,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 20,
          "meta_mes": 11216,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 20,
          "meta_mes": 11216,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 20,
          "meta_mes": 11216,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 20,
          "meta_mes": 11216,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 20,
          "meta_mes": 11216,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 20,
          "meta_mes": 11216,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 20,
          "meta_mes": 11216,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 0.1388888888888889,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 20,
          "percentual": 1.33,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 1.67,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_2558",
    "id_ej": "ej_2558",
    "nome": "UFFTech",
    "slug": "ufftech",
    "logo_url": "/logos/ufftech.png",
    "cluster": 1,
    "cnpj": "44.174.136/0001-93",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL FLUMINENSE - Volta Redonda",
    "cidade": "Volta Redonda",
    "ies": "UNIVERSIDADE FEDERAL FLUMINENSE",
    "cursos_admitidos": "Administração, Ciências Contábeis, Engenharia De Agronegócios, Engenharia De Materiais, Engenharia De Produção, Engenharia Mecânica, Engenharia Metalúrgica, Física, Matemática, Psicologia, Química, Sistemas De Informação",
    "ano_fundacao": 2021,
    "ano_federacao": 2021,
    "email": "ufftech.ej@gmail.com",
    "website": "https://ufftech.com/",
    "membros_ativos": 32,
    "farol": "protagonista",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "CONTATINHO",
    "faturamentoMeta": 3000,
    "faturamentoAtual": 3000,
    "faturamentoQ1": 0,
    "faturamentoQ2": 0,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 3000,
      "faturamento_realizado": 3000,
      "percentual_alcance": 100,
      "ticket_medio": 10,
      "faturamento_por_membro": 93.75,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 15500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 32,
      "executores_mes": 6,
      "percentual_executores": 18.75,
      "faturamento_por_membro_mes": 10,
      "retencao_1_ano_percentual": 34.2857142857143,
      "diversidade_minorizados_percentual": 70,
      "engajamento_mej_quantidade": 10,
      "engajamento_mej_percentual": 31.3
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 3000,
          "realizado": 3000,
          "percentual": 100,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 2,
          "percentual": 66.7,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 18.75,
          "quantidade_executores": 6,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 93.75,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 2500,
          "parceiros": "Signal Jr"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 70,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 31.3,
          "membros": 10
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_2984",
    "id_ej": "ej_2984",
    "nome": "Vale Verde SSA",
    "slug": "vale-verde-ssa",
    "logo_url": "/logos/vale-verde-ssa.png",
    "cluster": 1,
    "cnpj": "19.433.989/0001-55",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Três Rios",
    "cidade": "Três Rios",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Gestão Ambiental",
    "ano_fundacao": 2021,
    "ano_federacao": 2021,
    "email": "valeverdessa@gmil.com",
    "website": "http://www.valeverdessa.com.br/",
    "membros_ativos": 3,
    "farol": "vermelho",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 1000,
    "faturamentoQ1": 0,
    "faturamentoQ2": 500,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 1000,
      "percentual_alcance": 66.67,
      "ticket_medio": 0,
      "faturamento_por_membro": 333.33,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 500,
          "faturamento_acumulado": 552.5,
          "meta_mes": 1500,
          "percentual_meta": 33.3,
          "contratos": 1,
          "membros_executores": 1
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 552.5,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 552.5,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 552.5,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 552.5,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 552.5,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 552.5,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 552.5,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 552.5,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 3,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 27.77777777777778,
      "retencao_1_ano_percentual": 87.5,
      "diversidade_minorizados_percentual": 100,
      "engajamento_mej_quantidade": 2,
      "engajamento_mej_percentual": 50
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 1000,
          "percentual": 66.67,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 333.33,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 100,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 50,
          "membros": 2
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_3208",
    "id_ej": "ej_3208",
    "nome": "Vértix Jr",
    "slug": "vertix-jr",
    "logo_url": "/logos/vertix-jr.png",
    "cluster": 1,
    "cnpj": "44.516.675/0001-63",
    "regiao": "Centro Norte",
    "localizacao": "Faculdade Vértix Trirriense - Três Rios",
    "cidade": "Três Rios",
    "ies": "Faculdade Vértix Trirriense",
    "cursos_admitidos": "Administração, Direito, Enfermagem, Engenharia Civil",
    "ano_fundacao": 2022,
    "ano_federacao": 2022,
    "email": "contato@vertix-jr.com.br",
    "website": "https://vertix-jr.com.br",
    "membros_ativos": 12,
    "farol": "vermelho",
    "farol_original": "Amarelo",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Alto Crescimento",
    "classificacao": "Desenvolvimento",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 745,
    "faturamentoQ1": 0,
    "faturamentoQ2": 745,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 745,
      "percentual_alcance": 0,
      "ticket_medio": 0,
      "faturamento_por_membro": 62.08,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 745,
          "faturamento_acumulado": 745,
          "meta_mes": 1500,
          "percentual_meta": 49.7,
          "contratos": 1,
          "membros_executores": 10
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 745,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 745,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 745,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 745,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 745,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 745,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 745,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 745,
          "meta_mes": 1500,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 5.173611111111111,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 745,
          "percentual": 0,
          "status": "Atenção"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 62.08,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_756",
    "id_ej": "ej_756",
    "nome": "Vital Jr Consultoria",
    "slug": "vital-jr-consultoria",
    "logo_url": "/logos/vital-jr-consultoria.png",
    "cluster": 1,
    "cnpj": "13.281.679/0001-86",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Seropédica",
    "cidade": "Seropédica",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Zootecnia",
    "ano_fundacao": 2017,
    "ano_federacao": 2017,
    "email": "contato@vitaljrconsultoria.com",
    "website": "http://www.vitaljrconsultoria.com",
    "membros_ativos": 17,
    "farol": "verde",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Colaborativa",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 10000,
    "faturamentoAtual": 8531.36,
    "faturamentoQ1": 6225,
    "faturamentoQ2": 696,
    "faturamentoQ3": 830.54,
    "faturamentoQ4": 607.3199999999999,
    "financeiro": {
      "meta_anual": 10000,
      "faturamento_realizado": 8531.36,
      "percentual_alcance": 85.31,
      "ticket_medio": 8531.36,
      "faturamento_por_membro": 501.84,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 5925,
          "faturamento_acumulado": 5925,
          "meta_mes": 15126.76,
          "percentual_meta": 39.2,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 5925,
          "meta_mes": 15126.76,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 300,
          "faturamento_acumulado": 6225,
          "meta_mes": 15126.76,
          "percentual_meta": 2,
          "contratos": 1,
          "membros_executores": 2
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 576,
          "faturamento_acumulado": 7251,
          "meta_mes": 15126.76,
          "percentual_meta": 3.8,
          "contratos": 2,
          "membros_executores": 5
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 120,
          "faturamento_acumulado": 7371,
          "meta_mes": 15126.76,
          "percentual_meta": 0.8,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 7371,
          "meta_mes": 15126.76,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 7371,
          "meta_mes": 15126.76,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 7371,
          "meta_mes": 15126.76,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 830.54,
          "faturamento_acumulado": 8668.14,
          "meta_mes": 15126.76,
          "percentual_meta": 5.5,
          "contratos": 2,
          "membros_executores": 7
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 167.32,
          "faturamento_acumulado": 9504.71,
          "meta_mes": 15126.76,
          "percentual_meta": 1.1,
          "contratos": 1,
          "membros_executores": 8
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 440,
          "faturamento_acumulado": 9944.71,
          "meta_mes": 15126.76,
          "percentual_meta": 2.9,
          "contratos": 1,
          "membros_executores": 6
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 9944.71,
          "meta_mes": 15126.76,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 17,
      "executores_mes": 0,
      "percentual_executores": 11.76,
      "faturamento_por_membro_mes": 41.820392156862745,
      "retencao_1_ano_percentual": 45.8333333333333,
      "diversidade_minorizados_percentual": 95,
      "engajamento_mej_quantidade": 10,
      "engajamento_mej_percentual": 58.8
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 10000,
          "realizado": 8531.36,
          "percentual": 85.31,
          "status": "Em Andamento"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 1,
          "percentual": 33.3,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 11.76,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 1,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 501.84,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 95,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 58.8,
          "membros": 10
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  },
  {
    "id": "ej_371",
    "id_ej": "ej_371",
    "nome": "XPORT Jr. Consultoria e Suporte Internacional",
    "slug": "xport-jr-consultoria-e-suporte-internacional",
    "logo_url": "/logos/xport-jr-consultoria-e-suporte-internacional.png",
    "cluster": 1,
    "cnpj": "20.994.947/0001-72",
    "regiao": "Sul",
    "localizacao": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO - Seropédica",
    "cidade": "Seropédica",
    "ies": "UNIVERSIDADE FEDERAL RURAL DO RIO DE JANEIRO",
    "cursos_admitidos": "Administração, Ciências Econômicas, Direito, Relações Internacionais",
    "ano_fundacao": 2016,
    "ano_federacao": 2016,
    "email": "presidencia.xportjr@gmail.com",
    "website": "https://www.xportjr.com.br/",
    "membros_ativos": 12,
    "farol": "protagonista",
    "farol_original": "Vermelho",
    "guardiao_ddr": "Gabriel Maia",
    "batalha": "Inovadora",
    "classificacao": "SOCORRO DEUS",
    "faturamentoMeta": 1500,
    "faturamentoAtual": 7285.75,
    "faturamentoQ1": 0,
    "faturamentoQ2": 429.1,
    "faturamentoQ3": 0,
    "faturamentoQ4": 0,
    "financeiro": {
      "meta_anual": 1500,
      "faturamento_realizado": 7285.75,
      "percentual_alcance": 485.72,
      "ticket_medio": 0,
      "faturamento_por_membro": 607.15,
      "meses_executados": [
        {
          "mes": 1,
          "nome_mes": "Janeiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 50000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 2,
          "nome_mes": "Fevereiro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 50000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 3,
          "nome_mes": "Março",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 50000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 4,
          "nome_mes": "Abril",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 50000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 5,
          "nome_mes": "Maio",
          "faturamento_mes": 0,
          "faturamento_acumulado": 0,
          "meta_mes": 50000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 6,
          "nome_mes": "Junho",
          "faturamento_mes": 429.1,
          "faturamento_acumulado": 858.2,
          "meta_mes": 50000,
          "percentual_meta": 0.9,
          "contratos": 1,
          "membros_executores": 3
        },
        {
          "mes": 7,
          "nome_mes": "Julho",
          "faturamento_mes": 0,
          "faturamento_acumulado": 858.2,
          "meta_mes": 50000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 8,
          "nome_mes": "Agosto",
          "faturamento_mes": 0,
          "faturamento_acumulado": 858.2,
          "meta_mes": 50000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 9,
          "nome_mes": "Setembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 858.2,
          "meta_mes": 50000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 10,
          "nome_mes": "Outubro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 858.2,
          "meta_mes": 50000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 11,
          "nome_mes": "Novembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 858.2,
          "meta_mes": 50000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        },
        {
          "mes": 12,
          "nome_mes": "Dezembro",
          "faturamento_mes": 0,
          "faturamento_acumulado": 858.2,
          "meta_mes": 50000,
          "percentual_meta": 0,
          "contratos": 0,
          "membros_executores": 0
        }
      ]
    },
    "membros": {
      "total_ativos": 12,
      "executores_mes": 0,
      "percentual_executores": 0,
      "faturamento_por_membro_mes": 50.595486111111114,
      "retencao_1_ano_percentual": 75,
      "diversidade_minorizados_percentual": 35,
      "engajamento_mej_quantidade": 0,
      "engajamento_mej_percentual": 0
    },
    "indicadores_pe_brasil_junior": {
      "essenciais": {
        "faturamento_total": {
          "nome": "Faturamento Total",
          "meta": 1500,
          "realizado": 7285.75,
          "percentual": 485.72,
          "status": "Atingido"
        },
        "projetos_solucoes": {
          "nome": "Projetos / Soluções de Impacto",
          "meta": 3,
          "realizado": 0,
          "percentual": 0,
          "status": "Em Andamento"
        },
        "membros_que_executam": {
          "nome": "Membros que Executam Projetos",
          "meta_percentual": 50,
          "realizado_percentual": 0,
          "quantidade_executores": 0,
          "status": "Abaixo da Meta"
        },
        "satisfacao_cliente": {
          "nome": "Satisfação do Cliente (CSAT & NPS)",
          "csat": 4.8,
          "meta_csat": 3.5,
          "nps": 82,
          "meta_nps": 75,
          "coleta_percentual": 0,
          "status": "Excelente"
        },
        "selo_ej": {
          "nome": "Selo EJ (Conformidade Jurídica & Fiscal)",
          "status": "Regular (13/13 documentos)",
          "regular": true,
          "descricao": "Estatuto, CNPJ, CNDs e Contabilidade em dia com a RioJunior"
        }
      },
      "complementares": {
        "faturamento_por_membro": {
          "nome": "Faturamento por Membro (Produtividade)",
          "valor": 607.15,
          "unidade": "R$/membro"
        },
        "rede_colaborativa": {
          "nome": "Taxa de Colaboração & Parcerias",
          "meta_percentual": 30,
          "realizado_percentual": 0,
          "faturamento_colaborativo": 0,
          "parceiros": "Nenhuma ação registrada"
        },
        "diversidade_inclusao": {
          "nome": "Diversidade & Inclusão (D&I)",
          "membros_minorizados_percentual": 35,
          "politicas_di_adotadas": "Em Estruturação"
        },
        "tempo_medio_contrato": {
          "nome": "Tempo Médio de Contrato",
          "dias": 0,
          "unidade": "dias"
        },
        "engajamento_mej": {
          "nome": "Engajamento com o MEJ (ECMJ)",
          "percentual": 0,
          "membros": 0
        },
        "solucoes_inovadoras": {
          "nome": "Inovação & ODS da ONU",
          "ods_contempladas": 0,
          "solucoes_inovadoras": 0
        }
      }
    }
  }
];
