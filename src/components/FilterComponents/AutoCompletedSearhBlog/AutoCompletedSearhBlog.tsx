import { useEffect, useRef, useState } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { setBlogAutoLists, setSearchAutoValue } from '@/redux/getBlogDataSlice';
import { fetchBlogAutoCompleted } from '@/fetch/blogFetch/fetchBlogAutoCompleted';
import { ResultAutoList } from '@/share/InterfaceTypesBlog';
import SelectBlogDropdown from '../../SelectorComponents/SelectDrowdown/SelectBlogDropdown';
import { useNavigate, useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { resetAll } from '@/redux/resetAllSlice';
import { formatTextURL } from '@/utils/functions/formatText';
import { usePageRouter } from '@/hooks/usePageRouter';


const AutoCompletedSearhBlog = () => {
  const { tagID } = useParams();
  const autocompleteRef = useRef(null);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { searchTitle, searchAutoKey, searchAutoValue, blogAutoLists } =
    useSelector((state: RootState) => state.getBlogData);
  const { currentBlockName } = usePageRouter();
  const [inputValue, setInputValue] = useState<ResultAutoList | undefined | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFetchHashLoad, setFetchHashLoad] = useState(true);
  const [listData, setListData] = useState<ResultAutoList[]>([])


  useEffect(() => {
    let subscribed = true;
    const dataSend: { [key: string]: string[] } = {
      [searchAutoKey]: [searchAutoValue],
    };

    const fetchAutoBlogList = async () => {
      try {
        const response = await dispatch(
          fetchBlogAutoCompleted(dataSend)
        ).unwrap();

        if (subscribed && response) {
          dispatch(setBlogAutoLists(response?.results));
          if (isFetchHashLoad) {
            setListData(response?.results)
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchAutoBlogList();


    if (isInitialLoad) {
      const tagLabel = blogAutoLists.find((item) => item.id === Number(tagID));
      if (tagLabel) {
        setInputValue(tagLabel);
      }
      setIsInitialLoad(false);
    }
    return () => {
      subscribed = false;
    };
  }, [dispatch, searchAutoKey, searchAutoValue, tagID, isInitialLoad]);

  useEffect(() => {
    if (isFetchHashLoad && currentBlockName && listData.length > 0) {
      const tagLabel = listData.find(
        (item) => formatTextURL(item.label) === currentBlockName
      );
      if (tagLabel) {
        setInputValue(tagLabel);
        setFetchHashLoad(false)
      }
    }
  }, [currentBlockName, isFetchHashLoad, listData, inputValue]);

  const handleInputChangeDebounced = debounce(
    (event: React.SyntheticEvent<Element, Event>, value: string) => {
      dispatch(setSearchAutoValue(value));
    },
    300
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
      navigate(`#${formatTextURL(newValue.label)}`);
    }
  };

  const handleReset = () => {
    setListData([])
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
          getOptionLabel={(option) => option.label || '--'}
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
