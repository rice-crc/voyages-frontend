import {
  FunctionComponent,
  useEffect,
  useState,
  useMemo,
  SyntheticEvent,
  useRef,
} from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAutoVoyageComplete } from '@/fetch/voyagesFetch/fetchAutoVoyageComplete';
import { Autocomplete, Stack, TextField, Box, Typography, Popper } from '@mui/material';
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


const AutocompleteBox: FunctionComponent<AutocompleteBoxProps> = (props) => {
  const { varName, rangeSliderMinMax: rangeValue } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { styleName } = usePageRouter()
  const { geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );

  const [page, setPage] = useState(1);
  const limit = 20;
  const listRef = useRef<HTMLUListElement>(null);
  const { pathNameEnslaved, pathNameEnslavers, pathNameVoyages } = useSelector((state: RootState) => state.getPathName);
  const { autoCompleteValue, offset } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const [autoList, setAutoLists] = useState<AutoCompleteOption[]>([]);
  const [selectedValue, setSelectedValue] = useState<AutoCompleteOption[]>([]);
  const [autoValue, setAutoValue] = useState<string>('');

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    let subscribed = true;

    const fetchAutoCompletedList = async () => {
      const dataSend: any = {
        varname: varName,
        querystr: autoValue,
        offset: offset,
        limit: limit,
        filter: {
          [varName]: "" //autoValue --> PASS as Empty String
        }
      };

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
  }, [dispatch, varName, autoValue, pathNameEnslaved, pathNameEnslavers, pathNameVoyages, styleName, offset, page]);


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
      // dispatch(
      //   setAutoCompleteValue({
      //     ...autoCompleteValue,
      //     [varName]: newValue,
      //   })
      // );
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

  return (
    <Stack spacing={3} className="autocomplete-modal-box">
      <Autocomplete
        multiple
        id="tags-outlined"
        options={autoList}
        isOptionEqualToValue={(option, value) => {
          return option.value === value.value;
        }}
        getOptionLabel={(option) => option.value}
        value={selectedValue}
        onChange={handleAutoCompletedChange}
        onInputChange={handleInputChange}
        inputValue={autoValue}
        renderOption={(props, option, index) => {
          return (
            <Box component="li"
              {...props} key={`${option.value}-${index}`}
              sx={{ fontSize: 16 }}
              ref={listRef}
            >
              {option.value ? option.value : '--'}
            </Box>
          )
        }}
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
    </Stack>
  );
};

export default AutocompleteBox;
