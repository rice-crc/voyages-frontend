import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Dropdown } from "./Dropdown";
import { RootState } from "../../redux/store";
import {
  AutoCompleteOption,
  ChildrenFilter,
  TYPES,
  YoyagaesFilterMenu,
  filterMenu,
} from "../../share/InterfaceTypes";
import {
  DropdownMenuItem,
  DropdownNestedMenuItem,
  StyleDialog,
} from "../../styleMUI";
import RangeSlider from "../RangeSlider";
import { useState, MouseEvent, useEffect, useCallback, useRef } from "react";
import AutocompleteBox from "../AutocompletedBox";
import { PaperDraggable } from "./PaperDraggable";

export function MenuListDropdown() {
  const menuOptionFlat: YoyagaesFilterMenu = useSelector(
    (state: RootState) => state.optionFlatMenu.value
  );
  const [rangeValue, setRangeValue] = useState<Record<string, number[]>>({});
  const [value, setValue] = useState<AutoCompleteOption[]>([]);
  const [label, setLabel] = useState<string>("");
  const [keyValue, setKeyValue] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleClickMenu = (event: React.MouseEvent<HTMLLIElement>) => {
    const { value, type, label } = event.currentTarget.dataset;
    if (value && type && label) {
      setKeyValue(value);
      setType(type);
      setLabel(label);
      setIsOpenDialog(true);
      setMenuOpen(false);
    }
  };

  const handleCloseDialog = (event: any) => {
    setIsOpenDialog(false);
    event.stopPropagation();
    setMenuOpen(false);
  };

  const renderDropdownMenu = (children: ChildrenFilter[]) =>
    children.map((childItem: ChildrenFilter, index: number) => (
      <DropdownNestedMenuItem
        sx={{ fontSize: 20, paddingTop: 0, paddingBottom: 0 }}
        label={childItem.label}
        key={`${childItem.label}-${index}`}
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
          // setIsOpenDropdown={setIsOpenDropdown}
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
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {label}
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          {keyValue && type === TYPES.CharField && (
            <AutocompleteBox keyOption={keyValue} setValue={setValue} />
          )}
          {(type === TYPES.IntegerField || type === TYPES.DecimalField) && (
            <RangeSlider
              keyOption={keyValue}
              label={label}
              setRangeValue={setRangeValue}
              rangeValue={rangeValue}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpenDialog(!isOpenDialog)}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
