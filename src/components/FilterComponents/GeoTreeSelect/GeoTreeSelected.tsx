/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

import { TreeSelect } from 'antd';
import type { TreeSelectProps } from 'antd/es/tree-select';
import { useDispatch, useSelector } from 'react-redux';

import { fetchEnslavedGeoTreeSelect } from '@/fetch/geoFetch/fetchEnslavedGeoTreeSelect';
import { fetchEnslavedLanguageTreeSelect } from '@/fetch/geoFetch/fetchEnslavedLanguageTreeSelect';
import { fetchEnslaversGeoTreeSelect } from '@/fetch/geoFetch/fetchEnslaversGeoTreeSelect';
import { fetcVoyagesGeoTreeSelectLists } from '@/fetch/geoFetch/fetchVoyagesGeoTreeSelect';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setFilterObject } from '@/redux/getFilterSlice';
import { setIsChangeGeoTree } from '@/redux/getGeoTreeDataSlice';
import { setIsViewButtonViewAllResetAll } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch, RootState } from '@/redux/store';
import {
  Filter,
  GeoTreeSelectItem,
  GeoTreeSelectStateProps,
  FilterObjectsState,
  TYPES,
  TYPESOFDATASET,
  TYPESOFDATASETPEOPLE,
  TYPESOFDATASETENSLAVERS,
} from '@/share/InterfaceTypes';
import '@/style/page.scss';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { convertDataToGeoTreeSelectFormat } from '@/utils/functions/convertDataToGeoTreeSelectFormat';
import { convertDataToLanguagesTreeSelectFormat } from '@/utils/functions/convertDataToLanguagesTreeSelectFormat';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { getGeoValuesCheck } from '@/utils/functions/getGeoValuesCheck';

interface GeoTreeSelectedProps {
  type: string;
}
const GeoTreeSelected: React.FC<GeoTreeSelectedProps> = ({ type }) => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [geoTreeValueList, setGeoTreeValueList] = useState<GeoTreeSelectItem[]>(
    [],
  );
  const { isChangeGeoTree } = useSelector(
    (state: RootState) => state.getGeoTreeData,
  );
  const [dataForTreeSelect, setDataForTreeSelect] = useState<any[]>([]);
  const { styleName } = usePageRouter();
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  const { styleName: styleNameRoute } = usePageRouter();
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { labelVarName } = useSelector(
    (state: RootState) => state.getShowFilterObject,
  );
  const filters = filtersDataSend(filtersObj, styleNameRoute!);

  const newFilters = useMemo(() => {
    return filters === undefined
      ? undefined
      : filters!.map((filter) => {
        const { ...filteredFilter } = filter;
        return filteredFilter;
      });
  }, [filters]);

  const dataSend: GeoTreeSelectStateProps = useMemo(()=>{
    return {
      geotree_valuefields: [varName],
      filter: newFilters || [],
    };
  },[varName, newFilters])

  const fetchDataList = useCallback(async (type: string) => {
    try {
      let response;
      if (type === TYPES.GeoTreeSelect) {
        if (checkPagesRouteForVoyages(styleName!)) {
          response = await fetcVoyagesGeoTreeSelectLists(dataSend);
        } else if (checkPagesRouteForEnslaved(styleName!)) {
          response = await fetchEnslavedGeoTreeSelect(dataSend);
        } else if (checkPagesRouteForEnslavers(styleName!)) {
          response = await fetchEnslaversGeoTreeSelect(dataSend);
        }
      } else if (type === TYPES.LanguageTreeSelect) {
        response = await fetchEnslavedLanguageTreeSelect(dataSend);
      }

      if (response) {
        const geoList: GeoTreeSelectItem[] = response.map(
          (value: GeoTreeSelectItem) => value,
        );
        setGeoTreeValueList(geoList);
      }
    } catch (error) {
      console.error(`Error fetching data for tree select: ${error}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchDataList(type);
  }, [fetchDataList, type]);

  useEffect(() => {
    if (type === TYPES.GeoTreeSelect) {
      setDataForTreeSelect(convertDataToGeoTreeSelectFormat(geoTreeValueList));
    } else if (type === TYPES.LanguageTreeSelect) {
      setDataForTreeSelect(
        convertDataToLanguagesTreeSelectFormat(geoTreeValueList),
      );
    }
  }, [type, geoTreeValueList]);

  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');

    if (!storedValue) return;
    const parsedValue = JSON.parse(storedValue);
    const filter: Filter[] = parsedValue.filter;
    const filterByVarName =
      filter?.length > 0 &&
      filter.find((filterItem) => filterItem.varName === varName);
    if (!filterByVarName) return;
    const geoTreeListValue = getGeoValuesCheck([], geoTreeValueList);
    const geoList: string[] = filterByVarName.searchTerm as string[];
    const filteredSelect = geoTreeListValue.filter((item: string) =>
      geoList.includes(item),
    );
    const values = filteredSelect.map<string>((item: string) => item);
    setSelectedValue(() => values);
    dispatch(setFilterObject(filter));
  }, [dispatch, varName, styleName, geoTreeValueList]);

  const findSelectedItems = (
    data: GeoTreeSelectItem[],
    value: string | number,
  ): GeoTreeSelectItem[] => {
    const selectedItems: GeoTreeSelectItem[] = [];
    const searchItems = (items: GeoTreeSelectItem[]) => {
      for (const item of items) {
        if (item.value === value) {
          selectedItems.push(item);
        } else if (item.children && item.children.length > 0) {
          searchItems(item.children as GeoTreeSelectItem[]);
        }
      }
    };
    searchItems(data);
    return selectedItems;
  };

  const handleTreeOnChange = (newValue: string[]) => {
    if (!newValue) {
      return;
    }
    const valueSelect: string[] = newValue.map((ele) => ele);
    dispatch(setIsChangeGeoTree(!isChangeGeoTree));
    setSelectedValue(newValue);
    const selectedTitles: string[] = [];
    const selectedItemTitles: any[] = [];
    valueSelect.forEach((value) => {
      const selectedItem = findSelectedItems(
        dataForTreeSelect || [],
        value as string,
      );
      selectedItemTitles.push(selectedItem);
    });
    const combinedArray = ([] as GeoTreeSelectItem[]).concat(
      ...selectedItemTitles,
    );

    combinedArray.forEach((items) => {
      for (const item in items) {
        if (item === 'title') {
          selectedTitles.push(items[item] as string);
        }
      }
    });
    const existingFilterObjectString = localStorage.getItem('filterObject');
    let existingFilters: Filter[] = [];

    if (existingFilterObjectString) {
      existingFilters = JSON.parse(existingFilterObjectString).filter || [];
    }

    const existingFilterIndex = existingFilters.findIndex(
      (filter) => filter.varName === varName,
    );
    // Type guard to check if autuLabels is an array before accessing its length property
    if (Array.isArray(valueSelect) && valueSelect.length > 0) {
      if (existingFilterIndex !== -1) {
        existingFilters[existingFilterIndex].searchTerm = [...valueSelect];
        existingFilters[existingFilterIndex].title = [...selectedTitles];
      } else {
        existingFilters.push({
          varName: varName,
          searchTerm: valueSelect,
          op: 'in',
          label: labelVarName,
          title: selectedTitles,
        });
      }
    } else if (
      existingFilterIndex !== -1 &&
      Array.isArray(existingFilters[existingFilterIndex].searchTerm)
    ) {
      existingFilters[existingFilterIndex].searchTerm = [];
    }

    const filteredFilters = existingFilters.filter((filter) => {
      // Only filter out the current varName if its searchTerm is empty
      if (filter.varName === varName) {
        return Array.isArray(filter.searchTerm) && filter.searchTerm.length > 0;
      }
      // Keep all other filters, regardless of their searchTerm type
      return true;
    });

    dispatch(setFilterObject(filteredFilters));

    const filterObjectUpdate = {
      filter: filteredFilters,
    };
    const filterObjectString = JSON.stringify(filterObjectUpdate);
    localStorage.setItem('filterObject', filterObjectString);
    if (
      (styleNameRoute === TYPESOFDATASET.allVoyages ||
        styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved ||
        styleNameRoute === TYPESOFDATASETENSLAVERS.transAtlanticTrades ||
        styleNameRoute === TYPESOFDATASETENSLAVERS.intraAmericanTrades ||
        styleNameRoute === TYPESOFDATASETENSLAVERS.enslaver) &&
      filteredFilters.length > 0
    ) {
      dispatch(setIsViewButtonViewAllResetAll(true));
    } else if (filteredFilters.length > 1) {
      dispatch(setIsViewButtonViewAllResetAll(true));
    }
  };

  const filterTreeNode: TreeSelectProps['filterTreeNode'] = (
    inputValue,
    treeNode,
  ) => {
    const title = typeof treeNode.title === 'string' ? treeNode.title : '';
    return title.toLowerCase().includes(inputValue.toLowerCase());
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const selector = ref.current?.querySelector(
      '.ant-select-selector',
    ) as HTMLElement;
    if (selector) {
      selector.click();
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleContainerClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleContainerClick(e as any);
        }
      }}
    >
      {dataForTreeSelect && dataForTreeSelect.length > 0 && (
        <TreeSelect
          loading
          showSearch
          style={{ width: 450 }}
          styles={{
            popup: {
              root: {
                maxHeight: 400,
                overflow: 'auto',
                zIndex: 9999,
              },
            },
          }}
          value={selectedValue}
          placeholder="Please select"
          allowClear
          multiple
          treeCheckable
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
