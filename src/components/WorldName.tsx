import { Link, LinkProps } from 'react-router-dom';
import { useWorld, useWorldByName } from '~/queries/worlds';
import { useLang } from '~/utils/langs';

interface IWorldNameProps extends Partial<LinkProps> {
  worldId?: number;
}
export const WorldIdLink: React.FC<IWorldNameProps> = ({ worldId, ...attrs }) => {
  const lang = useLang();
  const worldQuery = useWorld(worldId);

  if (worldQuery.isLoading) return <span>{'Loading...'}</span>;
  if (!worldQuery.data) return <span>{`World not found: ${worldId}`}</span>;

  return (
    <Link
      {...attrs}
      className="hover:underline"
      to={{
        pathname: `/world/${encodeURIComponent(worldQuery.data[lang])}`,
        search: `?lang=${lang}`,
      }}
    >
      {worldQuery.data[lang]}
    </Link>
  );
};

interface IWorldNameProps extends Partial<LinkProps> {
  worldName?: string;
}
export const WorldNameLink: React.FC<IWorldNameProps> = ({ worldName, ...attrs }) => {
  const worldQuery = useWorldByName(worldName);

  return <WorldIdLink {...attrs} worldId={worldQuery?.data?.id} />;
};
