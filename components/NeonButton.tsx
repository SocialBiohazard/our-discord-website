import React from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'cyan' | 'pink' | 'yellow' | 'green';
  className?: string;
}

export function NeonButton({ 
  children, 
  href, 
  onClick, 
  variant = 'cyan',
  className = ''
}: NeonButtonProps) {
  const baseClasses = `
    px-6 py-2 font-orbitron text-sm font-medium
    transition-all duration-200 relative inline-block
    cursor-pointer rounded-md shining-text text-purple-400
  `;
  
  const variantClasses = {
    cyan: 'hover:bg-gray-400/10',
    pink: 'hover:bg-gray-400/10',
    yellow: 'hover:bg-gray-400/10',
    green: 'hover:bg-gray-400/10'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
