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
      </Head>
      <title>GitLab Confetti 🎉</title>
      <body className="font-geist">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
