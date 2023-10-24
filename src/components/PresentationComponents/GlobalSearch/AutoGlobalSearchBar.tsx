import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IconButton, List, ListItem, ListItemText, Stack } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { TextFieldSearch } from '@/styleMUI';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchGlobal } from '@/fetch/homeFetch/fetchSearchGlobal';
import {
  setInputSearchValue,
  setRequestId,
  setSearchGlobalData,
  setTypePage,
} from '@/redux/getCommonGlobalSearchResultSlice';
import { GlobalSearchProp } from '@/share/InterfaceTypesGlobalSearch';

import debounce from 'lodash.debounce';
import '@/style/homepage.scss';
import {
  AutoCompleteInitialState,
  RangeSliderState,
} from '@/share/InterfaceTypes';
import { useNavigate } from 'react-router-dom';
import {
  ALLENSLAVEDPAGE,
  ALLVOYAGESPAGE,
  BLOGPAGE,
  ENSALVEDPAGE,
  ENSALVERSPAGE,
  GlobalSearchBlogType,
  GlobalSearchEnslavedType,
  GlobalSearchEnslaversType,
  GlobalSearchVoyagesType,
  PASTHOMEPAGE,
  VOYAGESPAGE,
} from '@/share/CONST_DATA';
import { setCurrentPage } from '@/redux/getScrollPageSlice';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import { setCurrentEnslavedPage } from '@/redux/getScrollEnslavedPageSlice';
import {
  getOptionLabelSearchGlobal,
  shouldDisable,
} from '@/utils/functions/getOptionLabelSearchGlobal';

const AutoGlobalSearchBar = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { data, inputSearchValue, requestId } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const { rangeSliderMinMax } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );

  const { geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );

  const { autoCompleteValue } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );

  const [showClearButton, setShowClearButton] = useState<boolean>(false);
  const [calledIds, setCalledIds] = useState<Set<number>>(new Set());
  const [isFetching, setIsFetching] = useState(false);
  const signalRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Clean up the signal when the component unmounts
    return () => {
      if (signalRef.current) {
        signalRef.current.abort();
        signalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const fetchSearchGlobalData = async (currentRequestId: number) => {
      if (inputSearchValue) {
        const dataSend: { [key: string]: string[] } = {
          search_string: [inputSearchValue],
        };
        const signal = signalRef.current;
        if (!signal) return;
        try {
          setIsFetching(true);
          const response = await fetchSearchGlobal(dataSend, signal.signal);
          if (response && currentRequestId === requestId) {
            dispatch(setSearchGlobalData(response));
          }
        } catch (error) {
          console.log('error', error);
        } finally {
          setIsFetching(false);
        }
      } else {
        dispatch(setSearchGlobalData([]));
      }
    };
    if (requestId !== null && !calledIds.has(requestId)) {
      fetchSearchGlobalData(requestId);
      setCalledIds(new Set(calledIds).add(requestId));
    }
    return () => {
      dispatch(setSearchGlobalData([]));
    };
  }, [dispatch, inputSearchValue, requestId, calledIds]);

  const handleInputChangeDebounced = useCallback(
    debounce((value: string) => {
      dispatch(setInputSearchValue(value));
    }, 300),
    []
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      dispatch(setInputSearchValue(value));
      setShowClearButton(value !== '');
      handleInputChangeDebounced(value);
      const newRequestId = Date.now();
      dispatch(setRequestId(newRequestId));

      // Cancel any ongoing fetch request using the previous signal
      if (signalRef.current) {
        signalRef.current.abort();
        signalRef.current = null;
      }

      // Create a new signal for the fetch request
      const newSignal = new AbortController();
      signalRef.current = newSignal;
    },
    [handleInputChangeDebounced]
  );

  const handleSelect = (option: GlobalSearchProp | null) => {
    if (option) {
      const { type } = option;
      dispatch(setTypePage(type));

      if (type === GlobalSearchVoyagesType) {
        dispatch(setCurrentPage(2));
        navigate(`${VOYAGESPAGE}${ALLVOYAGESPAGE}`);
      } else if (type === GlobalSearchEnslavedType) {
        dispatch(setCurrentEnslavedPage(2));
        navigate(`${PASTHOMEPAGE}${ENSALVEDPAGE}${ALLENSLAVEDPAGE}`);
      } else if (type === GlobalSearchEnslaversType) {
        dispatch(setCurrentEnslaversPage(2));
        navigate(`${PASTHOMEPAGE}${ENSALVERSPAGE}`);
      } else if (type === GlobalSearchBlogType) {
        navigate(`${BLOGPAGE}`);
      }
      const filterObject = {
        filterObject: {
          ...rangeSliderMinMax,
          ...autoCompleteValue,
          ...geoTreeValue,
          ['global_search']: inputSearchValue,
        },
      };
      const filterObjectString = JSON.stringify(filterObject);
      localStorage.setItem('filterObject', filterObjectString);
    }
  };

  const handleClearSearch = () => {
    dispatch(setInputSearchValue(''));
    setShowClearButton(false);
    dispatch(setSearchGlobalData([]));
  };

  return (
    <>
      <TextFieldSearch
        type="search"
        id="search"
        value={inputSearchValue}
        fullWidth
        placeholder="Search for voyages, people, documents, and essays"
        onChange={handleInputChange}
        InputProps={{
          className: 'input-global-search',
          classes: {
            notchedOutline: 'no-focus-ripple',
          },
          startAdornment: <SearchIcon />,
          endAdornment: (
            <>
              {showClearButton && (
                <IconButton edge="end" onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              )}
            </>
          ),
        }}
      />
      {isFetching && <div>Loading...</div>}
      {data.length > 0 && (
        <Stack className="stack-search-global">
          {data.map((option: GlobalSearchProp, index: number) => (
            <List
              key={`${option.type}-${index}`}
              className="list-search-global"
            >
              <ListItem
                button
                onClick={() => handleSelect(option)}
                disabled={shouldDisable(option)}
              >
                <ListItemText primary={getOptionLabelSearchGlobal(option)} />
              </ListItem>
            </List>
          ))}
        </Stack>
      )}
    </>
  );
};

export default AutoGlobalSearchBar;
