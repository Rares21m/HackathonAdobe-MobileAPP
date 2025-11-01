// constants/themes.js
export const colors = {
  // Brand vibrante
  primary: '#7B61FF',      // violet accent
  secondary: '#FF8C42',    // orange contrast
  tertiary: '#00C9A7',     // mint accent

  // Neutre
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  textSecondary: '#6B7280',

  // Semantice
  success: '#10B981',
  warning: '#F59E0B',
  error:   '#EF4444',
  info:    '#3B82F6',

  // (Opțional) Gradiente pentru header/butoane speciale
  gradients: {
    main: ['#7B61FF', '#FF8C42'],
    cool: ['#00C9A7', '#7B61FF'],
  },
};

export const theme = {
  colors,
  roundness: 12,
  spacing: (n) => n * 8,
};
export default theme;
