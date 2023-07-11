import { ArrowLeft } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import FilterICON from '@/assets/filterICON.svg';
import {
  BLACK,
  DropdownMenuColumnItem,
  DropdownNestedMenuColumnItem,
  StyleDialog,
} from '@/styleMUI';
import {
  ChildrenFilter,
  FilterMenu,
  RangeSliderState,
  TYPES,
  VoyagaesFilterMenu,
  CurrentPageInitialState,
} from '@/share/InterfaceTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { DropdownColumn } from '../FcComponents/ColumnSelectorTable/DropdownColumn';
import { useState, MouseEvent } from 'react';
import { setIsChange, setKeyValue } from '@/redux/rangeSliderSlice';
import { setIsOpenDialog } from '@/redux/getScrollPageSlice';
import { PaperDraggable } from './PaperDraggable';

import RangeSlider from '../Voyages/Results/RangeSlider';
import { setIsChangeAuto } from '@/redux/getAutoCompleteSlice';
import { setIsFilter } from '@/redux/getFilterSlice';
import AutocompleteBox from '../Voyages/Results/AutocompletedBox';

interface CanscandingMenuMobileProps {}
const CanscandingMenuMobile: React.FC<CanscandingMenuMobileProps> = () => {
  const menuOptionFlat: VoyagaesFilterMenu = useSelector(
    (state: RootState) => state.optionFlatMenu.value
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { isOpenDialog } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const dispatch: AppDispatch = useDispatch();
  const [isClickMenu, setIsClickMenu] = useState<boolean>(false);
  const [label, setLabel] = useState<string>('');
  const [type, setType] = useState<string>('');

  const handleClickMenu = (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>
  ) => {
    const { value, type, label } = event.currentTarget.dataset;
    event.stopPropagation();
    setIsClickMenu(!isClickMenu);
    if (value && type && label) {
      dispatch(setKeyValue(value));
      setType(type);
      setLabel(label);
      dispatch(setIsOpenDialog(true));
    }
  };

  const handleCloseDialog = (event: any) => {
    event.stopPropagation();
    const value = event.cancelable;
    setIsClickMenu(!isClickMenu);
    dispatch(setIsOpenDialog(false));
    dispatch(setIsFilter(false));
    if (currentPage !== 5) {
      dispatch(setIsChange(!value));
      dispatch(setIsChangeAuto(!value));
    }
  };

  const renderMenuItems = (nodes: FilterMenu[] | ChildrenFilter[]) => {
    return nodes?.map((node: FilterMenu | ChildrenFilter, index: number) => {
      const { label, children, var_name, type } = node;
      const hasChildren = children && children.length > 1;

      if (hasChildren) {
        return (
          <DropdownNestedMenuColumnItem
            onClickMenu={handleClickMenu}
            key={`${label}-${index}`}
            label={`${label}`}
            rightIcon={<ArrowLeft />}
            data-value={var_name}
            data-type={type}
            data-label={label}
            menu={renderMenuItems(children)}
          />
        );
      }

      return (
        <DropdownMenuColumnItem
          key={`${label}-${index}`}
          onClick={handleClickMenu}
          dense
          data-value={var_name}
          data-type={type}
          data-label={label}
        >
          {label}
        </DropdownMenuColumnItem>
      );
    });
  };
  return (
    <>
      <DropdownColumn
        trigger={
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              display: {
                xs: 'flex',
                sm: 'flex',
                md: 'none',
                paddingRight: 40,
              },
              cursor: 'pointer',
              alignItems: 'center',
              margin: '10px 0',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {currentPage !== 1 && (
              <span style={{ display: 'flex' }}>
                <img src={FilterICON} alt="logo" style={{ width: 18 }} />
                <div className="menu-nav-bar"> Filter Search</div>
              </span>
            )}
          </IconButton>
        }
        menu={renderMenuItems(menuOptionFlat)}
      />
      <Dialog
        BackdropProps={{ style: { backgroundColor: 'transparent' } }}
        sx={StyleDialog}
        open={isOpenDialog}
        onClose={handleCloseDialog}
        PaperComponent={PaperDraggable}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle sx={{ cursor: 'move' }} id="draggable-dialog-title">
          <div style={{ fontSize: 16, fontWeight: 500 }}>{label}</div>
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          {varName && type === TYPES.CharField && <AutocompleteBox />}
          {((varName && type === TYPES.IntegerField) ||
            (varName && type === TYPES.DecimalField)) && <RangeSlider />}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleCloseDialog}
            sx={{ color: BLACK, fontSize: 15 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CanscandingMenuMobile;
