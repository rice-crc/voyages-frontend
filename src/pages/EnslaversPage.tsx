import HeaderEnslaversNavBar from '@/components/NavigationComponents/Header/HeaderEnslaversNavBar';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import React, { useEffect } from 'react';
import CollectionTabEnslavers from '@/components/NavigationComponents/CollectionTab/CollectionTabEnslavers';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  pageVariantsFromBottom,
  pageVariantsFromTop,
} from '@/utils/functions/pageVariantsFromTop';
import EnslaversIntro from '@/components/PresentationComponents/Intro/EnslaversIntro';
import EnslaversTable from '@/components/PresentationComponents/Tables/EnslaversTable';
import { Grid } from '@mui/material';
import { createTopPositionEnslaversPage } from '@/utils/functions/createTopPositionEnslaversPage';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setCurrentBlockName } from '@/redux/getScrollEnslavedPageSlice';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import Tables from '@/components/PresentationComponents/Tables/Tables';

const EnslaversHomePage: React.FC = () => {
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );
  const { currentBlockName } = usePageRouter();

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {

    if (currentBlockName === 'intro') {
      dispatch(setCurrentEnslaversPage(1));
      dispatch(setCurrentBlockName(currentBlockName))
    } else if (currentBlockName === 'table') {
      dispatch(setCurrentEnslaversPage(2));
      dispatch(setCurrentBlockName(currentBlockName))
    }
  }, [currentBlockName]);
  const displayPage = (
    <motion.div
      initial={'initial'}
      animate={'animate'}
      variants={
        currentEnslaversPage - 1 > -1
          ? pageVariantsFromTop
          : pageVariantsFromBottom
      }
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >

      {currentEnslaversPage === 1 && currentBlockName === 'intro' && <EnslaversIntro />}
      {currentEnslaversPage === 2 && currentBlockName === 'table' && <Tables />}
      {/* {currentEnslaversPage === 2 && currentBlockName === 'table' && <EnslaversTable />} */}
    </motion.div>
  );

  const topPosition = createTopPositionEnslaversPage(
    currentEnslaversPage,
    isFilter
  );

  return (
    <div id="enslavers-home-page">
      <HeaderLogoSearch />
      <HeaderEnslaversNavBar />
      <div
        style={{
          position: 'relative',
          top: topPosition,
          padding: currentEnslaversPage !== 1 ? '0 20px' : '',
        }}
        id="content-container"
      >
        <CollectionTabEnslavers />
        <Grid id="content-container">{displayPage}</Grid>
      </div>
    </div>
  );
};

export default EnslaversHomePage;
