import { useEffect, useState } from 'react';
import '@/style/cards.scss';

import { Box } from '@mui/material';
import type { TabsProps } from 'antd';
import { Divider, Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import MetaTag from '@/components/MetaTag/MetaTag';
import VoyageCard from '@/components/PresentationComponents/Cards/Cards';
import MAPS from '@/components/PresentationComponents/Map/MAPS';
import { fetchVoyageCard } from '@/fetch/voyagesFetch/fetchVoyageCard';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setValueVariable } from '@/redux/getCardFlatObjectSlice';
import { setCurrentBlockName } from '@/redux/getScrollEnslavedPageSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { VOYAGESNODECLASS, VOYAGESNODE } from '@/share/CONST_DATA';
import { styleCard } from '@/styleMUI';

const TabsSelect = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentBlockName, voyageURLID: ID } = usePageRouter();
  const { variable, nodeTypeClass, cardRowID } = useSelector(
    (state: RootState) => state.getCardFlatObjectData,
  );

  const voyageId = cardRowID || ID;
  const initialTitle = voyageId
    ? `Voyage ${voyageId} - SlaveVoyages Database`
    : 'Slave Voyages Database';
  const initialDescription = voyageId
    ? `Explore detailed historical records for voyage ${voyageId}. View routes, dates, vessel information, and documentation from the SlaveVoyages database.`
    : 'Explore detailed records from the SlaveVoyages database.';

  const [pageTitle, setPageTitle] = useState(initialTitle);
  const [pageDescription, setPageDescription] = useState(initialDescription);
  const navigate = useNavigate();

  const fetchMap: Record<string, any> = {
    [VOYAGESNODECLASS]: fetchVoyageCard,
    [VOYAGESNODE]: fetchVoyageCard,
  };

  const titleMap: Record<string, (id: string) => string> = {
    [VOYAGESNODECLASS]: (id: string) => `Voyage ${id} - SlaveVoyages Database`,
    [VOYAGESNODE]: (id: string) => `Voyage ${id} - SlaveVoyages Database`,
  };

  useEffect(() => {
    const fetchData = async () => {
      const targetID = cardRowID || ID;
      if (!targetID) return;

      const fetchFn = fetchMap[nodeTypeClass];
      if (!fetchFn) return;

      try {
        const numericID =
          typeof targetID === 'string' ? parseInt(targetID) : targetID;
        const response = await dispatch(fetchFn(numericID)).unwrap();

        if (response?.data) {
          const title =
            titleMap[nodeTypeClass]?.(String(targetID)) ||
            'SlaveVoyages Database';

          const voyageData = response.data.voyage_dates;
          const description = `Detailed information about voyage ${targetID} from ${voyageData?.voyage_began_sparsedate?.date_str || 'unknown date'} to ${voyageData?.vessel_left_port_sparsedate?.date_str || 'unknown date'}. Historical slave voyage records and documentation.`;

          setPageTitle(title);
          setPageDescription(description);
        }
      } catch (error) {
        console.log('Error fetching page data:', error);
      }
    };

    fetchData();
  }, [dispatch, nodeTypeClass, cardRowID, ID]);

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
          <VoyageCard />
        </Box>
      ),
    },
    {
      key: 'map',
      label: 'Map',
      children: (
        <Box sx={styleCard}>
          <MAPS />
        </Box>
      ),
    },
    {
      key: 'images',
      label: 'Images',
      children: (
        <Box sx={styleCard}>
          <div style={{ height: 500 }}>No images are available.</div>
        </Box>
      ),
    },
  ];

  return (
    <div>
      <MetaTag pageDescription={pageDescription} pageTitle={pageTitle} />
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
