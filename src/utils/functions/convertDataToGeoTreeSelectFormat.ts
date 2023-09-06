import { GeoTreeSelectDataProps, TreeSelectItem } from "@/share/InterfaceTypes";

export const convertDataToGeoTreeSelectFormat = (
    data: GeoTreeSelectDataProps[],
    includeSelectAll: boolean = true
): TreeSelectItem[] => {
    const treeData: TreeSelectItem[] = [];

    if (includeSelectAll) {
        const selectAllItem: TreeSelectItem = {
            id: 0,
            key: 'select-all',
            title: 'Select All',
            value: 'select-all',
            children: [],
        };
        treeData.push(selectAllItem);
    }

    data.forEach((item) => {
        const treeItem: TreeSelectItem = {
            id: item.id,
            key: item.value.toString(),
            title: item.name,
            value: item.value.toString(),
            children: item.children
                ? convertDataToGeoTreeSelectFormat(item.children, false)
                : [],
        };

        if (includeSelectAll && treeData.length > 0) {
            const firstItem = treeData[0];
            if (firstItem && firstItem.children) {
                firstItem.children.push(treeItem);
            }
        } else {
            treeData.push(treeItem);
        }
    });

    return treeData;
};