import type { TreeSelectProps } from 'antd';

export interface LocationNode {
  id: number;
  name: string;
  value: string | number;
  location_type?: {
    name: string;
  };
  children?: LocationNode[];
}


type TreeDataNode = NonNullable<TreeSelectProps<any>['treeData']>[number];

export function convertToTreeSelectFormat(data: LocationNode[]): TreeDataNode[] {
  const convertNode = (node: LocationNode): TreeDataNode => {
    const isPlace = node.location_type?.name === 'Place';

    const treeNode: TreeDataNode = {
      title: node.name,
      value: node.value,
      key: node.id,
      selectable: isPlace,
    };

    if (node.children?.length) {
      treeNode.children = node.children.map(convertNode);
    }

    return treeNode;
  };

  return data.map(convertNode);
}
