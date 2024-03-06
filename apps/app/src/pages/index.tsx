import { LogbookPage } from '@/types/page';
import { useLogout } from '@forge/auth';
import { ifWeb, withHasAuth } from '@/utils/ssr';
import Link from 'next/link';
import { PAGES } from '@forge/common/pages';

const Page: LogbookPage = ({}) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="w-full py-[20px] bg-blue-500 transition__fade">
        Landing Page <Link href={PAGES.signin()}>Login</Link>
      </div>
    </div>
  );
};

export const getServerSideProps = ifWeb(
  withHasAuth(async (ctx, hasAuth) => {
    if (hasAuth) {
      return {
        props: {},
        redirect: {
          destination: '/dashboard',
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
