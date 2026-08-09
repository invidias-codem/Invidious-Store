import { Html, Head, Main, NextScript } from 'next/document';

const SITE_NAME = 'Invidious';
const SITE_URL = 'https://invidious.shop';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Pirata+One&family=UnifrakturMaguntia&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://invidious.shop" />
        <meta property="og:site_name" content="Invidious" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <div className="fixed inset-0 -z-10 bg-metallic-wash" aria-hidden="true" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
