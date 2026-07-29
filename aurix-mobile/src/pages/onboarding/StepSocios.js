import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../constants/Colors';
import { validarCPF, formatarCPF } from '../../utils/validation';
import { onboardingService } from '../../services/onboardingService';

const QUALIFICACOES = ['Sócio-Administrador', 'Sócio', 'Diretor', 'Outro'];

const StepSocios = ({ navigation, route }) => {
  const { empresaData = {} } = route.params || {};
  const [socios, setSocios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [socioForm, setSocioForm] = useState({ cpf: '', nome: '', email: '', qualificacao: '' });
  const [socioErrors, setSocioErrors] = useState({});
  const [showQualPicker, setShowQualPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetSocioForm = () => {
    setSocioForm({ cpf: '', nome: '', email: '', qualificacao: '' });
    setSocioErrors({});
  };

  const handleSocioChange = (field, value) => {
    const formatted = field === 'cpf' ? formatarCPF(value) : value;
    setSocioForm(prev => ({ ...prev, [field]: formatted }));
    if (socioErrors[field]) setSocioErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateSocio = () => {
    const errors = {};
    if (!socioForm.cpf) errors.cpf = 'CPF é obrigatório';
    else if (!validarCPF(socioForm.cpf)) errors.cpf = 'CPF inválido';
    if (!socioForm.nome) errors.nome = 'Nome é obrigatório';
    if (!socioForm.email) errors.email = 'Email é obrigatório';
    if (!socioForm.qualificacao) errors.qualificacao = 'Selecione a qualificação';
    setSocioErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addSocio = () => {
    if (!validateSocio()) return;
    setSocios(prev => [...prev, { ...socioForm }]);
    setModalVisible(false);
    resetSocioForm();
  };

  const removeSocio = (index) => {
    setSocios(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (socios.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos um sócio.');
      return;
    }
    setLoading(true);
    try {
      const dados = {
        cnpj: (empresaData.cnpj || '').replace(/\D/g, ''),
        razaoSocial: empresaData.razaoSocial || '',
        nomeFantasia: empresaData.nomeFantasia || '',
        email: empresaData.email || '',
        telefone: (empresaData.telefone || '').replace(/\D/g, ''),
        endereco: {
          cep: (empresaData.cep || '').replace(/\D/g, ''),
          logradouro: empresaData.logradouro,
          numero: empresaData.numero,
          bairro: empresaData.bairro,
          cidade: empresaData.cidade,
          uf: empresaData.uf,
        },
        socios: socios.map(s => ({
          cpf: s.cpf.replace(/\D/g, ''),
          nome: s.nome,
          email: s.email,
          qualificacao: s.qualificacao,
        })),
      };
      const response = await onboardingService.criarSolicitacaoPJ(dados);
      const socioNames = socios.map((s) => s.nome);
      navigation.replace('StepDocumentosPJ', {
        solicitacaoId: response.id,
        socios: socioNames,
      });
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={Colors.gradientPrimary} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Passo 2 de 2</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sócios</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  resetSocioForm();
                  setModalVisible(true);
                }}
              >
                <Icon name="person-add" size={20} color={Colors.white} />
                <Text style={styles.addButtonText}>Adicionar Sócio</Text>
              </TouchableOpacity>
            </View>

            {socios.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum sócio adicionado ainda.</Text>
            ) : (
              socios.map((socio, index) => (
                <View key={index} style={styles.socioCard}>
                  <View style={styles.socioInfo}>
                    <Icon name="person" size={24} color={Colors.primary} />
                    <View style={styles.socioDetails}>
                      <Text style={styles.socioName}>{socio.nome}</Text>
                      <Text style={styles.socioDetail}>{socio.cpf}</Text>
                      <Text style={styles.socioDetail}>{socio.qualificacao}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => removeSocio(index)}>
                    <Icon name="delete" size={22} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Icon name="send" size={20} color={Colors.white} style={styles.buttonIcon} />
            <Text style={styles.submitButtonText}>
              {loading ? 'Enviando...' : 'Revisar e Enviar'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Adicionar Sócio</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={[styles.input, socioErrors.cpf && styles.inputError]}
                placeholder="000.000.000-00"
                placeholderTextColor={Colors.gray}
                value={socioForm.cpf}
                onChangeText={v => handleSocioChange('cpf', v)}
                keyboardType="numeric"
                maxLength={14}
              />
              {socioErrors.cpf && <Text style={styles.errorText}>{socioErrors.cpf}</Text>}

              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={[styles.input, socioErrors.nome && styles.inputError]}
                placeholder="Nome completo"
                placeholderTextColor={Colors.gray}
                value={socioForm.nome}
                onChangeText={v => handleSocioChange('nome', v)}
              />
              {socioErrors.nome && <Text style={styles.errorText}>{socioErrors.nome}</Text>}

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, socioErrors.email && styles.inputError]}
                placeholder="email@exemplo.com"
                placeholderTextColor={Colors.gray}
                value={socioForm.email}
                onChangeText={v => handleSocioChange('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {socioErrors.email && <Text style={styles.errorText}>{socioErrors.email}</Text>}

              <Text style={styles.label}>Qualificação</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowQualPicker(!showQualPicker)}
              >
                <Text style={socioForm.qualificacao ? styles.inputText : styles.placeholderText}>
                  {socioForm.qualificacao || 'Selecione...'}
                </Text>
              </TouchableOpacity>
              {socioErrors.qualificacao && <Text style={styles.errorText}>{socioErrors.qualificacao}</Text>}
              {showQualPicker && (
                <View style={styles.pickerContainer}>
                  {QUALIFICACOES.map(q => (
                    <TouchableOpacity
                      key={q}
                      style={[styles.pickerItem, socioForm.qualificacao === q && styles.pickerItemSelected]}
                      onPress={() => {
                        handleSocioChange('qualificacao', q);
                        setShowQualPicker(false);
                      }}
                    >
                      <Text style={[styles.pickerItemText, socioForm.qualificacao === q && styles.pickerItemTextSelected]}>
                        {q}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.modalAddButton} onPress={addSocio}>
                <Text style={styles.modalAddButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.white, borderRadius: 3 },
  sectionCard: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 20,
    marginBottom: 16, elevation: 4, shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  addButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
  },
  addButtonText: { color: Colors.white, fontSize: 13, fontWeight: 'bold', marginLeft: 6 },
  emptyText: { textAlign: 'center', color: Colors.textSecondary, fontSize: 14, paddingVertical: 20 },
  socioCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.lightGray, borderRadius: 12, padding: 14, marginBottom: 10,
  },
  socioInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  socioDetails: { marginLeft: 12, flex: 1 },
  socioName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  socioDetail: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  submitButton: {
    backgroundColor: Colors.success, borderRadius: 14, height: 54,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 8, elevation: 4, shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5,
  },
  submitButtonDisabled: { backgroundColor: Colors.gray },
  buttonIcon: { marginRight: 8 },
  submitButtonText: { color: Colors.white, fontSize: 17, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1, backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '80%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  label: {
    fontSize: 13, color: Colors.textSecondary, marginBottom: 4, marginTop: 12, fontWeight: '500',
  },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingHorizontal: 14, height: 48, fontSize: 15, color: Colors.text,
    backgroundColor: Colors.lightGray, justifyContent: 'center',
  },
  inputError: { borderColor: Colors.error, borderWidth: 1.5 },
  inputText: { fontSize: 15, color: Colors.text },
  placeholderText: { fontSize: 15, color: Colors.gray },
  errorText: { color: Colors.error, fontSize: 12, marginTop: 4, marginLeft: 2 },
  pickerContainer: {
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 10, marginTop: 4,
  },
  pickerItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  pickerItemSelected: { backgroundColor: Colors.lightGray },
  pickerItemText: { fontSize: 15, color: Colors.text },
  pickerItemTextSelected: { fontWeight: 'bold', color: Colors.primary },
  modalAddButton: {
    backgroundColor: Colors.primary, borderRadius: 12, height: 50,
    justifyContent: 'center', alignItems: 'center', marginTop: 20,
  },
  modalAddButtonText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});

export default StepSocios;
