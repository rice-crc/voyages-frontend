import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useSelector } from "react-redux";
import { Dropdown } from "./Dropdown";
import { RootState } from "../../redux/store";
import { AutoCompleteOption, ChildrenFilter, TYPES, YoyagaesFilterMenu, filterMenu } from "../../share/InterfaceTypes";
import { DropdownMenuItem, DropdownNestedMenuItem, StyleDialog } from "../../styleMUI";
import RangeSlider from "../RangeSlider";
import { useState, MouseEvent, useEffect } from "react";
import AutocompleteBox from "../AutocompletedBox";
import { PaperDraggable } from "./PaperDraggable";

export function MenuListDropdown() {
  const menuOptionFlat: YoyagaesFilterMenu = useSelector((state: RootState) => state.optionFlatMenu.value);
  const [rangeValue, setRangeValue] = useState<Record<string, number[]>>({});
  const [value, setValue] = useState<AutoCompleteOption[]>([]);
  const [label, setLabel] = useState<string>('');
  const [keyValue, setKeyValue] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const handleClickMenu = (event: React.MouseEvent<HTMLLIElement>) => {
    const { value, type, label } = event.currentTarget.dataset;
    if (value && type && label) {
      setKeyValue(value);
      setType(type);
      setLabel(label);
      setIsOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };
  
  const renderDropdownMenu = (children: ChildrenFilter[]) =>
    children.map((childItem: ChildrenFilter, index: number) => (
      <DropdownNestedMenuItem
        label={childItem.label}
        key={`${childItem.label}-${index}`}
      >
        {childItem.children && childItem.children.length > 0 && (
          childItem.children.map((nodeChild: ChildrenFilter, idx: number) => (
            <DropdownMenuItem
              key={`${nodeChild.label}-${idx}`}
              data-value={nodeChild?.var_name}
              data-type={nodeChild.type}
              data-label={nodeChild.label}
              onClick={handleClickMenu}
            >
              {nodeChild.label}
            </DropdownMenuItem>
          ))
        )}
      </DropdownNestedMenuItem>
    ));

  return (
    <Box>
      {menuOptionFlat.map((item: filterMenu, index: number) => (
        <Dropdown
          key={`${item.label}-${index}`}
          trigger={
            <Button style={{ color: '#000', textTransform: 'none' }}>
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
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {label}
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
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

// import { Box, Button, Fade, Grid, Paper,Typography,Divider } from "@mui/material";
// import Popper, { PopperPlacementType } from '@mui/material/Popper';
// import { useSelector } from "react-redux";
// import { Dropdown } from "./Dropdown";
// import { RootState } from "../../redux/store";
// import { AutoCompleteOption, ChildrenFilter, TYPES, YoyagaesFilterMenu, filterMenu } from "../../share/InterfaceTypes";
// import { DropdownMenuItem, DropdownNestedMenuItem, GridStyleComponent } from "../../styleMUI";
// import RangeSlider from "../RangeSlider";
// import { useState, MouseEvent } from "react";
// import AutocompleteBox from "../AutocompletedBox";

// export function MenuListDropdown() {
//   const menuOptionFlat: YoyagaesFilterMenu = useSelector((state: RootState) => state.optionFlatMenu.value);
//   const [rangeValue, setRangeValue] = useState<Record<string, number[]>>({});
//   const [value, setValue] = useState<AutoCompleteOption[]>([]);
//   const [label, setLabel] = useState<string>('');
//   const [placement, setPlacement] = useState<PopperPlacementType>();
//   const [keyValue, setKeyValue] = useState<string>('');
//   const [type, setType] = useState<string>('');
//   const [open, setOpen] = useState(false);
//   const [anchorElPopover, setAnchorElPopover] = useState<HTMLElement | null>(null);
//   const [elementPosition, setElementPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
 
//   const handleClickMenu = (event: MouseEvent<HTMLLIElement, globalThis.MouseEvent>, value?: string, type?: string, label?: string) => {
//     setKeyValue(value as string);
//     setType(type as string);
//     handleClick('right-end')(event);
//     setLabel(label as string)
//     setOpen(true)
//   };

//   const handleClick = (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLElement>) => {
//     setOpen((prev) => placement !== newPlacement || !prev);
//     // console.log('placement', placement)
//     setPlacement(newPlacement);
//     setAnchorElPopover(event.currentTarget);

//   // Calculate the position of the RangeSlider
//   const clickedElement = event.currentTarget;
//   const { top, left, height } = clickedElement.getBoundingClientRect();
//   const elementTop = top + height;
//   const elementLeft = left;
//   const elementPosition = { top: elementTop, left: elementLeft };
//   setElementPosition(elementPosition);
//   };
  
//   const renderMenuList = (item: filterMenu, index: number) => {
//     return (
    
//             <Dropdown
//       key={`${item.label}-${index}`}
//       trigger={
//         <Button style={{ color: '#000', textTransform: 'none' }}>
//           {item.label}
//         </Button>
//       }
//       menu={renderDropdownMenu(item.children)}
//     />
//     )
//   }

//   const renderDropdownMenu = (children: ChildrenFilter[]) =>
//     children.map((childItem: ChildrenFilter, index: number) => (
//       <DropdownNestedMenuItem
//         label={childItem.label}
//         key={`${childItem.label}-${index}`}
//       >
//         {childItem.children && childItem.children.length > 0 && (
//           childItem.children.map((nodeChild: ChildrenFilter, idx: number) => (
       
//             <DropdownMenuItem
//               key={`${nodeChild.label}-${idx}`}
//               onClick={(event: MouseEvent<HTMLLIElement, globalThis.MouseEvent>) => {
//                 handleClickMenu(event, nodeChild?.var_name, nodeChild.type, nodeChild.label);
//               }}
//             >
//               {nodeChild.label} 
//             </DropdownMenuItem>
//           ))
//         )}
//       </DropdownNestedMenuItem>
//     ));


//   const renderRangeSlider = () => (
//     <Popper
//       open={open}
//       placement={placement}
//       transition
//       anchorEl={anchorElPopover}
//       style={{
//         position: 'fixed',
//         top: elementPosition.top,
//         left: elementPosition.left,
//       }}
//     >
//       {({ TransitionProps }) => (
//         <Fade {...TransitionProps} timeout={350}>
//           <Paper>
//             <Grid container justifyContent="center">
//                 <RangeSlider
//                   keyOption={keyValue}
//                   label={label}
//                   setRangeValue={setRangeValue}
//                   rangeValue={rangeValue}
//                 />
//             </Grid>
//           </Paper>
//         </Fade>
//       )}
//     </Popper>
//   );

//   const renderAutocompleteBox = () => (
//     <Popper
//       open={open}
//       anchorEl={anchorElPopover}
//       placement={placement}
//       transition
//     >
//       {({ TransitionProps }) => (
//         <Fade {...TransitionProps}>
//           <Paper>
//             <GridStyleComponent >
//             <Typography>{label}</Typography>
//             <Divider />
//               <AutocompleteBox keyOption={keyValue} setValue={setValue} />
//             </GridStyleComponent>
//           </Paper>
//         </Fade>
//       )}
//     </Popper>
//   );

//   return (
//     <>
//       <Box>
//         {menuOptionFlat.map(renderMenuList)}
//       </Box>
//       {keyValue && (type === TYPES.IntegerField || type === TYPES.DecimalField) && renderRangeSlider()}
//       {keyValue && type === TYPES.CharField && renderAutocompleteBox()}
//     </>
//   );
// }

