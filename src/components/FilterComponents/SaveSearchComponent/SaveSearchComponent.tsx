import { StarOutlined } from "@mui/icons-material";
import '@/style/Nav.scss';
import { useEffect, useState } from "react";
import DropDownSaveSearch from "./DropDownSaveSearch";
import { usePageRouter } from "@/hooks/usePageRouter";
import { getColorHoverBackgroundCollection, getHeaderColomnColor } from "@/utils/functions/getColorStyle";
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Box } from "@mui/material";
import { SxProps } from '@mui/system';

const SaveSearchComponent = () => {
    const { styleName } = usePageRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen((prev) => !prev);
    };

    const handleClickAway = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const buttonColor = getHeaderColomnColor(styleName!);
        const buttonHover = getColorHoverBackgroundCollection(styleName!);
        document.documentElement.style.setProperty('--saveSearch--', buttonColor);
        document.documentElement.style.setProperty('--saveSearchHover--', buttonHover);
    }, [styleName]);


    const styles: SxProps = {
        position: 'absolute',
        top: 50,
        right: 0,
        zIndex: 2,
        border: '1px solid rgba(0,0,0,.15)',
        p: 1,
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: '14px 14px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.1);'

    };

    return (

        <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: 'relative' }} >
                <div onClick={handleClick} className="save-sarch-content"><StarOutlined /></div>
                {isOpen ? (
                    <Box sx={styles}>
                        <DropDownSaveSearch />
                    </Box>
                ) : null}
            </Box>
        </ClickAwayListener>
    );
};

export default SaveSearchComponent;
