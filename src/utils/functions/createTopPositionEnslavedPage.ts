export const createTopPositionEnslavedPage = (currentEnslavedPage: number, isFilter: boolean) => {
    let topPosition;
    if (currentEnslavedPage === 1) {
        topPosition = 80;
    } else if (currentEnslavedPage === 2 && isFilter) {
        topPosition = 112;
    } else if (currentEnslavedPage === 2) {
        topPosition = 60;
    } else if (isFilter) {
        topPosition = 235;
    } else {
        topPosition = 180;
    }
    return topPosition;
}