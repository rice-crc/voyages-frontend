
import '@/style/contributeContent.scss';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const MergeVoyages: React.FC = () => {
    const [voyageId, setVoyageId] = useState<string>("");
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (voyageId) {
            alert(`Sucessfully password change`)
        } else {
            alert(`Password is not match, try again`)
        }
    };

    return (
        <div className="contribute-content">
            <h1 className="page-title-1">Merge Existing Records of Voyages</h1>
            <p> Please select two or more existing voyage records for merging.</p>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            sx={{ width: 300 }}
                            InputProps={{
                                sx: {
                                    height: 40,
                                    padding: "0 8px",
                                },
                            }}
                            label={<small>Voyage ID:</small>}
                            variant="outlined"
                            type="number"
                            value={voyageId}
                            onChange={(e) => setVoyageId(e.target.value)}
                            required
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            backgroundColor: "transparent",
                            border: '1px solid rgb(25, 118, 210)',
                            color: "rgb(25, 118, 210)",
                            height: 38,
                            mb: 3,
                            fontSize: '0.85rem',
                            textTransform: 'none',
                            boxShadow: "transparent",
                            marginLeft: '10px',
                            "&:hover": {
                                backgroundColor: "rgb(25, 118, 210 ,10)",
                                color: "#fff",
                            },
                        }}
                    >
                        Search
                    </Button>
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        backgroundColor: "rgb(25, 118, 210 ,10)",
                        color: "#fff",
                        height: 35,
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        "&:hover": {
                            backgroundColor: "rgb(10 131 253)",
                        },
                    }}
                >
                    Begin
                </Button>
            </form>
        </div>
    );

};
export default MergeVoyages;

