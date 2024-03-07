import { TYPESOFDATASET, TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';

export const getColorVoyagePageBackground = (item: string, currentPage: number) => {

    let background = 'rgb(55 148 141)';
    if (item === TYPESOFDATASET.allVoyages) {
        background = 'rgb(55 148 141)';
    } else if (item === TYPESOFDATASET.allVoyages && currentPage === 1) {
        background = 'transparent';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        background = 'rgba(127, 118, 191)';
    } else if (item === TYPESOFDATASET.transatlantic) {
        background = '#1976d2';
    } else if (item === TYPESOFDATASET.texas) {
        background = 'rgba(187, 105, 46)';
    }

    return background;
};

export const getColorBackground = (item: string) => {
    let background = '#007269';
    if (item === TYPESOFDATASET.allVoyages) {
        background = '#007269';
    } else if (item === TYPESOFDATASET.transatlantic) {
        background = 'rgb(2 83 204)';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        background = '#ab47bc';
    } else if (item === TYPESOFDATASET.texas) {
        background = 'rgb(167 70 0)';
    } else if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        background = '#906866'
    } else if (item === 'Blog') {
        background = '#d45b01'
    }
    return background;
};
export const getColorBTNVoyageDatasetBackground = (item: string) => {
    let background = '#007269';
    if (item === TYPESOFDATASET.allVoyages) {
        background = '#007269';
    } else if (item === TYPESOFDATASET.transatlantic) {
        background = 'rgb(2 83 204)';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        background = '#ab47bc';
    } else if (item === TYPESOFDATASET.texas) {
        background = 'rgb(167 70 0)';
    } else if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        background = '#906866';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        background = 'rgb(2 83 204)';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        background = 'rgb(167 70 0)';
    }
    return background;
};

export const getColorBTNBackgroundEnslaved = (item: string) => {

    let background = '#906866';
    if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        background = '#906866';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        background = 'rgb(2 83 204)';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        background = 'rgb(167 70 0)';
    }
    return background;
};
export const getColorBTNBackgroundEnslavers = (item: string) => {
    let background = '#007269';
    return background;
};

export const getTextColor = (item: string) => {

    let textColor = "rgba(0, 0, 0,0.75)";
    if (item === TYPESOFDATASET.allVoyages) {
        textColor = "rgba(0, 0, 0,0.75)";
    } else if (item === TYPESOFDATASET.transatlantic || item === TYPESOFDATASET.intraAmerican || item === TYPESOFDATASET.texas) {
        textColor = '#ffffff';
    } else if (item === TYPESOFDATASETPEOPLE.allEnslavers) {
        textColor = '#ffffff';
    }
    return textColor;
};


export const getColorNavbarBackground = (item: string) => {
    let background = 'rgb(55, 148, 141)';
    if (item === TYPESOFDATASET.allVoyages) {
        background = 'rgb(55, 148, 141)';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        background = 'rgba(127, 118, 191)';
    }
    else if (item === TYPESOFDATASET.transatlantic) {
        background = '#1976d2';
    } else if (item === TYPESOFDATASET.texas) {
        background = 'rgba(187, 105, 46)';
    }
    return background;
};

export const getColorNavbarEnslavedBackground = (item: string) => {
    let background = '#b29493';
    if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        background = '#b29493';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        background = 'rgb(25, 118, 210)';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        background = 'rgb(187, 105, 46)';
    }
    return background;
};
export const getColorHoverBackground = (item: string) => {

    let background = 'rgb(6 186 171 / 83%)';
    if (item === TYPESOFDATASET.allVoyages) {
        background = 'rgb(6 186 171 / 83%)';
    } else if (item === TYPESOFDATASET.transatlantic) {
        background = 'rgb(25, 118, 210)';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        background = 'rgb(127, 118, 191)';
    } else if (item === TYPESOFDATASET.texas) {
        background = 'rgb(216 93 5)';
    } else if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        background = 'rgb(178, 148, 147)';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        background = 'rgb(25, 118, 210)';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        background = 'rgb(187, 105, 46)';
    }
    return background;
};
export const getColorTextCollection = (item: string) => {

    let textColor = 'rgb(0 205 188)';
    if (item === TYPESOFDATASET.allVoyages) {
        textColor = 'rgb(0 205 188)';
    } else if (item === TYPESOFDATASET.transatlantic) {
        textColor = '#42a5f5';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        textColor = 'rgb(230 150 243)';
    } else if (item === TYPESOFDATASET.texas) {
        textColor = 'rgb(237 100 2)';
    } else if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        textColor = '#e2aeac';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        textColor = '#42a5f5';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        textColor = 'rgb(237 100 2)';
    }
    return textColor;
};
export const getColorHoverBackgroundCollection = (item: string) => {
    let boxShadow = '#42a5f5';
    if (item === TYPESOFDATASET.allVoyages) {
        boxShadow = 'rgb(6 186 171 / 83%)';
    } else if (item === TYPESOFDATASET.transatlantic) {
        boxShadow = '#42a5f5';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        boxShadow = 'rgb(226, 134, 241)';
    } else if (item === TYPESOFDATASET.texas) {
        boxShadow = 'rgb(216 93 5)';
    } else if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        boxShadow = '#dbcccbe8';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        boxShadow = '#42a5f5';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        boxShadow = 'rgb(216 93 5)';
    } else if (item === TYPESOFDATASETPEOPLE.allEnslavers) {
        boxShadow = '#3ec59e';
    } else if (item === 'Blog') {
        boxShadow = 'rgb(96 40 0)';
    }
    return boxShadow;
};


export const getColorBTNHoverEnslavedBackground = (item: string) => {
    let background = 'rgb(178, 148, 147)';
    if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        background = 'rgb(178, 148, 147)';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        background = 'rgb(25, 118, 210)';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        background = 'rgb(187, 105, 46)';
    }
    return background;
};
export const getColorBTNHoverEnslaversBackground = (item: string) => {
    let background = '#3f9d82';
    if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        background = '#3f9d82';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        background = '#42a5f5';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        background = 'rgb(237 100 2)';
    }
    return background;
};
export const getColorBoxShadow = (item: string) => {
    let boxShadow = 'rgb(2 188 173) 1px 2px 8px';
    if (item === TYPESOFDATASET.allVoyages) {
        boxShadow = 'rgb(2 188 173) 1px 2px 8px';
    } else if (item === TYPESOFDATASET.transatlantic) {
        boxShadow = '1px 2px 8px #42a5f5';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        boxShadow = 'rgb(226, 134, 241) 1px 2px 8px';
    } else if (item === TYPESOFDATASET.texas) {
        boxShadow = '1px 2px 8px rgb(237 100 2)';
    } else if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        boxShadow = '1px 2px 8px #e2aeac';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        boxShadow = '1px 2px 8px #42a5f5';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        boxShadow = '1px 2px 8px rgb(237 100 2)';
    }
    return boxShadow;
};


export const getColorBoxShadowEnslaved = (item: string) => {

    let boxShadow = '1px 2px 8px#9c8180';
    if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        boxShadow = '1px 2px 8px #9c8180';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        boxShadow = '1px 2px 8px #42a5f5';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {

        boxShadow = '1px 2px 8px rgb(216 93 5)';
    }
    return boxShadow;
};
export const getColorBoxShadowEnslavers = (item: string) => {
    let boxShadow = '1px 2px 8px#3ec59e';
    if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        boxShadow = '1px 2px 8px #3ec59e';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        boxShadow = '1px 2px 8px #42a5f5';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        boxShadow = '1px 2px 8px rgb(216 93 5)';
    }
    return boxShadow;
};
export const getIdStyleName = (idStyle: string) => {

    let idName = 'main-voyagepage';
    if (idStyle === TYPESOFDATASET.allVoyages) {
        idName = 'main-voyagepage';
    } else if (idStyle === TYPESOFDATASET.transatlantic) {
        idName = 'main-voyagepage-Trans-atlantic';
    } else if (idStyle === TYPESOFDATASET.intraAmerican) {
        idName = 'main-voyagepage-intra-american';
    } else if (idStyle === TYPESOFDATASET.texas || TYPESOFDATASETPEOPLE.texas) {
        idName = 'main-voyagepage-texas';
    }
    return idName;
};
export const getIdStypleEnslaved = (idStyle: string) => {

    let idName = 'main-enslaved-home';
    if (idStyle === TYPESOFDATASETPEOPLE.allEnslaved) {
        idName = 'main-enslaved-home';
    } else if (idStyle === TYPESOFDATASETPEOPLE.africanOrigins) {
        idName = 'main-voyagepage-Trans-atlantic';
    } else if (TYPESOFDATASETPEOPLE.texas) {
        idName = 'main-voyagepage-texas';
    }
    return idName;
};

export const getIntroBackgroundColor = (styleName: string) => {
    let backgroundColor = 'rgba(147, 208, 203, 0.6)';
    if (styleName === TYPESOFDATASET.allVoyages) {
        backgroundColor = 'rgba(147, 208, 203, 0.6)';
    } else if (styleName === TYPESOFDATASET.transatlantic) {
        backgroundColor = 'rgba(56, 116, 203, 0.9)';
    } else if (styleName === TYPESOFDATASET.intraAmerican) {
        backgroundColor = 'rgba(171, 71, 188, 0.8)';
    } else if (styleName === TYPESOFDATASET.texas) {
        backgroundColor = 'rgba(187, 105, 46, 0.8)';
    }
    return backgroundColor;
};
export const getIntroBackgroundEnslavedColor = (styleName: string) => {
    let backgroundColor = '#b29493';
    if (styleName === TYPESOFDATASETPEOPLE.allEnslaved) {
        backgroundColor = '#b29493';
    } else if (styleName === TYPESOFDATASETPEOPLE.africanOrigins) {
        backgroundColor = 'rgb(25, 118, 210)';
    } else if (styleName === TYPESOFDATASETPEOPLE.texas) {
        backgroundColor = 'rgba(187, 105, 46)';
    }
    return backgroundColor;
};

export const getBoderColor = (item: string) => {
    let borderColor = '1px solid #54bfb6';
    if (item === TYPESOFDATASET.allVoyages) {
        borderColor = '1px solid #54bfb6';
    } else if (item === TYPESOFDATASET.transatlantic) {
        borderColor = '1px solid rgb(56, 116, 203)';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        borderColor = '1px solid #ab47bc';
    } else if (item === TYPESOFDATASET.texas) {
        borderColor = '1px solid rgb(167 70 0)';
    }
    return borderColor;
};

export const getHeaderColomnColor = (item: string) => {
    let color = 'rgb(25, 118, 210)';
    if (item === TYPESOFDATASET.allVoyages) {
        color = '#007269';
    } else if (item === TYPESOFDATASET.transatlantic) {
        color = 'rgb(2 83 204)';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        color = '#ab47bc';
    } else if (item === TYPESOFDATASET.texas) {
        color = 'rgb(167 70 0)';
    } else if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        color = 'rgb(144, 104, 102)';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        color = 'rgb(2 83 204)';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        color = 'rgb(167 70 0)';
    }
    return color;
};
