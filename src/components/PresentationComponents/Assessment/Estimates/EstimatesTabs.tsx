
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
import TablesEstimates from './TablesEstimates';
import TimeLineGraph from './TimeLineGraph';
import { ASSESSMENT, ESTIMATES } from '@/share/CONST_DATA';
import { usePageRouter } from "@/hooks/usePageRouter";
import { AppDispatch } from "@/redux/store";

const EstimatesTabs = () => {
    const navigate = useNavigate();
    const { currentBlockName } = usePageRouter();
    const dispatch: AppDispatch = useDispatch();

    const onChange = (key: string) => {
        dispatch(setValueVariable(key))
        dispatch(setCurrentBlockName(key))
        navigate(`/${ASSESSMENT}/${ESTIMATES}#${(key).toLowerCase()}`)
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
            children: <Box sx={styleCardEstimate} >  <TimeLineGraph /> </Box>,
        },
        {
            key: 'maps',
            label: 'Maps',
            children: <Box sx={styleCardEstimate} ><VoyagesMaps /> </Box>,
        },
    ];
    return (
        <div>
            <Tabs defaultActiveKey={currentBlockName} items={items}
                onChange={onChange}
                type="card"
            />
        </div>

    )
}

export default EstimatesTabs
