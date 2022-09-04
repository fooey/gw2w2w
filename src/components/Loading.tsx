import React from 'react';
import { MdRefresh } from 'react-icons/md';

interface ILoadingProps {
  title?: string;
}
export const Loading: React.FC<ILoadingProps> = ({ title }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(0,0,0,.2)]">
    <div className="flex flex-col items-center justify-center rounded-xl  bg-neutral-50 py-8 shadow-lg">
      <div>
        <MdRefresh className="h-64 w-64 animate-spin" />
      </div>
      <h1>{title ?? `Loading`}</h1>
    </div>
  </div>
);
