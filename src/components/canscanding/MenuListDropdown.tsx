import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "./Dropdown";
import { AppDispatch, RootState } from "@/redux/store";
import {
  AutoCompleteOption,
  ChildrenFilter,
  RangeSliderState,
  TYPES,
  YoyagaesFilterMenu,
  filterMenu,
} from "@/share/InterfaceTypes";
import {
  BLACK,
  DropdownMenuItem,
  DropdownNestedMenuItem,
  StyleDialog,
} from "@/styleMUI";
import RangeSlider from "../VoyagePage/Results/RangeSlider";
import { useState, MouseEvent } from "react";
import AutocompleteBox from "../VoyagePage/Results/AutocompletedBox";
import { PaperDraggable } from "./PaperDraggable";
import { setIsChange, setKeyValue } from "@/redux/rangeSliderSlice";

export function MenuListDropdown() {
  const menuOptionFlat: YoyagaesFilterMenu = useSelector(
    (state: RootState) => state.optionFlatMenu.value
  );

  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );

  const dispatch: AppDispatch = useDispatch();
  // const [rangeValue, setRangeValue] = useState<Record<string, number[]>>({});

  const [value, setValue] = useState<AutoCompleteOption[]>([]);
  const [label, setLabel] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const handleClickMenu = (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>
  ) => {
    const { value, type, label } = event.currentTarget.dataset;
    if (value && type && label) {
      dispatch(setKeyValue(value));
      setType(type);
      setLabel(label);
      setIsOpenDialog(true);
    }
  };

  const handleCloseDialog = (event: any) => {
    const value = event.cancelable;
    dispatch(setIsChange(!value));
    setIsOpenDialog(false);
    event.stopPropagation();
  };

  const renderDropdownMenu = (children: ChildrenFilter[]) =>
    children.map((childItem: ChildrenFilter, index: number) => (
      <DropdownNestedMenuItem
        onClickMenu={handleClickMenu}
        sx={{ fontSize: 20, paddingTop: 0, paddingBottom: 0 }}
        label={childItem.label}
        key={`${childItem.label}-${index}`}
        varName={childItem.var_name}
        type={childItem.type}
      >
        {childItem.children &&
          childItem.children.length > 0 &&
          childItem.children.map((nodeChild: ChildrenFilter, idx: number) => (
            <DropdownMenuItem
              key={`${nodeChild.label}-${idx}`}
              data-value={nodeChild?.var_name}
              data-type={nodeChild.type}
              data-label={nodeChild.label}
              onClick={handleClickMenu}
              sx={{ fontSize: 20, paddingTop: 0, paddingBottom: 0 }}
            >
              {nodeChild.label}
            </DropdownMenuItem>
          ))}
      </DropdownNestedMenuItem>
    ));

  return (
    <Box>
      {menuOptionFlat.map((item: filterMenu, index: number) => (
        <Dropdown
          key={`${item.label}-${index}`}
          trigger={
            <Button
              sx={{
                color: "#000",
                fontWeight: 500,
                textTransform: "none",
                fontSize: 22,
              }}
            >
              {item.label}
            </Button>
          }
          menu={renderDropdownMenu(item.children)}
        />
      ))}
      <Dialog
        BackdropProps={{ style: { backgroundColor: "transparent" } }}
        sx={StyleDialog}
        open={isOpenDialog}
        onClose={handleCloseDialog}
        PaperComponent={PaperDraggable}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          sx={{ cursor: "move", fontWeight: 600 }}
          id="draggable-dialog-title"
        >
          {label}
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          {varName && type === TYPES.CharField && (
            <AutocompleteBox keyOption={varName} setValue={setValue} />
          )}
          {(type === TYPES.IntegerField || type === TYPES.DecimalField) && (
            <RangeSlider label={label} />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleCloseDialog}
            sx={{ color: BLACK, fontSize: 18, fontWeight: 600 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
