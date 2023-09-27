export const createTopPositionEnslavedPage = (currentEnslavedPage: number, isFilter: boolean) => {
    let topPosition;
    if (currentEnslavedPage === 1) {
        topPosition = 100;
    } else if (currentEnslavedPage === 2 && isFilter) {
        topPosition = 225;
    } else if (currentEnslavedPage === 2) {
        topPosition = 170;
    } else if (isFilter) {
        topPosition = 235;
    } else {
        topPosition = 170;
    }
    return topPosition;
}