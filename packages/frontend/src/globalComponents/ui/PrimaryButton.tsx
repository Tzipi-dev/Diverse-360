
import React from 'react';
import './global.css';

type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function PrimaryButton({ children, onClick }: PrimaryButtonProps) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
