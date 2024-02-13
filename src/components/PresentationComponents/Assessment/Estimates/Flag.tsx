import { Button } from "antd";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useState } from "react";
import '@/style/estimates.scss'
import { flagText } from "@/utils/flatfiles/estimate_text";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setKeyValueName } from "@/redux/getRangeSliderSlice";
import { Filter } from "@/share/InterfaceTypes";
import { setFilterObject } from "@/redux/getFilterSlice";
// import { setSelectedFlags } from "@/redux/getEstimateAssesmentSlice";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { setOnChangeFlag } from "@/redux/getEstimateAssesmentSlice";
const CheckboxGroup = Checkbox.Group;

const Flag = () => {
    const dispatch: AppDispatch = useDispatch();
    const varName = 'nation__name'
    const storedValue = localStorage.getItem("filterObject");
    const [selectedFlags, setSelectedFlags] = useState<CheckboxValueType[]>(flagText)
    const { changeFlag } = useSelector(
        (state: RootState) => state.getEstimateAssessment
    );

    useEffect(() => {
        dispatch(setKeyValueName(varName));
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            const filter: Filter[] = parsedValue.filter;
            const filterByVarName =
                filter?.length > 0 &&
                filter.find((filterItem) => filterItem.varName === varName);

            if (filterByVarName) {
                const selectedFlags: string[] = filterByVarName.searchTerm as string[];
                setSelectedFlags(selectedFlags)
                dispatch(setFilterObject(filter));
                return;
            }
        }
    }, [dispatch, storedValue, varName]);

    const onChangeFlag = (list: CheckboxValueType[]) => {
        dispatch(setOnChangeFlag(!changeFlag))
        setSelectedFlags(list)

        updatedSliderToLocalStorage(list);
    };

    const handleResetAll = () => {
        const allFlags = flagText.map(value => value);
        setSelectedFlags(allFlags)
        dispatch(setOnChangeFlag(!changeFlag))
        updatedSliderToLocalStorage(allFlags)
    };

    function updatedSliderToLocalStorage(updateValue: CheckboxValueType[]) {
        const existingFilterObjectString = localStorage.getItem('filterObject');
        let existingFilterObject: any = {};

        if (existingFilterObjectString) {
            existingFilterObject = JSON.parse(existingFilterObjectString);
        }
        const existingFilters: Filter[] = existingFilterObject.filter || [];
        const existingFilterIndex = existingFilters.findIndex(filter => filter.varName === varName);

        if (existingFilterIndex !== -1) {
            existingFilters[existingFilterIndex].searchTerm = updateValue
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
        <>
            <CheckboxGroup
                options={flagText}
                defaultValue={selectedFlags}
                value={selectedFlags}
                onChange={onChangeFlag}
                style={{ display: 'flex', flexDirection: 'column' }}
            />
            <div className="reset-btn-estimate">
                <Button className="deselec-btn" onClick={handleResetAll}  >Reset</Button>
            </div>
        </>

    )
}

export default Flag;