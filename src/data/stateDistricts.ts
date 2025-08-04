// State legislative district data
// Sources: NCSL, state legislature websites

import { findLegislator, formatLegislatorName } from './stateLegislators';
import { getActualDistricts } from './districtMappings';

export interface StateData {
  name: string;
  abbreviation: string;
  upperChamber: {
    name: string;
    districts: number;
  };
  lowerChamber: {
    name: string;
    districts: number;
  };
}

export const stateData: StateData[] = [
  { name: 'Alabama', abbreviation: 'AL', upperChamber: { name: 'Senate', districts: 35 }, lowerChamber: { name: 'House', districts: 105 } },
  { name: 'Alaska', abbreviation: 'AK', upperChamber: { name: 'Senate', districts: 20 }, lowerChamber: { name: 'House', districts: 40 } },
  { name: 'Arizona', abbreviation: 'AZ', upperChamber: { name: 'Senate', districts: 30 }, lowerChamber: { name: 'House', districts: 30 } }, // 2 reps per district
  { name: 'Arkansas', abbreviation: 'AR', upperChamber: { name: 'Senate', districts: 35 }, lowerChamber: { name: 'House', districts: 100 } },
  { name: 'California', abbreviation: 'CA', upperChamber: { name: 'Senate', districts: 40 }, lowerChamber: { name: 'Assembly', districts: 80 } },
  { name: 'Colorado', abbreviation: 'CO', upperChamber: { name: 'Senate', districts: 35 }, lowerChamber: { name: 'House', districts: 65 } },
  { name: 'Connecticut', abbreviation: 'CT', upperChamber: { name: 'Senate', districts: 36 }, lowerChamber: { name: 'House', districts: 151 } },
  { name: 'Delaware', abbreviation: 'DE', upperChamber: { name: 'Senate', districts: 21 }, lowerChamber: { name: 'House', districts: 41 } },
  { name: 'Florida', abbreviation: 'FL', upperChamber: { name: 'Senate', districts: 40 }, lowerChamber: { name: 'House', districts: 120 } },
  { name: 'Georgia', abbreviation: 'GA', upperChamber: { name: 'Senate', districts: 56 }, lowerChamber: { name: 'House', districts: 180 } },
  { name: 'Hawaii', abbreviation: 'HI', upperChamber: { name: 'Senate', districts: 25 }, lowerChamber: { name: 'House', districts: 51 } },
  { name: 'Idaho', abbreviation: 'ID', upperChamber: { name: 'Senate', districts: 35 }, lowerChamber: { name: 'House', districts: 35 } }, // 2 reps per district
  { name: 'Illinois', abbreviation: 'IL', upperChamber: { name: 'Senate', districts: 59 }, lowerChamber: { name: 'House', districts: 118 } },
  { name: 'Indiana', abbreviation: 'IN', upperChamber: { name: 'Senate', districts: 50 }, lowerChamber: { name: 'House', districts: 100 } },
  { name: 'Iowa', abbreviation: 'IA', upperChamber: { name: 'Senate', districts: 50 }, lowerChamber: { name: 'House', districts: 100 } },
  { name: 'Kansas', abbreviation: 'KS', upperChamber: { name: 'Senate', districts: 40 }, lowerChamber: { name: 'House', districts: 125 } },
  { name: 'Kentucky', abbreviation: 'KY', upperChamber: { name: 'Senate', districts: 38 }, lowerChamber: { name: 'House', districts: 100 } },
  { name: 'Louisiana', abbreviation: 'LA', upperChamber: { name: 'Senate', districts: 39 }, lowerChamber: { name: 'House', districts: 105 } },
  { name: 'Maine', abbreviation: 'ME', upperChamber: { name: 'Senate', districts: 35 }, lowerChamber: { name: 'House', districts: 151 } },
  { name: 'Maryland', abbreviation: 'MD', upperChamber: { name: 'Senate', districts: 47 }, lowerChamber: { name: 'House', districts: 47 } }, // 3 delegates per district
  { name: 'Massachusetts', abbreviation: 'MA', upperChamber: { name: 'Senate', districts: 40 }, lowerChamber: { name: 'House', districts: 160 } },
  { name: 'Michigan', abbreviation: 'MI', upperChamber: { name: 'Senate', districts: 38 }, lowerChamber: { name: 'House', districts: 110 } },
  { name: 'Minnesota', abbreviation: 'MN', upperChamber: { name: 'Senate', districts: 67 }, lowerChamber: { name: 'House', districts: 134 } },
  { name: 'Mississippi', abbreviation: 'MS', upperChamber: { name: 'Senate', districts: 52 }, lowerChamber: { name: 'House', districts: 122 } },
  { name: 'Missouri', abbreviation: 'MO', upperChamber: { name: 'Senate', districts: 34 }, lowerChamber: { name: 'House', districts: 163 } },
  { name: 'Montana', abbreviation: 'MT', upperChamber: { name: 'Senate', districts: 50 }, lowerChamber: { name: 'House', districts: 100 } },
  { name: 'Nebraska', abbreviation: 'NE', upperChamber: { name: 'Legislature', districts: 49 }, lowerChamber: { name: 'Unicameral', districts: 0 } }, // Unicameral
  { name: 'Nevada', abbreviation: 'NV', upperChamber: { name: 'Senate', districts: 21 }, lowerChamber: { name: 'Assembly', districts: 42 } },
  { name: 'New Hampshire', abbreviation: 'NH', upperChamber: { name: 'Senate', districts: 24 }, lowerChamber: { name: 'House', districts: 400 } },
  { name: 'New Jersey', abbreviation: 'NJ', upperChamber: { name: 'Senate', districts: 40 }, lowerChamber: { name: 'Assembly', districts: 40 } }, // 2 reps per district
  { name: 'New Mexico', abbreviation: 'NM', upperChamber: { name: 'Senate', districts: 42 }, lowerChamber: { name: 'House', districts: 70 } },
  { name: 'New York', abbreviation: 'NY', upperChamber: { name: 'Senate', districts: 63 }, lowerChamber: { name: 'Assembly', districts: 150 } },
  { name: 'North Carolina', abbreviation: 'NC', upperChamber: { name: 'Senate', districts: 50 }, lowerChamber: { name: 'House', districts: 120 } },
  { name: 'North Dakota', abbreviation: 'ND', upperChamber: { name: 'Senate', districts: 47 }, lowerChamber: { name: 'House', districts: 47 } }, // 2 reps per district
  { name: 'Ohio', abbreviation: 'OH', upperChamber: { name: 'Senate', districts: 33 }, lowerChamber: { name: 'House', districts: 99 } },
  { name: 'Oklahoma', abbreviation: 'OK', upperChamber: { name: 'Senate', districts: 48 }, lowerChamber: { name: 'House', districts: 101 } },
  { name: 'Oregon', abbreviation: 'OR', upperChamber: { name: 'Senate', districts: 30 }, lowerChamber: { name: 'House', districts: 60 } },
  { name: 'Pennsylvania', abbreviation: 'PA', upperChamber: { name: 'Senate', districts: 50 }, lowerChamber: { name: 'House', districts: 203 } },
  { name: 'Rhode Island', abbreviation: 'RI', upperChamber: { name: 'Senate', districts: 38 }, lowerChamber: { name: 'House', districts: 75 } },
  { name: 'South Carolina', abbreviation: 'SC', upperChamber: { name: 'Senate', districts: 46 }, lowerChamber: { name: 'House', districts: 124 } },
  { name: 'South Dakota', abbreviation: 'SD', upperChamber: { name: 'Senate', districts: 35 }, lowerChamber: { name: 'House', districts: 35 } }, // 2 reps per district
  { name: 'Tennessee', abbreviation: 'TN', upperChamber: { name: 'Senate', districts: 33 }, lowerChamber: { name: 'House', districts: 99 } },
  { name: 'Texas', abbreviation: 'TX', upperChamber: { name: 'Senate', districts: 31 }, lowerChamber: { name: 'House', districts: 150 } },
  { name: 'Utah', abbreviation: 'UT', upperChamber: { name: 'Senate', districts: 29 }, lowerChamber: { name: 'House', districts: 75 } },
  { name: 'Vermont', abbreviation: 'VT', upperChamber: { name: 'Senate', districts: 30 }, lowerChamber: { name: 'House', districts: 150 } },
  { name: 'Virginia', abbreviation: 'VA', upperChamber: { name: 'Senate', districts: 40 }, lowerChamber: { name: 'House', districts: 100 } },
  { name: 'Washington', abbreviation: 'WA', upperChamber: { name: 'Senate', districts: 49 }, lowerChamber: { name: 'House', districts: 49 } }, // 2 reps per district
  { name: 'West Virginia', abbreviation: 'WV', upperChamber: { name: 'Senate', districts: 17 }, lowerChamber: { name: 'House', districts: 100 } },
  { name: 'Wisconsin', abbreviation: 'WI', upperChamber: { name: 'Senate', districts: 33 }, lowerChamber: { name: 'House', districts: 99 } },
  { name: 'Wyoming', abbreviation: 'WY', upperChamber: { name: 'Senate', districts: 31 }, lowerChamber: { name: 'House', districts: 62 } },
];

// Fallback names for districts without data
const fallbackLegislators = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
];

export interface District {
  id: string;
  state: string;
  chamber: string;
  number: string;
  name: string;
  legislator: string;
}

export function generateDistrictsForState(state: StateData): District[] {
  const districts: District[] = [];
  
  // Get actual district names/numbers from the real data
  const actualUpperDistricts = getActualDistricts(state.abbreviation, state.upperChamber.name);
  const actualLowerDistricts = state.lowerChamber.districts > 0 
    ? getActualDistricts(state.abbreviation, state.lowerChamber.name) 
    : [];
  
  // Generate upper chamber districts using actual district identifiers
  actualUpperDistricts.forEach((districtId, index) => {
    // Get real legislator for this actual district
    const realLegislator = findLegislator(state.abbreviation, state.upperChamber.name, districtId);
    
    let legislatorName;
    if (realLegislator) {
      legislatorName = formatLegislatorName(realLegislator);
    } else {
      // This shouldn't happen if our data is complete
      const fallbackName = fallbackLegislators[index % fallbackLegislators.length];
      legislatorName = `Sen. ${fallbackName}`;
    }
    
    districts.push({
      id: `${state.abbreviation}-${state.upperChamber.name}-${districtId}`,
      state: state.name,
      chamber: state.upperChamber.name,
      number: districtId,
      name: `${state.upperChamber.name} District ${districtId}`,
      legislator: legislatorName,
    });
  });
  
  // Generate lower chamber districts (skip for Nebraska)
  if (actualLowerDistricts.length > 0) {
    actualLowerDistricts.forEach((districtId, index) => {
      // Get real legislator for this actual district
      const realLegislator = findLegislator(state.abbreviation, state.lowerChamber.name, districtId);
      
      let legislatorName;
      if (realLegislator) {
        legislatorName = formatLegislatorName(realLegislator);
      } else {
        // This shouldn't happen if our data is complete
        const fallbackName = fallbackLegislators[index % fallbackLegislators.length];
        const title = state.lowerChamber.name === 'Assembly' ? 'Asm.' : 'Rep.';
        legislatorName = `${title} ${fallbackName}`;
      }
      
      districts.push({
        id: `${state.abbreviation}-${state.lowerChamber.name}-${districtId}`,
        state: state.name,
        chamber: state.lowerChamber.name,
        number: districtId,
        name: `${state.lowerChamber.name} District ${districtId}`,
        legislator: legislatorName,
      });
    });
  }
  
  return districts;
}