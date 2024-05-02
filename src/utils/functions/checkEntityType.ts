import { allEnslavers, ENSALVEDTYPE, ESTIMATES, VOYAGE } from "@/share/CONST_DATA";

export const checkEntityType = (type: string) => {
    switch (type) {
        case VOYAGE:
        case ENSALVEDTYPE:
        case allEnslavers:
        case ESTIMATES:
            return true;
        default:
            return false;
    }
}