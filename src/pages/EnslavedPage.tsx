import HeaderEnslavedNavBar from '@/components/NavigationComponents/Header/HeaderEnslavedNavBar';
import React, {useEffect} from 'react';
import {Grid} from '@mui/material';
import {motion} from 'framer-motion';
import '@/style/page-past.scss';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/redux/store';
import {
  pageVariantsFromBottom,
  pageVariantsFromTop,
} from '@/utils/functions/pageVariantsFromTop';
import CollectionTabEnslaved from '@/components/NavigationComponents/CollectionTab/CollectionTabEnslaved';
import EnslavedMap from '@/components/PresentationComponents/Map/MAPS';
import {usePageRouter} from '@/hooks/usePageRouter';
import {setPeopleEnslavedBlocksMenuList, setPeopleEnslavedStyleName} from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import {setCurrentBlockName, setCurrentEnslavedPage} from '@/redux/getScrollEnslavedPageSlice';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/people/people_collections.json';
import Tables from '@/components/PresentationComponents/Tables/Tables';

const EnslavedPage: React.FC = () => {
  const {styleName, currentBlockName} = usePageRouter();
  const dispatch: AppDispatch = useDispatch();
  const {currentEnslavedPage, currentPageBlockName} = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const {inputSearchValue} = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  useEffect(() => {
    if (styleName) {
      dispatch(setPeopleEnslavedStyleName(styleName));
    }
    if (currentBlockName === 'people') {
      dispatch(setCurrentEnslavedPage(1));
      dispatch(setCurrentBlockName(currentBlockName));
    } else if (currentBlockName === 'map') {
      dispatch(setCurrentEnslavedPage(2));
      dispatch(setCurrentBlockName(currentBlockName));
      dispatch(
        setPeopleEnslavedBlocksMenuList(jsonDataPEOPLECOLLECTIONS[1].blocks)
      );
    }
  }, [styleName, currentBlockName, currentEnslavedPage, currentPageBlockName]);



  const displayPage = (
    <motion.div
      initial={'initial'}
      animate={'animate'}
      variants={
        currentEnslavedPage - 1 > -1
          ? pageVariantsFromTop
          : pageVariantsFromBottom
      }
      transition={{duration: 0.5, ease: 'easeOut'}}
    >
      {currentEnslavedPage === 1 && currentPageBlockName === 'people' && <Tables />}
      {currentEnslavedPage === 2 && currentPageBlockName === 'map' && <EnslavedMap />}
    </motion.div>
  );

  return (
    <div id="enslaved-home-page" >
      <HeaderEnslavedNavBar />
      <div
        className={currentPageBlockName === 'people' ? 'table-presentation' : ''}
        style={{
          position: 'relative',
          padding: inputSearchValue ? '0 20px' : '',
          top: inputSearchValue ? 30 : 0
        }}
        id="content-container"
      >
        <CollectionTabEnslaved />
        <Grid id="content-container">{displayPage}</Grid>
      </div>
    </div>
  );
};

export default EnslavedPage;
