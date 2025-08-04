// District mappings for states with non-numeric districts
import { stateLegislators } from './stateLegislators';

// Get all actual districts for a state/chamber combination
export function getActualDistricts(stateAbbr: string, chamber: string): string[] {
  const normalizedChamber = chamber.toLowerCase().includes('senate') || chamber.toLowerCase() === 'upper' 
    ? 'Senate' 
    : 'House';
    
  const districts = stateLegislators
    .filter(leg => 
      leg.state === stateAbbr.toLowerCase() && 
      leg.chamber === normalizedChamber
    )
    .map(leg => leg.district)
    .filter((value, index, self) => self.indexOf(value) === index) // unique
    .sort((a, b) => {
      // Try to sort numerically if possible
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      // Otherwise sort alphabetically
      return a.localeCompare(b);
    });
    
  return districts;
}

// For states with special chamber names
export function normalizedChamberName(state: string, chamber: string): string {
  // Handle special cases
  if (state === 'CA' && chamber.toLowerCase().includes('lower')) {
    return 'Assembly';
  }
  if (state === 'NV' && chamber.toLowerCase().includes('lower')) {
    return 'Assembly';
  }
  if (state === 'NJ' && chamber.toLowerCase().includes('lower')) {
    return 'Assembly';
  }
  if (state === 'NY' && chamber.toLowerCase().includes('lower')) {
    return 'Assembly';
  }
  if (state === 'WI' && chamber.toLowerCase().includes('lower')) {
    return 'Assembly';
  }
  
  // Nebraska unicameral
  if (state === 'NE') {
    return 'Legislature';
  }
  
  // Standard names
  if (chamber.toLowerCase().includes('senate') || chamber.toLowerCase() === 'upper') {
    return 'Senate';
  }
  
  return 'House';
}