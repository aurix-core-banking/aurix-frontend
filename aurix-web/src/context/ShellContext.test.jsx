import React from 'react';
import { render, act, renderHook } from '@testing-library/react';
import { ShellProvider, useShell } from './ShellContext';

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ShellContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }) => <ShellProvider>{children}</ShellProvider>;

  it('provides default state', () => {
    const { result } = renderHook(() => useShell(), { wrapper });

    expect(result.current.activeApp).toBe('banking');
    expect(result.current.openTabs).toEqual([{ id: 'tab-dashboard', title: 'Dashboard', path: '/dashboard', app: 'banking', closable: false }]);
    expect(result.current.activeTabId).toBe('tab-dashboard');
    expect(result.current.sidebarCollapsed).toBe(false);
    expect(result.current.commandPaletteOpen).toBe(false);
    expect(result.current.notificationDrawerOpen).toBe(false);
    expect(result.current.themeMode).toBe('dark');
  });

  it('toggles theme and persists to localStorage', () => {
    const { result } = renderHook(() => useShell(), { wrapper });
    
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.themeMode).toBe('light');
    expect(window.localStorage.getItem('aurix_theme')).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.themeMode).toBe('dark');
    expect(window.localStorage.getItem('aurix_theme')).toBe('dark');
  });

  it('switches app', () => {
    const { result } = renderHook(() => useShell(), { wrapper });
    
    act(() => {
      result.current.switchApp('trading');
    });

    expect(result.current.activeApp).toBe('trading');
  });

  it('opens a new tab and sets it as active', () => {
    const { result } = renderHook(() => useShell(), { wrapper });
    
    act(() => {
      result.current.openTab({ id: 'tab-settings', title: 'Settings', path: '/settings', app: 'banking' });
    });

    expect(result.current.openTabs.length).toBe(2);
    expect(result.current.openTabs[1].id).toBe('tab-settings');
    expect(result.current.activeTabId).toBe('tab-settings');
  });

  it('activates existing tab if already open', () => {
    const { result } = renderHook(() => useShell(), { wrapper });
    
    act(() => {
      result.current.openTab({ id: 'tab-settings', title: 'Settings', path: '/settings', app: 'banking' });
    });
    
    act(() => {
      result.current.openTab({ id: 'tab-dashboard', title: 'Dashboard', path: '/dashboard', app: 'banking' });
    });

    expect(result.current.openTabs.length).toBe(2);
    expect(result.current.activeTabId).toBe('tab-dashboard');
  });

  it('closes a tab', () => {
    const { result } = renderHook(() => useShell(), { wrapper });
    
    act(() => {
      result.current.openTab({ id: 'tab-settings', title: 'Settings', path: '/settings', app: 'banking' });
    });
    
    act(() => {
      result.current.closeTab('tab-settings');
    });

    expect(result.current.openTabs.length).toBe(1);
    expect(result.current.activeTabId).toBe('tab-dashboard');
  });

  it('toggles sidebar', () => {
    const { result } = renderHook(() => useShell(), { wrapper });
    
    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarCollapsed).toBe(true);
  });

  it('sets command palette open', () => {
    const { result } = renderHook(() => useShell(), { wrapper });
    
    act(() => {
      result.current.setCommandPaletteOpen(true);
    });

    expect(result.current.commandPaletteOpen).toBe(true);
  });

  it('sets notification drawer open', () => {
    const { result } = renderHook(() => useShell(), { wrapper });
    
    act(() => {
      result.current.setNotificationDrawerOpen(true);
    });

    expect(result.current.notificationDrawerOpen).toBe(true);
  });
});
