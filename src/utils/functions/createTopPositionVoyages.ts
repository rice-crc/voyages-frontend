export const createTopPositionVoyages = (
  currentPage: number,
  value: string
) => {
  let topPosition = 0;
  if (currentPage === 1 && value) {
    topPosition = 110;
  } else if (currentPage === 1 || currentPage === 7) {
    topPosition = 105;
  } else if (currentPage === 6 && value) {
    topPosition = 105;
  } else if (currentPage === 6) {
    topPosition = 85;
  } else if (currentPage === 2) {
    topPosition = 30;
  } else {
    topPosition = 100;
  }
  return topPosition;
};
