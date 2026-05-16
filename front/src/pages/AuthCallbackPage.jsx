import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOMAIN_REJECT_MESSAGE } from '../libs/auth/emailDomain';
import { getUserProfile, enforceAllowedEmailSession } from '../libs/auth/session';
import { supabase } from '../libs/supabase/client';

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('로그인 처리 중...');
  const handledRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error_description') ?? params.get('error');

    if (oauthError) {
      setMessage(decodeURIComponent(oauthError));
      const timer = setTimeout(() => navigate('/login', { replace: true }), 2500);
      return () => clearTimeout(timer);
    }

    const redirectAfterLogin = async () => {
      if (handledRef.current) return;

      const allowed = await enforceAllowedEmailSession();
      if (!allowed) {
        handledRef.current = true;
        setMessage(DOMAIN_REJECT_MESSAGE);
        setTimeout(
          () =>
            navigate('/login', {
              replace: true,
              state: { authError: DOMAIN_REJECT_MESSAGE },
            }),
          2500,
        );
        return;
      }

      handledRef.current = true;
      const profile = await getUserProfile();
      setMessage('로그인 성공! 이동 중...');
      navigate(profile?.role === 'ADMIN' ? '/admin' : '/home', { replace: true });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        redirectAfterLogin();
      }
    });

    const failTimer = setTimeout(async () => {
      if (handledRef.current) return;

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        redirectAfterLogin();
        return;
      }

      if (params.get('code')) {
        setMessage(
          '로그인 처리에 실패했습니다. 로그인·콜백 모두 http://localhost:5173 으로 접속했는지 확인해 주세요. (127.0.0.1 과 localhost 는 저장소가 달라 PKCE 오류가 납니다)',
        );
        setTimeout(() => navigate('/login', { replace: true }), 4000);
      } else {
        setMessage('로그인에 실패했습니다. 다시 시도해 주세요.');
        setTimeout(() => navigate('/login', { replace: true }), 1500);
      }
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(failTimer);
    };
  }, [navigate]);

  return (
    <main className='flex min-h-svh items-center justify-center bg-primary-white p-6'>
      <p className='text-sm text-[#364153]'>{message}</p>
    </main>
  );
}

export default AuthCallbackPage;
