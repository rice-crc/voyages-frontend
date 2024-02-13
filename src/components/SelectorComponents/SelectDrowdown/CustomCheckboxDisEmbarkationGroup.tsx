import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { CheckboxProps } from 'antd/es/checkbox';
import { CheckboxGroupItem } from '@/share/InterfaceTypes';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

const CustomCheckboxDisEmbarkationGroup: React.FC<CheckboxGroupItem> = ({
    plainOptions,
    checkedList,
    setCheckedList,
    label,
    varName,
    show,
}) => {
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        setCheckAll(checkedList.length === plainOptions.length);
    }, [checkedList, plainOptions]);

    const onChange = (list: CheckboxValueType[]) => {
        setCheckedList(list);
    };

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        const isChecked = e.target.checked;
        setCheckAll(isChecked);
        setCheckedList(isChecked ? plainOptions : []);
    };

    const indeterminate =
        checkedList.length > 0 && checkedList.length < plainOptions.length;

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

export default CustomCheckboxDisEmbarkationGroup;
