import React from 'react';
import {
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Cell,
} from 'recharts';
import { colors } from '../styles/colors';
import { getDistrictMultipliers, adjustForDistrict } from '../utils/districtVariations';
import { stateData } from '../data/stateDistricts';

interface PovertyInequalityImpactProps {
  isStateView: boolean;
  districtId: string;
}

const PovertyInequalityImpact: React.FC<PovertyInequalityImpactProps> = ({ isStateView, districtId }) => {
  // Extract state and chamber info
  const [stateAbbr, chamber] = districtId.split('-');
  const state = stateData.find(s => s.abbreviation === stateAbbr);
  const totalDistricts = state 
    ? (chamber?.toLowerCase().includes('senate') 
        ? state.upperChamber.districts 
        : state.lowerChamber.districts)
    : 80;
    
  const multipliers = getDistrictMultipliers(districtId, totalDistricts);
  
  // Base statewide data
  const statePovertyData = {
    currentRate: 12.3,
    newRate: 11.1,
    reduction: 1.2,
    peopleLifted: 125000,
  };
  
  // Adjust for district
  const districtPovertyData = {
    currentRate: adjustForDistrict(statePovertyData.currentRate, multipliers.povertyMultiplier, true),
    newRate: adjustForDistrict(statePovertyData.newRate, multipliers.povertyMultiplier, true),
    reduction: adjustForDistrict(statePovertyData.reduction, multipliers.povertyMultiplier),
    peopleLifted: Math.round(adjustForDistrict(statePovertyData.peopleLifted / 40, multipliers.demographics.familyIndex)),
  };
  
  const povertyData = isStateView ? statePovertyData : districtPovertyData;

  const inequalityData = {
    giniCurrent: isStateView ? 0.482 : 0.465,
    giniNew: isStateView ? 0.468 : 0.448,
    top10ShareCurrent: isStateView ? 48.5 : adjustForDistrict(48.5, 
      multipliers.demographics.urbanRural === 0 ? 1.15 : 0.85, true),
    top10ShareNew: isStateView ? 47.2 : adjustForDistrict(47.2,
      multipliers.demographics.urbanRural === 0 ? 1.15 : 0.85, true),
    bottom50ShareCurrent: isStateView ? 12.8 : adjustForDistrict(12.8,
      multipliers.demographics.urbanRural === 2 ? 1.3 : 0.9, true),
    bottom50ShareNew: isStateView ? 13.4 : adjustForDistrict(13.4,
      multipliers.demographics.urbanRural === 2 ? 1.3 : 0.9, true),
  };

  const povertyByGroup = [
    { group: 'Children', current: 18.5, new: 16.2 },
    { group: 'Working Age', current: 11.2, new: 10.1 },
    { group: 'Seniors', current: 9.8, new: 8.9 },
    { group: 'Single Parents', current: 28.3, new: 24.7 },
    { group: 'Disabled', current: 22.1, new: 19.8 },
  ];

  const lorenzCurveData = [
    { population: 0, income: 0 },
    { population: 10, income: 2.5 },
    { population: 20, income: 5.8 },
    { population: 30, income: 9.7 },
    { population: 40, income: 14.2 },
    { population: 50, income: 19.8 },
    { population: 60, income: 26.5 },
    { population: 70, income: 34.8 },
    { population: 80, income: 45.2 },
    { population: 90, income: 59.5 },
    { population: 100, income: 100 },
  ];

  const lorenzCurveNew = [
    { population: 0, income: 0 },
    { population: 10, income: 2.8 },
    { population: 20, income: 6.2 },
    { population: 30, income: 10.3 },
    { population: 40, income: 15.1 },
    { population: 50, income: 20.8 },
    { population: 60, income: 27.7 },
    { population: 70, income: 36.1 },
    { population: 80, income: 46.5 },
    { population: 90, income: 60.8 },
    { population: 100, income: 100 },
  ];

  return (
    <div className="pe-card">
      <h2>Poverty & Inequality Impact</h2>

      <div style={styles.metricsContainer}>
        <div style={styles.metricCard}>
          <h3 style={styles.metricTitle}>Poverty Reduction</h3>
          <div style={styles.bigNumber}>
            <span style={styles.oldValue}>{povertyData.currentRate}%</span>
            <span style={styles.arrow}>→</span>
            <span style={styles.newValue}>{povertyData.newRate}%</span>
          </div>
          <p style={styles.metricChange}>
            -{povertyData.reduction} percentage points
          </p>
          <p style={styles.metricDetail}>
            {povertyData.peopleLifted.toLocaleString()} people lifted out of poverty
          </p>
        </div>

        <div style={styles.metricCard}>
          <h3 style={styles.metricTitle}>Gini Coefficient</h3>
          <div style={styles.bigNumber}>
            <span style={styles.oldValue}>{inequalityData.giniCurrent}</span>
            <span style={styles.arrow}>→</span>
            <span style={styles.newValue}>{inequalityData.giniNew}</span>
          </div>
          <p style={styles.metricChange}>
            {((inequalityData.giniCurrent - inequalityData.giniNew) / inequalityData.giniCurrent * 100).toFixed(1)}% reduction
          </p>
          <p style={styles.metricDetail}>
            More equal income distribution
          </p>
        </div>
      </div>

      <div style={styles.chartsContainer}>
        <div style={styles.chartWrapper}>
          <h3 style={styles.chartTitle}>Poverty Rate by Group</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={povertyByGroup}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" angle={-20} textAnchor="end" height={80} />
              <YAxis label={{ value: 'Poverty Rate (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="current" fill={colors.GRAY} name="Current" />
              <Bar dataKey="new" fill={colors.TEAL_ACCENT} name="After Policy" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartWrapper}>
          <h3 style={styles.chartTitle}>Income Share of Top 10%</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { category: 'Current', share: inequalityData.top10ShareCurrent },
              { category: 'After Policy', share: inequalityData.top10ShareNew }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis label={{ value: 'Share of Total Income (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: any) => `${Number(value).toFixed(1)}%`} />
              <Bar dataKey="share">
                <Cell fill={colors.GRAY} />
                <Cell fill={colors.TEAL_ACCENT} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p style={styles.chartNote}>
            Lower share indicates reduced income concentration
          </p>
        </div>
      </div>

      <div style={styles.shareContainer}>
        <h3 style={styles.chartTitle}>Income Share Changes</h3>
        <div style={styles.shareGrid}>
          <div style={styles.shareBox}>
            <h4 style={styles.shareLabel}>Top 10% Income Share</h4>
            <p style={styles.shareChange}>
              {inequalityData.top10ShareCurrent}% → {inequalityData.top10ShareNew}%
            </p>
          </div>
          <div style={styles.shareBox}>
            <h4 style={styles.shareLabel}>Bottom 50% Income Share</h4>
            <p style={styles.shareChange}>
              {inequalityData.bottom50ShareCurrent}% → {inequalityData.bottom50ShareNew}%
            </p>
          </div>
        </div>
      </div>

      <div style={styles.note}>
        <p>
          <strong>Key Finding:</strong> The policy significantly reduces poverty, 
          particularly among vulnerable groups like children and single parents, 
          while also reducing income inequality.
          <em> (Mock data for demonstration purposes)</em>
        </p>
      </div>
    </div>
  );
};

const styles = {
  metricsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '3rem',
  },
  metricCard: {
    backgroundColor: colors.BLUE_98,
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center' as const,
  },
  metricTitle: {
    fontSize: '1.125rem',
    color: colors.DARKEST_BLUE,
    marginBottom: '1rem',
  },
  bigNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  oldValue: {
    fontSize: '2rem',
    color: colors.GRAY,
    textDecoration: 'line-through',
  },
  arrow: {
    fontSize: '1.5rem',
    color: colors.GRAY,
  },
  newValue: {
    fontSize: '2.5rem',
    color: colors.TEAL_ACCENT,
    fontWeight: 600,
  },
  metricChange: {
    fontSize: '1rem',
    color: colors.TEAL_PRESSED,
    marginBottom: '0.5rem',
    fontWeight: 500,
  },
  metricDetail: {
    fontSize: '0.875rem',
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
  chartTitle: {
    fontSize: '1.125rem',
    marginBottom: '1rem',
    textAlign: 'center' as const,
    color: colors.DARKEST_BLUE,
  },
  chartNote: {
    fontSize: '0.75rem',
    color: colors.GRAY,
    textAlign: 'center' as const,
    marginTop: '0.5rem',
    fontStyle: 'italic' as const,
  },
  shareContainer: {
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  shareGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  shareBox: {
    backgroundColor: colors.LIGHT_GRAY,
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  shareLabel: {
    fontSize: '0.875rem',
    color: colors.DARK_GRAY,
    marginBottom: '0.5rem',
    fontWeight: 500,
  },
  shareChange: {
    fontSize: '1.25rem',
    color: colors.DARKEST_BLUE,
    margin: 0,
    fontWeight: 600,
  },
  note: {
    padding: '1rem',
    backgroundColor: colors.TEAL_LIGHT,
    borderRadius: '8px',
    borderLeft: `4px solid ${colors.TEAL_ACCENT}`,
  },
};

export default PovertyInequalityImpact;