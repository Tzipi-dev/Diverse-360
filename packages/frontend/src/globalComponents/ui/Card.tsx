import React from 'react';
import './global.css';
type CardProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;  // הוסף אפשרות לקבל style חיצוני
};
export default function Card({ title, description, children, style }: CardProps) {
  return (
    <div
      style={{
        border: '1px solid #E0E0E0',
        borderRadius: 'var(--border-radius)',
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        backgroundColor: 'white',
        marginBottom: '16px',
        // maxWidth: '400px',
        ...style, // כאן מערבבים את הסגנון החיצוני שמגיע בפרופס
      }}
    >
      <h3 style={{ color: 'var(--color-primary)', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: 'var(--color-text)', marginBottom: '12px' }}>{description}</p>
      {children}
    </div>
  );
}