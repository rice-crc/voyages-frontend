import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownCascading } from './DropdownCascading';
import { AppDispatch, RootState } from '@/redux/store';
import {
  ChildrenFilter,
  RangeSliderState,
  TYPES,
  CurrentPageInitialState,
  TYPESOFDATASETPEOPLE,
  FilterMenuList,
  FilterMenu,
  LabelFilterMeneList,
  Filter,
  AutoCompleteOption,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';
import '@/style/homepage.scss';
import { setType } from '@/redux/getFilterSlice';
import {
  DialogModalStyle,
  DropdownMenuItem,
  DropdownNestedMenuItemChildren,
  StyleDialog,
} from '@/styleMUI';
import { useState, MouseEvent, useEffect } from 'react';
import { PaperDraggable } from './PaperDraggable';
import { setIsChange, setKeyValueName } from '@/redux/getRangeSliderSlice';
import { setIsChangeAuto, setTextFilterValue } from '@/redux/getAutoCompleteSlice';
import { setIsOpenDialog } from '@/redux/getScrollPageSlice';
import { ArrowDropDown, ArrowRight } from '@mui/icons-material';
import {
  allEnslavers,
  ENSALVERSTYLE,
  INTRAAMERICANTRADS,
  TRANSATLANTICTRADS,
} from '@/share/CONST_DATA';
import GeoTreeSelected from '../../FilterComponents/GeoTreeSelect/GeoTreeSelected';
import { resetAll } from '@/redux/resetAllSlice';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import RangeSliderComponent from '@/components/FilterComponents/RangeSlider/RangeSliderComponent';
import FilterTextBox from '@/components/FilterComponents/Autocomplete/FilterTextBox';
import {
  getColorBTNVoyageDatasetBackground,
  getColorBackground,
  getColorBoxShadow,
  getColorHoverBackgroundCollection,
} from '@/utils/functions/getColorStyle';
import { setFilterObject } from '@/redux/getFilterSlice';
import AutoCompleteListBox from '@/components/FilterComponents/Autocomplete/AutoCompleteListBox';
import { setIsViewButtonViewAllResetAll, setLabelVarName, setTextFilter } from '@/redux/getShowFilterObjectSlice';
import { setIsChangeGeoTree } from '@/redux/getGeoTreeDataSlice';

export const MenuListsDropdown = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    valueVoyages,
    valueEnslaved,
    valueAfricanOrigin,
    valueEnslavedTexas,
    valueEnslavers,
  } = useSelector((state: RootState) => state.getFilterMenuList.filterValueList
  );
  const { type: typeData } = useSelector((state: RootState) => state.getFilter);
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);
  const { styleName: styleNameRoute } = usePageRouter();

  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { isOpenDialog } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { labelVarName, textFilter } = useSelector(
    (state: RootState) => state.getShowFilterObject
  );

  const [isClickMenu, setIsClickMenu] = useState<boolean>(false);
  const [ops, setOps] = useState<string>('');
  const [filterMenu, setFilterMenu] = useState<FilterMenuList[]>([]);

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
  }, [styleNameRoute, languageValue, isOpenDialog]);

  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');
    if (!storedValue) return;

    const parsedValue = JSON.parse(storedValue);

    const filter: Filter[] = parsedValue.filter;
    const filterByVarName =
      filter?.length > 0 &&
      filter.find((filterItem) => filterItem.varName === varName);

    if (!filterByVarName) {
      dispatch(setTextFilter(''))
      return;
    }

    const autoValueList: string[] = filterByVarName.searchTerm as string[];
    let newTextValue = ''

    if (Array.isArray(autoValueList)) { // use with autocomplete list will be all array list
      const values = autoValueList.map<AutoCompleteOption>((item: string) => ({
        value: item,
      }));
      for (const value of values) {
        newTextValue = value.value
      }
    } else { // use with TextFilter with string type, if autoValueList is string type
      newTextValue = autoValueList
    }
    setTextFilter(newTextValue);
    dispatch(setFilterObject(filter));
  }, [varName]);


  const handleClickMenu = (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>,
    ops: string[]
  ) => {
    const { value, type, label } = event.currentTarget.dataset;
    event.stopPropagation();
    setIsClickMenu(!isClickMenu);
    let opsValue = ''
    if (value && type && label) {
      dispatch(setKeyValueName(value));
      dispatch(setType(type));
      if (ops) {
        for (const ele of ops) {
          if (ele === 'icontains') {
            opsValue = 'icontains'
          } else if (ele === 'in') {
            opsValue = 'in'
          }
        }
        setOps(opsValue)
      }
      dispatch(setLabelVarName(label));
      dispatch(setIsOpenDialog(true));
    }
  };

  const handleCloseDialog = (event: any) => {
    event.stopPropagation();
    dispatch(setIsChange(false));
    dispatch(setIsChangeAuto(false));
    dispatch(setIsChangeGeoTree(false));
    const value = event.cancelable;
    setIsClickMenu(!isClickMenu);
    dispatch(setIsOpenDialog(false));
    if (currentPage !== 5) {
      dispatch(setIsChange(!value));
      dispatch(setIsChangeAuto(!value));
      dispatch(setIsChangeGeoTree(!value));
    }
  };

  const handleResetDataDialog = (event: any) => {
    event.stopPropagation();
    setTextFilter('')
    const value = event.cancelable;
    setIsClickMenu(!isClickMenu);
    dispatch(setIsOpenDialog(false));
    if (currentPage !== 5) {
      dispatch(setIsChange(!value));
      dispatch(setIsChangeAuto(!value));
      dispatch(setIsChangeGeoTree(!value));
    }
    dispatch(resetAll());
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const handleApplyTextFilterDataDialog = (value: string) => {
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
        existingFilters[existingFilterIndex].searchTerm = ops === 'icontains' ? newValue as string : [newValue]
      } else {
        existingFilters.push({
          varName: varName,
          searchTerm: ops === 'icontains' ? newValue as string : [newValue],
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

  const renderDropdownMenu = (
    nodes: FilterMenu | ChildrenFilter | (FilterMenu | ChildrenFilter)[]
  ): React.ReactElement<any>[] | undefined => {
    if (Array.isArray(nodes!)) {
      return nodes.map((node: FilterMenu | ChildrenFilter, index: number) => {
        const { children, var_name, type, label: nodeLabel, ops } = node;
        const hasChildren = children && children.length >= 1;
        const menuLabel = (nodeLabel as LabelFilterMeneList)[languageValue];

        if (hasChildren) {
          return (
            <DropdownNestedMenuItemChildren
              onClickMenu={(event) => handleClickMenu(event, ops!)}
              key={`${menuLabel}-${index}`}
              label={`${menuLabel}`}
              rightIcon={<ArrowRight style={{ fontSize: 15 }} />}
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
            onClick={(event) => handleClickMenu(event, ops!)}
            dense
            data-value={var_name}
            data-type={type}
            data-label={menuLabel}
          >
            {menuLabel}
          </DropdownMenuItem>
        );
      });
    }
  };

  let displayComponent;

  if (varName) {
    if ((typeData === TYPES.GeoTreeSelect) || (typeData === TYPES.LanguageTreeSelect)) {
      displayComponent = <GeoTreeSelected type={typeData} />
    } else if (typeData === TYPES.CharField && ops === 'icontains') {
      displayComponent = <FilterTextBox handleKeyDownTextFilter={handleApplyTextFilterDataDialog} />

    } else if (typeData === TYPES.CharField && ops == 'in') {
      displayComponent = <AutoCompleteListBox />
      // displayComponent = <VirtualizedAutoCompleted />
      // displayComponent= <AutoCompletedFilterListBox />
    }
    else if ((typeData === TYPES.IntegerField) || varName && typeData === TYPES.DecimalField) {
      displayComponent = <RangeSliderComponent />
    }
  }
  return (
    <div>
      <Box className="filter-menu-bar">
        {filterMenu.map((item: FilterMenuList, index: number) => {
          const { var_name, label, type, ops } = item
          const itemLabel = (label as LabelFilterMeneList)[languageValue];
          return var_name ? (
            <Button
              key={`${itemLabel}-${index}`}
              data-value={var_name}
              data-type={type}
              data-label={itemLabel}
              onClick={(event: any) => handleClickMenu(event, ops!)}
              sx={{
                color: '#000000',
                textTransform: 'none',
                fontSize: 14,
              }}
            >
              <Tooltip
                placement="top"
                title={`Filter by ${itemLabel}`}
                color="rgba(0, 0, 0, 0.75)"
              >
                {itemLabel}
              </Tooltip>
            </Button>
          ) : (
            <DropdownCascading
              key={`${itemLabel}-${index}`}
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
                  <Tooltip
                    placement="top"
                    title={`Filter by ${itemLabel}`}
                    color="rgba(0, 0, 0, 0.75)"
                  >
                    {itemLabel}{' '}
                  </Tooltip>
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
          <div style={{ fontSize: 16, fontWeight: 500 }}>{labelVarName}</div>
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          {displayComponent}
        </DialogContent>
        <DialogActions style={{ paddingRight: '2rem' }}>
          {varName && typeData === TYPES.CharField && ops === 'icontains' &&
            <Button
              autoFocus
              type='submit'
              onClick={() => handleApplyTextFilterDataDialog(textFilter)}
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
    </div>
  );
};
