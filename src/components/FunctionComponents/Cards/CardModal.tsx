import { styleModalCard } from '@/styleMUI';
import { Box, Divider, IconButton, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import VoyageCard from './Cards';
import { RootState } from '@/redux/store';
import { setIsModalCard } from '@/redux/getCardFlatObjectSlice';
import CloseIcon from '@mui/icons-material/Close';

const CardModal = () => {
  const dispatch = useDispatch();
  const { isModalCard } = useSelector(
    (state: RootState) => state.getCardFlatObjectData
  );

  const handleClose = () => {
    dispatch(setIsModalCard(false));
  };
  return (
    <div
      style={{
        overflowX: 'hidden',
        overflowY: 'auto',
        marginTop: '5%',
      }}
    >
      <Modal
        open={isModalCard}
        disableScrollLock={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModalCard}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: -10,
              zIndex: 1,
              background: 'white',
              paddingTop: 10,
            }}
          >
            <Typography
              id="modal-modal-title"
              component="p"
              style={{ fontSize: 16 }}
            >
              Full detail
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
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
