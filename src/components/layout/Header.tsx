import { useIsFetching } from '@tanstack/react-query';
import classNames from 'classnames';
import { filter, map } from 'lodash';
import React, { useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { FaGlobeAmericas, FaGlobeEurope } from 'react-icons/fa';
import { MdChevronRight, MdHome } from 'react-icons/md';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useWorlds } from '~/queries/worlds';
import type { ApiLang, ApiRegions } from '~/types/api';
import { flags, langs, useLang } from '~/utils/langs';
import { Spinner } from '../Spinner';
import { WorldNameLink } from '../WorldName';

export const Header: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userLanguage = (searchParams.get('lang') ?? 'en') as ApiLang;

  if (!langs.includes(userLanguage)) {
    return <Navigate to={`?lang=${langs[0]}`} />;
  }

  return (
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
        <div className="flex flex-row items-center gap-2">
          <WorldsPicker region={'1'} />
          <WorldsPicker region={'2'} />
        </div>
        <NetworkIndicator />
      </div>
      <aside className="flex items-center gap-8 px-4">
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
      </aside>
    </header>
  );
};

const NetworkIndicator = () => {
  const isFetching = useIsFetching();

  return <Spinner isActive={!!isFetching} />;
};

interface IWorldsPickerProps {
  region: ApiRegions;
}
const WorldsPicker: React.FC<IWorldsPickerProps> = ({ region }) => {
  const lang = useLang();
  const [showList, setShowList] = useState(false);
  const worlds = useWorlds();
  const regionWorlds = filter(worlds.data, { region });
  const langWorlds = map(regionWorlds, lang);
  const sortedWorlds = langWorlds.sort((a, b) => a.localeCompare(b));

  return (
    <ClickAwayListener onClickAway={() => setShowList(false)}>
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex w-full justify-center gap-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
            id="menu-button"
            onClick={() => setShowList(!showList)}
          >
            <div className="flex flex-row items-center gap-2">
              {region === '1' ? (
                <>
                  <FaGlobeAmericas className="text-2xl" />
                  <span>NA</span>
                </>
              ) : null}
              {region === '2' ? (
                <>
                  <FaGlobeEurope className="text-2xl" />
                  <span>EU</span>
                </>
              ) : null}
              <MdChevronRight className="rotate-90 text-xl" />
            </div>
          </button>
        </div>
        <div
          className={classNames(
            `absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all focus:outline-none`,
            {
              'scale-y-0 opacity-0': !showList,
              'scale-y-100 opacity-100': showList,
            }
          )}
        >
          <ul className="my-1 max-h-72 overflow-scroll py-1">
            {sortedWorlds.map((worldName, ixWorld) => (
              <li key={worldName} className="block px-4 py-2 text-sm text-gray-700">
                <WorldNameLink worldName={worldName} onClick={() => setShowList(false)} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ClickAwayListener>
  );
};
