import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import '../styles/global.scss';
import { AppProps } from 'next/app';

import { Footer, Header } from '../components';

export default function App({ Component, pageProps }: AppProps) {
  const [authed, setAuthed] = useState(false);

  const authCheck = async (): Promise<void> => {
    const isAuthenticated = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/check`
    )
      .then((res) => res.status === 204)
      .catch(() => false);

    setAuthed(true);
  };

  // Fire an auth check on load
  useEffect(() => {
    authCheck();
  });

  return (
    <>
      <Head>
        <title>Paperframe</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /> */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,200;0,400;0,700;1,200;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header authed={authed} />
      <Component {...pageProps} authed={authed} />
      <Footer />
    </>
  );
}
