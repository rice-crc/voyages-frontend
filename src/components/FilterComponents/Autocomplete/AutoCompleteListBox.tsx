import React, { useState, useEffect, useRef, UIEventHandler, SyntheticEvent, useCallback } from "react";
import { AutocompleteRenderOptionState } from "@mui/material/Autocomplete";
import { AutoCompleteOption, DataSuggestedValuesProps, Filter, IRootFilterObject, RangeSliderState } from "@/share/InterfaceTypes";
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import { Autocomplete, Checkbox, Typography, TextField } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { useAutoComplete } from "@/hooks/useAutoComplete";
import { filtersDataSend } from "@/utils/functions/filtersDataSend";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { usePageRouter } from "@/hooks/usePageRouter";
import { setFilterObject } from "@/redux/getFilterSlice";
import debounce from "lodash.debounce";
import { setAutoLabel } from "@/redux/getAutoCompleteSlice";

export default function AutoCompleteListBox() {
    const [position, setPosition] = useState<number>(0);
    const listboxNodeRef = useRef<HTMLUListElement | null>(null); // Update type to HTMLUListElement
    const { varName } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { styleName } = usePageRouter();
    const limit = 20;
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const [autoList, setAutoList] = useState<AutoCompleteOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<AutoCompleteOption[]>([]);
    const [autoValue, setAutoValue] = useState<string>('');
    const [offset, setOffset] = useState<number>(0);
    const [page, setPage] = useState(1);

    const dispatch: AppDispatch = useDispatch();

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
            const items = paginate(newAutoList, limit, 1);
            const uniqueValues = new Set<string>();
            items.forEach((value) => uniqueValues.add(value.value));

            // Convert Set back to an array without duplicates
            const filteredAutoList = Array.from(uniqueValues).map((value) => ({
                value,
            }));

            setAutoList((prevAutoList) => {
                const uniquePrevAutoList = prevAutoList.filter(
                    (item) => !uniqueValues.has(item.value)
                );
                return [...uniquePrevAutoList, ...filteredAutoList];
            });
        }

    }, [data, isLoading, isError]);

    useEffect(() => {
        if (listboxNodeRef.current !== null) {
            listboxNodeRef.current.scrollTop = position;
        }
    }, [position, listboxNodeRef]);

    useEffect(() => {
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
    }, [varName, styleName]);

    const loadMoreResults = () => {
        if (!isLoading && !isError && data) {
            const nextPage = page + 1
            setPage(nextPage);
            const newOffset = nextPage * limit;
            setOffset(newOffset);
            const { suggested_values } = data as DataSuggestedValuesProps;
            const newAutoList: AutoCompleteOption[] = suggested_values.map(
                (value: AutoCompleteOption) => value
            );
            const items = paginate(newAutoList, limit, nextPage);
            setAutoList((prevAutoList) => [...prevAutoList, ...items]);
        }
    }

    const handleScroll: UIEventHandler<HTMLUListElement> = (event) => {
        const { currentTarget } = event;
        const position = currentTarget.scrollTop + currentTarget.clientHeight;
        if (currentTarget.scrollHeight - position <= 1) {
            setPosition(position);
            loadMoreResults();
        }
    };

    const handleInputChange = debounce(
        (event: React.SyntheticEvent<Element, Event>, value: string) => {
            if (event) {
                event.preventDefault();
            }
            setAutoValue(value);
            if (!value) {
                setOffset((prev) => prev - offset);
            }
        }, 100
    );
    const handleAutoCompletedChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: AutoCompleteOption[]
    ) => {
        if (!newValue) return;

        const autuLabels: string[] = newValue.map((ele) => ele.value);
        dispatch(setAutoLabel(autuLabels));
        setSelectedValue(newValue as AutoCompleteOption[]);
        //Update filter and save to localStorage
        updateFilter(autuLabels);
    };

    const updateFilter = (autuLabels: string[]) => {
        const existingFilterObjectString = localStorage.getItem('filterObject');
        let existingFilters: Filter[] = [];

        if (existingFilterObjectString) {
            existingFilters = JSON.parse(existingFilterObjectString).filter || [];
        }

        const existingFilterIndex = existingFilters.findIndex(
            (filter) => filter.varName === varName
        );

        // Type guard to check if autuLabels is an array before accessing its length property
        if (Array.isArray(autuLabels) && autuLabels.length > 0) {
            if (existingFilterIndex !== -1) {
                existingFilters[existingFilterIndex].searchTerm = [...autuLabels];
            } else {
                existingFilters.push({
                    varName: varName,
                    searchTerm: autuLabels,
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
    };
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
        <>
            <Autocomplete
                loading
                disableCloseOnSelect
                options={autoList}
                autoHighlight
                multiple
                id="tags-outlined"
                style={{ width: 450 }}
                onInputChange={handleInputChange}
                inputValue={autoValue}
                value={selectedValue}
                getOptionLabel={getOptionLabel}
                renderOption={optionRenderer}
                onChange={handleAutoCompletedChange}
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
                ListboxProps={{
                    onScroll: handleScroll,
                }}
            />
        </>
    );
}

function paginate<T>(array: T[], page_size: number, page_number: number): T[] {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
