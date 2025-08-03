import React from 'react';
import { colors } from '../styles/colors';

interface ImpactToggleProps {
  view: 'state' | 'district';
  onChange: (view: 'state' | 'district') => void;
  districtName: string;
}

const ImpactToggle: React.FC<ImpactToggleProps> = ({ view, onChange, districtName }) => {
  return (
    <div style={styles.container}>
      <div style={styles.toggle}>
        <button
          style={{
            ...styles.button,
            ...(view === 'state' ? styles.activeButton : {}),
          }}
          onClick={() => onChange('state')}
        >
          Statewide Impact
        </button>
        <button
          style={{
            ...styles.button,
            ...(view === 'district' ? styles.activeButton : {}),
          }}
          onClick={() => onChange('district')}
        >
          {districtName} Impact
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  toggle: {
    display: 'inline-flex',
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: '8px',
    padding: '4px',
  },
  button: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.DARK_GRAY,
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    minWidth: '150px',
  },
  activeButton: {
    backgroundColor: colors.WHITE,
    color: colors.DARKEST_BLUE,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
};

export default ImpactToggle;