import { ChangeEvent, FunctionComponent } from 'react';

import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { setIsChangeAuto } from '@/redux/getAutoCompleteSlice';
import { setTextFilter } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { TYPES } from '@/share/InterfaceTypes';
import '@/style/styles.scss';

interface FilterTextProps {
  handleKeyDownTextFilter: (value: string) => void;
  type?: string;
}
const FilterTextBox: FunctionComponent<FilterTextProps> = ({
  handleKeyDownTextFilter,
  type,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { textFilter } = useSelector(
    (state: RootState) => state.getShowFilterObject,
  );

  const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    dispatch(setTextFilter(newValue));
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
        value={textFilter}
        onChange={handleTextInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleKeyDownTextFilter(textFilter);
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
