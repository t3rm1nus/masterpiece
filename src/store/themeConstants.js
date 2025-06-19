// Static theme configuration constants
export const THEME_COLORS = {
  light: {
    background: '#ffffff',
    text: '#333333',
    primary: '#6c63ff',
    secondary: '#f8f9fa',
    border: '#e9ecef',
    cardBackground: '#ffffff',
    accent: '#ff6b6b'
  },
  dark: {
    background: '#121212',
    text: '#ffffff',
    primary: '#bb86fc',
    secondary: '#1e1e1e',
    border: '#333333',
    cardBackground: '#1e1e1e',
    accent: '#cf6679'
  }
};

export const MASTERPIECE_BADGE_CONFIG = {
  backgroundColor: '#FFD700',
  color: '#000000', 
  borderColor: '#FFA500',
  svg: {
    width: '16',
    height: '16',
    viewBox: '0 0 16 16',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg'
  },
  circle: {
    cx: '8',
    cy: '8',
    r: '8',
    fill: '#FFD700'
  },
  star: {
    d: 'M8 2l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z',
    fill: '#000000'
  }
};
