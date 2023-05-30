import { createTheme } from "@mui/material/styles";
export const MAINBGGREEN = "#93D0CB"
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
    typography: {
        fontFamily: `Cormorant Garamond`,
    },
    palette: {
        background: {
            default: MAINBGGREEN,
        },
    },
});