import { FC } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import NORESULT from '@/assets/no-results.png';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  minHeight: 400,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  opacity: 0.2,
  textAlign: 'center',
}));
interface NoDataStateProps {
  text: string | null;
}
const NoDataState: FC<NoDataStateProps> = ({ text }) => {
  return (
    <StyledPaper elevation={0}>
      <IconWrapper>
        <img src={NORESULT} alt="no-result" style={{ width: '20%' }} />
      </IconWrapper>

      {/* Message */}
      <Typography
        variant="h5"
        component="h3"
        gutterBottom
        sx={{ fontWeight: 'medium', color: 'text.primary' }}
      >
        No {text} Results Found
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ maxWidth: '500px', mb: 3 }}
      >
        We couldn't find any data matching your search criteria. Try adjusting
        your filters or search terms.
      </Typography>
    </StyledPaper>
  );
};

export default NoDataState;
