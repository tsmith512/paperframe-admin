import React from 'react';
import Link from 'next/link';

import style from './header.module.scss';

export const Header = (props) => {
  return (
    <header className={`container ${style.header}`}>
      <h1>Paperframe</h1>
      <nav className={style.nav}>
        <Link href="/">
          <a>Carousel</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
        {props.authed ? (
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
      </nav>
    </header>
  );
};
