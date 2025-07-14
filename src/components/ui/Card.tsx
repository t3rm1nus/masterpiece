/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

const cardStyle = css`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 1.2em;
  margin: 0.5em 0;
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.2s, border 0.2s;
  display: flex;
  flex-direction: column;
  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.13);
    border-color: #bdbdbd;
  }
`;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// =============================================================================
// Card (Simple UI Card Component) [DEPRECATED]
// -----------------------------------------------------------------------------
// DEPRECATED: Use UiCard for unified card styles and modularity.
// This component is legacy and will be removed in future versions.
// - Simple, accessible card for legacy layouts.
//
// Example usage:
//   <Card>Content</Card>
// -----------------------------------------------------------------------------
// =============================================================================
export default function Card({ children, ...props }: CardProps): React.JSX.Element {
  return <div css={cardStyle} {...props}>{children}</div>;
} 