import React from 'react';

interface SimulatedCursorProps {
  x: number;
  y: number;
  clicking: boolean;
}

const SimulatedCursor: React.FC<SimulatedCursorProps> = ({ x, y, clicking }) => {
  return (
    <>
      {/* Cursor pointer */}
      <div
        style={{
          position: 'fixed',
          left: x,
          top: y,
          width: '20px',
          height: '20px',
          backgroundColor: '#2C6496',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 10000,
          pointerEvents: 'none',
          opacity: clicking ? 0.6 : 0.8,
          scale: clicking ? 0.8 : 1,
          boxShadow: clicking 
            ? '0 0 0 15px rgba(44, 100, 150, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      />
      
      {/* Cursor trail for visual effect */}
      <div
        style={{
          position: 'fixed',
          left: x,
          top: y,
          width: '40px',
          height: '40px',
          border: '2px solid #2C6496',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: 0.3,
        }}
      />

      {/* Click effect */}
      {clicking && (
        <div
          style={{
            position: 'fixed',
            left: x,
            top: y,
            width: '60px',
            height: '60px',
            border: '2px solid #39C6C0',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9998,
            pointerEvents: 'none',
            animation: 'clickPulse 0.6s ease-out',
          }}
        />
      )}

      <style>
        {`
          @keyframes clickPulse {
            0% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
};

export default SimulatedCursor;