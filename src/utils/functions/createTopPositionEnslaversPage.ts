

export const createTopPositionEnslaversPage = (currentEnslaversPage: number, isFilter: boolean) => {
    let topPosition;
    if (currentEnslaversPage === 1) {
        topPosition = 100;
    } else if (currentEnslaversPage === 2 && isFilter) {
        topPosition = 225;
    } else if (currentEnslaversPage === 2) {
        topPosition = 170;
    } else if (isFilter) {
        topPosition = 227;
    } else {
        topPosition = 170;
    }
    return topPosition;
}