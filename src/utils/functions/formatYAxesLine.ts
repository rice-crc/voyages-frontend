export const formatYAxes = (yAxesArray: string[]) => {
  return yAxesArray.reduce((formattedString, currentElement, index) => {
    const separator = index % 2 === 0 ? ', <br>' : ', ';
    return formattedString + currentElement + separator;
  }, '');
};
