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
  FilterObjectsState,
  TYPES,
  CurrentPageInitialState,
  TYPESOFDATASETPEOPLE,
  FilterMenuList,
  FilterMenu,
  LabelFilterMeneList,
  Filter,
  AutoCompleteOption,
  TYPESOFDATASET,
  RolesProps,
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
import { setEnslaversNameAndRole, setIsChange, setKeyValueName, setListEnslavers, setOpsRole } from '@/redux/getRangeSliderSlice';
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
import { SelectSearchDropdownEnslaversNameRole } from '../SelectDrowdown/SelectSearchDropdownEnslaversNameRole';
import { RadioSelected } from '../RadioSelected/RadioSelected';
import FilterTextNameEnslaversBox from '@/components/FilterComponents/Autocomplete/FilterTextNameEnslaversBox';
import { updatedEnslaversRoleAndNameToLocalStorage } from '@/utils/functions/updatedEnslaversRoleAndNameToLocalStorage';
import { SelectSearchDropdownList } from '../SelectDrowdown/SelectSearchDropdownList';
import { fetchNationalityList } from '@/fetch/voyagesFetch/fetchNationalityList';
import { setNationalityList } from '@/redux/getNationalityListSlice';
import { updateFilterTextDialog } from '@/utils/functions/updateFilterTextDialog';

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

  const { isOpenDialog } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { labelVarName, textFilter } = useSelector(
    (state: RootState) => state.getShowFilterObject
  );

  const { listEnslavers, varName, enslaverName, opsRoles } = useSelector((state: RootState) => state.rangeSlider as FilterObjectsState);

  const [isClickMenu, setIsClickMenu] = useState<boolean>(false);
  const [ops, setOps] = useState<string>('');
  const [filterMenu, setFilterMenu] = useState<FilterMenuList[]>([]);
  const [textError, setTextError] = useState<string>('')
  const [textRoleListError, setTextRoleListError] = useState<string>('')
  const isButtonDisabled = enslaverName === '' && typeData === TYPES.EnslaverNameAndRole;

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

    if (Array.isArray(autoValueList)) {
      const values = autoValueList.map<AutoCompleteOption>((item: string) => ({
        value: item,
      }));
      for (const value of values) {
        newTextValue = value.value
      }
    } else {
      newTextValue = autoValueList
    }
    setTextFilter(newTextValue);
    dispatch(setFilterObject(filter));
  }, [varName]);

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
            dispatch(setOpsRole('exact'))
          }
        }
        setOps(opsValue)
      }
      dispatch(setLabelVarName(label));
      dispatch(setIsOpenDialog(true));
      if (roles) {
        dispatch(setEnslaversNameAndRole(roles))
        dispatch(setListEnslavers(roles));
      }
    }
  };

  const handleCloseDialog = (event: any) => {
    event.stopPropagation();
    setTextError('');
    setTextRoleListError('')
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
    setTextError('');
    setTextRoleListError('')
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

  const handleApplyEnslaversDialog = (roles: RolesProps[], name: string, ops: string) => {
    if (roles.length === 0) {
      setTextRoleListError('Please make a selection')
    }
    if (name === '') {
      setTextError(`Please type enslavers name, can't be empty`)
    }
    const newRoles: string[] = roles.map((ele) => ele.value);
    updatedEnslaversRoleAndNameToLocalStorage(dispatch, styleNameRoute!, newRoles as string[], name, varName, ops!)
  }

  const handleApplyTextFilterDataDialog = (value: string) => {
    dispatch(setTextFilterValue(value));
    updateFilterTextDialog(dispatch, value, styleNameRoute!, varName, ops, opsRoles!, labelVarName)
  }


  const renderDropdownMenu = (
    nodes: FilterMenu | ChildrenFilter | (FilterMenu | ChildrenFilter)[]
  ): React.ReactElement<any>[] | undefined => {
    if (Array.isArray(nodes!)) {
      return nodes.map((node: FilterMenu | ChildrenFilter, index: number) => {
        const { children, var_name, type, label: nodeLabel, ops, roles } = node;
        const hasChildren = children && children.length >= 1;
        const menuLabel = (nodeLabel as LabelFilterMeneList)[languageValue];
        if (hasChildren) {
          return (
            <DropdownNestedMenuItemChildren
              onClickMenu={(event) => handleClickMenu(event, ops!, roles!)}
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
    }
  };

  let displayComponent;

  if (varName) {
    switch (typeData) {
      case TYPES.GeoTreeSelect:
      case TYPES.LanguageTreeSelect:
        displayComponent = <GeoTreeSelected type={typeData} />;
        break;

      case TYPES.CharField:
        if (ops === 'icontains') {
          displayComponent = <FilterTextBox handleKeyDownTextFilter={handleApplyTextFilterDataDialog} type={typeData} />;
        } else if (ops === 'in') {
          displayComponent = <AutoCompleteListBox />;
        }
        break;

      case TYPES.VoyageID:
        if (opsRoles === 'exact') {
          displayComponent = (
            <>
              <RadioSelected type={typeData} />
              <FilterTextBox handleKeyDownTextFilter={handleApplyTextFilterDataDialog} type={typeData} />
            </>
          );
        } else if (opsRoles === 'btw') {
          displayComponent = (
            <>
              <RadioSelected type={typeData} />
              <RangeSliderComponent />
            </>
          );
        }
        break;

      case TYPES.EnslaverNameAndRole:
        displayComponent = (
          <div>
            <FilterTextNameEnslaversBox setTextError={setTextError} textError={textError} />
            <RadioSelected type={typeData} />
            <SelectSearchDropdownEnslaversNameRole setTextRoleListError={setTextRoleListError} textRoleListError={textRoleListError} />
          </div>
        );
        break;

      case TYPES.IntegerField:
      case TYPES.DecimalField:
        displayComponent = <RangeSliderComponent />;
        break;

      case TYPES.MultiselectList:
        displayComponent = <SelectSearchDropdownList />
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <Box className="filter-menu-bar">
        {filterMenu.map((item: FilterMenuList, index: number) => {
          const { var_name, label, type, ops } = item;
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
          <div style={{ fontSize: 16, fontWeight: 500 }}>{typeData === TYPES.EnslaverNameAndRole ? `Search for ${labelVarName}:` : labelVarName}</div>
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          {displayComponent}
        </DialogContent>
        <DialogActions style={{ paddingRight: '2rem', marginTop: typeData === TYPES.EnslaverNameAndRole ? '10rem' : 0 }}>
          {varName && opsRoles !== 'btw' && ((typeData === TYPES.CharField && ops === 'icontains') || (typeData === TYPES.VoyageID && opsRoles === 'exact') || (typeData === TYPES.EnslaverNameAndRole) || (typeData === TYPES.MultiselectList))
            && <Button
              autoFocus
              disabled={isButtonDisabled}
              type='submit'
              onClickCapture={() => {
                if (typeData === TYPES.EnslaverNameAndRole) {
                  handleApplyEnslaversDialog(listEnslavers, enslaverName, opsRoles!)
                } else {
                  handleApplyTextFilterDataDialog(textFilter)
                }
              }}
              sx={{
                color: 'white', textTransform: 'unset',
                height: 30,
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                backgroundColor: isButtonDisabled ? getColorHoverBackgroundCollection(styleNameRoute!) : getColorBackground(styleNameRoute!),
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
    </div >
  );
}

