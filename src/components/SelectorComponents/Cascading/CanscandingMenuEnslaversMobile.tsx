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
  CurrentPageInitialState,
} from '@/share/InterfaceTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { DropdownColumn } from '../DropDown/DropdownColumn';
import { useState, MouseEvent } from 'react';
import { setKeyValue } from '@/redux/getRangeSliderSlice';
import { setIsOpenDialogMobile } from '@/redux/getScrollPageSlice';
import { PaperDraggable } from './PaperDraggable';
import RangeSlider from '../../FilterComponents/RangeSlider/RangeSlider';
import { setIsFilter } from '@/redux/getFilterSlice';
import AutocompleteBox from '../../FilterComponents/Autocomplete/AutoComplete';
import GeoTreeSelected from '../../FilterComponents/GeoTreeSelect/GeoTreeSelected';
import { resetAll } from '@/redux/resetAllSlice';

const CanscandingMenuEnslaversMobile = () => {
  const menuValueFilter = useSelector(
    (state: RootState) => state.getFilterPeople.value.valueEnslavers
  );
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { isOpenDialogMobile } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
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
  };
  const handleResetDataDialog = (event: any) => {
    event.stopPropagation();
    setIsClickMenu(!isClickMenu);
    dispatch(setIsOpenDialogMobile(false));

    dispatch(resetAll());
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
            {currentEnslaversPage !== 1 && (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FilterAltIcon style={{ color: '#ffffff' }} />
                <div className="menu-nav-bar" style={{ color: '#ffffff' }}>
                  Filter Search
                </div>
              </span>
            )}
          </IconButton>
        }
        menu={renderMenuItems(menuValueFilter)}
      />
      <Dialog
        BackdropProps={{
          style: DialogModalStyle,
        }}
        disableScrollLock={true}
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
          {varName && type === TYPES.GeoTreeSelect && <GeoTreeSelected />}
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

export default CanscandingMenuEnslaversMobile;
