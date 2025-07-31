
import React from 'react';
import './global.css';

type LayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function Layout({ title, children }: LayoutProps) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'var(--font-family)' }}>
      <h1 style={{ color: 'var(--color-primary)' }}>{title}</h1>
      <hr style={{ marginBottom: '1rem' }} />
      {children}
    </div>
  );
}
