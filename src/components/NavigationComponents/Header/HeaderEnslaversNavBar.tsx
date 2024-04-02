import { MouseEventHandler, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Hidden, Divider, IconButton, } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { MenuListDropdownStyle } from '@/styleMUI';
import { Menu, Typography } from '@mui/material';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { ALLENSLAVERS, EnslaversTitle, INTRAAMERICANENSLAVERS, INTRAAMERICANTRADS, PASTHOMEPAGE, TRANSATLANTICENSLAVERS, TRANSATLANTICTRADS, allEnslavers } from '@/share/CONST_DATA';
import CascadingMenu from '@/components/SelectorComponents/Cascading/CascadingMenu';
import { HeaderTitle } from '@/components/NavigationComponents/Header/HeaderTitle';
import '@/style/Nav.scss';
import { resetAll, resetAllStateToInitailState } from '@/redux/resetAllSlice';
import GlobalSearchButton from '@/components/PresentationComponents/GlobalSearch/GlobalSearchButton';
import ButtonDropdownColumnSelector from '@/components/SelectorComponents/ButtonComponents/ButtonDropdownColumnSelector';
import CascadingMenuMobile from '@/components/SelectorComponents/Cascading/CascadingMenuMobile';
import HeaderLogo from './HeaderLogo';
import { BaseFilter, DataSetCollectionProps } from '@/share/InterfactTypesDatasetCollection';
import { DatasetButton } from './DatasetButton';
import { setFilterObject } from '@/redux/getFilterSlice';
import { Filter } from '@/share/InterfaceTypes';
import { getColorBTNVoyageDatasetBackground, getColorBoxShadow, getColorHoverBackground, getColorNavbarBackground } from '@/utils/functions/getColorStyle';
import { resetBlockNameAndPageName } from '@/redux/resetBlockNameAndPageName';
import { setBaseFilterEnslaversDataSetValue, setDataSetEnslaversHeader, setEnslaversBlocksMenuList, setEnslaversFilterMenuFlatfile, setEnslaversStyleName, setPeopleTableEnslavedFlatfile } from '@/redux/getPeopleEnslaversDataSetCollectionSlice';
import { useNavigate } from 'react-router-dom';
import { usePageRouter } from '@/hooks/usePageRouter';
import { DrawerMenuBar } from './DrawerMenuBar';

const HeaderEnslaversNavBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { value, textHeader } = useSelector(
    (state: RootState) => state.getEnslaverDataSetCollections
  );
  const { currentBlockName } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );
  const { styleName: styleNameRoute } = usePageRouter()
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );


  const [isClick, setIsClick] = useState(false);
  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);

  const handleMenuFilterMobileClose = () => {
    setAnchorFilterMobileEl(null);
  };

  const styleNameToPathMap: { [key: string]: string } = {
    [allEnslavers]: `${ALLENSLAVERS}/${allEnslavers}#${currentBlockName}`,
    [INTRAAMERICANTRADS]: `${ALLENSLAVERS}${INTRAAMERICANENSLAVERS}#${currentBlockName}`,
    [TRANSATLANTICTRADS]: `${ALLENSLAVERS}${TRANSATLANTICENSLAVERS}#${currentBlockName}`,
  };


  const onClickResetOnHeader = () => {

    dispatch(resetAll());
    dispatch(resetBlockNameAndPageName());
    dispatch(resetAllStateToInitailState())
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const handleSelectEnslaversDataset = (
    baseFilter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: string[],
    filterMenuFlatfile?: string,
    tableFlatfile?: string
  ) => {

    dispatch(resetAll());
    const filters: Filter[] = [];

    setIsClick(!isClick);
    dispatch(setBaseFilterEnslaversDataSetValue(baseFilter));

    for (const base of baseFilter) {
      filters.push({
        varName: base.var_name,
        searchTerm: base.value,
        op: "exact"
      })

      dispatch(setFilterObject(filters));
    }
    if (filters) {
      localStorage.setItem('filterObject', JSON.stringify({
        filter: filters
      }));
    } else {
      localStorage.setItem('filterObject', JSON.stringify({
        filter: filters
      }));
    }
    dispatch(setDataSetEnslaversHeader(textHeder));
    dispatch(setEnslaversStyleName(styleName));
    dispatch(setEnslaversBlocksMenuList(blocks));
    dispatch(setEnslaversFilterMenuFlatfile(filterMenuFlatfile ? filterMenuFlatfile : '')
    );
    dispatch(
      setPeopleTableEnslavedFlatfile(tableFlatfile ? tableFlatfile : '')
    );


    if (styleNameToPathMap[styleName]) {
      navigate(styleNameToPathMap[styleName]);
    }

    const keysToRemove = Object.keys(localStorage);

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <AppBar
        component="nav"
        className='nav-enslavers'
        style={{
          backgroundColor: getColorNavbarBackground(styleNameRoute!),
          paddingTop: 5,
          zIndex: 5
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          <Hidden mdUp>
            <IconButton
              edge="start"
              color="inherit"
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
            <span className='header-logo-icon'>
              <HeaderLogo />
              <HeaderTitle
                textHeader={textHeader}
                HeaderTitle={EnslaversTitle}
                pathLink={`/${PASTHOMEPAGE}`}
                onClickReset={onClickResetOnHeader}
              />
            </span>
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
              {inputSearchValue && <GlobalSearchButton />}
            </Typography>
          </Typography>
          {!inputSearchValue &&
            <CascadingMenuMobile />}
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
            {value.map((item: DataSetCollectionProps, index: number) => (
              <DatasetButton
                key={`${item}-${index}`}
                item={item}
                index={index}
                handleSelectDataset={handleSelectEnslaversDataset}
                getColorBoxShadow={getColorBoxShadow}
                getColorBTNBackground={getColorBTNVoyageDatasetBackground}
                getColorHover={getColorHoverBackground}
              />
            ))}
          </Box>
        </Toolbar>
        <Hidden mdDown>
          <Divider
            sx={{
              borderWidth: '0.25px',
              borderClor: 'rgb(0 0 0 / 50%)',
            }}
          />
          {!inputSearchValue &&
            <CascadingMenu />}
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
              handleSelectDataset={handleSelectEnslaversDataset}
            />
          </Menu>
        </Box>
      </AppBar>
      <Menu
        disableScrollLock={true}
        anchorEl={anchorFilterMobileEl}
        open={Boolean(anchorFilterMobileEl)}
        onClick={handleMenuFilterMobileClose}
      >
        <MenuListDropdownStyle>
          <ButtonDropdownColumnSelector />
        </MenuListDropdownStyle>
      </Menu>
    </Box>
  );
};

export default HeaderEnslaversNavBar;

