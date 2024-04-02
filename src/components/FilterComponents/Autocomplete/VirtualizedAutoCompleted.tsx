import React, { useState, useEffect, SyntheticEvent } from "react";
import { Autocomplete, TextField, Typography, ListSubheader, Paper, Tooltip } from '@mui/material';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
    AutoCompleteInitialState,
    AutoCompleteOption,
    DataSuggestedValuesProps,
    Filter,
    RangeSliderState,
} from '@/share/InterfaceTypes';
import {
    setAutoLabel,
    setIsChangeAuto,
} from '@/redux/getAutoCompleteSlice';
import '@/style/Slider.scss';
import '@/style/table.scss';
import { usePageRouter } from '@/hooks/usePageRouter';
import { IRootFilterObject } from '@/share/InterfaceTypes';
import CustomAutoListboxComponent from "./CustomAutoListboxComponent";
import { useAutoComplete } from "@/hooks/useAutoComplete";
import { setFilterObject } from "@/redux/getFilterSlice";
import { INTRAAMERICANTRADS, TRANSATLANTICTRADS } from "@/share/CONST_DATA";
import { CheckboxValueType } from "antd/es/checkbox/Group";


export default function VirtualizedAutoCompleted() {
    const { varName } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { styleName } = usePageRouter()
    const limit = 20;
    const { isLoadingList } = useSelector(
        (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
    );
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const [autoList, setAutoLists] = useState<AutoCompleteOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<AutoCompleteOption[]>([]);
    const [autoValue, setAutoValue] = useState<string>('');
    const [offset, setOffset] = useState<number>(0);
    const dispatch: AppDispatch = useDispatch();
    const { isChangeAuto } = useSelector((state: RootState) => state.autoCompleteList)

    const filters: Filter[] = [];
    const filterByVarName = filtersObj && filtersObj.filter((filterItem: Filter) => filterItem.varName !== varName);
    if (!filtersObj && filterByVarName) {
        filters.push({
            varName: varName,
            searchTerm: selectedValue.map((item) => item.value),
            op: "in"
        });
    }
    const dataSend: IRootFilterObject = {
        varName: varName,
        querystr: autoValue,
        offset: offset,
        limit: limit,
        filter: [...(filterByVarName || []), ...filters]
    };

    const { data, isLoading, isError } = useAutoComplete(dataSend, styleName);

    useEffect(() => {
        if (!isLoading && !isError && data) {
            const { suggested_values } = data as DataSuggestedValuesProps;
            const newAutoList: AutoCompleteOption[] = suggested_values.map((value: AutoCompleteOption) => value);

            // Create a Set to track unique values
            const uniqueValues = new Set<string>();
            newAutoList.forEach((value) => uniqueValues.add(value.value));

            // Convert Set back to an array without duplicates
            const filteredAutoList = Array.from(uniqueValues).map(
                (value) => ({ value })
            );

            setAutoLists((prevAutoList) => {
                const uniquePrevAutoList = prevAutoList.filter((item) => !uniqueValues.has(item.value))
                return [...uniquePrevAutoList, ...filteredAutoList]
            });
        }
    }, [data, isLoading, isError]);

    const refetchAutoComplete = () => {
        setOffset((prevOffset) => prevOffset + limit);
    };


    useEffect(() => {
        if (isLoadingList) {
            refetchAutoComplete();
        }
        const storedValue = localStorage.getItem('filterObject');
        if (!storedValue) return;

        const parsedValue = JSON.parse(storedValue);
        const filter: Filter[] = parsedValue.filter;
        const filterByVarName = filter?.length > 0 && filter.find((filterItem) => filterItem.varName === varName);
        if (!filterByVarName) return;

        const autoValueList: string[] = filterByVarName.searchTerm as string[];

        const values = autoValueList.map<AutoCompleteOption>((item: string) => ({ value: item }));
        setSelectedValue(() => values);
        dispatch(setFilterObject(filter));

    }, [isLoadingList, varName, styleName]);

    const handleInputChange = (event: React.SyntheticEvent<Element, Event>, value: string) => {
        if (event) {
            event.preventDefault();
        }
        setAutoValue(value);
        if (!value) {
            setOffset((prev) => prev - offset)
        }
    }

    const handleAutoCompletedChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: AutoCompleteOption[]
    ) => {
        if (!newValue) {
            return;
        }

        const autuLabels: string[] = newValue.map((ele) => ele.value);
        setSelectedValue(newValue as AutoCompleteOption[]);
        dispatch(setIsChangeAuto(!isChangeAuto));
        dispatch(setAutoLabel(autuLabels));

        const existingFilterObjectString = localStorage.getItem('filterObject');
        let existingFilters: Filter[] = [];

        if (existingFilterObjectString) {
            existingFilters = JSON.parse(existingFilterObjectString).filter || [];
        }

        const existingFilterIndex = existingFilters.findIndex(filter => filter.varName === varName);

        // Type guard to check if autuLabels is an array before accessing its length property
        if (Array.isArray(autuLabels) && autuLabels.length > 0) {
            if (existingFilterIndex !== -1) {
                existingFilters[existingFilterIndex].searchTerm = [...autuLabels];
            } else {
                existingFilters.push({
                    varName: varName,
                    searchTerm: autuLabels,
                    op: 'in'
                });
            }
        } else if (existingFilterIndex !== -1 && Array.isArray(existingFilters[existingFilterIndex].searchTerm) && existingFilters[existingFilterIndex].searchTerm) {
            existingFilters[existingFilterIndex].searchTerm = [];
        }

        const filteredFilters = existingFilters.filter(filter => {
            return !Array.isArray(filter.searchTerm) || filter.searchTerm.length > 0;
        });

        console.log({ existingFilters, filteredFilters })
        dispatch(setFilterObject(filteredFilters));

        const filterObjectUpdate = {
            filter: filteredFilters
        };
        const filterObjectString = JSON.stringify(filterObjectUpdate);
        localStorage.setItem('filterObject', filterObjectString);
    };

    const renderGroup = (params: any) => [
        <ListSubheader key={params.key} component="div">
            {params.group}
        </ListSubheader>,
        params.children
    ];

    return (
        <Autocomplete
            loading
            ListboxComponent={CustomAutoListboxComponent}
            multiple
            autoHighlight
            id="tags-outlined"
            style={{ width: 450 }}
            options={autoList}
            ListboxProps={{ style: { overscrollBehaviorX: 'none' } }}
            isOptionEqualToValue={(option, value) => {
                return option.value === value.value;
            }}
            getOptionLabel={(option) => {
                const textContent = new DOMParser().parseFromString(option.value ?? '', 'text/html').body.textContent;
                return textContent ?? '';
            }}
            onInputChange={handleInputChange}
            inputValue={autoValue}
            value={selectedValue}
            onChange={handleAutoCompletedChange}
            renderGroup={renderGroup}
            PaperComponent={({ children }) => (
                <Paper className="auto-options-list">
                    {children}
                </Paper>
            )}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={
                        <Typography variant="body1" style={{ fontSize: 14 }} height={50} >
                            field
                        </Typography>
                    }
                    placeholder="SelectedOptions"
                    style={{ marginTop: 20 }}
                />
            )}

        />
    );
}
