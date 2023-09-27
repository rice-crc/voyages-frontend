import HeaderEnslaversNavBar from '@/components/NavigationComponents/Header/HeaderEnslaversNavBar';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import React from 'react';
import CollectionTabEnslavers from '@/components/NavigationComponents/CollectionTab/CollectionTabEnslavers';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  pageVariantsFromBottom,
  pageVariantsFromTop,
} from '@/utils/functions/pageVariantsFromTop';
import EnslaversIntro from '@/components/PresentationComponents/Intro/EnslaversIntro';
import EnslaversTable from '@/components/PresentationComponents/Tables/EnslaversTable';
import { Grid } from '@mui/material';
import { createTopPositionEnslaversPage } from '@/utils/functions/createTopPositionEnslaversPage';

const EnslaversHomePage: React.FC = () => {
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );

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
      {currentEnslaversPage === 1 && <EnslaversIntro />}
      {currentEnslaversPage === 2 && <EnslaversTable />}
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
