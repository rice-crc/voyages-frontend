import HeaderEnslavedNavBar from '@/components/NavigationComponents/Header/HeaderEnslavedNavBar';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import React from 'react';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import '@/style/page-past.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { createTopPositionEnslavedPage } from '@/utils/functions/createTopPositionEnslavedPage';
import EnslavedTable from '@/components/PresentationComponents/Tables/EnslavedTable';
import {
  pageVariantsFromBottom,
  pageVariantsFromTop,
} from '@/utils/functions/pageVariantsFromTop';
import CollectionTabEnslaved from '@/components/NavigationComponents/CollectionTab/CollectionTabEnslaved';
import EnslavedMap from '@/components/PresentationComponents/Map/MAPS';
import EnslavedIntro from '@/components/PresentationComponents/Intro/EnslavedIntro';

const EnslavedPage: React.FC = () => {
  const { isFilter } = useSelector((state: RootState) => state.getFilter);

  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const displayPage = (
    <motion.div
      initial={'initial'}
      animate={'animate'}
      variants={
        currentEnslavedPage - 1 > -1
          ? pageVariantsFromTop
          : pageVariantsFromBottom
      }
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {currentEnslavedPage === 1 && <EnslavedIntro />}
      {currentEnslavedPage === 2 && <EnslavedTable />}
      {currentEnslavedPage === 3 && <EnslavedMap />}
    </motion.div>
  );

  const topPosition = createTopPositionEnslavedPage(
    currentEnslavedPage,
    isFilter
  );
  return (
    <div id="enslaved-home-page">
      <HeaderLogoSearch />
      <HeaderEnslavedNavBar />
      <div
        className={currentEnslavedPage === 2 ? 'table-presentation' : ''}
        style={{
          position: 'relative',
          top: topPosition,
          padding: currentEnslavedPage !== 1 ? '0 20px' : '',
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
