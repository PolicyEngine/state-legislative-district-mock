import React from 'react';
import { colors } from '../styles/colors';
import Sidebar from './Sidebar';
import MockDataBanner from './MockDataBanner';

interface LayoutProps {
  children: React.ReactNode;
  selectedDistrict: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, selectedDistrict }) => {
  return (
    <div style={styles.container}>
      <Sidebar selectedDistrict={selectedDistrict} />
      <div style={styles.mainContent}>
        <MockDataBanner />
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.BLUE_98,
  },
  mainContent: {
    flex: 1,
    marginLeft: '260px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  content: {
    padding: '2rem',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
};

export default Layout;