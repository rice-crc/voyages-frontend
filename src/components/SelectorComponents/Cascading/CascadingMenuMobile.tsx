/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
import { useState, MouseEvent, useEffect } from 'react';
import {
  Button,
  Modal,
  Dropdown,
  Space,
  MenuProps,
  Typography,
  theme,
} from 'antd';
import {
  FilterOutlined,
  LeftOutlined,
} from '@ant-design/icons';
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
import { setFilterObject, setIsFilter, setType } from '@/redux/getFilterSlice';
import {
  setEnslaversNameAndRole,
  setIsChange,
  setKeyValueName,
  setRangeSliderValue,
} from '@/redux/getRangeSliderSlice';
import { setIsOpenDialogMobile } from '@/redux/getScrollPageSlice';
import {
  setIsViewButtonViewAllResetAll,
  setLabelVarName,
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
import { checkRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import {
  getColorBackground,
  getColorBTNVoyageDatasetBackground,
  getColorHoverBackgroundCollection,
  getColorBoxShadow,
} from '@/utils/functions/getColorStyle';
import { updatedEnslaversRoleAndNameToLocalStorage } from '@/utils/functions/updatedEnslaversRoleAndNameToLocalStorage';

import GeoTreeSelected from '../../FilterComponents/GeoTreeSelect/GeoTreeSelected';
import { RadioSelected } from '../RadioSelected/RadioSelected';
import { SelectSearchDropdownEnslaversNameRole } from '../SelectDrowdown/SelectSearchDropdownEnslaversNameRole';
import { SelectSearchDropdownList } from '../SelectDrowdown/SelectSearchDropdownList';

const { Title } = Typography;

const CascadingMenuMobile = () => {
  const { token } = theme.useToken();
  const { styleName: styleNameRoute } = usePageRouter();

  const {
    valueTransaslantic,
    valueIntraamerican,
    valueAllVoyages,
    valueEnslaved,
    valueAfricanOrigin,
    valueEnslavedTexas,
    valueEnslavers,
  } = useSelector(
    (state: RootState) => state.getFilterMenuList.filterValueList,
  );
  const { type: typeData } = useSelector((state: RootState) => state.getFilter);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState,
  );
  const [textError, setTextError] = useState<string>('');
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
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const [textRoleListError, setTextRoleListError] = useState<string>('');
  const { isOpenDialogMobile } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState,
  );
  const rangeMinMax = rangeSliderMinMax?.[varName] ||
    rangeValue?.[varName] || [0, 0.5];
  const minRange = rangeValue?.[varName]?.[0] || 0;
  const maxRange = rangeValue?.[varName]?.[1] || 0;
  const [currentSliderValue, setCurrentSliderValue] = useState<
    number | number[]
  >(rangeMinMax);

  const { labelVarName, textFilter } = useSelector(
    (state: RootState) => state.getShowFilterObject,
  );
  const dispatch: AppDispatch = useDispatch();
  const [inputValue, setInputValue] = useState(textFilter);
  const [isClickMenu, setIsClickMenu] = useState<boolean>(false);
  const [filterMenu, setFilterMenu] = useState<FilterMenuList[]>([]);
  const [ops, setOps] = useState<string>('');
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
    isOpenDialogMobile,
    valueTransaslantic,
    valueIntraamerican,
    valueAllVoyages,
    valueEnslaved,
    valueAfricanOrigin,
    valueEnslavedTexas,
    valueEnslavers,
  ]);

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

  const handleApplyTextFilterDataDialog = (value: string) => {
    dispatch(setTextFilterValue(value));
    updateFilter(value);
  };

  const updateFilter = (newValue: string) => {
    const existingFilterObjectString = localStorage.getItem(FILTER_OBJECT_KEY);
    let existingFilters: Filter[] = [];

    if (existingFilterObjectString) {
      existingFilters = JSON.parse(existingFilterObjectString).filter || [];
    }

    const existingFilterIndex = existingFilters.findIndex(
      (filter) => filter.varName === varName,
    );

    if (newValue.length > 0) {
      if (existingFilterIndex !== -1) {
        existingFilters[existingFilterIndex].searchTerm =
          ops === 'icontains' || ops === 'exact'
            ? (newValue as string)
            : [newValue];
      } else {
        existingFilters.push({
          varName: varName,
          searchTerm:
            ops === 'icontains' || ops === 'exact'
              ? (newValue as string)
              : [newValue],
          op: ops,
          label: labelVarName,
        });
      }
    } else if (existingFilterIndex !== -1) {
      existingFilters[existingFilterIndex].searchTerm = [];
    }

    const filteredFilters = existingFilters.filter(
      (filter) =>
        !Array.isArray(filter.searchTerm) || filter.searchTerm.length > 0,
    );

    const filterObjectUpdate = {
      filter: filteredFilters,
    };

    const filterObjectString = JSON.stringify(filterObjectUpdate);
    localStorage.setItem('filterObject', filterObjectString);

    dispatch(setFilterObject(filteredFilters));
    if (
      (styleNameRoute === TYPESOFDATASET.allVoyages ||
        styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved ||
        styleNameRoute === allEnslavers) &&
      filteredFilters.length > 0
    ) {
      dispatch(setIsViewButtonViewAllResetAll(true));
    } else if (filteredFilters.length > 1) {
      dispatch(setIsViewButtonViewAllResetAll(true));
    }
  };

  const handleApplyEnslaversDialog = (
    roles: RolesProps[],
    name: string,
    ops: string,
  ) => {
    setTextError(textError);
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

  const handleClickMenu = (
    event: MouseEvent<HTMLDivElement>,
    value: string,
    type: string,
    label: string,
    ops: string[],
    roles?: RolesProps[],
  ) => {
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
          }
        }
        setOps(opsValue);
      }
      dispatch(setLabelVarName(label));
      dispatch(setIsOpenDialogMobile(true));
      if (roles) {
        dispatch(setEnslaversNameAndRole(roles));
      }
    }
  };

  const handleCloseDialog = () => {
    setIsClickMenu(!isClickMenu);
    dispatch(setIsOpenDialogMobile(false));
    dispatch(setIsFilter(false));
    if (currentPage !== 5) {
      dispatch(setIsChange(true));
      dispatch(setIsChangeAuto(true));
    }
  };

  const handleResetDataDialog = () => {
    setIsClickMenu(!isClickMenu);
    dispatch(setIsOpenDialogMobile(false));
    if (currentPage !== 5) {
      dispatch(setIsChange(true));
      dispatch(setIsChangeAuto(true));
    }
    dispatch(resetAll());
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
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

  let displayComponent: React.ReactNode;

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

  const createMenuItems = (nodes: FilterMenu[] | ChildrenFilter[]): MenuProps['items'] => {
    return nodes?.map((node: FilterMenu | ChildrenFilter, index: number) => {
      const { children, var_name, type, label: nodeLabel, ops, roles } = node;
      const menuLabel = (nodeLabel as LabelFilterMeneList)[languageValue];
      const hasChildren = children && children.length >= 1;
      
      if (hasChildren) {
        return {
          key: `${menuLabel}-${index}`,
          label: menuLabel,
          icon: <LeftOutlined style={{ fontSize: 12 }} />,
          children: createMenuItems(children),
        };
      }

      return {
        key: `${menuLabel}-${index}`,
        label: menuLabel,
        onClick: (event: any) => {
          event.domEvent.stopPropagation();
          handleClickMenu(
            event.domEvent,
            var_name,
            type,
            menuLabel,
            ops!,
            roles!
          );
        },
      };
    });
  };

  const menuItems: MenuProps['items'] = createMenuItems(filterMenu);

  const dropdownTrigger = (
    <Button
      type="text"
      icon={<FilterOutlined />}
      style={{
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0',
        fontSize: 15,
        fontWeight: 600,
        border: 'none',
        background: 'transparent',
        padding: '4px 8px',
      }}
      className="mobile-filter-button"
    >
      <Space>
        Filter Search
      </Space>
    </Button>
  );

  return (
    <>
      <div
        style={{
          display: 'block',
        }}
        className="mobile-filter-container"
      >
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomLeft"
          overlayStyle={{
            minWidth: 200,
          }}
        >
          {dropdownTrigger}
        </Dropdown>
      </div>

      <Modal
        title={
          <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
            {typeData === TYPES.EnslaverNameAndRole
              ? `Search for ${labelVarName}:`
              : labelVarName}
          </Title>
        }
        open={isOpenDialogMobile}
        onCancel={handleCloseDialog}
        width={600}
        centered
        maskClosable={false}
        destroyOnHidden
        styles={{
          body: {
            textAlign: 'center',
            marginTop: typeData === TYPES.EnslaverNameAndRole ? '2rem' : 0,
          }
        }}
        footer={[
          <Button
            key="reset"
            onClick={handleResetDataDialog}
            style={{
              color: 'black',
              backgroundColor: 'transparent',
              border: `1px solid ${getColorBackground(styleNameRoute!)}`,
              fontSize: '0.80rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = getColorHoverBackgroundCollection(styleNameRoute!);
              e.currentTarget.style.color = getColorBTNVoyageDatasetBackground(styleNameRoute!);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'black';
            }}
          >
            Reset
          </Button>,
          varName &&
          opsRoles !== 'btw' &&
          ((typeData === TYPES.CharField && ops === 'icontains') ||
            (typeData === TYPES.IdMatch && opsRoles === 'exact') ||
            typeData === TYPES.EnslaverNameAndRole ||
            typeData === TYPES.MultiselectList) && (
            <Button
              key="apply"
              type="primary"
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
              style={{
                color: 'white',
                height: 30,
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                backgroundColor: isButtonDisabled
                  ? getColorHoverBackgroundCollection(styleNameRoute!)
                  : getColorBackground(styleNameRoute!),
                fontSize: '0.80rem',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isButtonDisabled) {
                  e.currentTarget.style.backgroundColor = getColorHoverBackgroundCollection(styleNameRoute!);
                  e.currentTarget.style.color = getColorBTNVoyageDatasetBackground(styleNameRoute!);
                }
              }}
              onMouseLeave={(e) => {
                if (!isButtonDisabled) {
                  e.currentTarget.style.backgroundColor = getColorBackground(styleNameRoute!);
                  e.currentTarget.style.color = 'white';
                }
              }}
            >
              Apply
            </Button>
          ),
        ]}

      >
        {displayComponent}
      </Modal>

      <style>{`
        @media (min-width: 768px) {
          .mobile-filter-container {
            display: none !important;
          }
        }
        
        @media (max-width: 767px) {
          .mobile-filter-container {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default CascadingMenuMobile;