import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { CheckboxProps } from 'antd/es/checkbox';
import { CheckboxGroupItem, Filter } from '@/share/InterfaceTypes';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { setFilterObject } from '@/redux/getFilterSlice';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setKeyValueName } from '@/redux/getRangeSliderSlice';

const CustomCheckboxEmbarkationGroup: React.FC<CheckboxGroupItem> = ({
    plainOptions, checkedList, setCheckedList,
    label, varName,
    show
}) => {
    const dispatch: AppDispatch = useDispatch();

    const [checkAll, setCheckAll] = useState(false);
    const storedValue = localStorage.getItem("filterObject");

    useEffect(() => {
        setCheckAll(checkedList.length === plainOptions.length);
        dispatch(setKeyValueName(varName));
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            const filter: Filter[] = parsedValue.filter;
            const filterByVarName =
                filter?.length > 0 &&
                filter.find((filterItem) => filterItem.varName === varName);

            if (filterByVarName) {
                const valueOptions: string[] = filterByVarName.searchTerm as string[];
                console.log({ valueOptions })
                // dispatch(setSelectedFlags(selectedFlags))
                dispatch(setFilterObject(filter));
                return;
            }
        }
    }, [checkedList, plainOptions, varName]);

    const onChange = (list: CheckboxValueType[]) => {
        console.log({ list })
        setCheckedList(list);
        // dispatch(setSelectedFlags(list as string[]));
        updatedSliderToLocalStrage(list as string[])
    };

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        const isChecked = e.target.checked;
        setCheckAll(isChecked);
        setCheckedList(isChecked ? plainOptions : []);
        // dispatch(setSelectedFlags(isChecked ? plainOptions as string[] : []));
        // updatedSliderToLocalStrage(isChecked ? plainOptions as string[] : [])
    };

    const indeterminate =
        checkedList.length > 0 && checkedList.length < plainOptions.length;

    function updatedSliderToLocalStrage(updateValue: string[]) {
        console.log({ updateValue })
        const existingFilterObjectString = localStorage.getItem('filterObject');
        let existingFilterObject: any = {};

        if (existingFilterObjectString) {
            existingFilterObject = JSON.parse(existingFilterObjectString);
        }
        const existingFilters: Filter[] = existingFilterObject.filter || [];
        const existingFilterIndex = existingFilters.findIndex(filter => filter.varName === varName);

        if (existingFilterIndex !== -1) {
            existingFilters[existingFilterIndex].searchTerm = updateValue as string[]
        } else {
            const newFilter: Filter = {
                varName: varName,
                searchTerm: updateValue!,
                op: "in"
            };
            existingFilters.push(newFilter);
        }

        dispatch(setFilterObject(existingFilters));

        const filterObjectUpdate = {
            filter: existingFilters
        };

        const filterObjectString = JSON.stringify(filterObjectUpdate);
        localStorage.setItem('filterObject', filterObjectString);
    }

    return (

        <div className="regions-checkbox">
            <Checkbox
                onChange={onCheckAllChange}
                checked={checkAll}
                indeterminate={indeterminate}
            >
                {label}
            </Checkbox>
            {show && (
                <div className="tooltip-box">
                    <Checkbox.Group
                        className="sidebar-label"
                        style={{ display: 'flex', flexDirection: 'column' }}
                        options={plainOptions}
                        value={checkedList}
                        onChange={onChange}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomCheckboxEmbarkationGroup;
