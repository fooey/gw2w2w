import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Layout } from '~/components/layout/Layout';
import { WorldName } from '~/components/WorldName';
import { useWorlds } from '~/utils/queries';

export const World = () => {
  const params = useParams();
  const { worldName } = params;
  const { isLoading: isLoadingWorlds, data: worlds } = useWorlds();
  const world = worlds && worlds.find(({ name }) => name === worldName);
  console.log(`🚀 ~ file: World.tsx ~ line 10 ~ World ~ world`, world);

  const { isLoading, error, data } = useQuery([`/v2/wvw/matches?world=${world?.id}`], {
    enabled: world?.id !== undefined,
  });

  if (isLoading || isLoadingWorlds) return <h1>{'Loading...'}</h1>;
  if (error) return <h1>{`An error has occurred: ${error}`}</h1>;

  return (
    <Layout>
      <div className="mx-auto flex flex-col">
        <h1>
          <WorldName worldId={world?.id} />
        </h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </Layout>
  );
};
