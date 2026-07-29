import React from 'react';
import { render, screen } from '@testing-library/react';
import UnifiedShell from './UnifiedShell';
import { MemoryRouter } from 'react-router-dom';

// Mock components
jest.mock('./Header/SuiteHeader', () => () => <div data-testid="suite-header" />);
jest.mock('./Navigation/ContextSidebar', () => () => <div data-testid="context-sidebar" />);
jest.mock('./Navigation/WorkspaceTabs', () => () => <div data-testid="workspace-tabs" />);
jest.mock('./Canvas/WorkspaceCanvas', () => ({ children }) => <div data-testid="workspace-canvas">{children}</div>);

describe('UnifiedShell', () => {
  it('renders correctly with all shell components and children', () => {
    const mockUser = { name: 'Test User' };
    const mockLogout = jest.fn();

    render(
      <MemoryRouter>
        <UnifiedShell user={mockUser} onLogout={mockLogout}>
          <div data-testid="child-content">Child Content</div>
        </UnifiedShell>
      </MemoryRouter>
    );

    expect(screen.getByTestId('suite-header')).toBeInTheDocument();
    expect(screen.getByTestId('context-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('workspace-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('workspace-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
});
