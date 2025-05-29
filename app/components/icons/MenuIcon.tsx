import React from "react";

const MenuIcon = ({ open = false, className = "" }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" className={className} aria-hidden="true">
    {open ? (
      // X icon for close
      <g stroke="#2E3E5C" strokeWidth="2" strokeLinecap="round">
        <line x1="7" y1="7" x2="21" y2="21" />
        <line x1="21" y1="7" x2="7" y2="21" />
      </g>
    ) : (
      // Hamburger icon
      <g stroke="#2E3E5C" strokeWidth="2" strokeLinecap="round">
        <line x1="5" y1="8" x2="23" y2="8" />
        <line x1="5" y1="14" x2="23" y2="14" />
        <line x1="5" y1="20" x2="23" y2="20" />
      </g>
    )}
  </svg>
);

export default MenuIcon; 