import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// paleta de cores da Point Media
const colors = {
  brand: {
    pink: '#D5187B',
    blue: '#3B82F6',
    darkBg: '#09090B',
    cardBg: '#18181B',
    lightBg: '#F8FAFC',
    lightCardBg: '#FFFFFF',
  },
};

const fonts = {
  heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
};

const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'brand.darkBg' : 'brand.lightBg',
      color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
    },
    '::placeholder': {
      color: props.colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.400',
    },
    '.dark-modal input:-webkit-autofill, .dark-modal input:-webkit-autofill:hover, .dark-modal input:-webkit-autofill:focus, .dark-modal input:-webkit-autofill:active': {
      WebkitBoxShadow: '0 0 0 30px #18181B inset !important',
      WebkitTextFillColor: 'white !important',
      transition: 'background-color 5000s ease-in-out 0s',
    }
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: '12px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    variants: {
      gradient: (props) => ({
        bgGradient: props.colorMode === 'dark' ? 'linear(to-r, brand.pink, brand.blue)' : 'linear(to-r, brand.blue, brand.pink)',
        color: 'white',
        boxShadow: props.colorMode === 'dark' ? '0 8px 20px rgba(213, 24, 123, 0.2)' : '0 8px 20px rgba(59, 130, 246, 0.25)',
        _hover: {
          bgGradient: props.colorMode === 'dark' ? 'linear(to-r, #E6248C, #2563EB)' : 'linear(to-r, #2563EB, #E6248C)',
          transform: 'translateY(-2px)',
          boxShadow: props.colorMode === 'dark' ? '0 12px 25px rgba(213, 24, 123, 0.35)' : '0 12px 25px rgba(59, 130, 246, 0.35)',
        },
        _active: {
          transform: 'translateY(0)',
        }
      }),
      solid: (props) => ({
        bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        border: props.colorMode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: props.colorMode === 'dark' ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.04)',
        _hover: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.50',
          boxShadow: props.colorMode === 'dark' ? '0 6px 16px rgba(0,0,0,0.5)' : '0 6px 16px rgba(0,0,0,0.08)',
        }
      }),
      outline: (props) => ({
        borderColor: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200',
        color: props.colorMode === 'dark' ? 'gray.300' : 'gray.600',
        _hover: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50',
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.300',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        }
      })
    }
  },
  Input: {
    defaultProps: {
      variant: 'outline',
    },
    variants: {
      outline: (props) => ({
        field: {
          bg: props.colorMode === 'dark' ? 'blackAlpha.300' : 'white',
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200',
          boxShadow: props.colorMode === 'dark' ? 'inset 0 1px 2px rgba(0,0,0,0.5)' : 'inset 0 1px 2px rgba(0,0,0,0.02)',
          borderRadius: '12px',
          _hover: {
            borderColor: props.colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.300',
          },
          _focus: {
            bg: props.colorMode === 'dark' ? 'blackAlpha.400' : 'white',
            borderColor: 'brand.blue',
            boxShadow: props.colorMode === 'dark' ? `0 0 0 1px #3B82F6, inset 0 1px 2px rgba(0,0,0,0.5)` : `0 0 0 1px #3B82F6`,
          }
        }
      })
    }
  },
  Heading: {
    baseStyle: {
      fontWeight: '700',
      letterSpacing: '-0.02em',
      color: 'inherit',
    },
  },
  Text: {
    baseStyle: {
      color: 'inherit',
    }
  }
};

const theme = extendTheme({ config, colors, fonts, styles, components });

export default theme;
