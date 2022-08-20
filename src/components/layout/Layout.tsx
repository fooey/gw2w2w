import classNames from 'classnames';
import { map } from 'lodash';
import React, { useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { MdChevronRight, MdHome } from 'react-icons/md';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Footer } from '~/components/layout/Footer';
import { useWorlds } from '~/queries/worlds';
import type { ApiLang } from '~/types/api';
import { flags, langs, useLang } from '~/utils/langs';
import { WorldNameLink } from '../WorldName';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userLanguage = (searchParams.get('lang') ?? 'en') as ApiLang;

  if (!langs.includes(userLanguage)) {
    return <Navigate to={`?lang=${langs[0]}`} />;
  }

  return (
    <div className="flex h-full flex-col gap-8">
      <header className="flex flex-none items-center justify-between border-b bg-white p-4 ">
        <div className="flex flex-row items-center gap-8">
          <h1 className="font-extralight">
            <Link
              to={{
                pathname: '/',
                search: `?lang=${userLanguage}`,
              }}
              className="flex flex-row items-center gap-4"
            >
              <MdHome className="text-4xl" />
            </Link>
          </h1>
        </div>
        <aside className="flex items-center gap-8">
          <div className="flex h-8 select-none items-center gap-2 text-2xl">
            {langs.map((lang) => (
              <a
                key={lang}
                className={classNames('block flex-none cursor-pointer text-2xl leading-none hover:drop-shadow-lg', {
                  'drop-shadow-md': lang === userLanguage,
                  'text-3xl': lang === userLanguage,
                })}
                onClick={() => setSearchParams({ lang })}
                title={lang}
              >
                {flags[langs.indexOf(lang)]}
              </a>
            ))}
          </div>
          <WorldsPicker />
        </aside>
      </header>
      {children}
      <Footer />
    </div>
  );
};

const WorldsPicker = () => {
  const lang = useLang();
  const [showList, setShowList] = useState(false);
  const worlds = useWorlds();
  const langWorlds = map(worlds.data, lang);
  const sortedWorlds = langWorlds.sort((a, b) => a.localeCompare(b));

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setShowList(!showList)}
        >
          <div>Worlds</div>
          <MdChevronRight className="rotate-90 text-xl" />
        </button>
      </div>
      {showList && (
        <ClickAwayListener onClickAway={() => setShowList(false)}>
          <div
            className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <ul className="my-1 max-h-72 overflow-scroll py-1">
              {sortedWorlds.map((worldName, ixWorld) => (
                <li key={worldName} className="block px-4 py-2 text-sm text-gray-700">
                  <WorldNameLink worldName={worldName} onClick={() => setShowList(false)} />
                </li>
              ))}
            </ul>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};
