import { styleModalCard } from '@/styleMUI';
import { Box, Divider, IconButton, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import VoyageCard from './Cards';
import { RootState } from '@/redux/store';
import { setIsModalCard } from '@/redux/getCardFlatObjectSlice';
import {Close} from '@mui/icons-material';
import '@/style/cards.scss';
import { translationCard } from '@/utils/functions/translationLanguages';

const CardModal = () => {
  const dispatch = useDispatch();
  const { isModalCard } = useSelector(
    (state: RootState) => state.getCardFlatObjectData
  );

  const handleClose = () => {
    dispatch(setIsModalCard(false));
  };
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const translatedCard = translationCard(languageValue);
  return (
    <div className="card-modal-container">
      <Modal
        open={isModalCard}
        disableScrollLock={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModalCard}>
          <div className="card-box-modal">
            <Typography
              id="modal-modal-title"
              component="p"
              style={{ fontSize: 16 }}
            >
              {translatedCard.fullDetail}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </div>
          <Divider />
          <VoyageCard />
        </Box>
      </Modal>
    </div>
  );
};
export default CardModal;
