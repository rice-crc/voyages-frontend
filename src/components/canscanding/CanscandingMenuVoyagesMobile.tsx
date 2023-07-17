import { ArrowLeft } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  BLACK,
  DialogModalStyle,
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
import { DropdownColumn } from '../FunctionComponents/ColumnSelectorTable/DropdownColumn';
import { useState, MouseEvent } from 'react';
import { setIsChange, setKeyValue } from '@/redux/rangeSliderSlice';
import { setIsOpenDialogMobile } from '@/redux/getScrollPageSlice';
import { PaperDraggable } from './PaperDraggable';
import RangeSlider from '../Voyages/Results/RangeSlider';
import { setIsChangeAuto } from '@/redux/getAutoCompleteSlice';
import { setIsFilter } from '@/redux/getFilterSlice';
import AutocompleteBox from '../Voyages/Results/AutocompletedBox';

const CanscandingMenuVoyagesMobile = () => {
  const menuOptionFlat: VoyagaesFilterMenu = useSelector(
    (state: RootState) => state.optionFlatMenu.value
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { isOpenDialogMobile } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { styleNamePeople } = useSelector(
    (state: RootState) => state.getPeopleDataSetCollection
  );
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );

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
      dispatch(setIsOpenDialogMobile(true));
    }
  };

  const handleCloseDialog = (event: any) => {
    event.stopPropagation();
    const value = event.cancelable;
    setIsClickMenu(!isClickMenu);
    dispatch(setIsOpenDialogMobile(false));
    dispatch(setIsFilter(false));
    if (currentPage !== 5) {
      dispatch(setIsChange(!value));
      dispatch(setIsChangeAuto(!value));
    }
  };
  const handleResetDataDialog = (event: any) => {
    event.stopPropagation();
    const value = event.cancelable;
    setIsClickMenu(!isClickMenu);
    dispatch(setIsOpenDialogMobile(false));
    if (currentPage !== 5) {
      dispatch(setIsChange(!value));
      dispatch(setIsChangeAuto(!value));
    }

    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
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
      {currentPage !== 1 && (
        <DropdownColumn
          trigger={
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                color: '#000000',
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
              <span style={{ display: 'flex' }}>
                <FilterAltIcon style={{ color: '#000000' }} />
                <div className="menu-nav-bar">Filter Search</div>
              </span>
            </IconButton>
          }
          menu={renderMenuItems(menuOptionFlat)}
        />
      )}
      <Dialog
        BackdropProps={{
          style: DialogModalStyle,
        }}
        sx={StyleDialog}
        open={isOpenDialogMobile}
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
            onClick={handleResetDataDialog}
            sx={{ color: BLACK, fontSize: 15 }}
          >
            RESET
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CanscandingMenuVoyagesMobile;
