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
import { TreeItemProps } from '@mui/lab';
import { setFilterObject } from '@/redux/getFilterSlice';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { convertDataToLanguagesTreeSelectFormat } from '@/utils/functions/convertDataToLanguagesTreeSelectFormat';
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { fetcVoyagesGeoTreeSelectLists } from '@/fetch/geoFetch/fetchVoyagesGeoTreeSelect';
import { fetchEnslavedGeoTreeSelect } from '@/fetch/geoFetch/fetchEnslavedGeoTreeSelect';
import { fetchEnslaversGeoTreeSelect } from '@/fetch/geoFetch/fetchEnslaversGeoTreeSelect';
import { fetchEnslavedLanguageTreeSelect } from '@/fetch/geoFetch/fetchEnslavedLanguageTreeSelect';
import { setIsViewButtonViewAllResetAll } from '@/redux/getShowFilterObjectSlice';
import { allEnslavers } from '@/share/CONST_DATA';
interface GeoTreeSelectedProps {
  type: string
}
const GeoTreeSelected: React.FC<GeoTreeSelectedProps> = ({ type }) => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [geoTreeValueList, setGeoTreeValueList] = useState<GeoTreeSelectItem[]>(
    []
  );
  const { styleName } = usePageRouter();
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState
  );
  const { styleName: styleNameRoute } = usePageRouter();
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { labelVarName } = useSelector(
    (state: RootState) => state.getShowFilterObject
  );
  const filters = filtersDataSend(filtersObj, styleNameRoute!)
  const newFilters = filters !== undefined && filters!.map(filter => {
    const { label, title, ...filteredFilter } = filter;
    return filteredFilter;
  });
  const dataSend: GeoTreeSelectStateProps = {
    geotree_valuefields: [varName],
    filter: newFilters || [],
  };

  const fetchDataList = async (type: string) => {
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
          (value: GeoTreeSelectItem) => value
        );
        setGeoTreeValueList((prevGeoList: GeoTreeSelectItem[]) => [
          ...prevGeoList,
          ...geoList,
        ]);
      }
    } catch (error) {
      console.log(`Error fetch data tree select ${error}`)
    }

  }
  useEffect(() => {

    fetchDataList(type)

  }, [type])


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
      geoList.includes(item)
    );
    const values = filteredSelect.map<string>((item: string) => item);
    setSelectedValue(() => values);
    dispatch(setFilterObject(filter));
  }, [varName, styleName, geoTreeValueList]);

  let dataForTreeSelect: any
  if (type === TYPES.GeoTreeSelect) {
    dataForTreeSelect = convertDataToGeoTreeSelectFormat(geoTreeValueList);
  } else if (type === TYPES.LanguageTreeSelect) {
    dataForTreeSelect = convertDataToLanguagesTreeSelectFormat(geoTreeValueList);
  }

  const findSelectedItems = (data: GeoTreeSelectItem[], value: string | number): GeoTreeSelectItem[] => {
    const selectedItems: GeoTreeSelectItem[] = [];
    const searchItems = (items: GeoTreeSelectItem[]) => {
      for (const item of items) {
        if (item.value === value) {
          selectedItems.push(item);
        } else if (item.children && item.children.length > 0) {
          searchItems(item.children as GeoTreeSelectItem[])
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
    dispatch(setIsChangeGeoTree(true));
    setSelectedValue(newValue);
    const selectedTitles: string[] = [];
    const selectedItemTitles: any[] = []
    valueSelect.forEach((value) => {
      const selectedItem = findSelectedItems(dataForTreeSelect || [], value as string);
      selectedItemTitles.push(selectedItem)
    });
    const combinedArray = ([] as GeoTreeSelectItem[]).concat(...selectedItemTitles);

    combinedArray.forEach((items) => {
      for (const item in items) {
        if (item === 'title') {
          selectedTitles.push(items[item] as string)
        }
      }
    })
    const existingFilterObjectString = localStorage.getItem('filterObject');
    let existingFilters: Filter[] = [];

    if (existingFilterObjectString) {
      existingFilters = JSON.parse(existingFilterObjectString).filter || [];
    }
    const existingFilterIndex = existingFilters.findIndex(
      (filter) => filter.varName === varName
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
          title: selectedTitles
        });
      }
    } else if (
      existingFilterIndex !== -1 &&
      Array.isArray(existingFilters[existingFilterIndex].searchTerm) &&
      existingFilters[existingFilterIndex].searchTerm
    ) {
      existingFilters[existingFilterIndex].searchTerm = [];
    }

    const filteredFilters = existingFilters.filter(
      (filter) =>
        Array.isArray(filter.searchTerm) && filter.searchTerm.length > 0
    );

    dispatch(setFilterObject(filteredFilters));

    const filterObjectUpdate = {
      filter: filteredFilters,
    };

    const filterObjectString = JSON.stringify(filterObjectUpdate);
    localStorage.setItem('filterObject', filterObjectString);
    if ((styleNameRoute === TYPESOFDATASET.allVoyages || styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved || styleNameRoute === allEnslavers) && filteredFilters.length > 0) {
      dispatch(setIsViewButtonViewAllResetAll(true))
    } else if (filteredFilters.length > 1) {
      dispatch(setIsViewButtonViewAllResetAll(true))
    }
  };

  const filterTreeNode = (inputValue: string, treeNode: TreeItemProps) => {
    return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
  };


  return (
    <div ref={ref}>
      {dataForTreeSelect && dataForTreeSelect.length > 0 && (
        <TreeSelect
          loading
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
