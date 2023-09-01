import { setsetOpenModalNetworks } from '@/redux/getPastNetworksGraphDataSlice';
import { RootState } from '@/redux/store';
import { Modal, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { styleModalNetworks } from '@/styleMUI';
import GeoTreeSelected from './GeoTreeSelected';
import { CurrentPageInitialState } from '@/share/InterfaceTypes';

const ModalNetworksGraph = () => {
  const dispatch = useDispatch();
  const { isOpenDialog } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const handleClose = () => {
    dispatch(setsetOpenModalNetworks(false));
  };

  return (
    <Modal
      open={isOpenDialog}
      disableScrollLock={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ styleModalNetworks }}
    >
      <Box sx={styleModalNetworks}>
        <GeoTreeSelected />
      </Box>
    </Modal>
  );
};

export default ModalNetworksGraph;
