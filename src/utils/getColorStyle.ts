
export const getColorBackground = (item: string) => {
    let background = "rgb(55 163 154)";
    if (item === "All Voyages") {
        background = "rgb(55 163 154)";
    } else if (item === "Trans-Atlantic") {
        background = "rgb(56, 116, 203)";
    } else if (item === "Intra-american") {
        background = "#ab47bc";
    }
    return background;
};
export const getTextColor = (item: string) => {
    let textColor = "#000000";
    if (item === "All Voyages") {
        textColor = "#000000";
    } else if (item === "Trans-Atlantic" || item === "Intra-american") {
        textColor = "#ffffff";
    }
    return textColor;
};
export const getColorNavbarBackground = (item: string) => {
    let background = "#93D0CB";
    if (item === "All Voyages") {
        background = "#93D0CB";
    } else if (item === "Trans-Atlantic") {
        background = "rgba(56, 116, 203, 0)";
    } else if (item === "Intra-american") {
        background = 'rgba(127, 118, 191)';
    }
    return background;
};

export const getColorHoverBackground = (item: string) => {
    let background = "rgb(84, 191, 182)";
    if (item === "All Voyages") {
        background = "rgb(84, 191, 182)";
    } else if (item === "Trans-Atlantic") {
        background = "#42a5f5";
    } else if (item === "Intra-american") {
        background = "#e286f1";
    }
    return background;
};