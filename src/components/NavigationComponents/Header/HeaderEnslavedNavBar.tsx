import { MouseEventHandler, useEffect, useState } from 'react';
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
  getColorNavbarEnslavedBackground,
} from '@/utils/functions/getColorStyle';
import {
  AFRICANORIGINS,
  AFRICANORIGINSPAGE,
  ALLENSLAVEDPAGE,
  ENSALVEDPAGE,
  ENSLAVEDTEXASPAGE,
  PASTHOMEPAGE,
  ENSLAVEDTEXAS,
  ALLENSLAVED,
  AllEnslavedPeople,
  AfricanOriginsTransAtlantic,
  TEXBOUND,
} from '@/share/CONST_DATA';
import {
  BaseFilter,
  BlockCollectionProps,
  DataSetCollectionProps,
} from '@/share/InterfactTypesDatasetCollection';
import CascadingMenu from '@/components/SelectorComponents/Cascading/CascadingMenu';
import {
  setBaseFilterPeopleEnslavedDataSetValue,
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
import CascadingMenuMobile from '@/components/SelectorComponents/Cascading/CascadingMenuMobile';
import { setFilterObject } from '@/redux/getFilterSlice';
import { Filter, LabelFilterMeneList } from '@/share/InterfaceTypes';
import { usePageRouter } from '@/hooks/usePageRouter';
import LanguagesDropdown from '@/components/SelectorComponents/DropDown/LanguagesDropdown';
import { enslavedHeader } from '@/utils/languages/title_pages';
import DatabaseDropdown from '@/components/SelectorComponents/DropDown/DatabaseDropdown';


const HeaderEnslavedNavBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { styleName: styleNameRoute } = usePageRouter()
  const { currentPageBlockName } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );


  const { value, textHeader } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );

  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);


  const styleNameToPathMap: { [key: string]: string } = {
    [ALLENSLAVED]: `${ENSALVEDPAGE}${ALLENSLAVEDPAGE}#${currentPageBlockName}`,
    [AFRICANORIGINS]: `${ENSALVEDPAGE}${AFRICANORIGINSPAGE}#${currentPageBlockName}`,
    [ENSLAVEDTEXAS]: `${ENSALVEDPAGE}${ENSLAVEDTEXASPAGE}#${currentPageBlockName}`,
  };

  useEffect(() => {
    if (styleNameRoute === ALLENSLAVED) {
      dispatch(setDataSetPeopleEnslavedHeader(AllEnslavedPeople))
    } else if (styleNameRoute === AFRICANORIGINS) {
      dispatch(setDataSetPeopleEnslavedHeader(AfricanOriginsTransAtlantic))
    } else if (styleNameRoute === ENSLAVEDTEXAS) {
      dispatch(setDataSetPeopleEnslavedHeader(TEXBOUND))
    }
  }, [styleNameRoute])

  const handleSelectEnslavedDataset = (
    baseFilter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: BlockCollectionProps[],
    filterMenuFlatfile?: string,
    tableFlatfile?: string
  ) => {

    dispatch(resetAll());
    const filters: Filter[] = [];
    if (styleName === ALLENSLAVED && currentPageBlockName === 'people') {
      navigate(`/past/enslaved/all-enslaved#people`);
      dispatch(setFilterObject([]));
    } else {
      dispatch(setBaseFilterPeopleEnslavedDataSetValue(baseFilter));
      for (const base of baseFilter) {
        filters.push({
          varName: base.var_name,
          searchTerm: base.value,
          op: "in"
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
      dispatch(setDataSetPeopleEnslavedHeader(textHeder));
      dispatch(setPeopleEnslavedTextIntro(textIntro));
      dispatch(setPeopleEnslavedStyleName(styleName));
      dispatch(setPeopleEnslavedBlocksMenuList(blocks));
      dispatch(setPeopleEnslavedFilterMenuFlatfile(filterMenuFlatfile ? filterMenuFlatfile : '')
      );
      dispatch(
        setPeopleTableEnslavedFlatfile(tableFlatfile ? tableFlatfile : '')
      );

      if (styleNameToPathMap[styleName]) {
        navigate(styleNameToPathMap[styleName]);
      }
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
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);

  let EnslavedTitle = ''
  for (const header of enslavedHeader.header) {
    EnslavedTitle = (header.label as LabelFilterMeneList)[languageValue];
  }
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <AppBar
        component="nav"
        style={{
          backgroundColor: getColorNavbarEnslavedBackground(styleNameRoute!),
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
              width: { xs: 215, sm: 220 },
              fontWeight: { sm: 600, md: 500 },
            }}
          >
            <span className='header-logo-icon'>
              <HeaderLogo />
              <DatabaseDropdown
                onClickReset={onClickResetOnHeader}
              />
              <HeaderTitle
                textHeader={textHeader}
              />
            </span>
            <Typography
              component="div"
              variant="body1"
              fontWeight="500"
              sx={{
                display: {
                  xs: 'none',
                  sm: 'none',
                  md: 'flex',
                  paddingRight: 50,
                },
                margin: '5px 0',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {inputSearchValue && <GlobalSearchButton />}

            </Typography>
          </Typography>
          {!inputSearchValue && <CascadingMenuMobile />}

          <Box
            className="menu-nav-bar-select-box"
            sx={{
              display: {
                xs: 'none',
                sm: 'none',
                md: 'flex',
                lg: 'flex',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 600,
              },
            }}
          >
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
            <LanguagesDropdown />
          </Box>
        </Toolbar>
        <Divider
          sx={{
            borderWidth: '0.25px',
            borderClor: 'rgb(0 0 0 / 50%)',
          }}
        />
        <Hidden mdDown>
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
