import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const PIXScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('enviar');
  const [formData, setFormData] = useState({
    chave: '',
    valor: '',
    descricao: '',
    tipoChave: 'cpf',
  });
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState(false);

  const pixTypes = [
    { id: 'enviar', title: 'Enviar PIX', icon: 'send' },
    { id: 'receber', title: 'Receber PIX', icon: 'call-received' },
    { id: 'historico', title: 'Histórico', icon: 'history' },
    { id: 'chaves', title: 'Minhas Chaves', icon: 'vpn-key' },
  ];

  const chaveTypes = [
    { id: 'cpf', label: 'CPF', placeholder: '000.000.000-00' },
    { id: 'email', label: 'E-mail', placeholder: 'usuario@email.com' },
    { id: 'telefone', label: 'Telefone', placeholder: '(11) 99999-9999' },
    { id: 'aleatoria', label: 'Chave Aleatória', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
  ];

  const handleInputChange = (field, value) => {
    if (field === 'chave') {
      let formatted = value;
      
      switch (formData.tipoChave) {
        case 'cpf':
          formatted = value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .substr(0, 14);
          break;
        case 'telefone':
          formatted = value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .substr(0, 15);
          break;
        default:
          formatted = value;
      }
      
      setFormData({ ...formData, [field]: formatted });
    } else if (field === 'valor') {
      // Format currency
      const numericValue = value.replace(/\D/g, '');
      const formatted = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      setFormData({ ...formData, [field]: formatted });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSendPIX = async () => {
    if (!formData.chave || !formData.valor) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Simulate PIX sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'PIX Enviado!',
        `PIX de ${formData.valor} enviado com sucesso para ${formData.chave}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({ chave: '', valor: '', descricao: '', tipoChave: 'cpf' });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar PIX. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleQRCodeRead = (e) => {
    setShowQRScanner(false);
    setFormData({ ...formData, chave: e.data });
    Alert.alert('QR Code Lido', `Chave PIX: ${e.data}`);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'enviar':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Enviar PIX</Text>
            
            {/* Tipo de Chave */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo de Chave</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {chaveTypes.map(type => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.chaveTypeButton,
                      formData.tipoChave === type.id && styles.chaveTypeButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, tipoChave: type.id })}
                  >
                    <Text style={[
                      styles.chaveTypeText,
                      formData.tipoChave === type.id && styles.chaveTypeTextActive
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Chave PIX */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Chave PIX</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={chaveTypes.find(t => t.id === formData.tipoChave)?.placeholder}
                  value={formData.chave}
                  onChangeText={(value) => handleInputChange('chave', value)}
                  keyboardType={formData.tipoChave === 'cpf' || formData.tipoChave === 'telefone' ? 'numeric' : 'default'}
                />
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => setShowQRScanner(true)}
                >
                  <Icon name="qr-code-scanner" size={24} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Valor */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Valor</Text>
              <TextInput
                style={styles.input}
                placeholder="R$ 0,00"
                value={formData.valor}
                onChangeText={(value) => handleInputChange('valor', value)}
                keyboardType="numeric"
              />
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descrição do PIX"
                value={formData.descricao}
                onChangeText={(value) => handleInputChange('descricao', value)}
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              style={[styles.sendButton, loading && styles.sendButtonDisabled]}
              onPress={handleSendPIX}
              disabled={loading}
            >
              <Text style={styles.sendButtonText}>
                {loading ? 'Enviando...' : 'Enviar PIX'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'receber':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Receber PIX</Text>
            
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCodePlaceholder}>
                <Icon name="qr-code" size={80} color={Colors.primary} />
                <Text style={styles.qrCodeText}>QR Code PIX</Text>
                <Text style={styles.qrCodeSubtext}>Escaneie para receber PIX</Text>
              </View>
            </View>

            <View style={styles.chaveInfo}>
              <Text style={styles.chaveLabel}>Sua chave PIX:</Text>
              <Text style={styles.chaveValue}>123.456.789-00</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Icon name="content-copy" size={20} color={Colors.primary} />
                <Text style={styles.copyButtonText}>Copiar</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'historico':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Histórico PIX</Text>
            
            <View style={styles.historyList}>
              {[
                { id: 1, tipo: 'Enviado', valor: -250.00, chave: 'maria@email.com', data: '15/01/2024 14:30' },
                { id: 2, tipo: 'Recebido', valor: 500.00, chave: 'joao@email.com', data: '15/01/2024 10:15' },
                { id: 3, tipo: 'Enviado', valor: -100.00, chave: '123.456.789-00', data: '14/01/2024 16:45' },
              ].map(item => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyIcon}>
                    <Icon 
                      name={item.tipo === 'Enviado' ? 'send' : 'call-received'} 
                      size={20} 
                      color={item.tipo === 'Enviado' ? Colors.error : Colors.success} 
                    />
                  </View>
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyType}>{item.tipo}</Text>
                    <Text style={styles.historyKey}>{item.chave}</Text>
                    <Text style={styles.historyDate}>{item.data}</Text>
                  </View>
                  <Text style={[
                    styles.historyValue,
                    { color: item.valor > 0 ? Colors.success : Colors.error }
                  ]}>
                    {item.valor > 0 ? '+' : ''}{formatCurrency(Math.abs(item.valor))}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'chaves':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Minhas Chaves PIX</Text>
            
            <View style={styles.chavesList}>
              {[
                { id: 1, tipo: 'CPF', valor: '123.456.789-00', ativa: true },
                { id: 2, tipo: 'E-mail', valor: 'joao@aurix.com.br', ativa: true },
                { id: 3, tipo: 'Telefone', valor: '(11) 99999-9999', ativa: false },
              ].map(chave => (
                <View key={chave.id} style={styles.chaveItem}>
                  <View style={styles.chaveInfo}>
                    <Text style={styles.chaveTipo}>{chave.tipo}</Text>
                    <Text style={styles.chaveValor}>{chave.valor}</Text>
                  </View>
                  <View style={styles.chaveActions}>
                    <View style={[
                      styles.statusIndicator,
                      { backgroundColor: chave.ativa ? Colors.success : Colors.gray }
                    ]} />
                    <TouchableOpacity style={styles.chaveButton}>
                      <Icon name="more-vert" size={20} color={Colors.gray} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.addChaveButton}>
              <Icon name="add" size={24} color={Colors.primary} />
              <Text style={styles.addChaveText}>Adicionar Chave PIX</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={Colors.gradientPIX} style={styles.header}>
        <Text style={styles.headerTitle}>PIX</Text>
        <Text style={styles.headerSubtitle}>Transferências Instantâneas</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {pixTypes.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon 
                name={tab.icon} 
                size={20} 
                color={activeTab === tab.id ? Colors.white : Colors.gray} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView style={styles.scrollContent}>
          {renderTabContent()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* QR Code Scanner Modal */}
      <Modal
        visible={showQRScanner}
        animationType="slide"
        onRequestClose={() => setShowQRScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <QRCodeScanner
            onRead={handleQRCodeRead}
            topContent={
              <Text style={styles.scannerTitle}>Escaneie o QR Code PIX</Text>
            }
            bottomContent={
              <TouchableOpacity
                style={styles.scannerButton}
                onPress={() => setShowQRScanner(false)}
              >
                <Text style={styles.scannerButtonText}>Cancelar</Text>
              </TouchableOpacity>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    marginTop: 5,
  },
  tabsContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: Colors.pixGreen,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray,
  },
  tabTextActive: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  qrButton: {
    padding: 10,
  },
  chaveTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginRight: 10,
    backgroundColor: Colors.white,
  },
  chaveTypeButtonActive: {
    backgroundColor: Colors.pixGreen,
    borderColor: Colors.pixGreen,
  },
  chaveTypeText: {
    fontSize: 14,
    color: Colors.gray,
  },
  chaveTypeTextActive: {
    color: Colors.white,
  },
  sendButton: {
    backgroundColor: Colors.pixGreen,
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: Colors.pixGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: Colors.white,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  qrCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 10,
  },
  qrCodeSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  chaveInfo: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chaveLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  chaveValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
  },
  copyButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  historyList: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyDetails: {
    flex: 1,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  historyKey: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginVertical: 2,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  historyValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chavesList: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chaveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  chaveInfo: {
    flex: 1,
  },
  chaveTipo: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  chaveValor: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginTop: 2,
  },
  chaveActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  chaveButton: {
    padding: 5,
  },
  addChaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addChaveText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  scannerButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  scannerButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PIXScreen;
