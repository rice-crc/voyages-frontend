
import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import TimeFrame from './TimeFrame';
import Regions from './Regions';
import QueryLink from './QueryLink';
import Flag from './Flag';
import '@/style/estimates.scss'

const items: CollapseProps['items'] = [
    {
        key: 'time_frame',
        label: <div className='title-coallpse'>Time Frame</div>,
        children: <div><TimeFrame /></div>
    },
    {
        key: 'flag',
        label: <div className='title-coallpse'>Flag</div>,
        children: <div><Flag /></div>
    },
    {
        key: 'regions',
        label: <div className='title-coallpse'>Regions</div>,
        children: <div><Regions /></div>
    },
    {
        key: 'query_link',
        label: <div className='title-coallpse'>Create a Query Link</div>,
        children: <div><QueryLink /></div>
    },
];

const EstimateCollapse: React.FC = () => {

    return (
        <Collapse
            expandIcon={({ isActive }) => (
                isActive ? <MinusOutlined /> : <PlusOutlined />
            )}
            defaultActiveKey={['time_frame', 'flag']}
            expandIconPosition={'end'}
            items={items}
            className='trans-card-header'
        />
    );
};

export default EstimateCollapse;
