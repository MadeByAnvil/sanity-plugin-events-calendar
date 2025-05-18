/**
 * Shared theme variables for styled components
 * Using Sanity's color system where possible
 */

import { blue, green, yellow, red } from '@sanity/color'

// Main theme object for consistent styling
export const theme = {
  // Colors from Sanity color system
  colors: {
    // Base colors
    background: '#ffffff',
    text: '#262626',
    border: '#e1e1e1',
    
    // Event status colors
    event: {
      default: {
        bg: blue[100].hex,
        border: blue[200].hex,
        text: blue[700].hex,
      },
      featured: {
        bg: green[50].hex,
        border: green[100].hex,
        text: green[600].hex,
      },
      postponed: {
        bg: yellow[50].hex,
        border: yellow[100].hex,
        text: yellow[600].hex,
      },
      cancelled: {
        bg: red[50].hex,
        border: red[100].hex,
        text: red[600].hex,
      }
    },
    
    // UI colors
    button: {
      primary: {
        bg: blue[500].hex,
        text: '#ffffff',
      },
      secondary: {
        bg: '#ffffff',
        text: '#262626',
        border: '#e1e1e1',
      }
    },
    
    info: {
      bg: blue[100].hex,
      border: blue[200].hex,
      text: '#262626',
    },
    
    highlight: blue[100].hex,
  },
  
  // Spacing
  space: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  
  // Border radius
  radii: {
    sm: '2px',
    md: '4px',
    lg: '8px',
  },
  
  // Typography
  fonts: {
    // Inherits from Sanity UI
    base: 'inherit',
  },
  
  fontSizes: {
    xs: '0.7rem',
    sm: '0.8rem',
    base: '0.9rem',
    md: '1rem',
    lg: '1.2rem',
    xl: '1.5rem',
  },
  
  // Layout
  calendar: {
    dayWidth: 'calc(100% / 7 - 1px)',
    dayMinHeight: '100px',
  },
  
  // Transitions
  transitions: {
    fast: '0.15s ease',
    base: '0.2s ease',
    slow: '0.3s ease',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 1px 3px rgba(0, 0, 0, 0.1)',
    lg: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  
  // Z-indices
  zIndices: {
    dropdown: 10,
    modal: 100,
  },
}

// Helper to create hover and focus styles
export const interactiveStateStyles = `
  &:hover {
    opacity: 0.9;
  }
  &:focus {
    outline: 2px solid ${theme.colors.event.default.border};
    outline-offset: 1px;
  }
`

// Helper for disabled state
export const disabledStyles = `
  opacity: 0.6;
  cursor: not-allowed;
`