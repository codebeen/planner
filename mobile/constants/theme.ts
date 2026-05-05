/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#4a1942',
    background: '#fdf2f8',
    tint: '#ec4899',
    icon: '#db2777',
    tabIconDefault: '#f9a8d4',
    tabIconSelected: '#ec4899',
    surface: '#ffffff',
    border: '#fce7f3',
    pink50: '#fdf2f8',
    pink100: '#fce7f3',
    pink200: '#fbcfe8',
    pink300: '#f9a8d4',
    pink400: '#f472b6',
    pink500: '#ec4899',
    pink600: '#db2777',
    pink700: '#be185d',
  },
  dark: {
    text: '#fce7f3',
    background: '#4a1942',
    tint: '#f472b6',
    icon: '#f9a8d4',
    tabIconDefault: '#be185d',
    tabIconSelected: '#f472b6',
    surface: '#5d1f52',
    border: '#be185d',
    pink50: '#fdf2f8',
    pink100: '#fce7f3',
    pink200: '#fbcfe8',
    pink300: '#f9a8d4',
    pink400: '#f472b6',
    pink500: '#ec4899',
    pink600: '#db2777',
    pink700: '#be185d',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
