import React, { useState, useEffect, useMemo, SyntheticEvent, useRef } from "react";
import { Autocomplete, TextField, Typography, ListSubheader } from '@mui/material';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAutoVoyageComplete } from '@/fetch/voyagesFetch/fetchAutoVoyageComplete';
import {
    AutoCompleteInitialState,
    AutoCompleteOption,
    CurrentPageInitialState,
    Filter,
    RangeSliderState,
} from '@/share/InterfaceTypes';
import {
    setAutoCompleteValue,
    setAutoLabel,
    setIsChangeAuto,
} from '@/redux/getAutoCompleteSlice';
import { fetchPastEnslavedAutoComplete } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedAutoCompleted';
import { fetchPastEnslaversAutoCompleted } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversAutoCompleted';
import '@/style/Slider.scss';
import '@/style/table.scss';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { IRootAutocompleteObject } from '@/share/InterfaceTypes';
import CustomAutoListboxComponent from "./CustomAutoListboxComponent";


export default function VirtualizedAutoCompleted() {
    const { varName, rangeSliderMinMax: rangeValue } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const effectOnce = useRef(false);
    const { styleName } = usePageRouter()
    const { geoTreeValue } = useSelector(
        (state: RootState) => state.getGeoTreeData
    );
    const { isOpenDialog } = useSelector(
        (state: RootState) => state.getScrollPage as CurrentPageInitialState
    );
    const limit = 20;
    const { pathNameEnslaved, pathNameEnslavers, pathNameVoyages } = useSelector((state: RootState) => state.getPathName);
    const { autoCompleteValue, isLoadingList } = useSelector(
        (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
    );

    const [autoList, setAutoLists] = useState<AutoCompleteOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<AutoCompleteOption[]>([]);
    const [autoValue, setAutoValue] = useState<string>('');
    const offset = useRef<number>(0)
    const dispatch: AppDispatch = useDispatch();

    const fetchAutoCompletedList = async () => {

        const filters: Filter[] = [];
        if (selectedValue.length > 0) {
            filters.push({
                varName: varName,
                searchTerm: selectedValue.map((item) => item.value),
                op: "in"
            });
        }

        const dataSend: IRootAutocompleteObject = {
            varname: varName,
            querystr: autoValue,
            offset: offset.current,
            limit: limit,
            filter: filters,
        };
        console.log(dataSend)

        try {
            let response = [];
            if (checkPagesRouteForVoyages(styleName!)) {
                response = await dispatch(fetchAutoVoyageComplete(dataSend)).unwrap();

            } else if (checkPagesRouteForEnslaved(styleName!)) {
                response = await dispatch(
                    fetchPastEnslavedAutoComplete(dataSend)
                ).unwrap();
            } else if (checkPagesRouteForEnslavers(styleName!)) {
                response = await dispatch(
                    fetchPastEnslaversAutoCompleted(dataSend)
                ).unwrap();
            }
            if (response) {
                const { suggested_values } = response

                const newAutoList: AutoCompleteOption[] = suggested_values.map((value: AutoCompleteOption) => value);

                setAutoLists((prevAutoList) => [...prevAutoList, ...newAutoList])
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        if (isLoadingList) {
            offset.current += 10;
            fetchAutoCompletedList();
        }
    }, [isLoadingList]);

    useEffect(() => {
        if (!isLoadingList && !effectOnce.current) {
            fetchAutoCompletedList();
        }
        return () => {
            effectOnce.current = true;
            setAutoLists([]);
        };
    }, [dispatch, varName, pathNameEnslaved, pathNameEnslavers, pathNameVoyages, styleName, isOpenDialog]);

    useEffect(() => {
        const storedValue = localStorage.getItem('filterObject');
        if (!storedValue) return;

        const parsedValue = JSON.parse(storedValue);
        const filter: Filter[] = parsedValue.filter;
        const filterByVarName = filter.find((filterItem) => filterItem.varName === varName);
        if (!filterByVarName) return;

        const autoValueList: string[] = filterByVarName.searchTerm as string[];
        const values = autoValueList.map<AutoCompleteOption>((item: string) => ({ value: item }));
        setSelectedValue(() => values);

    }, []);


    const handleInputChange = useMemo(
        () => (event: React.SyntheticEvent<Element, Event>, value: string) => {
            event.preventDefault();
            console.log({ value })
            setAutoValue(value);
        },
        []
    );

    const handleAutoCompletedChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: AutoCompleteOption[]
    ) => {

        if (newValue) {
            setSelectedValue(newValue as AutoCompleteOption[]);
            dispatch(setIsChangeAuto(true));
            const autuLabel: string[] = newValue.map((ele) => ele.value);
            dispatch(
                setAutoCompleteValue({
                    ...autoCompleteValue,
                    searchTerm: autuLabel,
                })
            );
            dispatch(setAutoLabel(autuLabel));

            // Retrieve existing filterObject from localStorage
            const existingFilterObjectString = localStorage.getItem('filterObject');

            let existingFilterObject: any = {};

            if (existingFilterObjectString) {
                existingFilterObject = JSON.parse(existingFilterObjectString);
            }

            // Retrieve existing filters array
            const existingFilters: Filter[] = existingFilterObject.filter || [];
            const existingFilterIndex = existingFilters.findIndex(filter => filter.varName === varName);
            if (existingFilterIndex !== -1) {
                existingFilters[existingFilterIndex].searchTerm = [...autuLabel];
            } else {
                // If it doesn't exist, create a new filter
                const newFilter = {
                    varName: varName,
                    searchTerm: autuLabel,
                    op: 'in'
                };
                existingFilters.push(newFilter);
            }

            // Update filterObject state
            const filterObject = {
                ...autoCompleteValue,
                ...rangeValue,
                ...geoTreeValue,
                filter: existingFilters
            };

            // Update localStorage
            const filterObjectString = JSON.stringify(filterObject);
            localStorage.setItem('filterObject', filterObjectString);

        }
    };
    const renderGroup = (params: any) => [
        <ListSubheader key={params.key} component="div">
            {params.group}
        </ListSubheader>,
        params.children
    ];

    return (
        <Autocomplete
            ListboxComponent={CustomAutoListboxComponent}
            multiple
            id="tags-outlined"
            style={{ width: 400 }}
            options={autoList}
            isOptionEqualToValue={(option, value) => {
                return option.value === value.value;
            }}
            getOptionLabel={(option) => option.value}
            value={selectedValue}
            onChange={handleAutoCompletedChange}
            onInputChange={handleInputChange}
            inputValue={autoValue}
            renderGroup={renderGroup}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={
                        <Typography variant="body1" style={{ fontSize: 16 }}>
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
