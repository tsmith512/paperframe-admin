import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import '../styles/global.scss';
import { AppProps } from 'next/app';



export default function App({ Component, pageProps }: AppProps) {
  const [authed, setAuthed] = useState(false);

  const authCheck = async (): Promise<void> => {
    const isAuthenticated = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/check`
    )
      .then((res) => res.status === 204)
      .catch(() => false);
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
      <header className="container">
        <h1>Paperframe</h1>
        {authed ? (
          <a
            href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/logout`}
            className="contrast outline"
            role="button"
          >
            Logout
          </a>
        ) : (
          <a
            href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/login`}
            role="button"
          >
            Login
          </a>
        )}
      </header>
      <Component {...pageProps} authed={authed} />
      <footer className="container">
        &copy; Taylor Smith
      </footer>
    </>
  );
}
