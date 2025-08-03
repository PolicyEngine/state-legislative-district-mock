import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('PolicyEngine State Legislative District App', () => {
  test('renders main heading', () => {
    render(<App />);
    const heading = screen.getByText(/State Legislative District Tax Policy Analysis/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders district selector', () => {
    render(<App />);
    const stateSelector = screen.getByText(/Select a state/i);
    expect(stateSelector).toBeInTheDocument();
  });

  test('shows analysis components after district selection', async () => {
    render(<App />);
    
    // Select state
    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: 'California' } });
    
    // Wait for district select to appear
    await waitFor(() => {
      expect(screen.getByLabelText(/District/i)).toBeInTheDocument();
    });
    
    // Select district
    const districtSelect = screen.getByLabelText(/District/i);
    fireEvent.change(districtSelect, { target: { value: 'ca-01' } });
    
    // Check if analysis components are shown
    await waitFor(() => {
      expect(screen.getByText(/Policy Overview/i)).toBeInTheDocument();
      expect(screen.getByText(/Budgetary Impact/i)).toBeInTheDocument();
      expect(screen.getByText(/Distributional Impact/i)).toBeInTheDocument();
    });
  });

  test('displays policy summary information', async () => {
    render(<App />);
    
    // Select a district
    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: 'California' } });
    
    // Wait for district select to appear
    await waitFor(() => {
      expect(screen.getByLabelText(/District/i)).toBeInTheDocument();
    });
    
    const districtSelect = screen.getByLabelText(/District/i);
    fireEvent.change(districtSelect, { target: { value: 'ca-01' } });
    
    // Check policy details
    await waitFor(() => {
      expect(screen.getByText(/Tax Reform Act 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Provisions:/i)).toBeInTheDocument();
    });
  });
});
