import {
    AFRICANORIGINS,
    ALLENSLAVED,
    ENSALVEDTYPE,
    ENSALVERSTYLE,
    ENSLAVEDTEXAS,
    ESTIMATES,
    INTRAAMERICANTRADS,
    TRANSATLANTICTRADS,
} from '@/share/CONST_DATA';
import { TYPESOFDATASET } from '@/share/InterfaceTypes';

export const checkPagesRouteForVoyages = (pathStyleRoute: string) => {
    switch (pathStyleRoute) {
        case TYPESOFDATASET.allVoyages:
        case TYPESOFDATASET.voyages:
        case TYPESOFDATASET.voyage:
            return true;
        default:
            return false;
    }
};

export const checkRouteForVoyages = (pathStyleRoute: string) => {
    switch (pathStyleRoute) {
        case TYPESOFDATASET.allVoyages:
        case TYPESOFDATASET.voyages:
        case TYPESOFDATASET.voyage:
        case TYPESOFDATASET.intraAmerican:
        case TYPESOFDATASET.transatlantic:
        case TYPESOFDATASET.texas:
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
        case ENSALVEDTYPE:
            return true;
        default:
            return false;
    }
};


export const checkPagesRouteForEnslavers = (pathStyleRoute: string) => {

    switch (pathStyleRoute) {
        case ENSALVERSTYLE:
        case INTRAAMERICANTRADS:
        case TRANSATLANTICTRADS:
            return true;
        default:
            return false;
    }
};

export const checkPagesRouteMapEstimates = (pathStyleRoute: string) => {
    switch (pathStyleRoute) {
        case ESTIMATES:
            return true;
        default:
            return false;
    }
};