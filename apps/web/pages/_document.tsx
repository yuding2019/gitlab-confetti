import type { Metadata } from 'next';
import { Html, Head, Main, NextScript } from 'next/document';

export const metadata: Metadata = {
  title: 'GitLab Confetti',
};

export default function RootLayout() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="./gitlab.png" />
        <meta name="google-site-verification" content="HRWXPoUq-hDGzLwQlK8QNFBIAWM9E7OluBbNQPopMjQ" />
        <meta name="msvalidate.01" content="7B564FE7DF8FFBF367DD9F508778FAB0" />
      </Head>
      <title>GitLab Confetti 🎉</title>
      <body className="font-geist">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
