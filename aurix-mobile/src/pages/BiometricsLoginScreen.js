import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Colors } from '../constants/Colors';
import { authService } from '../services/authService';
import { biometricsService } from '../services/biometricsService';

const { width } = Dimensions.get('window');

const BiometricsLoginScreen = ({ navigation, onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBiometricsLogin = async () => {
    setLoading(true);
    try {
      const success = await biometricsService.authenticate();
      if (!success) {
        return;
      }
      const resultado = await authService.biometricLogin();
      onLogin(resultado.user);
    } catch (error) {
      Alert.alert('Erro', 'Falha na autenticação biométrica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={Colors.gradientPrimary} style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <Icon name="fingerprint" size={64} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Login Biométrico</Text>
        <Text style={styles.subtitle}>
          Use sua biometria para acessar sua conta de forma segura e rápida.
        </Text>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleBiometricsLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Autenticando...' : 'Autenticar com biometria'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Usar senha</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    height: 55,
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 15,
    padding: 10,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default BiometricsLoginScreen;
