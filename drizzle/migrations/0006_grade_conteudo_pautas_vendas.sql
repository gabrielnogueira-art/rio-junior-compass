-- Grade de conteúdo dos eventos (Formação Empreendedora) + interface com VPNeg

-- Configuração da grade por evento: quantas pautas magnas e paralelas podem ser vendidas
CREATE TABLE public.grade_evento_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
  magnas_vendaveis integer NOT NULL DEFAULT 0,
  paralelas_vendaveis integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (evento_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grade_evento_config TO authenticated;
GRANT ALL ON public.grade_evento_config TO service_role;
ALTER TABLE public.grade_evento_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Aprovados leem config grade" ON public.grade_evento_config FOR SELECT TO authenticated USING (public.is_approved(auth.uid()));
CREATE POLICY "Time gerencia config grade" ON public.grade_evento_config FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time edita config grade" ON public.grade_evento_config FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time exclui config grade" ON public.grade_evento_config FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));

-- Momentos/pautas da grade de conteúdo de cada evento
CREATE TABLE public.pautas_evento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'paralela',
  titulo text,
  tematica_macro text,
  dia date,
  horario text,
  ministrante_tipo text,
  ministrante_nome text,
  parceiro_nome text,
  csat numeric,
  venda_id uuid,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pautas_evento TO authenticated;
GRANT ALL ON public.pautas_evento TO service_role;
ALTER TABLE public.pautas_evento ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Aprovados leem pautas" ON public.pautas_evento FOR SELECT TO authenticated USING (public.is_approved(auth.uid()));
CREATE POLICY "Time gerencia pautas" ON public.pautas_evento FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time edita pautas" ON public.pautas_evento FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time exclui pautas" ON public.pautas_evento FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));

-- Vendas de pautas registradas pela VPNeg
CREATE TABLE public.pautas_vendidas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'paralela',
  parceiro_nome text NOT NULL,
  valor numeric,
  status text NOT NULL DEFAULT 'vendida',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pautas_vendidas TO authenticated;
GRANT ALL ON public.pautas_vendidas TO service_role;
ALTER TABLE public.pautas_vendidas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Aprovados leem vendas pautas" ON public.pautas_vendidas FOR SELECT TO authenticated USING (public.is_approved(auth.uid()));
CREATE POLICY "Time gerencia vendas pautas" ON public.pautas_vendidas FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time edita vendas pautas" ON public.pautas_vendidas FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));
CREATE POLICY "Time exclui vendas pautas" ON public.pautas_vendidas FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'));

-- Vínculo da pauta alocada com a venda (adicionado após pautas_vendidas existir)
ALTER TABLE public.pautas_evento
  ADD CONSTRAINT pautas_evento_venda_id_fkey FOREIGN KEY (venda_id) REFERENCES public.pautas_vendidas(id) ON DELETE SET NULL;

-- Triggers de updated_at
CREATE TRIGGER update_grade_evento_config_updated_at BEFORE UPDATE ON public.grade_evento_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pautas_evento_updated_at BEFORE UPDATE ON public.pautas_evento FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pautas_vendidas_updated_at BEFORE UPDATE ON public.pautas_vendidas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();