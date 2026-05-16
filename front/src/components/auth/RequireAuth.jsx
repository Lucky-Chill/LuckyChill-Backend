import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { DOMAIN_REJECT_MESSAGE } from '../../libs/auth/emailDomain';
import { enforceAllowedEmailSession } from '../../libs/auth/session';
import { supabase } from '../../libs/supabase/client';

/**
 * 보호된 라우트 공통 가드 — Outlet 으로 자식 라우트 렌더 (페이지 이동 시 재마운트 방지)
 */
function RequireAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const applySession = async (session) => {
      if (cancelled) return;

      if (!session) {
        setAuthed(false);
        setLoading(false);
        return;
      }

      const allowed = await enforceAllowedEmailSession();
      if (cancelled) return;

      if (!allowed) {
        setAuthed(false);
        setLoading(false);
        navigate('/login', { replace: true, state: { authError: DOMAIN_REJECT_MESSAGE } });
        return;
      }

      setAuthed(true);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;

      if (event === 'SIGNED_OUT') {
        setAuthed(false);
        setLoading(false);
        return;
      }

      if (
        session &&
        (event === 'SIGNED_IN' ||
          event === 'INITIAL_SESSION' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'USER_UPDATED')
      ) {
        applySession(session);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <main className='flex min-h-svh items-center justify-center bg-primary-white'>
        <p className='text-sm text-[#364153]'>로그인 확인 중...</p>
      </main>
    );
  }

  if (!authed) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
