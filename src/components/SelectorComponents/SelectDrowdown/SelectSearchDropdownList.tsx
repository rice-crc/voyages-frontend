/* eslint-disable @typescript-eslint/no-explicit-any */
import { SyntheticEvent, useCallback } from 'react';

import { Chip, Typography, TextField, Autocomplete } from '@mui/material';
import { useDispatch } from 'react-redux';

import { useFilterState } from '@/hooks/useFilterState';
import { useOptionsDataMultipleList } from '@/hooks/useOptionsDataMultipleList';
import { useStoredFilters } from '@/hooks/useStoredFilters';
import { AppDispatch } from '@/redux/store';
import { MultiselectListProps } from '@/share/InterfaceTypes';
import { getBoderColor } from '@/utils/functions/getColorStyle';
import { updateNationalityObject } from '@/utils/functions/updateNationalityObject';

export const SelectSearchDropdownList = () => {
  const dispatch: AppDispatch = useDispatch();
  const { varName, labelVarName, filtersObj, styleNameRoute } =
    useFilterState();
  const { multipleList, setMultipleList } = useStoredFilters(varName, dispatch);
  const { multipleOptionsList } = useOptionsDataMultipleList(
    styleNameRoute!,
    varName,
    filtersObj,
  );

  const handleSelectionChange = useCallback(
    (
      event: SyntheticEvent<Element, Event>,
      newValue: MultiselectListProps[],
    ) => {
      if (!newValue) return;

      setMultipleList(newValue);
      const valueSelect: string[] = newValue.map((ele) => ele.name);

      updateNationalityObject(
        dispatch,
        valueSelect,
        varName,
        labelVarName,
        styleNameRoute!,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, varName, labelVarName, styleNameRoute],
  );

  const renderInputField = useCallback(
    (params: any) => (
      <div className="filter-select-box">
        <TextField
          {...params}
          size="small"
          variant="outlined"
          label={
            <Typography variant="body1" style={{ fontSize: 14 }} height={50}>
              Selected {labelVarName}
            </Typography>
          }
          style={{ marginTop: 20 }}
        />
      </div>
    ),
    [labelVarName],
  );

  const renderTags = useCallback(
    (value: readonly MultiselectListProps[], getTagProps: any) =>
      value.map((option: MultiselectListProps, index: number) => {
        const { key, ...tagProps } = getTagProps({ index });

        return (
          <Chip
            key={`${key}-${option.name}-${index}`}
            label={option.name}
            style={{
              margin: 2,
              border: getBoderColor(styleNameRoute!),
              color: '#000',
            }}
            {...tagProps}
          />
        );
      }),
    [styleNameRoute],
  );

  return (
    <Autocomplete
      disableCloseOnSelect
      options={multipleOptionsList}
      multiple
      value={multipleList}
      onChange={handleSelectionChange}
      getOptionLabel={(option) => option.name}
      renderInput={renderInputField}
      renderTags={renderTags}
      renderOption={(props, option, { index }) => (
        <li {...props} key={`${option.name}-${index}`}>
          {option.name}
        </li>
      )}
    />
  );
};
