import { useHits } from 'react-instantsearch-hooks-web';
import { ProductHit } from '../mobile-hit';
import MobileHit from '../mobile-hit';

type MobileHitsProps = {
  hitComponent: React.ComponentType<{ hit: ProductHit }>;
};

const MobileHits = ({ hitComponent: HitComponent }: MobileHitsProps) => {
  const { hits } = useHits<ProductHit>();

  return (
    <div className="flex flex-col w-full max-h-96 overflow-y-auto">
      {hits.map((hit) => (
        <HitComponent key={hit.id} hit={hit} />
      ))}
    </div>
  );
};

export default MobileHits;