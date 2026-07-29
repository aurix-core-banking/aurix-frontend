import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../constants/Colors';
import {
  validarCNPJ,
  validarEmail,
  validarCEP,
  formatarCNPJ,
  formatarTelefone,
  formatarCEP,
} from '../../utils/validation';

const StepEmpresa = ({ navigation }) => {
  const [formData, setFormData] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
  });
  const [cnpjValido, setCnpjValido] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    let formatted = value;
    if (field === 'cnpj') {
      formatted = formatarCNPJ(value);
      if (formatted.replace(/\D/g, '').length === 14) {
        setCnpjValido(validarCNPJ(formatted));
      } else {
        setCnpjValido(false);
      }
    } else if (field === 'telefone') formatted = formatarTelefone(value);
    else if (field === 'cep') formatted = formatarCEP(value);

    setFormData(prev => ({ ...prev, [field]: formatted }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cnpj) newErrors.cnpj = 'CNPJ é obrigatório';
    else if (!validarCNPJ(formData.cnpj)) newErrors.cnpj = 'CNPJ inválido';
    if (!formData.razaoSocial) newErrors.razaoSocial = 'Razão Social é obrigatória';
    if (!formData.nomeFantasia) newErrors.nomeFantasia = 'Nome Fantasia é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    else if (!validarEmail(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.cep) newErrors.cep = 'CEP é obrigatório';
    else if (!validarCEP(formData.cep)) newErrors.cep = 'CEP inválido';
    if (!formData.logradouro) newErrors.logradouro = 'Logradouro é obrigatório';
    if (!formData.numero) newErrors.numero = 'Número é obrigatório';
    if (!formData.bairro) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatório';
    if (!formData.uf) newErrors.uf = 'UF é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    navigation.navigate('StepSocios', { empresaData: formData });
  };

  const getInputStyle = (field) => [
    styles.input,
    errors[field] && styles.inputError,
  ];

  const renderError = (field) =>
    errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null;

  return (
    <LinearGradient colors={Colors.gradientPrimary} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Passo 1 de 2</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Dados da Empresa</Text>

            <Text style={styles.label}>CNPJ</Text>
            <View style={styles.cnpjRow}>
              <TextInput
                style={[getInputStyle('cnpj'), styles.cnpjInput]}
                placeholder="00.000.000/0000-00"
                placeholderTextColor={Colors.gray}
                value={formData.cnpj}
                onChangeText={v => handleChange('cnpj', v)}
                keyboardType="numeric"
                maxLength={18}
              />
              {cnpjValido && (
                <Icon name="check-circle" size={24} color={Colors.success} style={styles.checkIcon} />
              )}
            </View>
            {renderError('cnpj')}

            <Text style={styles.label}>Razão Social</Text>
            <TextInput
              style={getInputStyle('razaoSocial')}
              placeholder="Razão Social"
              placeholderTextColor={Colors.gray}
              value={formData.razaoSocial}
              onChangeText={v => handleChange('razaoSocial', v)}
            />
            {renderError('razaoSocial')}

            <Text style={styles.label}>Nome Fantasia</Text>
            <TextInput
              style={getInputStyle('nomeFantasia')}
              placeholder="Nome Fantasia"
              placeholderTextColor={Colors.gray}
              value={formData.nomeFantasia}
              onChangeText={v => handleChange('nomeFantasia', v)}
            />
            {renderError('nomeFantasia')}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={getInputStyle('email')}
              placeholder="email@empresa.com"
              placeholderTextColor={Colors.gray}
              value={formData.email}
              onChangeText={v => handleChange('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {renderError('email')}

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={getInputStyle('telefone')}
              placeholder="(00) 00000-0000"
              placeholderTextColor={Colors.gray}
              value={formData.telefone}
              onChangeText={v => handleChange('telefone', v)}
              keyboardType="phone-pad"
              maxLength={15}
            />
            {renderError('telefone')}
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Endereço</Text>

            <Text style={styles.label}>CEP</Text>
            <TextInput
              style={getInputStyle('cep')}
              placeholder="00000-000"
              placeholderTextColor={Colors.gray}
              value={formData.cep}
              onChangeText={v => handleChange('cep', v)}
              keyboardType="numeric"
              maxLength={9}
            />
            {renderError('cep')}

            <View style={styles.row}>
              <View style={styles.flex3}>
                <Text style={styles.label}>Logradouro</Text>
                <TextInput
                  style={getInputStyle('logradouro')}
                  placeholder="Rua, Av..."
                  placeholderTextColor={Colors.gray}
                  value={formData.logradouro}
                  onChangeText={v => handleChange('logradouro', v)}
                />
                {renderError('logradouro')}
              </View>
              <View style={styles.flex1}>
                <Text style={styles.label}>Número</Text>
                <TextInput
                  style={getInputStyle('numero')}
                  placeholder="Nº"
                  placeholderTextColor={Colors.gray}
                  value={formData.numero}
                  onChangeText={v => handleChange('numero', v)}
                  keyboardType="numeric"
                />
                {renderError('numero')}
              </View>
            </View>

            <Text style={styles.label}>Bairro</Text>
            <TextInput
              style={getInputStyle('bairro')}
              placeholder="Bairro"
              placeholderTextColor={Colors.gray}
              value={formData.bairro}
              onChangeText={v => handleChange('bairro', v)}
            />
            {renderError('bairro')}

            <View style={styles.row}>
              <View style={styles.flex2}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput
                  style={getInputStyle('cidade')}
                  placeholder="Cidade"
                  placeholderTextColor={Colors.gray}
                  value={formData.cidade}
                  onChangeText={v => handleChange('cidade', v)}
                />
                {renderError('cidade')}
              </View>
              <View style={styles.flex1}>
                <Text style={styles.label}>UF</Text>
                <TextInput
                  style={getInputStyle('uf')}
                  placeholder="UF"
                  placeholderTextColor={Colors.gray}
                  value={formData.uf}
                  onChangeText={v => handleChange('uf', v)}
                  maxLength={2}
                  autoCapitalize="characters"
                />
                {renderError('uf')}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Próximo</Text>
            <Icon name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  stepIndicator: { alignItems: 'center', marginBottom: 16 },
  stepText: { fontSize: 13, color: Colors.white, marginBottom: 8, fontWeight: '500' },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 3,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
  },
  inputError: { borderColor: Colors.error, borderWidth: 1.5 },
  inputText: { fontSize: 15, color: Colors.text },
  errorText: { color: Colors.error, fontSize: 12, marginTop: 4, marginLeft: 2 },
  cnpjRow: { flexDirection: 'row', alignItems: 'center' },
  cnpjInput: { flex: 1 },
  checkIcon: { marginLeft: 8 },
  row: { flexDirection: 'row', gap: 12 },
  flex3: { flex: 3 },
  flex2: { flex: 2 },
  flex1: { flex: 1 },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default StepEmpresa;
