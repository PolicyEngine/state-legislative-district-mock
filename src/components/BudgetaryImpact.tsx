import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { colors } from '../styles/colors';
import { getDistrictMultipliers, adjustForDistrict } from '../utils/districtVariations';
import { stateData } from '../data/stateDistricts';

interface BudgetaryImpactProps {
  districtId: string;
  isStateView?: boolean;
}

const BudgetaryImpact: React.FC<BudgetaryImpactProps> = ({ districtId, isStateView = false }) => {
  // Extract state and chamber info from districtId (format: "CA-Senate-1")
  const [stateAbbr, chamber] = districtId.split('-');
  
  // Get actual total districts from state data
  const state = stateData.find(s => s.abbreviation === stateAbbr);
  const totalDistricts = state 
    ? (chamber?.toLowerCase().includes('senate') 
        ? state.upperChamber.districts 
        : state.lowerChamber.districts)
    : 80;
  
  const multipliers = getDistrictMultipliers(districtId, totalDistricts);
  
  // Base statewide data
  const statewideMockData = {
    totalRevenue: -2450000000,
    yearlyProjection: [
      { year: 2025, revenue: -2450000000 },
      { year: 2026, revenue: -2600000000 },
      { year: 2027, revenue: -2750000000 },
      { year: 2028, revenue: -2900000000 },
      { year: 2029, revenue: -3050000000 },
    ],
  };
  
  // Adjust for district if not state view
  const mockData = isStateView ? statewideMockData : {
    totalRevenue: adjustForDistrict(statewideMockData.totalRevenue, multipliers.budgetMultiplier),
    yearlyProjection: statewideMockData.yearlyProjection.map(item => ({
      year: item.year,
      revenue: adjustForDistrict(item.revenue, multipliers.budgetMultiplier)
    }))
  };

  const lineData = mockData.yearlyProjection.map(d => ({
    year: d.year,
    revenue: Math.abs(d.revenue / 1000000000),
  }));

  return (
    <div className="pe-card">
      <h2>Budgetary Impact</h2>
      
      <div style={styles.summaryBox}>
        <h3 style={styles.impactAmount}>
          ${Math.abs(mockData.totalRevenue / 1000000000).toFixed(2)}B
        </h3>
        <p style={styles.impactLabel}>Total Revenue Loss</p>
      </div>

      <div style={styles.chartWrapper}>
        <h3 style={styles.chartTitle}>5-Year Revenue Projection</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis label={{ value: 'Revenue Loss ($ Billions)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: any) => `$${Number(value).toFixed(2)}B`} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke={colors.BLUE} 
              strokeWidth={3}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.note}>
        <p>
          <strong>Note:</strong> These figures represent the estimated income tax revenue impact 
          of the proposed tax policy changes for this legislative district.
          <em> (Mock data for demonstration purposes)</em>
        </p>
      </div>
    </div>
  );
};

const styles = {
  summaryBox: {
    backgroundColor: colors.BLUE_98,
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  impactAmount: {
    fontSize: '3rem',
    color: colors.DARK_RED,
    marginBottom: '0.5rem',
  },
  impactLabel: {
    fontSize: '1.25rem',
    color: colors.DARK_GRAY,
    margin: 0,
  },
  chartsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '2rem',
  },
  chartWrapper: {
    backgroundColor: colors.WHITE,
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  note: {
    padding: '1rem',
    backgroundColor: colors.TEAL_LIGHT,
    borderRadius: '8px',
    borderLeft: `4px solid ${colors.TEAL_ACCENT}`,
  },
  chartTitle: {
    fontSize: '1.125rem',
    marginBottom: '1rem',
    textAlign: 'center' as const,
  },
};

export default BudgetaryImpact;