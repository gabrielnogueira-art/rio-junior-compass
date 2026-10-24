export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      abatimentos_pf: {
        Row: {
          created_at: string
          evento_id: string
          id: string
          item: string
          parceiro_nome: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          created_at?: string
          evento_id: string
          id?: string
          item: string
          parceiro_nome?: string | null
          updated_at?: string
          valor?: number
        }
        Update: {
          created_at?: string
          evento_id?: string
          id?: string
          item?: string
          parceiro_nome?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "abatimentos_pf_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "presidencia_eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      anuidades: {
        Row: {
          ano: number
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          ej_id: string
          id: string
          juros_percentual: number | null
          parcela_numero: number | null
          status: string
          suporte_anuidade: boolean
          total_parcelas: number | null
          valor: number
          valor_juros: number | null
        }
        Insert: {
          ano: number
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          ej_id: string
          id?: string
          juros_percentual?: number | null
          parcela_numero?: number | null
          status: string
          suporte_anuidade?: boolean
          total_parcelas?: number | null
          valor: number
          valor_juros?: number | null
        }
        Update: {
          ano?: number
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          ej_id?: string
          id?: string
          juros_percentual?: number | null
          parcela_numero?: number | null
          status?: string
          suporte_anuidade?: boolean
          total_parcelas?: number | null
          valor?: number
          valor_juros?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "anuidades_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
      assinaturas_certificado: {
        Row: {
          cargo: string
          created_at: string
          id: string
          nome: string
          png_url: string | null
          updated_at: string
        }
        Insert: {
          cargo: string
          created_at?: string
          id?: string
          nome?: string
          png_url?: string | null
          updated_at?: string
        }
        Update: {
          cargo?: string
          created_at?: string
          id?: string
          nome?: string
          png_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      caravanas: {
        Row: {
          created_at: string
          ej_id: string | null
          evento_id: string
          id: string
          ies: string | null
          num_pessoas: number
          regiao: string | null
          updated_at: string
          valor_medio_ingresso: number
        }
        Insert: {
          created_at?: string
          ej_id?: string | null
          evento_id: string
          id?: string
          ies?: string | null
          num_pessoas?: number
          regiao?: string | null
          updated_at?: string
          valor_medio_ingresso?: number
        }
        Update: {
          created_at?: string
          ej_id?: string | null
          evento_id?: string
          id?: string
          ies?: string | null
          num_pessoas?: number
          regiao?: string | null
          updated_at?: string
          valor_medio_ingresso?: number
        }
        Relationships: [
          {
            foreignKeyName: "caravanas_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caravanas_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "presidencia_eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      certificados: {
        Row: {
          config_editor: Json
          created_at: string
          ej_id: string
          emitido_em: string
          evento_id: string
          id: string
          indicador: string
          texto_certificado: string | null
          updated_at: string
        }
        Insert: {
          config_editor?: Json
          created_at?: string
          ej_id: string
          emitido_em?: string
          evento_id: string
          id?: string
          indicador?: string
          texto_certificado?: string | null
          updated_at?: string
        }
        Update: {
          config_editor?: Json
          created_at?: string
          ej_id?: string
          emitido_em?: string
          evento_id?: string
          id?: string
          indicador?: string
          texto_certificado?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificados_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificados_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      ciclos: {
        Row: {
          ano: number
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          id: string
          nome: string
          numero: number
          tipo: string
          updated_at: string
        }
        Insert: {
          ano?: number
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          nome: string
          numero?: number
          tipo: string
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          nome?: string
          numero?: number
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes_presidencia: {
        Row: {
          created_at: string
          data_referencia_status: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_referencia_status?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_referencia_status?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      contratos: {
        Row: {
          ano: number
          created_at: string
          ej_colaboradora_id: string | null
          ej_id: string
          id: string
          nome: string
          tem_colaboracao: boolean
          updated_at: string
          valor: number
          valor_ej: number
        }
        Insert: {
          ano?: number
          created_at?: string
          ej_colaboradora_id?: string | null
          ej_id: string
          id?: string
          nome: string
          tem_colaboracao?: boolean
          updated_at?: string
          valor?: number
          valor_ej?: number
        }
        Update: {
          ano?: number
          created_at?: string
          ej_colaboradora_id?: string | null
          ej_id?: string
          id?: string
          nome?: string
          tem_colaboracao?: boolean
          updated_at?: string
          valor?: number
          valor_ej?: number
        }
        Relationships: [
          {
            foreignKeyName: "contratos_ej_colaboradora_id_fkey"
            columns: ["ej_colaboradora_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
      demandas_formacao: {
        Row: {
          created_at: string
          etapa: string
          evento_id: string
          id: string
          prazo: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          etapa: string
          evento_id: string
          id?: string
          prazo?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          etapa?: string
          evento_id?: string
          id?: string
          prazo?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demandas_formacao_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "presidencia_eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          created_at: string
          descricao: string | null
          etapa: number
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          etapa: number
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          etapa?: number
          id?: string
          nome?: string
        }
        Relationships: []
      }
      ejs: {
        Row: {
          cluster: number
          cnpj: string
          created_at: string
          faturamento_atual: number
          faturamento_meta: number
          faturamento_q1: number | null
          faturamento_q2: number | null
          faturamento_q3: number | null
          faturamento_q4: number | null
          id: string
          localizacao: string
          nome: string
          regiao: string
          updated_at: string
        }
        Insert: {
          cluster: number
          cnpj: string
          created_at?: string
          faturamento_atual?: number
          faturamento_meta?: number
          faturamento_q1?: number | null
          faturamento_q2?: number | null
          faturamento_q3?: number | null
          faturamento_q4?: number | null
          id?: string
          localizacao: string
          nome: string
          regiao: string
          updated_at?: string
        }
        Update: {
          cluster?: number
          cnpj?: string
          created_at?: string
          faturamento_atual?: number
          faturamento_meta?: number
          faturamento_q1?: number | null
          faturamento_q2?: number | null
          faturamento_q3?: number | null
          faturamento_q4?: number | null
          id?: string
          localizacao?: string
          nome?: string
          regiao?: string
          updated_at?: string
        }
        Relationships: []
      }
      entregas_documentos: {
        Row: {
          created_at: string
          data_entrega: string | null
          documento_id: string
          ej_id: string
          entregue: boolean
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_entrega?: string | null
          documento_id: string
          ej_id: string
          entregue?: boolean
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_entrega?: string | null
          documento_id?: string
          ej_id?: string
          entregue?: boolean
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entregas_documentos_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: false
            referencedRelation: "documentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_documentos_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          diretorias: string[] | null
          id: string
          momento_palco: boolean
          nome: string
          pauta: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          diretorias?: string[] | null
          id?: string
          momento_palco?: boolean
          nome: string
          pauta?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          diretorias?: string[] | null
          id?: string
          momento_palco?: boolean
          nome?: string
          pauta?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      faturamento_mensal: {
        Row: {
          ano: number
          created_at: string
          ej_id: string
          id: string
          mes: number
          meta_mes: number
          updated_at: string
          valor: number
        }
        Insert: {
          ano: number
          created_at?: string
          ej_id: string
          id?: string
          mes: number
          meta_mes?: number
          updated_at?: string
          valor?: number
        }
        Update: {
          ano?: number
          created_at?: string
          ej_id?: string
          id?: string
          mes?: number
          meta_mes?: number
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "faturamento_mensal_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_evento_config: {
        Row: {
          created_at: string
          evento_id: string
          id: string
          magnas_vendaveis: number
          paralelas_vendaveis: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          evento_id: string
          id?: string
          magnas_vendaveis?: number
          paralelas_vendaveis?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          evento_id?: string
          id?: string
          magnas_vendaveis?: number
          paralelas_vendaveis?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grade_evento_config_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: true
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      key_results: {
        Row: {
          atual: number
          created_at: string
          descricao: string | null
          id: string
          meta: number
          objetivo_id: string
          tipo_metrica: string
          titulo: string
          unidade: string | null
          updated_at: string
        }
        Insert: {
          atual?: number
          created_at?: string
          descricao?: string | null
          id?: string
          meta: number
          objetivo_id: string
          tipo_metrica: string
          titulo: string
          unidade?: string | null
          updated_at?: string
        }
        Update: {
          atual?: number
          created_at?: string
          descricao?: string | null
          id?: string
          meta?: number
          objetivo_id?: string
          tipo_metrica?: string
          titulo?: string
          unidade?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "key_results_objetivo_id_fkey"
            columns: ["objetivo_id"]
            isOneToOne: false
            referencedRelation: "objetivos"
            referencedColumns: ["id"]
          },
        ]
      }
      objetivos: {
        Row: {
          ciclo_id: string | null
          created_at: string
          descricao: string | null
          diretoria: string | null
          id: string
          nivel: string
          objetivo_pai_id: string | null
          okr_estrategica_id: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          ciclo_id?: string | null
          created_at?: string
          descricao?: string | null
          diretoria?: string | null
          id?: string
          nivel: string
          objetivo_pai_id?: string | null
          okr_estrategica_id?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          ciclo_id?: string | null
          created_at?: string
          descricao?: string | null
          diretoria?: string | null
          id?: string
          nivel?: string
          objetivo_pai_id?: string | null
          okr_estrategica_id?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "objetivos_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "ciclos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objetivos_objetivo_pai_id_fkey"
            columns: ["objetivo_pai_id"]
            isOneToOne: false
            referencedRelation: "objetivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objetivos_okr_estrategica_id_fkey"
            columns: ["okr_estrategica_id"]
            isOneToOne: false
            referencedRelation: "okrs_estrategicas"
            referencedColumns: ["id"]
          },
        ]
      }
      okrs_estrategicas: {
        Row: {
          ano: number
          created_at: string
          descricao: string | null
          id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ano?: number
          created_at?: string
          descricao?: string | null
          id?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          descricao?: string | null
          id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      pautas_evento: {
        Row: {
          created_at: string
          csat: number | null
          dia: string | null
          evento_id: string
          horario: string | null
          id: string
          ministrante_nome: string | null
          ministrante_tipo: string | null
          ordem: number
          parceiro_nome: string | null
          tematica_macro: string | null
          tipo: string
          titulo: string | null
          updated_at: string
          venda_id: string | null
        }
        Insert: {
          created_at?: string
          csat?: number | null
          dia?: string | null
          evento_id: string
          horario?: string | null
          id?: string
          ministrante_nome?: string | null
          ministrante_tipo?: string | null
          ordem?: number
          parceiro_nome?: string | null
          tematica_macro?: string | null
          tipo?: string
          titulo?: string | null
          updated_at?: string
          venda_id?: string | null
        }
        Update: {
          created_at?: string
          csat?: number | null
          dia?: string | null
          evento_id?: string
          horario?: string | null
          id?: string
          ministrante_nome?: string | null
          ministrante_tipo?: string | null
          ordem?: number
          parceiro_nome?: string | null
          tematica_macro?: string | null
          tipo?: string
          titulo?: string | null
          updated_at?: string
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pautas_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pautas_evento_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "pautas_vendidas"
            referencedColumns: ["id"]
          },
        ]
      }
      pautas_vendidas: {
        Row: {
          created_at: string
          evento_id: string
          id: string
          parceiro_nome: string
          status: string
          tipo: string
          updated_at: string
          valor: number | null
        }
        Insert: {
          created_at?: string
          evento_id: string
          id?: string
          parceiro_nome: string
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number | null
        }
        Update: {
          created_at?: string
          evento_id?: string
          id?: string
          parceiro_nome?: string
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pautas_vendidas_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      presidencia_eventos: {
        Row: {
          created_at: string
          data_abertura_coordenadoria: string | null
          data_articulacao_local: string | null
          data_evento: string
          data_idv_inicio_brainstorm: string | null
          data_idv_inicio_terceirizada: string | null
          data_marco_zero: string | null
          data_pesquisa_aviso_previo: string | null
          data_pesquisa_lancamento: string | null
          data_pesquisa_limite_coleta: string | null
          data_pf_aprovacao_ca: string | null
          data_pf_inicio_elaboracao: string | null
          dia_status_sebrae: string
          id: string
          nome_evento: string
          periodicidade: string
          prazo_abertura_coordenadoria: number | null
          prazo_articulacao_local: number | null
          prazo_aviso_previo: number
          prazo_coleta_pesquisa: number
          prazo_idv_brainstorm: number | null
          prazo_idv_terceirizada: number | null
          prazo_pesquisa_conselheiros: number
          prazo_pf_aprovacao_ca: number | null
          prazo_pf_elaboracao: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_abertura_coordenadoria?: string | null
          data_articulacao_local?: string | null
          data_evento: string
          data_idv_inicio_brainstorm?: string | null
          data_idv_inicio_terceirizada?: string | null
          data_marco_zero?: string | null
          data_pesquisa_aviso_previo?: string | null
          data_pesquisa_lancamento?: string | null
          data_pesquisa_limite_coleta?: string | null
          data_pf_aprovacao_ca?: string | null
          data_pf_inicio_elaboracao?: string | null
          dia_status_sebrae?: string
          id?: string
          nome_evento: string
          periodicidade?: string
          prazo_abertura_coordenadoria?: number | null
          prazo_articulacao_local?: number | null
          prazo_aviso_previo?: number
          prazo_coleta_pesquisa?: number
          prazo_idv_brainstorm?: number | null
          prazo_idv_terceirizada?: number | null
          prazo_pesquisa_conselheiros?: number
          prazo_pf_aprovacao_ca?: number | null
          prazo_pf_elaboracao?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_abertura_coordenadoria?: string | null
          data_articulacao_local?: string | null
          data_evento?: string
          data_idv_inicio_brainstorm?: string | null
          data_idv_inicio_terceirizada?: string | null
          data_marco_zero?: string | null
          data_pesquisa_aviso_previo?: string | null
          data_pesquisa_lancamento?: string | null
          data_pesquisa_limite_coleta?: string | null
          data_pf_aprovacao_ca?: string | null
          data_pf_inicio_elaboracao?: string | null
          dia_status_sebrae?: string
          id?: string
          nome_evento?: string
          periodicidade?: string
          prazo_abertura_coordenadoria?: number | null
          prazo_articulacao_local?: number | null
          prazo_aviso_previo?: number
          prazo_coleta_pesquisa?: number
          prazo_idv_brainstorm?: number | null
          prazo_idv_terceirizada?: number | null
          prazo_pesquisa_conselheiros?: number
          prazo_pf_aprovacao_ca?: number | null
          prazo_pf_elaboracao?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          ej_id: string | null
          email: string | null
          id: string
          nome: string | null
          status: string
          tipo_solicitado: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          ej_id?: string | null
          email?: string | null
          id: string
          nome?: string | null
          status?: string
          tipo_solicitado?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          ej_id?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          status?: string
          tipo_solicitado?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_evento: {
        Row: {
          cor: string
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          cor?: string
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          cor?: string
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      tipos_transacao: {
        Row: {
          created_at: string
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          categoria: string
          created_at: string
          custo_embutido: number | null
          data: string
          descricao: string
          ej_id: string | null
          id: string
          is_recorrente: boolean
          juros_aplicados: number | null
          parceiro_nome: string | null
          recorrencia_meses: number | null
          status: string
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string
          custo_embutido?: number | null
          data: string
          descricao: string
          ej_id?: string | null
          id?: string
          is_recorrente?: boolean
          juros_aplicados?: number | null
          parceiro_nome?: string | null
          recorrencia_meses?: number | null
          status: string
          tipo: string
          updated_at?: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string
          custo_embutido?: number | null
          data?: string
          descricao?: string
          ej_id?: string | null
          id?: string
          is_recorrente?: boolean
          juros_aplicados?: number | null
          parceiro_nome?: string | null
          recorrencia_meses?: number | null
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitas_guardioes: {
        Row: {
          created_at: string
          data: string
          ej_id: string
          gasto: number | null
          horario: string | null
          id: string
          local: string | null
          motivo: string | null
          observacoes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: string
          ej_id: string
          gasto?: number | null
          horario?: string | null
          id?: string
          local?: string | null
          motivo?: string | null
          observacoes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: string
          ej_id?: string
          gasto?: number | null
          horario?: string | null
          id?: string
          local?: string | null
          motivo?: string | null
          observacoes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitas_guardioes_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_approve_user: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      admin_grant_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      admin_reject_user: { Args: { _user_id: string }; Returns: undefined }
      admin_revoke_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_approved: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "time_riojunior"
        | "professor_orientador"
        | "diretor_ej"
        | "membro_ej"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "time_riojunior",
        "professor_orientador",
        "diretor_ej",
        "membro_ej",
      ],
    },
  },
} as const
