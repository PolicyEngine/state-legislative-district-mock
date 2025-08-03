import React from 'react';
import { colors } from '../styles/colors';

const Header: React.FC = () => {
  return (
    <header style={styles.header}>
      <div className="container" style={styles.container}>
        <div style={styles.logoSection}>
          <svg width="200" height="40" viewBox="0 0 200 40" style={styles.logo}>
            <text x="0" y="30" style={styles.logoText}>PolicyEngine</text>
          </svg>
          <div style={styles.divider} />
          <span style={styles.tagline}>Legislative Impact Analysis</span>
        </div>
        <nav style={styles.nav}>
          <span style={styles.navItem}>Dashboard</span>
          <span style={styles.navItem}>Bills</span>
          <span style={styles.navItem}>Reports</span>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: colors.BLUE,
    borderBottom: `1px solid ${colors.DARKEST_BLUE}`,
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    height: '64px',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    height: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  logo: {
    cursor: 'pointer',
  },
  logoText: {
    fill: colors.WHITE,
    fontSize: '28px',
    fontWeight: 600,
    fontFamily: 'Roboto, sans-serif',
  },
  divider: {
    width: '1px',
    height: '30px',
    backgroundColor: colors.WHITE,
    opacity: 0.3,
  },
  tagline: {
    color: colors.WHITE,
    fontSize: '1rem',
    fontWeight: 300,
    letterSpacing: '0.5px',
    opacity: 0.9,
  },
  nav: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navItem: {
    color: colors.WHITE,
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
  },
};

export default Header;