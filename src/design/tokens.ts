export const colors = {
  // More refined neutral palette with warmer grays
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },
  // Sophisticated accent color
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',  // Main brand color - refined slate
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  }
}

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem'
}

export const typography = {
  fonts: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace'
  },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.75rem' // Slightly smaller for more refinement
  },
  lineHeights: {
    tight: '1.2',
    base: '1.5',
    relaxed: '1.75'
  }
}

// Update shadows for more subtlety
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.03)',
  base: '0 1px 3px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 8px 12px -2px rgba(0, 0, 0, 0.05)'
}

export const radii = {
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px'
}

export const animations = {
  transitions: {
    base: 'all 0.3s ease',
    smooth: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  keyframes: {
    fadeIn: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
    slideUp: '@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }',
    float: '@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }'
  }
}

// Add focus styles
export const focusRings = {
  base: '0 0 0 2px white, 0 0 0 4px rgba(99, 102, 241, 0.3)',
  dark: '0 0 0 2px #1f2937, 0 0 0 4px rgba(99, 102, 241, 0.3)'
} 