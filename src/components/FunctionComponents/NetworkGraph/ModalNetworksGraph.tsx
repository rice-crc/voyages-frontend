import { setsetOpenModalNetworks } from '@/redux/getPastNetworksGraphDataSlice';
import { RootState } from '@/redux/store';
import { Modal, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { NetworkDiagramPeople } from './NetworkDiagramPeople';
import { styleModalNetworks } from '@/styleMUI';

const ModalNetworksGraph = () => {
  const dispatch = useDispatch();
  const { openModal } = useSelector(
    (state: RootState) => state.getPastNetworksGraphData
  );

  const handleClose = () => {
    dispatch(setsetOpenModalNetworks(false));
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleModalNetworks}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          textAlign="center"
          color="white"
        >
          Connections
        </Typography>

        <NetworkDiagramPeople />
      </Box>
    </Modal>
  );
};

export default ModalNetworksGraph;
