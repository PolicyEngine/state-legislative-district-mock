import React from 'react';
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { colors } from '../styles/colors';
import { getDistrictMultipliers, adjustForDistrict } from '../utils/districtVariations';
import { stateData } from '../data/stateDistricts';

interface DistributionalImpactProps {
  districtId: string;
  isStateView?: boolean;
}

const DistributionalImpact: React.FC<DistributionalImpactProps> = ({ districtId, isStateView = false }) => {
  // Get district multipliers
  const [stateAbbr, chamber] = districtId.split('-');
  const state = stateData.find(s => s.abbreviation === stateAbbr);
  const totalDistricts = state 
    ? (chamber?.toLowerCase().includes('senate') 
        ? state.upperChamber.districts 
        : state.lowerChamber.districts)
    : 80;
    
  const multipliers = getDistrictMultipliers(districtId, totalDistricts);
  
  // Base state data
  const stateDecileData = {
    deciles: ['Bottom 10%', '10-20%', '20-30%', '30-40%', '40-50%', 
              '50-60%', '60-70%', '70-80%', '80-90%', 'Top 10%'],
    relativeChange: [0.5, 0.8, 1.2, 1.5, 1.8, 2.1, 2.5, 3.0, 3.8, 5.2],
    absoluteChange: [150, 320, 580, 820, 1100, 1450, 1900, 2600, 3800, 7500],
  };

  const stateIncomeGroupData = {
    groups: ['< $25k', '$25k-50k', '$50k-75k', '$75k-100k', '$100k-200k', '> $200k'],
    avgBenefit: [250, 650, 1200, 1800, 3200, 8500],
    householdsAffected: [45000, 82000, 95000, 78000, 125000, 35000],
  };
  
  // Adjust for district view
  const decileData = isStateView ? stateDecileData : {
    ...stateDecileData,
    absoluteChange: stateDecileData.absoluteChange.map(val => 
      Math.round(adjustForDistrict(val, multipliers.budgetMultiplier))
    ),
  };
  
  const incomeGroupData = isStateView ? stateIncomeGroupData : {
    ...stateIncomeGroupData,
    householdsAffected: stateIncomeGroupData.householdsAffected.map(val => 
      Math.round(adjustForDistrict(val, multipliers.budgetMultiplier))
    ),
  };

  const raceData = [
    { race: 'White', avgBenefit: 2100, population: 280000, percentBenefiting: 82 },
    { race: 'Black', avgBenefit: 950, population: 85000, percentBenefiting: 71 },
    { race: 'Hispanic', avgBenefit: 1200, population: 120000, percentBenefiting: 75 },
    { race: 'Asian', avgBenefit: 2800, population: 65000, percentBenefiting: 85 },
    { race: 'Other', avgBenefit: 1400, population: 30000, percentBenefiting: 78 },
  ];

  const educationData = [
    { education: 'Less than HS', avgBenefit: 450, population: 45000, percentBenefiting: 65 },
    { education: 'High School', avgBenefit: 980, population: 125000, percentBenefiting: 73 },
    { education: 'Some College', avgBenefit: 1450, population: 145000, percentBenefiting: 78 },
    { education: "Bachelor's", avgBenefit: 2800, population: 165000, percentBenefiting: 84 },
    { education: 'Graduate', avgBenefit: 4200, population: 100000, percentBenefiting: 88 },
  ];

  const relativeBarData = decileData.deciles.map((decile, i) => ({
    decile,
    change: decileData.relativeChange[i],
  }));

  const scatterData = incomeGroupData.groups.map((group, i) => ({
    group,
    avgBenefit: incomeGroupData.avgBenefit[i],
    households: incomeGroupData.householdsAffected[i],
    size: incomeGroupData.householdsAffected[i] / 2000,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div style={styles.tooltip}>
          <p>{`${(data.households / 1000).toFixed(0)}k households`}</p>
          <p>{`Avg: $${data.avgBenefit.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const totalHouseholds = incomeGroupData.householdsAffected.reduce((a, b) => a + b, 0);
  const avgBenefit = incomeGroupData.avgBenefit.reduce((sum, benefit, i) => 
    sum + benefit * incomeGroupData.householdsAffected[i], 0) / totalHouseholds;

  return (
    <div className="pe-card">
      <h2>Distributional Impact</h2>
      
      <div style={styles.metricsContainer}>
        <div style={styles.metricBox}>
          <h3 style={styles.metricValue}>{(totalHouseholds / 1000).toFixed(0)}k</h3>
          <p style={styles.metricLabel}>Households Affected</p>
        </div>
        <div style={styles.metricBox}>
          <h3 style={styles.metricValue}>${Math.abs(avgBenefit).toFixed(0)}</h3>
          <p style={styles.metricLabel}>Average Tax Cut</p>
        </div>
        <div style={styles.metricBox}>
          <h3 style={styles.metricValue}>78%</h3>
          <p style={styles.metricLabel}>Population Benefiting</p>
        </div>
      </div>

      <div style={styles.chartsContainer}>
        <div style={styles.chartWrapper}>
          <h3 style={styles.chartTitle}>Impact by Income Decile</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={relativeBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="decile" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'Change in After-Tax Income (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: any) => `${Number(value).toFixed(1)}%`} />
              <Bar dataKey="change">
                {relativeBarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors.BLUE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartWrapper}>
          <h3 style={styles.chartTitle}>Average Benefit by Income Group</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis label={{ value: 'Average Tax Cut ($)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter dataKey="avgBenefit" fill={colors.TEAL_ACCENT}>
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <p style={styles.chartNote}>Bubble size represents number of households</p>
        </div>
      </div>

      <div style={styles.demographicsSection}>
        <h3 style={styles.sectionTitle}>Impact by Demographics</h3>
        
        <div style={styles.chartsContainer}>
          <div style={styles.chartWrapper}>
            <h4 style={styles.chartTitle}>By Race/Ethnicity</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={raceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="race" />
                <YAxis />
                <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="avgBenefit" fill={colors.BLUE} name="Avg. Benefit" />
              </BarChart>
            </ResponsiveContainer>
            <p style={styles.chartNote}>Average tax cut by race/ethnicity</p>
          </div>

          <div style={styles.chartWrapper}>
            <h4 style={styles.chartTitle}>By Education Level</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={educationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="education" angle={-20} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="avgBenefit" fill={colors.TEAL_ACCENT} />
              </BarChart>
            </ResponsiveContainer>
            <p style={styles.chartNote}>Average tax cut by education level</p>
          </div>
        </div>

        <div style={styles.chartsContainer}>
          <div style={styles.chartWrapper}>
            <h4 style={styles.chartTitle}>Percent Benefiting by Race</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={raceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="race" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${Number(value).toFixed(1)}%`} />
                <Bar dataKey="percentBenefiting" fill={colors.BLUE_LIGHT} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartWrapper}>
            <h4 style={styles.chartTitle}>Percent Benefiting by Education</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={educationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="education" angle={-20} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value: any) => `${Number(value).toFixed(1)}%`} />
                <Bar dataKey="percentBenefiting" fill={colors.BLUE_LIGHT} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={styles.note}>
        <p>
          <strong>Key Finding:</strong> The tax policy provides larger absolute benefits 
          to higher-income households, but represents a larger percentage of income 
          for lower-income households.
          <em> (Mock data for demonstration purposes)</em>
        </p>
      </div>
    </div>
  );
};

const styles = {
  metricsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
  },
  metricBox: {
    backgroundColor: colors.BLUE_98,
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center' as const,
  },
  metricValue: {
    fontSize: '2rem',
    color: colors.BLUE,
    marginBottom: '0.25rem',
  },
  metricLabel: {
    fontSize: '0.875rem',
    color: colors.DARK_GRAY,
    margin: 0,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  chartsContainer: {
    marginBottom: '2rem',
  },
  note: {
    padding: '1rem',
    backgroundColor: colors.TEAL_LIGHT,
    borderRadius: '8px',
    borderLeft: `4px solid ${colors.TEAL_ACCENT}`,
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
  },
  chartNote: {
    fontSize: '0.875rem',
    color: colors.GRAY,
    textAlign: 'center' as const,
    marginTop: '0.5rem',
  },
  tooltip: {
    backgroundColor: colors.WHITE,
    border: `1px solid ${colors.MEDIUM_DARK_GRAY}`,
    borderRadius: '4px',
    padding: '0.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  demographicsSection: {
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: `2px solid ${colors.LIGHT_GRAY}`,
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
    color: colors.DARKEST_BLUE,
  },
};

export default DistributionalImpact;