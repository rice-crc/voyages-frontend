
import '@/style/contributeContent.scss';
import { Box, Button, Input, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const RecommendVoyageDeletion: React.FC = () => {
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
            <h1 className="page-title-1">Recommend the Deletion of an Existing Voyage</h1>
            <p>Please use the box for notes to tell us why the selected voyage(s) should be removed from the database.</p>
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
                            border: '1px solid rgb(55, 148, 141)',
                            color: "rgb(55, 148, 141)",
                            height: 38,
                            mb: 3,
                            fontSize: '0.85rem',
                            textTransform: 'none',
                            boxShadow: "transparent",
                            marginLeft: '10px',
                            "&:hover": {
                                backgroundColor: "rgb(55, 148, 141)",
                                color: '#fff'
                            },
                        }}
                    >
                        Search
                    </Button>
                </Box>
                <TextField
                    label={<small>Notes</small>}
                    multiline
                    rows={2}
                    variant="outlined"
                    fullWidth
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        backgroundColor: "rgb(55, 148, 141)",
                        color: "#fff",
                        marginRight: '0.5rem',
                        marginTop: '1rem',
                        height: 32,
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        "&:hover": {
                            backgroundColor: "rgba(6, 186, 171, 0.83)",
                        },
                    }}
                >
                    Submit
                </Button>
            </form>
        </div>
    );

};
export default RecommendVoyageDeletion;

