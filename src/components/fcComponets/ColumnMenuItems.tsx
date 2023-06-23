import {
  Menu,
  Button,
  MenuItem,
  Fade,
  List,
  Container,
  Grid,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { TreeView } from "@mui/lab";
import { ArrowRight } from "@mui/icons-material";
import { AppDispatch, RootState } from "@/redux/store";
import {
  ChildrenFilter,
  RangeSliderState,
  VoyagaesFilterMenu,
  FilterMenu,
  currentPageInitialState,
} from "@/share/InterfaceTypes";
import ExpandMoreIcon from "@mui/icons-material/ArrowRightAlt";
import ChevronRightIcon from "@mui/icons-material/ArrowRightAlt";
import { MouseEvent, useState } from "react";
import { setKeyValue } from "@/redux/rangeSliderSlice";
import { setIsOpenDialog } from "@/redux/getScrollPageSlice";
import { DropdownColumn } from "./DropdownColumn";
import { useWindowSize } from "@react-hook/window-size";
import {
  DropdownMenuColumnItem,
  DropdownNestedMenuColumnItem,
} from "@/styleMUI";

interface ColumnMenuItemsProps {}

export const ColumnMenuItems: React.FC<ColumnMenuItemsProps> = () => {
  const dispatch: AppDispatch = useDispatch();
  const menuOptionFlat: VoyagaesFilterMenu = useSelector(
    (state: RootState) => state.optionFlatMenu.value
  );
  const [width, height] = useWindowSize();
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as currentPageInitialState
  );
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { isOpenDialog } = useSelector(
    (state: RootState) => state.getScrollPage as currentPageInitialState
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log("handleClick", event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickMenu = (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>
  ) => {
    const { value, type, label } = event.currentTarget.dataset;
    event.stopPropagation();
    if (value && type && label) {
      dispatch(setKeyValue(value));
      dispatch(setIsOpenDialog(!isOpenDialog));
    }
  };

  function renderMenuItems(nodes: any[]) {
    return nodes.map((node) => {
      const { label, children } = node;
      const hasChildren = children && children.length > 1;

      if (hasChildren) {
        return (
          <DropdownNestedMenuColumnItem
            label={`${label}`}
            rightIcon={<ArrowRight />}
            menu={renderMenuItems(children)}
          />
        );
      }

      return (
        <DropdownMenuColumnItem
          onClick={() => {
            console.log("clicked");
          }}
          dense
        >
          {label}
        </DropdownMenuColumnItem>
      );
    });
  }

  return (
    <div>
      <Container maxWidth={false}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item sx={{ width: width > 800 ? width * 0.9 : width * 0.7 }}>
            <Grid container item>
              <TreeView
                aria-label="option menu"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
              >
                <Box>
                  <DropdownColumn
                    trigger={
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <Button
                          style={{
                            fontSize: 12,
                            backgroundColor: "#17a2b8",
                            color: "#ffffff",
                          }}
                          endIcon={<ArrowDropDownIcon />}
                        >
                          configure columns
                        </Button>
                      </span>
                    }
                    menu={renderMenuItems(menuOptionFlat)}
                  />
                </Box>
              </TreeView>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
