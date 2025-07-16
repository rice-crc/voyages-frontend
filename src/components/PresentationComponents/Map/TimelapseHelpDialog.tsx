import React from 'react';

import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';

import { PaperDraggableTimeLapse } from '@/components/SelectorComponents/Cascading/PaperDraggable';
import { usePageRouter } from '@/hooks/usePageRouter';
import { RootState } from '@/redux/store';
import { PaperDraggableTimeLapseStyle, StyleDialog } from '@/styleMUI';
import '@/style/timelapse.scss';
import { getColorBackgroundHeader } from '@/utils/functions/getColorStyle';
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
    (state: RootState) => state.getLanguages,
  );
  const { styleName: styleNamePage } = usePageRouter();
  const translatedTimelapse = translationLanguagesTimelapse(languageValue);

  return (
    <div>
      <Dialog
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          backdrop: {
            onClick: (e) => e.stopPropagation(),
          },
        }}
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
        <DialogTitle
          style={{
            cursor: 'move',
            padding: '10px 24px 0 24px',
            color: '#fff',
            backgroundColor: getColorBackgroundHeader(styleNamePage!),
          }}
        >
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
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: '0 24px' }}>
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
