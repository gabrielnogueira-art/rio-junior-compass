-- Fase 2: momento de palco nos eventos + certificados + assinaturas
ALTER TABLE public.eventos ADD COLUMN momento_palco boolean NOT NULL DEFAULT false;

CREATE TABLE public.certificados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ej_id uuid NOT NULL REFERENCES public.ejs(id) ON DELETE CASCADE,
  evento_id uuid NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
  indicador text NOT NULL DEFAULT 'Indicadores em dia',
  texto_certificado text,
  config_editor jsonb NOT NULL DEFAULT '{}',
  emitido_em timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ej_id, evento_id, indicador)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificados TO authenticated;
GRANT ALL ON public.certificados TO service_role;
ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Aprovados leem certificados" ON public.certificados FOR SELECT TO authenticated USING (public.is_approved(auth.uid()));
CREATE POLICY "Time gerencia certificados" ON public.certificados FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time edita certificados" ON public.certificados FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time exclui certificados" ON public.certificados FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));

CREATE TABLE public.assinaturas_certificado (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cargo text NOT NULL UNIQUE,
  nome text NOT NULL DEFAULT '',
  png_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assinaturas_certificado TO authenticated;
GRANT ALL ON public.assinaturas_certificado TO service_role;
ALTER TABLE public.assinaturas_certificado ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Aprovados leem assinaturas" ON public.assinaturas_certificado FOR SELECT TO authenticated USING (public.is_approved(auth.uid()));
CREATE POLICY "Time gerencia assinaturas" ON public.assinaturas_certificado FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time edita assinaturas" ON public.assinaturas_certificado FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time exclui assinaturas" ON public.assinaturas_certificado FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));

-- Fase 3: anuidades — parcelamento e suporte
ALTER TABLE public.anuidades ADD COLUMN parcela_numero integer;
ALTER TABLE public.anuidades ADD COLUMN total_parcelas integer;
ALTER TABLE public.anuidades ADD COLUMN suporte_anuidade boolean NOT NULL DEFAULT false;

-- Fase 4: visitas dos guardiões
CREATE TABLE public.visitas_guardioes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ej_id uuid NOT NULL REFERENCES public.ejs(id) ON DELETE CASCADE,
  data date NOT NULL,
  horario text,
  local text,
  motivo text,
  status text NOT NULL DEFAULT 'solicitada',
  gasto numeric,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visitas_guardioes TO authenticated;
GRANT ALL ON public.visitas_guardioes TO service_role;
ALTER TABLE public.visitas_guardioes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Aprovados leem visitas" ON public.visitas_guardioes FOR SELECT TO authenticated USING (public.is_approved(auth.uid()));
CREATE POLICY "EJs solicitam visitas" ON public.visitas_guardioes FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior')
  OR ej_id IN (SELECT ej_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "Time atualiza visitas" ON public.visitas_guardioes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time exclui visitas" ON public.visitas_guardioes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));

-- Fase 5: acessibilidade (caravanas) e abatimentos do PF
CREATE TABLE public.caravanas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL REFERENCES public.presidencia_eventos(id) ON DELETE CASCADE,
  ej_id uuid REFERENCES public.ejs(id) ON DELETE SET NULL,
  ies text,
  regiao text,
  num_pessoas integer NOT NULL DEFAULT 0,
  valor_medio_ingresso numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.caravanas TO authenticated;
GRANT ALL ON public.caravanas TO service_role;
ALTER TABLE public.caravanas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Aprovados leem caravanas" ON public.caravanas FOR SELECT TO authenticated USING (public.is_approved(auth.uid()));
CREATE POLICY "Time gerencia caravanas" ON public.caravanas FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time edita caravanas" ON public.caravanas FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time exclui caravanas" ON public.caravanas FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));

CREATE TABLE public.abatimentos_pf (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL REFERENCES public.presidencia_eventos(id) ON DELETE CASCADE,
  item text NOT NULL,
  parceiro_nome text,
  valor numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.abatimentos_pf TO authenticated;
GRANT ALL ON public.abatimentos_pf TO service_role;
ALTER TABLE public.abatimentos_pf ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Aprovados leem abatimentos" ON public.abatimentos_pf FOR SELECT TO authenticated USING (public.is_approved(auth.uid()));
CREATE POLICY "Time gerencia abatimentos" ON public.abatimentos_pf FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time edita abatimentos" ON public.abatimentos_pf FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time exclui abatimentos" ON public.abatimentos_pf FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));

-- Triggers de updated_at
CREATE TRIGGER update_certificados_updated_at BEFORE UPDATE ON public.certificados FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assinaturas_updated_at BEFORE UPDATE ON public.assinaturas_certificado FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_visitas_updated_at BEFORE UPDATE ON public.visitas_guardioes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_caravanas_updated_at BEFORE UPDATE ON public.caravanas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_abatimentos_pf_updated_at BEFORE UPDATE ON public.abatimentos_pf FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();