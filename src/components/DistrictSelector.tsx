import React, { useState, useMemo } from 'react';
import { colors } from '../styles/colors';
import { stateData, generateDistrictsForState } from '../data/stateDistricts';

interface District {
  id: string;
  name: string;
  state: string;
  chamber?: string;
  legislator?: string;
}

interface DistrictSelectorProps {
  onSelect: (district: District) => void;
}

const DistrictSelector: React.FC<DistrictSelectorProps> = ({ onSelect }) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedChamber, setSelectedChamber] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const states = stateData.map(s => s.name).sort();
  
  const currentStateData = useMemo(() => {
    return stateData.find(s => s.name === selectedState);
  }, [selectedState]);

  const chambers = useMemo(() => {
    if (!currentStateData) return [];
    const chamberList = [];
    if (currentStateData.upperChamber.districts > 0) {
      chamberList.push(currentStateData.upperChamber.name);
    }
    if (currentStateData.lowerChamber.districts > 0) {
      chamberList.push(currentStateData.lowerChamber.name);
    }
    return chamberList;
  }, [currentStateData]);

  const districts = useMemo(() => {
    if (!currentStateData || !selectedChamber) return [];
    const allDistricts = generateDistrictsForState(currentStateData);
    return allDistricts.filter(d => d.chamber === selectedChamber);
  }, [currentStateData, selectedChamber]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedChamber('');
    setSelectedDistrict(null);
  };

  const handleChamberSelect = (chamber: string) => {
    setSelectedChamber(chamber);
    setSelectedDistrict(null);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = districts.find(d => d.id === e.target.value);
    if (district) {
      setSelectedDistrict(district);
      onSelect(district);
    }
  };

  return (
    <div className="pe-card" style={styles.container}>
      <h3>Select Legislative District</h3>
      
      <div style={styles.selectorGroup}>
        <label htmlFor="state-select" style={styles.label}>State</label>
        <select 
          id="state-select"
          value={selectedState} 
          onChange={handleStateChange}
          style={styles.select}
        >
          <option value="">Select...</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {selectedState && (
        <div style={styles.selectorGroup}>
          <label style={styles.label}>Chamber</label>
          <div style={styles.chamberButtons}>
            {chambers.map(chamber => (
              <button
                key={chamber}
                onClick={() => handleChamberSelect(chamber)}
                style={{
                  ...styles.chamberButton,
                  ...(selectedChamber === chamber ? styles.chamberButtonActive : {}),
                }}
                data-chamber={chamber}
              >
                {chamber}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedChamber && (
        <div style={styles.selectorGroup}>
          <label htmlFor="district-select" style={styles.label}>District</label>
          <select 
            id="district-select"
            value={selectedDistrict?.id || ''} 
            onChange={handleDistrictChange}
            style={styles.select}
          >
            <option value="">Select...</option>
            {districts.map(district => (
              <option key={district.id} value={district.id}>
                {district.name} - {district.legislator}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedDistrict && (
        <div style={styles.selectedInfo}>
          <p><strong>Selected:</strong> {selectedDistrict.state} - {selectedDistrict.name}</p>
          <p><strong>Current Legislator:</strong> {selectedDistrict.legislator}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '2rem',
  },
  selectorGroup: {
    marginTop: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
    color: colors.DARK_GRAY,
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: `1px solid ${colors.MEDIUM_DARK_GRAY}`,
    fontSize: '1rem',
    backgroundColor: colors.WHITE,
    color: colors.DARKEST_BLUE,
    cursor: 'pointer',
  },
  selectedInfo: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: colors.TEAL_LIGHT,
    borderRadius: '8px',
    borderLeft: `4px solid ${colors.TEAL_ACCENT}`,
  },
  chamberButtons: {
    display: 'flex',
    gap: '1rem',
    width: '100%',
  },
  chamberButton: {
    flex: 1,
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: `1px solid ${colors.MEDIUM_DARK_GRAY}`,
    backgroundColor: colors.WHITE,
    color: colors.DARK_GRAY,
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  chamberButtonActive: {
    backgroundColor: colors.TEAL_ACCENT,
    color: colors.WHITE,
    borderColor: colors.TEAL_ACCENT,
  },
};

export default DistrictSelector;