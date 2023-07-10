import { createTheme } from "@mui/material/styles";

export const MAINBGGREEN = "transparent";
let MAINColorBG = MAINBGGREEN;

export const generateThemeGB = (state: any) => {
    if (state === "all-voyages") {
        MAINColorBG = "#93D0CB";
    } else if (state === "transatlantic") {
        MAINColorBG = "rgba(56, 116, 203, 0.8)";
    } else if (state === "intra-american") {
        MAINColorBG = "rgba(127, 118, 191)";
    } else if (state === "texas") {
        MAINColorBG = "rgba(187, 105, 46)";
    }
    return MAINColorBG;
};
export const generateThemePeopleGB = (state: any) => {
    if (state === "all-enslaved") {
        MAINColorBG = "#b29493";
    } else if (state === "african-origins") {
        MAINColorBG = "rgba(56, 116, 203, 0.8)";
    } else if (state === "texas") {
        MAINColorBG = "rgba(187, 105, 46)";
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
            default: MAINBGGREEN,
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


// Function to update the theme based on state changes
export const updateThemeEnslaveBackground = (state: any) => {
    const updatedTheme = createTheme({
        ...theme,
        palette: {
            ...theme.palette,
            background: {
                ...theme.palette.background,
                default: generateThemePeopleGB(state), // Update the background color dynamically
            },
        },
    });
    return updatedTheme;
};
