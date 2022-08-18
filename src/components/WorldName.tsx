import { Link } from 'react-router-dom';
import { useLang } from '../utils/langs';
import { useWorlds } from '../utils/queries';

interface IWorldNameProps {
  worldId?: number;
}
export const WorldName: React.FC<IWorldNameProps> = ({ worldId }) => {
  const lang = useLang();

  const { isLoading: isLoadingWorlds, error: worldsError, data: worldsData } = useWorlds(lang);
  if (isLoadingWorlds || !worldsData) return <h2>{'Loading...'}</h2>;
  if (worldsError) return <h2>{`An error has occurred: ${worldsError}`}</h2>;

  const world = worldsData.find((world) => world.id === worldId);
  if (!world) return <h2>{`World not found: ${worldId}`}</h2>;

  return (
    <h2 className="whitespace-nowrap">
      <Link
        className="hover:underline"
        to={{
          pathname: `/world/${world.name}`,
          search: `?lang=${lang}`,
        }}
      >
        {world.name}
      </Link>
    </h2>
  );
};
