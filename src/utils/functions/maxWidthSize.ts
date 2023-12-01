export const maxWidthSize = (width: number) => {
    const maxWidth =
        width > 1024
            ? width > 1440
                ? width * 0.88
                : width * 0.92
            : width === 1024
                ? width * 0.895
                : width === 768
                    ? width * 0.95
                    : width < 768
                        ? width * 0.92
                        : width * 0.75;
    return maxWidth;
};


export const getMobileMaxWidth = (maxWidth: number) => {
    let mobileMaxWidth;
    if (maxWidth < 300) {
        mobileMaxWidth = 275;
    } else if (maxWidth < 400) {
        mobileMaxWidth = 330;
    } else {
        mobileMaxWidth = maxWidth;
    }
    return mobileMaxWidth
}

export const getMobileMaxHeight = (height: number) => {
    let mobileMaxHeight;
    if (height < 700) {
        mobileMaxHeight = height * 0.40
    } else {
        mobileMaxHeight = height * 0.55
    }

    return mobileMaxHeight
}
export const getMobileMaxHeightTable = (height: number) => {
    let mobileMaxHeight = height * 0.75
    if (height > 600 && height < 720) {
        mobileMaxHeight = height * 0.45
    } else if (height < 600) {
        mobileMaxHeight = height * 0.50
    } else {
        mobileMaxHeight = height * 0.71
    }
    return mobileMaxHeight
}