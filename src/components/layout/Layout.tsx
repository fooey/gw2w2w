import classNames from 'classnames';
import React, { useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { MdChevronRight } from 'react-icons/md';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Footer } from '../../components/layout/Footer';
import type { ApiLang } from '../../types/api';
import { flags, langs } from '../../utils/langs';
import { useWorlds } from '../../utils/queries';
import { WorldName } from '../WorldName';

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
            <Link to="/">gw2w2w.com</Link>
          </h1>
          <h2 className="font-extralight">
            <Link to="/">Matches Overview</Link>
          </h2>
          <Picker />
          {/* <WorldsPicker /> */}
        </div>
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

// const WorldsPicker = () => {
//   const worlds = useWorlds();
//   const sortedWorlds = sortBy(worlds.data ?? [], 'name');

//   return (
//     <h2>
//       <ul>
//         {sortedWorlds.map((world) => (
//           <li key={world.id}>
//             <WorldName worldId={world.id} />
//           </li>
//         ))}
//       </ul>
//     </h2>
//   );
// };

const Picker = () => {
  const [showList, setShowList] = useState(false);
  const worlds = useWorlds();
  const sortedWorlds = worlds.data ? worlds.data.sort((a, b) => a.name.localeCompare(b.name)) : [];

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
          <div>Select a World</div>
          <MdChevronRight className="rotate-90 text-xl" />
        </button>
      </div>
      {showList && (
        <ClickAwayListener onClickAway={() => setShowList(false)}>
          <div
            className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <ul className="my-1 max-h-72 overflow-scroll py-1">
              {sortedWorlds.map((world, ixWorld) => (
                <li key={`${world.id}`} className="block px-4 py-2 text-sm text-gray-700">
                  <WorldName worldId={world.id} />
                </li>
              ))}
            </ul>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};
