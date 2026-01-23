/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#231711";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FEFDF8",
    tint: tintColorLight,
    icon: "#231711",
    tabIconDefault: "#231711",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#FEFDF8",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

// src/theme/fonts.ts
export const Fonts = {
  thin: "Poppins_100Thin",
  extraLight: "Poppins_200ExtraLight",
  light: "Poppins_300Light",
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semiBold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
  extraBold: "Poppins_800ExtraBold",
  black: "Poppins_900Black",
  regularItalic: "Poppins_400Regular_Italic",
} as const;

// export const Fonts = Platform.select({
//   ios: {
//     /** iOS `UIFontDescriptorSystemDesignDefault` */
//     sans: "system-ui",
//     /** iOS `UIFontDescriptorSystemDesignSerif` */
//     serif: "ui-serif",
//     /** iOS `UIFontDescriptorSystemDesignRounded` */
//     rounded: "ui-rounded",
//     /** iOS `UIFontDescriptorSystemDesignMonospaced` */
//     mono: "ui-monospace",
//   },
//   default: {
//     sans: "normal",
//     serif: "serif",
//     rounded: "normal",
//     mono: "monospace",
//   },
//   web: {
//     sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
//     serif: "Georgia, 'Times New Roman', serif",
//     rounded:
//       "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
//     mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
//   },
// });
