import { Hidden } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentBlockName, setCurrentEnslavedPage } from '@/redux/getScrollEnslavedPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { ButtonNav } from '@/styleMUI';
import {
  getColorBTNBackgroundEnslaved,
  getColorBoxShadowEnslaved,
} from '@/utils/functions/getColorStyle';
import '@/style/page.scss';
import { setPathNameEnslaved } from '@/redux/getDataPathNameSlice';
import { ALLENSLAVED } from '@/share/CONST_DATA';
import { setIsFilter } from '@/redux/getFilterSlice';
import { useNavigate } from 'react-router-dom';

const CollectionTabEnslaved = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { styleNamePeople, blocksPeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );

  const handlePageNavigation = (page: number, blockName: string) => {
    if (page === 1) {
      dispatch(setIsFilter(false));
    }
    dispatch(setCurrentEnslavedPage(page));
    dispatch(setCurrentBlockName(blockName))
    if (page === 2) {
      dispatch(setPathNameEnslaved(ALLENSLAVED));
    }
    navigate(`#${(blockName).toLowerCase()}`)
  };

  return (
    <Hidden>
      <div className="navbar-wrapper">
        <nav className="nav-button-enslaved">
          {blocksPeople.map((page: string, index: number) => {
            const buttonIndex = index + 1;
            return (
              <ButtonNav
                key={`${page}-${buttonIndex}`}
                onClick={() => handlePageNavigation(buttonIndex, page.toLowerCase())}
                className="nav-button-page"
                style={{
                  backgroundColor:
                    getColorBTNBackgroundEnslaved(styleNamePeople),
                  boxShadow: getColorBoxShadowEnslaved(styleNamePeople),
                  fontSize: currentEnslavedPage === buttonIndex ? 15 : 14,
                  color:
                    currentEnslavedPage === buttonIndex ? 'white' : 'black',
                  fontWeight: currentEnslavedPage === buttonIndex ? 700 : 600,
                }}
                variant={
                  currentEnslavedPage === buttonIndex ? 'contained' : 'outlined'
                }
              >
                {page.toUpperCase()}
              </ButtonNav>
            );
          })}
        </nav>
      </div>
    </Hidden>
  );
};

export default CollectionTabEnslaved;
