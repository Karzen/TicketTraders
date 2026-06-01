import React, { useState, useLayoutEffect } from 'react';

interface RippleProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
}

interface RippleCircle {
  x: number;
  y: number;
  size: number;
  id: number;
}

export const Ripple: React.FC<RippleProps> = ({ children, className = '', onClick }) => {
  const [rippleArray, setRippleArray] = useState<RippleCircle[]>([]);

  useLayoutEffect(() => {
    // Cleanup expired ripples
    if (rippleArray.length > 0) {
      const timer = setTimeout(() => {
        setRippleArray([]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [rippleArray.length]);

  const addRipple = (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    const container = event.currentTarget.getBoundingClientRect();
    const size = container.width > container.height ? container.width : container.height;
    const x = event.clientX - container.left - size / 2;
    const y = event.clientY - container.top - size / 2;

    const newRipple: RippleCircle = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRippleArray(prev => [...prev, newRipple]);
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div
      onClick={addRipple}
      className={`relative overflow-hidden cursor-pointer ${className}`}
    >
      {rippleArray.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple-element"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      {children}
    </div>
  );
};
