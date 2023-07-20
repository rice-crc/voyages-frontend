import { Box, Grid } from '@mui/material';
import '@/style/page-past.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const EnslaversPage = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const { value, textHeader, textIntroduce } = useSelector(
    (state: RootState) => state.getEnslaverDataSetCollections
  );

  return (
    <div className="page" id="main-enslavers-home">
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} className="grid-enslaved-introduction">
            <div>{textIntroduce}</div>
            <div className="btn-enslave-box"></div>
          </Grid>
        </Grid>
      </Box>
      <div className="credit-bottom-right">{`Credit: Artist Name ${currentYear}`}</div>
    </div>
  );
};

export default EnslaversPage;
