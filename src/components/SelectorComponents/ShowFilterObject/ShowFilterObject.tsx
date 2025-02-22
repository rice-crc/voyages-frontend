import { usePageRouter } from '@/hooks/usePageRouter';
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
import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
interface ShowAllSelectedProps {
  handleViewAll: () => void;
  ariaExpanded?: boolean;
}
const ShowFilterObject: FunctionComponent<ShowAllSelectedProps> = ({
  handleViewAll,
}) => {
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const { styleName: styleNameRoute } = usePageRouter();
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState
  );
  const [filterData, setFilterData] = useState<
    {
      label: string;
      searchTerm:
        | number[]
        | string[]
        | CheckboxValueType[]
        | CheckboxValueType
        | RolesFilterProps[];
    }[]
  >([]);
  const translated = translationLanguagesEstimatePage(languageValue);

  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');
    if (!storedValue) return;

    const parsedValue = JSON.parse(storedValue);

    const filter: Filter[] = parsedValue.filter;
    const combinedData: {
      label: string;
      searchTerm:
        | number[]
        | string[]
        | CheckboxValueType[]
        | CheckboxValueType
        | RolesFilterProps[];
    }[] = [];
    if (Array.isArray(filter)) {
      filter.forEach((item) => {
        if (item.label) {
          const searchTermToUse = Array.isArray(item.title)
            ? item.title.join(', ')
            : Array.isArray(item.searchTerm)
            ? item.searchTerm.join(' - ')
            : item.searchTerm;
          combinedData.push({
            label: item.label!,
            searchTerm: searchTermToUse,
          });
        } else if (
          item &&
          Array.isArray(item.searchTerm) &&
          item.varName === 'EnslaverNameAndRole'
        ) {
          const roles = (item.searchTerm as RolesFilterProps[])
            .map((role) => role.roles.join(', '))
            .join(' - ');
          const names = (item.searchTerm as RolesFilterProps[])
            .map((role) => role.name)
            .join(' - ');
          const searchTermToUse = `${names} : ${roles}`;
          combinedData.push({
            label: `Enslavers`,
            searchTerm: searchTermToUse,
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
          });
        }
      });
    }
    setFilterData(combinedData);
  }, [varName, filtersObj]);

  return (
    <div
      id="panelCollapse"
      className="panel-list-view-all-show-filter"
      v-if="hasCurrentQuery"
      style={{ backgroundColor: getColorBackgroundHeader(styleNameRoute!) }}
    >
      <div className="panel-list-item-wrapper" style={{ display: 'flex' }}>
        {filterData.length > 0 &&
          filterData.map((item, index) => {
            const { label, searchTerm } = item;
            return (
              <span className="view-show-row" key={`${label}-${index}`}>
                <h4>{label} : </h4>
                <div className="value-list">{searchTerm as string}</div>
              </span>
            );
          })}
      </div>
      <div>
        <div className="btn-navbar-hide" onClick={handleViewAll}>
          <i
            className="fa fa-times-circle"
            style={{ paddingRight: 5 }}
            aria-hidden="true"
          ></i>
          {translated.hideText}
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default ShowFilterObject;
