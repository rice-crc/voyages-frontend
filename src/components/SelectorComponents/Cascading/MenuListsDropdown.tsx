import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownCanscanding } from './DropdownCanscanding';
import { AppDispatch, RootState } from '@/redux/store';
import {
  ChildrenFilter,
  RangeSliderState,
  TYPES,
  CurrentPageInitialState,
  TYPESOFDATASETPEOPLE,
  FilterMenuList,
  FilterMenu,
} from '@/share/InterfaceTypes';
import '@/style/homepage.scss';
import {
  BLACK,
  DialogModalStyle,
  DropdownMenuItem,
  DropdownNestedMenuItemChildren,
  StyleDialog,
} from '@/styleMUI';
import { useState, MouseEvent, useEffect } from 'react';
import { PaperDraggable } from './PaperDraggable';
import { setIsChange, setKeyValue } from '@/redux/getRangeSliderSlice';
import { setIsChangeAuto } from '@/redux/getAutoCompleteSlice';
import { setIsOpenDialog } from '@/redux/getScrollPageSlice';
import { ArrowDropDown, ArrowRight } from '@mui/icons-material';
import RangeSlider from '../../FilterComponents/RangeSlider/RangeSlider';
import { ENSALVERSTYLE, } from '@/share/CONST_DATA';
import GeoTreeSelected from '../../FilterComponents/GeoTreeSelect/GeoTreeSelected';
import { resetAll } from '@/redux/resetAllSlice';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import VirtualizedAutoCompleted from '@/components/FilterComponents/Autocomplete/VirtualizedAutoCompleted';

export const MenuListsDropdown = () => {

  const { valueVoyages, valueEnslaved, valueAfricanOrigin, valueEnslavedTexas, valueEnslavers } = useSelector((state: RootState) => state.getFilterMenuList.filterValueList);

  const { styleName: styleNameRoute } = usePageRouter()

  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { isOpenDialog } = useSelector(
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
      dispatch(setIsOpenDialog(true));
    }
  };

  const handleCloseDialog = (event: any) => {
    event.stopPropagation();
    const value = event.cancelable;
    setIsClickMenu(!isClickMenu);
    dispatch(setIsOpenDialog(false));
    if (currentPage !== 5) {
      dispatch(setIsChange(!value));
      dispatch(setIsChangeAuto(!value));
    }
  };
  const handleResetDataDialog = (event: any) => {
    event.stopPropagation();
    const value = event.cancelable;
    setIsClickMenu(!isClickMenu);
    dispatch(setIsOpenDialog(false));
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

  const renderDropdownMenu = (nodes: FilterMenu | ChildrenFilter | (FilterMenu | ChildrenFilter)[]): React.ReactElement<any>[] | undefined => {
    if (Array.isArray(nodes!)) {
      return nodes.map((node: FilterMenu | ChildrenFilter, index: number) => {
        const { label, children, var_name, type } = node;
        const hasChildren = children && children.length >= 1;
        if (hasChildren) {
          return (
            <DropdownNestedMenuItemChildren
              onClickMenu={handleClickMenu}
              key={`${label}-${index}`}
              label={`${label}`}
              rightIcon={<ArrowRight style={{ fontSize: 15 }} />}
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
    }
  };

  return (
    <div>
      <Box className="filter-menu-bar">
        {filterMenu.map((item: FilterMenuList, index: number) => {
          return item.var_name ? (
            <Button
              key={`${item.label}-${index}`}
              data-value={item.var_name}
              data-type={item.type}
              data-label={item.label}
              onClick={(event: any) => handleClickMenu(event)}
              sx={{
                color: '#000000',
                textTransform: 'none',
                fontSize: 14,
              }}
            >
              {item.label}
            </Button>
          ) : (
            <DropdownCanscanding
              key={`${item.label}-${index}`}
              trigger={
                <Button
                  sx={{
                    color: '#000000',
                    textTransform: 'none',
                    fontSize: 14,
                  }}
                  endIcon={
                    <span>
                      <ArrowRight
                        sx={{
                          display: {
                            xs: 'flex',
                            sm: 'flex',
                            md: 'none',
                          },
                          fontSize: 14,
                        }}
                      />
                      <ArrowDropDown
                        sx={{
                          display: {
                            xs: 'none',
                            sm: 'none',
                            md: 'flex',
                          },
                          fontSize: 16,
                        }}
                      />
                    </span>
                  }
                >
                  {item.label}
                </Button>
              }
              menu={renderDropdownMenu(item.children!)}
            />
          );
        })}
      </Box>
      <Dialog
        BackdropProps={{
          style: DialogModalStyle,
        }}
        disableScrollLock={true}
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
    </div>
  );
};
