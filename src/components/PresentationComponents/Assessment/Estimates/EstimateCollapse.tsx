import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import TimeFrame from './TimeFrame';
import Regions from './Regions';
import Flag from './Flag';
import '@/style/estimates.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';

const EstimateCollapse: React.FC = () => {
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const translatedEstimates = translationLanguagesEstimatePage(languageValue);

  const items: CollapseProps['items'] = [
    {
      key: 'time_frame',
      label: (
        <div className="title-coallpse">{translatedEstimates.timeFrame}</div>
      ),
      children: (
        <div>
          <TimeFrame />
        </div>
      ),
    },
    {
      key: 'flag',
      label: (
        <div className="title-coallpse">{translatedEstimates.flagData}</div>
      ),
      children: (
        <div>
          <Flag />
        </div>
      ),
    },
    {
      key: 'regions',
      label: (
        <div className="title-coallpse">{translatedEstimates.regionsData}</div>
      ),
      children: (
        <div>
          <Regions />
        </div>
      ),
    },
  ];

  return (
    <Collapse
      expandIcon={({ isActive }) =>
        isActive ? <MinusOutlined /> : <PlusOutlined />
      }
      defaultActiveKey={['time_frame', 'flag']}
      expandIconPosition={'end'}
      items={items}
      className="trans-card-header"
    />
  );
};

export default EstimateCollapse;
