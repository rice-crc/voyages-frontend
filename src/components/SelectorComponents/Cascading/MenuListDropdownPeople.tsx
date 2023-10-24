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
  FilterPeopleMenu,
} from '@/share/InterfaceTypes';
import '@/style/homepage.scss';
import {
  BLACK,
  DialogModalStyle,
  DropdownMenuItem,
  DropdownNestedMenuItem,
  StyleDialog,
} from '@/styleMUI';
import { useState, MouseEvent, useEffect } from 'react';
import { PaperDraggable } from './PaperDraggable';
import { setIsChange, setKeyValue } from '@/redux/getRangeSliderSlice';
import { setIsChangeAuto } from '@/redux/getAutoCompleteSlice';
import { setIsOpenDialog } from '@/redux/getScrollPageSlice';
import { ArrowDropDown, ArrowRight } from '@mui/icons-material';
import AutocompleteBox from '../../FilterComponents/Autocomplete/AutoComplete';
import RangeSlider from '../../FilterComponents/RangeSlider/RangeSlider';
import { ALLENSLAVED, ALLENSLAVERS } from '@/share/CONST_DATA';
import GeoTreeSelected from '../../FilterComponents/GeoTreeSelect/GeoTreeSelected';
import { useNavigate } from 'react-router-dom';
import { resetAll } from '@/redux/resetAllSlice';

export const MenuListDropdownPeople = () => {
  const { styleNamePeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );

  const { valueEnslaved, valueAfricanOrigin, valueTexas, valueEnslavers } =
    useSelector((state: RootState) => state.getFilterPeople.value);
  const { pathName } = useSelector((state: RootState) => state.getPathName);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { isOpenDialog } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const navigate = useNavigate();
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

  const handleResetAll = () => {
    dispatch(resetAll());
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const renderDropdownMenu = (children?: ChildrenFilter[]) =>
    children?.map((childItem: ChildrenFilter, index: number) => {
      return (
        <DropdownNestedMenuItem
          onClickMenu={handleClickMenu}
          sx={{ fontSize: 14, paddingTop: 0, paddingBottom: 0 }}
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
                  sx={{ fontSize: 14, paddingTop: 0, paddingBottom: 0 }}
                >
                  {nodeChild.label}
                </DropdownMenuItem>
              );
            })}
        </DropdownNestedMenuItem>
      );
    });

  const [filterPeopleMenu, setFilterPeopleMenu] = useState<FilterPeopleMenu[]>(
    []
  );

  useEffect(() => {
    const loadTableCellStructure = async () => {
      try {
        if (
          styleNamePeople === TYPESOFDATASETPEOPLE.allEnslaved &&
          pathName === ALLENSLAVED
        ) {
          setFilterPeopleMenu(valueEnslaved);
        } else if (
          styleNamePeople === TYPESOFDATASETPEOPLE.africanOrigins &&
          pathName === ALLENSLAVED
        ) {
          setFilterPeopleMenu(valueAfricanOrigin);
        } else if (
          styleNamePeople === TYPESOFDATASETPEOPLE.texas &&
          pathName === ALLENSLAVED
        ) {
          setFilterPeopleMenu(valueTexas);
        } else if (pathName === ALLENSLAVERS) {
          setFilterPeopleMenu(valueEnslavers);
        }
      } catch (error) {
        console.error('Failed to load table cell structure:', error);
      }
    };
    loadTableCellStructure();
  }, [styleNamePeople, pathName]);

  return (
    <div>
      <Box className="filter-menu-bar">
        {filterPeopleMenu.map((item: FilterPeopleMenu, index: number) => {
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
              menu={renderDropdownMenu(item.children)}
            />
          );
        })}
        {varName && (
          <div className="btn-navbar-reset-all" onClick={handleResetAll}>
            <i aria-hidden="true" className="fa fa-times"></i>
            <span>Reset all</span>
          </div>
        )}
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
    </div>
  );
};
