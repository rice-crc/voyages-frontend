import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AutoCompleteInitialState,
  RangeSliderState,
} from '@/share/InterfaceTypes';
import { AppDispatch, RootState } from '@/redux/store';
import { fetcVoyagesGeoTreeSelectLists } from '@/fetch/geoFetch/fetchVoyagesGeoTreeSelect';
import { TreeSelect } from 'antd';
import '@/style/page.scss';
import {
  setGeoTreeValues,
  setGeoTreeValueList,
  setIsChangeGeoTree,
  setGeoTreeValueSelect,
} from '@/redux/getGeoTreeDataSlice';
import { convertDataToGeoTreeSelectFormat } from '@/utils/functions/convertDataToGeoTreeSelectFormat';
import { fetchEnslavedGeoTreeSelect } from '@/fetch/geoFetch/fetchEnslavedGeoTreeSelect';
import { fetchEnslaversGeoTreeSelect } from '@/fetch/geoFetch/fetchEnslaversGeoTreeSelect';
import { getGeoValuesCheck } from '@/utils/functions/getGeoValuesCheck';
import { usePageRouter } from '@/hooks/usePageRouter';
import { handleSetDataSentMapGeoTree } from '@/utils/functions/handleSetDataSentMapGeoTree';
import { checkPagesRouteForVoyages, checkPagesRouteForEnslaved, checkPagesRouteForEnslavers } from '@/utils/functions/checkPagesRoute';

const GeoTreeSelected: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const { isChangeGeoTree, geoTreeList, geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const { styleName } = usePageRouter()
  const { varName, rangeSliderMinMax: rangeValue } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { autoCompleteValue } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );

  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      const { filterObject } = parsedValue;
      const geoTreeListValue = getGeoValuesCheck([], geoTreeList);

      for (const valueKey in filterObject) {
        if (geoTreeListValue.length > 0) {
          if (varName === valueKey) {
            const geoList = filterObject[valueKey];
            const filteredValueGeoTreeStorage = geoList.filter(
              (item: string) => {
                return item !== '*';
              }
            );
            const filteredSelect = geoTreeListValue.filter((item: string) =>
              filteredValueGeoTreeStorage.includes(item)
            );
            setSelectedValue(filteredSelect);
          }
        }
      }
    }
  }, [varName, geoTreeList]);

  useEffect(() => {
    let subscribed = true;
    const fetchGeoTreeSelectList = async () => {

      const dataSend = handleSetDataSentMapGeoTree(autoCompleteValue, isChangeGeoTree, geoTreeValue, varName, rangeValue)

      let response = [];

      try {
        if (checkPagesRouteForVoyages(styleName!)) {
          console.log('call voyages')
          response = await dispatch(
            fetcVoyagesGeoTreeSelectLists(dataSend)
          ).unwrap();
        } else if (checkPagesRouteForEnslaved(styleName!)) {
          console.log('call enslaved')
          response = await dispatch(
            fetchEnslavedGeoTreeSelect(dataSend)
          ).unwrap();
        } else if (checkPagesRouteForEnslavers(styleName!)) {
          console.log('call enslaverssss')
          response = await dispatch(
            fetchEnslaversGeoTreeSelect(dataSend)
          ).unwrap();
        }

        if (subscribed && response) {
          dispatch(setGeoTreeValueList(response));
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchGeoTreeSelectList();
    return () => {
      subscribed = false;
      dispatch(setGeoTreeValueList([]));
    };
  }, [dispatch, varName, styleName]);

  const handleTreeOnChange = (newValue: string[]) => {
    dispatch(setIsChangeGeoTree(true));
    setSelectedValue(newValue);
    const valueSelect: string[] = newValue.map((ele) => ele);
    dispatch(setGeoTreeValueSelect(valueSelect));
    dispatch(
      setGeoTreeValues({
        ...geoTreeValue,
        [varName]: [...newValue, '*'],
      })
    );

    const filterObject = {
      filterObject: {
        ...geoTreeValue,
        ...autoCompleteValue,
        ...rangeValue,
        [varName]: [...newValue, '*'],
      },
    };
    const filterObjectString = JSON.stringify(filterObject);
    localStorage.setItem('filterObject', filterObjectString);
  };

  const dataForTreeSelect = convertDataToGeoTreeSelectFormat(geoTreeList);

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
          maxTagPlaceholder={(selectedValue) =>
            `+ ${selectedValue.length} locations ...`
          }
        />
      )}
    </div>
  );
};

export default GeoTreeSelected;
