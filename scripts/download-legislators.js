const fs = require('fs');
const https = require('https');
const path = require('path');

// Key states for demo - focusing on larger states with good data
const DEMO_STATES = [
  'ca', 'tx', 'ny', 'fl', 'il', 'pa', 'oh', 'ga', 'nc', 'mi', 
  'nj', 'va', 'wa', 'az', 'ma', 'tn', 'in', 'mo', 'md', 'wi'
];

async function downloadCSV(state) {
  return new Promise((resolve, reject) => {
    const url = `https://data.openstates.org/people/current/${state}.csv`;
    console.log(`Downloading ${state.toUpperCase()}...`);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.warn(`Failed to download ${state}: ${response.statusCode}`);
        resolve(''); // Return empty string on failure
        return;
      }
      
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        console.log(`✓ Downloaded ${state.toUpperCase()} (${data.length} bytes)`);
        resolve(data);
      });
    }).on('error', (err) => {
      console.warn(`Error downloading ${state}:`, err.message);
      resolve(''); // Return empty string on failure
    });
  });
}

function parseCSVRow(row) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function extractLegislatorData(csvData, state) {
  const lines = csvData.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const header = parseCSVRow(lines[0]);
  const nameIndex = header.indexOf('name');
  const partyIndex = header.indexOf('current_party');
  const districtIndex = header.indexOf('current_district');
  const chamberIndex = header.indexOf('current_chamber');
  
  const legislators = [];
  
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVRow(lines[i]);
    if (row.length < header.length) continue;
    
    const name = row[nameIndex];
    const party = row[partyIndex];
    const district = row[districtIndex];
    const chamber = row[chamberIndex];
    
    if (name && district && chamber && district !== 'At-Large') {
      legislators.push({
        state: state.toLowerCase(),
        name,
        party: party === 'Democratic' ? 'D' : party === 'Republican' ? 'R' : party === 'Independent' ? 'I' : party?.charAt(0) || '',
        district,
        chamber: chamber === 'upper' ? 'Senate' : 'House'
      });
    }
  }
  
  return legislators;
}

async function main() {
  console.log('Downloading state legislator data...\n');
  
  const allLegislators = [];
  
  for (const state of DEMO_STATES) {
    const csvData = await downloadCSV(state);
    if (csvData) {
      const legislators = extractLegislatorData(csvData, state);
      allLegislators.push(...legislators);
      console.log(`  → Extracted ${legislators.length} legislators from ${state.toUpperCase()}`);
    }
    
    // Small delay to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\nTotal legislators collected: ${allLegislators.length}`);
  
  // Create CSV output
  const csvOutput = [
    'state,chamber,district,name,party',
    ...allLegislators.map(leg => 
      `${leg.state},${leg.chamber},${leg.district},"${leg.name}",${leg.party}`
    )
  ].join('\n');
  
  // Write to data directory
  const outputPath = path.join(__dirname, '../src/data/state-legislators.csv');
  fs.writeFileSync(outputPath, csvOutput);
  
  console.log(`\n✓ Saved to ${outputPath}`);
  console.log(`  ${allLegislators.length} total records`);
  
  // Show sample data
  console.log('\nSample data:');
  allLegislators.slice(0, 5).forEach(leg => {
    console.log(`  ${leg.state.toUpperCase()} ${leg.chamber} District ${leg.district}: ${leg.name} (${leg.party})`);
  });
}

main().catch(console.error);