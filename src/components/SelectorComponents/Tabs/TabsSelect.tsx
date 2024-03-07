import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import { Divider, Tabs } from 'antd';
import '@/style/cards.scss';
import { setValueVariable } from '@/redux/getCardFlatObjectSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { styleCard } from '@/styleMUI';
import { Box } from '@mui/material';
import VoyageCard from '@/components/PresentationComponents/Cards/Cards';
import VoyagesMaps from '@/components/PresentationComponents/Map/MAPS';
import type { TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { setCurrentBlockName } from '@/redux/getScrollEnslavedPageSlice';
import { usePageRouter } from '@/hooks/usePageRouter';
import { Dispatch } from '@reduxjs/toolkit';



const TabsSelect = () => {
    const { nodeTypeURL, voyageURLID } = usePageRouter();
    const dispatch: Dispatch = useDispatch();
    const { variable } = useSelector((state: RootState) => state.getCardFlatObjectData);
    const navigate = useNavigate();

    const onChange = (key: string) => {
        dispatch(setValueVariable(key))
        dispatch(setCurrentBlockName(key))
        navigate(`/${nodeTypeURL}/${voyageURLID}/${key}#${(key).toLowerCase()}`)
    };

    const items: TabsProps['items'] = [
        {
            key: 'variables',
            label: 'Variables',
            children: <Box sx={styleCard}> <VoyageCard /> </Box>,
        },
        {
            key: 'map',
            label: 'Map',
            children: <Box sx={styleCard} >  <VoyagesMaps /> </Box>,
        },
        {
            key: 'images',
            label: 'Images',
            children: <Box sx={styleCard} ><div style={{ height: 500 }}>No images are available.</div> </Box>,
        },
    ];
    return (
        <div>
            <Divider />
            <Tabs defaultActiveKey={variable} items={items}
                onChange={onChange}
                type="card" className='tab-container'

            />


        </div>

    )
}

export default TabsSelect
