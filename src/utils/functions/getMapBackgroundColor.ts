import { TYPESOFDATASET } from "@/share/InterfaceTypes";


export const getMapBackgroundColor = (item: string) => {
    let background = 'rgba(147, 208, 203)';
    if (item === TYPESOFDATASET.allVoyages) {
        background = 'rgba(147, 208, 203)';
    } else if (item === TYPESOFDATASET.allVoyages) {
        background = 'transparent';
    } else if (item === TYPESOFDATASET.intraAmerican) {
        background = 'rgba(127, 118, 191)';
    } else if (item === TYPESOFDATASET.transatlantic) {
        background = '#1976d2';
    } else if (item === TYPESOFDATASET.texas) {
        background = 'rgba(187, 105, 46)';
    } else if (item === 'african-origins') {
        background = 'rgb(178, 148, 147)';
    }
    return background;
};