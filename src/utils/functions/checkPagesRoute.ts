import {
    AFRICANORIGINS,
    ALLENSLAVED,
    ENSALVEDTYPE,
    ENSALVERSTYLE,
    ENSLAVEDTEXAS,
} from '@/share/CONST_DATA';
import { TYPESOFDATASET } from '@/share/InterfaceTypes';

export const checkPagesRouteForVoyages = (pathStyleRoute: string) => {
    switch (pathStyleRoute) {
        case TYPESOFDATASET.allVoyages:
        case TYPESOFDATASET.intraAmerican:
        case TYPESOFDATASET.transatlantic:
        case TYPESOFDATASET.texas:
            return true;
        default:
            return false;
    }
};
export const checkPagesRouteMapURLForVoyages = (pathStyleRoute: string) => {
    switch (pathStyleRoute) {
        case TYPESOFDATASET.voyages:
            return true;
        default:
            return false;
    }
};

export const checkPagesRouteForEnslaved = (pathStyleRoute: string) => {
    switch (pathStyleRoute) {
        case ALLENSLAVED:
        case AFRICANORIGINS:
        case ENSLAVEDTEXAS:
            return true;
        default:
            return false;
    }
};
export const checkPagesRouteMapURLForEnslaved = (pathStyleRoute: string) => {
    switch (pathStyleRoute) {
        case ENSALVEDTYPE:
            return true;
        default:
            return false;
    }
};
export const checkPagesRouteForEnslavers = (pathStyleRoute: string) => {

    switch (pathStyleRoute) {
        case ENSALVERSTYLE:
            return true;
        default:
            return false;
    }
};
