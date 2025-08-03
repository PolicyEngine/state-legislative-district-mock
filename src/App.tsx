import React, { useState, useEffect, useRef } from 'react';
import './styles/global.css';
import Layout from './components/Layout';
import DistrictSelector from './components/DistrictSelector';
import ActiveBills from './components/ActiveBills';
import ImpactToggle from './components/ImpactToggle';
import PolicySummary from './components/PolicySummary';
import BudgetaryImpact from './components/BudgetaryImpact';
import DistributionalImpact from './components/DistributionalImpact';
import PovertyInequalityImpact from './components/PovertyInequalityImpact';
import SimulatedCursor from './components/SimulatedCursor';
import DemoDropdown from './components/DemoDropdown';
import { useDemo } from './hooks/useDemo';
import { colors } from './styles/colors';

interface District {
  id: string;
  name: string;
  state: string;
}

interface Bill {
  id: string;
  number: string;
  title: string;
  sponsor: string;
  status: 'committee' | 'floor' | 'passed' | 'signed';
  lastAction: string;
  summary: string;
  fiscalImpact: number;
}

type Page = 'setup' | 'bills' | 'impact';

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [impactView, setImpactView] = useState<'state' | 'district'>('district');
  const [currentPage, setCurrentPage] = useState<Page>('setup');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const demoSequenceRef = useRef<number>(0);
  const isDemoActiveRef = useRef<boolean>(false);
  const [demoDropdown, setDemoDropdown] = useState<{
    isVisible: boolean;
    options: string[];
    selectedIndex: number;
    position: { x: number; y: number };
  }>({
    isVisible: false,
    options: [],
    selectedIndex: 0,
    position: { x: 0, y: 0 }
  });

  const handleSelectDistrict = (district: District) => {
    setSelectedDistrict(district);
    setCurrentPage('bills');
  };

  const handleSelectBill = (bill: Bill) => {
    setSelectedBill(bill);
    setCurrentPage('impact');
  };

  const handleBackToBills = () => {
    setCurrentPage('bills');
  };

  const { cursorPosition, isClicking, runDemoSequence, getElementCenter } = useDemo({
    isActive: isDemoMode,
    onStepComplete: (step) => {
      console.log(`Demo step ${step} completed`);
    }
  });

  // Demo sequences for different states
  const demoStates = ['California', 'Texas', 'New York', 'Florida', 'Illinois'];
  
  const runDemo = async () => {
    if (!isDemoActiveRef.current) return;
    
    const currentStateIndex = demoSequenceRef.current % demoStates.length;
    const stateName = demoStates[currentStateIndex];
    
    // Reset to initial state
    setCurrentPage('setup');
    setSelectedDistrict(null);
    setSelectedBill(null);
    setImpactView('district');
    window.scrollTo({ top: 0, behavior: 'auto' });

    const demoSteps = [
      // Initial wait
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 2000 },
      
      // Move to state dropdown
      { 
        action: 'move' as const, 
        target: () => {
          const select = document.querySelector('select');
          if (select) {
            const rect = select.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: window.innerWidth / 2, y: 300 };
        },
        duration: 1500 
      },
      
      // Click state dropdown to show options
      { 
        action: 'click' as const, 
        target: () => {
          const select = document.querySelector('select');
          if (select) {
            const rect = select.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: window.innerWidth / 2, y: 300 };
        },
        duration: 500,
        callback: () => {
          const select = document.querySelector('select') as HTMLSelectElement;
          if (select) {
            const rect = select.getBoundingClientRect();
            const options = Array.from(select.options).map(opt => opt.text);
            const stateIndex = options.findIndex(opt => opt === stateName);
            setDemoDropdown({
              isVisible: true,
              options: options,
              selectedIndex: stateIndex >= 0 ? stateIndex : 0,
              position: { x: rect.left, y: rect.top }
            });
          }
        }
      },
      
      // Wait to show dropdown
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 1500 },
      
      // Move to state option
      { 
        action: 'move' as const, 
        target: () => {
          const select = document.querySelector('select');
          if (select && demoDropdown.isVisible) {
            const rect = select.getBoundingClientRect();
            const optionHeight = 32; // Smaller, more realistic height
            const targetIndex = demoDropdown.selectedIndex;
            return { 
              x: rect.left + rect.width / 2, 
              y: rect.top + 35 + (targetIndex * optionHeight) + (optionHeight / 2)
            };
          }
          return { x: window.innerWidth / 2, y: 350 };
        },
        duration: 1000
      },
      
      // Click to select state
      { 
        action: 'click' as const, 
        target: () => {
          const select = document.querySelector('select');
          if (select && demoDropdown.isVisible) {
            const rect = select.getBoundingClientRect();
            const optionHeight = 32; // Smaller, more realistic height
            const targetIndex = demoDropdown.selectedIndex;
            return { 
              x: rect.left + rect.width / 2, 
              y: rect.top + 35 + (targetIndex * optionHeight) + (optionHeight / 2)
            };
          }
          return { x: window.innerWidth / 2, y: 350 };
        },
        duration: 500,
        callback: () => {
          setDemoDropdown(prev => ({ ...prev, isVisible: false }));
          setTimeout(() => {
            const select = document.querySelector('select') as HTMLSelectElement;
            if (select) {
              const options = Array.from(select.options);
              const stateOption = options.find(opt => opt.text === stateName);
              if (stateOption) {
                select.value = stateOption.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }
          }, 100);
        }
      },
      
      // Wait for chamber selection
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 1000 },
      
      // Move cursor to chamber buttons
      { 
        action: 'move' as const, 
        target: () => {
          const buttons = document.querySelectorAll('button[data-chamber]');
          if (buttons.length > 0) {
            const firstButton = buttons[0];
            const rect = firstButton.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: window.innerWidth / 2, y: 350 };
        },
        duration: 800
      },
      
      // Click first chamber button
      { 
        action: 'click' as const, 
        target: () => {
          const buttons = document.querySelectorAll('button[data-chamber]');
          if (buttons.length > 0) {
            const firstButton = buttons[0];
            const rect = firstButton.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: window.innerWidth / 2, y: 350 };
        },
        duration: 500,
        callback: () => {
          setTimeout(() => {
            const buttons = document.querySelectorAll('button[data-chamber]');
            if (buttons.length > 0) {
              (buttons[0] as HTMLButtonElement).click();
            }
          }, 100);
        }
      },
      
      // Wait for district selection
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 1000 },
      
      // Move to district dropdown (horizontally)
      { 
        action: 'move' as const, 
        target: () => {
          const selects = document.querySelectorAll('select');
          if (selects.length >= 2) {
            const rect = selects[1].getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: window.innerWidth / 2, y: 400 };
        },
        duration: 800
      },
      
      // Click district dropdown
      { 
        action: 'click' as const, 
        target: () => {
          const selects = document.querySelectorAll('select');
          if (selects.length >= 2) {
            const rect = selects[1].getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: window.innerWidth / 2, y: 400 };
        },
        duration: 500,
        callback: () => {
          const selects = document.querySelectorAll('select');
          if (selects.length >= 2) {
            const select = selects[1] as HTMLSelectElement;
            const rect = select.getBoundingClientRect();
            const options = Array.from(select.options).map(opt => opt.text);
            const targetIndex = Math.min(3, options.length - 1);
            setDemoDropdown({
              isVisible: true,
              options: options.slice(0, 10), // Show first 10 for visibility
              selectedIndex: targetIndex,
              position: { x: rect.left, y: rect.top }
            });
          }
        }
      },
      
      // Wait and move to district option
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 1000 },
      
      // Click to select district
      { 
        action: 'click' as const, 
        target: () => {
          const selects = document.querySelectorAll('select');
          if (selects.length >= 2) {
            const rect = selects[1].getBoundingClientRect();
            const targetIndex = Math.min(3, 10); // Using the visible option index
            return { x: rect.left + rect.width / 2, y: rect.top + 35 + (targetIndex * 32) + 16 };
          }
          return { x: window.innerWidth / 2, y: 480 };
        },
        duration: 500,
        callback: () => {
          setDemoDropdown(prev => ({ ...prev, isVisible: false }));
          setTimeout(() => {
            const selects = document.querySelectorAll('select');
            if (selects.length >= 2) {
              const select = selects[1] as HTMLSelectElement;
              if (select.options.length > 1) {
                select.selectedIndex = Math.min(3, select.options.length - 1);
                select.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }
          }, 100);
        }
      },
      
      // Wait on bills page
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 3000 },
      
      // Click on first bill
      { 
        action: 'click' as const, 
        target: () => {
          // Look for the bill cards using the class we added
          const billCards = document.querySelectorAll('.bill-card');
          if (billCards.length > 0) {
            const firstBill = billCards[0];
            const rect = firstBill.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: 600, y: 400 };
        },
        duration: 2000,
        callback: () => {
          setTimeout(() => {
            const billCards = document.querySelectorAll('.bill-card');
            if (billCards.length > 0) {
              (billCards[0] as HTMLElement).click();
            }
          }, 100);
        }
      },
      
      // Explore impact page
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 2000 },
      
      // Move to state/district toggle
      { 
        action: 'move' as const, 
        target: () => {
          const buttons = document.querySelectorAll('button');
          const stateButton = Array.from(buttons).find(btn => btn.textContent?.includes('State'));
          if (stateButton) {
            const rect = stateButton.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: 700, y: 250 };
        },
        duration: 1500 
      },
      
      // Click state view
      { 
        action: 'click' as const, 
        target: () => {
          const buttons = document.querySelectorAll('button');
          const stateButton = Array.from(buttons).find(btn => btn.textContent?.includes('State'));
          if (stateButton) {
            const rect = stateButton.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: 700, y: 250 };
        },
        duration: 1500,
        callback: () => {
          setTimeout(() => {
            const buttons = document.querySelectorAll('button');
            const stateButton = Array.from(buttons).find(btn => btn.textContent?.includes('State'));
            if (stateButton) {
              (stateButton as HTMLElement).click();
            }
          }, 100);
        }
      },
      
      // Wait to show state view
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 2000 },
      
      // Click back to district view
      { 
        action: 'click' as const, 
        target: () => {
          const buttons = document.querySelectorAll('button');
          const districtButton = Array.from(buttons).find(btn => btn.textContent?.includes('District'));
          if (districtButton) {
            const rect = districtButton.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: 600, y: 250 };
        },
        duration: 1500,
        callback: () => {
          setTimeout(() => {
            const buttons = document.querySelectorAll('button');
            const districtButton = Array.from(buttons).find(btn => btn.textContent?.includes('District'));
            if (districtButton) {
              (districtButton as HTMLElement).click();
            }
          }, 100);
        }
      },
      
      // Scroll down to see more charts
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 1000 },
      { 
        action: 'move' as const, 
        target: { x: window.innerWidth / 2, y: window.innerHeight - 100 },
        duration: 1500,
        callback: () => {
          window.scrollTo({ top: 600, behavior: 'smooth' });
        }
      },
      
      // Wait and scroll more
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 2000 },
      { 
        action: 'move' as const, 
        target: { x: window.innerWidth / 2, y: window.innerHeight - 50 },
        duration: 1000,
        callback: () => {
          // Scroll to bottom to show all distributional charts
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        }
      },
      
      // Wait to show distributional impact
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 3000 },
      
      // Scroll back up
      { 
        action: 'move' as const, 
        target: { x: window.innerWidth / 2, y: 100 },
        duration: 1000,
        callback: () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      
      // Click back to bills
      { 
        action: 'click' as const, 
        target: () => {
          const buttons = document.querySelectorAll('button');
          const backButton = Array.from(buttons).find(btn => btn.textContent?.includes('Back to Bills'));
          if (backButton) {
            const rect = backButton.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: 100, y: 200 };
        },
        duration: 2000,
        callback: () => {
          setTimeout(() => {
            const buttons = document.querySelectorAll('button');
            const backButton = Array.from(buttons).find(btn => btn.textContent?.includes('Back to Bills'));
            if (backButton) {
              (backButton as HTMLElement).click();
            }
          }, 100);
        }
      },
      
      // Wait before restarting
      { action: 'wait' as const, target: { x: 0, y: 0 }, duration: 2000 },
    ];

    await runDemoSequence(demoSteps);
    
    // Increment state counter and restart
    demoSequenceRef.current += 1;
    if (isDemoActiveRef.current) {
      setTimeout(() => runDemo(), 1000);
    }
  };

  useEffect(() => {
    isDemoActiveRef.current = isDemoMode;
    
    if (isDemoMode) {
      runDemo();
    } else {
      // When demo stops, reset scroll position and hide dropdown
      window.scrollTo({ top: 0, behavior: 'auto' });
      setDemoDropdown(prev => ({ ...prev, isVisible: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode]);

  return (
    <>
      <Layout selectedDistrict={selectedDistrict ? `${selectedDistrict.state} - ${selectedDistrict.name}` : null}>
      {currentPage === 'setup' && (
        <div style={styles.setupContainer}>
          <h1>Welcome to PolicyEngine State Legislative Dashboard</h1>
          <p style={styles.setupText}>
            Select your legislative district to view bill impacts and analysis
          </p>
          <DistrictSelector onSelect={handleSelectDistrict} />
        </div>
      )}

      {currentPage === 'bills' && selectedDistrict && (
        <div>
          <div style={styles.header}>
            <h1>Active Legislation</h1>
            <p style={styles.subtitle}>
              {selectedDistrict.state} - {selectedDistrict.name}
            </p>
          </div>

          <ActiveBills 
            districtId={selectedDistrict.id}
            selectedBill={null}
            onSelectBill={handleSelectBill}
          />
        </div>
      )}

      {currentPage === 'impact' && selectedBill && selectedDistrict && (
        <div>
          <div style={styles.header}>
            <button onClick={handleBackToBills} style={styles.backButton}>
              ← Back to Bills
            </button>
            <h1>{selectedBill.number}: {selectedBill.title}</h1>
            <p style={styles.subtitle}>
              Impact Analysis for {selectedDistrict.state} - {selectedDistrict.name}
            </p>
          </div>

          <ImpactToggle 
            view={impactView}
            onChange={setImpactView}
            districtName={selectedDistrict.name}
          />

          <div style={styles.analysisGrid}>
            <div style={styles.sidebarSection}>
              <PolicySummary districtId={selectedDistrict.id} selectedBill={selectedBill} />
            </div>

            <div style={styles.mainSection}>
              <BudgetaryImpact districtId={selectedDistrict.id} isStateView={impactView === 'state'} />
              <DistributionalImpact districtId={selectedDistrict.id} isStateView={impactView === 'state'} />
              <PovertyInequalityImpact isStateView={impactView === 'state'} districtId={selectedDistrict.id} />
            </div>
          </div>
        </div>
      )}
    </Layout>
      
      {/* Mock Data Watermark */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        fontSize: '6rem',
        color: 'rgba(0, 0, 0, 0.05)',
        fontWeight: 700,
        pointerEvents: 'none',
        zIndex: 1,
        userSelect: 'none',
        textAlign: 'center',
        lineHeight: 1,
      }}>
        MOCK DATA<br />ONLY
      </div>
      
      {/* Demo Mode Button */}
      <button
        onClick={() => setIsDemoMode(!isDemoMode)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '12px 24px',
          backgroundColor: isDemoMode ? colors.DARK_RED : colors.TEAL_ACCENT,
          color: colors.WHITE,
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 500,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 9999,
          transition: 'all 0.3s ease',
        }}
      >
        {isDemoMode ? 'Stop Demo' : 'Start Demo Mode'}
      </button>
      
      {/* Simulated Cursor */}
      {isDemoMode && (
        <>
          <SimulatedCursor 
            x={cursorPosition.x} 
            y={cursorPosition.y} 
            clicking={isClicking} 
          />
          <DemoDropdown 
            isVisible={demoDropdown.isVisible}
            options={demoDropdown.options}
            selectedIndex={demoDropdown.selectedIndex}
            position={demoDropdown.position}
          />
        </>
      )}
    </>
  );
}

const styles = {
  setupContainer: {
    maxWidth: '600px',
    margin: '4rem auto',
    textAlign: 'center' as const,
  },
  setupText: {
    fontSize: '1.25rem',
    color: colors.DARK_GRAY,
    marginBottom: '2rem',
  },
  header: {
    marginBottom: '2rem',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: colors.DARK_GRAY,
    marginTop: '-0.5rem',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: `1px solid ${colors.MEDIUM_DARK_GRAY}`,
    color: colors.DARK_GRAY,
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: colors.LIGHT_GRAY,
      borderColor: colors.DARK_GRAY,
    },
  },
  analysisGrid: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '2rem',
    marginTop: '2rem',
  },
  sidebarSection: {
    position: 'sticky' as const,
    top: '100px',
    height: 'fit-content',
  },
  mainSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
};

export default App;
