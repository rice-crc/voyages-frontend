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
    }
    return background;
};
export const getColorBTNBackgroundEnslaved = (item: string) => {
    let background = '#906866';
    if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        background = '#906866';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        background = 'rgb(56, 116, 203)';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        background = 'rgb(167 70 0)';
    }
    return background;
};
export const getColorBTNBackgroundEnslavers = (item: string) => {
    let background = 'rgb(41 136 109)';
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
    let background = 'rgb(84, 191, 182)';
    if (item === TYPESOFDATASET.allVoyages) {
        background = 'rgb(84, 191, 182)';
    } else if (item === TYPESOFDATASET.transatlantic) {
        background = '#42a5f5';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        background = '#e286f1';
    } else if (item === TYPESOFDATASET.texas) {
        background = 'rgb(216 93 5)';
    }
    return background;
};

export const getColorBTNHoverEnslavedBackground = (item: string) => {
    let background = '#884d4b';
    if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        background = '#884d4b';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        background = '#42a5f5';
    } else if (item === TYPESOFDATASETPEOPLE.texas) {
        background = 'rgb(216 93 5)';
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
        background = 'rgb(216 93 5)';
    }
    return background;
};
export const getColorBoxShadow = (item: string) => {
    let boxShadow = 'rgb(0 255 234) 1px 2px 8px';
    if (item === TYPESOFDATASET.allVoyages) {
        boxShadow = 'rgb(0 255 234) 1px 2px 8px';
    } else if (item === TYPESOFDATASET.transatlantic) {
        boxShadow = '1px 2px 8px #42a5f5';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        boxShadow = '1px 2px 8px  #e286f1';
    } else if (item === TYPESOFDATASET.texas) {
        boxShadow = '1px 2px 8px rgb(216 93 5)';
    }
    return boxShadow;
};
export const getColorBoxShadowEnslaved = (item: string) => {

    let boxShadow = '1px 2px 8px#9c8180';
    if (item === TYPESOFDATASETPEOPLE.allEnslaved) {
        boxShadow = '1px 2px 8px #9c8180';
    } else if (item === TYPESOFDATASETPEOPLE.africanOrigins) {
        console.log('----')
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