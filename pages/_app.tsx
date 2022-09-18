import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import '../styles/global.scss';
import { AppProps } from 'next/app';

import {
  Footer,
  Header
} from '../components';

export default function App({ Component, pageProps }: AppProps) {
  const [authed, setAuthed] = useState(false);

  const authCheck = async (): Promise<void> => {
    const isAuthenticated = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/check`
    )
      .then((res) => res.status === 204)
      .catch(() => false);

    setAuthed(isAuthenticated);
  };

  // Fire an auth check on load
  useEffect(() => {
    authCheck();
  });

  return (
    <>
      <Head>
        <title>Paperframe</title>
      </Head>
      <Header authed={authed} />
      <Component {...pageProps} authed={authed} />
      <Footer />
    </>
  );
}
