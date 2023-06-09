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
  VoyagaesFilterMenu,
  FilterMenu,
  currentPageInitialState,
} from "@/share/InterfaceTypes";
import {
  BLACK,
  DropdownMenuItem,
  DropdownNestedMenuItem,
  StyleDialog,
} from "@/styleMUI";
import RangeSlider from "../voyagePage/Results/RangeSlider";
import { useState, MouseEvent } from "react";
import AutocompleteBox from "../voyagePage/Results/AutocompletedBox";
import { PaperDraggable } from "./PaperDraggable";
import { setIsChange, setKeyValue } from "@/redux/rangeSliderSlice";
import { setIsChangeAuto } from "@/redux/getAutoCompleteSlice";
import { setIsOpenDialog } from "@/redux/getScrollPageSlice";

export function MenuListDropdown() {
  const menuOptionFlat: VoyagaesFilterMenu = useSelector(
    (state: RootState) => state.optionFlatMenu.value
  );

  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { isOpenDialog } = useSelector(
    (state: RootState) => state.getScrollPage as currentPageInitialState
  );
  const dispatch: AppDispatch = useDispatch();
  const [label, setLabel] = useState<string>("");
  const [type, setType] = useState<string>("");
  const handleClickMenu = (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>
  ) => {
    const { value, type, label } = event.currentTarget.dataset;
    if (value && type && label) {
      dispatch(setKeyValue(value));
      setType(type);
      setLabel(label);
      dispatch(setIsOpenDialog(true));
    }
  };

  const handleCloseDialog = (event: any) => {
    const value = event.cancelable;
    dispatch(setIsChange(!value));
    dispatch(setIsChangeAuto(!value));
    dispatch(setIsOpenDialog(false));
    event.stopPropagation();
  };

  const renderDropdownMenu = (children?: ChildrenFilter[]) =>
    children?.map((childItem: ChildrenFilter, index: number) => {
      return (
        <DropdownNestedMenuItem
          onClickMenu={handleClickMenu}
          sx={{ fontSize: 18, paddingTop: 0, paddingBottom: 0 }}
          label={childItem.label}
          key={`${childItem.label}-${index}`}
          varName={childItem.var_name}
          type={childItem.type}
          childrenFilter={childItem}
        >
          {childItem.children &&
            childItem.children.length > 0 &&
            childItem.children.map((nodeChild: ChildrenFilter, idx: number) => {
              return (
                <DropdownMenuItem
                  key={`${nodeChild.label}-${idx}`}
                  data-value={nodeChild?.var_name}
                  data-type={nodeChild.type}
                  data-label={nodeChild.label}
                  onClick={handleClickMenu}
                  sx={{ fontSize: 18, paddingTop: 0, paddingBottom: 0 }}
                >
                  {nodeChild.label}
                </DropdownMenuItem>
              );
            })}
        </DropdownNestedMenuItem>
      );
    });
  return (
    <Box>
      {menuOptionFlat.map((item: FilterMenu, index: number) => {
        return item.var_name ? (
          <Button
            key={`${item.label}-${index}`}
            data-value={item.var_name}
            data-type={item.type}
            data-label={item.label}
            onClick={(event: any) => handleClickMenu(event)}
            sx={{
              color: "#000",
              fontWeight: 600,
              textTransform: "none",
              fontSize: 18,
            }}
          >
            {item.label}
          </Button>
        ) : (
          <Dropdown
            key={`${item.label}-${index}`}
            trigger={
              <Button
                sx={{
                  color: "#000",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 18,
                }}
              >
                {item.label}
              </Button>
            }
            menu={renderDropdownMenu(item.children)}
          />
        );
      })}
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
          {varName && type === TYPES.CharField && <AutocompleteBox />}
          {(type === TYPES.IntegerField || type === TYPES.DecimalField) && (
            <RangeSlider />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleCloseDialog}
            sx={{ color: BLACK, fontSize: 16, fontWeight: 600 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
