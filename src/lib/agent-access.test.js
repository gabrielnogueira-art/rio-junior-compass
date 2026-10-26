import { expect, test } from 'bun:test';
import { requireApprovedProfile } from './agent-access';
import { oauthReturnPath } from './oauth-return-path';

test('somente usuários aprovados podem usar as ferramentas', () => {
  expect(() => requireApprovedProfile({ status: 'pendente' })).toThrow();
  expect(() => requireApprovedProfile(null)).toThrow();
  expect(() => requireApprovedProfile({ status: 'aprovado' })).not.toThrow();
});
test('retorno de login preserva o consentimento e rejeita destinos externos', () => {
  expect(oauthReturnPath('/.lovable/oauth/consent?authorization_id=abc#decision')).toBe('/.lovable/oauth/consent?authorization_id=abc#decision');
  for (const path of ['//evil.invalid', '/\\evil.invalid', 'https://evil.invalid', '/\ninvalid']) expect(oauthReturnPath(path)).toBe('/');
});