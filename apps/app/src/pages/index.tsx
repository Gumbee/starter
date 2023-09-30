import { LogbookPage } from '@/types/page';
import { Button } from '@/components/Button';
import { Protected, useLogout, useOAuthProviderSignin, useUser } from '@logbook/auth';
import { EmptyLayout } from '@/layouts/EmptyLayout';
import { Input } from '@/components/Input';
import { Logo } from '@/components/Logo';
import { ifWeb, withSSRSession } from '@/utils/ssr';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Centered } from '@/components/Centered';
import { useRouter } from 'next/router';
import { PAGES } from '@logbook/common/pages';

const Page: LogbookPage = ({}) => {
  const router = useRouter();

  const { logout, loading } = useLogout();

  return (
    <Protected
      fallbackAction={() => {
        router.push(PAGES.signin());
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col pb-[60px]">
          <Button
            variant="success"
            pressScale={0.99}
            onClick={() => {
              logout().catch();
            }}
            loading={loading === 'logout'}
          >
            Sign out
          </Button>
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
