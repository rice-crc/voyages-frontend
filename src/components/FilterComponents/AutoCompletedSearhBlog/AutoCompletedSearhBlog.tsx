import { useEffect, useRef, useState } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { setBlogAutoLists, setSearchAutoValue } from '@/redux/getBlogDataSlice';
import { ResultAutoList } from '@/share/InterfaceTypesBlog';
import SelectBlogDropdown from '../../SelectorComponents/SelectDrowdown/SelectBlogDropdown';
import { useNavigate, useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { resetAll } from '@/redux/resetAllSlice';
import { formatTextURL } from '@/utils/functions/formatText';
import { usePageRouter } from '@/hooks/usePageRouter';
import { Filter, IRootFilterObject } from '@/share/InterfaceTypes';
import { useAutoBlogList } from '@/hooks/useAutoBlogList';

const AutoCompletedSearhBlog = () => {
  const { tagID } = useParams();
  const autocompleteRef = useRef(null);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { searchTitle, searchAutoKey, searchAutoValue, blogAutoLists } =
    useSelector((state: RootState) => state.getBlogData);
    const { languageValue} = useSelector(
      (state: RootState) => state.getLanguages
    );
  const { currentBlockName, blogURL } = usePageRouter();
  const [inputValue, setInputValue] = useState<
    ResultAutoList | undefined | null
  >(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFetchHashLoad, setFetchHashLoad] = useState(true);
  const [listData, setListData] = useState<ResultAutoList[]>([]);
  const limit = 10;
  const offset = 0;

  const filters: Filter[] = [{
      op:"exact",
      varName:"language",
      searchTerm: languageValue
    }
  ];
 
  const dataSend: IRootFilterObject = {
    varName: searchAutoKey,
    querystr: searchAutoValue,
    offset: offset,
    limit: limit,
    filter: filters,
  };

  const { data, isLoading, isError } = useAutoBlogList(dataSend);
  useEffect(() => {
    if (!isLoading && !isError && data) {
      const { suggested_values } = data;
      dispatch(setBlogAutoLists(suggested_values));
      if (isFetchHashLoad) {
        setListData(suggested_values);
      }
    }
    return () => {
      dispatch(setBlogAutoLists([]));
    };
  }, [data, isLoading, isError]);

  useEffect(() => {
    if (isInitialLoad) {
      const tagLabel = blogAutoLists.find(
        (item: any) => item.id === Number(tagID)
      );
      if (tagLabel) {
        setInputValue(tagLabel);
      }
      setIsInitialLoad(false);
    }
  }, [dispatch, searchAutoKey, searchAutoValue, tagID, isInitialLoad]);

  useEffect(() => {
    if (isFetchHashLoad && currentBlockName && listData.length > 0) {
      const tagLabel = listData.find((item) => {
        return formatTextURL(item.value) === currentBlockName;
      });

      if (tagLabel) {
        setInputValue(tagLabel);
        setFetchHashLoad(false);
      }
    }
  }, [currentBlockName, isFetchHashLoad, listData, inputValue]);

  const handleInputChangeDebounced = debounce(
    (event: React.SyntheticEvent<Element, Event>, value: string) => {
      dispatch(setSearchAutoValue(value));
    },
    200
  );

  const handleAutocompleteChange = (
    event: React.SyntheticEvent,
    newValue: ResultAutoList | null
  ) => {
    setInputValue(newValue || null);
    if (tagID) {
      navigate(`/${BLOGPAGE}`);
    }
    if (newValue) {
      if (newValue.value === 'Introductory Maps') {
        navigate(`/${BLOGPAGE}/tag/${formatTextURL('all Intro Maps')}`);
      } else {
        navigate(`/${BLOGPAGE}/tag/${formatTextURL(newValue.value)}`);
      }
    }
  };

  const handleReset = () => {
    setListData([]);
    setInputValue(null);
    dispatch(resetAll());
    dispatch(setSearchAutoValue(''));
  };

  return (
    <>
      <SelectBlogDropdown handleReset={handleReset} />
      <Stack spacing={1} className="autocomplete-blog-search">
        <Autocomplete
          ref={autocompleteRef}
          multiple={false}
          id="tags-outlined"
          options={blogAutoLists}
          getOptionLabel={(option) => option.value || '--'}
          onInputChange={handleInputChangeDebounced}
          value={inputValue}
          onChange={handleAutocompleteChange}
          inputValue={searchAutoValue}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                <Typography
                  variant="body1"
                  style={{
                    fontSize: 16,
                  }}
                  color="#ffffff"
                >
                  Search by {searchTitle}
                </Typography>
              }
              InputLabelProps={{ style: { textAlign: 'center' } }}
              InputProps={{
                ...params.InputProps,
                className: 'input-blog-autosearch',
              }}
              placeholder={searchTitle}
              style={{ padding: 8 }}
            />
          )}
        />
      </Stack>
    </>
  );
};

export default AutoCompletedSearhBlog;
