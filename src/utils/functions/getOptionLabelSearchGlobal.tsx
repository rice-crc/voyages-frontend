import { GlobalSearchProp } from '@/share/InterfaceTypesGlobalSearch';

import { formatCount } from './formatCount';
import { formatType } from './formatType';

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

export const shouldDisable = (option: GlobalSearchProp) => {
  const countText = formatCount(option.results_count);
  return countText === 'No';
};
