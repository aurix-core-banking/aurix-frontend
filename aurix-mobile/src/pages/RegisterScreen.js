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

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: field === 'cpf' ? formatCPF(value) : value,
    });
  };

  const handleRegister = async () => {
    if (!formData.cpf || !formData.nome || !formData.email || !formData.senha) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }
    if (formData.senha.length < 8) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres');
      return;
    }
    if (formData.senha !== formData.confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        cpf: formData.cpf,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
      });
      Alert.alert(
        'Conta criada',
        'Sua conta foi criada com sucesso. Entre com seu CPF e senha.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao criar conta');
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
              <Icon name="person-add" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>
              Preencha seus dados para seu primeiro acesso.
            </Text>

            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color={Colors.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor={Colors.gray}
                value={formData.nome}
                onChangeText={(value) => handleChange('nome', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="account-circle" size={20} color={Colors.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="CPF"
                placeholderTextColor={Colors.gray}
                value={formData.cpf}
                onChangeText={(value) => handleChange('cpf', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color={Colors.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor={Colors.gray}
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color={Colors.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                placeholderTextColor={Colors.gray}
                value={formData.telefone}
                onChangeText={(value) => handleChange('telefone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color={Colors.gray} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Senha (mín. 8 caracteres)"
                placeholderTextColor={Colors.gray}
                value={formData.senha}
                onChangeText={(value) => handleChange('senha', value)}
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

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color={Colors.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                placeholderTextColor={Colors.gray}
                value={formData.confirmarSenha}
                onChangeText={(value) => handleChange('confirmarSenha', value)}
                secureTextEntry={!showSenha}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Criando conta...' : 'Criar conta'}
              </Text>
            </TouchableOpacity>
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
    paddingVertical: 20,
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
    marginBottom: 5,
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

export default RegisterScreen;
