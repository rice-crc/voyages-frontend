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
  DialogModalStyle,
  DropdownMenuItem,
  DropdownNestedMenuItemChildren,
  StyleDialog,
} from '@/styleMUI';

import {
  ChildrenFilter,
  FilterMenu,
  FilterObjectsState,
  TYPES,
  CurrentPageInitialState,
  TYPESOFDATASETPEOPLE,
  FilterMenuList,
  LabelFilterMeneList,
  Filter,
  TYPESOFDATASET,
  RolesProps,
} from '@/share/InterfaceTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useState, MouseEvent, useEffect } from 'react';
import {
  setEnslaversNameAndRole,
  setIsChange,
  setKeyValueName,
} from '@/redux/getRangeSliderSlice';
import { setIsOpenDialogMobile } from '@/redux/getScrollPageSlice';
import { PaperDraggable } from './PaperDraggable';
import { setIsChangeAuto, setTextFilterValue } from '@/redux/getAutoCompleteSlice';
import { setFilterObject, setIsFilter, setType } from '@/redux/getFilterSlice';
import GeoTreeSelected from '../../FilterComponents/GeoTreeSelect/GeoTreeSelected';
import { resetAll } from '@/redux/resetAllSlice';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { allEnslavers, ENSALVERSTYLE, INTRAAMERICANTRADS, TRANSATLANTICTRADS } from '@/share/CONST_DATA';
import { DropdownCascading } from './DropdownCascading';
import RangeSliderComponent from '@/components/FilterComponents/RangeSlider/RangeSliderComponent';
import FilterTextBox from '@/components/FilterComponents/Autocomplete/FilterTextBox';
import { setIsViewButtonViewAllResetAll, setLabelVarName } from '@/redux/getShowFilterObjectSlice';
import AutoCompleteListBox from '@/components/FilterComponents/Autocomplete/AutoCompleteListBox';
import FilterTextNameEnslaversBox from '@/components/FilterComponents/Autocomplete/FilterTextNameEnslaversBox';
import { RadioSelected } from '../RadioSelected/RadioSelected';
import { SelectSearchDropdownEnslaversNameRole } from '../SelectDrowdown/SelectSearchDropdownEnslaversNameRole';
import { getColorBackground, getColorBTNVoyageDatasetBackground, getColorHoverBackgroundCollection, getColorBoxShadow, } from '@/utils/functions/getColorStyle';
import { updatedEnslaversRoleAndNameToLocalStorage } from '@/utils/functions/updatedEnslaversRoleAndNameToLocalStorage';

const CascadingMenuMobile = () => {
  const { styleName: styleNameRoute } = usePageRouter()

  const { valueVoyages, valueEnslaved, valueAfricanOrigin, valueEnslavedTexas, valueEnslavers } = useSelector((state: RootState) => state.getFilterMenuList.filterValueList);
  const { type: typeData } = useSelector((state: RootState) => state.getFilter);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const [textError, setTextError] = useState<string>('')
  const { listEnslavers, varName, enslaverName, opsRoles } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState
  );
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);

  const { isOpenDialogMobile } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { labelVarName, textFilter } = useSelector(
    (state: RootState) => state.getShowFilterObject
  );
  const dispatch: AppDispatch = useDispatch();
  const [isClickMenu, setIsClickMenu] = useState<boolean>(false);
  const [label, setLabel] = useState<string>('');
  const [filterMenu, setFilterMenu] = useState<FilterMenuList[]>(
    []
  );
  const [ops, setOps] = useState<string>('');
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

  const handleApplyTextFilterDataDialog = (value: string) => {
    console.log({ value })
    dispatch(setTextFilterValue(value));
    updateFilter(value)
  }
  const updateFilter = (newValue: string) => {
    const existingFilterObjectString = localStorage.getItem('filterObject');
    let existingFilters: Filter[] = [];

    if (existingFilterObjectString) {
      existingFilters = JSON.parse(existingFilterObjectString).filter || [];
    }

    const existingFilterIndex = existingFilters.findIndex(
      (filter) => filter.varName === varName
    );

    if (newValue.length > 0) {
      if (existingFilterIndex !== -1) {
        existingFilters[existingFilterIndex].searchTerm = ops === 'icontains' || (ops === 'exact') ? newValue as string : [newValue]
      } else {
        existingFilters.push({
          varName: varName,
          searchTerm: (ops === 'icontains') || (ops === 'exact') ? newValue as string : [newValue],
          op: ops,
          label: labelVarName
        });
      }
    } else if (existingFilterIndex !== -1) {
      existingFilters[existingFilterIndex].searchTerm = [];
    }

    const filteredFilters = existingFilters.filter((filter) =>
      !Array.isArray(filter.searchTerm) || filter.searchTerm.length > 0
    );

    const filterObjectUpdate = {
      filter: filteredFilters,
    };

    const filterObjectString = JSON.stringify(filterObjectUpdate);
    localStorage.setItem('filterObject', filterObjectString)

    dispatch(setFilterObject(filteredFilters));
    if ((styleNameRoute === TYPESOFDATASET.allVoyages || styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved || styleNameRoute === allEnslavers) && filteredFilters.length > 0) {
      dispatch(setIsViewButtonViewAllResetAll(true))
    } else if (filteredFilters.length > 1) {
      dispatch(setIsViewButtonViewAllResetAll(true))
    }
  }

  let displayComponent;

  if (varName) {
    if ((typeData === TYPES.GeoTreeSelect) || (typeData === TYPES.LanguageTreeSelect)) {
      displayComponent = <GeoTreeSelected type={typeData} />
    } else if ((typeData === TYPES.CharField && ops === 'icontains') || (typeData === TYPES.VoyageID && ops === 'exact')) {
      displayComponent = <FilterTextBox handleKeyDownTextFilter={handleApplyTextFilterDataDialog} type={typeData} />
    } else if (typeData === TYPES.CharField && ops == 'in') {
      displayComponent = <AutoCompleteListBox />
    } else if (typeData === TYPES.EnslaverNameAndRole) {
      displayComponent = <div>
        <FilterTextNameEnslaversBox setTextError={setTextError} textError={textError} />
        <RadioSelected type={typeData} />
        <SelectSearchDropdownEnslaversNameRole />
      </div>
    } else if ((typeData === TYPES.IntegerField) || varName && typeData === TYPES.DecimalField) {
      displayComponent = <RangeSliderComponent />
    }
  }


  const handleApplyEnslaversDialog = (roles: RolesProps[], name: string, ops: string) => {
    setTextError(textError)
    const newRoles: string[] = roles.map((ele) => ele.value);
    updatedEnslaversRoleAndNameToLocalStorage(dispatch, styleNameRoute!, newRoles as string[], name, varName, ops!, labelVarName)
  }
  const handleClickMenu = (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>,
    ops: string[],
    roles?: RolesProps[]
  ) => {
    const { value, type, label } = event.currentTarget.dataset;
    event.stopPropagation();
    setIsClickMenu(!isClickMenu);
    let opsValue = ''
    if (value && type && label) {
      if (type === 'EnslaverNameAndRole') {
        dispatch(setKeyValueName(type));
      } else {
        dispatch(setKeyValueName(value));
      }

      dispatch(setType(type));

      if (ops) {

        for (const ele of ops) {
          if (ele === 'icontains') {
            opsValue = 'icontains'
          } else if (ele === 'in') {
            opsValue = 'in'
          } else if (ele === 'exact') {
            opsValue = 'exact'
          }
        }
        setOps(opsValue)
      }
      dispatch(setLabelVarName(label));
      dispatch(setIsOpenDialogMobile(true));
      if (roles) {
        dispatch(setEnslaversNameAndRole(roles))
      }
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
      const { children, var_name, type, label: nodeLabel, ops, roles } = node;
      const menuLabel = (nodeLabel as LabelFilterMeneList)[languageValue];
      const hasChildren = children && children.length >= 1;
      if (hasChildren) {
        return (
          <DropdownNestedMenuItemChildren
            onClickMenu={(event) => handleClickMenu(event, ops!, roles!)}
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
          onClick={(event) => handleClickMenu(event, ops!, roles!)}
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
          <div style={{ fontSize: 16, fontWeight: 500 }}>{typeData === TYPES.EnslaverNameAndRole ? `Search for ${labelVarName}:` : labelVarName}</div>
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          {displayComponent}
        </DialogContent>
        <DialogActions style={{ paddingRight: '2rem', marginTop: typeData === TYPES.EnslaverNameAndRole ? '10rem' : 0 }}>
          {varName && ((typeData === TYPES.CharField && ops === 'icontains') || (typeData === TYPES.VoyageID && ops === 'exact')) && <Button
            autoFocus
            type='submit'
            onClickCapture={() => handleApplyTextFilterDataDialog(textFilter)}
            sx={{
              color: 'white', textTransform: 'unset',
              height: 30,
              cursor: 'pointer',
              backgroundColor: getColorBackground(styleNameRoute!),
              fontSize: '0.80rem',
              '&:hover': {
                backgroundColor: getColorHoverBackgroundCollection(styleNameRoute!),
                color: getColorBTNVoyageDatasetBackground(styleNameRoute!)
              },
              '&:disabled': {
                color: '#fff',
                boxShadow: getColorBoxShadow(styleNameRoute!),
                cursor: 'not-allowed',
              },
            }}
          >
            Apply
          </Button>}
          {(varName && (typeData === TYPES.EnslaverNameAndRole)) &&
            <Button
              autoFocus
              type='submit'
              onClickCapture={() => handleApplyEnslaversDialog(listEnslavers, enslaverName, opsRoles!)}
              sx={{
                color: 'white', textTransform: 'unset',
                height: 30,
                cursor: 'pointer',
                backgroundColor: getColorBackground(styleNameRoute!),
                fontSize: '0.80rem',
                '&:hover': {
                  backgroundColor: getColorHoverBackgroundCollection(styleNameRoute!),
                  color: getColorBTNVoyageDatasetBackground(styleNameRoute!)
                },
                '&:disabled': {
                  color: '#fff',
                  boxShadow: getColorBoxShadow(styleNameRoute!),
                  cursor: 'not-allowed',
                },
              }}
            >
              Apply
            </Button>}
          <Button
            autoFocus
            onClick={handleResetDataDialog}
            sx={{
              color: 'black', textTransform: 'unset',
              height: 30,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: `1px solid ${getColorBackground(styleNameRoute!)}`,
              fontSize: '0.80rem',
              '&:hover': {
                backgroundColor: getColorHoverBackgroundCollection(styleNameRoute!),
                color: getColorBTNVoyageDatasetBackground(styleNameRoute!)
              },
              '&:disabled': {
                color: '#fff',
                boxShadow: getColorBoxShadow(styleNameRoute!),
                cursor: 'not-allowed',
              },
            }}
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog
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
      </Dialog> */}
    </>
  );
};

export default CascadingMenuMobile;
