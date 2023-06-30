const breakpoints = [
    { width: 1366, height: 768, rowsPerPage: 10 },       // Desktops and laptops: 1366x768
    { width: 1920, height: 1080, rowsPerPage: 12 },     // Desktops and laptops: 1920x1080
    { width: 2560, height: 1440, rowsPerPage: 15 },     // Desktops and laptops: 2560x1440
    { width: 768, height: 1024, rowsPerPage: 8 },       // Tablets: 768x1024
    { width: 1536, height: 2048, rowsPerPage: 20 },      // Tablets: 1536x2048
    { width: 320, height: 480, rowsPerPage: 5 },        // Mobile phones: 320x480
    { width: 375, height: 667, rowsPerPage: 5 },        // Mobile phones: 375x667
    { width: 414, height: 736, rowsPerPage: 5 },        // Mobile phones: 414x736
    { width: 360, height: 640, rowsPerPage: 5 },        // Mobile phones: 360x640
];

export const getRowsPerPage = (windowWidth: number, windowHeight: number) => {
    const breakpoint = breakpoints.find((bp) => windowWidth <= bp.width && windowHeight <= bp.height);
    return breakpoint ? breakpoint.rowsPerPage : 20;
};