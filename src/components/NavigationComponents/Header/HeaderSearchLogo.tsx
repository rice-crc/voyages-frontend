import { AppBar, Box, CssBaseline, Typography, Toolbar } from '@mui/material';
import { WHITE } from '@/styleMUI';
import LOGOVoyages from '@/assets/sv-logo_v2.svg';
import SearchVoyages from '@/assets/searchICON.svg';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { resetAll, resetAllStateToInitailState } from '@/redux/resetAllSlice';
import {
  setBlocksMenuList,
  setDataSetHeader,
  setStyleName,
  setTextIntro,
} from '@/redux/getDataSetCollectionSlice';
import jsonDataVoyageCollection from '@/utils/flatfiles/VOYAGE_COLLECTIONS.json';
import { setInputSearchValue } from '@/redux/getCommonGlobalSearchResultSlice';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/PEOPLE_COLLECTIONS.json';
import {
  setDataSetPeopleEnslavedHeader,
  setPeopleEnslavedBlocksMenuList,
  setPeopleEnslavedFilterMenuFlatfile,
  setPeopleEnslavedStyleName,
  setPeopleEnslavedTextIntro,
  setPeopleTableEnslavedFlatfile,
} from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import { setCurrentEnslavedPage } from '@/redux/getScrollEnslavedPageSlice';
import { setCurrentPage } from '@/redux/getScrollPageSlice';
import { resetBlockNameAndPageName } from '@/redux/resetBlockNameAndPageName';

export default function HeaderLogoSearch() {
  const dispatch: AppDispatch = useDispatch();
  const onChangePath = () => {
    dispatch(resetAllStateToInitailState());
    dispatch(resetBlockNameAndPageName())
    dispatch(setCurrentEnslavedPage(1));
    dispatch(setCurrentPage(1));
    dispatch(setInputSearchValue(''));
    dispatch(setDataSetHeader(jsonDataVoyageCollection[0].headers.label));
    dispatch(setTextIntro(jsonDataVoyageCollection[0].headers.text_introduce));
    dispatch(setStyleName(jsonDataVoyageCollection[0].style_name));
    dispatch(setBlocksMenuList(jsonDataVoyageCollection[0].blocks));
    dispatch(
      setDataSetPeopleEnslavedHeader(jsonDataPEOPLECOLLECTIONS[0].headers.label)
    );
    dispatch(
      setPeopleEnslavedTextIntro(
        jsonDataPEOPLECOLLECTIONS[0].headers.text_introduce
      )
    );
    dispatch(
      setPeopleEnslavedStyleName(jsonDataPEOPLECOLLECTIONS[0].style_name)
    );
    dispatch(
      setPeopleEnslavedBlocksMenuList(jsonDataPEOPLECOLLECTIONS[0].blocks)
    );
    dispatch(
      setPeopleEnslavedFilterMenuFlatfile(
        jsonDataPEOPLECOLLECTIONS[0].filter_menu_flatfile
      )
    );
    dispatch(
      setPeopleTableEnslavedFlatfile(
        jsonDataPEOPLECOLLECTIONS[0].table_flatfile
      )
    );
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };
  return (
    <Box>
      <CssBaseline />
      <AppBar
        component="nav"
        style={{
          backgroundColor: WHITE,
          zIndex: 100,
          boxShadow: 'none',
          height: 50,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography component="div" sx={{ cursor: 'pointer' }}>
            <Link
              to={'/'}
              style={{ textDecoration: 'none' }}
              onClick={onChangePath}
            >
              <img
                src={LOGOVoyages}
                alt="logo"
                style={{ position: 'relative', bottom: 5 }}
              />
            </Link>
          </Typography>

          <Typography component="div" sx={{ cursor: 'pointer' }}>
            <img src={SearchVoyages} alt="search" height={40} />
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
