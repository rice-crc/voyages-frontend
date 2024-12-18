import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PaperDraggableTimeLapse } from '@/components/SelectorComponents/Cascading/PaperDraggable';
import { PaperDraggableTimeLapseStyle, StyleDialog } from '@/styleMUI';
import '@/style/timelapse.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { translationLanguagesTimelapse } from '@/utils/functions/translationLanguages';

interface TimelapseHelpDialogProps {
  open: boolean;
  onClose: () => void;
}

const TimelapseHelpDialog = ({
  open,
  onClose,
}: TimelapseHelpDialogProps): React.ReactElement => {
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const translatedTimelapse = translationLanguagesTimelapse(languageValue);

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        BackdropProps={{
          style: PaperDraggableTimeLapseStyle,
        }}
        className="leaflet-popup-timelapseHelpPopup"
        disableScrollLock={false}
        sx={StyleDialog}
        PaperComponent={PaperDraggableTimeLapse}
        aria-labelledby="draggable-dialog-title-timelapse"
      >
        <DialogTitle sx={{ cursor: 'move' }}>
          <h2 className="header-timelapse">{translatedTimelapse.header}</h2>
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
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div>
            <p className="detail-timelapse">{translatedTimelapse.details}</p>
            <h3 className="title-voyages"> {translatedTimelapse.voyageSize}</h3>
            <p className="detail-timelapse">
              {translatedTimelapse.voyageSizeDetail}
            </p>
            <h3 className="title-voyages">
              {translatedTimelapse.voyageNationality}
            </h3>
            <p className="detail-timelapse">
              {translatedTimelapse.voyageNationalityDetail}
            </p>
            <h3 className="title-voyages">
              {translatedTimelapse.voyageDetailsHeadeer}
            </h3>
            <p className="detail-timelapse">
              {translatedTimelapse.voyageDetails}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimelapseHelpDialog;
