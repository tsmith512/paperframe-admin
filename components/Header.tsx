import style from './header.module.scss';

export const Header = (props) => {
  return (
    <header className="container">
    <h1>Paperframe</h1>
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
  </header>
  );
};
