import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import apiService from '../services/apiService';

const QRCodeScannerScreen = ({ navigation }) => {
  const [qrCode, setQrCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProcessarPix = async () => {
    const code = qrCode || manualCode;
    if (!code) {
      Alert.alert('Erro', 'Leia um QR Code ou informe o código manualmente');
      return;
    }
    setLoading(true);
    try {
      const result = await apiService.receberPix({ qrCode: code });
      Alert.alert('Sucesso', `Pagamento de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.valor)} para ${result.destinatario || 'destinatário'}`);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao processar QR Code PIX');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientPIX} style={styles.header}>
        <Text style={styles.headerTitle}>Ler QR Code</Text>
        <Text style={styles.headerSubtitle}>PIX</Text>
      </LinearGradient>

      <View style={styles.scannerArea}>
        <View style={styles.scannerPlaceholder}>
          <Icon name="qr-code-scanner" size={80} color={Colors.pixGreen} />
          <Text style={styles.scannerText}>Aponte a câmera para o QR Code</Text>
          <Text style={styles.scannerHint}>O scanner será ativado em breve</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.manualToggle} onPress={() => setShowManual(!showManual)}>
        <Icon name="edit" size={20} color={Colors.primary} />
        <Text style={styles.manualToggleText}>Inserir código manualmente</Text>
      </TouchableOpacity>

      {showManual && (
        <View style={styles.manualInput}>
          <TextInput
            style={styles.input}
            placeholder="Cole o código PIX (copia e cola)"
            value={manualCode}
            onChangeText={setManualCode}
            multiline
          />
        </View>
      )}

      <TouchableOpacity style={styles.pagarButton} onPress={handleProcessarPix} disabled={loading}>
        <Icon name="pix" size={24} color={Colors.white} />
        <Text style={styles.pagarText}>{loading ? 'Processando...' : 'Pagar com PIX'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 48, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  headerSubtitle: { fontSize: 14, color: Colors.white, opacity: 0.8, marginTop: 4 },
  scannerArea: { margin: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.surface, elevation: 2 },
  scannerPlaceholder: { height: 280, alignItems: 'center', justifyContent: 'center', padding: 24 },
  scannerText: { fontSize: 16, color: Colors.textSecondary, marginTop: 16, textAlign: 'center' },
  scannerHint: { fontSize: 13, color: Colors.gray, marginTop: 8, textAlign: 'center' },
  manualToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12 },
  manualToggleText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  manualInput: { padding: 16 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 14, fontSize: 14, backgroundColor: Colors.surface, minHeight: 80, textAlignVertical: 'top' },
  pagarButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.pixGreen, margin: 16, borderRadius: 12, padding: 18 },
  pagarText: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
});

export default QRCodeScannerScreen;