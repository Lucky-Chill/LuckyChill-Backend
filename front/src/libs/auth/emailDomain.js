/** 허용 로그인 이메일 도메인 (가천대 Google 계정) */
export const ALLOWED_EMAIL_DOMAIN = (
  import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN || 'gachon.ac.kr'
).toLowerCase();

export const DOMAIN_REJECT_MESSAGE = `@${ALLOWED_EMAIL_DOMAIN} Google 계정만 로그인할 수 있습니다.`;

/**
 * @param {string | null | undefined} email
 */
export function isAllowedSchoolEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`);
}
