import {Tabs} from 'antd';
import '@/style/cards.scss';
import '@/style/estimates.scss';
import {setValueVariable} from '@/redux/getCardFlatObjectSlice';
import {useDispatch, useSelector} from 'react-redux';
import {styleCardEstimate} from '@/styleMUI';
import {Box} from '@mui/material';
import MAPComponents from '@/components/PresentationComponents/Map/MAPS';
import type {TabsProps} from 'antd';
import {useNavigate} from 'react-router-dom';
import {setCurrentBlockName} from '@/redux/getScrollEnslavedPageSlice';
import EstimateTable from './EstimateTable';
import TimeLineGraph from './TimeLineGraph';
import {ASSESSMENT, ESTIMATES} from '@/share/CONST_DATA';
import {usePageRouter} from '@/hooks/usePageRouter';
import {AppDispatch, RootState} from '@/redux/store';
import {translationLanguagesEstimatePage} from '@/utils/functions/translationLanguages';


const EstimatesTabs = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {currentBlockName} = usePageRouter();
    const {languageValue} = useSelector((state: RootState) => state.getLanguages);

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
                <Box sx={styleCardEstimate} className="estimate-tab" style={{zIndex: 3}}>
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
