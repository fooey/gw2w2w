import { Navigate, useParams } from 'react-router-dom';
import { Match } from '~/components/match/Match';
import { useWorldByName, useWorldMatchOverview } from '~/queries';
import { useLang } from '~/utils/langs';

export const World = () => {
  const lang = useLang();
  const params = useParams();
  const { worldName } = params;
  const { isLoading, data: world } = useWorldByName(worldName);
  const { isLoading: isLoadingMatchOverview, data: matchOverview } = useWorldMatchOverview(world?.id);

  if (!worldName) return <Navigate to="/" />;

  if (isLoading || isLoadingMatchOverview) return <h1>Loading...</h1>;
  if (!world) return <h1>not found</h1>;

  if (worldName !== world[lang])
    return (
      <Navigate
        to={{
          pathname: `/world/${encodeURIComponent(world[lang])}`,
          search: `?lang=${lang}`,
        }}
      />
    );

  return <Match world={world} matchId={matchOverview?.id} />;
};

export default World;
