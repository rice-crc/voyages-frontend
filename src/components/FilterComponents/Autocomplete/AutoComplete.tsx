import {
  FunctionComponent,
  useEffect,
  useState,
  useMemo,
  SyntheticEvent,
} from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAutoVoyageComplete } from '@/fetch/voyagesFetch/fetchAutoVoyageComplete';
import { Autocomplete, Stack, TextField, Box, Typography } from '@mui/material';
import {
  AutoCompleteInitialState,
  AutoCompleteOption,
  AutocompleteBoxProps,
  RangeSliderState,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';
import {
  setAutoCompleteValue,
  setAutoLabel,
  setIsChangeAuto,
} from '@/redux/getAutoCompleteSlice';
import { fetchPastEnslavedAutoComplete } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedAutoCompleted';
import { AFRICANORIGINS, ALLENSLAVED, ALLENSLAVERS, ALLVOYAGES } from '@/share/CONST_DATA';
import { fetchPastEnslaversAutoCompleted } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversAutoCompleted';
import '@/style/Slider.scss';
import '@/style/table.scss';
import { usePageRouter } from '@/hooks/usePageRouter';

const AutocompleteBox: FunctionComponent<AutocompleteBoxProps> = (props) => {
  const { varName, rangeSliderMinMax: rangeValue } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { styleName } = usePageRouter()
  const { geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const { pathNameEnslaved, pathNameEnslavers, pathNameVoyages } = useSelector((state: RootState) => state.getPathName);
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
      const dataSend: { [key: string]: string[] } = {
        [varName]: [autoValue],
      };

      let response = [];
      try {
        if (pathNameVoyages === TYPESOFDATASET.allVoyages || styleName === TYPESOFDATASET.allVoyages || styleName === TYPESOFDATASET.intraAmerican || styleName === TYPESOFDATASET.transatlantic) {
          response = await dispatch(fetchAutoVoyageComplete(dataSend)).unwrap();
        } else if (pathNameEnslaved === ALLENSLAVED || styleName === ALLENSLAVED || styleName === AFRICANORIGINS) {
          response = await dispatch(
            fetchPastEnslavedAutoComplete(dataSend)
          ).unwrap();
        } else if (pathNameEnslavers === ALLENSLAVERS) {
          response = await dispatch(
            fetchPastEnslaversAutoCompleted(dataSend)
          ).unwrap();
        }
        if (response && subscribed) {
          setAutoLists(response?.results || []);
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
  }, [dispatch, varName, autoValue, pathNameEnslaved, pathNameEnslavers, pathNameVoyages]);

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
          setSelectedValue(autoValueList);
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
      const autuLabel: string[] = newValue.map((ele) => ele.label);
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

  return (
    <Stack spacing={3} className="autocomplete-modal-box">
      <Autocomplete
        multiple
        id="tags-outlined"
        options={autoList}
        isOptionEqualToValue={(option, value) => {
          return option.id === value.id;
        }}
        getOptionLabel={(option) => option.label}
        value={selectedValue}
        onChange={handleAutoCompletedChange}
        onInputChange={handleInputChange}
        inputValue={autoValue}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id} sx={{ fontSize: 16 }}>
            {option.label ? option.label : '--'}
          </Box>
        )}
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
