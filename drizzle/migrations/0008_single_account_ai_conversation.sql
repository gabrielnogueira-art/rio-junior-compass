CREATE TABLE public.ai_conversations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE, messages jsonb NOT NULL DEFAULT '[]'::jsonb, paused_reason text, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_conversations TO authenticated;
GRANT ALL ON public.ai_conversations TO service_role;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_conversation_owner ON public.ai_conversations FOR ALL TO authenticated USING (user_id = auth.uid() AND public.is_approved(auth.uid())) WITH CHECK (user_id = auth.uid() AND public.is_approved(auth.uid()));