import { Navigate, useParams } from 'react-router-dom';
import { Layout } from '~/components/layout/Layout';
import { Match } from '~/components/match/Match';
import { useWorldByName } from '~/queries/worlds';
import { useWorldMatchOverview } from '~/queries/wvw-match';
import { useLang } from '~/utils/langs';

export const World = () => {
  const lang = useLang();
  const params = useParams();
  const { worldName } = params;
  const { isLoading, data: world } = useWorldByName(worldName);
  const { isLoading: isLoadingMatchOverview, data: matchOverview } = useWorldMatchOverview(world?.id);

  if (!worldName) return <Navigate to="/" />;

  if (isLoading || isLoadingMatchOverview) return <Layout>Loading...</Layout>;
  if (!world) return <Layout>not found</Layout>;

  if (worldName !== world[lang])
    return (
      <Navigate
        to={{
          pathname: `/world/${encodeURIComponent(world[lang])}`,
          search: `?lang=${lang}`,
        }}
      />
    );

  return (
    <Layout>
      <Match world={world} matchId={matchOverview?.id} />
    </Layout>
  );
};
