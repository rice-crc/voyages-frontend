import { setsetOpenModalNetworks } from '@/redux/getPastNetworksGraphDataSlice';
import { RootState } from '@/redux/store';
import { Modal, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { NetworkDiagramSlaveVoyages } from './NetworkDiagramSlaveVoyages';
import { styleModalNetworks } from '@/styleMUI';
import NETWORKICON from '@/assets/networksIcon.png';
import { NetworkDiagramSlaveVoyagesTEST } from './NetworkDiagramSlaveVoyagesTEST';

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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
          }}
        >
          <img
            alt="network"
            src={NETWORKICON}
            width={20}
            style={{ marginLeft: 5 }}
          />
          Connections
          <img
            alt="network"
            src={NETWORKICON}
            width={20}
            style={{ marginLeft: 5 }}
          />
        </div>
        {/* <NetworkDiagramSlaveVoyagesTEST /> */}
        <NetworkDiagramSlaveVoyages />
      </Box>
    </Modal>
  );
};

export default ModalNetworksGraph;
