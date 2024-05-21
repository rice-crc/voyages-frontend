import {
  Chip,
  Typography,
  TextField,
  Autocomplete,
} from '@mui/material';
import { ReactNode, SyntheticEvent } from 'react';
import { FilterObjectsState, RolesProps } from '@/share/InterfaceTypes';
import { getBoderColor } from '@/utils/functions/getColorStyle';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setListEnslavers } from '@/redux/getRangeSliderSlice';



export const SelectSearchDropdownEnslaversNameRole = () => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  const { enslaversNameAndRole, listEnslavers } = useSelector((state: RootState) => state.rangeSlider as FilterObjectsState);

  const handleSelectedRoleAndName = (event: SyntheticEvent<Element, Event>,
    newValue: RolesProps[]) => {
    if (!newValue) return;
    dispatch(setListEnslavers(newValue));
  }

  return (
    <Autocomplete
      disableCloseOnSelect
      options={enslaversNameAndRole as RolesProps[]}
      multiple
      value={listEnslavers}
      onChange={handleSelectedRoleAndName}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={
            <Typography variant="body1" style={{ fontSize: 14 }} height={50}>
              Role Selections
            </Typography>
          }
          placeholder="SelectedOptions"
          style={{ marginTop: 20 }}
        />
      )}
      renderTags={(value: readonly RolesProps[], getTagProps) =>
        value.map((option: RolesProps, index: number) => {
          return (
            <Chip
              label={option.label}
              style={{
                margin: 2,
                border: getBoderColor(styleName),
                color: '#000',
              }}
              {...getTagProps({ index })}
            />
          )
        })
      }
    />
  );
};
