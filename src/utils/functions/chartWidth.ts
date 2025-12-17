export const chartWidthCustom = (width: number, maxWidth: number) => {
  // Account for padding, margins, and sidebar
  const padding = 0; // Account for container padding
  const sidebarWidth = 150; // Estimate sidebar width from screenshot

  if (width < 768) {
    // Mobile: use smaller width to prevent cutoff
    // Reduce by additional 10% to ensure labels don't get cut off
    return Math.max(280, Math.min(maxWidth - padding, width));
    // return Math.max(300, maxWidth - padding);
  } else {
    // Desktop: subtract sidebar and padding
    return Math.max(400, width - sidebarWidth - padding);
  }
};

export const chartHeightCustom = (height: number) => {
  return Math.min(550, height * 0.55); // Max 550px or 50% of viewport height
};
