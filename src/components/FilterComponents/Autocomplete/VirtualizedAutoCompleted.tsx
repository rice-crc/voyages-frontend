import React, { useState, useEffect, SyntheticEvent, useRef } from 'react';
import {
    Autocomplete,
    TextField,
    Typography,
    ListSubheader,
    Paper,
    Checkbox,
    AutocompleteRenderOptionState,
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
    AutoCompleteInitialState,
    AutoCompleteOption,
    DataSuggestedValuesProps,
    Filter,
    RangeSliderState,
} from '@/share/InterfaceTypes';
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import { setAutoLabel } from '@/redux/getAutoCompleteSlice';
import '@/style/Slider.scss';
import '@/style/table.scss';
import { usePageRouter } from '@/hooks/usePageRouter';
import { IRootFilterObject } from '@/share/InterfaceTypes';
import CustomAutoListboxComponent from './CustomAutoListboxComponent';
import { useAutoComplete } from '@/hooks/useAutoComplete';
import { setFilterObject } from '@/redux/getFilterSlice';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import debounce from 'lodash.debounce';

export default function VirtualizedAutoCompleted() {
    const { varName } = useSelector((state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { styleName } = usePageRouter();
    const limit = 20;
    const { isLoadingList } = useSelector(
        (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
    );
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const [autoList, setAutoLists] = useState<AutoCompleteOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<AutoCompleteOption[]>([]);
    const [autoValue, setAutoValue] = useState<string>('');
    const [offset, setOffset] = useState<number>(0);
    const [startIndex, setStartIndex] = useState<number>(0);
    const [stopIndex, setStopIndex] = useState<number>(autoList.length);
    const dispatch: AppDispatch = useDispatch();
    const prevScrollY = useRef<number>(0);

    const filters = filtersDataSend(filtersObj, styleName!);
    const dataSend: IRootFilterObject = {
        varName: varName,
        querystr: autoValue,
        offset: offset,
        limit: limit,
        filter: filters,
    };

    const { data, isLoading, isError } = useAutoComplete(dataSend, styleName);

    useEffect(() => {
        if (!isLoading && !isError && data) {
            const { suggested_values } = data as DataSuggestedValuesProps;
            const newAutoList: AutoCompleteOption[] = suggested_values.map(
                (value: AutoCompleteOption) => value
            );

            // Create a Set to track unique values
            const uniqueValues = new Set<string>();
            newAutoList.forEach((value) => uniqueValues.add(value.value));

            // Convert Set back to an array without duplicates
            const filteredAutoList = Array.from(uniqueValues).map((value) => ({
                value,
            }));

            setAutoLists((prevAutoList) => {
                const uniquePrevAutoList = prevAutoList.filter(
                    (item) => !uniqueValues.has(item.value)
                );
                return [...uniquePrevAutoList, ...filteredAutoList,];
            });
        }
    }, [data, isLoading, isError]);

    const refetchAutoComplete = () => {
        setOffset((prevOffset) => prevOffset + limit);
    };
    console.log({ offset, stopIndex, startIndex })

    const [hasMore, setHasMore] = useState<boolean>(true)

    const fetchMoreDataList = () => {
        if (autoList.length < offset) {
            // MAKE API CALL
            setTimeout(() => {
                setAutoLists(autoList.concat(Array.from({ length: 20 })))
            }, 500)

        } else {
            setOffset(() => offset + limit)
            setHasMore(false)
        }
    }

    useEffect(() => {
        // if (isLoadingList) {
        //     refetchAutoComplete();
        // }
        // if (offset > autoList.length) {
        //     refetchAutoComplete();
        // }
        const storedValue = localStorage.getItem('filterObject');
        if (!storedValue) return;

        const parsedValue = JSON.parse(storedValue);
        const filter: Filter[] = parsedValue.filter;
        const filterByVarName =
            filter?.length > 0 &&
            filter.find((filterItem) => filterItem.varName === varName);
        if (!filterByVarName) return;

        const autoValueList: string[] = filterByVarName.searchTerm as string[];

        const values = autoValueList.map<AutoCompleteOption>((item: string) => ({
            value: item,
        }));
        setSelectedValue(() => values);
        dispatch(setFilterObject(filter));
    }, [isLoadingList, varName, styleName]);

    const handleScroll = () => {
        const listElement = document.getElementById('auto-list');
        console.log({ listElement })
        if (!listElement) return;

        const scrollTop = listElement.scrollTop;
        const scrollHeight = listElement.scrollHeight;
        const clientHeight = listElement.clientHeight;
        const scrollDirection = scrollTop > prevScrollY.current ? 'down' : 'up';
        const step = 20;

        if (scrollDirection === 'down' && scrollTop + clientHeight >= scrollHeight) {
            // Scrolling down and reached the bottom of the list, increase offset by step
            setOffset((prevOffset) => prevOffset + step);
        } else if (scrollDirection === 'up' && scrollTop === 0) {
            // Scrolling up and reached the top of the list, decrease offset by step
            setOffset((prevOffset) => Math.max(0, prevOffset - step));
        }

        prevScrollY.current = scrollTop;
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const handleInputChange = debounce(
        (event: React.SyntheticEvent<Element, Event>, value: string) => {
            if (event) event.preventDefault();
            console.log({ value })
            setAutoValue(value);
            if (!value) setOffset(0);
        }, 100
    );

    console.log({ autoList })
    const handleAutoCompletedChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: AutoCompleteOption[]
    ) => {
        if (!newValue) return;

        const autuLabels: string[] = newValue.map((ele) => ele.value);
        dispatch(setAutoLabel(autuLabels));
        setSelectedValue(newValue as AutoCompleteOption[]);
        const existingFilterObjectString = localStorage.getItem('filterObject');
        let existingFilters: Filter[] = [];

        if (existingFilterObjectString) {
            existingFilters = JSON.parse(existingFilterObjectString).filter || [];
        }

        const existingFilterIndex = existingFilters.findIndex(
            (filter) => filter.varName === varName
        );

        // Type guard to check if autuLabels is an array before accessing its length property
        if (Array.isArray(newValue) && newValue.length > 0) {
            if (existingFilterIndex !== -1) {
                existingFilters[existingFilterIndex].searchTerm = [...autuLabels]; //[...newValue];
            } else {
                existingFilters.push({
                    varName: varName,
                    searchTerm: autuLabels, //newValue,
                    op: 'in',
                });
            }
        } else if (
            existingFilterIndex !== -1 &&
            Array.isArray(existingFilters[existingFilterIndex].searchTerm) &&
            existingFilters[existingFilterIndex].searchTerm
        ) {
            existingFilters[existingFilterIndex].searchTerm = [];
        }
        const filteredFilters = existingFilters.filter((filter) => {
            return !Array.isArray(filter.searchTerm) || filter.searchTerm.length > 0;
        });
        dispatch(setFilterObject(filteredFilters));
        const filterObjectUpdate = {
            filter: filteredFilters,
        };
        const filterObjectString = JSON.stringify(filterObjectUpdate);
        localStorage.setItem('filterObject', filterObjectString);

        // Move selected value to the top of autoList
        const updatedAutoList = autoList.filter((item) => !autuLabels.includes(item.value));
        const selectedValueItem = newValue.map((item) => ({
            value: item.value,
        }));
        setAutoLists([...selectedValueItem, ...updatedAutoList]);
    };
    const renderGroup = (params: any) => [
        <ListSubheader key={params.key} component="div">
            {params.group}
        </ListSubheader>,
        params.children,
    ];
    const optionRenderer = (
        props: React.HTMLAttributes<HTMLLIElement>,
        option: AutoCompleteOption,
        { selected }: AutocompleteRenderOptionState
    ) => {
        return (
            <li {...props} key={`${option.value}`}>
                <Checkbox
                    color="primary"
                    icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="small" />}
                    checkedIcon={<CheckIcon fontSize="small" />}
                    checked={selected}
                />
                {getOptionLabel(option)}
            </li>
        );
    };

    const getOptionLabel = (option: AutoCompleteOption) => {
        const textContent = new DOMParser().parseFromString(
            option.value ?? '',
            'text/html'
        ).body.textContent;
        return textContent ?? '';
    };

    return (
        <InfiniteScroll
            dataLength={autoList.length}
            loader={<p>Loading...</p>}
            // next={() => {
            //     setOffset(offset + limit)
            // }}
            next={fetchMoreDataList}
            scrollThreshold={0.9}
            endMessage={<p>No more items</p>}
            hasMore={hasMore}
        >
            <Autocomplete
                loading
                disableCloseOnSelect
                // ListboxComponent={CustomAutoListboxComponent}
                multiple
                autoHighlight
                id="auto-list"
                style={{ width: 450 }}
                options={autoList}
                getOptionLabel={getOptionLabel}
                ListboxProps={{ style: { overscrollBehaviorX: 'none' } }}
                isOptionEqualToValue={(option, value) => {
                    return option.value === value.value;
                }}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            color="primary"
                            icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="small" />}
                            checkedIcon={<CheckIcon fontSize="small" />}
                            checked={selected}
                        />
                        {option.value}
                    </li>
                )}
                onInputChange={handleInputChange}
                inputValue={autoValue}
                value={selectedValue}
                onChange={handleAutoCompletedChange}
                renderGroup={renderGroup}
                PaperComponent={({ children }) => (
                    <Paper className="auto-options-list">{children}</Paper>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label={
                            <Typography variant="body1" style={{ fontSize: 14 }} height={50}>
                                field
                            </Typography>
                        }
                        placeholder="SelectedOptions"
                        style={{ marginTop: 20 }}
                    />
                )}
            />
        </InfiniteScroll>
    );
}
