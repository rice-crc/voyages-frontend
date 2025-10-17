import { useEffect, useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { usePageRouter } from '@/hooks/usePageRouter';
import { setPathNameEnslaved } from '@/redux/getDataPathNameSlice';
import { setFilterObject, setIsFilter } from '@/redux/getFilterSlice';
import { setPeopleEnslavedBlocksMenuList } from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import {
  setCurrentBlockName,
  setCurrentEnslavedPage,
} from '@/redux/getScrollEnslavedPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { ALLENSLAVED } from '@/share/CONST_DATA';
import '@/style/page.scss';
import {
  LabelFilterMeneList,
  TYPESOFBLOCKENSLAVED,
  TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';
import { BlockCollectionProps } from '@/share/InterfactTypesDatasetCollection';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/people/people_collections.json';
import { checkBlockCollectionNameForEnslaved } from '@/utils/functions/checkBlockCollectionName';
import {
  getColorBTNBackgroundEnslaved,
  getColorBTNVoyageDatasetBackground,
  getColorBoxShadowEnslaved,
  getColorTextCollection,
  getColorHoverBackgroundCollection,
} from '@/utils/functions/getColorStyle';

const CollectionTabEnslaved = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  const { blocksPeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection,
  );
  const { styleName, currentBlockName } = usePageRouter();
  const { currentEnslavedPage, currentPageBlockName } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage,
  );
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );

  useEffect(() => {
    if (
      currentBlockName === 'table' &&
      styleName === TYPESOFDATASETPEOPLE.africanOrigins
    ) {
      dispatch(
        setPeopleEnslavedBlocksMenuList(jsonDataPEOPLECOLLECTIONS[1].blocks),
      );
    }
  }, [styleName, currentBlockName, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageNavigation = (page: number, blockName: string) => {
    if (page === 1) {
      dispatch(setIsFilter(false));
    }
    dispatch(setCurrentEnslavedPage(page));
    dispatch(setCurrentBlockName(blockName));
    if (page === 2) {
      dispatch(setPathNameEnslaved(ALLENSLAVED));
    }
    if (
      checkBlockCollectionNameForEnslaved(blockName) ===
      TYPESOFBLOCKENSLAVED.enslavedEN
    ) {
      navigate(`#${TYPESOFBLOCKENSLAVED.enslavedEN.toLowerCase()}`);
    } else if (
      checkBlockCollectionNameForEnslaved(blockName) ===
      TYPESOFBLOCKENSLAVED.mapEN
    ) {
      navigate(`#${TYPESOFBLOCKENSLAVED.mapEN.toLowerCase()}`);
    }
    dispatch(setFilterObject(filtersObj));
  };

  // Get current active block name for dropdown label
  const getCurrentBlockName = () => {
    const currentBlock = blocksPeople[currentEnslavedPage - 1];
    if (currentBlock) {
      const { label: block } = currentBlock;
      return (block as LabelFilterMeneList)[languageValue];
    }
    return 'Select Page';
  };

  // Create menu items for dropdown
  const menuItems = blocksPeople.map(
    (items: BlockCollectionProps, index: number) => {
      const { label: block } = items;
      const blockName = (block as LabelFilterMeneList)[languageValue];
      const newBlockName = blockName.toLowerCase().replace(/\s/g, '');
      const buttonIndex = index + 1;
      const isActive =
        currentPageBlockName ===
        checkBlockCollectionNameForEnslaved(newBlockName.toLocaleLowerCase());

      return {
        key: `${newBlockName}-${buttonIndex}`,
        label: blockName,
        onClick: () => handlePageNavigation(buttonIndex, newBlockName),
        style: {
          backgroundColor: isActive
            ? getColorBTNBackgroundEnslaved(styleName!)
            : 'transparent',
          color: isActive ? 'white' : getColorTextCollection(styleName!),
          fontWeight: isActive ? 'bold' : 600,
        },
      };
    },
  );

  const menu = <Menu items={menuItems} />;

  // Desktop version - vertical buttons
  if (isDesktop) {
    return (
      <div className="navbar-wrapper">
        <nav className="nav-button-enslaved">
          {blocksPeople.map((items: BlockCollectionProps, index: number) => {
            const { label: block } = items;
            const blockName = (block as LabelFilterMeneList)[languageValue];
            const newBlockName = blockName.toLowerCase().replace(/\s/g, '');
            const buttonIndex = index + 1;
            const isActive =
              currentPageBlockName ===
              checkBlockCollectionNameForEnslaved(
                newBlockName.toLocaleLowerCase(),
              );
            const isCurrentPage = currentEnslavedPage === buttonIndex;

            const baseButtonStyle = {
              width: '75px',
              margin: '5px',
              cursor: 'pointer',
              textTransform: 'unset' as const,
              backgroundColor: getColorBTNBackgroundEnslaved(styleName!),
              boxShadow: isActive
                ? getColorBoxShadowEnslaved(styleName!)
                : 'none',
              color: isActive ? 'white' : getColorTextCollection(styleName!),
              fontWeight: isActive ? 'bold' : 600,
              fontSize: '0.80rem',
              border: isCurrentPage
                ? `2px solid ${getColorBTNBackgroundEnslaved(styleName!)}`
                : '1px solid transparent',
            };

            const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
              const target = e.currentTarget;
              target.style.backgroundColor = getColorHoverBackgroundCollection(
                styleName!,
              );
              target.style.color = getColorBTNVoyageDatasetBackground(
                styleName!,
              );
            };

            const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
              const target = e.currentTarget;
              target.style.backgroundColor = getColorBTNBackgroundEnslaved(
                styleName!,
              );
              target.style.color = isActive
                ? 'white'
                : getColorTextCollection(styleName!);
            };

            const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
              const target = e.currentTarget;
              target.style.backgroundColor = getColorHoverBackgroundCollection(
                styleName!,
              );
              target.style.color = getColorBTNVoyageDatasetBackground(
                styleName!,
              );
              target.style.outline = 'none';
            };

            const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
              const target = e.currentTarget;
              target.style.backgroundColor = getColorBTNBackgroundEnslaved(
                styleName!,
              );
              target.style.color = isActive
                ? 'white'
                : getColorTextCollection(styleName!);
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
                {blockName}
              </Button>
            );
          })}
        </nav>
      </div>
    );
  }

  // Mobile version - dropdown menu
  return (
    <div className="navbar-wrapper-mobile-enslaved">
      <Dropdown
        overlay={menu}
        trigger={['click']}
        placement="bottomRight"
        getPopupContainer={(trigger) => trigger.parentElement || document.body}
        overlayStyle={{ zIndex: 10001 }}
      >
        <Button
          className="nav-dropdown-button-enslaved"
          style={{
            backgroundColor: getColorBTNBackgroundEnslaved(styleName!),
            color: 'white',
            fontWeight: 600,
            border: 'none',
          }}
        >
          {getCurrentBlockName()} <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default CollectionTabEnslaved;