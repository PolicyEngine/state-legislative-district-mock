import { findLegislator, formatLegislatorName, stateLegislators } from '../stateLegislators';

describe('State Legislators Data', () => {
  test('should have legislators loaded', () => {
    expect(stateLegislators).toBeDefined();
    expect(stateLegislators.length).toBeGreaterThan(0);
    console.log(`Total legislators: ${stateLegislators.length}`);
  });

  test('CA Senate District 8 should be Angelique Ashby', () => {
    const legislator = findLegislator('CA', 'Senate', '8');
    
    console.log('CA Senate District 8 lookup result:', legislator);
    
    expect(legislator).not.toBeNull();
    expect(legislator?.name).toBe('Angelique Ashby');
    expect(legislator?.state).toBe('ca');
    expect(legislator?.chamber).toBe('Senate');
    expect(legislator?.district).toBe('8');
    expect(legislator?.party).toBe('D');
  });

  test('case insensitive state lookup should work', () => {
    const upperCase = findLegislator('CA', 'Senate', '8');
    const lowerCase = findLegislator('ca', 'Senate', '8');
    
    expect(upperCase).toEqual(lowerCase);
    expect(upperCase?.name).toBe('Angelique Ashby');
  });

  test('chamber variations should work', () => {
    const senate = findLegislator('CA', 'Senate', '8');
    const senateLC = findLegislator('CA', 'senate', '8');
    
    expect(senate).toEqual(senateLC);
    expect(senate?.name).toBe('Angelique Ashby');
  });

  test('formatLegislatorName should format correctly', () => {
    const legislator = findLegislator('CA', 'Senate', '8');
    expect(legislator).not.toBeNull();
    
    if (legislator) {
      const formatted = formatLegislatorName(legislator);
      expect(formatted).toBe('Sen. Angelique Ashby');
    }
  });

  test('should find different legislators for different districts', () => {
    const caSD8 = findLegislator('CA', 'Senate', '8');
    const caSD24 = findLegislator('CA', 'Senate', '24');
    
    expect(caSD8).not.toBeNull();
    expect(caSD24).not.toBeNull();
    expect(caSD8?.name).not.toBe(caSD24?.name);
    
    console.log('CA SD 8:', caSD8?.name);
    console.log('CA SD 24:', caSD24?.name);
  });

  test('should not confuse Senate and House', () => {
    const caSenate8 = findLegislator('CA', 'Senate', '8');
    const caHouse8 = findLegislator('CA', 'House', '8');
    
    // These should be different people (if both exist)
    if (caSenate8 && caHouse8) {
      expect(caSenate8.name).not.toBe(caHouse8.name);
    }
    
    console.log('CA Senate 8:', caSenate8?.name);
    console.log('CA House 8:', caHouse8?.name);
  });

  test('should handle non-existent districts gracefully', () => {
    const nonExistent = findLegislator('CA', 'Senate', '999');
    expect(nonExistent).toBeNull();
  });

  test('should find Alex Lee in correct district', () => {
    // Search for Alex Lee to see where he actually is
    const alexLee = stateLegislators.find(leg => leg.name.includes('Alex Lee'));
    console.log('Alex Lee found in:', alexLee);
    
    if (alexLee) {
      const lookup = findLegislator(alexLee.state.toUpperCase(), alexLee.chamber, alexLee.district);
      expect(lookup).toEqual(alexLee);
    }
  });

  test('comprehensive CA data check', () => {
    const caLegislators = stateLegislators.filter(leg => leg.state === 'ca');
    console.log(`California has ${caLegislators.length} legislators`);
    
    const caSenate = caLegislators.filter(leg => leg.chamber === 'Senate');
    const caHouse = caLegislators.filter(leg => leg.chamber === 'House');
    
    console.log(`CA Senate: ${caSenate.length}, CA House: ${caHouse.length}`);
    
    // Find all district 8s
    const allDistrict8 = caLegislators.filter(leg => leg.district === '8');
    console.log('All CA District 8 legislators:', allDistrict8);
    
    expect(caSenate.length).toBeGreaterThan(0);
    expect(caHouse.length).toBeGreaterThan(0);
  });
});