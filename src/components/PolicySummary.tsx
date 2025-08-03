import React from 'react';
import { colors } from '../styles/colors';

interface PolicySummaryProps {
  districtId: string;
  selectedBill?: {
    title: string;
    summary: string;
    number: string;
    sponsor: string;
    status: string;
  } | null;
}

const PolicySummary: React.FC<PolicySummaryProps> = ({ districtId, selectedBill }) => {
  // Default policy details if no bill selected
  const defaultPolicy = {
    name: "No Bill Selected",
    description: "Select a bill from the active legislation list to view details",
    keyProvisions: [],
    effectiveDate: "TBD",
    sunsetDate: "TBD",
  };

  // Map selected bill to policy details
  const getPolicyDetails = () => {
    if (!selectedBill) return defaultPolicy;
    
    // Define key provisions based on bill title
    const provisionsMap: { [key: string]: string[] } = {
      "Working Families Tax Credit Act": [
        "Create refundable tax credit up to $1,200 for families earning under $75,000",
        "Phase out credit between $75,000 and $90,000 income",
        "Index credit amount to inflation annually",
        "Expand eligibility to include caregivers of elderly parents",
      ],
      "Small Business Tax Relief Act": [
        "Reduce state business tax from 6% to 4.5% for businesses under $5M revenue",
        "Accelerate depreciation for equipment purchases",
        "Create $50,000 startup deduction for new businesses",
        "Simplify quarterly filing requirements",
      ],
      "Senior Property Tax Circuit Breaker": [
        "Cap property taxes at 3% of income for seniors over 65",
        "Income eligibility limit of $60,000 for full benefit",
        "Partial benefit phase-out up to $80,000 income",
        "Automatic enrollment for qualifying seniors",
      ],
      "State Child Tax Credit Act": [
        "Establish $500 per child state tax credit",
        "Full credit for families earning up to $100,000",
        "Phase out between $100,000 and $150,000",
        "Make credit fully refundable",
      ],
      "First-Time Homebuyer Tax Credit": [
        "Provide $5,000 tax credit for first-time homebuyers",
        "Must be primary residence for 3 years",
        "Income limit of $100,000 for individuals, $150,000 for couples",
        "Cannot have owned home in past 3 years",
      ],
      "Education Expense Deduction Expansion": [
        "Increase K-12 education expense deduction from $1,000 to $2,500 per child",
        "Expand eligible expenses to include tutoring and educational software",
        "Remove income phase-out for deduction",
        "Allow carryforward of unused deduction amounts",
      ],
    };
    
    return {
      name: selectedBill.title,
      description: selectedBill.summary,
      keyProvisions: provisionsMap[selectedBill.title] || [
        "Detailed provisions pending legislative review",
        "Fiscal impact analysis in progress",
        "Public comment period open",
      ],
      effectiveDate: "January 1, 2025",
      sunsetDate: "December 31, 2030",
    };
  };

  const policyDetails = getPolicyDetails();

  return (
    <div className="pe-card">
      <h2>Policy Overview</h2>
      
      <div style={styles.header}>
        <h3 style={styles.policyName}>{policyDetails.name}</h3>
        <span style={styles.badge}>Active Proposal</span>
      </div>

      <p style={styles.description}>{policyDetails.description}</p>

      <div style={styles.provisionsContainer}>
        <h4>Key Provisions:</h4>
        <ul style={styles.provisionsList}>
          {policyDetails.keyProvisions.map((provision, index) => (
            <li key={index} style={styles.provisionItem}>
              <span style={styles.bulletPoint}>•</span>
              {provision}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.datesContainer}>
        <div style={styles.dateBox}>
          <label style={styles.dateLabel}>Effective Date</label>
          <p style={styles.dateValue}>{policyDetails.effectiveDate}</p>
        </div>
        <div style={styles.dateBox}>
          <label style={styles.dateLabel}>Sunset Date</label>
          <p style={styles.dateValue}>{policyDetails.sunsetDate}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  policyName: {
    color: colors.DARKEST_BLUE,
    marginBottom: 0,
  },
  badge: {
    backgroundColor: colors.TEAL_ACCENT,
    color: colors.WHITE,
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  description: {
    color: colors.DARK_GRAY,
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  provisionsContainer: {
    marginBottom: '1.5rem',
  },
  provisionsList: {
    listStyle: 'none',
    padding: 0,
    margin: '0.5rem 0',
  },
  provisionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
    lineHeight: 1.5,
  },
  bulletPoint: {
    color: colors.TEAL_ACCENT,
    marginRight: '0.75rem',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  datesContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    backgroundColor: colors.BLUE_98,
    padding: '1rem',
    borderRadius: '8px',
  },
  dateBox: {
    textAlign: 'center' as const,
  },
  dateLabel: {
    fontSize: '0.875rem',
    color: colors.GRAY,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '0.25rem',
  },
  dateValue: {
    fontSize: '1.125rem',
    color: colors.DARKEST_BLUE,
    fontWeight: 500,
    margin: 0,
  },
};

export default PolicySummary;