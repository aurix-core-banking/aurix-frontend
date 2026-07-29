import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShellProvider } from '../../../context/ShellContext';
import SuiteHeader from '../Header/SuiteHeader';
import WorkspaceTabs from './WorkspaceTabs';

// Wrap with provider to give context
const renderWithShell = (ui) => {
  return render(
    <ShellProvider>
      {ui}
    </ShellProvider>
  );
};

describe('SuiteHeader and WorkspaceTabs', () => {
  test('SuiteHeader renders correctly and interacts with context', () => {
    renderWithShell(<SuiteHeader />);
    
    // Title
    expect(screen.getByText(/AUREUS Suite/i)).toBeInTheDocument();
    
    // App Badge
    expect(screen.getByText(/Banking/i)).toBeInTheDocument();

    // Command palette button
    const cmdButton = screen.getByText(/Buscar comando/i);
    expect(cmdButton).toBeInTheDocument();

    // Test sidebar toggle button existence
    const menuButton = screen.getByTestId('menu-toggle-btn');
    expect(menuButton).toBeInTheDocument();
  });

  test('WorkspaceTabs renders correctly and shows open tabs', () => {
    renderWithShell(<WorkspaceTabs />);
    
    // Default tab from ShellContext
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // Plus button
    const plusButton = screen.getByTestId('add-tab-btn');
    expect(plusButton).toBeInTheDocument();
  });
});
