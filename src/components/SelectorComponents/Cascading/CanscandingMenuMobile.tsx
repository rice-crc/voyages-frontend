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
  DropdownMenuItem,
  DropdownNestedMenuItemChildren,
  StyleDialog,
} from '@/styleMUI';

import {
  ChildrenFilter,
  FilterMenu,
  RangeSliderState,
  TYPES,
  CurrentPageInitialState,
  TYPESOFDATASETPEOPLE,
  FilterMenuList,
} from '@/share/InterfaceTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useState, MouseEvent, useEffect } from 'react';
import {
  setIsChange,
  setKeyValue,
} from '@/redux/getRangeSliderSlice';
import { setIsOpenDialogMobile } from '@/redux/getScrollPageSlice';
import { PaperDraggable } from './PaperDraggable';
import RangeSlider from '../../FilterComponents/RangeSlider/RangeSlider';
import { setIsChangeAuto } from '@/redux/getAutoCompleteSlice';
import { setIsFilter } from '@/redux/getFilterSlice';
import GeoTreeSelected from '../../FilterComponents/GeoTreeSelect/GeoTreeSelected';
import { resetAll } from '@/redux/resetAllSlice';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { ENSALVERSTYLE } from '@/share/CONST_DATA';
import { DropdownCanscanding } from './DropdownCanscanding';
import VirtualizedAutoCompleted from '@/components/FilterComponents/Autocomplete/VirtualizedAutoCompleted';

const CanscandingMenuMobile = () => {
  const { styleName: styleNameRoute } = usePageRouter()

  const { valueVoyages, valueEnslaved, valueAfricanOrigin, valueEnslavedTexas, valueEnslavers } = useSelector((state: RootState) => state.getFilterMenuList.filterValueList);

  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );
  const { isOpenDialogMobile } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const dispatch: AppDispatch = useDispatch();
  const [isClickMenu, setIsClickMenu] = useState<boolean>(false);
  const [label, setLabel] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [filterMenu, setFilterMenu] = useState<FilterMenuList[]>(
    []
  );
  useEffect(() => {
    const loadFilterCellStructure = async () => {
      try {
        if (checkPagesRouteForVoyages(styleNameRoute!)) {
          setFilterMenu(valueVoyages);
        } else if (styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved) {
          setFilterMenu(valueEnslaved);
        } else if (styleNameRoute === TYPESOFDATASETPEOPLE.africanOrigins) {
          setFilterMenu(valueAfricanOrigin);
        } else if (styleNameRoute === TYPESOFDATASETPEOPLE.texas) {
          setFilterMenu(valueEnslavedTexas);
        } else if (styleNameRoute === ENSALVERSTYLE) {
          setFilterMenu(valueEnslavers);
        }
      } catch (error) {
        console.error('Failed to load table cell structure:', error);
      }
    };
    loadFilterCellStructure();
  }, [styleNameRoute]);


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
    dispatch(resetAll());
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };


  const renderDropdownMenu = (nodes: FilterMenu[] | ChildrenFilter[]) => {
    return nodes?.map((node: FilterMenu | ChildrenFilter, index: number) => {
      const { label, children, var_name, type } = node;
      const hasChildren = children && children.length >= 1;
      if (hasChildren) {
        return (
          <DropdownNestedMenuItemChildren
            onClickMenu={handleClickMenu}
            key={`${label}-${index}`}
            label={`${label}`}
            rightIcon={<ArrowLeft style={{ fontSize: 15 }} />}
            data-value={var_name}
            data-type={type}
            data-label={label}
            menu={renderDropdownMenu(children)}
          />
        );
      }

      return (
        <DropdownMenuItem
          key={`${label}-${index}`}
          onClick={handleClickMenu}
          dense
          data-value={var_name}
          data-type={type}
          data-label={label}
        >
          {label}
        </DropdownMenuItem>
      );
    });
  };

  return (
    <>
      {(currentPage !== 1 || currentEnslavedPage !== 1 || currentEnslaversPage !== 1) && (
        <DropdownCanscanding
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
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FilterAltIcon style={{ color: '#000000' }} />
                <div className="menu-nav-bar">Filter Search</div>
              </span>
            </IconButton>
          }
          menu={renderDropdownMenu(filterMenu)}
        />
      )}

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
          {varName && type === TYPES.CharField && <VirtualizedAutoCompleted />}
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

export default CanscandingMenuMobile;
