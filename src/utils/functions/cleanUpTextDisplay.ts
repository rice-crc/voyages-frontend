export const cleanUpTextDisplay = (textDisplay: string) => {
  if (typeof textDisplay !== 'string') {
    textDisplay = String(textDisplay);
  }
  return textDisplay.replace(/<[^>]*>/g, '');
};
