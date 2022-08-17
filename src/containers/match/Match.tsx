import { useQuery } from '@tanstack/react-query';

export const Match = () => {
  const { isLoading, error, data } = useQuery([`/v2/wvw/matches/1-1`]);

  if (isLoading) return <h1>{'Loading...'}</h1>;

  if (error) return <h1>{`An error has occurred: ${error}`}</h1>;

  return (
    <div className="mx-auto flex flex-col">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
