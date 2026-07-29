import React from 'react';
import { useNotify, useRedirect } from 'react-admin';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

export const NotificationProvider = ({ children }) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    const handleCustomNotification = (event) => {
      const { type, message, title, duration = 6000, action } = event.detail;
      
      const notification = {
        id: Date.now(),
        type,
        message,
        title,
        duration,
        action,
      };

      setNotifications(prev => [...prev, notification]);

      if (action?.type === 'redirect') {
        setTimeout(() => {
          redirect(action.path);
        }, duration);
      }
    };

    window.addEventListener('custom-notification', handleCustomNotification);
    return () => {
      window.removeEventListener('custom-notification', handleCustomNotification);
    };
  }, [redirect]);

  const handleClose = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const showNotification = (notification) => {
    const event = new CustomEvent('custom-notification', {
      detail: notification,
    });
    window.dispatchEvent(event);
  };

  React.useEffect(() => {
    window.showNotification = showNotification;
  }, []);

  return (
    <>
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.title && (
              <AlertTitle>{notification.title}</AlertTitle>
            )}
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
