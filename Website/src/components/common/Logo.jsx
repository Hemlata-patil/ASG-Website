import React, { useState } from 'react';
import logoImg from '../../assets/logo.png';

export default function Logo({ size = 'medium', variant = 'full', light = false }) {
  const [clicks, setClicks] = useState(0);

  const handleLogoClick = () => {
    setClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        const origin = window.location.origin;
        if (origin.includes("5173")) {
          window.location.href = origin.replace("5173", "5174");
        } else {
          window.location.href = "http://localhost:5174";
        }
        return 0;
      }
      return next;
    });

    // Reset after 2s inactivity
    setTimeout(() => {
      setClicks(0);
    }, 2000);
  };

  // Sizes mapping
  const logoHeight = {
    small: '85px',
    medium: '100px',
    large: '88px'
  }[size];

  return (
    <img
      src={logoImg}
      alt="APEX Startup Group"
      onClick={handleLogoClick}
      style={{
        height: logoHeight,
        width: 'auto',
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: light ? 'invert(1) hue-rotate(180deg) brightness(1.2)' : 'none',
        transition: 'filter 0.3s ease',
        cursor: 'pointer'
      }}
    />
  );
}
