const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../src/data/state-legislators.csv');
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
const tsContent = `// Auto-generated from state legislators CSV data
// Contains real current state legislators from Open States
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
`;

// Write TypeScript file
const outputPath = path.join(__dirname, '../src/data/stateLegislators.ts');
fs.writeFileSync(outputPath, tsContent);

console.log(`✓ Generated ${outputPath}`);
console.log(`  ${legislators.length} legislators converted to TypeScript`);

// Show some stats
const states = [...new Set(legislators.map(l => l.state))];
const senateCount = legislators.filter(l => l.chamber === 'Senate').length;
const houseCount = legislators.filter(l => l.chamber === 'House').length;

console.log(`\nStatistics:`);
console.log(`  States: ${states.length} (${states.join(', ').toUpperCase()})`);
console.log(`  Senate: ${senateCount} legislators`);
console.log(`  House: ${houseCount} legislators`);
console.log(`  Total: ${legislators.length} legislators`);