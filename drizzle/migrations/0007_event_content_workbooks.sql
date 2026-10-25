CREATE TABLE public.grades_livres (
 evento_id uuid PRIMARY KEY REFERENCES public.eventos(id) ON DELETE CASCADE,
 paginas jsonb NOT NULL DEFAULT '[]'::jsonb,
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT grades_livres_paginas_array CHECK (jsonb_typeof(paginas) = 'array')
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grades_livres TO authenticated;
GRANT ALL ON public.grades_livres TO service_role;
ALTER TABLE public.grades_livres ENABLE ROW LEVEL SECURITY;
CREATE POLICY grades_livres_read ON public.grades_livres FOR SELECT TO authenticated USING (public.is_approved(auth.uid()));
CREATE POLICY grades_livres_insert ON public.grades_livres FOR INSERT TO authenticated WITH CHECK (public.is_approved(auth.uid()) AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior')));
CREATE POLICY grades_livres_update ON public.grades_livres FOR UPDATE TO authenticated USING (public.is_approved(auth.uid()) AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior'))) WITH CHECK (public.is_approved(auth.uid()) AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior')));
CREATE POLICY grades_livres_delete ON public.grades_livres FOR DELETE TO authenticated USING (public.is_approved(auth.uid()) AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior')));
CREATE TRIGGER grades_livres_updated BEFORE UPDATE ON public.grades_livres FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();