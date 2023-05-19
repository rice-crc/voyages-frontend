import { FunctionComponent, useEffect, useState } from "react";
import { AppDispatch, RootState } from '../redux/store';
import DropdownTreeSelect from "react-dropdown-tree-select";
import { useDispatch, useSelector } from "react-redux";
import "./table.css";
import "react-dropdown-tree-select/dist/styles.css";
import data from "../utils/data.json";
import { fetchAutoComplete } from "../fetchAPI/fetchAutoCompleted";
import { AutoSliceLists } from "../share/TableRangeSliderType";

interface AutocompleteBoxProps {
  keyOptions: string
}
const AutocompleteBox: FunctionComponent<AutocompleteBoxProps> = (props) => {
  const { keyOptions } = props;
  // assignObjectPaths(data);
  const onChange = (currentNode: any, selectedNodes: any) => {
    console.log("path::", currentNode.path);
  };


  const [autoList, setAutoLists] = useState<string[]>([])
  const [searchAuto, setSearchAuto] = useState<string[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const dispatch: AppDispatch = useDispatch();
  const { results } = useSelector((state: RootState) => state.autoCompleteList as AutoSliceLists)
  // console.log('results', results)
  useEffect(() => {
    const formData: FormData = new FormData();
    formData.append(keyOptions, '');
    dispatch(fetchAutoComplete(formData))
      .unwrap()
      .then((response: any) => {
        if (response) {
          setAutoLists(response?.results[0])
        }
      })
      .catch((error: any) => {
        console.log('error', error)
      });
  }, [dispatch, keyOptions]);

  console.log('autoList', autoList)

  const assignObjectPaths = (obj: any, stack: any) => {
    Object.keys(obj).forEach(k => {
      console.log('k', k)
      const node = obj[k];
      if (typeof node === "object") {
        node.path = stack ? `${stack}.${k}` : k;
        assignObjectPaths(node, node.path);
      }
    });
  };
  assignObjectPaths(data, null)
  return (
    <DropdownTreeSelect data={data} onChange={onChange} className="mdl-demo" />
  );
};

export default AutocompleteBox;
