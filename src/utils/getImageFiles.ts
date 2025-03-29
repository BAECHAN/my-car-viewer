export const getImageFiles = (): string[] => {
  const images = import.meta.glob("/src/assets/k9/swp/*.png", { eager: true });
  return Object.keys(images).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.match(/\d+/)?.[0] || "0");
    return numA - numB;
  });
};
