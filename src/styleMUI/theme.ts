import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    components: {
        // Name of the component
        MuiButton: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    fontSize: '1rem',
                },
            },
        },
    },
    spacing: [0, 4, 8, 16, 32, 64],
});