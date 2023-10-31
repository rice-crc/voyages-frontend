import { MouseEventHandler, useState } from 'react';
import { AppBar, Box, IconButton, Hidden, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { MenuListDropdownStyle } from '@/styleMUI';
import { Menu, Typography } from '@mui/material';
import { AppDispatch, RootState } from '@/redux/store';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getColorBTNBackgroundEnslaved,
  getColorBTNHoverEnslavedBackground,
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
import CanscandingMenuEnslavedMobile from '@/components/SelectorComponents/Cascading/CanscandingMenuEnslavedMobile';
import ButtonDropdownSelectorEnslaved from '../../SelectorComponents/ButtonComponents/ButtonDropdownSelectorColumnEnslaved';
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
import { FilterButton } from '@/components/SelectorComponents/ButtonComponents/FilterButton';
import { DatasetButton } from '@/components/NavigationComponents/Header/DatasetButton';
import '@/style/Nav.scss';
import { resetAll } from '@/redux/resetAllSlice';
import GlobalSearchButton from '@/components/PresentationComponents/GlobalSearch/GlobalSearchButton';
import '@/style/homepage.scss';
import { resetBlockNameAndPageName } from '@/redux/resetBlockNameAndPageName';
import { usePageRouter } from '@/hooks/usePageRouter';


const HeaderEnslavedNavBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlockName } = usePageRouter()


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
    [ALLENSLAVED]: `/${PASTHOMEPAGE}${ENSALVEDPAGE}${ALLENSLAVEDPAGE}#${currentPageBlockName === 'map' ? 'intro' : currentPageBlockName}`,
    [AFRICANORIGINS]: `/${PASTHOMEPAGE}${ENSALVEDPAGE}${AFRICANORIGINSPAGE}#${currentPageBlockName}`,
    [ENSLAVEDTEXAS]: `/${PASTHOMEPAGE}${ENSALVEDPAGE}${ENSLAVEDTEXASPAGE}#${currentPageBlockName === 'map' ? 'intro' : currentPageBlockName}`,
  };


  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider
  );
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );
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
    dispatch(resetAll());
    dispatch(resetBlockNameAndPageName())
    setIsClick(!isClick);
    for (const base of baseFilter) {
      dispatch(setBaseFilterPeopleEnslavedDataKey(base.var_name));
      dispatch(setBaseFilterPeopleEnslavedDataValue(base.value));
      dispatch(setPeopleEnslavedStyleName(styleName));
    }
    dispatch(setBaseFilterPeopleEnslavedDataSetValue(baseFilter));
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

  const handleResetAll = () => {
    dispatch(resetAll());
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
  const onClickResetOnHeader = () => {
    dispatch(resetAll());
    dispatch(resetBlockNameAndPageName());
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
          marginTop: '3rem',
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
            <HeaderTitle
              textHeader={textHeader}
              HeaderTitle={EnslavedTitle}
              pathLink={PASTHOMEPAGE}
              onClickReset={onClickResetOnHeader}
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
                <span className='reset-filter'>
                  <FilterButton
                    pathName={ALLENSLAVED}
                    currentPageBlockName={currentPageBlockName}
                    currentPage={currentEnslavedPage}
                  />
                  {(varName !== '' || (clusterNodeKeyVariable && clusterNodeValue)) && (
                    <div className="btn-navbar-reset-all" onClick={handleResetAll}>
                      <i aria-hidden="true" className="fa fa-times"></i>
                      <span>Reset all</span>
                    </div>
                  )}
                </span>

              )}
            </Typography>
          </Typography>
          <CanscandingMenuEnslavedMobile />
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
            <Box className="menu-nav-bar-select" style={{ color: '#000000' }}>
              Select dataset
            </Box>
            {value.map((item: DataSetCollectionProps, index: number) => (
              <DatasetButton
                key={`${item}-${index}`}
                item={item}
                index={index}
                handleSelectDataset={handleSelectEnslavedDataset}
                getColorBoxShadow={getColorBoxShadowEnslaved}
                getColorBTNBackground={getColorBTNBackgroundEnslaved}
                getColorHover={getColorBTNHoverEnslavedBackground}
              />
            ))}
          </Box>
        </Toolbar>
        <Hidden mdDown>
          {currentPageBlockName !== 'intro' && isFilter && <CanscandingMenu />}
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
          <ButtonDropdownSelectorEnslaved />
        </MenuListDropdownStyle>
      </Menu>
    </Box>
  );
};

export default HeaderEnslavedNavBar;
