import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import DashboardScreen from '../pages/DashboardScreen';
import ContasScreen from '../pages/ContasScreen';
import TransacoesScreen from '../pages/TransacoesScreen';
import PIXScreen from '../pages/PIXScreen';
import InvestimentosScreen from '../pages/InvestimentosScreen';
import CartoesScreen from '../pages/CartoesScreen';
import PerfilScreen from '../pages/PerfilScreen';
import ConfiguracoesScreen from '../pages/ConfiguracoesScreen';
import QRCodeScannerScreen from '../pages/QRCodeScannerScreen';
import TransferenciaScreen from '../pages/TransferenciaScreen';
import ExtratoScreen from '../pages/ExtratoScreen';
import NotificacoesScreen from '../pages/NotificacoesScreen';

// Constants
import { Colors } from '../constants/Colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Dashboard
const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="DashboardMain" 
      component={DashboardScreen}
      options={{ title: '🏛️ AUREUS Banking' }}
    />
    <Stack.Screen 
      name="QRCodeScanner" 
      component={QRCodeScannerScreen}
      options={{ title: 'Ler QR Code' }}
    />
    <Stack.Screen 
      name="Transferencia" 
      component={TransferenciaScreen}
      options={{ title: 'Transferência' }}
    />
    <Stack.Screen 
      name="Notificacoes" 
      component={NotificacoesScreen}
      options={{ title: 'Notificações' }}
    />
  </Stack.Navigator>
);

// Stack Navigator for Contas
const ContasStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="ContasMain" 
      component={ContasScreen}
      options={{ title: 'Minhas Contas' }}
    />
    <Stack.Screen 
      name="Extrato" 
      component={ExtratoScreen}
      options={{ title: 'Extrato' }}
    />
  </Stack.Navigator>
);

// Stack Navigator for Transacoes
const TransacoesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="TransacoesMain" 
      component={TransacoesScreen}
      options={{ title: 'Transações' }}
    />
  </Stack.Navigator>
);

// Stack Navigator for PIX
const PIXStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="PIXMain" 
      component={PIXScreen}
      options={{ title: 'PIX' }}
    />
    <Stack.Screen 
      name="QRCodeScanner" 
      component={QRCodeScannerScreen}
      options={{ title: 'Ler QR Code PIX' }}
    />
  </Stack.Navigator>
);

// Stack Navigator for Perfil
const PerfilStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="PerfilMain" 
      component={PerfilScreen}
      options={{ title: 'Meu Perfil' }}
    />
    <Stack.Screen 
      name="Configuracoes" 
      component={ConfiguracoesScreen}
      options={{ title: 'Configurações' }}
    />
  </Stack.Navigator>
);

const AppNavigator = ({ user, onLogout, biometricsEnabled }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Contas':
              iconName = 'account-balance';
              break;
            case 'Transacoes':
              iconName = 'swap-horiz';
              break;
            case 'PIX':
              iconName = 'payment';
              break;
            case 'Perfil':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.lightGray,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{
          tabBarLabel: 'Início',
        }}
      />
      <Tab.Screen 
        name="Contas" 
        component={ContasStack}
        options={{
          tabBarLabel: 'Contas',
        }}
      />
      <Tab.Screen 
        name="Transacoes" 
        component={TransacoesStack}
        options={{
          tabBarLabel: 'Transações',
        }}
      />
      <Tab.Screen 
        name="PIX" 
        component={PIXStack}
        options={{
          tabBarLabel: 'PIX',
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilStack}
        options={{
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
