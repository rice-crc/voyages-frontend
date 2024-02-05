
export const createTopPositionEnslavedPage = (currentEnslavedPage: number, value: string) => {

    let topPosition = 0
    // if (currentEnslavedPage === 1) {
    //     topPosition = 80;
    // } else if (currentEnslavedPage === 1 && value) {
    //     topPosition = 70;
    // } else if (currentEnslavedPage === 2) {
    //     topPosition = 60;
    // } else if (currentEnslavedPage === 3) {
    //     topPosition = 140;
    // }
    // return topPosition;
    // if (currentEnslavedPage === 1) {
    //     topPosition = 80;
    // } else if (currentEnslavedPage === 1 && value) {
    //     topPosition = 70;
    // } else 
    if (currentEnslavedPage === 1) {
        topPosition = 40;
    } else if (currentEnslavedPage === 2) {
        topPosition = 60;
    }
    return topPosition;
}

export const createTopPositionEnslaversPage = (currentPage: number, value: string) => {
    let topPosition = 0
    if (currentPage === 2 && value) {
        topPosition = 100;
    } else if (currentPage === 1 || currentPage === 2) {
        topPosition = 80;
    }
    return topPosition;
}

export function crateClassName(style: string) {
    let className = ''
    if (style === 'all-enslaved' || style === 'african-origins' || style === 'texasEnslaved') {
        className = 'mobile-enslaved'
    } else {
        className = 'mobile-responsive'
    }
    return className
}