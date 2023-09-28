export const createTopPositionEnslavedPage = (currentEnslavedPage: number, isFilter: boolean) => {
    let topPosition;
    if (currentEnslavedPage === 1) {
        topPosition = 110;
    } else if (currentEnslavedPage === 2 && isFilter) {
        topPosition = 112;
    } else if (currentEnslavedPage === 2) {
        topPosition = 100;
    } else if (isFilter) {
        topPosition = 235;
    } else {
        topPosition = 180;
    }
    return topPosition;
}