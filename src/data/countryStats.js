export const countryStatsDB = {
  "India": {
    'Active Personnel': '1,455,550',
    'Reserve Personnel': '1,155,000',
    'Military Budget': '$72.9B (2023)',
    'Nuclear Warheads': '160',
    'Tanks': '4,614',
    'Aircraft': '2,082',
    'Naval Vessels': '295',
    'Global Rank': '4th'
  },
  "United States of America": {
    'Active Personnel': '1,390,000',
    'Reserve Personnel': '850,000',
    'Military Budget': '$877B (2023)',
    'Nuclear Warheads': '5,244',
    'Tanks': '6,209',
    'Aircraft': '13,300',
    'Naval Vessels': '484',
    'Global Rank': '1st'
  }
};

export const getStatsForCountry = name => countryStatsDB[name] || null;
