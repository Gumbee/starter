import { AnimatedLayout } from '@/layouts/AnimatedLayout';
import { LogbookPage } from '@/types/page';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@forge/auth';
import { useNextCssRemovalPrevention } from '@madeinhaus/nextjs-page-transition';
import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';
import { useResetLoadingOnRoute } from '@/hooks/useResetLoadingOnRoute';
import { useDocumentBody } from '@/hooks/useDocumentBody';
import { createPortal } from 'react-dom';

import '@/styles/globals.css';
import '@/styles/sonner.css';
import '@/styles/stepper.css';
import '@/styles/transition.css';
import { PageLoadingBar } from '@/features/page-loading-bar';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const Layout = (Component as LogbookPage).layout ?? AnimatedLayout;
  const body = useDocumentBody();

  useNextCssRemovalPrevention();
  useResetLoadingOnRoute();

  return (
    <AuthProvider>
      <PageLoadingBar />
      <Layout className={inter.className} {...(Component as LogbookPage).layoutProps}>
        <Component {...pageProps} />
      </Layout>
      {body &&
        createPortal(
          <Toaster
            data-artweave-menu
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  'flex items-center space-x-[8px] px-[16px] py-[12px] rounded-[16px] border-[1px] border-black/[0.04] text-sm toast--shadow',
                title: 'text-red-400',
                info: 'bg-white',
                error: 'bg-white text-[#EA4335]',
                description: 'text-red-400',
                actionButton: 'bg-zinc-400',
                cancelButton: 'bg-orange-400',
                closeButton: 'bg-lime-400',
              },
            }}
            position="bottom-center"
          />,
          body,
        )}
    </AuthProvider>
  );
}
