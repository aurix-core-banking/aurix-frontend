import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import LoginScreen from '../pages/LoginScreen';
import BiometricsLoginScreen from '../pages/BiometricsLoginScreen';
import ForgotPasswordScreen from '../pages/ForgotPasswordScreen';
import RegisterScreen from '../pages/RegisterScreen';
import OnboardingScreen from '../pages/OnboardingScreen';
import FormPF from '../pages/onboarding/FormPF';
import StepEmpresa from '../pages/onboarding/StepEmpresa';
import StepSocios from '../pages/onboarding/StepSocios';
import SuccessScreen from '../pages/onboarding/SuccessScreen';
import { StepDocumentosPF } from '../pages/onboarding/StepDocumentosPF';
import { StepDocumentosPJ } from '../pages/onboarding/StepDocumentosPJ';

// Constants
import { Colors } from '../constants/Colors';

const Stack = createStackNavigator();

const AuthNavigator = ({ onLogin, biometricsEnabled }) => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="Onboarding" 
        options={{ headerShown: false }}
      >
        {props => (
          <OnboardingScreen 
            {...props} 
            biometricsEnabled={biometricsEnabled}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen 
        name="Login" 
        options={{ 
          title: 'Entrar',
          headerShown: false 
        }}
      >
        {props => (
          <LoginScreen 
            {...props} 
            onLogin={onLogin}
            biometricsEnabled={biometricsEnabled}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen 
        name="BiometricsLogin" 
        options={{ 
          title: 'Login Biométrico',
          headerShown: false 
        }}
      >
        {props => (
          <BiometricsLoginScreen 
            {...props} 
            onLogin={onLogin}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ 
          title: 'Recuperar Senha',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
        }}
      />
      
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ 
          title: 'Criar Conta',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
        }}
      />

      <Stack.Screen
        name="FormPF"
        component={FormPF}
        options={{
          title: 'Abertura de Conta PF',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
        }}
      />

      <Stack.Screen
        name="StepEmpresa"
        component={StepEmpresa}
        options={{
          title: 'Dados da Empresa',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
        }}
      />

      <Stack.Screen
        name="StepSocios"
        component={StepSocios}
        options={{
          title: 'Sócios',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
        }}
      />

      <Stack.Screen
        name="StepDocumentosPF"
        component={StepDocumentosPF}
        options={{ headerTitle: 'Envio de Documentos' }}
      />

      <Stack.Screen
        name="StepDocumentosPJ"
        component={StepDocumentosPJ}
        options={{ headerTitle: 'Envio de Documentos' }}
      />

      <Stack.Screen
        name="SuccessScreen"
        component={SuccessScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
