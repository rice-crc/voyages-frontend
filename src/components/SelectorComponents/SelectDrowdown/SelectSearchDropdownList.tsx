import {
  Chip,
  Typography,
  TextField,
  Autocomplete,
} from '@mui/material';
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';
import { Filter, FilterObjectsState, MultiselectListProps } from '@/share/InterfaceTypes';
import { getBoderColor } from '@/utils/functions/getColorStyle';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchNationalityList } from '@/fetch/voyagesFetch/fetchNationalityList';
import { updateNationalityObject } from '@/utils/functions/updateNationalityObject';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setFilterObject } from '@/redux/getFilterSlice';
import { fetchResistanceList } from '@/fetch/voyagesFetch/fetchResistanceList';
import { varNameOfFlagOfVessel, varNameOfFlagOfVesselIMP, varNameOfResistance, varNameParticularCoutComeList, varNameRigOfVesselList, varNameOwnerOutcomeList } from '@/share/CONST_DATA';
import { fetchParticularOutcomeList } from '@/fetch/voyagesFetch/fetchParticularOutcomeList';
import { fetchRigOfVesselList } from '@/fetch/voyagesFetch/fetchRigOfVesselList';
import { fetchOwnerOutcomeList } from '@/fetch/voyagesFetch/fetchOwnerOutcomeList';

interface SelectSearchDropdownListProps {
}

export const SelectSearchDropdownList: FunctionComponent<SelectSearchDropdownListProps> = () => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState
  );
  const { styleName: styleNameRoute } = usePageRouter();
  const [multipleList, setMultipleList] = useState<MultiselectListProps[]>([]);
  const [multipleOptionsList, setMultipleOptionsList] = useState<MultiselectListProps[]>([]);

  const fetchFunctionMapping: Record<string, () => Promise<any>> = {
    [varNameOfFlagOfVessel]: fetchNationalityList,
    [varNameOfFlagOfVesselIMP]: fetchNationalityList,
    [varNameOwnerOutcomeList]: fetchOwnerOutcomeList,
    [varNameParticularCoutComeList]: fetchParticularOutcomeList,
    [varNameOfResistance]: fetchResistanceList,
    [varNameRigOfVesselList]: fetchRigOfVesselList,
  };

  const fetchNationalityData = async () => {
    const fetchFunction = fetchFunctionMapping[varName];
    if (!fetchFunction) return;

    try {
      const response = await fetchFunction();
      if (response) {
        const { data } = response;
        setMultipleOptionsList(data);
      }
    } catch (error) {
      console.log('Error fetching nationality data', error);
    }
  };
  // const fetchNationalityData = async () => {
  //   try {
  //     let response;
  //     if (varName === varNameOfFlagOfVessel || varName === varNameOfFlagOfVesselIMP) {
  //       response = await fetchNationalityList()
  //       if (response) {
  //         const { data } = response
  //         setMultipleOptionsList(data)
  //       }
  //     } else if (varName === varNameOfResistance) {
  //       response = await fetchResistanceList()
  //       console.log({ response })
  //       if (response) {
  //         const { data } = response
  //         setMultipleOptionsList(data)
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Error fetchNationalityData', error);
  //   }
  // }

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
    const multipleList: string[] = filterByVarName.searchTerm as string[];
    const values = multipleList.map<MultiselectListProps>((name: string) => ({
      name: name,
    }));
    setMultipleList(values)
    dispatch(setFilterObject(filter));
  }, [varName, styleName]);


  const handleSelected = (
    event: SyntheticEvent<Element, Event>,
    newValue: MultiselectListProps[]
  ) => {
    if (!newValue) return;
    setMultipleList(newValue);
    const valueSelect: string[] = newValue.map((ele) => ele.name);
    updateNationalityObject(dispatch, valueSelect, varName, styleNameRoute!)
  };


  return (
    <Autocomplete
      disableCloseOnSelect
      options={multipleOptionsList as MultiselectListProps[]}
      multiple
      value={multipleList as MultiselectListProps[]}
      onChange={handleSelected}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <div style={{ color: 'red', fontSize: '0.875rem', textAlign: 'left' }}>
          <TextField
            {...params}
            variant="outlined"
            label={
              <Typography variant="body1" style={{ fontSize: 14 }} height={50}>
                Selected nationality
              </Typography>
            }
            placeholder="Selected nationality"
            style={{ marginTop: 20 }}
          />
        </div>
      )}
      renderTags={(value: readonly MultiselectListProps[], getTagProps) =>
        value.map((option: MultiselectListProps, index: number) => (
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
