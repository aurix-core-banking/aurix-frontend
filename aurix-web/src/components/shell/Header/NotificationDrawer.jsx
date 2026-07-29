import React, { useState } from 'react';
import { Drawer, IconButton, Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function NotificationDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton 
        color="inherit" 
        onClick={() => setOpen(true)} 
        aria-label="Notifications"
      >
        <NotificationsIcon />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 320 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <Divider />
          <List>
            <ListItem>
              <ListItemText 
                primary="System Update" 
                secondary="The system will go down for maintenance at 12:00 AM." 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="New Message" 
                secondary="You have received a new message from Support." 
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
