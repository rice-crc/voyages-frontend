import {
  Chip,
  Typography,
  TextField,
  Autocomplete,
} from '@mui/material';
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';
import { Filter, FilterObjectsState, NationalityListProps } from '@/share/InterfaceTypes';
import { getBoderColor } from '@/utils/functions/getColorStyle';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchNationalityList } from '@/fetch/voyagesFetch/fetchNationalityList';
import { setNationalityList } from '@/redux/getNationalityListSlice';
import { updateNationalityObject } from '@/utils/functions/updateNationalityObject';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setFilterObject } from '@/redux/getFilterSlice';

interface SelectSearchDropdownListProps { }

export const SelectSearchDropdownList: FunctionComponent<SelectSearchDropdownListProps> = () => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState
  );
  const { styleName: styleNameRoute } = usePageRouter();
  const nationalityList = useSelector((state: RootState) => state.getNationalityList.nationalityList);
  const [nationList, setNationList] = useState<NationalityListProps[]>([]);

  const fetchNationalityData = async () => {
    try {
      const response = await fetchNationalityList()
      if (response) {
        const { data } = response
        dispatch(setNationalityList(data))
      }
    } catch (error) {
      console.log('Error fetchNationalityData', error);
    }
  }
  useEffect(() => {
    fetchNationalityData()
    const storedValue = localStorage.getItem('filterObject');

    if (!storedValue) return;
    const parsedValue = JSON.parse(storedValue);
    const filter: Filter[] = parsedValue.filter;
    const filterByVarName =
      filter?.length > 0 &&
      filter.find((filterItem) => filterItem.varName === varName);
    if (!filterByVarName) return;
    const nationList: string[] = filterByVarName.searchTerm as string[];
    const values = nationList.map<NationalityListProps>((name: string) => ({
      name: name,
    }));
    setNationList(values)
    dispatch(setFilterObject(filter));
  }, [varName, styleName]);


  const handleSelected = (
    event: SyntheticEvent<Element, Event>,
    newValue: NationalityListProps[]
  ) => {
    if (!newValue) return;
    setNationList(newValue);
    const valueSelect: string[] = newValue.map((ele) => ele.name);
    updateNationalityObject(dispatch, valueSelect, varName, styleNameRoute!)
  };


  return (
    <Autocomplete
      disableCloseOnSelect
      options={nationalityList as NationalityListProps[]}
      multiple
      value={nationList as NationalityListProps[]}
      onChange={handleSelected}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <div style={{ color: 'red', fontSize: '0.875rem', textAlign: 'left' }}>
          <TextField
            {...params}
            variant="outlined"
            label={
              <Typography variant="body1" style={{ fontSize: 14 }} height={50}>
                Selections
              </Typography>
            }
            placeholder="SelectedOptions"
            style={{ marginTop: 20 }}
          />
        </div>
      )}
      renderTags={(value: readonly NationalityListProps[], getTagProps) =>
        value.map((option: NationalityListProps, index: number) => (
          <Chip
            label={option.name}
            style={{
              margin: 2,
              border: getBoderColor(styleName),
              color: '#000',
            }}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
};
