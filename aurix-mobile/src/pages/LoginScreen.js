import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Colors } from '../constants/Colors';
import { authService } from '../services/authService';
import { biometricsService } from '../services/biometricsService';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation, onLogin, biometricsEnabled }) => {
  const [etapa, setEtapa] = useState('credenciais');
  const [formData, setFormData] = useState({
    cpf: '',
    senha: '',
    codigo: '',
  });
  const [codigoToken, setCodigoToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Animate entrance
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

  const handleInputChange = (field, value) => {
    if (field === 'cpf') {
      // Format CPF
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .substr(0, 14);
      setFormData({ ...formData, [field]: formatted });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleLogin = async () => {
    if (!formData.cpf || !formData.senha) {
      Alert.alert('Erro', 'CPF e senha são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const resultado = await authService.login({
        cpf: formData.cpf,
        senha: formData.senha,
      });

      if (resultado?.mfaRequired) {
        setCodigoToken(resultado.codigoToken);
        await authService.gerarTokenMFA(formData.cpf);
        setEtapa('mfa');
        return;
      }

      onLogin(resultado.user);
    } catch (error) {
      Alert.alert('Erro', error.message || 'CPF ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  const handleValidarMFA = async () => {
    if (!formData.codigo) {
      Alert.alert('Erro', 'Informe o código recebido');
      return;
    }

    setLoading(true);
    try {
      const resultado = await authService.validarTokenMFA(
        codigoToken || formData.cpf,
        formData.codigo
      );
      onLogin(resultado.user);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Token inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricsLogin = async () => {
    if (!biometricsEnabled) {
      Alert.alert('Biometria Indisponível', 'Seu dispositivo não suporta autenticação biométrica');
      return;
    }

    try {
      const success = await biometricsService.authenticate();
      if (success) {
        const resultado = await authService.biometricLogin();
        onLogin(resultado.user);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na autenticação biométrica');
    }
  };

  return (
    <LinearGradient colors={Colors.gradientPrimary} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Text style={styles.logoText}>🏛️</Text>
              </View>
              <Text style={styles.appTitle}>AUREUS Banking</Text>
              <Text style={styles.appSubtitle}>Mobile Banking Seguro</Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              {etapa === 'credenciais' ? (
                <>
                  <View style={styles.inputContainer}>
                    <Icon name="account-circle" size={20} color={Colors.gray} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="CPF"
                      placeholderTextColor={Colors.gray}
                      value={formData.cpf}
                      onChangeText={(value) => handleInputChange('cpf', value)}
                      keyboardType="numeric"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color={Colors.gray} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Senha"
                      placeholderTextColor={Colors.gray}
                      value={formData.senha}
                      onChangeText={(value) => handleInputChange('senha', value)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Icon
                        name={showPassword ? 'visibility-off' : 'visibility'}
                        size={20}
                        color={Colors.gray}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    <Text style={styles.loginButtonText}>
                      {loading ? 'Entrando...' : 'Entrar'}
                    </Text>
                  </TouchableOpacity>

                  {biometricsEnabled && (
                    <TouchableOpacity
                      style={styles.biometricsButton}
                      onPress={handleBiometricsLogin}
                    >
                      <Icon name="fingerprint" size={24} color={Colors.primary} />
                      <Text style={styles.biometricsButtonText}>Entrar com Biometria</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.mfaInfo}>
                    Enviamos um código de segurança para seu e-mail/SMS cadastrado.
                  </Text>

                  <View style={styles.inputContainer}>
                    <Icon name="security" size={20} color={Colors.gray} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Código de segurança"
                      placeholderTextColor={Colors.gray}
                      value={formData.codigo}
                      onChangeText={(value) => handleInputChange('codigo', value)}
                      keyboardType="numeric"
                      autoCapitalize="none"
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                    onPress={handleValidarMFA}
                    disabled={loading}
                  >
                    <Text style={styles.loginButtonText}>
                      {loading ? 'Validando...' : 'Validar código'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setEtapa('credenciais')}
                    disabled={loading}
                  >
                    <Text style={styles.backButtonText}>Voltar</Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={styles.linksContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.linkText}>Esqueci minha senha</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.linkText}>Criar conta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 32,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: Colors.lightGray,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.text,
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  biometricsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    height: 55,
    marginTop: 15,
  },
  biometricsButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mfaInfo: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;
