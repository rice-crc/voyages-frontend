import { useNavigation } from '@/hooks/useNavigation';
import '@/style/contributeContent.scss';
import { Button } from '@mui/material';

const SignOut: React.FC = () => {
    const { handleConfirmSignOut
    } = useNavigation();
    return (
        <div className="contribute-content">
            <h1 className="page-title-1">Sign Out</h1>
            <p> Are you sure you want to sign out?</p>
            <div>
                <Button
                    onClick={handleConfirmSignOut}
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        backgroundColor: "rgb(25, 118, 210 ,10)",
                        color: "#fff",
                        height: 32,
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        "&:hover": {
                            backgroundColor: "rgb(10 131 253)",
                        },
                    }}
                >
                    Sign Out
                </Button>
            </div>
        </div >
    )
};
export default SignOut;

