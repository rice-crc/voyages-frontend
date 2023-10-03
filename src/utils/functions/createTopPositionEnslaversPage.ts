

export const createTopPositionEnslaversPage = (currentEnslaversPage: number, isFilter: boolean) => {
    let topPosition;
    if (currentEnslaversPage === 1) {
        topPosition = 100;
    } else if (currentEnslaversPage === 2 && isFilter) {
        topPosition = 120;
    } else if (currentEnslaversPage === 2) {
        topPosition = 90;
    }
    return topPosition;
}