import { DefaultLayout } from '@/layouts/DefaultLayout';
import '@/styles/globals.css';
import { LogbookPage } from '@/types/page';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@forge/auth';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const Layout = (Component as LogbookPage).layout ?? DefaultLayout;

  return (
    <AuthProvider>
      <Layout className={inter.className}>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
