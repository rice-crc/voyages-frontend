import { useEffect, useState, useMemo, SyntheticEvent } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, Stack, TextField, Box, Typography } from '@mui/material';
import { AutoCompleteOption } from '@/share/InterfaceTypes';
import '@/style/blogs.scss';
import React from 'react';

const AutoCompletedSearhBlog = () => {
  const dispatch: AppDispatch = useDispatch();
  const [autoList, setAutoLists] = useState<AutoCompleteOption[]>([]);
  const [selectedValue, setSelectedValue] = useState<any>('');
  const [autoValue, setAutoValue] = useState<string>('');
  const { searchTitle, searchValue } = useSelector(
    (state: RootState) => state.getBlogData
  );
  const handleInputChange = useMemo(
    () => (event: React.SyntheticEvent<Element, Event>, value: string) => {
      event.preventDefault();
      setAutoValue(value);
    },
    []
  );

  const handleAutoSearchBlog = (
    event: SyntheticEvent<Element, Event>,
    newValue: AutoCompleteOption[]
  ) => {};

  const OPTIONS = ['aa', 'bb', 'cc', 'dd'];
  return (
    <Stack spacing={1} className="autocomplete-blog-search">
      <Autocomplete
        multiple={false}
        id="tags-outlined"
        options={OPTIONS}
        value={selectedValue}
        onChange={handleAutoSearchBlog}
        onInputChange={handleInputChange}
        inputValue={autoValue}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option} sx={{ fontSize: 16 }}>
            {option ? option : '--'}
          </Box>
        )}
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
              >
                Search by {searchTitle}
              </Typography>
            }
            InputLabelProps={{ style: { textAlign: 'center' } }} // Set text alignment to center
            InputProps={{
              ...params.InputProps,
              style: {
                borderRadius: 5,
                height: 38,
              },
            }}
            placeholder={searchTitle}
            style={{ padding: 8 }}
          />
        )}
      />
    </Stack>
  );
};

export default AutoCompletedSearhBlog;
