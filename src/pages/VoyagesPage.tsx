import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CurrentPageInitialState } from '@/share/InterfaceTypes';
import '@/style/page.scss';
import { getColorVoyagePageBackground } from '@/utils/functions/getColorStyle';
import {
  pageVariantsFromBottom,
  pageVariantsFromTop,
} from '@/utils/functions/pageVariantsFromTop';
import HeaderVoyagesNavBar from '@/components/NavigationComponents/Header/HeaderVoyagesNavBar';
import VoyagesIntro from '@/components/PresentationComponents/Intro/VoyagesIntro';
import VoyagesTable from '@/components/PresentationComponents/Tables/VoyagesTable';
import Scatter from '@/components/PresentationComponents/Scatter/Scatter';
import BarGraph from '@/components/PresentationComponents/BarGraph/BarGraph';
import PieGraph from '@/components/PresentationComponents/PieGraph/PieGraph';
import PivotTables from '@/components/PresentationComponents/PivotTables/PivotTables';
import VoyagesMaps from '@/components/PresentationComponents/Map/MAPS';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import CollectionTabVoyages from '@/components/NavigationComponents/CollectionTab/CollectionTabVoyages';

const VoyagesPage = () => {
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const displayPage = (
    <motion.div
      initial={'initial'}
      animate={'animate'}
      variants={
        currentPage - 1 > -1 ? pageVariantsFromTop : pageVariantsFromBottom
      }
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {currentPage === 1 && <VoyagesIntro />}
      {currentPage === 2 && <VoyagesTable />}
      {currentPage === 3 && <Scatter />}
      {currentPage === 4 && <BarGraph />}
      {currentPage === 5 && <PieGraph />}
      {currentPage === 6 && <PivotTables />}
      {currentPage === 7 && <VoyagesMaps />}
    </motion.div>
  );

  return (
    <>
      <HeaderLogoSearch />
      <HeaderVoyagesNavBar />
      <div
        className="voyages-home-page"
        style={{
          backgroundColor: getColorVoyagePageBackground(styleName, currentPage),
          position: 'relative',
          padding: currentPage !== 1 ? '30px' : '',
        }}
        id="content-container"
      >
        <CollectionTabVoyages />
        <Grid id="content-container">{displayPage}</Grid>
      </div>
    </>
  );
};

export default VoyagesPage;
