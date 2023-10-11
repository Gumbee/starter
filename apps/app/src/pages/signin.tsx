import { LogbookPage } from '@/types/page';
import { Button } from '@/components/Button';
import { Protected, useCredentialsSignIn, useLoading, useOAuthProviderSignin } from '@logbook/auth';
import { EmptyLayout } from '@/layouts/EmptyLayout';
import { Input } from '@/components/Input';
import { Logo } from '@/components/Logo';
import { ifWeb, withSSRSession } from '@/utils/ssr';
import { PAGES } from '@logbook/common/pages';
import { useState } from 'react';
import { ApiError } from '@logbook/common/types';
import { ERROR_CODES } from '@logbook/common/errors';
import Link from 'next/link';

const Page: LogbookPage = ({}) => {
  const loading = useLoading();
  const { handleOAuthSignin } = useOAuthProviderSignin();
  const { handleSignIn } = useCredentialsSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApiError | null>(null);

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError({
        code: ERROR_CODES.BAD_PAYLOAD,
        message: !email ? 'Email missing.' : 'Password missing.',
        status: 400,
      });
    } else {
      setError(null);
      handleSignIn(email, password).catch(setError);
    }
  };

  return (
    <Protected
      inverted
      redirect={PAGES.home()}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col pb-[60px]">
          <Logo className="h-[28px] mb-[32px]" />
          <div className="relative flex flex-col space-y-[16px] w-[350px]">
            <form className="flex flex-col space-y-[16px] w-full" onSubmit={handleSignin}>
              <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button variant="success" pressScale={0.99} type="submit" loading={loading === 'credentials'}>
                Sign in
              </Button>
              <div className="flex items-center space-x-[16px] py-[12px]">
                <hr className="border-black/10 flex-1" />
                <div className="font-semibold text-xs text-black/10">or</div>
                <hr className="border-black/10 flex-1" />
              </div>
            </form>
            <Button
              variant="gray"
              loading={loading === 'google'}
              pressScale={0.99}
              onClick={() => {
                handleOAuthSignin('google').catch((e) => {
                  setError({
                    code: ERROR_CODES.UNKNOWN_ERROR,
                    message: e?.message ?? 'An unknown error occured.',
                    status: 500,
                  });
                });
              }}
              type="button"
            >
              Sign in with Google
            </Button>
            <Button as={Link} href={PAGES.signup()} variant="gray" pressScale={0.99}>
              Create an account
            </Button>
            {error && (
              <div className="text-xs font-medium text-red-600 absolute w-full text-center -bottom-[32px] translate-y-full">
                {error.code === ERROR_CODES.ACCOUNT_NOT_FOUND && 'Account not found.'}
                {error.code === ERROR_CODES.INVALID_CREDENTIALS && 'Incorrect password.'}
                {error.code === ERROR_CODES.BAD_PAYLOAD && error.message}
                {error.code === ERROR_CODES.UNKNOWN_ERROR && <>An unknown error occured. Message: {error.message}</>}
              </div>
            )}
          </div>
        </div>
      </div>
    </Protected>
  );
};

Page.layout = EmptyLayout;

export const getServerSideProps = ifWeb(
  withSSRSession(async (ctx) => {
    if (ctx.req.user) {
      return {
        props: {},
        redirect: {
          destination: '/log/moma',
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  }),
);

export default Page;
