import { useState } from 'react';
import googleLogo from '../../../assets/google_logo.svg';
import { ALLOWED_EMAIL_DOMAIN } from '../../../libs/auth/emailDomain';
import { supabase } from '../../../libs/supabase/client';

function UserLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      alert(
        'Supabase 설정이 없습니다.\nfront/.env 파일을 확인한 뒤, npm run dev 를 다시 실행해 주세요.',
      );
      return;
    }

    setLoading(true);

    try {
      // 기존 세션이 있으면 Google/Supabase 가 계정 선택 없이 바로 로그인될 수 있음
      await supabase.auth.signOut();

      // localhost 와 127.0.0.1 은 localStorage 가 달라 PKCE verifier 가 유실됨 → origin 고정 권장
      const appOrigin = import.meta.env.VITE_APP_ORIGIN || window.location.origin;
      const redirectTo = `${appOrigin}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: {
            hd: ALLOWED_EMAIL_DOMAIN,
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        alert(error.message || '구글 로그인에 실패했습니다.');
        return;
      }

      if (data?.url) {
        window.location.assign(data.url);
        return;
      }

      alert(
        'Google 로그인 주소를 받지 못했습니다.\nSupabase 대시보드에서 Google Provider가 켜져 있는지 확인해 주세요.',
      );
    } catch (err) {
      console.error(err);
      alert(err?.message || '구글 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className='flex h-[51px] w-full cursor-pointer items-center justify-center gap-7 rounded-lg border-2 border-[#d1d5dc] bg-white px-5 text-base leading-6 font-medium text-[#364153] transition-[border-color,box-shadow,transform] duration-150 ease-in-out hover:border-middle-blue hover:shadow-[0_8px_16px_-12px_rgb(0_0_0_/_0.3)] active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gachon-light-blue disabled:cursor-not-allowed disabled:opacity-60'
      type='button'
      onClick={handleLoginClick}
      disabled={loading}
    >
      <img className='block size-5 shrink-0' src={googleLogo} alt='' aria-hidden='true' />
      <span>{loading ? '연결 중...' : 'Google로 계속하기'}</span>
    </button>
  );
}

export default UserLoginButton;
