
// export const createTopPositionVoyages = (currentPage: number, value: string) => {
//     let topPosition = 0;
//     if (currentPage === 1) {
//         topPosition = 100;
//     } else if (currentPage === 2 && value) {
//         topPosition = 110;
//     } else if (currentPage === 2 || currentPage === 7) {
//         topPosition = 90;
//     } else if (currentPage === 6) {
//         topPosition = 85;
//     } else {
//         topPosition = 100;
//     }
//     return topPosition;
// }


export const createTopPositionVoyages = (currentPage: number, value: string) => {
    let topPosition = 0;
    if (currentPage === 1 && value) {
        topPosition = 110;
    } else if (currentPage === 1 || currentPage === 6) {
        topPosition = 90;
    } else if (currentPage === 5) {
        topPosition = 85;
    } else {
        topPosition = 100;
    }
    return topPosition;
}