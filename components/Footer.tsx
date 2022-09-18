import style from './footer.module.scss';

export const Footer = () => {
  return (
    <footer className={`container ${style.footer}`}>
      &copy; {new Date().getFullYear()} an experiment by{' '}
      <a href="https://tsmith.com/?utm_source=paperframe&utm_medium=website&utm_campaign=paperframe">
        Taylor Smith
      </a>
      .
    </footer>
  );
};
