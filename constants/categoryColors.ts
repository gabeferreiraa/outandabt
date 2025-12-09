// Category colors based on design specifications
export const CATEGORY_COLORS = {
  "eat & drink": "#CC432E",
  "shop & stroll": "#4D98CD",
  "tour & learn": "#115B37",
  "move & play": "#738FB9",
  "watch & enjoy": "#005692",
  nightlife: "#7D4556",
  default: "#95A5A6",
} as const;

// Export individual colors for easy access
export const COLORS = {
  eat: "#CC432E",
  shop: "#4D98CD",
  tour: "#115B37",
  move: "#738FB9",
  watch: "#005692",
  nightlife: "#7D4556",
  default: "#95A5A6",
} as const;

// Function to get color based on category string
export function getCategoryColor(category?: string): string {
  if (!category) return CATEGORY_COLORS.default;

  const lowerCategory = category.toLowerCase().trim();

  // Direct match first
  if (lowerCategory in CATEGORY_COLORS) {
    return CATEGORY_COLORS[lowerCategory as keyof typeof CATEGORY_COLORS];
  }

  // Partial match fallback
  if (lowerCategory.includes("eat")) return COLORS.eat;
  if (lowerCategory.includes("shop")) return COLORS.shop;
  if (lowerCategory.includes("tour")) return COLORS.tour;
  if (lowerCategory.includes("move")) return COLORS.move;
  if (lowerCategory.includes("watch")) return COLORS.watch;
  if (lowerCategory.includes("nightlife")) return COLORS.nightlife;

  return CATEGORY_COLORS.default;
}
