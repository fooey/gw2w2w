import classNames from 'classnames';
import React from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Footer } from '../../components/layout/Footer';
import type { ApiLang } from '../../types/api';
import { flags, langs } from '../../utils/langs';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userLanguage = (searchParams.get('lang') ?? 'en') as ApiLang;

  if (!langs.includes(userLanguage)) {
    return <Navigate to={`?lang=${langs[0]}`} />;
  }

  return (
    <div className="flex h-full flex-col gap-8 bg-slate-100">
      <header className="flex flex-none items-center justify-between border-b bg-white p-4 ">
        <h1 className="font-extralight">
          <Link to="/">gw2w2w</Link>
        </h1>
        <aside className="flex h-8 select-none items-center justify-between gap-2 px-4 text-2xl">
          {langs.map((lang) => (
            <a
              key={lang}
              className={classNames('block flex-none cursor-pointer text-2xl leading-none hover:drop-shadow-lg', {
                // 'font-bold': lang === userLanguage,
                'drop-shadow-md': lang === userLanguage,
                'text-3xl': lang === userLanguage,
              })}
              onClick={() => setSearchParams({ lang })}
              title={lang}
            >
              {flags[langs.indexOf(lang)]}
            </a>
          ))}
        </aside>
      </header>
      {children}
      <Footer />
    </div>
  );
};
