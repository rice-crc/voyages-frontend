import React, { useEffect, useRef, useState } from 'react';
import { IconButton, List, ListItem, ListItemText, Stack } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { TextFieldSearch } from '@/styleMUI';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchGlobal } from '@/fetch/homeFetch/fetchSearchGlobal';
import { translationHomepage } from '@/utils/functions/translationLanguages';
import {
  setInputSearchValue,
  setRequestId,
  setSearchGlobalData,
  setTypePage,
} from '@/redux/getCommonGlobalSearchResultSlice';
import { GlobalSearchProp } from '@/share/InterfaceTypesGlobalSearch';
import '@/style/homepage.scss';
import { useNavigate } from 'react-router-dom';
import {
  ALLENSLAVEDPAGE,
  ALLVOYAGESPAGE,
  BLOGPAGE,
  DOCUMENTPAGE,
  ENSALVEDPAGE,
  ENSALVERSPAGE,
  GlobalSearchBlogType,
  GlobalSearchEnslavedType,
  GlobalSearchEnslaversType,
  GlobalSearchSourcesType,
  GlobalSearchVoyagesType,
  TRANSATLANTICENSLAVERS,
} from '@/share/CONST_DATA';
import { setCurrentPage } from '@/redux/getScrollPageSlice';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import {
  setCurrentBlockName,
  setCurrentEnslavedPage,
} from '@/redux/getScrollEnslavedPageSlice';
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
  const [showClearButton, setShowClearButton] = useState<boolean>(false);
  const [calledIds, setCalledIds] = useState<Set<number>>(new Set());
  const [isFetching, setIsFetching] = useState(false);
  const signalRef = useRef<AbortController | null>(null);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const translatedSearch = translationHomepage(languageValue);

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
        const dataSend: { [key: string]: string } = {
          search_string: inputSearchValue,
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(setInputSearchValue(value));
    setShowClearButton(value !== '');
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
  };

  const handleSelect = (option: GlobalSearchProp | null) => {
    if (option) {
      const { type } = option;
      dispatch(setTypePage(type));

      if (type === GlobalSearchVoyagesType) {
        dispatch(setCurrentPage(1));
        dispatch(setCurrentBlockName('voyages'));
        navigate(`${ALLVOYAGESPAGE}#voyages`);
      } else if (type === GlobalSearchEnslavedType) {
        dispatch(setCurrentEnslavedPage(1));
        dispatch(setCurrentBlockName('people'));
        navigate(`${ENSALVEDPAGE}${ALLENSLAVEDPAGE}#people`);
      } else if (type === GlobalSearchEnslaversType) {
        dispatch(setCurrentEnslaversPage(1));
        dispatch(setCurrentBlockName('people'));
        navigate(`${ENSALVERSPAGE}${TRANSATLANTICENSLAVERS}#people`);
      } else if (type === GlobalSearchBlogType) {
        navigate(`${BLOGPAGE}`);
      }else if (type === GlobalSearchSourcesType) {
        navigate(`${DOCUMENTPAGE}`);
      }
      localStorage.setItem('global_search', inputSearchValue);
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
        placeholder={translatedSearch.searchInput}
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
                onClick={() => !shouldDisable(option) && handleSelect(option)}
                sx={{ 
                  opacity: shouldDisable(option) ? 0.5 : 1,
                  cursor: shouldDisable(option) ? 'not-allowed' : 'pointer'
                }}
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