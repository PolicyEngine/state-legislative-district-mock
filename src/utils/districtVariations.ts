// Generate district-specific variations based on district characteristics
export function getDistrictMultipliers(districtId: string, totalDistricts: number) {
  // Use district ID to generate consistent but varied demographics
  const hash = districtId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Create variation factors based on district "characteristics"
  const urbanRural = (hash % 3); // 0 = urban, 1 = suburban, 2 = rural
  const wealthIndex = ((hash % 5) + 1) / 3; // 0.33 to 1.67
  const seniorIndex = ((hash % 4) + 2) / 3; // 0.67 to 1.67
  const familyIndex = ((hash % 4) + 1) / 2.5; // 0.4 to 1.6
  
  // Base district share (1 / number of districts)
  const baseDistrictShare = 1 / totalDistricts;
  
  // Add noise based on district characteristics (-20% to +20% variation)
  const noiseMultiplier = 0.8 + (wealthIndex * 0.4);
  
  return {
    // Budget impacts: district share with noise
    budgetMultiplier: baseDistrictShare * noiseMultiplier,
    
    // Poverty impacts stronger in lower-income districts
    povertyMultiplier: urbanRural === 2 ? 1.3 : urbanRural === 0 ? 0.8 : 1.0,
    
    // Senior benefits stronger in districts with more seniors
    seniorBenefitMultiplier: seniorIndex,
    
    // Child benefits stronger in family-heavy districts
    childBenefitMultiplier: familyIndex,
    
    // Income distribution varies by district type
    incomeDistribution: {
      lowIncomeShare: urbanRural === 2 ? 0.35 : urbanRural === 0 ? 0.25 : 0.30,
      highIncomeShare: urbanRural === 0 ? 0.30 : urbanRural === 2 ? 0.15 : 0.20,
    },
    
    // Demographic factors
    demographics: {
      urbanRural,
      wealthIndex,
      seniorIndex,
      familyIndex,
    },
    
    // Store the total districts for reference
    totalDistricts,
  };
}

// Get district type label
export function getDistrictType(urbanRural: number): string {
  switch(urbanRural) {
    case 0: return 'Urban';
    case 1: return 'Suburban';
    case 2: return 'Rural';
    default: return 'Mixed';
  }
}

// Adjust statewide values for district
export function adjustForDistrict(stateValue: number, multiplier: number, isPercentage: boolean = false): number {
  if (isPercentage) {
    // For percentages, adjust within reasonable bounds
    const adjusted = stateValue * multiplier;
    return Math.max(0, Math.min(100, adjusted));
  }
  return stateValue * multiplier;
}