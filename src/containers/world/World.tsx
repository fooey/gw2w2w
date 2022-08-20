import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';
import { Layout } from '~/components/layout/Layout';
import { WorldIdLink } from '~/components/WorldName';
import { useWorldByName, useWorlds } from '~/queries/worlds';

export const World = () => {
  const params = useParams();
  const { worldName } = params;
  const { isLoading: isLoadingWorld, data: world } = useWorldByName(worldName);
  const { isLoading: isLoadingWorlds, data: worlds } = useWorlds();

  if (isLoadingWorld || isLoadingWorlds) return <Layout>loading</Layout>;
  if (!worldName) return <Navigate to="/" />;

  if (!world) return <Layout>not found</Layout>;
  if (!worlds) return <Layout>err</Layout>;

  return (
    <Layout>
      <div className="mx-auto flex flex-col">
        <WorldIdLink worldId={world.id} />
        <Match worldId={world.id} />
      </div>
    </Layout>
  );
};

interface IMatchProps {
  worldId: number;
}
const Match: React.FC<IMatchProps> = ({ worldId }) => {
  const { data, isLoading } = useQuery([`/v2/wvw/matches?world=${worldId}`]);

  return (
    <div>
      <h1>{worldId}</h1>
      <pre>{JSON.stringify({ data, isLoading }, null, 2)}</pre>
    </div>
  );
};
