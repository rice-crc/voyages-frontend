import React from 'react';
import {Dialog, DialogTitle, DialogContent, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {PaperDraggableTimeLapse} from '@/components/SelectorComponents/Cascading/PaperDraggable';
import {PaperDraggableTimeLapseStyle, StyleDialog} from '@/styleMUI';
import '@/style/timelapse.scss';

interface TimelapseHelpDialogProps {
    open: boolean;
    onClose: () => void;
}

const TimelapseHelpDialog = ({open, onClose}: TimelapseHelpDialogProps): React.ReactElement => {
    return (
        <div>
            <Dialog open={open} onClose={onClose}
                BackdropProps={{
                    style: PaperDraggableTimeLapseStyle,
                }}
                className='leaflet-popup-timelapseHelpPopup'
                disableScrollLock={false}
                sx={StyleDialog}
                PaperComponent={PaperDraggableTimeLapse}
                aria-labelledby="draggable-dialog-title-timelapse"
            >
                <DialogTitle sx={{cursor: 'move'}} ><h2 className='header-timelapse'>About this Timelapse</h2>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton></DialogTitle>
                <DialogContent>
                    < div >
                        <p className='detail-timelapse'>
                            This timelapse offers an overall preview as well as demonstration of how the slave movement happened.
                            The results of any user query will display in this timelapse feature. Also, please note the following:
                        </p>
                        <h3 className='title-voyages'>Voyage Size</h3>
                        <p className='detail-timelapse'>
                            Each circle on this timelapse represents a single voyage and is both sized, according to the number of
                            captives on board, and colored, according to the three icons at the bottom left of the graph.
                        </p>
                        <h3 className='title-voyages'>Voyage Nationality</h3>
                        <p className='detail-timelapse'>
                            Each circle is color coded and the color code represents the nationality of the slave vessel, but users
                            can instead choose Region of Embarkation, or Region of Disembarkation by clicking on the icons to the
                            left of the graph.
                        </p>
                        <h3 className='title-voyages'>Voyage Details</h3>
                        <p className='detail-timelapse'>
                            To inspect details of an individual voyage, pause and click on a circle.
                        </p>
                    </div >
                </DialogContent>
            </Dialog>
        </div >
    );
};


export default TimelapseHelpDialog;
