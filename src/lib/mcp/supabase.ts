import { createClient } from '@supabase/supabase-js';
import type { ToolContext } from '@lovable.dev/mcp-js';
import { requireApprovedProfile } from '../agent-access';

type RuntimeGlobals = typeof globalThis & {
  Deno?: { env?: { get?: (name: string) => string | undefined } };
  process?: { env?: Record<string, string | undefined> };
};
function runtimeEnv(name: string) {
  const runtime = globalThis as RuntimeGlobals;
  return runtime.Deno?.env?.get?.(name) ?? runtime.process?.env?.[name];
}
function configuredEnv(names: readonly string[]) {
  for (const name of names) {
    const value = runtimeEnv(name)?.trim();
    if (value) return value;
  }
}
function supabaseProjectUrl() {
  const value = configuredEnv(['SUPABASE_URL', 'VITE_SUPABASE_URL']);
  if (!value) throw new Error('Database URL is required');
  return value;
}
function supabasePublishableKey() {
  const direct = configuredEnv(['SUPABASE_PUBLISHABLE_KEY', 'VITE_SUPABASE_PUBLISHABLE_KEY']);
  if (direct) return direct;
  try {
    const parsed: unknown = JSON.parse(runtimeEnv('SUPABASE_PUBLISHABLE_KEYS') ?? '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const keys = parsed as Record<string, unknown>;
      const key = [keys.default, ...Object.values(keys)].find((value): value is string => typeof value === 'string' && value.trim().startsWith('sb_publishable_'));
      if (key) return key.trim();
    }
  } catch { /* Legacy fallback. */ }
  const legacy = configuredEnv(['SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY']);
  if (!legacy) throw new Error('Database publishable key is required');
  return legacy;
}
export async function supabaseForUser(ctx: ToolContext) {
  const token = ctx.getToken();
  const userId = ctx.getUserId();
  if (!ctx.isAuthenticated() || !token || !userId) throw new Error('Autenticação necessária.');
  const client = createClient(supabaseProjectUrl(), supabasePublishableKey(), {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.from('profiles').select('status').eq('id', userId).maybeSingle();
  if (error) throw new Error('Não foi possível verificar sua aprovação.');
  requireApprovedProfile(data);
  return client;
}