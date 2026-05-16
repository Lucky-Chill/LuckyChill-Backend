/**
 * 사용자 — Supabase Auth + profiles (백엔드 /api/users/me 미사용)
 */
import { supabase } from '../libs/supabase/client';
import { getUserProfile } from '../libs/auth/session';

/**
 * @returns {Promise<{ success: boolean, data: { email, name, role } }>}
 */
export const getMe = async () => {
  const profile = await getUserProfile();
  if (!profile) {
    throw new Error('로그인이 필요합니다.');
  }
  return { success: true, data: profile };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  return { success: true, data: { message: '로그아웃 되었습니다.' } };
};
