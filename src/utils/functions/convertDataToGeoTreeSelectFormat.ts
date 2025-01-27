import { GeoTreeSelectItem, TreeSelectItem } from '@/share/InterfaceTypes';

export const convertDataToGeoTreeSelectFormat = (
  data: GeoTreeSelectItem[],
  includeSelectAll: boolean = true
): TreeSelectItem[] => {
  const treeData: TreeSelectItem[] = [];
  const uniqueValues = new Set<string>();
  if (includeSelectAll) {
    const selectAllItem: TreeSelectItem = {
      id: 0,
      key: 'select-all',
      title: 'Select All',
      value: 'select-all',
      children: [],
      disabled: data.length === 0,
    };
    treeData.push(selectAllItem);
    uniqueValues.add('select-all');
  }

  data.forEach((item) => {
    const treeItem: TreeSelectItem = {
      id: item.id,
      key: item.value.toString(),
      title: item.name,
      value: item.value.toString(),
      children: item.children
        ? convertDataToGeoTreeSelectFormat(
            item.children as GeoTreeSelectItem[],
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
