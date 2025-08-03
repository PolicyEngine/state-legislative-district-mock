import React, { useState, useEffect } from 'react';
import { colors } from '../styles/colors';

interface DemoDropdownProps {
  isVisible: boolean;
  options: string[];
  selectedIndex: number;
  position: { x: number; y: number };
}

const DemoDropdown: React.FC<DemoDropdownProps> = ({ 
  isVisible, 
  options, 
  selectedIndex, 
  position 
}) => {
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Delay showing options to simulate click
      setTimeout(() => setShowOptions(true), 300);
    } else {
      setShowOptions(false);
    }
  }, [isVisible]);

  if (!isVisible || !showOptions) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y + 35,
        backgroundColor: colors.WHITE,
        border: `1px solid ${colors.MEDIUM_DARK_GRAY}`,
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 10001,
        width: '250px',
        maxHeight: '280px',
        overflowY: 'auto',
        animation: 'slideDown 0.2s ease-out',
      }}
    >
      {options.map((option, index) => (
        <div
          key={index}
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: index === selectedIndex ? colors.BLUE : colors.WHITE,
            color: index === selectedIndex ? colors.WHITE : colors.DARK_GRAY,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.1s ease',
          }}
          onMouseEnter={(e) => {
            if (index !== selectedIndex) {
              e.currentTarget.style.backgroundColor = colors.BLUE_98;
            }
          }}
          onMouseLeave={(e) => {
            if (index !== selectedIndex) {
              e.currentTarget.style.backgroundColor = colors.WHITE;
            }
          }}
        >
          {option}
        </div>
      ))}
      
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default DemoDropdown;