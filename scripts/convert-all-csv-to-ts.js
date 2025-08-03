const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../src/data/all-state-legislators.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV and convert to TypeScript data
const lines = csvContent.split('\n').filter(line => line.trim());
const legislators = [];

// Skip header row
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/^([^,]+),([^,]+),([^,]+),"([^"]+)",([^,]*)$/);
  
  if (match) {
    const [, state, chamber, district, name, party] = match;
    legislators.push({
      state: state.trim(),
      chamber: chamber.trim(),
      district: district.trim(),
      name: name.trim(),
      party: party.trim()
    });
  }
}

// Generate TypeScript module
const tsContent = `// Auto-generated from ALL state legislators CSV data
// Contains real current state legislators from Open States for all 50 states + DC
// Total: ${legislators.length} legislators from ${[...new Set(legislators.map(l => l.state))].length} states/jurisdictions

export interface Legislator {
  state: string;
  chamber: string;
  district: string;
  name: string;
  party: string;
}

export const stateLegislators: Legislator[] = ${JSON.stringify(legislators, null, 2)};

export function findLegislator(state: string, chamber: string, district: string): Legislator | null {
  const stateKey = state.toLowerCase();
  const chamberKey = chamber.toLowerCase().includes('senate') ? 'Senate' : 'House';
  
  return stateLegislators.find(leg => 
    leg.state === stateKey &&
    leg.chamber === chamberKey &&
    leg.district === district
  ) || null;
}

export function formatLegislatorName(legislator: Legislator): string {
  const title = legislator.chamber === 'Senate' ? 'Sen.' : 'Rep.';
  return \`\${title} \${legislator.name}\`;
}

// Statistics for reference
export const legislatorStats = {
  totalLegislators: ${legislators.length},
  statesAndJurisdictions: ${[...new Set(legislators.map(l => l.state))].length},
  senatorsCount: ${legislators.filter(l => l.chamber === 'Senate').length},
  representativesCount: ${legislators.filter(l => l.chamber === 'House').length},
  byState: ${JSON.stringify(
    [...new Set(legislators.map(l => l.state))]
      .sort()
      .reduce((acc, state) => {
        acc[state.toUpperCase()] = legislators.filter(l => l.state === state).length;
        return acc;
      }, {}),
    null,
    2
  )}
};
`;

// Write TypeScript file
const outputPath = path.join(__dirname, '../src/data/stateLegislators.ts');
fs.writeFileSync(outputPath, tsContent);

console.log(`✓ Generated ${outputPath}`);
console.log(`  ${legislators.length} legislators converted to TypeScript`);

// Show some stats
const states = [...new Set(legislators.map(l => l.state))].sort();
const senateCount = legislators.filter(l => l.chamber === 'Senate').length;
const houseCount = legislators.filter(l => l.chamber === 'House').length;

console.log(`\nComplete Statistics:`);
console.log(`  States/Jurisdictions: ${states.length} (${states.join(', ').toUpperCase()})`);
console.log(`  Senate: ${senateCount} legislators`);
console.log(`  House: ${houseCount} legislators`);
console.log(`  Total: ${legislators.length} legislators`);

// Top states by legislator count
const stateStats = states.map(state => ({
  state: state.toUpperCase(),
  count: legislators.filter(l => l.state === state).length
})).sort((a, b) => b.count - a.count);

console.log(`\nTop 10 states by legislator count:`);
stateStats.slice(0, 10).forEach(({state, count}, i) => {
  console.log(`  ${i + 1}. ${state}: ${count} legislators`);
});