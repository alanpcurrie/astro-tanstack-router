// C4 diagram specific sizes and tokens
import { type Theme, webLightTheme } from "@fluentui/react-components";

const C4_ICON_SIZE = "40px";
const C4_NODE_WIDTH = "160px";
const C4_NODE_PADDING = "12px";
const C4_CONTAINER_WIDTH = "300px";
const C4_CONTAINER_HEIGHT = "300px";
const C4_LABEL_FONT_SIZE = "13px";
const C4_DESCRIPTION_FONT_SIZE = "11px";
const C4_HANDLE_SIZE = "6px";

// Cyberpunk theme colors
export const COLOR_PINK = "#ff0090";
export const COLOR_CYAN = "#00e5ff";
export const COLOR_DARK_BG = "#0f0e17";
export const COLOR_LIGHT_TEXT = "#f4f4f8";
export const COLOR_MINT = "#00f5d4";
export const COLOR_PURPLE = "#a239ca";
export const COLOR_ORANGE = "#ff6f3c";
export const COLOR_YELLOW = "#ffde7d";
export const COLOR_VIOLET = "#e500ff";
export const COLOR_WHITE = "white";
export const COLOR_NAV_BG = "#333";
export const COLOR_MAGENTA = "#ff00ff";

// Event Storming colors
export const EVENT_STORMING_DOMAIN_EVENT = "#FFA500"; // Orange
export const EVENT_STORMING_COMMAND = "#1E90FF"; // Blue
export const EVENT_STORMING_ACTOR = "#FFD700"; // Gold
export const EVENT_STORMING_AGGREGATE = "#8B4513"; // Brown
export const EVENT_STORMING_POLICY = "#9370DB"; // Purple
export const EVENT_STORMING_READ_MODEL = "#32CD32"; // Green
export const EVENT_STORMING_EXTERNAL_SYSTEM = "#FF69B4"; // Pink
export const EVENT_STORMING_HOT_SPOT = "#FF0000"; // Red

// Font settings
export const FONT_FAMILY_COURIER = "'SpaceMono-Regular', 'Courier New', Courier, monospace";
export const FONT_SIZE_NORMAL = "16px";
export const FONT_SIZE_HEADING = "24px";
export const FONT_WEIGHT_BOLD = 700;

// Border radius
export const BORDER_RADIUS_MEDIUM = "12px";
export const BORDER_RADIUS_SMALL = "8px";

// Shadows
export const SHADOW_SMALL = `0px 0px 10px ${COLOR_PINK}`;
export const SHADOW_LARGE = `0px 0px 20px ${COLOR_CYAN}`;

// Spacing
export const SPACING_HORIZONTAL_XS = "5px";
export const SPACING_HORIZONTAL_S = "10px";
export const SPACING_HORIZONTAL_M = "16px";
export const SPACING_HORIZONTAL_L = "24px";
export const SPACING_HORIZONTAL_XL = "32px";

export const SPACING_VERTICAL_XS = "5px";
export const SPACING_VERTICAL_S = "10px";
export const SPACING_VERTICAL_M = "12px";
export const SPACING_VERTICAL_L = "20px";
export const SPACING_VERTICAL_XL = "32px";

// Padding
export const PADDING_NONE = "0";
export const PADDING_XS = "5px";
export const PADDING_S = "10px";
export const PADDING_M = "15px";
export const PADDING_L = "20px";
export const PADDING_XL = "30px";
export const PADDING_NAV = "10px 0"; // Specific for nav element
export const PADDING_CONTENT = "20px"; // Specific for content areas

// Margin
export const MARGIN_NONE = "0";
export const MARGIN_XS = "5px";
export const MARGIN_S = "10px";
export const MARGIN_M = "15px";
export const MARGIN_L = "20px";
export const MARGIN_XL = "30px";
export const MARGIN_NAV_ITEM = "0 10px"; // Specific for nav items

// Export C4 tokens for use in components
export const c4Tokens = {
  iconSize: C4_ICON_SIZE,
  nodeWidth: C4_NODE_WIDTH,
  nodePadding: C4_NODE_PADDING,
  containerWidth: C4_CONTAINER_WIDTH,
  containerHeight: C4_CONTAINER_HEIGHT,
  labelFontSize: C4_LABEL_FONT_SIZE,
  descriptionFontSize: C4_DESCRIPTION_FONT_SIZE,
  handleSize: C4_HANDLE_SIZE,
};

// Export the cyberpunk theme
export const cyberpunkTheme: Theme = {
  ...webLightTheme,
  colorBrandBackground: COLOR_PINK,
  colorBrandBackgroundHover: COLOR_CYAN,
  colorNeutralBackground1: COLOR_DARK_BG,
  colorNeutralForeground1: COLOR_LIGHT_TEXT,
  colorBrandForeground1: COLOR_MINT,
  colorNeutralStroke1: COLOR_PURPLE,
  colorBrandBackgroundPressed: COLOR_ORANGE,
  colorNeutralForeground2: COLOR_YELLOW,

  fontFamilyBase: FONT_FAMILY_COURIER,
  fontFamilyMonospace: FONT_FAMILY_COURIER,
  fontWeightBold: FONT_WEIGHT_BOLD,

  borderRadiusMedium: BORDER_RADIUS_MEDIUM,
  borderRadiusSmall: BORDER_RADIUS_SMALL,

  shadow2: SHADOW_SMALL,
  shadow4: SHADOW_LARGE,

  spacingHorizontalM: SPACING_HORIZONTAL_M,
  spacingVerticalM: SPACING_VERTICAL_M,
  spacingHorizontalL: SPACING_HORIZONTAL_L,
};

// Export app-specific spacing and sizing tokens
export const appTokens = {
  // Font sizes
  fontSizeNormal: FONT_SIZE_NORMAL,
  fontSizeHeading: FONT_SIZE_HEADING,
  
  // Padding
  paddingNone: PADDING_NONE,
  paddingXs: PADDING_XS,
  paddingS: PADDING_S,
  paddingM: PADDING_M,
  paddingL: PADDING_L,
  paddingXl: PADDING_XL,
  paddingNav: PADDING_NAV,
  paddingContent: PADDING_CONTENT,
  
  // Margin
  marginNone: MARGIN_NONE,
  marginXs: MARGIN_XS,
  marginS: MARGIN_S,
  marginM: MARGIN_M,
  marginL: MARGIN_L,
  marginXl: MARGIN_XL,
  marginNavItem: MARGIN_NAV_ITEM,
  
  // Spacing
  spacingHorizontalXs: SPACING_HORIZONTAL_XS,
  spacingHorizontalS: SPACING_HORIZONTAL_S,
  spacingHorizontalM: SPACING_HORIZONTAL_M,
  spacingHorizontalL: SPACING_HORIZONTAL_L,
  spacingHorizontalXl: SPACING_HORIZONTAL_XL,
  
  spacingVerticalXs: SPACING_VERTICAL_XS,
  spacingVerticalS: SPACING_VERTICAL_S,
  spacingVerticalM: SPACING_VERTICAL_M,
  spacingVerticalL: SPACING_VERTICAL_L,
  spacingVerticalXl: SPACING_VERTICAL_XL,
};
