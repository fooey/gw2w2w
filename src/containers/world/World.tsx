import { Navigate, useParams } from 'react-router-dom';
import { Layout } from '~/components/layout/Layout';
import { useWorldByName, useWorlds, WorldDictItem } from '~/queries/worlds';
import { useWorldmatch } from '~/queries/wvw-match';

export const World = () => {
  const params = useParams();
  const { worldName } = params;
  const { isLoading: isLoadingWorld, data: world } = useWorldByName(worldName);
  const { isLoading: isLoadingMatch, data: match } = useWorldmatch(world?.id);

  if (isLoadingWorld || isLoadingMatch) return <Layout>loading</Layout>;
  if (!worldName) return <Navigate to="/" />;

  if (!world) return <Layout>not found</Layout>;

  return (
    <Layout>
      <div className="mx-auto flex flex-col">
        <Match match={match} world={world} />
      </div>
    </Layout>
  );
};

interface IMatchProps {
  world: WorldDictItem;
  match: any;
}
const Match: React.FC<IMatchProps> = ({ match, world }) => {
  const { isLoading: isLoadingWorlds, data: worlds } = useWorlds();

  return (
    <div>
      <pre>{JSON.stringify({ world }, null, 2)}</pre>
      <pre>{JSON.stringify({ match }, null, 2)}</pre>
    </div>
  );
};
