import { ChangeEvent, FunctionComponent } from 'react';

import { TextField } from '@mui/material';
import { useDispatch } from 'react-redux';

import { setIsChangeAuto } from '@/redux/getAutoCompleteSlice';
import { setTextFilter } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch } from '@/redux/store';
import { TYPES } from '@/share/InterfaceTypes';
import '@/style/styles.scss';

interface FilterTextProps {
  handleKeyDownTextFilter: (value: string) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  type?: string;
}
const FilterTextBox: FunctionComponent<FilterTextProps> = ({
  handleKeyDownTextFilter,
  inputValue,
  setInputValue,
  type,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    dispatch(setIsChangeAuto(true));

    if (newValue.length === 0) {
      dispatch(setTextFilter(''));
    }
  };

  return (
    <div className="filter-text-box">
      <TextField
        variant="outlined"
        fullWidth
        size="small"
        value={inputValue}
        onChange={handleTextInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            dispatch(setTextFilter(inputValue));
            handleKeyDownTextFilter(inputValue);
          }
        }}
        label={
          type === TYPES.IdMatch ? 'Filter by Voyage ID' : 'Filter by Text'
        }
        style={{ marginTop: 20, width: 450 }}
        InputLabelProps={{
          sx: {
            fontSize: 14,
            color: 'primary.main',
            '&.Mui-focused': {
              color: 'primary.main',
            },
          },
        }}
      />
    </div>
  );
};

export default FilterTextBox;
