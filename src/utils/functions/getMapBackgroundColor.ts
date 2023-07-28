import { ALLVOYAGES, VOYAGESPAGE, INTRAAMERICAN, TRANSATLANTICPATH, VOYAGESTEXAS, AFRICANORIGINS } from "@/share/CONST_DATA";


export const getMapBackgroundColor = (item: string) => {

    let bgColor = 'rgb(147, 208, 203)';
    if (item === VOYAGESPAGE || item === ALLVOYAGES) {
        bgColor = 'rgb(147, 208, 203)';
    } else if (item === INTRAAMERICAN) {
        bgColor = 'rgb(127, 118, 191)';
    } else if (item === TRANSATLANTICPATH) {
        bgColor = 'rgb(25, 118, 210)';
    } else if (item === VOYAGESTEXAS) {
        bgColor = 'rgb(187, 105, 46)';
    } else if (item === AFRICANORIGINS) {
        bgColor = '#b29493';
    }
    return bgColor;
};