import { useLocation } from 'react-router-dom';
import { ALLOWED_EMAIL_DOMAIN } from '../libs/auth/emailDomain';
import LoginHeader from '../features/login/ui/LoginHeader';
import UserLoginButton from '../features/login/ui/UserLoginButton';

function LoginPage() {
  const location = useLocation();
  const authError = location.state?.authError;

  return (
    <main className='flex min-h-svh items-center justify-center bg-primary-white p-6'>
      <section
        className='flex w-full max-w-[448px] flex-col gap-10 rounded-lg bg-white px-8 pt-8 pb-8 shadow-[0_24px_38px_-12px_rgb(0_0_0_/_0.24)] max-[520px]:px-6'
        aria-labelledby='login-title'
      >
        <LoginHeader />
        <p className='-mt-6 text-center text-xs text-text-muted'>
          @{ALLOWED_EMAIL_DOMAIN} Google 계정만 로그인할 수 있습니다.
        </p>
        {authError ? (
          <p className='-mt-4 rounded-lg bg-mudang-red-tint px-3 py-2 text-center text-sm text-mudang-red'>
            {authError}
          </p>
        ) : null}
        <UserLoginButton />
      </section>
    </main>
  );
}

export default LoginPage;
