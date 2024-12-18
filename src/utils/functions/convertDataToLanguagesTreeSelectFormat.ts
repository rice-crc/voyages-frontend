import {
  LanguagesTreeSelectItem,
  LanguagesTreeSelectItemList,
} from '@/share/InterfaceTypes';

export const convertDataToLanguagesTreeSelectFormat = (
  data: LanguagesTreeSelectItem[],
  includeSelectAll: boolean = true
): LanguagesTreeSelectItemList[] => {
  const treeData: LanguagesTreeSelectItemList[] = [];
  const uniqueValues = new Set<string>();

  if (includeSelectAll) {
    const selectAllItem: LanguagesTreeSelectItemList = {
      id: 0,
      value: 'select-all',
      title: 'Select All',
      children: [],
    };
    treeData.push(selectAllItem);
    uniqueValues.add('select-all');
  }

  data.forEach((item) => {
    const treeItem: LanguagesTreeSelectItemList = {
      id: item.id,
      value: item.name,
      title: item.name,
      children: item.children
        ? convertDataToLanguagesTreeSelectFormat(
            item.children as LanguagesTreeSelectItem[],
            false
          )
        : [],
    };

    if (!uniqueValues.has(item.name)) {
      if (includeSelectAll && treeData.length > 0) {
        const firstItem = treeData[0];
        if (firstItem && firstItem.children) {
          firstItem.children.push(treeItem);
        }
      } else {
        treeData.push(treeItem);
      }
      uniqueValues.add(item.name);
    }
  });

  return treeData;
};
