import { FunctionComponent, useEffect, useState, useMemo } from "react";
import { AppDispatch } from '../redux/store';
import { useDispatch } from "react-redux";
import { fetchAutoComplete } from "../fetchAPI/fetchAutoCompleted";
import { Autocomplete, Stack, TextField, Box } from '@mui/material';
import "../style/table.css";
import "react-dropdown-tree-select/dist/styles.css";
import { AutoCompleteOption } from "../share/InterfaceTypes";

interface AutocompleteBoxProps {
  keyOption: string;
  value?: AutoCompleteOption[];
  setValue: React.Dispatch<React.SetStateAction<AutoCompleteOption[]>>

}

const AutocompleteBox: FunctionComponent<AutocompleteBoxProps> = (props) => {
  const { keyOption, setValue } = props;
  const [autoList, setAutoLists] = useState<AutoCompleteOption[]>([]);
  const [selectedValue, setSelectedValue] = useState<AutoCompleteOption[]>([]);
  const [autoValue, setAutoValue] = useState<string>('');

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const formData: FormData = new FormData();
    formData.append(keyOption, autoValue);
    dispatch(fetchAutoComplete(formData))
      .unwrap()
      .then((response: any) => {
        if (response) {
          setAutoLists(response?.results);
        }
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  }, [dispatch, keyOption, autoValue]);

  const handleInputChange = useMemo(() => (event: React.SyntheticEvent<Element, Event>, value: string) => {
    event.preventDefault();
    setAutoValue(value);
  }, []);

  return (
    <Stack spacing={3} sx={{ width: 350 }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={autoList}
        getOptionLabel={(option) => option.label}
        value={selectedValue}
        onChange={(event, newValue) => {
          setSelectedValue(newValue as AutoCompleteOption[]);
          setValue((prevValue) => [...prevValue, ...(newValue as AutoCompleteOption[])]);
        }}
        onInputChange={handleInputChange}
        inputValue={autoValue}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            {option.label}
          </Box>
        )}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="field"
            placeholder="SelectedOptions"
            style={{marginTop: 20}}
          />
        )}
      />
    </Stack>
  );
};

export default AutocompleteBox;
