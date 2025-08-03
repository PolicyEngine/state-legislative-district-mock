const fs = require('fs');

// Configuration
const API_KEY = '1b1bc860-788e-45af-8bee-7481c812bf20';
const BASE_URL = 'https://v3.openstates.org';

// Function to fetch all legislators with pagination
async function fetchAllLegislators() {
  const allLegislators = [];
  let page = 1;
  let hasMorePages = true;

  console.log('Fetching current state legislators from Open States API...');

  while (hasMorePages) {
    try {
      const url = `${BASE_URL}/people?current=true&current_role.type=legislator&page=${page}&per_page=100`;
      
      console.log(`Fetching page ${page}...`);
      
      const response = await fetch(url, {
        headers: {
          'X-API-KEY': API_KEY,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        allLegislators.push(...data.results);
        console.log(`Added ${data.results.length} legislators from page ${page}`);
        
        // Check if there are more pages
        hasMorePages = page < data.pagination.max_page;
        page++;
      } else {
        hasMorePages = false;
      }

      // Add a small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      hasMorePages = false;
    }
  }

  console.log(`Total legislators fetched: ${allLegislators.length}`);
  return allLegislators;
}

// Function to convert legislators to CSV format
function convertToCSV(legislators) {
  const csvRows = [];
  
  // Add header
  csvRows.push('state,chamber,district,name,party');

  // Process each legislator
  for (const legislator of legislators) {
    // Filter for state legislators only (exclude federal)
    if (!legislator.current_role || 
        !legislator.current_role.state || 
        legislator.current_role.type !== 'legislator') {
      continue;
    }

    const state = legislator.current_role.state;
    const chamber = legislator.current_role.chamber === 'upper' ? 'Senate' : 'House';
    const district = legislator.current_role.district || '';
    const name = legislator.name || `${legislator.given_name || ''} ${legislator.family_name || ''}`.trim();
    
    // Get party abbreviation
    let party = '';
    if (legislator.party && legislator.party.length > 0) {
      const partyName = legislator.party[0].name.toLowerCase();
      if (partyName.includes('democrat')) party = 'D';
      else if (partyName.includes('republican')) party = 'R';
      else if (partyName.includes('independent')) party = 'I';
      else party = legislator.party[0].name.charAt(0).toUpperCase();
    }

    // Escape any commas in the data
    const escapeCSV = (field) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    csvRows.push([
      escapeCSV(state),
      escapeCSV(chamber),
      escapeCSV(district),
      escapeCSV(name),
      escapeCSV(party)
    ].join(','));
  }

  return csvRows.join('\n');
}

// Main function
async function main() {
  try {
    // Fetch all legislators
    const legislators = await fetchAllLegislators();
    
    if (legislators.length === 0) {
      console.log('No legislators found.');
      return;
    }

    // Convert to CSV
    const csvContent = convertToCSV(legislators);
    
    // Save to file
    const filename = 'state_legislators.csv';
    fs.writeFileSync(filename, csvContent);
    
    console.log(`\nCSV file saved as: ${filename}`);
    console.log(`Total rows (including header): ${csvContent.split('\n').length}`);
    
    // Show first few lines as preview
    const lines = csvContent.split('\n');
    console.log('\nPreview of CSV content:');
    console.log(lines.slice(0, 6).join('\n'));
    
    if (lines.length > 6) {
      console.log('...');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();