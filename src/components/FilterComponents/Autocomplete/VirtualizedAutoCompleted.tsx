import React, { useState, useEffect, useMemo, SyntheticEvent, useRef } from "react";
import { Autocomplete, TextField, Typography, ListSubheader } from '@mui/material';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAutoVoyageComplete } from '@/fetch/voyagesFetch/fetchAutoVoyageComplete';
import {
    AutoCompleteInitialState,
    AutoCompleteOption,
    CurrentPageInitialState,
    RangeSliderState,
} from '@/share/InterfaceTypes';
import {
    setAutoCompleteValue,
    setAutoLabel,
    setIsChangeAuto,
    setOffset,
} from '@/redux/getAutoCompleteSlice';
import { fetchPastEnslavedAutoComplete } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedAutoCompleted';
import { fetchPastEnslaversAutoCompleted } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversAutoCompleted';
import '@/style/Slider.scss';
import '@/style/table.scss';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { IRootObject } from '@/share/InterfaceTypesTable';
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
    const { autoCompleteValue, isLoadingList, offset } = useSelector(
        (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
    );

    const [autoList, setAutoLists] = useState<AutoCompleteOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<AutoCompleteOption[]>([]);
    const [autoValue, setAutoValue] = useState<string>('');

    const dispatch: AppDispatch = useDispatch();

    const fetchAutoCompletedList = async () => {
        if (autoValue === '') {
            console.log({ autoValue })
            dispatch(setOffset(offset + 10));
        }
        const dataSend: IRootObject = {
            varname: varName,
            querystr: autoValue,
            offset: offset,
            limit: limit,
            filter: {
                [varName]: "" //autoValue --> PASS as Empty String
            }
        };

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

    const handleInputChange = useMemo(
        () => (event: React.SyntheticEvent<Element, Event>, value: string) => {
            event.preventDefault();
            setAutoValue(value);
        },
        []
    );

    useEffect(() => {
        const storedValue = localStorage.getItem('filterObject');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            const { filterObject } = parsedValue;
            for (const autoKey in filterObject) {
                if (varName === autoKey) {
                    const autoValueList = filterObject[autoKey];
                    if (autoValueList.length > 0) {
                        setSelectedValue(autoValueList);
                    }
                    setSelectedValue([]);
                }
            }
        }
    }, []);


    const handleAutoCompletedChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: AutoCompleteOption[]
    ) => {
        setSelectedValue(newValue as AutoCompleteOption[]);
        setSelectedValue(newValue as AutoCompleteOption[]);
        if (newValue) {
            dispatch(setIsChangeAuto(true));
            const autuLabel: string[] = newValue.map((ele) => ele.value);
            dispatch(
                setAutoCompleteValue({
                    ...autoCompleteValue,
                    [varName]: newValue,
                })
            );
            dispatch(setAutoLabel(autuLabel));

            const filterObject = {
                filterObject: {
                    ...autoCompleteValue,
                    ...rangeValue,
                    ...geoTreeValue,
                    [varName]: newValue,
                },
            };
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
        <>
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
            {/* <VirtualizedList
                height={300}
                width={'100%'}
                options={autoList}
                itemSize={50} /> */}
        </>
    );
}
