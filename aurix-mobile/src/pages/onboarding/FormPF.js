import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../../constants/Colors';
import {
  validarCPF,
  validarEmail,
  validarCEP,
  formatarCPF,
  formatarTelefone,
  formatarCEP,
  formatarMoeda,
} from '../../utils/validation';
import { onboardingService } from '../../services/onboardingService';

const FormPF = ({ navigation }) => {
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    dataNascimento: null,
    ocupacao: '',
    email: '',
    telefone: '',
    rendaDeclarada: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    let formatted = value;
    if (field === 'cpf') formatted = formatarCPF(value);
    else if (field === 'telefone') formatted = formatarTelefone(value);
    else if (field === 'cep') formatted = formatarCEP(value);
    else if (field === 'rendaDeclarada') formatted = formatarMoeda(value);

    setFormData(prev => ({ ...prev, [field]: formatted }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, dataNascimento: selectedDate }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
    else if (!validarCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória';
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

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const dados = {
        cpf: formData.cpf.replace(/\D/g, ''),
        nome: formData.nome,
        dataNascimento: formData.dataNascimento.toISOString().split('T')[0],
        ocupacao: formData.ocupacao,
        email: formData.email,
        telefone: formData.telefone.replace(/\D/g, ''),
        rendaDeclarada: parseFloat(formData.rendaDeclarada.replace(/\D/g, '')) / 100 || 0,
        endereco: {
          cep: formData.cep.replace(/\D/g, ''),
          logradouro: formData.logradouro,
          numero: formData.numero,
          bairro: formData.bairro,
          cidade: formData.cidade,
          uf: formData.uf,
        },
      };
      const response = await onboardingService.criarSolicitacaoPF(dados);
      navigation.replace('StepDocumentosPF', { solicitacaoId: response.id });
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>

            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={getInputStyle('cpf')}
              placeholder="000.000.000-00"
              placeholderTextColor={Colors.gray}
              value={formData.cpf}
              onChangeText={v => handleChange('cpf', v)}
              keyboardType="numeric"
              maxLength={14}
            />
            {renderError('cpf')}

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={getInputStyle('nome')}
              placeholder="Nome completo"
              placeholderTextColor={Colors.gray}
              value={formData.nome}
              onChangeText={v => handleChange('nome', v)}
            />
            {renderError('nome')}

            <Text style={styles.label}>Data de Nascimento</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={formData.dataNascimento ? styles.inputText : styles.placeholderText}>
                {formData.dataNascimento
                  ? formData.dataNascimento.toLocaleDateString('pt-BR')
                  : 'Selecione a data'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.dataNascimento || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Ocupação</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua ocupação"
              placeholderTextColor={Colors.gray}
              value={formData.ocupacao}
              onChangeText={v => handleChange('ocupacao', v)}
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Contato</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={getInputStyle('email')}
              placeholder="email@exemplo.com"
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
            <Text style={styles.sectionTitle}>Financeiro</Text>

            <Text style={styles.label}>Renda Declarada</Text>
            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              placeholderTextColor={Colors.gray}
              value={formData.rendaDeclarada}
              onChangeText={v => handleChange('rendaDeclarada', v)}
              keyboardType="numeric"
            />
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
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Icon name="send" size={20} color={Colors.white} style={styles.buttonIcon} />
            <Text style={styles.submitButtonText}>
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
  inputError: {
    borderColor: Colors.error,
    borderWidth: 1.5,
  },
  inputText: {
    fontSize: 15,
    color: Colors.text,
  },
  placeholderText: {
    fontSize: 15,
    color: Colors.gray,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex3: { flex: 3 },
  flex2: { flex: 2 },
  flex1: { flex: 1 },
  submitButton: {
    backgroundColor: Colors.success,
    borderRadius: 14,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default FormPF;
