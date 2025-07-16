// Helper function to force style recalculation
export const forceStyleRecalculation = () => {
  // Method 1: Force reflow on all MUI elements
  const muiElements = document.querySelectorAll(
    '[class*="Mui"], [class*="css-"]',
  );
  muiElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const display = htmlElement.style.display;
    htmlElement.style.display = 'none';
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    htmlElement.offsetHeight; // Trigger reflow
    htmlElement.style.display = display;
  });

  // Method 2: Remove and re-add emotion style tags
  const emotionStyles = document.querySelectorAll('style[data-emotion]');
  const styleContents: string[] = [];

  emotionStyles.forEach((style, index) => {
    styleContents[index] = style.innerHTML;
    style.remove();
  });

  // Re-add styles after a micro-task
  setTimeout(() => {
    styleContents.forEach((content) => {
      if (content) {
        const newStyle = document.createElement('style');
        newStyle.setAttribute('data-emotion', 'css');
        newStyle.innerHTML = content;
        document.head.appendChild(newStyle);
      }
    });
  }, 0);

  // Method 3: Force repaint on body
  document.body.style.display = 'none';
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  document.body.offsetHeight;
  document.body.style.display = '';
};
