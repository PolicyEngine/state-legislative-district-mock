# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm install    # Install dependencies
npm start      # Start development server on http://localhost:3000
npm test       # Run tests in watch mode
npm run build  # Create production build
```

### Testing
```bash
npm test -- --coverage              # Run tests with coverage
npm test ComponentName             # Run tests for specific component
npm test -- --watchAll=false       # Run tests once without watch mode
```

## Architecture Overview

This is a React TypeScript application that demonstrates PolicyEngine's state legislative impact analysis capabilities. It's designed for booth demonstrations and uses entirely mock data.

### Key Components

1. **Page Flow**: The app has three distinct pages managed by state in `App.tsx`:
   - `setup`: District selection page
   - `bills`: List of active legislation for the selected district
   - `impact`: Detailed impact analysis for a selected bill

2. **Demo Mode**: Two types of "demo" functionality:
   - **Mock Data Indicators**: Always-visible warnings that data is simulated (banner + watermark)
   - **Auto Demo Mode**: Autonomous navigation with simulated cursor for unattended booth displays

3. **District Variations**: The `src/utils/districtVariations.ts` module creates realistic differences between state and district-level impacts based on:
   - Urban/suburban/rural classification
   - Wealth index
   - Senior population density
   - Family composition

### Data Flow

1. **State Selection** → Loads state-specific legislative chambers and district counts from `src/data/stateDistricts.ts`
2. **District Selection** → Generates district-specific demographic multipliers
3. **Bill Selection** → Shows impact analysis with district-specific variations applied to base state data
4. **State/District Toggle** → Switches between statewide and district-specific impact calculations

### Design System

Uses PolicyEngine's colors and fonts defined in `src/styles/colors.ts`:
- Primary: Teal (#39C6C0)
- Secondary: Blue (#2C6496)
- Typography: Roboto (all weights)

### Mock Data Structure

Bills are generated consistently per state using a hash-based algorithm in `ActiveBills.tsx`. Impact data is adjusted based on district characteristics to show realistic variations while maintaining believable relationships between metrics.

## Special Considerations

1. **TypeScript Strictness**: The project uses strict TypeScript settings. When adding new code, ensure proper typing.

2. **Responsive Charts**: All Recharts components must be wrapped in `ResponsiveContainer` for proper sizing.

3. **Demo Mode Dropdowns**: When in auto demo mode, dropdowns show visual expansions using the `DemoDropdown` component before selections are made.

4. **District Data**: All 50 states have accurate legislative chamber names and district counts. The data includes special cases like Nebraska's unicameral legislature.

## PolicyEngine Integration Notes

This is a standalone mock application designed to demonstrate potential PolicyEngine features. It uses PolicyEngine's design system but doesn't connect to actual PolicyEngine APIs. The realistic state tax bills (Working Families Tax Credit, Property Tax Circuit Breaker, etc.) are examples of state-level legislation that PolicyEngine could analyze.