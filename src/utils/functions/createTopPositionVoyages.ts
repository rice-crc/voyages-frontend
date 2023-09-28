
export const createTopPositionVoyages = (currentPage: number, isFilter: boolean) => {
    let topPosition;
    if (currentPage === 1) {
        topPosition = 100;
    } else if (currentPage === 2 && isFilter || currentPage === 7) {
        topPosition = 200;
    } else if (currentPage === 2) {
        topPosition = 170;
    } else if (isFilter && currentPage === 6) {
        topPosition = 150;
    } else if (isFilter) {
        topPosition = 215;
    } else if (currentPage === 6) {
        topPosition = 160;
    }
    else {
        topPosition = 175;
    }
    return topPosition;
}