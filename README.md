# PolicyEngine State Legislative Dashboard

A mock application demonstrating budgetary and distributional impacts of tax policy by state legislative district, using PolicyEngine's new design system.

## Features

- **District Selection**: Choose a state and legislative district to analyze
- **Policy Summary**: View details of the Tax Reform Act 2024
- **Budgetary Impact**: Visualize revenue impacts with:
  - Total revenue loss summary
  - Revenue breakdown by tax category (bar chart)
  - 5-year revenue projections (line chart)
- **Distributional Impact**: Analyze policy effects across income groups with:
  - Impact by income decile showing percentage changes
  - Average benefit by income group with household counts
  - Key metrics: households affected, average tax reduction, percentage benefiting

## Mock Data

The app uses simulated data to demonstrate:
- $2.45B total revenue loss for selected districts
- Revenue impacts across income tax, sales tax, property tax, and other categories
- Distributional effects showing larger absolute benefits for higher-income households
- 460k households affected with an average $1,800 tax reduction

## Technology Stack

- React with TypeScript
- Recharts for data visualization
- PolicyEngine design system (colors, fonts, components)
- Responsive layout following PolicyEngine's new wireframes

## Getting Started

```bash
npm install
npm start
```

The app will run on http://localhost:3000

## Testing

```bash
npm test
```

## Design System

Uses PolicyEngine's official color palette:
- Primary: Teal (#39C6C0)
- Secondary: Blue (#2C6496)
- Dark: Darkest Blue (#0C1A27)
- Backgrounds: Blue-98 (#F7FAFD), Teal Light (#F7FDFC)

Typography:
- All text: Roboto (weights: 300, 400, 500, 700)
