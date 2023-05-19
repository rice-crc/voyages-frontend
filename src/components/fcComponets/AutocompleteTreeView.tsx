import { FunctionComponent, useEffect, useState } from "react";
import { AppDispatch, RootState } from '../../redux/store';
import DropdownTreeSelect, { TreeNode } from "react-dropdown-tree-select";
import { useDispatch, useSelector } from "react-redux";
import "./table.css";
import "react-dropdown-tree-select/dist/styles.css";
import autoData from '../../utils/example_menu_structure.json' // WILL GET TO NEW API
import { fetchAutoComplete } from "../../fetchAPI/fetchAutoCompleted";
import {  Stack  } from '@mui/material';
interface AutocompleteBoxProps {
  keyOptions: string
}
const AutocompleteBox: FunctionComponent<AutocompleteBoxProps> = (props) => {
  const { keyOptions } = props;
  const [autoList, setAutoLists] = useState<string[]>([])
  const [searchAuto, setSearchAuto] = useState<string[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const dispatch: AppDispatch = useDispatch();

  // const { results } = useSelector((state: RootState) => state.autoCompleteList as AutoCompleteSliceLists)

  useEffect(() => {
    const formData: FormData = new FormData();
    formData.append(keyOptions, '');
    dispatch(fetchAutoComplete(formData))
      .unwrap()
      .then((response: any) => {
        if (response) {
          // console.log('response-->', response)
          setAutoLists(response?.results[0])
        }
      })
      .catch((error: any) => {
        console.log('error', error)
      });
  }, [dispatch, keyOptions]);

  const onChange = (currentNode: TreeNode, selectedNodes: TreeNode[]) => {
    console.log("path::", currentNode);
    console.log("selectedNodes::", selectedNodes);
  };
  const listsAutoComplete = []
  Object.entries(autoData).forEach(([key, value]: [string, any], index: number) => {
    console.log('key-->', key)
    console.log('value-->', value)
    
});

  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <DropdownTreeSelect data={autoData} onChange={onChange} className="mdl-demo" />
    </Stack>

  );
};

export default AutocompleteBox;
