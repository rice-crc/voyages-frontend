import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IconButton, List, ListItem, ListItemText, Stack } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { TextFieldSearch } from '@/styleMUI';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchGlobalApi } from '@/fetchAPI/homeApi/fetchSearchGlobal';
import { setSearchGlobalData } from '@/redux/getCommonGlobalSearchResultSlice';
import { GlobalSearchProp } from '@/share/InterfaceTypesGlobalSearch';
import { getOptionLabelSearchGlobal } from './getOptionLabelSearchGlobal';
import debounce from 'lodash.debounce';
import '@/style/homepage.scss';

const AutoGlobalSearchBar = () => {
  const dispatch: AppDispatch = useDispatch();
  const { data } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const [inputSearchValue, setInputSearchValue] = useState<string>('');
  const [showClearButton, setShowClearButton] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<number | null>(null);
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
    const fetchSearchGlobal = async (currentRequestId: number) => {
      if (inputSearchValue) {
        const formData: FormData = new FormData();
        formData.append('search_string', inputSearchValue);
        // Use the signal from useRef as the fetch signal
        const signal = signalRef.current;
        if (!signal) return;
        try {
          setIsFetching(true);
          const response = await fetchSearchGlobalApi(formData, signal.signal);
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
      fetchSearchGlobal(requestId);
      setCalledIds(new Set(calledIds).add(requestId));
    }
    return () => {
      dispatch(setSearchGlobalData([]));
    };
  }, [dispatch, inputSearchValue, requestId, calledIds]);

  const handleInputChangeDebounced = useCallback(
    debounce((value: string) => {
      setInputSearchValue(value);
    }, 300), // Adjust the debounce delay here (e.g., 300ms)
    []
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputSearchValue(value);
      setShowClearButton(value !== '');
      handleInputChangeDebounced(value);
      const newRequestId = Date.now();
      setRequestId(newRequestId);

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

  // WAIT : What acction when user Select data
  const handleSelect = (option: GlobalSearchProp | null) => {
    if (option) {
      console.log('Selected:', option.type, option.results_count, option.ids);
    } else {
      console.log('Selected: null');
    }
  };
  const handleClearSearch = () => {
    setInputSearchValue('');
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
          {data.map((option, index) => (
            <List
              key={`${option.type}-${index}`}
              className="list-search-global"
            >
              <ListItem button onClick={() => handleSelect(option)}>
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
