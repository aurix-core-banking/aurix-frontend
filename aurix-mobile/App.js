import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, Alert, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';

// Navigation
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';

// Services
import { authService } from './src/services/authService';
import { biometricsService } from './src/services/biometricsService';
import { notificationService } from './src/services/notificationService';

// Utils
import { Colors } from './src/constants/Colors';

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);

      // Initialize notifications
      await notificationService.initialize();

      // Check biometrics availability
      const biometricsAvailable = await biometricsService.isAvailable();
      setBiometricsEnabled(biometricsAvailable);

      // Check authentication
      await checkAuthStatus();

      // Request permissions
      await requestPermissions();

    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert(
        'Erro de Inicialização',
        'Ocorreu um erro ao inicializar o aplicativo. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = await authService.getStoredToken();
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await authService.clearStoredToken();
    }
  };

  const requestPermissions = async () => {
    // Request camera permission for QR code scanning
    if (Platform.OS === 'android') {
      try {
        const { request, PERMISSIONS, RESULTS } = require('react-native-permissions');
        
        const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
        const locationPermission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        
        console.log('Camera permission:', cameraPermission);
        console.log('Location permission:', locationPermission);
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    }
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    // You can replace this with a proper splash screen component
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar
              barStyle="light-content"
              backgroundColor={Colors.primary}
              translucent={false}
            />
            
            {isAuthenticated ? (
              <AppNavigator 
                user={user} 
                onLogout={handleLogout}
                biometricsEnabled={biometricsEnabled}
              />
            ) : (
              <AuthNavigator 
                onLogin={handleLogin}
                biometricsEnabled={biometricsEnabled}
              />
            )}
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
