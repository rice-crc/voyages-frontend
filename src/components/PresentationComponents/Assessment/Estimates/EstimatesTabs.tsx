
import { Tabs } from 'antd';
import '@/style/cards.scss';
import '@/style/estimates.scss'
import { setValueVariable } from '@/redux/getCardFlatObjectSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { styleCardEstimate } from '@/styleMUI';
import { Box } from '@mui/material';
import VoyagesMaps from '@/components/PresentationComponents/Map/MAPS';
import type { TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { setCurrentBlockName } from '@/redux/getScrollEnslavedPageSlice';
import { Dispatch } from '@reduxjs/toolkit';
import TablesEstimates from './TablesEstimates';
import TimeLineGraph from './TimeLineGraph';
import TimeLineGraphTest from './TimeLineGraphTest';

const EstimatesTabs = () => {
    const dispatch: Dispatch = useDispatch();
    const { variable } = useSelector((state: RootState) => state.getCardFlatObjectData);
    const navigate = useNavigate();

    const onChange = (key: string) => {
        dispatch(setValueVariable(key))
        dispatch(setCurrentBlockName(key))
        navigate(`/assessment/estimates/#${(key).toLowerCase()}`)
    };

    const items: TabsProps['items'] = [
        {
            key: 'tables',
            label: 'Tables',
            children: <Box sx={styleCardEstimate}> <TablesEstimates /> </Box>,
        },
        {
            key: 'timeline',
            label: 'Timeline',
            // children: <Box sx={styleCardEstimate} >  <TimeLineGraph /> </Box>,
            children: <Box sx={styleCardEstimate} >  <TimeLineGraphTest /> </Box>,
        },
        {
            key: 'maps',
            label: 'Maps',
            children: <Box sx={styleCardEstimate} ><VoyagesMaps /> </Box>,
        },
    ];
    return (
        <div>
            <Tabs defaultActiveKey={variable} items={items}
                onChange={onChange}
                type="card"
            />
        </div>

    )
}

export default EstimatesTabs
