import { Divider, Tabs } from 'antd';
import '@/style/cards.scss';
import { setValueVariable } from '@/redux/getCardFlatObjectSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { styleCard } from '@/styleMUI';
import { Box } from '@mui/material';
import VoyageCard from '@/components/PresentationComponents/Cards/Cards';
import MAPS from '@/components/PresentationComponents/Map/MAPS';
import type { TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { setCurrentBlockName } from '@/redux/getScrollEnslavedPageSlice';
import { usePageRouter } from '@/hooks/usePageRouter';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { fetchVoyageCard } from '@/fetch/voyagesFetch/fetchVoyageCard';
import { fetchPastEnslavedCard } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedCard';
import { fetchPastEnslaversCard } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversCard';
import { VOYAGESNODECLASS, VOYAGESNODE, ENSLAVEDNODE, ENSLAVERSNODE } from '@/share/CONST_DATA';
import { AppDispatch } from '@/redux/store';

const TabsSelect = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentBlockName, voyageURLID: ID } = usePageRouter();
  const { variable, nodeTypeClass, cardRowID } = useSelector(
    (state: RootState) => state.getCardFlatObjectData
  );
  
  const [pageData, setPageData] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState('Slave Voyages Database');
  const [pageDescription, setPageDescription] = useState('Explore detailed records from the SlaveVoyages database.');

  const navigate = useNavigate();

  // Fetch the same data that VoyageCard fetches
  useEffect(() => {
    const fetchPageData = async () => {
      const targetID = cardRowID || ID;
      
      if (!targetID) return;
      
      try {
        let response = null;
        const numericID = typeof targetID === 'string' ? parseInt(targetID, 10) : targetID;
        
        switch (nodeTypeClass) {
          case VOYAGESNODECLASS:
          case VOYAGESNODE:
            response = await dispatch(fetchVoyageCard(numericID)).unwrap();
            break;
          case ENSLAVEDNODE:
            response = await dispatch(fetchPastEnslavedCard(numericID)).unwrap();
            break;
          case ENSLAVERSNODE:
            response = await dispatch(fetchPastEnslaversCard(numericID)).unwrap();
            break;
          default:
            response = null;
        }

        if (response && response.data) {
          setPageData(response.data);
          // Extract meaningful data for meta tags
          const title = extractTitle(response.data, nodeTypeClass, String(targetID));
          const description = extractDescription(response.data, nodeTypeClass, String(targetID));
          setPageTitle(title);
          setPageDescription(description);
        }
      } catch (error) {
        console.log('Error fetching page data:', error);
      }
    };

    fetchPageData();
  }, [dispatch, nodeTypeClass, cardRowID, ID]);

  // Helper functions to extract meaningful data
  const extractTitle = (data: any, nodeType: string, id: string) => {
    switch (nodeType) {
      case VOYAGESNODECLASS:
      case VOYAGESNODE:
        return `Voyage ${id} - SlaveVoyages Database`;
      case ENSLAVEDNODE:
        return `Enslaved Person ${id} - SlaveVoyages Database`;
      case ENSLAVERSNODE:
        return `Enslaver ${id} - SlaveVoyages Database`;
      default:
        return 'SlaveVoyages Database';
    }
  };

  const extractDescription = (data: any, nodeType: string, id: string) => {
    // Extract relevant information from the data
    if (data && data.length > 0) {
      const firstItem = data[0];
      // Try to find meaningful fields for description
      const summary = [];
      
      // Add basic information based on node type
      switch (nodeType) {
        case VOYAGESNODECLASS:
        case VOYAGESNODE:
          summary.push(`Detailed information about voyage ${id}`);
          break;
        case ENSLAVEDNODE:
          summary.push(`Detailed information about enslaved person ${id}`);
          break;
        case ENSLAVERSNODE:
          summary.push(`Detailed information about enslaver ${id}`);
          break;
      }
      
      summary.push('from the SlaveVoyages database with comprehensive historical records');
      return summary.join(' ');
    }
    return `Explore detailed records for ${nodeType} ${id} from the SlaveVoyages database.`;
  };

  const onChange = (key: string) => {
    dispatch(setValueVariable(key));
    dispatch(setCurrentBlockName(key));
    navigate(`/${nodeTypeClass}/${ID}#${key.toLowerCase()}`);
  };

  const items: TabsProps['items'] = [
    {
      key: 'variables',
      label: 'Variables',
      children: (
        <Box sx={styleCard}>
          {' '}
          <VoyageCard />{' '}
        </Box>
      ),
    },
    {
      key: 'map',
      label: 'Map',
      children: (
        <Box sx={styleCard}>
          {' '}
          <MAPS />{' '}
        </Box>
      ),
    },
    {
      key: 'images',
      label: 'Images',
      children: (
        <Box sx={styleCard}>
          <div style={{ height: 500 }}>No images are available.</div>{' '}
        </Box>
      ),
    },
  ];
  return (
    <div>
      <Helmet defer={false}>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>
      <Divider />
      <Tabs
        defaultActiveKey={variable || currentBlockName}
        items={items}
        onChange={onChange}
        type="card"
        className="tab-container"
      />
    </div>
  );
};

export default TabsSelect;
