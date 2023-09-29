import { LogbookPage } from '@/types/page';
import { Button } from '@/components/Button';
import { useOAuthProviderSignin, useUser } from '@logbook/auth';
import { EmptyLayout } from '@/layouts/EmptyLayout';
import { Input } from '@/components/Input';
import { Logo } from '@/components/Logo';
import { ifWeb, withSSRSession } from '@/utils/ssr';

const Page: LogbookPage = ({}) => {
  const { handleOAuthLogin, loading } = useOAuthProviderSignin();

  const user = useUser();

  if (user) {
    return <div>Logged in already as {user.name}</div>;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {user?.name}
      <div className="flex flex-col pb-[60px]">
        <Logo className="h-[28px] mb-[32px]" />
        <form className="flex flex-col space-y-[16px] w-[350px]" action="#">
          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />
          <Button variant="success" pressScale={0.99} type="submit">
            Sign in
          </Button>
          <div className="flex items-center space-x-[16px] py-[10px]">
            <hr className="border-black/10 flex-1" />
            <div className="font-semibold text-xs text-black/10">or</div>
            <hr className="border-black/10 flex-1" />
          </div>
          <Button
            variant="gray"
            loading={loading}
            pressScale={0.99}
            onClick={() => {
              handleOAuthLogin('google').catch(console.error);
            }}
            type="button"
          >
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
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
