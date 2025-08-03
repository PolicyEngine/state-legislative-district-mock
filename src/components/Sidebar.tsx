import React from 'react';
import { colors } from '../styles/colors';
import logo from '../assets/logo-blue.svg';

interface SidebarProps {
  selectedDistrict: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedDistrict }) => {
  const menuItems = [
    { icon: '🏠', label: 'Dashboard', active: true },
    { icon: '📄', label: 'Active Bills', active: false },
    { icon: '📊', label: 'Impact Analysis', active: false },
    { icon: '📈', label: 'Reports', active: false },
  ];

  const configItems = [
    { icon: '🗳️', label: 'District Settings', active: false },
    { icon: '👥', label: 'Demographics', active: false },
  ];

  const resourceItems = [
    { icon: '📚', label: 'Methodology', active: false },
    { icon: '💬', label: 'Contact Support', active: false },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <img src={logo} alt="PolicyEngine" style={styles.logo} />
      </div>

      {selectedDistrict && (
        <div style={styles.districtInfo}>
          <p style={styles.districtLabel}>Current District</p>
          <p style={styles.districtName}>{selectedDistrict}</p>
        </div>
      )}

      <nav style={styles.nav}>
        <div style={styles.navSection}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.navItem,
                ...(item.active ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div style={styles.navSection}>
          <h3 style={styles.sectionTitle}>Configurations</h3>
          {configItems.map((item, index) => (
            <div key={index} style={styles.navItem}>
              <span style={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div style={styles.navSection}>
          <h3 style={styles.sectionTitle}>Resources</h3>
          {resourceItems.map((item, index) => (
            <div key={index} style={styles.navItem}>
              <span style={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: colors.WHITE,
    borderRight: `1px solid ${colors.LIGHT_GRAY}`,
    height: '100vh',
    position: 'fixed' as const,
    left: 0,
    top: 0,
    overflowY: 'auto' as const,
  },
  header: {
    padding: '2rem 1.5rem',
    borderBottom: `1px solid ${colors.LIGHT_GRAY}`,
  },
  logo: {
    width: '180px',
    height: 'auto',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: colors.GRAY,
    margin: '0.25rem 0 0 0',
  },
  districtInfo: {
    padding: '1rem 1.5rem',
    backgroundColor: colors.TEAL_LIGHT,
    borderBottom: `1px solid ${colors.LIGHT_GRAY}`,
  },
  districtLabel: {
    fontSize: '0.75rem',
    color: colors.GRAY,
    margin: 0,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  districtName: {
    fontSize: '1rem',
    color: colors.DARKEST_BLUE,
    fontWeight: 500,
    margin: '0.25rem 0 0 0',
  },
  nav: {
    padding: '1.5rem 0',
  },
  navSection: {
    marginBottom: '2rem',
    paddingBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '0.75rem',
    color: colors.GRAY,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 0.75rem 1.5rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.875rem',
    color: colors.DARK_GRAY,
    '&:hover': {
      backgroundColor: colors.BLUE_98,
      color: colors.DARKEST_BLUE,
    },
  },
  navItemActive: {
    backgroundColor: colors.TEAL_LIGHT,
    color: colors.DARKEST_BLUE,
    fontWeight: 500,
    borderLeft: `3px solid ${colors.TEAL_ACCENT}`,
    paddingLeft: 'calc(1.5rem - 3px)',
  },
  icon: {
    fontSize: '1.125rem',
    width: '24px',
    textAlign: 'center' as const,
  },
};

export default Sidebar;