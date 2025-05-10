import React, { useMemo } from 'react';
import { TreeSelect } from 'antd';
import '@/style/page.scss';
import type { TreeSelectProps } from 'antd/es/tree-select';
import { MaterializedEntity, LinkedEntitySelectionChange } from '@dotproductdev/voyages-contribute';
import { convertToTreeSelectFormat, TreeSelectNode } from './convertToTreeSelectFormat';
import { GeoTreeSelectItem, ContribuitLocation } from '@/share/InterfaceTypes';

interface optionsProps {
  label: string;
  value: string | number;
  entity: MaterializedEntity;
}
interface TheeSelectedEntityProps {
  handleChange: (item: string | number | null) => void
  value: MaterializedEntity | null
  label: string
  lastChange: LinkedEntitySelectionChange | undefined
  options: optionsProps[]
  locationsList: ContribuitLocation[]

}

const TreeSelectedEntity: React.FC<TheeSelectedEntityProps> = ({
  handleChange,
  value,
  label,
  options,
  lastChange,
  locationsList
}) => {

  const filterTreeNode: TreeSelectProps['filterTreeNode'] = (inputValue: string, treeNode: any) => {
    const title = typeof treeNode.title === 'string' ? treeNode.title : '';
    return title.toLowerCase().includes(inputValue.toLowerCase());
  };

  const treeDataSelect = useMemo(() => {
    const base = convertToTreeSelectFormat(locationsList);
    const selectedId = value?.entityRef.id;

    const exists = base.some((node) => containsValue(node, selectedId!));

    if (!exists && selectedId != null) {
      base.push({
        title: value?.data?.Name ?? `Location ${selectedId}` as any,
        value: selectedId,
        key: selectedId,
      });
    }

    return base;
  }, [locationsList, value]);
  
  function containsValue(node: TreeSelectNode, val: number | string): boolean {
    if (node.value === val) return true;
    if (node.children) {
      return node.children.some((child) => containsValue(child, val));
    }
    return false;
  }

  return (
    <TreeSelect
      className={lastChange ? 'changedEntityProperty' : undefined}
      value={value?.entityRef.id}
      placeholder={`Please select ${label}`}
      style={{ width: 'calc(100% - 20px)' }}
      onChange={handleChange}
      showSearch
      allowClear
      dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: 9999 }}
      treeDefaultExpandAll={false}
      treeData={treeDataSelect}
      maxTagCount={8}
      filterTreeNode={filterTreeNode}
      maxTagPlaceholder={(omittedValues) => `+ ${omittedValues.length} locations ...`}
      />
  );
};

export default TreeSelectedEntity
