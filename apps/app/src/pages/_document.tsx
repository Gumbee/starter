import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <div data-notifications className="relative z-[104] pointer-events-auto" />
      </body>
    </Html>
  );
}
