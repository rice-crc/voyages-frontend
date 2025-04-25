import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Filter,
  GeoTreeSelectItem,
  GeoTreeSelectStateProps,
  FilterObjectsState,
  TYPES,
  TYPESOFDATASET,
  TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';
import { AppDispatch, RootState } from '@/redux/store';
import { TreeSelect } from 'antd';
import '@/style/page.scss';
import { getGeoValuesCheck } from '@/utils/functions/getGeoValuesCheck';
import { setIsChangeGeoTree } from '@/redux/getGeoTreeDataSlice';
import { convertDataToGeoTreeSelectFormat } from '@/utils/functions/convertDataToGeoTreeSelectFormat';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setFilterObject } from '@/redux/getFilterSlice';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { convertDataToLanguagesTreeSelectFormat } from '@/utils/functions/convertDataToLanguagesTreeSelectFormat';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { fetcVoyagesGeoTreeSelectLists } from '@/fetch/geoFetch/fetchVoyagesGeoTreeSelect';
import { fetchEnslavedGeoTreeSelect } from '@/fetch/geoFetch/fetchEnslavedGeoTreeSelect';
import { fetchEnslaversGeoTreeSelect } from '@/fetch/geoFetch/fetchEnslaversGeoTreeSelect';
import { fetchEnslavedLanguageTreeSelect } from '@/fetch/geoFetch/fetchEnslavedLanguageTreeSelect';
import { setIsViewButtonViewAllResetAll } from '@/redux/getShowFilterObjectSlice';
import { allEnslavers } from '@/share/CONST_DATA';
import type { TreeSelectProps } from 'antd/es/tree-select';
import { MaterializedEntity } from '@/models/materialization';
import { LinkedEntitySelectionChange } from '@/models/changeSets';
import { LinkedEntityProperty } from '@/models/properties';
import { convertToTreeSelectFormat, LocationNode } from './convertToTreeSelectFormat';
import { MockTreeData } from './mockTreeData';

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
}

const TreeSelectedEntity: React.FC<TheeSelectedEntityProps> = ({ handleChange, value,label,options,lastChange}) => {
  
  const filterTreeNode: TreeSelectProps['filterTreeNode'] = (inputValue, treeNode) => {
    const title = typeof treeNode.title === 'string' ? treeNode.title : '';
    return title.toLowerCase().includes(inputValue.toLowerCase());
  };
  

const rawData: LocationNode[] = MockTreeData; // This is Mock data
const treeDataSelect = convertToTreeSelectFormat(rawData);


  return (
        <TreeSelect
        className={lastChange ? 'changedEntityProperty' : undefined}
        value={value?.entityRef.id}
        placeholder={`Please select ${label}`}
        style={{ width: 'calc(100% - 20px)' }}
          onChange={handleChange}
          loading
          showSearch
          dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: 9999 }}
          allowClear
          treeDefaultExpandAll={false}
        //   treeData={options}
        treeData={treeDataSelect}
          maxTagCount={8}
          filterTreeNode={filterTreeNode}
          maxTagPlaceholder={(selectedValue) =>
            `+ ${selectedValue.length} locations ...`
          }
        />
  );
};



export default TreeSelectedEntity;

