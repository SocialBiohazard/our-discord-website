import React from 'react';

interface NeonCardProps {
  title: string;
  icon?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function NeonCard({ 
  title, 
  icon, 
  description, 
  children,
  className = ''
}: NeonCardProps) {
  return (
    <div className={`
      bg-black/70 border-2 border-neon-pink rounded-lg p-6 
      transition-all duration-300 hover:border-neon-cyan hover:shadow-neon
      ${className}
    `}>
      {icon && (
        <span className="text-3xl block mb-2 text-center">{icon}</span>
      )}
      <h3 className="font-bold text-xl text-text-secondary mb-2">{title}</h3>
      {description && (
        <p className="text-text-secondary mb-4">{description}</p>
      )}
      {children}
    </div>
  );
}
