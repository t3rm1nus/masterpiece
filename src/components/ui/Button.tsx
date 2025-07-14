/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

const buttonBase = css`
  padding: 0.5em 1.2em;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const variants = {
  primary: css`
    background: #0078d4;
    color: #fff;
  `,
  secondary: css`
    background: #eee;
    color: #222;
  `,
  danger: css`
    background: #d32f2f;
    color: #fff;
  `
};

const disabledStyle = css`
  opacity: 0.6;
  cursor: not-allowed;
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  children: React.ReactNode;
}

// =============================================================================
// Button (Reusable UI Button Component) [DEPRECATED]
// -----------------------------------------------------------------------------
// DEPRECATED: Use UiButton for unified button styles and accessibility.
// This component is legacy and will be removed in future versions.
// - Simple, accessible button with variant support (primary, secondary, danger).
// - Optimized for UX and keyboard accessibility.
//
// Example usage:
//   <Button variant="primary">Click me</Button>
// -----------------------------------------------------------------------------
// =============================================================================
export default function Button({ 
  variant = 'primary', 
  disabled, 
  children, 
  ...props 
}: ButtonProps): React.JSX.Element {
  return (
    <button
      css={[
        buttonBase,
        variants[variant] || variants.primary,
        disabled && disabledStyle
      ]}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
} 