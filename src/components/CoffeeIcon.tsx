// Icono SVG de café para usar inline
import React from 'react';

interface CoffeeIconProps extends React.SVGProps<SVGSVGElement> {
  style?: React.CSSProperties;
}

const CoffeeIcon: React.FC<CoffeeIconProps> = ({ style = {}, ...props }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ verticalAlign: 'middle', marginRight: 6, ...style }}
    {...props}
  >
    <path d="M18 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a6 6 0 0 0 12 0v-2h2a2 2 0 0 0 0-4h-2z" stroke="#7B4F23" strokeWidth="1.5" fill="#C69C6D"/>
    <path d="M6 2v2M10 2v2M14 2v2" stroke="#7B4F23" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

export default CoffeeIcon;