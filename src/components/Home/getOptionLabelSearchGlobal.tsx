import { GlobalSearchProp } from '@/share/InterfaceTypesGlobalSearch';
import { formatType } from '../../utils/functionFormat/formatType';
import { formatCount } from '../../utils/functionFormat/formatCount';

export const getOptionLabelSearchGlobal = ({
  type,
  results_count: count,
}: GlobalSearchProp) => {
  const typeText = formatType(type);
  const countText = formatCount(count);
  return (
    <div>
      <span className="search-count">{countText}</span> {typeText}
    </div>
  );
};
