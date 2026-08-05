import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Colors } from '../constants/Colors';
import { authService } from '../services/authService';

const formatCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substr(0, 14);
};

const ForgotPasswordScreen = ({ navigation }) => {
  const [etapa, setEtapa] = useState('cpf');
  const [cpf, setCpf] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSolicitar = async () => {
    if (!cpf) {
      Alert.alert('Erro', 'Informe o CPF cadastrado');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(cpf);
      Alert.alert(
        'Código enviado',
        'Enviamos um código de recuperação para seu e-mail/SMS cadastrado.'
      );
      setEtapa('reset');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao recuperar senha');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!codigo || !novaSenha) {
      Alert.alert('Erro', 'Informe o código e a nova senha');
      return;
    }
    if (novaSenha.length < 8) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(cpf, codigo, novaSenha);
      Alert.alert(
        'Senha redefinida',
        'Sua senha foi redefinida com sucesso.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={Colors.gradientPrimary} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <View style={styles.iconCircle}>
              <Icon name="lock-reset" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Recuperar senha</Text>

            {etapa === 'cpf' ? (
              <>
                <Text style={styles.subtitle}>
                  Informe o CPF cadastrado para receber um código de recuperação.
                </Text>

                <View style={styles.inputContainer}>
                  <Icon name="account-circle" size={20} color={Colors.gray} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="CPF"
                    placeholderTextColor={Colors.gray}
                    value={cpf}
                    onChangeText={(value) => setCpf(formatCPF(value))}
                    keyboardType="numeric"
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSolicitar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Enviando...' : 'Enviar código'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.subtitle}>
                  Digite o código recebido e defina uma nova senha.
                </Text>

                <View style={styles.inputContainer}>
                  <Icon name="vpn-key" size={20} color={Colors.gray} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Código de recuperação"
                    placeholderTextColor={Colors.gray}
                    value={codigo}
                    onChangeText={setCodigo}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock" size={20} color={Colors.gray} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Nova senha"
                    placeholderTextColor={Colors.gray}
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    secureTextEntry={!showSenha}
                  />
                  <TouchableOpacity
                    onPress={() => setShowSenha(!showSenha)}
                    style={styles.eyeIcon}
                  >
                    <Icon
                      name={showSenha ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleReset}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Redefinindo...' : 'Redefinir senha'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
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
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
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
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
