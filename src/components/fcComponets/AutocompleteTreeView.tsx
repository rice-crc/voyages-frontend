import { FunctionComponent, useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import DropdownTreeSelect, { TreeNode } from "react-dropdown-tree-select";
import { useDispatch, useSelector } from "react-redux";
import "./table.css";
import "react-dropdown-tree-select/dist/styles.css";
import autoData from "@/utils/transatlantic_voyages_filter_menu.json"; // WILL GET TO NEW API
import { fetchAutoComplete } from "@/fetchAPI/fetchAutoCompleted";
import { Stack } from "@mui/material";
interface AutocompleteBoxProps {
  keyOptions: string;
}
const AutocompleteBox: FunctionComponent<AutocompleteBoxProps> = (props) => {
  const { keyOptions } = props;
  const [autoList, setAutoLists] = useState<string[]>([]);
  const [searchAuto, setSearchAuto] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const formData: FormData = new FormData();
    formData.append(keyOptions, "");
    dispatch(fetchAutoComplete(formData))
      .unwrap()
      .then((response: any) => {
        if (response) {
          setAutoLists(response?.results[0]);
        }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  }, [dispatch, keyOptions]);

  const onChange = (currentNode: TreeNode, selectedNodes: TreeNode[]) => {
    console.log("path::", currentNode);
    console.log("selectedNodes::", selectedNodes);
  };

  Object.entries(autoData).forEach(
    ([key, value]: [string, any], index: number) => {
      console.log("key-->", key);
      console.log("value-->", value);
    }
  );

  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <DropdownTreeSelect
        data={autoData}
        onChange={onChange}
        className="mdl-demo"
      />
    </Stack>
  );
};

export default AutocompleteBox;
