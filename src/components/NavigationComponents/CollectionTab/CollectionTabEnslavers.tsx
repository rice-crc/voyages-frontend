import { Button, Hidden } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ButtonNav } from '@/styleMUI';
import {
  getColorBTNBackgroundEnslavers,
  getColorBTNVoyageDatasetBackground,
  getColorBoxShadowEnslavers,
  getColorHoverBackground,
  getColorHoverBackgroundCollection,
} from '@/utils/functions/getColorStyle';
import '@/style/page.scss';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import { ENSALVERSPAGE, PASTHOMEPAGE } from '@/share/CONST_DATA';
import { useNavigate } from 'react-router-dom';
import { setIsFilter } from '@/redux/getFilterSlice';
import { setCurrentBlockName } from '@/redux/getScrollEnslavedPageSlice';

const CollectionTabEnslavers = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { styleNamePeople, blocksPeople } = useSelector(
    (state: RootState) => state.getEnslaverDataSetCollections
  );
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );


  const handlePageNavigation = (page: number, blockName: string) => {
    console
    dispatch(setCurrentEnslaversPage(page));
    dispatch(setCurrentBlockName(blockName))
    if (page === 1) {
      dispatch(setIsFilter(false));
    } else if (page === 2) {
      navigate(`/${PASTHOMEPAGE}${ENSALVERSPAGE}`);
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
              <Button
                key={`${page}-${buttonIndex}`}
                onClick={() => handlePageNavigation(buttonIndex, page.toLowerCase())}
                sx={{
                  width: 75,
                  margin: '5px',
                  cursor: 'pointer',
                  backgroundColor: '#007269',
                  boxShadow: getColorBoxShadowEnslavers(styleNamePeople),
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  '&:hover': {
                    backgroundColor: getColorHoverBackgroundCollection(styleNamePeople),
                    color: getColorBTNVoyageDatasetBackground(styleNamePeople)
                  },
                  '&:disabled': {
                    backgroundColor: getColorBTNVoyageDatasetBackground(styleNamePeople),
                    color: '#fff',
                    boxShadow: getColorBoxShadowEnslavers(styleNamePeople),
                    cursor: 'not-allowed',
                  },
                }}
                variant={
                  currentEnslaversPage === buttonIndex
                    ? 'contained'
                    : 'outlined'
                }
              >
                {page.toUpperCase()}
              </Button>
            );
          })}
        </nav>
      </div>
    </Hidden>
  );
};

export default CollectionTabEnslavers;
