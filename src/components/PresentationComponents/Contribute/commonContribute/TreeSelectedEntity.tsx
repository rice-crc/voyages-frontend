import React, { useMemo, useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import type { TreeSelectProps } from 'antd/es/tree-select';
import { MaterializedEntity, LinkedEntitySelectionChange } from '@dotproductdev/voyages-contribute';
import { convertToTreeSelectFormat, TreeSelectNode } from './convertToTreeSelectFormat';
import { ContribuitLocation } from '@/share/InterfaceTypes';
import '@/style/page.scss';

type SafeKey = string | number;

type ExtendedTreeSelectProps = TreeSelectProps<SafeKey, TreeSelectNode> & {
  treeDefaultExpandParent?: boolean;
};

interface optionsProps {
  label: string;
  value: string | number;
  entity: MaterializedEntity;
}

interface TheeSelectedEntityProps {
  handleChange: (item: string | number | null) => void;
  value: MaterializedEntity | null;
  label: string;
  lastChange: LinkedEntitySelectionChange | undefined;
  options: optionsProps[];
  locationsList: ContribuitLocation[];
}

const TreeSelectedEntity: React.FC<TheeSelectedEntityProps> = ({
  handleChange,
  value,
  label,
  options,
  lastChange,
  locationsList,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<SafeKey[]>([]);

  const containsValue = (node: TreeSelectNode, val: string | number): boolean => {
    if (node.value === val) return true;
    if (node.children) {
      return node.children.some((child) => containsValue(child, val));
    }
    return false;
  };

  const findPathToNode = (
    tree: TreeSelectNode[],
    target: string | number,
    path: SafeKey[] = []
  ): SafeKey[] | null => {
    for (const node of tree) {
      const currentPath = [...path, String(node.key)];
      if (node.value === target) return currentPath;
      if (node.children) {
        const childPath = findPathToNode(node.children, target, currentPath);
        if (childPath) return childPath;
      }
    }
    return null;
  };

  const treeDataSelect = useMemo(() => {
    const base = convertToTreeSelectFormat(locationsList);
    const selectedId = value?.entityRef.id;

    const exists = selectedId != null && base.some((node) => containsValue(node, String(selectedId)));

    if (!exists && selectedId != null) {
      base.push({
        title: typeof value?.data?.Name === 'string' ? value.data.Name : `Location ${selectedId}`,
        value: String(selectedId),
        key: String(selectedId),
      });
    }

    return base;
  }, [locationsList, value]);

  useEffect(() => {
    if (value?.entityRef.id) {
      const path = findPathToNode(treeDataSelect, String(value.entityRef.id));
      if (path) {
        setExpandedKeys(path);
      }
    } else {
      setExpandedKeys([]);
    }
  }, [value, treeDataSelect]);

  const handleSearch = (searchValue: string) => {
    if (searchValue) {
      const allKeys: SafeKey[] = [];
      const collectKeys = (nodes: TreeSelectNode[]) => {
        nodes.forEach((node) => {
          allKeys.push(String(node.key));
          if (node.children) collectKeys(node.children);
        });
      };
      collectKeys(treeDataSelect);
      setExpandedKeys(allKeys);
    }
  };
  
  const treeSelectProps: ExtendedTreeSelectProps = {
    className: lastChange ? 'changedEntityProperty' : undefined,
    value: value ? String(value.entityRef.id) : undefined,
    placeholder: `Please select ${label}`,
    style: { width: 'calc(100% - 20px)' },
    onChange: handleChange,
    showSearch: true,
    allowClear: true,
    dropdownStyle: { maxHeight: 400, overflow: 'auto', zIndex: 9999 },
    filterTreeNode: (inputValue, treeNode) => {
      const title = typeof treeNode.title === 'string' ? treeNode.title : '';
      return title.toLowerCase().includes(inputValue.toLowerCase());
    },
    onSearch: handleSearch,
    treeData: treeDataSelect,
    treeExpandedKeys: expandedKeys,
    onTreeExpand: (keys) => setExpandedKeys(keys as SafeKey[]),
    onDropdownVisibleChange: (open) => {
      if (open && value?.entityRef.id) {
        const path = findPathToNode(treeDataSelect, String(value.entityRef.id));
        if (path) setExpandedKeys(path);
      }
    },
    maxTagCount: 8,
    maxTagPlaceholder: (omittedValues) => `+ ${omittedValues.length} locations ...`,
  };
  
  return (
    <TreeSelect<string | number, TreeSelectNode> {...treeSelectProps} treeDefaultExpandAll/>
  );
};


export default TreeSelectedEntity;
