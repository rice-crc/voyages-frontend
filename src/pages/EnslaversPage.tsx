import HeaderEnslaversNavBar from '@/components/NavigationComponents/Header/HeaderEnslaversNavBar';
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
import { Grid } from '@mui/material';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setCurrentBlockName } from '@/redux/getScrollEnslavedPageSlice';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import Tables from '@/components/PresentationComponents/Tables/Tables';

const EnslaversHomePage: React.FC = () => {
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );
  const { currentBlockName } = usePageRouter();

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {

    // if (currentBlockName === 'intro') {
    //   dispatch(setCurrentEnslaversPage(1));
    //   dispatch(setCurrentBlockName(currentBlockName))
    // } else 
    if (currentBlockName === 'table') {
      dispatch(setCurrentEnslaversPage(1));
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

      {/* {currentEnslaversPage === 1 && currentBlockName === 'intro' && <EnslaversIntro />} */}
      {currentEnslaversPage === 1 && currentBlockName === 'table' && <Tables />}
    </motion.div>
  );


  return (
    <div id="enslavers-home-page">
      <HeaderEnslaversNavBar />
      <div
        style={{
          padding: '25px 20px',
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
