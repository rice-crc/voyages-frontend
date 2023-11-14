
export const createTopPositionVoyages = (currentPage: number, isFilter: boolean) => {
    let topPosition;
    if (currentPage === 1) {
        topPosition = 100;
    } else if (currentPage === 2 && isFilter || currentPage === 7) {
        topPosition = 100;
    } else if (isFilter && currentPage === 6) {
        topPosition = 100;
    } else if (isFilter) {
        topPosition = 200;
    }
    else {
        topPosition = 100;
    }
    return topPosition;
}