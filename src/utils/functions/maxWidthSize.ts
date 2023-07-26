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