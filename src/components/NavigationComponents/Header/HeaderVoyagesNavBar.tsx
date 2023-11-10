import { MouseEventHandler, useState } from 'react';
import { AppBar, Box, IconButton, Hidden, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import { MenuListDropdownStyle } from '@/styleMUI';
import { Menu, Typography } from '@mui/material';
import { AppDispatch, RootState } from '@/redux/store';
import { HeaderNavBarMenuProps } from '@/share/InterfaceTypes';
import CanscandingMenu from '../../SelectorComponents/Cascading/CanscandingMenu';
import { useDispatch, useSelector } from 'react-redux';
import { CurrentPageInitialState } from '@/share/InterfaceTypes';
import { ColumnVoyagesSelector } from '../../SelectorComponents/ColumnSelectorTable/ColumnVoyagesSelector';
import {
  setBaseFilterDataKey,
  setBaseFilterDataSetValue,
  setBaseFilterDataValue,
  setBlocksMenuList,
  setDataSetHeader,
  setStyleName,
  setTableVoyagesFlatfile,
  setTextIntro,
  setVoyagesFilterMenuFlatfile,
} from '@/redux/getDataSetCollectionSlice';
import {
  getColorBackground,
  getColorHoverBackground,
  getColorNavbarBackground,
  getTextColor,
  getColorBoxShadow,
} from '@/utils/functions/getColorStyle';
import { HeaderTitle } from '@/components/NavigationComponents/Header/HeaderTitle';
import { FilterButton } from '@/components/SelectorComponents/ButtonComponents/FilterButton';
import { DatasetButton } from '@/components/NavigationComponents/Header/DatasetButton';
import {
  BaseFilter,
  DataSetCollectionProps,
} from '@/share/InterfactTypesDatasetCollection';
import {
  ALLVOYAGES,
  ALLVOYAGESPAGE,
  INTRAAMERICAN,
  INTRAAMERICANPAGE,
  TRANSATLANTIC,
  TRANSATLANTICPAGE,
  VOYAGESPAGE,
  VOYAGESTEXAS,
  VOYAGESTEXASPAGE,
  VOYAGETILE,
} from '@/share/CONST_DATA';
import CanscandingMenuVoyagesMobile from '../../SelectorComponents/Cascading/CanscandingMenuVoyagesMobile';
import '@/style/Nav.scss';
import { resetAll, resetAllStateToInitailState } from '@/redux/resetAllSlice';
import GlobalSearchButton from '../../PresentationComponents/GlobalSearch/GlobalSearchButton';
import { DrawerMenuBar } from './DrawerMenuBar';

export default function HeaderVoyagesNavBar(props: HeaderNavBarMenuProps) {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const { currentPage, currentVoyageBlockName } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { value, textHeader, styleName, } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);
  const styleNameToPathMap: { [key: string]: string } = {
    [ALLVOYAGES]: `/${VOYAGESPAGE}${ALLVOYAGESPAGE}#${currentVoyageBlockName}`,
    [INTRAAMERICAN]: `/${VOYAGESPAGE}${INTRAAMERICANPAGE}#${currentVoyageBlockName}`,
    [TRANSATLANTIC]: `/${VOYAGESPAGE}${TRANSATLANTICPAGE}#${currentVoyageBlockName}`,
    [VOYAGESTEXAS]: `/${VOYAGESPAGE}${VOYAGESTEXASPAGE}#${currentVoyageBlockName}`,

  };

  const handleSelectDataset = (
    base_filter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: string[],
    filterMenuFlatfile?: string,
    tableFlatfile?: string
  ) => {

    // dispatch(resetAll());
    for (const base of base_filter) {
      dispatch(setBaseFilterDataKey(base.var_name));
      dispatch(setBaseFilterDataValue(base.value));
    }
    dispatch(setBaseFilterDataSetValue(base_filter));
    dispatch(setDataSetHeader(textHeder));
    dispatch(setTextIntro(textIntro));
    dispatch(setStyleName(styleName));
    dispatch(setBlocksMenuList(blocks));
    dispatch(setVoyagesFilterMenuFlatfile(filterMenuFlatfile!))
    dispatch(setTableVoyagesFlatfile(tableFlatfile!))
    console.log({ base_filter })
    if (styleNameToPathMap[styleName]) {
      navigate(styleNameToPathMap[styleName]);
    }

    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const handleMenuFilterMobileClose = () => {
    setAnchorFilterMobileEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const onClickReset = () => {
    dispatch(resetAllStateToInitailState())
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <AppBar
        component="nav"
        style={{
          backgroundColor: getColorNavbarBackground(styleName),
          fontSize: 12,
          boxShadow: 'none',
          marginTop: '3rem',
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          <Hidden mdUp>
            <IconButton
              edge="start"
              color="default"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography
            component="div"
            sx={{
              flexGrow: 1,
              width: { xs: 200, sm: 220 },
              fontWeight: { sm: 600, md: 500 },
            }}
          >
            <HeaderTitle
              textHeader={textHeader}
              HeaderTitle={VOYAGETILE}
              pathLink={`${VOYAGESPAGE}${ALLVOYAGESPAGE}#intro`}
              onClickReset={onClickReset}
            />
            <Divider
              sx={{
                width: { xs: 300, sm: 400, md: 470, lg: 800, xl: 900 },
                borderWidth: '0.25px',
                borderClor: 'rgb(0 0 0 / 50%)',
              }}
            />
            <Typography
              component="div"
              variant="body1"
              fontWeight="500"
              sx={{
                alignItems: 'center',
                display: {
                  xs: 'none',
                  sm: 'none',
                  md: 'flex',
                  paddingRight: 40,
                },
                margin: '10px 0',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {inputSearchValue ? (
                <GlobalSearchButton />
              ) : (
                <FilterButton pathName={ALLVOYAGES} currentPage={currentPage} />
              )}
            </Typography>
          </Typography>
          <CanscandingMenuVoyagesMobile />
          <Box
            className="menu-nav-bar-select-box"
            sx={{
              display: {
                xs: 'none',
                sm: 'none',
                md: 'block',
                lg: 'block',
                textAlign: 'center',
                paddingRight: 40,
                fontWeight: 600,
                fontSize: 20,
              },
            }}
          >
            <Box
              className="menu-nav-bar-select"
              style={{ color: getTextColor(styleName) }}
            >
              Select dataset
            </Box>
            {value.map((item: DataSetCollectionProps, index: number) => {
              return (
                <DatasetButton
                  key={`${item}-${index}`}
                  item={item}
                  index={index}
                  handleSelectDataset={handleSelectDataset}
                  getColorBoxShadow={getColorBoxShadow}
                  getColorBTNBackground={getColorBackground}
                  getColorHover={getColorHoverBackground}
                />
              );
            })}
          </Box>
        </Toolbar>
        <Hidden mdDown>
          {currentPage !== 1 && isFilter && <CanscandingMenu />}
        </Hidden>
        <Box component="nav">
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClick={handleMenuClose}
            disableScrollLock={true}
          >
            <DrawerMenuBar
              value={value}
              handleSelectDataset={handleSelectDataset}
            />
          </Menu>
        </Box>
      </AppBar>
      <Menu
        anchorEl={anchorFilterMobileEl}
        open={Boolean(anchorFilterMobileEl)}
        onClick={handleMenuFilterMobileClose}
        disableScrollLock={true}
      >
        <MenuListDropdownStyle>
          <ColumnVoyagesSelector />
        </MenuListDropdownStyle>
      </Menu>
    </Box>
  );
}
