import { Box, Grid } from '@mui/material';
import '@/style/page-past.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import {
  getIdStypleEnslaved,
  getIntroBackgroundEnslavedColor,
} from '@/utils/functions/getColorStyle';

const EnslavedIntro = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const { textIntroduce, styleNamePeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );

  return (
    <>
      <div className="page" id={getIdStypleEnslaved(styleNamePeople)}>
        <Box>
          <Grid container className="grid-enslaved-introduction">
            <Grid className="grid-enslaved-introduction">
              <div
                className="intro-box"
                style={{
                  backgroundColor:
                    getIntroBackgroundEnslavedColor(styleNamePeople),
                }}
              >
                {textIntroduce}
              </div>
            </Grid>
          </Grid>
        </Box>
        <div className="credit-bottom-right">{`Credit: Artist Name ${currentYear}`}</div>
      </div>
    </>
  );
};

export default EnslavedIntro;
