import React from 'react';
import { colors } from '../styles/colors';

const MockDataBanner: React.FC = () => {
  return (
    <>
      <div style={styles.banner}>
        <div className="container" style={styles.container}>
          <p style={styles.text}>
            <strong>⚠️ MOCK DATA</strong> - This application uses simulated data for demonstration purposes only
          </p>
        </div>
      </div>
      <div style={styles.watermark}>MOCK DATA</div>
    </>
  );
};

const styles = {
  banner: {
    backgroundColor: '#FFF3CD',
    borderBottom: '2px solid #FFC107',
    position: 'sticky' as const,
    top: '0',
    zIndex: 99,
  },
  container: {
    padding: '0.75rem 1rem',
  },
  text: {
    color: '#856404',
    fontSize: '0.875rem',
    margin: 0,
    textAlign: 'center' as const,
  },
  watermark: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    fontSize: '4rem',
    fontWeight: 700,
    color: colors.MEDIUM_LIGHT_GRAY,
    opacity: 0.3,
    transform: 'rotate(-15deg)',
    pointerEvents: 'none' as const,
    userSelect: 'none' as const,
    zIndex: 1000,
  },
};

export default MockDataBanner;