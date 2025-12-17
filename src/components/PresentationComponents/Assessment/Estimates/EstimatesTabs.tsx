import '@/style/cards.scss';
import '@/style/estimates.scss';
import { Box } from '@mui/material';
import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import MAPComponents from '@/components/PresentationComponents/Map/MAPS';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setValueVariable } from '@/redux/getCardFlatObjectSlice';
import { setCurrentBlockName } from '@/redux/getScrollEnslavedPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { ASSESSMENT, ESTIMATES } from '@/share/CONST_DATA';
import { styleCardEstimate } from '@/styleMUI';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';

import EstimateTable from './EstimateTable';
import TimeLineGraph from './TimeLineGraph';

const EstimatesTabs = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { currentBlockName } = usePageRouter();
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );

  const onChange = (key: string) => {
    dispatch(setValueVariable(key));
    dispatch(setCurrentBlockName(key));
    navigate(`/${ASSESSMENT}/${ESTIMATES}#${key.toLowerCase()}`);
  };

  const translatedEstimates = translationLanguagesEstimatePage(languageValue);

  const items: TabsProps['items'] = [
    {
      key: 'tables',
      label: translatedEstimates.tabTable,
      children: (
        <Box sx={styleCardEstimate} className="estimate-tab">
          <EstimateTable />{' '}
        </Box>
      ),
    },
    {
      key: 'timeline',
      label: translatedEstimates.tabtimeLine,
      children: (
        <Box sx={styleCardEstimate} className="estimate-tab">
          {' '}
          <TimeLineGraph />{' '}
        </Box>
      ),
    },
    {
      key: 'maps',
      label: translatedEstimates.tabMap,
      children: (
        <Box
          sx={styleCardEstimate}
          className="estimate-tab"
          style={{ zIndex: 3 }}
        >
          <MAPComponents />{' '}
        </Box>
      ),
    },
  ];
  return (
    <Tabs
      defaultActiveKey={currentBlockName}
      items={items}
      onChange={onChange}
      type="card"
      className="estimate-tab"
    />
  );
};

export default EstimatesTabs;
