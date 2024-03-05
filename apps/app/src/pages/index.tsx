import { LogbookPage } from '@/types/page';
import { Button } from '@/components/Button';
import { Protected, useLogout } from '@forge/auth';
import { EmptyLayout } from '@/layouts/EmptyLayout';
import { ifWeb, withSSRSession } from '@/utils/ssr';

const Page: LogbookPage = ({}) => {
  const { logout, loading } = useLogout();

  return (
    <Protected>
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
