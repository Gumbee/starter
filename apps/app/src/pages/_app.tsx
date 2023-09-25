import { DefaultLayout } from "@/layouts/DefaultLayout";
import "@/styles/globals.css";
import { LogbookPage } from "@/types/page";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const Layout = (Component as LogbookPage).layout ?? DefaultLayout;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
