import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import voyageLogo from '@/assets/sv-logo.png';
import { resetAllStateToInitailState } from '@/redux/resetAllSlice';
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
import LanguagesDropdown from '@/components/SelectorComponents/DropDown/LanguagesDropdown';
import GlobalSearchButton from '@/components/PresentationComponents/GlobalSearch/GlobalSearchButton';
import AutoCompletedSearhBlog from '@/components/FilterComponents/AutoCompletedSearhBlog/AutoCompletedSearhBlog';

export default function HeaderLogoSearch() {
  const dispatch: AppDispatch = useDispatch();
  const { blogTitle, institutionName } = useParams();
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

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
    <>
      <div className="nav-blog-header-logo nav-blog-header-sticky-logo ">
        <Link
          to={'/'}
          style={{ textDecoration: 'none' }}
          onClick={onChangePath}
        >
          <img
            src={voyageLogo}
            alt={'voyages logo'}
            className='logo-blog'
          />
        </Link>
        <div>
          {!blogTitle && !institutionName && <LanguagesDropdown />}
          <div className="search-autocomplete-blog">
            {inputSearchValue ? (
              <GlobalSearchButton />
            ) : !blogTitle ? <AutoCompletedSearhBlog /> : ''}
          </div>
        </div>
      </div>
    </ >
  );
}
