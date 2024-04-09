import { MouseEventHandler, useEffect, useState } from 'react';
import { AppBar, Box, IconButton, Hidden, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import { MenuListDropdownStyle } from '@/styleMUI';
import { Menu, Typography } from '@mui/material';
import { AppDispatch, RootState } from '@/redux/store';
import { Filter, HeaderNavBarMenuProps } from '@/share/InterfaceTypes';
import CascadingMenu from '../../SelectorComponents/Cascading/CascadingMenu';
import { useDispatch, useSelector } from 'react-redux';
import { CurrentPageInitialState } from '@/share/InterfaceTypes';
import {
  setBaseFilterDataSetValue,
  setBlocksMenuList,
  setDataSetHeader,
  setStyleName,
  setTableVoyagesFlatfile,
  setTextIntro,
  setVoyagesFilterMenuFlatfile,
} from '@/redux/getDataSetCollectionSlice';
import {
  getColorHoverBackground,
  getColorNavbarBackground,
  getColorBoxShadow,
  getColorBTNVoyageDatasetBackground,
} from '@/utils/functions/getColorStyle';
import { HeaderTitle } from '@/components/NavigationComponents/Header/HeaderTitle';
import { DatasetButton } from '@/components/NavigationComponents/Header/DatasetButton';
import {
  BaseFilter,
  DataSetCollectionProps,
} from '@/share/InterfactTypesDatasetCollection';
import {
  ALLVOYAGES,
  ALLVOYAGESPAGE,
  AllVoyagesTitle,
  INTRAAMERICAN,
  INTRAAMERICANPAGE,
  IntraAmericanTitle,
  TRANSATLANTIC,
  TRANSATLANTICPAGE,
  TransAtlanticTitle,
  VOYAGETILE,
} from '@/share/CONST_DATA';
import '@/style/Nav.scss';
import { resetAll, resetAllStateToInitailState } from '@/redux/resetAllSlice';
import GlobalSearchButton from '../../PresentationComponents/GlobalSearch/GlobalSearchButton';
import { DrawerMenuBar } from './DrawerMenuBar';
import HeaderLogo from './HeaderLogo';
import ButtonDropdownColumnSelector from '@/components/SelectorComponents/ButtonComponents/ButtonDropdownColumnSelector';
import CascadingMenuMobile from '@/components/SelectorComponents/Cascading/CascadingMenuMobile';
import { setFilterObject } from '@/redux/getFilterSlice';
import { usePageRouter } from '@/hooks/usePageRouter';

export default function HeaderVoyagesNavBar(props: HeaderNavBarMenuProps) {
  const dispatch: AppDispatch = useDispatch();
  const { styleName: styleNameRoute } = usePageRouter()
  const navigate = useNavigate();
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  const { currentVoyageBlockName } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const { value, textHeader } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  useEffect(() => {
    if (styleNameRoute === TRANSATLANTIC) {
      dispatch(setDataSetHeader(TransAtlanticTitle))
    } else if (styleNameRoute === INTRAAMERICAN) {
      dispatch(setDataSetHeader(IntraAmericanTitle))
    } else if (styleNameRoute === ALLVOYAGES) {
      dispatch(setDataSetHeader(AllVoyagesTitle))
    }
  }, [])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);

  const styleNameToPathMap: { [key: string]: string } = {
    [ALLVOYAGES]: `${ALLVOYAGESPAGE}#${currentVoyageBlockName}`,
    [INTRAAMERICAN]: `${INTRAAMERICANPAGE}#${currentVoyageBlockName}`,
    [TRANSATLANTIC]: `${TRANSATLANTICPAGE}#${currentVoyageBlockName}`,
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

    dispatch(resetAll());
    const filters: Filter[] = [];
    if (styleName === ALLVOYAGES && currentVoyageBlockName === 'timelapse') {
      navigate(`${ALLVOYAGESPAGE}#voyages`);
    } else {
      dispatch(setBaseFilterDataSetValue(base_filter));
      for (const base of base_filter) {
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
      dispatch(setDataSetHeader(textHeder));
      dispatch(setTextIntro(textIntro));
      dispatch(setStyleName(styleName));
      dispatch(setBlocksMenuList(blocks));
      dispatch(setVoyagesFilterMenuFlatfile(filterMenuFlatfile!))
      dispatch(setTableVoyagesFlatfile(tableFlatfile!))
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
          backgroundColor: getColorNavbarBackground(styleNameRoute!),
          paddingTop: 5,
          zIndex: 5
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
            <span className='header-logo-icon'>
              <HeaderLogo />
              <HeaderTitle
                textHeader={textHeader}
                HeaderTitle={VOYAGETILE}
                pathLink={`${TRANSATLANTICPAGE}#voyages`}
                onClickReset={onClickReset}
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
                  paddingRight: 60,
                },
                margin: '6px 0',
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

              },
            }}
          >
            {value.map((item: DataSetCollectionProps, index: number) => {
              return (
                <DatasetButton
                  key={`${item}-${index}`}
                  item={item}
                  index={index}
                  handleSelectDataset={handleSelectDataset}
                  getColorBoxShadow={getColorBoxShadow}
                  getColorBTNBackground={getColorBTNVoyageDatasetBackground}
                  getColorHover={getColorHoverBackground}
                />
              );
            })}

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
          <ButtonDropdownColumnSelector />
        </MenuListDropdownStyle>
      </Menu>
    </Box>
  );
}
