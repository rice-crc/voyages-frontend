import { Autocomplete, Box, Stack, TextField } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import {
    FunctionComponent,
    useEffect,
    useState,
    useMemo,
    SyntheticEvent,
    useRef,
    useCallback,
} from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAutoVoyageComplete } from '@/fetch/voyagesFetch/fetchAutoVoyageComplete';
import {
    AutoCompleteInitialState,
    AutoCompleteOption,
    AutocompleteBoxProps,
    FetchAutoVoyageParams,
    RangeSliderState,
    TYPESOFDATASET,
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
import { IRootObject } from '@/share/InterfaceTypesTable';
import VirtualizedList from "./VirtualizedList";
export default function VirtualizedAutocomplete() {
    const { varName, rangeSliderMinMax: rangeValue } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { styleName } = usePageRouter()
    const { geoTreeValue } = useSelector(
        (state: RootState) => state.getGeoTreeData
    );

    const [page, setPage] = useState(1);
    const limit = 20;
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const { pathNameEnslaved, pathNameEnslavers, pathNameVoyages } = useSelector((state: RootState) => state.getPathName);
    const [offset, setOffset] = useState(0)
    const { autoCompleteValue } = useSelector(
        (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
    );
    const [autoList, setAutoLists] = useState<AutoCompleteOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<AutoCompleteOption[]>([]);
    const [autoValue, setAutoValue] = useState<string>('');

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        let subscribed = true;

        const fetchAutoCompletedList = async () => {

            const dataSend: IRootObject = {
                varname: varName,
                querystr: autoValue,
                offset: offset,
                limit: limit,
                filter: {
                    [varName]: ''// autoValue
                }
            };
            console.log({ dataSend })

            let response = [];

            try {
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

                if (response && subscribed) {
                    setAutoLists(response?.suggested_values || []);
                }
            } catch (error) {
                console.log('error', error);
            }
        };


        fetchAutoCompletedList();
        return () => {
            subscribed = false;
            setAutoLists([]);
        };
    }, [dispatch, varName, autoValue, pathNameEnslaved, pathNameEnslavers, pathNameVoyages, styleName, offset]);


    const handleInputChange = useMemo(
        () => (event: React.SyntheticEvent<Element, Event>, value: string) => {
            event.preventDefault();
            console.log({ value })
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



    console.log({ page, offset })

    const Row: React.FC<ListChildComponentProps> = ({ index, style }) => {
        const option = autoList[index];

        return (
            <div style={style}>
                {option && (
                    <Box component="li" key={`${option.value}-${index}`} sx={{ fontSize: 16 }}
                    >
                        {option.value ? option.value : '--'}
                    </Box>
                )}
            </div>
        );
    };

    return (
        <Stack spacing={3} className="autocomplete-modal-box">
            <Autocomplete
                multiple
                id="tags-outlined"
                options={autoList}
                getOptionLabel={(option) => option.value}
                value={selectedValue}
                onChange={handleAutoCompletedChange}
                onInputChange={handleInputChange}
                renderInput={(props) => <TextField {...props} />}
                ListboxProps={{

                    onScroll: (event) => { }
                }}

                ListboxComponent={() => (

                    <FixedSizeList
                        height={300}
                        width={'100%'}
                        itemCount={autoList.length}
                        itemSize={50}
                        overscanCount={20}
                        onItemsRendered={({ overscanStopIndex }) => {

                            console.log({ overscanStopIndex })

                            // if (overscanStopIndex === autoList.length - 1) {
                            //     // console.log({ overscanStopIndex })
                            //     loadMoreItems();
                            // }
                        }}
                    >
                        {Row}
                    </FixedSizeList>
                )}

            />
            {/* <VirtualizedList
                height={300}
                width={'100%'}
                options={autoList}
                itemSize={50} /> */}

        </Stack>
    );
}


// ListboxComponent={() => {
//     return (
//         <VirtualizedList
//             options={autoList}
//             height={300}
//             width={'100%'}
//             itemSize={limit} />
//     )
// }}
// import { Autocomplete, Box, TextField } from '@mui/material';
// import { FixedSizeList } from 'react-window';
// import { useState } from 'react';

// const options = [
//     { label: 'Option 1', value: 'option1' },
//     { label: 'Option 2', value: 'option2' },
//     // Add more options as needed
// ];

// const VirtualizedAutocomplete = () => {
//     const [selectedOption, setSelectedOption] = useState(null);

//     const Row = ({ index }: { index: number }) => {
//         const item = options[index];

//         return (
//             <Box component="li" sx={{ fontSize: 16 }}>
//                 {item.value}
//             </Box>
//         );
//     };

//     return (
//         <div style={{ width: 300 }}>
//             <Autocomplete
//                 value={selectedOption}

//                 options={options}
//                 getOptionLabel={(option) => option.label}
//                 renderInput={(params) => (
//                     <TextField
//                         {...params}
//                         label="Select an option"
//                         variant="outlined"
//                     />
//                 )}
//             />
//             <FixedSizeList
//                 height={200}
//                 width="100%"
//                 itemSize={50}
//                 itemCount={options.length}
//             >
//                 {Row}
//             </FixedSizeList>
//         </div>
//     );
// };

// export default VirtualizedAutocomplete;
