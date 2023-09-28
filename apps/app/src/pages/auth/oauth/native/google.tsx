import { Inter } from 'next/font/google';
import { LogbookPage } from '@/types/page';
import { OAuthNativeLayout } from '@/layouts/OAuthNativeLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEffect, useRef } from 'react';

const inter = Inter({ subsets: ['latin'] });

const redirect = () => {
  window.location.href = `logbook://oauth/google${window.location.search}`;
};

const Page: LogbookPage = ({}) => {
  const redirected = useRef(false);

  useEffect(() => {
    if (!redirected.current) {
      redirected.current = true;

      redirect();
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="flex items-center space-x-[12px]">
        <LoadingSpinner className="h-[16px]" />
        <div className="font-bold">Signing you in</div>
      </div>
    </div>
  );
};

Page.layout = OAuthNativeLayout;

export default Page;
