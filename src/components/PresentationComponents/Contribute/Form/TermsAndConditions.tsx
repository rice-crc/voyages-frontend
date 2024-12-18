import { useNavigation } from '@/hooks/useNavigation';
import '@/style/contributeContent.scss';
import { Button } from '@mui/material';

const TermsAndConditions: React.FC = () => {
  const { handleAcceptTeams } = useNavigation();
  return (
    <div className="contribute-content">
      <h1 className="page-title-1">Terms and Conditions</h1>
      <p>
        {' '}
        I warrant that I have the right to contribute the following data to the
        Voyages Database and its inclusion in the Voyages Database will not
        infringe anyone's intellectual property rights. I also agree that this
        data will become part of the Voyages: The Trans-Atlantic Slave Trade
        Database website and will be governed by any applicable licenses.
      </p>
      <div>
        <Button
          onClick={handleAcceptTeams}
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: 'rgb(55, 148, 141)',
            color: '#fff',
            marginRight: '0.5rem',
            height: 32,
            fontSize: '0.85rem',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(6, 186, 171, 0.83)',
            },
          }}
        >
          Accept
        </Button>
      </div>
    </div>
  );
};
export default TermsAndConditions;
