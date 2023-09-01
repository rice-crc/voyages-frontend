import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GeoTreeSelectDataProps,
  RangeSliderState,
  TreeSelectItem,
} from '@/share/InterfaceTypes';
import { AppDispatch, RootState } from '@/redux/store';
import { ALLENSLAVED, ALLENSLAVERS, ALLVOYAGES } from '@/share/CONST_DATA';
import { fetchGeoTreeSelectLists } from '@/fetchAPI/geoApi/fetchGeoTreeSelect';
import { TreeSelect } from 'antd';
import '@/style/page.scss';

const GeoTreeSelected: React.FC = () => {
  const [value, setValue] = useState<string>();
  const onChange = (newValue: string) => {
    console.log(newValue);
    setValue(newValue);
  };

  console.log('value', value);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { pathName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  const [geoTreeList, setGeoTreeLists] = useState<GeoTreeSelectDataProps[]>([]);

  useEffect(() => {
    const formData: FormData = new FormData();

    if (pathName === ALLVOYAGES) {
      dispatch(fetchGeoTreeSelectLists(formData))
        .unwrap()
        .then((response: GeoTreeSelectDataProps[]) => {
          if (response) {
            setGeoTreeLists(response);
          }
        })
        .catch((error: Error) => {
          console.log('error', error);
        });
    } else if (pathName === ALLENSLAVED) {
      // Handle ALLENSLAVED case if needed
    } else if (pathName === ALLENSLAVERS) {
      // Handle ALLENSLAVERS case if needed
    }
  }, [dispatch, varName, pathName]);

  const convertDataToTreeSelectFormat = (
    data: GeoTreeSelectDataProps[],
    includeSelectAll: boolean = true
  ): TreeSelectItem[] => {
    const treeData: TreeSelectItem[] = [];

    if (includeSelectAll) {
      const selectAllItem: TreeSelectItem = {
        id: 0,
        key: 'select-all',
        title: 'Select All',
        value: 'select-all',
        children: [],
      };
      treeData.push(selectAllItem);
    }

    data.forEach((item) => {
      const treeItem: TreeSelectItem = {
        id: item.id,
        key: item.value.toString(),
        title: item.name,
        value: item.value.toString(),
        children: item.children
          ? convertDataToTreeSelectFormat(item.children, false)
          : [],
      };

      if (includeSelectAll && treeData.length > 0) {
        // Check if treeData has items before accessing its first element
        const firstItem = treeData[0];
        if (firstItem && firstItem.children) {
          firstItem.children.push(treeItem);
        }
      } else {
        treeData.push(treeItem);
      }
    });

    return treeData;
  };

  const dataForTreeSelect = convertDataToTreeSelectFormat(geoTreeList);

  return (
    <div ref={ref}>
      {dataForTreeSelect.length > 0 && (
        <TreeSelect
          showSearch
          style={{ width: 450 }}
          value={value}
          dropdownStyle={{ overflow: 'auto', zIndex: 1301 }}
          placeholder="Please select"
          allowClear
          multiple
          treeCheckable={true}
          onChange={onChange}
          treeDefaultExpandAll={false}
          treeDefaultExpandedKeys={['select-all']}
          treeData={dataForTreeSelect}
        />
      )}
    </div>
  );
};

export default GeoTreeSelected;
