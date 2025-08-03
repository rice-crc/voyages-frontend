/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
import { useState, MouseEvent, useEffect } from 'react';

import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import AutoCompleteListBox from '@/components/FilterComponents/Autocomplete/AutoCompleteListBox';
import FilterTextBox from '@/components/FilterComponents/Autocomplete/FilterTextBox';
import FilterTextNameEnslaversBox from '@/components/FilterComponents/Autocomplete/FilterTextNameEnslaversBox';
import RangeSliderComponent from '@/components/FilterComponents/RangeSlider/RangeSliderComponent';
import { usePageRouter } from '@/hooks/usePageRouter';
import {
  setIsChangeAuto,
  setTextFilterValue,
} from '@/redux/getAutoCompleteSlice';
import { setType, setFilterObject } from '@/redux/getFilterSlice';
import { setIsChangeGeoTree } from '@/redux/getGeoTreeDataSlice';
import {
  setEnslaversNameAndRole,
  setIsChange,
  setKeyValueName,
  setListEnslavers,
  setOpsRole,
  setRangeSliderValue,
} from '@/redux/getRangeSliderSlice';
import { setIsOpenDialog } from '@/redux/getScrollPageSlice';
import {
  setIsViewButtonViewAllResetAll,
  setLabelVarName,
  setTextFilter,
} from '@/redux/getShowFilterObjectSlice';
import { resetAll } from '@/redux/resetAllSlice';
import { AppDispatch, RootState } from '@/redux/store';
import {
  allEnslavers,
  ENSALVERSTYLE,
  FILTER_OBJECT_KEY,
  INTRAAMERICANTRADS,
  TRANSATLANTICTRADS,
} from '@/share/CONST_DATA';
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
  RolesProps,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';
import {
  DialogModalStyle,
  DropdownMenuItem,
  DropdownNestedMenuItemChildren,
  StyleDialog,
} from '@/styleMUI';
import { checkRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import {
  getColorBTNVoyageDatasetBackground,
  getColorBackground,
  getColorBoxShadow,
  getColorHoverBackgroundCollection,
} from '@/utils/functions/getColorStyle';
import { updatedEnslaversRoleAndNameToLocalStorage } from '@/utils/functions/updatedEnslaversRoleAndNameToLocalStorage';
import { updateFilterTextDialog } from '@/utils/functions/updateFilterTextDialog';

import { DropdownCascading } from './DropdownCascading';
import '@/style/homepage.scss';
import { PaperDraggable } from './PaperDraggable';
import GeoTreeSelected from '../../FilterComponents/GeoTreeSelect/GeoTreeSelected';
import { RadioSelected } from '../RadioSelected/RadioSelected';
import { SelectSearchDropdownEnslaversNameRole } from '../SelectDrowdown/SelectSearchDropdownEnslaversNameRole';
import { SelectSearchDropdownList } from '../SelectDrowdown/SelectSearchDropdownList';

export const MenuListsDropdown = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    valueAllVoyages,
    valueTransaslantic,
    valueIntraamerican,
    valueEnslaved,
    valueAfricanOrigin,
    valueEnslavedTexas,
    valueEnslavers,
  } = useSelector(
    (state: RootState) => state.getFilterMenuList.filterValueList,
  );
  const { type: typeData } = useSelector((state: RootState) => state.getFilter);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const { styleName: styleNameRoute } = usePageRouter();
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState,
  );

  const { isOpenDialog } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState,
  );
  const { labelVarName, textFilter } = useSelector(
    (state: RootState) => state.getShowFilterObject,
  );

  const {
    listEnslavers,
    varName,
    enslaverName,
    opsRoles,
    rangeSliderMinMax,
    rangeValue,
  } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  const [inputValue, setInputValue] = useState(textFilter);
  const [isClickMenu, setIsClickMenu] = useState<boolean>(false);
  const [ops, setOps] = useState<string>('');
  const [filterMenu, setFilterMenu] = useState<FilterMenuList[]>([]);
  const [textError, setTextError] = useState<string>('');
  const [textRoleListError, setTextRoleListError] = useState<string>('');
  const rangeMinMax = rangeSliderMinMax?.[varName] ||
    rangeValue?.[varName] || [0, 0.5];
  const minRange = rangeValue?.[varName]?.[0] || 0;
  const maxRange = rangeValue?.[varName]?.[1] || 0;
  const [currentSliderValue, setCurrentSliderValue] = useState<
    number | number[]
  >(rangeMinMax);
  const isButtonDisabled =
    enslaverName === '' && typeData === TYPES.EnslaverNameAndRole;

  useEffect(() => {
    const loadFilterCellStructure = async () => {
      try {
        if (styleNameRoute === TYPESOFDATASET.transatlantic) {
          setFilterMenu(valueTransaslantic);
        } else if (styleNameRoute === TYPESOFDATASET.intraAmerican) {
          setFilterMenu(valueIntraamerican);
        } else if (checkRouteForVoyages(styleNameRoute!)) {
          setFilterMenu(valueAllVoyages);
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
  }, [
    styleNameRoute,
    languageValue,
    isOpenDialog,
    valueTransaslantic,
    valueIntraamerican,
    valueAllVoyages,
    valueEnslaved,
    valueAfricanOrigin,
    valueEnslavedTexas,
    valueEnslavers,
  ]);

  useEffect(() => {
    const storedValue = localStorage.getItem(FILTER_OBJECT_KEY);
    if (!storedValue) return;

    const parsedValue = JSON.parse(storedValue);

    const filter: Filter[] = parsedValue.filter;
    const filterByVarName =
      filter?.length > 0 &&
      filter.find((filterItem) => filterItem.varName === varName);

    if (!filterByVarName) {
      dispatch(setTextFilter(''));
      return;
    }

    const autoValueList: string[] = filterByVarName.searchTerm as string[];
    let newTextValue: string = '';
    if (Array.isArray(autoValueList)) {
      const values = autoValueList.map<AutoCompleteOption>((item: string) => ({
        value: item,
      }));
      newTextValue = values.map((value) => value.value).join(', ');
    } else {
      newTextValue = autoValueList;
    }
    dispatch(setTextFilter(newTextValue));
    dispatch(setFilterObject(filter));
  }, [dispatch, varName]);

  const handleClickMenu = (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>,
    ops: string[],
    roles?: RolesProps[],
  ) => {
    const { value, type, label } = event.currentTarget.dataset;

    event.stopPropagation();
    setIsClickMenu(!isClickMenu);
    let opsValue = '';
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
            opsValue = 'icontains';
          } else if (ele === 'in') {
            opsValue = 'in';
          } else if (ele === 'exact') {
            opsValue = 'exact';
            dispatch(setOpsRole('exact'));
          }
        }
        setOps(opsValue);
      } else if (
        (ops === undefined && TYPES.IntegerField) ||
        TYPES.DecimalField
      ) {
        dispatch(setOpsRole('btw'));
      }
      dispatch(setLabelVarName(label));
      dispatch(setIsOpenDialog(true));
      if (roles) {
        if (listEnslavers.length > 0) {
          dispatch(setListEnslavers(listEnslavers));
        } else {
          dispatch(setEnslaversNameAndRole(roles));
          dispatch(setListEnslavers(roles));
        }
      }
    }
  };

  const handleCloseDialog = (event: any) => {
    event.stopPropagation();
    setTextError('');
    setTextRoleListError('');
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
    setTextError('');
    setTextRoleListError('');
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

  const handleApplyEnslaversDialog = (
    roles: RolesProps[],
    name: string,
    ops: string,
  ) => {
    if (roles.length === 0) {
      setTextRoleListError('*Please select the role(s) for this enslaver');
    }
    if (name === '') {
      setTextError(`*Please enter the enslaver's name`);
    }
    const newRoles: string[] = roles.map((ele) => ele.value);
    updatedEnslaversRoleAndNameToLocalStorage(
      dispatch,
      styleNameRoute!,
      newRoles as string[],
      name,
      varName,
      ops!,
    );
  };

  const handleApplyTextFilterDataDialog = (value: string) => {
    dispatch(setTextFilterValue(value));
    updateFilterTextDialog(
      dispatch,
      value,
      styleNameRoute!,
      varName,
      ops,
      opsRoles!,
      labelVarName,
    );
  };

  // Event handlers for apply button
  const handleApplyMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!isButtonDisabled) {
      const target = e.currentTarget;
      target.style.backgroundColor = getColorHoverBackgroundCollection(
        styleNameRoute!,
      );
      target.style.color = getColorBTNVoyageDatasetBackground(styleNameRoute!);
    }
  };

  const handleApplyMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!isButtonDisabled) {
      const target = e.currentTarget;
      target.style.backgroundColor = getColorBackground(styleNameRoute!);
      target.style.color = 'white';
    }
  };

  // Event handlers for reset button
  const handleResetMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = getColorHoverBackgroundCollection(
      styleNameRoute!,
    );
    target.style.color = getColorBTNVoyageDatasetBackground(styleNameRoute!);
  };

  const handleResetMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = 'transparent';
    target.style.color = 'black';
  };

  const handleSliderChangeMouseUp = () => {
    dispatch(
      setRangeSliderValue({
        ...rangeSliderMinMax,
        [varName]: currentSliderValue as number[],
      }),
    );
    updatedSliderToLocalStrage(currentSliderValue as number[]);
  };

  function updatedSliderToLocalStrage(updateValue: number[]) {
    const existingFilterObjectString = localStorage.getItem(FILTER_OBJECT_KEY);

    let existingFilterObject: any = {};

    if (existingFilterObjectString) {
      existingFilterObject = JSON.parse(existingFilterObjectString);
    }
    const existingFilters: Filter[] = existingFilterObject.filter || [];
    const existingFilterIndex = existingFilters.findIndex(
      (filter) => filter.varName === varName,
    );
    if (existingFilterIndex !== -1) {
      existingFilters[existingFilterIndex].searchTerm = updateValue as number[];
      existingFilters[existingFilterIndex].op = opsRoles!;
    } else {
      const newFilter: Filter = {
        varName: varName,
        searchTerm: updateValue!,
        op: opsRoles!,
        label: labelVarName,
      };
      existingFilters.push(newFilter);
    }
    const filterObjectUpdate = {
      filter: existingFilters,
    };
    const filterObjectString = JSON.stringify(filterObjectUpdate);
    dispatch(setFilterObject(existingFilters));
    localStorage.setItem('filterObject', filterObjectString);
    if (
      (styleNameRoute === TYPESOFDATASET.allVoyages ||
        styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved ||
        styleNameRoute === allEnslavers) &&
      existingFilters.length > 0
    ) {
      dispatch(setIsViewButtonViewAllResetAll(true));
    } else if (existingFilters.length > 1) {
      dispatch(setIsViewButtonViewAllResetAll(true));
    }
  }

  const renderDropdownMenu = (
    nodes: FilterMenu | ChildrenFilter | (FilterMenu | ChildrenFilter)[],
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
              key={`${menuLabel} - ${index}`}
              label={`${menuLabel}`}
              data-value={var_name}
              data-type={type}
              data-label={menuLabel}
              menu={renderDropdownMenu(children)}
            />
          );
        }
        return (
          <DropdownMenuItem
            key={`${menuLabel} - ${index}`}
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
          displayComponent = (
            <FilterTextBox
              handleKeyDownTextFilter={handleApplyTextFilterDataDialog}
              inputValue={inputValue}
              setInputValue={setInputValue}
              type={typeData}
            />
          );
        } else if (ops === 'in') {
          displayComponent = <AutoCompleteListBox />;
        }
        break;

      case TYPES.IdMatch:
        if (opsRoles === 'exact') {
          displayComponent = (
            <>
              <RadioSelected type={typeData} />
              <FilterTextBox
                handleKeyDownTextFilter={handleApplyTextFilterDataDialog}
                inputValue={inputValue}
                setInputValue={setInputValue}
                type={typeData}
              />
            </>
          );
        } else if (opsRoles === 'btw') {
          displayComponent = (
            <>
              <RadioSelected type={typeData} />
              <RangeSliderComponent
                handleSliderChangeMouseUp={handleSliderChangeMouseUp}
                setCurrentSliderValue={setCurrentSliderValue}
                currentSliderValue={currentSliderValue}
                minRange={minRange}
                maxRange={maxRange}
              />
            </>
          );
        }
        break;

      case TYPES.EnslaverNameAndRole:
        displayComponent = (
          <div>
            <FilterTextNameEnslaversBox
              setTextError={setTextError}
              textError={textError}
            />
            <RadioSelected type={typeData} />
            <SelectSearchDropdownEnslaversNameRole
              setTextRoleListError={setTextRoleListError}
              textRoleListError={textRoleListError}
            />
          </div>
        );
        break;

      case TYPES.IntegerField:
      case TYPES.DecimalField:
      case TYPES.FloatField:
        displayComponent = (
          <RangeSliderComponent
            handleSliderChangeMouseUp={handleSliderChangeMouseUp}
            setCurrentSliderValue={setCurrentSliderValue}
            currentSliderValue={currentSliderValue}
            minRange={minRange}
            maxRange={maxRange}
          />
        );
        break;

      case TYPES.MultiselectList:
        displayComponent = <SelectSearchDropdownList />;
        break;

      default:
        break;
    }
  }

  // Base button styles for filter menu items (Ant Design)
  const baseFilterButtonStyle = {
    color: '#000000',
    textTransform: 'none' as const,
    fontSize: '14px',
    background: 'none',
    border: 'none',
    boxShadow: 'none',
  };

  // Base button styles for modal actions (Ant Design)
  const baseApplyButtonStyle = {
    color: 'white',
    textTransform: 'unset' as const,
    height: '30px',
    cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
    backgroundColor: isButtonDisabled
      ? getColorHoverBackgroundCollection(styleNameRoute!)
      : getColorBackground(styleNameRoute!),
    fontSize: '0.80rem',
    border: 'none',
  };

  const baseResetButtonStyle = {
    color: 'black',
    textTransform: 'unset' as const,
    height: '30px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: `1px solid ${getColorBackground(styleNameRoute!)}`,
    fontSize: '0.80rem',
  };

  return (
    <div>
      <div className="filter-menu-bar">
        {filterMenu.map((item: FilterMenuList, index: number) => {
          const { var_name, label, type, ops } = item;
          const itemLabel = (label as LabelFilterMeneList)[languageValue];
          return var_name ? (
            <Button
              key={`${itemLabel} - ${index}`}
              data-value={var_name}
              data-type={type}
              data-label={itemLabel}
              onClick={(event: any) => handleClickMenu(event, ops!)}
              style={baseFilterButtonStyle}
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
              key={`${itemLabel} - ${index}`}
              trigger={
                <Button style={baseFilterButtonStyle}>
                  <Tooltip
                    placement="top"
                    title={`Filter by ${itemLabel}`}
                    color="rgba(0, 0, 0, 0.75)"
                  >
                    {itemLabel}
                  </Tooltip>
                  <span style={{ marginLeft: '8px' }}>
                    <CaretRightOutlined
                      style={{
                        display: window.innerWidth >= 768 ? 'none' : 'inline',
                        fontSize: 14,
                      }}
                    />
                    <CaretDownOutlined
                      style={{
                        display: window.innerWidth >= 768 ? 'inline' : 'none',
                        fontSize: 16,
                      }}
                    />
                  </span>
                </Button>
              }
              menu={renderDropdownMenu(item.children!)}
            />
          );
        })}
      </div>
      {/* Using Material-UI Dialog components as requested */}
      <Dialog
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          backdrop: {
            onClick: (e) => e.stopPropagation(),
          },
        }}
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
          <div style={{ fontSize: 16, fontWeight: 500 }}>
            {typeData === TYPES.EnslaverNameAndRole
              ? `Search for ${labelVarName}: `
              : labelVarName}
          </div>
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          {displayComponent}
        </DialogContent>
        <DialogActions
          style={{
            paddingRight: '2rem',
            marginTop: typeData === TYPES.EnslaverNameAndRole ? '10rem' : 0,
          }}
        >
          {varName &&
            ((typeData === TYPES.CharField && ops === 'icontains') ||
              (typeData === TYPES.IdMatch && opsRoles === 'exact') ||
              typeData === TYPES.EnslaverNameAndRole ||
              typeData === TYPES.MultiselectList) && (
              <Button
                disabled={isButtonDisabled}
                onClick={() => {
                  if (typeData === TYPES.EnslaverNameAndRole) {
                    handleApplyEnslaversDialog(
                      listEnslavers,
                      enslaverName,
                      opsRoles!,
                    );
                  } else {
                    handleApplyTextFilterDataDialog(inputValue);
                  }
                }}
                style={baseApplyButtonStyle}
                onMouseEnter={handleApplyMouseEnter}
                onMouseLeave={handleApplyMouseLeave}
              >
                Apply
              </Button>
            )}
          {varName && typeData === TYPES.IntegerField && (
            <Button
              disabled={isButtonDisabled}
              onClick={handleSliderChangeMouseUp}
              style={baseApplyButtonStyle}
              onMouseEnter={handleApplyMouseEnter}
              onMouseLeave={handleApplyMouseLeave}
            >
              Apply
            </Button>
          )}
          <Button
            onClick={handleResetDataDialog}
            style={baseResetButtonStyle}
            onMouseEnter={handleResetMouseEnter}
            onMouseLeave={handleResetMouseLeave}
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
