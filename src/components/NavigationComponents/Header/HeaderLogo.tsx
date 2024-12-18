import { Box, CssBaseline, Typography } from '@mui/material';
import LOGOVoyagesPeople from '@/assets/sv-logo_v2.svg';
import LOGOVoyages from '@/assets/sv-logo.png';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { resetAllStateToInitailState } from '@/redux/resetAllSlice';
import {
  setBlocksMenuList,
  setDataSetHeader,
  setStyleName,
  setTextIntro,
} from '@/redux/getDataSetCollectionSlice';
import jsonDataVoyageCollection from '@/utils/flatfiles/voyages/voyages_collections.json';
import { setInputSearchValue } from '@/redux/getCommonGlobalSearchResultSlice';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/people/people_collections.json';
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
import '@/style/Nav.scss';
import { usePageRouter } from '@/hooks/usePageRouter';

export default function HeaderLogo() {
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = usePageRouter();
  const onChangePath = () => {
    dispatch(resetAllStateToInitailState());
    dispatch(resetBlockNameAndPageName());
    dispatch(setCurrentEnslavedPage(1));
    dispatch(setCurrentPage(1));
    dispatch(setInputSearchValue(''));
    dispatch(setDataSetHeader(jsonDataVoyageCollection[0].headers.label.en));
    dispatch(setTextIntro(jsonDataVoyageCollection[0].headers.text_introduce));
    dispatch(setStyleName(jsonDataVoyageCollection[0].style_name));
    dispatch(setBlocksMenuList(jsonDataVoyageCollection[0].blocks));
    dispatch(
      setDataSetPeopleEnslavedHeader(
        jsonDataPEOPLECOLLECTIONS[0].headers.label.en
      )
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
      <Typography component="div" sx={{ cursor: 'pointer' }}>
        <Link
          to={'/'}
          style={{ textDecoration: 'none' }}
          onClick={onChangePath}
        >
          <img
            className="logo-voyage"
            src={styleName === 'PastHomePage' ? LOGOVoyagesPeople : LOGOVoyages}
            alt="voyage logo"
          />
        </Link>
      </Typography>
    </Box>
  );
}
