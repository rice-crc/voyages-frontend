
export const createTopPositionVoyages = (currentPage: number, isFilter: boolean) => {
    let topPosition;
    if (currentPage === 1) {
        topPosition = 100;
    } else if (currentPage === 2 && isFilter) {
        topPosition = 225;
    } else if (currentPage === 2) {
        topPosition = 165;
    } else if (currentPage === 7) {
        topPosition = 235;
    } else if (isFilter) {
        topPosition = 215;
    } else {
        topPosition = 155;
    }
    return topPosition;
}