import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AutoCompleteInitialState,
  RangeSliderState,
} from '@/share/InterfaceTypes';
import { AppDispatch, RootState } from '@/redux/store';
import { ALLENSLAVED, ALLENSLAVERS, ALLVOYAGES } from '@/share/CONST_DATA';
import { fetcVoyagesGeoTreeSelectLists } from '@/fetchAPI/geoApi/fetchVoyagesGeoTreeSelect';
import { TreeSelect } from 'antd';
import '@/style/page.scss';
import {
  setGeoTreeValues,
  setGeoTreeValueList,
  setIsChangeGeoTree,
  setGeoTreeValueSelect,
} from '@/redux/getGeoTreeDataSlice';
import { convertDataToGeoTreeSelectFormat } from '@/utils/functions/convertDataToGeoTreeSelectFormat';
import { fetchEnslavedGeoTreeSelect } from '@/fetchAPI/geoApi/fetchEnslavedGeoTreeSelect';
import { fetchEnslaversGeoTreeSelect } from '@/fetchAPI/geoApi/fetchEnslaversGeoTreeSelect';
import { VpnLock } from '@mui/icons-material';
import { title } from 'process';

const GeoTreeSelected: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const { geoTreeList, geoTreeValue, geoTreeSelectValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );

  const { varName, rangeSliderMinMax: rangeValue } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { pathName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { autoCompleteValue } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );

  // useEffect(() => {
  //   const storedValue = localStorage.getItem('filterObject');
  //   if (storedValue) {
  //     const parsedValue = JSON.parse(storedValue);
  //     const { filterObject } = parsedValue;

  //     for (const valueKey in filterObject) {
  //       if (varName === valueKey) {
  //         const geoList = filterObject[valueKey];
  //         setSelectedValue(geoList);
  //       }
  //     }
  //   }
  // }, []);

  useEffect(() => {
    let subscribed = true;

    const fetchGeoTreeSelectList = async () => {
      const formData: FormData = new FormData();
      formData.append('geotree_valuefields', varName);

      if (geoTreeSelectValue.length > 0) {
        for (const value of geoTreeSelectValue) {
          formData.append(varName, value);
        }
      }

      if (autoCompleteValue && varName) {
        for (const autoKey in autoCompleteValue) {
          const autoCompleteOption = autoCompleteValue[autoKey];
          if (typeof autoCompleteOption !== 'string') {
            for (const keyValue of autoCompleteOption) {
              if (typeof keyValue === 'object' && 'label' in keyValue) {
                formData.append(autoKey, keyValue.label);
              }
            }
          }
        }
      }

      if (rangeValue && varName) {
        for (const rangeKey in rangeValue) {
          formData.append(rangeKey, String(rangeValue[rangeKey][0]));
          formData.append(rangeKey, String(rangeValue[rangeKey][1]));
        }
      }

      let response;
      try {
        if (pathName === ALLVOYAGES) {
          response = await dispatch(
            fetcVoyagesGeoTreeSelectLists(formData)
          ).unwrap();
          if (subscribed && response) {
            dispatch(setGeoTreeValueList(response));
          }
        } else if (pathName === ALLENSLAVED) {
          response = await dispatch(
            fetchEnslavedGeoTreeSelect(formData)
          ).unwrap();
          if (subscribed && response) {
            dispatch(setGeoTreeValueList(response));
          }
        } else if (pathName === ALLENSLAVERS) {
          response = await dispatch(
            fetchEnslaversGeoTreeSelect(formData)
          ).unwrap();
          if (subscribed && response) {
            dispatch(setGeoTreeValueList(response));
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchGeoTreeSelectList();
    return () => {
      subscribed = false;
    };
  }, [dispatch, varName, pathName]);

  const handleTreeOnChange = (newValue: string[]) => {
    dispatch(setIsChangeGeoTree(true));
    setSelectedValue(newValue);
    const valueSelect: string[] = newValue.map((ele) => ele);
    dispatch(setGeoTreeValueSelect(valueSelect));
    dispatch(
      setGeoTreeValues({
        ...geoTreeValue,
        [varName]: newValue,
      })
    );

    const filterObject = {
      filterObject: {
        ...geoTreeValue,
        ...autoCompleteValue,
        ...rangeValue,
        [varName]: newValue,
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
