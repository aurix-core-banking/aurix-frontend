import React from 'react';
import { Tabs, Tab, Box, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useShell } from '../../../context/ShellContext';

const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 48,
  textTransform: 'none',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 16px',
  '& .close-icon': {
    marginLeft: theme.spacing(1),
    visibility: 'hidden',
    padding: 2,
  },
  '&:hover .close-icon': {
    visibility: 'visible',
  },
  '&.Mui-selected .close-icon': {
    visibility: 'visible',
  }
}));

const WorkspaceTabs = () => {
  const { 
    openTabs, 
    activeTabId, 
    setActiveTabId, 
    closeTab,
    setCommandPaletteOpen 
  } = useShell();

  const handleChange = (event, newValue) => {
    setActiveTabId(newValue);
  };

  const handleClose = (e, tabId) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  return (
    <TabContainer>
      <Tabs
        value={activeTabId}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: 48, flexGrow: 1 }}
      >
        {openTabs.map((tab) => (
          <StyledTab
            key={tab.id}
            value={tab.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {tab.title}
                {tab.closable !== false && (
                  <IconButton
                    size="small"
                    className="close-icon"
                    onClick={(e) => handleClose(e, tab.id)}
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            }
          />
        ))}
      </Tabs>
      <Box sx={{ pr: 1, pl: 1 }}>
        <IconButton 
          size="small" 
          onClick={() => setCommandPaletteOpen(true)}
          data-testid="add-tab-btn"
        >
          <AddIcon />
        </IconButton>
      </Box>
    </TabContainer>
  );
};

export default WorkspaceTabs;
