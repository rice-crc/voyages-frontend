import { Chip, Typography, TextField, Autocomplete } from '@mui/material';
import { FunctionComponent, ReactNode, SyntheticEvent } from 'react';
import { FilterObjectsState, RolesProps } from '@/share/InterfaceTypes';
import { getBoderColor } from '@/utils/functions/getColorStyle';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setListEnslavers } from '@/redux/getRangeSliderSlice';

interface SelectSearchDropdownEnslaversNameRoleProps {
  textRoleListError: string;
  setTextRoleListError: React.Dispatch<React.SetStateAction<string>>;
}

export const SelectSearchDropdownEnslaversNameRole: FunctionComponent<
  SelectSearchDropdownEnslaversNameRoleProps
> = ({ textRoleListError, setTextRoleListError }) => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);

  const { enslaversNameAndRole, listEnslavers } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState
  );

  const handleSelectedRoleAndName = (
    event: SyntheticEvent<Element, Event>,
    newValue: RolesProps[]
  ) => {
    if (!newValue) return;
    if (newValue.length === 0) {
      setTextRoleListError('*Please select the role(s) for this enslaver');
    } else {
      setTextRoleListError('');
    }
    dispatch(setListEnslavers(newValue));
  };

  return (
    <Autocomplete
      disableCloseOnSelect
      options={enslaversNameAndRole as RolesProps[]}
      multiple
      value={listEnslavers}
      onChange={handleSelectedRoleAndName}
      getOptionLabel={(option: RolesProps) => option.label[languageValue]}
      renderInput={(params) => (
        <div style={{ color: 'red', fontSize: '0.875rem', textAlign: 'left' }}>
          <TextField
            {...params}
            variant="outlined"
            label={
              <Typography variant="body1" style={{ fontSize: 14 }} height={50}>
                Role Selections
              </Typography>
            }
            placeholder="SelectedOptions"
          />
          <span style={{ color: 'red', fontSize: '0.875rem', marginLeft: 14 }}>
            {textRoleListError}
          </span>
        </div>
      )}
      renderTags={(value: readonly RolesProps[], getTagProps) =>
        value.map((option: RolesProps, index: number) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={option.label[languageValue]}
              style={{
                margin: 2,
                border: getBoderColor(styleName),
                color: '#000',
              }}
              {...tagProps}
            />
          );
        })
      }
    />
  );
};
