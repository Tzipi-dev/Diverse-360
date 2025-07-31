
import React from 'react';
import './global.css';

type InputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
};

export default function Input({ label, value, onChange, placeholder, error }: InputProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: '10px',
          width: '100%',
          borderRadius: 'var(--border-radius)',
          border: error ? '1px solid red' : '1px solid #ccc',
          outline: 'none'
        }}
      />
      {error && <div style={{ color: 'red', marginTop: '4px' }}>{error}</div>}
    </div>
  );
}
