import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AutoCompleteInitialState,
  RangeSliderState,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';
import { AppDispatch, RootState } from '@/redux/store';
import { AFRICANORIGINS, ALLENSLAVED, ENSALVERSTYLE, ENSLAVEDTEXAS } from '@/share/CONST_DATA';
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
      const dataSend: { [key: string]: (string | number)[] } = {};

      dataSend['geotree_valuefields'] = [varName];

      if (isChangeGeoTree && varName && geoTreeValue) {
        for (const keyValue in geoTreeValue) {
          if (Array.isArray(geoTreeValue[keyValue])) {
            if (varName !== keyValue) {
              dataSend[keyValue] = geoTreeValue[keyValue] as string[] | number[];
            }
          }
        }
      }
      console.log({ dataSend })
      if (autoCompleteValue && varName) {
        for (const autoKey in autoCompleteValue) {
          const autoCompleteOption = autoCompleteValue[autoKey];
          if (typeof autoCompleteOption !== 'string') {
            for (const keyValue of autoCompleteOption) {
              if (typeof keyValue === 'object' && 'label' in keyValue) {
                dataSend[autoKey] = [keyValue.label];
              }
            }
          }
        }
      }

      if (rangeValue && varName) {
        for (const rangKey in rangeValue) {
          dataSend[rangKey] = [rangeValue[rangKey][0], rangeValue[rangKey][1]];
        }
      }

      let response = [];
      try {
        if (styleName === TYPESOFDATASET.allVoyages || styleName === TYPESOFDATASET.intraAmerican || styleName === TYPESOFDATASET.transatlantic || styleName === TYPESOFDATASET.texas) {
          response = await dispatch(
            fetcVoyagesGeoTreeSelectLists(dataSend)
          ).unwrap();
        } else if (styleName === ALLENSLAVED || styleName === AFRICANORIGINS || styleName === ENSLAVEDTEXAS) {
          response = await dispatch(
            fetchEnslavedGeoTreeSelect(dataSend)
          ).unwrap();
        } else if (styleName === ENSALVERSTYLE) {
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
