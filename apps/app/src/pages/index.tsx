import { Inter } from 'next/font/google';
import { LogbookPage } from '@/types/page';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { Button } from '@/components/Button';
import { useOAuthProviderSignin } from '@logbook/auth';

const inter = Inter({ subsets: ['latin'] });

const Page: LogbookPage = ({}) => {
  const { handleOAuthLogin } = useOAuthProviderSignin();

  return (
    <div>
      <Button
        variant="white"
        onClick={() => {
          handleOAuthLogin('google');
        }}
      >
        Sign in
      </Button>
    </div>
  );
};

Page.layout = DefaultLayout;

export default Page;
