import '@/style/contributeContent.scss';
import { Button } from '@mui/material';
import { displayButton } from '@/utils/functions/contribuitePath';

const ContributeHomeWelcome: React.FC = () => {

    return (
        <div className="contribute-content">
            <h1 className="page-title-1">Welcome to the Contribute Section</h1>
            <span></span>
            <div>
                {displayButton.map(btn => (
                    <Button
                        key={btn.nameBtn}
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            backgroundColor: "rgb(25, 118, 210 ,10)",
                            color: "#fff",
                            marginRight: '0.5rem',
                            height: 32,
                            fontSize: '0.85rem',
                            textTransform: 'none',
                            "&:hover": {
                                backgroundColor: "rgb(10 131 253)",
                            },
                        }}
                    >  {btn.nameBtn}
                    </Button>
                ))}

            </div>
        </div >
    )

};
export default ContributeHomeWelcome;
