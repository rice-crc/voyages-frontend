import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setPathNameVoyages } from '@/redux/getDataPathNameSlice';
import { setFilterObject, setIsFilter } from '@/redux/getFilterSlice';
import { setCurrentPage } from '@/redux/getScrollPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { ALLVOYAGES, FILTER_OBJECT_KEY } from '@/share/CONST_DATA';
import {
  CurrentPageInitialState,
  Filter,
  LabelFilterMeneList,
  TYPESOFBLOCKVOYAGES,
} from '@/share/InterfaceTypes';
import '@/style/page.scss';
import { BlockCollectionProps } from '@/share/InterfactTypesDatasetCollection';
import { checkBlockCollectionNameForVoyages } from '@/utils/functions/checkBlockCollectionName';
import {
  getColorBTNVoyageDatasetBackground,
  getColorBackground,
  getColorBoxShadow,
  getColorTextCollection,
  getColorHoverBackgroundCollection,
} from '@/utils/functions/getColorStyle';

const CollectionTabVoyages = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { styleName, blocks } = useSelector(
    (state: RootState) => state.getDataSetCollection,
  );
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );

  const { currentPage, currentVoyageBlockName } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState,
  );

  const handlePageNavigation = (page: number, blockName: string) => {
    dispatch(setCurrentPage(page));
    if (page === 1) {
      dispatch(setIsFilter(false));
    } else if (page === 5) {
      dispatch(setPathNameVoyages(ALLVOYAGES));
    }
    if (
      checkBlockCollectionNameForVoyages(blockName) ===
      TYPESOFBLOCKVOYAGES.voyagesEN
    ) {
      navigate(`#${TYPESOFBLOCKVOYAGES.voyagesEN.toLowerCase()}`);
    } else if (
      checkBlockCollectionNameForVoyages(blockName) ===
      TYPESOFBLOCKVOYAGES.summaryStatisticsEN
    ) {
      navigate(`#${TYPESOFBLOCKVOYAGES.summaryStatisticsEN.toLowerCase()}`);
    } else if (
      checkBlockCollectionNameForVoyages(blockName) ===
      TYPESOFBLOCKVOYAGES.lineEN
    ) {
      navigate(`#${TYPESOFBLOCKVOYAGES.lineEN.toLowerCase()}`);
    } else if (
      checkBlockCollectionNameForVoyages(blockName) ===
      TYPESOFBLOCKVOYAGES.barEN
    ) {
      navigate(`#${TYPESOFBLOCKVOYAGES.barEN.toLowerCase()}`);
    } else if (
      checkBlockCollectionNameForVoyages(blockName) ===
      TYPESOFBLOCKVOYAGES.pieEN
    ) {
      navigate(`#${TYPESOFBLOCKVOYAGES.pieEN.toLowerCase()}`);
    } else if (
      checkBlockCollectionNameForVoyages(blockName) ===
      TYPESOFBLOCKVOYAGES.tableEN
    ) {
      navigate(`#${TYPESOFBLOCKVOYAGES.tableEN.toLowerCase()}`);
    } else if (
      checkBlockCollectionNameForVoyages(blockName) ===
      TYPESOFBLOCKVOYAGES.mapEN
    ) {
      navigate(`#${TYPESOFBLOCKVOYAGES.mapEN.toLowerCase()}`);
    } else if (
      checkBlockCollectionNameForVoyages(blockName) ===
      TYPESOFBLOCKVOYAGES.timeLapseEN
    ) {
      navigate(`#${TYPESOFBLOCKVOYAGES.timeLapseEN.toLowerCase()}`);
    }
    const storedValue = localStorage.getItem(FILTER_OBJECT_KEY);
    if (!storedValue) return;
    const parsedValue = JSON.parse(storedValue);
    const filter: Filter[] = parsedValue.filter;

    const filterObjectUpdate = {
      filter: filter,
    };
    dispatch(setFilterObject(filter));
    const filterObjectString = JSON.stringify(filterObjectUpdate);
    localStorage.setItem('filterObject', filterObjectString);
  };

  return (
    <div
      className="navbar-wrapper"
      style={{ display: window.innerWidth < 768 ? 'none' : 'block' }}
    >
      <nav className="nav-button">
        {blocks.map((items: BlockCollectionProps, index: number) => {
          const { label: block } = items;
          const blockName = (block as LabelFilterMeneList)[languageValue];
          const newBlockName = blockName.toLowerCase().replace(/\s/g, '');
          const buttonIndex = index + 1;
          const isActive =
            currentVoyageBlockName ===
            checkBlockCollectionNameForVoyages(
              newBlockName.toLocaleLowerCase(),
            );
          const isCurrentPage = currentPage === buttonIndex;

          // Base button styles
          const baseButtonStyle = {
            margin: '5px',
            cursor: 'pointer',
            textTransform: 'unset' as const,
            backgroundColor: getColorBackground(styleName),
            boxShadow: isActive ? getColorBoxShadow(styleName) : 'none',
            color: isActive ? 'white' : getColorTextCollection(styleName),
            fontWeight: isActive ? 'bold' : 600,
            fontSize: '0.80rem',
            border: isCurrentPage
              ? `2px solid ${getColorBackground(styleName)}`
              : '1px solid transparent',
          };

          // Event handlers for hover effects
          const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
            const target = e.currentTarget;
            target.style.backgroundColor = getColorHoverBackgroundCollection(
              styleName!,
            );
            target.style.color = getColorBTNVoyageDatasetBackground(styleName);
          };

          const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
            const target = e.currentTarget;
            target.style.backgroundColor = getColorBackground(styleName);
            target.style.color = isActive
              ? 'white'
              : getColorTextCollection(styleName);
          };

          const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
            const target = e.currentTarget;
            target.style.backgroundColor = getColorHoverBackgroundCollection(
              styleName!,
            );
            target.style.color = getColorBTNVoyageDatasetBackground(styleName);
            target.style.outline = 'none';
          };

          const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
            const target = e.currentTarget;
            target.style.backgroundColor = getColorBackground(styleName);
            target.style.color = isActive
              ? 'white'
              : getColorTextCollection(styleName);
          };

          return (
            <Button
              key={`${newBlockName}-${buttonIndex}`}
              onClick={() => handlePageNavigation(buttonIndex, newBlockName)}
              className="nav-button-page"
              type={isCurrentPage ? 'primary' : 'default'}
              style={baseButtonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <div style={{ textAlign: 'center' }}>{blockName}</div>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default CollectionTabVoyages;
