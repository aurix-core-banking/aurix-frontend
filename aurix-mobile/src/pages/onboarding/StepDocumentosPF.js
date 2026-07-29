import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Alert, ActivityIndicator,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Colors } from '../../constants/Colors';
import { onboardingService } from '../../services/onboardingService';

const DOCS_REQUIRED = [
  { key: 'RG', label: 'Documento de Identidade (RG/CNH)' },
  { key: 'CPF', label: 'CPF' },
  { key: 'COMPROVANTE_ENDERECO', label: 'Comprovante de Endereço' },
  { key: 'COMPROVANTE_RENDA', label: 'Comprovante de Renda' },
];

export const StepDocumentosPF = ({ route, navigation }) => {
  const { solicitacaoId } = route.params;
  const [documents, setDocuments] = useState({});
  const [uploading, setUploading] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const pickImage = useCallback(async (docKey, useCamera) => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.7,
    };
    const result = useCamera
      ? await launchCamera(options)
      : await launchImageLibrary(options);
    if (result.didCancel || result.errorCode) return;
    const asset = result.assets[0];
    setDocuments((prev) => ({
      ...prev,
      [docKey]: {
        base64: asset.base64,
        uri: asset.uri,
        fileName: `${docKey}_${Date.now()}.jpg`,
      },
    }));
  }, []);

  const removeDocument = (docKey) => {
    setDocuments((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const docKeys = Object.keys(documents);
    let success = 0;
    for (const key of docKeys) {
      setUploading((prev) => ({ ...prev, [key]: true }));
      try {
        await onboardingService.uploadDocumento(
          solicitacaoId,
          key,
          documents[key].fileName,
          documents[key].base64,
          'PF'
        );
        success++;
      } catch (e) {
        Alert.alert('Erro', `Falha ao enviar ${key}: ${e.message}`);
      }
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
    setSubmitting(false);
    if (success > 0) {
      navigation.replace('SuccessScreen', { protocolo: `DOCS-${solicitacaoId}` });
    }
  };

  const allUploaded = DOCS_REQUIRED.every((d) => documents[d.key]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Envio de Documentos</Text>
      <Text style={styles.subtitle}>Anexe os documentos necessários para análise</Text>

      {DOCS_REQUIRED.map((doc) => (
        <View key={doc.key} style={styles.docItem}>
          <Text style={styles.docLabel}>{doc.label}</Text>
          {documents[doc.key] ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: documents[doc.key].uri }} style={styles.preview} />
              <View style={styles.previewActions}>
                <TouchableOpacity onPress={() => pickImage(doc.key, true)} style={styles.smallBtn}>
                  <Text style={styles.smallBtnText}>Recapturar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeDocument(doc.key)} style={styles.removeBtn}>
                  <Text style={styles.removeBtnText}>Remover</Text>
                </TouchableOpacity>
              </View>
              {uploading[doc.key] && <ActivityIndicator size="small" color={Colors.primary} />}
            </View>
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => pickImage(doc.key, true)} style={styles.captureBtn}>
                <Text style={styles.btnText}>📷 Capturar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickImage(doc.key, false)} style={styles.galleryBtn}>
                <Text style={styles.btnText}>🖼 Galeria</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.submitBtn, (!allUploaded || submitting) && styles.disabledBtn]}
        onPress={handleSubmit}
        disabled={!allUploaded || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>Enviar Documentos</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.gray, marginBottom: 24 },
  docItem: { backgroundColor: Colors.surface, borderRadius: 8, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  docLabel: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12 },
  captureBtn: { flex: 1, backgroundColor: Colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  galleryBtn: { flex: 1, backgroundColor: Colors.gray, padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  previewContainer: { alignItems: 'center' },
  preview: { width: '100%', height: 160, borderRadius: 8, marginBottom: 8, resizeMode: 'cover' },
  previewActions: { flexDirection: 'row', gap: 12 },
  smallBtn: { backgroundColor: Colors.primary, padding: 8, borderRadius: 6 },
  smallBtnText: { color: '#fff', fontSize: 13 },
  removeBtn: { backgroundColor: Colors.error, padding: 8, borderRadius: 6 },
  removeBtnText: { color: '#fff', fontSize: 13 },
  submitBtn: { backgroundColor: Colors.success, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  disabledBtn: { opacity: 0.5 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
