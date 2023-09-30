import { LogbookPage } from '@/types/page';
import { Button } from '@/components/Button';
import { Protected, useCredentialsSignUp, useLoading } from '@logbook/auth';
import { EmptyLayout } from '@/layouts/EmptyLayout';
import { Input } from '@/components/Input';
import { Logo } from '@/components/Logo';
import { ifWeb, withSSRSession } from '@/utils/ssr';
import { useRouter } from 'next/router';
import { PAGES } from '@logbook/common/pages';
import { useState } from 'react';
import { ApiError } from '@logbook/common/types';
import { ERROR_CODES } from '@logbook/common/errors';

const Page: LogbookPage = ({}) => {
  const router = useRouter();
  const loading = useLoading();
  const { handleSignUp } = useCredentialsSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApiError | null>(null);

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError({
        code: ERROR_CODES.BAD_PAYLOAD,
        message: !email ? 'Email missing.' : 'Password missing.',
        status: 400,
      });
    } else {
      setError(null);
      handleSignUp(email, password).catch(setError);
    }
  };

  return (
    <Protected
      inverted
      fallbackAction={() => {
        router.push(PAGES.home());
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col pb-[60px]">
          <Logo className="h-[28px] mb-[32px]" />
          <form className="relative flex flex-col space-y-[16px] w-[350px]" onSubmit={handleClick}>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="success" pressScale={0.99} type="submit" loading={loading === 'credentials'}>
              Sign up
            </Button>
            {error && (
              <div className="text-xs font-medium text-red-600 absolute w-full text-center -bottom-[24px] translate-y-full">
                {error.code === ERROR_CODES.USER_EXISTS && 'User with the given email address exists already.'}
                {error.code === ERROR_CODES.BAD_PAYLOAD && error.message}
                {error.code === ERROR_CODES.UNKNOWN_ERROR && <>An unknown error occured. Message: {error.message}</>}
              </div>
            )}
          </form>
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
