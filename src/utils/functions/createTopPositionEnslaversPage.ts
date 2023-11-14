

export const createTopPositionEnslaversPage = (currentEnslaversPage: number, isFilter: boolean) => {
    let topPosition;
    if (currentEnslaversPage === 1) {
        topPosition = 100;
    } else if (currentEnslaversPage === 2 && isFilter) {
        topPosition = 10;
    } else if (currentEnslaversPage === 2) {
        topPosition = 45;
    }
    return topPosition;
}