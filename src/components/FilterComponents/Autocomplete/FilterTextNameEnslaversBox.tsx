import { ChangeEvent, FunctionComponent } from 'react';

import { TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { setEnslaversName } from '@/redux/getRangeSliderSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { FilterObjectsState } from '@/share/InterfaceTypes';
import '@/style/styles.scss';

interface FilterTextNameEnslaversProps {
  textError: string;
  setTextError: React.Dispatch<React.SetStateAction<string>>;
}
const FilterTextNameEnslaversBox: FunctionComponent<
  FilterTextNameEnslaversProps
> = ({ textError, setTextError }) => {
  const dispatch: AppDispatch = useDispatch();
  const { enslaverName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    dispatch(setEnslaversName(newValue));
    if (newValue.length === 0) {
      setTextError(`*Please enter the Ship, nation, enslavers.`);
      dispatch(setEnslaversName(''));
    } else {
      setTextError('');
    }
  };

  const handleKeyDownTextFilter = (value: string) => {
    if (value.length === 0) {
      setTextError(`*Please enter the Ship, nation, enslavers.`);
    } else {
      dispatch(setEnslaversName(value));
      setTextError('');
    }
  };
  const handleFocus = () => {
    if (enslaverName.length === 0) {
      setTextError(`*Please enter the Ship, nation, enslavers.`);
    }
  };

  return (
    <div className="filter-text-box">
      <TextField
        variant="outlined"
        fullWidth
        size="small"
        value={enslaverName}
        onChange={handleTextInputChange}
        onFocus={handleFocus}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleKeyDownTextFilter(enslaverName);
          }
        }}
        label={
          <Typography variant="body1" style={{ fontSize: 14 }} height={50}>
            Name
          </Typography>
        }
        placeholder="Last Name, First Name"
        style={{ marginTop: 20, width: 450 }}
        helperText={textError}
        FormHelperTextProps={{
          style: {
            color: 'red',
            fontSize: '0.875rem',
          },
        }}
      />
    </div>
  );
};

export default FilterTextNameEnslaversBox;
