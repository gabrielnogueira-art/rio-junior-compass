export function requireApprovedProfile(profile: { status?: string } | null | undefined): void {
  if (profile?.status !== 'aprovado') throw new Error('Seu acesso precisa ser aprovado por um administrador.');
}