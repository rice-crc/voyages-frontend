import { FunctionComponent, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { usePageRouter } from '@/hooks/usePageRouter';
import { setFilterObject } from '@/redux/getFilterSlice';
import { RootState } from '@/redux/store';
import {
  CheckboxValueType,
  Filter,
  FilterObjectsState,
  RolesFilterProps,
} from '@/share/InterfaceTypes';
import '@/style/estimates.scss';
import { getColorBackgroundHeader } from '@/utils/functions/getColorStyle';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';

export interface FilterDataItem {
  label: string;
  searchTerm:
    | number[]
    | string[]
    | CheckboxValueType[]
    | CheckboxValueType
    | RolesFilterProps[];
  varName: string;
  originalFilter: Filter;
}
interface ShowAllSelectedProps {
  handleViewAll: () => void;
  filterData: FilterDataItem[];
  setFilterData: React.Dispatch<React.SetStateAction<FilterDataItem[]>>;
  ariaExpanded?: boolean;
}

const ShowFilterObject: FunctionComponent<ShowAllSelectedProps> = ({
  handleViewAll,
  filterData,
  setFilterData,
}) => {
  const dispatch = useDispatch();
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const { styleName: styleNameRoute } = usePageRouter();
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  const translated = translationLanguagesEstimatePage(languageValue);

  const handleCloseFilter = (filterToRemove: FilterDataItem) => {
    const storedValue = localStorage.getItem('filterObject');
    if (!storedValue) return;

    const parsedValue = JSON.parse(storedValue);

    // Remove the specific filter from the array
    const updatedFilters = parsedValue.filter.filter((item: Filter) => {
      // Compare by varName and searchTerm to identify the exact filter
      return !(
        item.varName === filterToRemove.varName &&
        JSON.stringify(item.searchTerm) ===
          JSON.stringify(filterToRemove.originalFilter.searchTerm)
      );
    });

    // Update localStorage with the new filter array
    const updatedFilterObject = {
      ...parsedValue,
      filter: updatedFilters,
    };

    localStorage.setItem('filterObject', JSON.stringify(updatedFilterObject));

    // Update local state to reflect the change
    setFilterData((prev) => prev.filter((item) => item !== filterToRemove));

    // Update Redux state with the updated filters array
    dispatch(setFilterObject(updatedFilters));
  };

  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');
    if (!storedValue) return;

    const parsedValue = JSON.parse(storedValue);

    const filter: Filter[] = parsedValue.filter;
    const combinedData: FilterDataItem[] = [];

    if (Array.isArray(filter)) {
      filter.forEach((item) => {
        if (item.label) {
          const searchTermToUse = Array.isArray(item.title)
            ? item.title.join(', ')
            : Array.isArray(item.searchTerm)
              ? item.searchTerm.join(', ')
              : item.searchTerm;
          combinedData.push({
            label: item.label!,
            searchTerm: searchTermToUse,
            varName: item.varName,
            originalFilter: item,
          });
        } else if (
          item &&
          Array.isArray(item.searchTerm) &&
          item.varName === 'EnslaverNameAndRole'
        ) {
          const roles = (item.searchTerm as RolesFilterProps[])
            .map((role) => role.roles.join(', '))
            .join(', ');
          const names = (item.searchTerm as RolesFilterProps[])
            .map((role) => role.name)
            .join(', ');
          const searchTermToUse = `${names} : ${roles}`;
          combinedData.push({
            label: `Enslavers`,
            searchTerm: searchTermToUse,
            varName: item.varName,
            originalFilter: item,
          });
        } else if (
          item &&
          Array.isArray(item.searchTerm) &&
          item.varName === 'voyage_ship__imputed_nationality__name'
        ) {
          const names = (item.searchTerm as string[])
            .map((name) => name)
            .join(', ');
          combinedData.push({
            label: `Flag of vessel (IMP)`,
            searchTerm: names,
            varName: item.varName,
            originalFilter: item,
          });
        } else if (
          item &&
          Array.isArray(item.searchTerm) &&
          item.varName === 'voyage_ship__nationality_ship__name'
        ) {
          const names = (item.searchTerm as string[])
            .map((name) => name)
            .join(', ');
          combinedData.push({
            label: `Flag of vessel`,
            searchTerm: names,
            varName: item.varName,
            originalFilter: item,
          });
        }
      });
    }
    setFilterData(combinedData);
  }, [varName, filtersObj, setFilterData]);

  return (
    <div
      id="panelCollapse"
      className="panel-list-view-all-show-filter"
      style={{ backgroundColor: getColorBackgroundHeader(styleNameRoute!) }}
    >
      <div className="panel-list-item-wrapper">
        {filterData.length > 0 &&
          filterData.map((item, index) => {
            const { label, searchTerm } = item;
            return (
              <div className="panel-list-row" key={`${label}-${index}`}>
                <h4 className="panel-list-label">{label}:</h4>
                <div className="panel-list-value">{searchTerm as string}</div>
                <button
                  className="btn-close-filter"
                  onClick={() => handleCloseFilter(item)}
                  aria-label={`Remove ${label} filter`}
                  title={`Remove ${label} filter`}
                >
                  <i className="fa fa-times" aria-hidden="true"></i>
                </button>
              </div>
            );
          })}
      </div>
      {filterData.length > 0 ? (
        <div className="panel-list-item-hide">
          <button className="btn-navbar-hide" onClick={handleViewAll}>
            <i
              className="fa fa-times-circle"
              style={{ paddingRight: 5 }}
              aria-hidden="true"
            ></i>
            {translated.hideText}
            <div></div>
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ShowFilterObject;
