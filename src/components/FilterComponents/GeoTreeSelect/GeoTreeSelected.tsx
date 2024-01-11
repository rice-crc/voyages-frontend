import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AutoCompleteInitialState,
  Filter,
  GeoTreeSelectItem,
  GeoTreeSelectStateProps,
  RangeSliderState,
} from '@/share/InterfaceTypes';
import { AppDispatch, RootState } from '@/redux/store';
import { TreeSelect } from 'antd';
import '@/style/page.scss';
import {
  setIsChangeGeoTree,
} from '@/redux/getGeoTreeDataSlice';
import { convertDataToGeoTreeSelectFormat } from '@/utils/functions/convertDataToGeoTreeSelectFormat';
import { usePageRouter } from '@/hooks/usePageRouter';
import { TreeItemProps } from '@mui/lab';
import { useGeoTreeSelected } from '@/hooks/useGeoTreeSelected';
import { setFilterObject } from '@/redux/getFilterSlice';

const GeoTreeSelected: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [geoTreeValueList, setGeoTreeValueList] = useState<GeoTreeSelectItem[]>([]);

  const { styleName } = usePageRouter();
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { isChangeGeoTree } = useSelector((state: RootState) => state.getGeoTreeData);

  const { filtersObj } = useSelector((state: RootState) => state.getFilter);

  const filters: Filter[] = [];
  const filterByVarName = filtersObj && filtersObj.filter((filterItem: Filter) => filterItem.varName !== varName);
  if (!filtersObj && filterByVarName) {
    filters.push({
      varName: varName,
      searchTerm: selectedValue.map((item) => item),
      op: "in"
    });
  }
  const dataSend: GeoTreeSelectStateProps = {
    geotree_valuefields: [varName],
    filter: filtersObj ? filterByVarName : filters
  };

  const { data, isLoading, isError } = useGeoTreeSelected(dataSend, styleName);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const geoList: GeoTreeSelectItem[] = data.map((value: GeoTreeSelectItem) => value);
      setGeoTreeValueList((prevGeoList: GeoTreeSelectItem[]) => [...prevGeoList, ...geoList]);
    }

    return () => {
      setGeoTreeValueList([]);
    };
  }, [data, isLoading, isError]);

  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');
    if (!storedValue) return;
    const parsedValue = JSON.parse(storedValue);
    const filter: Filter[] = parsedValue.filter;
    const filterByVarName = filter?.length > 0 && filter.find((filterItem) => filterItem.varName === varName);
    if (!filterByVarName) return;
    const geoList: string[] = filterByVarName.searchTerm as string[];
    const values = geoList.map<string>((item: string) => item);
    setSelectedValue(() => values)
    dispatch(setFilterObject(filter));
  }, [varName, styleName]);

  const handleTreeOnChange = (newValue: string[]) => {
    dispatch(setIsChangeGeoTree(!isChangeGeoTree));
    setSelectedValue(newValue);
    const valueSelect: string[] = newValue.map((ele) => ele);
    const existingFilterObjectString = localStorage.getItem('filterObject');
    let existingFilterObject: any = {};

    if (existingFilterObjectString) {
      existingFilterObject = JSON.parse(existingFilterObjectString);
    }
    // Retrieve existing filters array
    const existingFilters: Filter[] = existingFilterObject.filter || [];
    const existingFilterIndex = existingFilters.findIndex(filter => filter.varName === varName);

    if (existingFilterIndex !== -1) {
      existingFilters[existingFilterIndex].searchTerm = [...valueSelect];
    } else {
      const newFilter: Filter = {
        varName: varName,
        searchTerm: valueSelect,
        op: 'in'
      };
      existingFilters.push(newFilter);
    }
    dispatch(setFilterObject(existingFilters));
    const filterObjectUpdate = {
      filter: existingFilters
    };

    const filterObjectString = JSON.stringify(filterObjectUpdate);
    localStorage.setItem('filterObject', filterObjectString);
  };

  const dataForTreeSelect = convertDataToGeoTreeSelectFormat(geoTreeValueList);

  const filterTreeNode = (inputValue: string, treeNode: TreeItemProps) => {
    return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <div ref={ref}>
      {dataForTreeSelect.length > 0 && (
        <TreeSelect
          showSearch
          style={{ width: 450 }}
          value={selectedValue}
          dropdownStyle={{ overflow: 'auto', zIndex: 1301 }}
          placeholder="Please select"
          allowClear
          multiple
          treeCheckable={true}
          onChange={handleTreeOnChange}
          treeDefaultExpandAll={false}
          treeDefaultExpandedKeys={['select-all']}
          treeData={dataForTreeSelect}
          maxTagCount={8}
          filterTreeNode={filterTreeNode}
          maxTagPlaceholder={(selectedValue) =>
            `+ ${selectedValue.length} locations ...`
          }
        />
      )}
    </div>
  );
};

export default GeoTreeSelected;
