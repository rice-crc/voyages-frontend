export const chartWidthCustom = (width: number, maxWidth: number) => {
  // Account for padding, margins, and sidebar
  const padding = 30; // Account for container padding
  const sidebarWidth = 150; // Estimate sidebar width from screenshot

  if (width < 768) {
    // Mobile: use full available width minus padding
    return Math.max(300, maxWidth - padding);
  } else {
    // Desktop: subtract sidebar and padding
    return Math.max(400, width - sidebarWidth - padding);
  }
};

export const chartHeightCustom = (height: number) => {
  return Math.min(500, height * 0.6); // Max 500px or 60% of viewport height
};
