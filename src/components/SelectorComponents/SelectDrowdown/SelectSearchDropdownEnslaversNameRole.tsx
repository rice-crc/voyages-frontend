import {
  Box,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Chip,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import { ReactNode } from 'react';
import { FilterObjectsState, RolesFilterProps, RolesProps, TYPESOFDATASET, TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';
import { getBoderColor } from '@/utils/functions/getColorStyle';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setListEnslavers } from '@/redux/getRangeSliderSlice';



export const SelectSearchDropdownEnslaversNameRole = () => {
  const dispatch: AppDispatch = useDispatch();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    disableScrollLock: true,
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  const { enslaversNameAndRole, listEnslavers } = useSelector((state: RootState) => state.rangeSlider as FilterObjectsState);

  const handleSelectedRoleAndName = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    dispatch(setListEnslavers(value as string[]));
  }

  return (
    <Box >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" style={{ color: '#000' }}>{'Selected'}</InputLabel>
        <Select
          MenuProps={MenuProps}
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          label={'Selected'}
          value={listEnslavers as string[]}
          name="y_vars"
          onChange={handleSelectedRoleAndName}
          input={
            <OutlinedInput id="select-multiple-chip" label={'Selected'} />
          }
          renderValue={(value): ReactNode => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', color: 'red', fontSize: '0.75rem' }}>
              {value.map((option: string, index: number) => {
                return (
                  <Chip
                    style={{
                      margin: 2,
                      border: getBoderColor(styleName),
                      color: '#000',
                    }}
                    key={`${option}-${index}`}
                    label={option}
                  />
                );
              })}
            </Box>
          )}
        >
          {enslaversNameAndRole?.map((option: RolesProps, index: number) => {
            return (
              <MenuItem
                key={`${option.label}-${index}`}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </Box>
  );
};
