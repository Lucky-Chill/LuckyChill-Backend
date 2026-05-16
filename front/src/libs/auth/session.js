import { supabase } from '../supabase/client';
import { isAllowedSchoolEmail } from './emailDomain';

/**
 * 세션 사용자 이메일이 허용 도메인인지 확인하고, 아니면 로그아웃합니다.
 * @returns {Promise<boolean>}
 */
export async function enforceAllowedEmailSession() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  if (isAllowedSchoolEmail(user.email)) {
    return true;
  }

  await supabase.auth.signOut();
  return false;
}

export async function getAccessToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  const expiresAt = session.expires_at;
  const nowSec = Math.floor(Date.now() / 1000);

  if (expiresAt && expiresAt - nowSec < 120) {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (!refreshError && refreshed.session?.access_token) {
      return refreshed.session.access_token;
    }
  }

  return session.access_token;
}

/**
 * @returns {Promise<{ email: string, name: string|null, role: string }|null>}
 */
export async function getUserProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('email, name, role')
    .eq('id', user.id)
    .single();

  if (error) {
    return {
      email: user.email ?? '',
      name: null,
      role: 'USER',
    };
  }

  return data;
}
