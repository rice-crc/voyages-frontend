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
  LabelFilterMeneList,
} from '@/share/InterfaceTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useState, MouseEvent, useEffect } from 'react';
import {
  setIsChange,
  setKeyValueName,
} from '@/redux/getRangeSliderSlice';
import { setIsOpenDialogMobile } from '@/redux/getScrollPageSlice';
import { PaperDraggable } from './PaperDraggable';
import { setIsChangeAuto } from '@/redux/getAutoCompleteSlice';
import { setIsFilter, setType } from '@/redux/getFilterSlice';
import GeoTreeSelected from '../../FilterComponents/GeoTreeSelect/GeoTreeSelected';
import { resetAll } from '@/redux/resetAllSlice';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { ENSALVERSTYLE, INTRAAMERICANTRADS, TRANSATLANTICTRADS } from '@/share/CONST_DATA';
import { DropdownCascading } from './DropdownCascading';
import RangeSliderComponent from '@/components/FilterComponents/RangeSlider/RangeSliderComponent';
import FilterTextBox from '@/components/FilterComponents/Autocomplete/FilterTextBox';

const CascadingMenuMobile = () => {
  const { styleName: styleNameRoute } = usePageRouter()

  const { valueVoyages, valueEnslaved, valueAfricanOrigin, valueEnslavedTexas, valueEnslavers } = useSelector((state: RootState) => state.getFilterMenuList.filterValueList);
  const { type } = useSelector((state: RootState) => state.getFilter);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);

  const { isOpenDialogMobile } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const dispatch: AppDispatch = useDispatch();
  const [isClickMenu, setIsClickMenu] = useState<boolean>(false);
  const [label, setLabel] = useState<string>('');
  const [filterMenu, setFilterMenu] = useState<FilterMenuList[]>(
    []
  );
  const [textFilter, setTextFilter] = useState<string>('');

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
        } else if (styleNameRoute === TRANSATLANTICTRADS) {
          setFilterMenu(valueEnslavers);
        } else if (styleNameRoute === INTRAAMERICANTRADS) {
          setFilterMenu(valueEnslavers);
        }
      } catch (error) {
        console.error('Failed to load table cell structure:', error);
      }
    };
    loadFilterCellStructure();
  }, [styleNameRoute]);

  let displayComponent;

  if (varName) {
    if ((type === TYPES.GeoTreeSelect) || (type === TYPES.LanguageTreeSelect)) {
      displayComponent = <GeoTreeSelected type={type} />
    } else if (type === TYPES.CharField) {
      displayComponent = <FilterTextBox textValue={textFilter} setTextValue={setTextFilter} />
      // displayComponent = <VirtualizedAutoCompleted />
      // displayComponent= <AutoCompletedFilterListBox />
      // displayComponent=  <AutoCompleteListBox />
    } else if ((type === TYPES.IntegerField) || varName && type === TYPES.DecimalField) {
      displayComponent = <RangeSliderComponent />
    }
  }
  const handleClickMenu = (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>
  ) => {
    const { value, type, label } = event.currentTarget.dataset;
    event.stopPropagation();
    setIsClickMenu(!isClickMenu);
    if (value && type && label) {
      dispatch(setKeyValueName(value));
      dispatch(setType(type));
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
      const { label: nodeLabel, children, var_name, type } = node;
      const menuLabel = (nodeLabel as LabelFilterMeneList)[languageValue];
      const hasChildren = children && children.length >= 1;
      if (hasChildren) {
        return (
          <DropdownNestedMenuItemChildren
            onClickMenu={handleClickMenu}
            key={`${menuLabel}-${index}`}
            label={`${menuLabel}`}
            rightIcon={<ArrowLeft style={{ fontSize: 15 }} />}
            data-value={var_name}
            data-type={type}
            data-label={menuLabel}
            menu={renderDropdownMenu(children)}
          />
        );
      }

      return (
        <DropdownMenuItem
          key={`${menuLabel}-${index}`}
          onClick={handleClickMenu}
          dense
          data-value={var_name}
          data-type={type}
          data-label={menuLabel}
        >
          {menuLabel}
        </DropdownMenuItem>
      );
    });
  };

  return (
    <>

      <DropdownCascading
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
              <FilterAltIcon style={{ color: '#fff' }} />
              <div className="menu-nav-bar">Filter Search</div>
            </span>
          </IconButton>
        }
        menu={renderDropdownMenu(filterMenu)}
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
          {displayComponent}
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

export default CascadingMenuMobile;
