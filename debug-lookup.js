// Quick debug script to test legislator lookup
const { findLegislator } = require('./src/data/stateLegislators.ts');

// Test CA Senate District 8
console.log('Testing CA Senate District 8:');
console.log('findLegislator("CA", "Senate", "8"):', findLegislator("CA", "Senate", "8"));
console.log('findLegislator("ca", "Senate", "8"):', findLegislator("ca", "Senate", "8"));

// Test CA House District 10 (where Nguyen is)
console.log('\nTesting CA House District 10:');
console.log('findLegislator("CA", "House", "10"):', findLegislator("CA", "House", "10"));
console.log('findLegislator("ca", "House", "10"):', findLegislator("ca", "House", "10"));

// Test what happens with different chamber formats
console.log('\nTesting chamber format variations:');
console.log('findLegislator("ca", "senate", "8"):', findLegislator("ca", "senate", "8"));
console.log('findLegislator("ca", "upper", "8"):', findLegislator("ca", "upper", "8"));