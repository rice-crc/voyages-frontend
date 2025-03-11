import HeaderEnslaversNavBar from '@/components/NavigationComponents/Header/HeaderEnslaversNavBar';
import React, { useEffect } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  pageVariantsFromBottom,
  pageVariantsFromTop,
} from '@/utils/functions/pageVariantsFromTop';
import { Grid } from '@mui/material';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setCurrentBlockName } from '@/redux/getScrollEnslavedPageSlice';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import Tables from '@/components/PresentationComponents/Tables/Tables';

const EnslaversHomePage: React.FC = () => {
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const { currentBlockName, endpointPeopleDirect } = usePageRouter();
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    if (currentBlockName === 'people') {
      dispatch(setCurrentEnslaversPage(1));
      dispatch(setCurrentBlockName(currentBlockName));
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
      {((currentEnslaversPage === 1 && currentBlockName === 'people') ||
        endpointPeopleDirect === 'past/enslaver') && <Tables />}
    </motion.div>
  );
  const headerHeight = 80
  return (
    <div className="flex flex-col h-screen">
      <HeaderEnslaversNavBar />
      <div className="flex-1 relative">
        <div
          className="overflow-auto"
          style={{
            height: `calc(100vh - ${headerHeight}px - 200px)`,
            paddingTop: inputSearchValue ? '0.5rem' : '0'
          }}
        >
          <Grid id="content-container">
            <motion.div
              initial="initial"
              animate="animate"
              variants={currentEnslaversPage - 1 > -1 ? pageVariantsFromTop : pageVariantsFromBottom}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {displayPage}
            </motion.div>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default EnslaversHomePage;
