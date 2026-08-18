import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Colors } from '../../constants/Colors';
import apiService from '../../services/apiService';
import { criarDeepLink } from '../../utils/deepLinks';

const { width } = Dimensions.get('window');

const PixQRCodeScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('gerar');
  const [payload, setPayload] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [txid, setTxid] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [confirmacaoPagamento, setConfirmacaoPagamento] = useState(null);

  const valorParam = route?.params?.valor || '';
  const prazoParam = route?.params?.prazo || '';

  React.useEffect(() => {
    if (valorParam) setValor(valorParam);
  }, [valorParam]);

  const gerarQRCode = async () => {
    if (!chavePix) {
      Alert.alert('Erro', 'Informe a chave PIX');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.getQrCodePix({
        chavePix,
        valor: valor ? parseFloat(valor) : undefined,
        descricao,
        txid: txid || undefined,
      });

      setQrCodeUrl(response.qrCodeUrl || '');
      setPayload(response.payload || '');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao gerar QR Code PIX');
    } finally {
      setLoading(false);
    }
  };

  const copiarPayload = async () => {
    const textoCopiar = payload || scannedData;
    if (!textoCopiar) {
      Alert.alert('Erro', 'Nenhum payload para copiar');
      return;
    }
    try {
      await Clipboard.setString(textoCopiar);
      Alert.alert('Sucesso', 'Payload copiado!');
    } catch {
      Alert.alert('Erro', 'Falha ao copiar payload');
    }
  };

  const handleQRCodeRead = async (data) => {
    setShowScanner(false);
    setScannedData(data);

    try {
      const response = await apiService.lerQrCodePix({ qrCode: data });
      setConfirmacaoPagamento({
        valor: response.valor,
        destinatario: response.destinatario,
        descricao: response.descricao,
        payload: data,
      });
    } catch {
      setConfirmacaoPagamento({
        valor: null,
        destinatario: null,
        descricao: null,
        payload: data,
      });
    }
  };

  const confirmarPagamento = async () => {
    if (!confirmacaoPagamento) return;

    setLoading(true);
    try {
      await apiService.enviarPix({
        payload: confirmacaoPagamento.payload,
        valor: confirmacaoPagamento.valor,
      });

      Alert.alert(
        'Pagamento Confirmado!',
        `PIX de ${formatarMoeda(confirmacaoPagamento.valor)} realizado com sucesso.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setConfirmacaoPagamento(null);
              setScannedData('');
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao processar pagamento PIX');
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valorNumerico) => {
    if (!valorNumerico) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valorNumerico);
  };

  const formatarChave = (chave) => {
    if (!chave) return '';
    if (chave.length === 11) {
      return chave.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return chave;
  };

  const compartilharDeepLink = () => {
    if (!payload) return;
    const deepLink = criarDeepLink('PIX_QR_CODE', { payload });
    Alert.alert('Deep Link', deepLink || 'Não foi possível gerar o deep link');
  };

  const renderTabGerar = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Gerar QR Code PIX</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Chave PIX *</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe sua chave PIX"
          value={chavePix}
          onChangeText={setChavePix}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Valor (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Descrição (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descrição do pagamento"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>TX ID (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Identificador da transação"
          value={txid}
          onChangeText={setTxid}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={gerarQRCode}
        disabled={loading || !chavePix}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            <Icon name="qr-code" size={20} color={Colors.white} />
            <Text style={styles.primaryButtonText}>Gerar QR Code</Text>
          </>
        )}
      </TouchableOpacity>

      {qrCodeUrl ? (
        <View style={styles.qrCodeResult}>
          <Text style={styles.qrCodeLabel}>QR Code Gerado</Text>
          <View style={styles.qrCodeContainer}>
            <View style={styles.qrCodeFrame}>
              <Icon name="qr-code" size={160} color={Colors.text} />
              <Text style={styles.qrCodeInfo}>QR Code PIX</Text>
            </View>
          </View>

          {payload ? (
            <View style={styles.payloadContainer}>
              <Text style={styles.payloadLabel}>Payload (Copia e Cola):</Text>
              <Text style={styles.payloadText} numberOfLines={3}>
                {payload}
              </Text>
            </View>
          ) : null}

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={copiarPayload}>
              <Icon name="content-copy" size={18} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>Copiar Payload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={compartilharDeepLink}>
              <Icon name="share" size={18} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );

  const renderTabLer = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Ler QR Code PIX</Text>

      <TouchableOpacity
        style={styles.scannerButton}
        onPress={() => setShowScanner(true)}
      >
        <Icon name="qr-code-scanner" size={60} color={Colors.pixGreen} />
        <Text style={styles.scannerButtonText}>Toque para escanear</Text>
        <Text style={styles.scannerHint}>Aponte a câmera para o QR Code</Text>
      </TouchableOpacity>

      <View style={styles.manualSection}>
        <Text style={styles.inputLabel}>Ou insira o código manualmente</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Cole o payload PIX (copia e cola)"
          value={scannedData}
          onChangeText={setScannedData}
          multiline
          numberOfLines={4}
        />

        {scannedData ? (
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={async () => {
              setLoading(true);
              try {
                const response = await apiService.lerQrCodePix({ qrCode: scannedData });
                setConfirmacaoPagamento({
                  valor: response.valor,
                  destinatario: response.destinatario,
                  descricao: response.descricao,
                  payload: scannedData,
                });
              } catch {
                setConfirmacaoPagamento({
                  valor: null,
                  destinatario: null,
                  descricao: null,
                  payload: scannedData,
                });
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || !scannedData}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Icon name="search" size={20} color={Colors.white} />
                <Text style={styles.primaryButtonText}>Validar Código</Text>
              </>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientPIX} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Code PIX</Text>
        <Text style={styles.headerSubtitle}>Gerar ou escanear</Text>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'gerar' && styles.tabActive]}
          onPress={() => setActiveTab('gerar')}
        >
          <Icon
            name="qr-code"
            size={20}
            color={activeTab === 'gerar' ? Colors.white : Colors.gray}
          />
          <Text style={[styles.tabText, activeTab === 'gerar' && styles.tabTextActive]}>
            Gerar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ler' && styles.tabActive]}
          onPress={() => setActiveTab('ler')}
        >
          <Icon
            name="qr-code-scanner"
            size={20}
            color={activeTab === 'ler' ? Colors.white : Colors.gray}
          />
          <Text style={[styles.tabText, activeTab === 'ler' && styles.tabTextActive]}>
            Ler
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'gerar' ? renderTabGerar() : renderTabLer()}
      </ScrollView>

      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <Text style={styles.scannerTitle}>Escanear QR Code</Text>
            <TouchableOpacity onPress={() => setShowScanner(false)}>
              <Icon name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.scannerBody}>
            <View style={styles.scannerFrame}>
              <Icon name="qr-code-scanner" size={100} color={Colors.pixGreen} />
              <Text style={styles.scannerInstruction}>
                Posicione o QR Code dentro da moldura
              </Text>
            </View>
            <TouchableOpacity
              style={styles.scannerSimulateButton}
              onPress={() => {
                setShowScanner(false);
                setScannedData('00020126580014BR.GOV.BCB.PIX0136example@pix.com.br52040000530398654041.005802BR5913Aurix Bank6009SAO PAULO62070503***6304ABCD');
                Alert.alert('Simulação', 'QR Code simulado escaneado com sucesso!');
              }}
            >
              <Icon name="play-circle-outline" size={20} color={Colors.white} />
              <Text style={styles.scannerSimulateText}>Simular leitura</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!confirmacaoPagamento}
        animationType="slide"
        onRequestClose={() => setConfirmacaoPagamento(null)}
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationCard}>
            <Icon name="payment" size={48} color={Colors.pixGreen} />
            <Text style={styles.confirmationTitle}>Confirmar Pagamento</Text>

            {confirmacaoPagamento?.destinatario && (
              <View style={styles.confirmationInfo}>
                <Text style={styles.confirmationLabel}>Destinatário</Text>
                <Text style={styles.confirmationValue}>
                  {confirmacaoPagamento.destinatario}
                </Text>
              </View>
            )}

            <View style={styles.confirmationInfo}>
              <Text style={styles.confirmationLabel}>Valor</Text>
              <Text style={styles.confirmationAmount}>
                {formatarMoeda(confirmacaoPagamento?.valor)}
              </Text>
            </View>

            {confirmacaoPagamento?.descricao && (
              <View style={styles.confirmationInfo}>
                <Text style={styles.confirmationLabel}>Descrição</Text>
                <Text style={styles.confirmationValue}>
                  {confirmacaoPagamento.descricao}
                </Text>
              </View>
            )}

            <View style={styles.confirmationActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmacaoPagamento(null)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, loading && styles.buttonDisabled]}
                onPress={confirmarPagamento}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirmar PIX</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
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
    paddingTop: 48,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginLeft: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 8,
    marginHorizontal: 16,
    marginTop: -15,
    borderRadius: 12,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  tabActive: {
    backgroundColor: Colors.pixGreen,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray,
  },
  tabTextActive: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  tabContent: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: Colors.white,
    color: Colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.pixGreen,
    borderRadius: 12,
    padding: 16,
    gap: 10,
    elevation: 3,
    shadowColor: Colors.pixGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: Colors.gray,
    elevation: 0,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 12,
    gap: 8,
    flex: 1,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  qrCodeResult: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    gap: 16,
  },
  qrCodeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  qrCodeContainer: {
    alignItems: 'center',
  },
  qrCodeFrame: {
    width: 200,
    height: 200,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.pixGreen,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  qrCodeInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  payloadContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  payloadLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  payloadText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: Colors.text,
    lineHeight: 16,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  scannerButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 12,
  },
  scannerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scannerHint: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  manualSection: {
    gap: 12,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 48,
  },
  scannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  scannerBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scannerFrame: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: Colors.pixGreen,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  scannerInstruction: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  scannerSimulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.pixGreen,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 10,
  },
  scannerSimulateText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    gap: 16,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  confirmationInfo: {
    alignItems: 'center',
    width: '100%',
  },
  confirmationLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  confirmationValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  confirmationAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.pixGreen,
  },
  confirmationActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.pixGreen,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PixQRCodeScreen;
