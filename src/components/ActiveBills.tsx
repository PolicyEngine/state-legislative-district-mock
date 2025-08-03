import React from 'react';
import { colors } from '../styles/colors';

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

interface ActiveBillsProps {
  districtId: string;
  selectedBill: Bill | null;
  onSelectBill: (bill: Bill) => void;
}

// Base bills that can appear in any state
const baseBills: Omit<Bill, 'id'>[] = [
  {
    number: 'SB 123',
    title: 'Working Families Tax Credit Act',
    sponsor: 'Sen. Leslie Knope',
    status: 'floor',
    lastAction: 'Passed Finance Committee 7-3',
    summary: 'Creates refundable state tax credit of up to $1,200 for working families earning under $75,000',
    fiscalImpact: -850000000,
  },
  {
    number: 'HB 456',
    title: 'Small Business Tax Relief Act',
    sponsor: 'Rep. Ron Swanson',
    status: 'committee',
    lastAction: 'Referred to Ways & Means',
    summary: 'Reduces state business tax rate from 6% to 4.5% for businesses with under $5M revenue',
    fiscalImpact: -320000000,
  },
  {
    number: 'SB 789',
    title: 'Senior Property Tax Circuit Breaker',
    sponsor: 'Sen. Selina Meyer',
    status: 'passed',
    lastAction: 'Passed House 78-42',
    summary: 'Caps property taxes at 3% of income for residents over 65 earning under $60,000',
    fiscalImpact: -280000000,
  },
  {
    number: 'HB 234',
    title: 'State Child Tax Credit Act',
    sponsor: 'Rep. Jed Bartlet',
    status: 'signed',
    lastAction: 'Signed by Governor',
    summary: 'Establishes $500 per child state tax credit for families earning under $150,000',
    fiscalImpact: -620000000,
  },
  {
    number: 'SB 567',
    title: 'First-Time Homebuyer Tax Credit',
    sponsor: 'Sen. Amy Santiago',
    status: 'committee',
    lastAction: 'Hearing scheduled for next week',
    summary: 'Provides $5,000 tax credit for first-time homebuyers, phasing out at $100,000 income',
    fiscalImpact: -180000000,
  },
  {
    number: 'HB 890',
    title: 'Education Expense Deduction Expansion',
    sponsor: 'Rep. Ben Wyatt',
    status: 'floor',
    lastAction: 'Amended in committee',
    summary: 'Increases K-12 education expense deduction from $1,000 to $2,500 per child',
    fiscalImpact: -95000000,
  },
];

// Generate bills based on state - some variation but not completely different
function generateBillsForState(stateAbbr: string): Bill[] {
  // Use state abbreviation to seed which bills appear
  const stateHash = stateAbbr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const numBills = 3 + (stateHash % 3); // 3-5 bills per state
  
  const selectedBills: Bill[] = [];
  const availableBills = [...baseBills];
  
  // Always include the Tax Reform Act as the first bill
  selectedBills.push({
    id: `${stateAbbr}-sb-123`,
    ...availableBills[0],
    number: `${stateAbbr} SB 123`,
  });
  
  // Randomly select other bills based on state hash
  for (let i = 1; i < numBills && i < availableBills.length; i++) {
    const billIndex = (stateHash + i) % availableBills.length;
    const bill = availableBills[billIndex];
    selectedBills.push({
      id: `${stateAbbr}-${bill.number.toLowerCase().replace(' ', '-')}`,
      ...bill,
      number: `${stateAbbr} ${bill.number}`,
    });
  }
  
  return selectedBills;
}

const ActiveBills: React.FC<ActiveBillsProps> = ({ districtId, selectedBill, onSelectBill }) => {
  // Extract state abbreviation from districtId (format: "CA-Senate-1")
  const stateAbbr = districtId.split('-')[0];
  const bills = generateBillsForState(stateAbbr);
  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'committee': return colors.GRAY;
      case 'floor': return colors.BLUE;
      case 'passed': return colors.TEAL_ACCENT;
      case 'signed': return colors.TEAL_PRESSED;
      default: return colors.GRAY;
    }
  };

  const getStatusLabel = (status: Bill['status']) => {
    switch (status) {
      case 'committee': return 'In Committee';
      case 'floor': return 'On Floor';
      case 'passed': return 'Passed';
      case 'signed': return 'Signed';
      default: return status;
    }
  };

  return (
    <div className="pe-card" style={styles.container}>
      <h2>Active Tax & Benefit Legislation</h2>
      <p style={styles.subtitle}>Bills affecting your district's constituents</p>
      
      <div style={styles.billsList}>
        {bills.map(bill => (
          <div 
            key={bill.id} 
            className="bill-card"
            data-bill-id={bill.id}
            style={{
              ...styles.billCard,
              ...(selectedBill?.id === bill.id ? styles.billCardSelected : {}),
            }}
            onClick={() => onSelectBill(bill)}
          >
            <div style={styles.billHeader}>
              <div>
                <h3 style={styles.billNumber}>{bill.number}</h3>
                <h4 style={styles.billTitle}>{bill.title}</h4>
              </div>
              <div style={{...styles.statusBadge, backgroundColor: getStatusColor(bill.status)}}>
                {getStatusLabel(bill.status)}
              </div>
            </div>
            
            <p style={styles.billSponsor}>Sponsor: {bill.sponsor}</p>
            <p style={styles.billSummary}>{bill.summary}</p>
            
            <div style={styles.billFooter}>
              <div style={styles.lastAction}>
                <span style={styles.label}>Last Action:</span> {bill.lastAction}
              </div>
              <div style={styles.fiscalImpact}>
                <span style={styles.label}>Fiscal Impact:</span>
                <span style={bill.fiscalImpact < 0 ? styles.negativeImpact : styles.positiveImpact}>
                  ${Math.abs(bill.fiscalImpact / 1000000).toFixed(0)}M
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '2rem',
  },
  subtitle: {
    color: colors.DARK_GRAY,
    marginTop: '-0.5rem',
    marginBottom: '1.5rem',
  },
  billsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  billCard: {
    backgroundColor: colors.BLUE_98,
    padding: '1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `1px solid transparent`,
    '&:hover': {
      borderColor: colors.BLUE,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
  },
  billCardSelected: {
    borderColor: colors.TEAL_ACCENT,
    backgroundColor: colors.TEAL_LIGHT,
    boxShadow: '0 2px 12px rgba(57,198,192,0.3)',
  },
  billHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
  },
  billNumber: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: colors.DARKEST_BLUE,
    margin: 0,
  },
  billTitle: {
    fontSize: '1rem',
    fontWeight: 500,
    color: colors.DARKEST_BLUE,
    margin: '0.25rem 0 0 0',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    color: colors.WHITE,
    fontSize: '0.875rem',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
  },
  billSponsor: {
    fontSize: '0.875rem',
    color: colors.DARK_GRAY,
    margin: '0.5rem 0',
  },
  billSummary: {
    fontSize: '0.875rem',
    color: colors.DARK_GRAY,
    lineHeight: 1.5,
    marginBottom: '1rem',
  },
  billFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: `1px solid ${colors.LIGHT_GRAY}`,
  },
  lastAction: {
    fontSize: '0.875rem',
    color: colors.GRAY,
  },
  fiscalImpact: {
    fontSize: '0.875rem',
    textAlign: 'right' as const,
  },
  label: {
    color: colors.GRAY,
    marginRight: '0.5rem',
  },
  negativeImpact: {
    color: colors.DARK_RED,
    fontWeight: 600,
  },
  positiveImpact: {
    color: colors.TEAL_PRESSED,
    fontWeight: 600,
  },
};

export default ActiveBills;