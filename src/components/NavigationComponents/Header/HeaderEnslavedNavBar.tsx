import { MouseEventHandler, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { MenuListDropdownStyle } from '@/styleMUI';
import { Menu, Typography, AppBar, Box, IconButton, Hidden, Divider } from '@mui/material';
import { AppDispatch, RootState } from '@/redux/store';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getColorBTNBackgroundEnslaved,
  getColorBTNHoverEnslavedBackground,
  getColorBoxShadow,
  getColorBoxShadowEnslaved,
  getColorNavbarEnslavedBackground,
} from '@/utils/functions/getColorStyle';
import {
  AFRICANORIGINS,
  AFRICANORIGINSPAGE,
  ALLENSLAVEDPAGE,
  ENSALVEDPAGE,
  ENSLAVEDTEXASPAGE,
  EnslavedTitle,
  PASTHOMEPAGE,
  ENSLAVEDTEXAS,
  ALLENSLAVED,
} from '@/share/CONST_DATA';
import {
  BaseFilter,
  DataSetCollectionProps,
} from '@/share/InterfactTypesDatasetCollection';
import CanscandingMenu from '@/components/SelectorComponents/Cascading/CanscandingMenu';
import {
  setBaseFilterPeopleEnslavedDataKey,
  setBaseFilterPeopleEnslavedDataSetValue,
  setBaseFilterPeopleEnslavedDataValue,
  setDataSetPeopleEnslavedHeader,
  setPeopleEnslavedBlocksMenuList,
  setPeopleEnslavedFilterMenuFlatfile,
  setPeopleEnslavedStyleName,
  setPeopleEnslavedTextIntro,
  setPeopleTableEnslavedFlatfile,
} from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import { DrawerMenuBar } from '@/components/NavigationComponents/Header/DrawerMenuBar';
import { HeaderTitle } from '@/components/NavigationComponents/Header/HeaderTitle';
import { DatasetButton } from '@/components/NavigationComponents/Header/DatasetButton';
import '@/style/Nav.scss';
import { resetAll, resetAllStateToInitailState } from '@/redux/resetAllSlice';
import GlobalSearchButton from '@/components/PresentationComponents/GlobalSearch/GlobalSearchButton';
import '@/style/homepage.scss';
import { resetBlockNameAndPageName } from '@/redux/resetBlockNameAndPageName';
import HeaderLogo from './HeaderLogo';
import ButtonDropdownColumnSelector from '@/components/SelectorComponents/ButtonComponents/ButtonDropdownColumnSelector';
import CanscandingMenuMobile from '@/components/SelectorComponents/Cascading/CanscandingMenuMobile';
import { setFilterObject } from '@/redux/getFilterSlice';
import { Filter } from '@/share/InterfaceTypes';


const HeaderEnslavedNavBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { currentEnslavedPage, currentPageBlockName } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );

  const { value, textHeader, styleNamePeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  const styleNameToPathMap: { [key: string]: string } = {
    [ALLENSLAVED]: `/${PASTHOMEPAGE}${ENSALVEDPAGE}${ALLENSLAVEDPAGE}#${currentPageBlockName === 'map' ? 'table' : currentPageBlockName}`,
    [AFRICANORIGINS]: `/${PASTHOMEPAGE}${ENSALVEDPAGE}${AFRICANORIGINSPAGE}#${currentPageBlockName}`,
    [ENSLAVEDTEXAS]: `/${PASTHOMEPAGE}${ENSALVEDPAGE}${ENSLAVEDTEXASPAGE}#${currentPageBlockName === 'map' ? 'table' : currentPageBlockName}`,
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);
  const [isClick, setIsClick] = useState(false);

  const handleSelectEnslavedDataset = (
    baseFilter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: string[],
    filterMenuFlatfile?: string,
    tableFlatfile?: string
  ) => {
    const filters: Filter[] = [];
    dispatch(resetAll());
    dispatch(resetBlockNameAndPageName())
    setIsClick(!isClick);
    for (const base of baseFilter) {
      filters.push({
        varName: base.var_name,
        searchTerm: base.value,
        op: "in"
      })
      dispatch(setFilterObject(filters));
    }
    dispatch(setDataSetPeopleEnslavedHeader(textHeder));
    dispatch(setPeopleEnslavedTextIntro(textIntro));
    dispatch(setPeopleEnslavedStyleName(styleName));
    dispatch(setPeopleEnslavedBlocksMenuList(blocks));
    dispatch(
      setPeopleEnslavedFilterMenuFlatfile(
        filterMenuFlatfile ? filterMenuFlatfile : ''
      )
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



  const handleMenuFilterMobileClose = () => {
    setAnchorFilterMobileEl(null);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
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
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <AppBar
        component="nav"
        style={{
          backgroundColor: getColorNavbarEnslavedBackground(styleNamePeople),
          fontSize: 12,
          boxShadow: 'none',
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
              width: { xs: 215, sm: 220 },
              fontWeight: { sm: 600, md: 500 },
            }}
          >
            <span className='header-logo-icon'>
              <HeaderLogo />
              <HeaderTitle
                textHeader={textHeader}
                HeaderTitle={EnslavedTitle}
                pathLink={PASTHOMEPAGE}
                onClickReset={onClickResetOnHeader}
              />
            </span>

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
          <CanscandingMenuMobile />
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
            <Box className="menu-nav-bar-select" >
              Select dataset
            </Box>
            {value.map((item: DataSetCollectionProps, index: number) => (
              <DatasetButton
                key={`${item}-${index}`}
                item={item}
                index={index}
                handleSelectDataset={handleSelectEnslavedDataset}
                getColorBoxShadow={getColorBoxShadow}
                getColorBTNBackground={getColorBTNBackgroundEnslaved}
                getColorHover={getColorBTNHoverEnslavedBackground}
              />
            ))}
          </Box>
        </Toolbar>
        <Hidden mdDown>
          <CanscandingMenu />
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
              handleSelectDataset={handleSelectEnslavedDataset}
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
          <ButtonDropdownColumnSelector />
        </MenuListDropdownStyle>
      </Menu>
    </Box>
  );
};

export default HeaderEnslavedNavBar;
