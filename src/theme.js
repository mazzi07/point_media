import { extendTheme, theme as chakraTheme } from '@chakra-ui/react';

const pair = (light, dark) => ({ default: light, _dark: dark });
const focus = { outline: '2px solid', outlineColor: 'focus', outlineOffset: '3px', boxShadow: 'none' };
const primary = {
  bg: 'brandPink', color: 'white', boxShadow: 'none',
  _hover: { bg: '#B81469', _disabled: { bg: 'brandPink' } },
  _active: { bg: '#9F115B' },
};
const secondary = {
  bg: 'surface', color: 'textPrimary', border: '1px solid', borderColor: 'borderStrong', boxShadow: 'none',
  _hover: { bg: 'hover' }, _active: { bg: 'active' },
};
const field = {
  bg: 'surface', color: 'textPrimary', border: '1px solid', borderColor: 'borderStrong', borderRadius: 'control',
  _placeholder: { color: 'textMuted', opacity: 1 },
  _hover: { borderColor: 'textMuted' },
  _focusVisible: { borderColor: 'focus', boxShadow: '0 0 0 1px var(--chakra-colors-focus)' },
  _invalid: { borderColor: 'danger', boxShadow: '0 0 0 1px var(--chakra-colors-danger)' },
  _disabled: { opacity: 0.6, cursor: 'not-allowed', bg: 'subtle' },
};
const choice = {
  borderColor: 'borderStrong',
  _checked: { bg: 'brandPink', borderColor: 'brandPink', color: 'white', _hover: { bg: '#B81469', borderColor: '#B81469' } },
  _focusVisible: focus,
  _invalid: { borderColor: 'danger' },
  _disabled: { opacity: 0.5, cursor: 'not-allowed' },
};
const type = (fontSize, lineHeight, fontWeight = 400, letterSpacing = 'normal') => ({ fontSize, lineHeight, fontWeight, letterSpacing });

export default extendTheme({
  config: { initialColorMode: 'dark', useSystemColorMode: false },
  colors: {
    // Existing names remain compatible with page-level color mode choices.
    brand: { pink: '#D5187B', blue: '#3B82F6', darkBg: '#121316', cardBg: '#1B1D22', lightBg: '#F7F8FA', lightCardBg: '#FFFFFF' },
  },
  semanticTokens: {
    colors: {
      page: pair('#F7F8FA', '#121316'), subtle: pair('#EEF0F4', '#17191D'),
      surface: pair('#FFFFFF', '#1B1D22'), surfaceSubtle: pair('#F1F3F6', '#20232A'), elevated: pair('#FFFFFF', '#262A32'),
      border: pair('#DDE1E7', '#303540'), borderStrong: pair('#8993A2', '#687384'),
      textPrimary: pair('#1C2430', '#F1F3F6'), textSecondary: pair('#4D596B', '#BAC2CE'), textMuted: pair('#626E7F', '#98A3B3'),
      brandPink: '#D5187B', brandBlue: '#3B82F6',
      success: pair('#187143', '#70D6A0'), warning: pair('#875500', '#EBC16B'), danger: pair('#B42336', '#FF8C99'), info: pair('#245EC7', '#85B4FF'),
      hover: pair('#EAEFF5', '#2B3039'), active: pair('#DEE6F0', '#353D49'), focus: pair('#245EC7', '#85B4FF'),
    },
  },
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  radii: { control: '8px', card: '10px', dialog: '12px' },
  sizes: { content: '80rem', reading: '48rem' },
  // Chakra's existing 4px spacing scale is preserved.
  textStyles: {
    display: type({ base: '2.5rem', md: '3.5rem' }, 1.1, 700, '-0.03em'),
    h1: type({ base: '1.75rem', md: '2.25rem' }, 1.2, 700, '-0.025em'),
    h2: type({ base: '1.5rem', md: '1.75rem' }, 1.25, 700, '-0.02em'),
    h3: type('1.25rem', 1.35, 600, '-0.01em'), h4: type('1.125rem', 1.4, 600),
    body: type('1rem', 1.6), small: type('0.875rem', 1.5), label: type('0.875rem', 1.4, 600), metadata: type('0.75rem', 1.5, 500),
  },
  layerStyles: {
    section: { py: { base: 8, md: 12, lg: 16 } },
    surface: { bg: 'surface', border: '1px solid', borderColor: 'border', borderRadius: 'card', p: { base: 4, md: 6 }, boxShadow: 'none' },
  },
  styles: {
    global: {
      body: { bg: 'page', color: 'textPrimary', lineHeight: 1.6 },
      'a:focus-visible, button:focus-visible': focus,
      // F1: AuthModal is deliberately dark in BOTH modes. Keep autofill opaque and readable.
      '.dark-modal input:-webkit-autofill, .dark-modal input:-webkit-autofill:hover, .dark-modal input:-webkit-autofill:focus, .dark-modal input:-webkit-autofill:active': {
        WebkitBoxShadow: '0 0 0 30px #18181B inset !important', WebkitTextFillColor: 'white !important', transition: 'background-color 5000s ease-in-out 0s',
      },
      '.dark-modal input::placeholder': { color: '#98A3B3', opacity: 1 },
      '.dark-modal input:focus-visible': { borderColor: '#85B4FF', outline: '2px solid #85B4FF', outlineOffset: '2px' },
      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': { animationDuration: '0.01ms !important', animationIterationCount: '1 !important', transitionDuration: '0.01ms !important', scrollBehavior: 'auto !important' },
      },
    },
  },
  components: {
    Container: { baseStyle: { maxW: 'content', px: { base: 4, md: 6, lg: 8 } } },
    Heading: { baseStyle: { fontWeight: 700, letterSpacing: '-0.02em', color: 'inherit' } },
    Button: {
      baseStyle: { fontWeight: 600, borderRadius: 'control', transition: 'background-color 180ms, color 180ms, border-color 180ms', _focusVisible: focus, _disabled: { opacity: 0.55, cursor: 'not-allowed', boxShadow: 'none' } },
      sizes: { sm: { h: 9, minW: 9, px: 3, fontSize: 'sm' }, md: { h: 10, minW: 10, px: 4 }, lg: { h: 12, minW: 12, px: 6 } },
      variants: {
        primary, secondary,
        solid: (props) => props.colorScheme === 'gray' ? secondary : chakraTheme.components.Button.variants.solid(props),
        // Compatibility alias: existing CTAs gain the solid treatment without editing pages.
        gradient: primary,
        outline: { ...secondary, bg: 'transparent' },
        ghost: { color: 'inherit', _hover: { bg: 'hover' }, _active: { bg: 'active' } },
        danger: { bg: '#B42336', color: 'white', _hover: { bg: '#921D2C' }, _active: { bg: '#771825' } },
        pill: { ...secondary, borderRadius: 'full', _selected: { bg: 'active', color: 'info', borderColor: 'info' }, _pressed: { bg: 'active', color: 'info', borderColor: 'info' } },
      },
      // Retain Chakra solid/colorScheme behavior (including destructive actions).
      defaultProps: { variant: 'solid' },
    },
    Input: { variants: { outline: { field, addon: { bg: 'subtle', borderColor: 'borderStrong' } } }, defaultProps: { variant: 'outline', focusBorderColor: 'focus', errorBorderColor: 'danger' } },
    Textarea: { variants: { outline: field }, defaultProps: { variant: 'outline', focusBorderColor: 'focus', errorBorderColor: 'danger' } },
    Select: { variants: { outline: { field: { ...field, '> option, > optgroup': { bg: 'surface', color: 'textPrimary' } }, icon: { color: 'textSecondary' } } }, defaultProps: { variant: 'outline', focusBorderColor: 'focus', errorBorderColor: 'danger' } },
    Checkbox: { baseStyle: { control: { ...choice, borderRadius: '4px' }, label: { lineHeight: 1.5 } } },
    Radio: { baseStyle: { control: choice, label: { lineHeight: 1.5 } } },
    FormLabel: { baseStyle: { fontSize: 'sm', fontWeight: 600, mb: 2, color: 'textPrimary' } },
    FormError: { baseStyle: { text: { color: 'danger', fontSize: 'sm' } } },
    Card: { baseStyle: { container: { borderRadius: 'card', color: 'textPrimary' } }, variants: { outline: { container: { bg: 'surface', border: '1px solid', borderColor: 'border', boxShadow: 'none' } }, elevated: { container: { bg: 'elevated', boxShadow: 'md' } } }, defaultProps: { variant: 'outline' } },
    Tag: { baseStyle: { container: { borderRadius: '4px', fontWeight: 500 } }, variants: { category: { container: { bg: 'surfaceSubtle', color: 'textSecondary', border: '1px solid', borderColor: 'border' } } }, defaultProps: { variant: 'category' } },
    Badge: { baseStyle: { borderRadius: '4px', textTransform: 'none', fontWeight: 600, px: 2 }, defaultProps: { variant: 'subtle' } },
    Menu: { baseStyle: { list: { bg: 'elevated', color: 'textPrimary', borderColor: 'border', borderRadius: 'card', boxShadow: 'lg', maxW: 'calc(100vw - 32px)', py: 2 }, item: { bg: 'elevated', _focus: { bg: 'hover' }, _hover: { bg: 'hover' } } } },
    Popover: { baseStyle: { content: { bg: 'elevated', color: 'textPrimary', borderColor: 'border', borderRadius: 'dialog', boxShadow: 'lg' } } },
    Modal: { baseStyle: { dialog: { bg: 'elevated', color: 'textPrimary', borderRadius: 'dialog', boxShadow: 'xl' } } },
  },
});
