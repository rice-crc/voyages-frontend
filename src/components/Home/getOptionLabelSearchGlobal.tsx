import { GlobalSearchProp } from '@/share/InterfaceTypesGlobalSearch';

export const getOptionLabelSearchGlobal = (option: GlobalSearchProp) => {
  const { type, results_count: count } = option;
  const formattedCount = count.toLocaleString();

  const countText =
    count > 1
      ? `${formattedCount} results`
      : count === 1
      ? '1 result'
      : 'no results';

  return (
    <div>
      They are {type} with <span className="search-count">{countText}</span>
    </div>
  );
};
