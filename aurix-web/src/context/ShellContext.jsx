import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ShellContext = createContext();

export const useShell = () => {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return context;
};

export const ShellProvider = ({ children }) => {
  const [activeApp, setActiveApp] = useState('banking');
  const [openTabs, setOpenTabs] = useState([{ id: 'tab-dashboard', title: 'Dashboard', path: '/dashboard', app: 'banking', closable: false }]);
  const [activeTabId, setActiveTabId] = useState('tab-dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  
  const [themeMode, setThemeMode] = useState(() => {
    return window.localStorage.getItem('aurix_theme') || 'dark';
  });

  useEffect(() => {
    window.localStorage.setItem('aurix_theme', themeMode);
  }, [themeMode]);

  const switchApp = useCallback((appId) => {
    setActiveApp(appId);
  }, []);

  const openTab = useCallback((tab) => {
    setOpenTabs((prevTabs) => {
      const existingTab = prevTabs.find(t => t.id === tab.id);
      if (existingTab) {
        return prevTabs;
      }
      return [...prevTabs, { ...tab, closable: tab.closable !== undefined ? tab.closable : true }];
    });
    setActiveTabId(tab.id);
  }, []);

  const closeTab = useCallback((tabId) => {
    setOpenTabs((prevTabs) => {
      const newTabs = prevTabs.filter(t => t.id !== tabId);
      // If we closed the active tab, we need to activate another one
      if (activeTabId === tabId) {
        // Just activate the last one for simplicity in this implementation
        const lastTab = newTabs[newTabs.length - 1];
        if (lastTab) {
          setActiveTabId(lastTab.id);
        }
      }
      return newTabs;
    });
  }, [activeTabId]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const value = {
    activeApp,
    switchApp,
    openTabs,
    openTab,
    closeTab,
    activeTabId,
    setActiveTabId,
    sidebarCollapsed,
    toggleSidebar,
    commandPaletteOpen,
    setCommandPaletteOpen,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    themeMode,
    toggleTheme
  };

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
};
