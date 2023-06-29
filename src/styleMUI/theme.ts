import { createTheme } from "@mui/material/styles";

export const MAINBGGREEN = "#93D0CB";

let MAINColorBG = MAINBGGREEN;

export const generateThemeGB = (state: any) => {
    if (state === "All Voyages") {
        MAINColorBG = "#93D0CB";
    } else if (state === "Trans-Atlantic") {
        MAINColorBG = "rgba(56, 116, 203, 0.8)";
    } else if (state === "Intra-american") {
        MAINColorBG = "rgba(127, 118, 191)";
    }
    return MAINColorBG;
};

export const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: "1rem",
                },
            },
        },
    },
    spacing: [0, 4, 8, 16, 32, 64],
    palette: {
        background: {
            default: MAINBGGREEN, // Set the initial background color
        },
    },
});

// Function to update the theme based on state changes
export const updateThemeBackground = (state: any) => {
    const updatedTheme = createTheme({
        ...theme,
        palette: {
            ...theme.palette,
            background: {
                ...theme.palette.background,
                default: generateThemeGB(state), // Update the background color dynamically
            },
        },
    });
    return updatedTheme;
};
