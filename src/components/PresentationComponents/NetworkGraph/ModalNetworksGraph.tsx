import { setsetOpenModalNetworks } from '@/redux/getPastNetworksGraphDataSlice';
import { RootState } from '@/redux/store';
import { Modal, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { styleModalNetworks } from '@/styleMUI';
import NETWORKICON from '@/assets/networksIcon.png';
import { NetworkDiagramSlaveVoyagesSVG } from './NetworkDiagramSlaveVoyagesSVG';
import "@/style/networks.scss"
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
      disableScrollLock={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ styleModalNetworks }}
    >
      <Box sx={styleModalNetworks}>
        <div className='network-header'>
          <div className='network-header-text'>
            <img
              alt="network"
              src={NETWORKICON}
              className='network-icon-right'
            />
            Connections
            <img
              alt="network"
              className='network-icon-left'
              src={NETWORKICON}
            />

          </div>
          <div className='close-modal-icon-network '><CloseIcon fontSize='large' onClick={handleClose} /></div>
        </div>

        <NetworkDiagramSlaveVoyagesSVG />
      </Box>
    </Modal>
  );
};

export default ModalNetworksGraph;
