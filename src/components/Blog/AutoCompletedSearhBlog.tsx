import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { setBlogAutoLists, setSearchAutoValue } from '@/redux/getBlogDataSlice';
import { fetchBlogAutoCompleted } from '@/fetchAPI/blogApi/fetchBlogAutoCompleted';
import { ResultAutoList } from '@/share/InterfaceTypesBlog';
import SelectBlogDropdown from './SelectBlogDropdown';

const AutoCompletedSearhBlog = () => {
  const dispatch: AppDispatch = useDispatch();
  const { searchTitle, searchAutoKey, searchAutoValue, blogAutoLists } =
    useSelector((state: RootState) => state.getBlogData);
  const [inputValue, setInputValue] = useState<ResultAutoList | ''>('');

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
    return () => {
      subscribed = false;
    };
  }, [dispatch, searchAutoKey, searchAutoValue]);

  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    dispatch(setSearchAutoValue(value));
  };
  const handleAutocompleteChange = (
    event: React.SyntheticEvent,
    newValue: ResultAutoList | null
  ) => {
    setInputValue(newValue || '');
  };
  const handleReset = () => {
    setInputValue('');
  };
  return (
    <>
      <SelectBlogDropdown handleReset={handleReset} />
      <Stack spacing={1} className="autocomplete-blog-search">
        <Autocomplete
          multiple={false}
          id="tags-outlined"
          options={blogAutoLists}
          getOptionLabel={(option) => option.label || '--'}
          onInputChange={handleInputChange}
          value={inputValue === '' ? null : inputValue}
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
