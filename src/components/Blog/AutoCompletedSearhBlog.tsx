import { useCallback, useEffect, useRef, useState } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { setBlogAutoLists, setSearchAutoValue } from '@/redux/getBlogDataSlice';
import { fetchBlogAutoCompleted } from '@/fetchAPI/blogApi/fetchBlogAutoCompleted';
import { ResultAutoList } from '@/share/InterfaceTypesBlog';
import SelectBlogDropdown from './SelectBlogDropdown';
import { useNavigate, useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { BLOGPAGE } from '@/share/CONST_DATA';

const AutoCompletedSearhBlog = () => {
  const { tagID } = useParams();
  const autocompleteRef = useRef(null);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { searchTitle, searchAutoKey, searchAutoValue, blogAutoLists } =
    useSelector((state: RootState) => state.getBlogData);

  const [inputValue, setInputValue] = useState<ResultAutoList | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    let subscribed = true;
    const formData: FormData = new FormData();
    formData.append(searchAutoKey, searchAutoValue);

    const fetchAutoBlogList = async () => {
      try {
        const response = await dispatch(
          fetchBlogAutoCompleted(formData)
        ).unwrap();

        if (subscribed && response) {
          dispatch(setBlogAutoLists(response?.results));
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
  };

  const handleReset = () => {
    setInputValue(null);
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
