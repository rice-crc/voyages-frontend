import React, { useState, FunctionComponent } from 'react';
import {
    Paper,
    Box,
    Tabs,
    Tab,
    Typography,
} from '@mui/material';
import RangeSlider from '../RangeSlider';
import { ChildrenNewObjectProp } from '../../share/InterfaceTypes';

interface MenuListBoxProps {
    listMenu: ChildrenNewObjectProp[];
    isOpen?: boolean;
    activeTab: number;
    idMenu:number;
    handleTabChange: (event: React.ChangeEvent<{}>, newValue: number) => void
    setRangeValue: React.Dispatch<React.SetStateAction<Record<string, number[]>>>;

}

const DropdownTEST: FunctionComponent<MenuListBoxProps> = (props) => {
    const { listMenu, isOpen,idMenu,  activeTab, handleTabChange,setRangeValue } = props;
    console.log('idMenu-->', idMenu)

    if(!listMenu){
        return <>Loading</>
    }

    return (
        <div>
            <Paper>
                <Box display="flex">
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={activeTab}
                        onChange={handleTabChange}
                    >
                        {listMenu.map((childItem, tabIndex) => {
                            return (
                                idMenu === childItem?.id  &&  <Tab key={tabIndex} label={childItem?.subMenu} />
                            )
                        })}
                    </Tabs>
                    <Box p={2}>
                        {listMenu.map((childItem, tabIndex) => {
                            console.log("childItem", childItem.varName)
                            return (
                                <div key={tabIndex} hidden={activeTab !== tabIndex}>
                                    {idMenu === childItem?.id &&  <Typography>{childItem.subMenu}</Typography>}
                                    {/* <RangeSlider
                                        keyOption={childItem.varName}
                                        setRangeValue={setRangeValue}
                                    /> */}
                                </div>
                            )
                        })}
                    </Box>
                </Box>
            </Paper>
        </div>
    );
};

export default DropdownTEST;