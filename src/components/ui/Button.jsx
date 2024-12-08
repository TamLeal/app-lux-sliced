import React from 'react';

export function Button({ children, className, ...props }) {
  return (
    <button
      className={`py-2 px-4 rounded focus:outline-none focus:ring ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
