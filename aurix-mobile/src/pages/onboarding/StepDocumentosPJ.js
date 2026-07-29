import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Alert, ActivityIndicator,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Colors } from '../../constants/Colors';
import { onboardingService } from '../../services/onboardingService';

const COMPANY_DOCS = [
  { key: 'CONTRATO_SOCIAL', label: 'Contrato Social' },
  { key: 'CNPJ', label: 'Cartão CNPJ' },
  { key: 'BALANCO_PATRIMONIAL', label: 'Balanço Patrimonial' },
];

const PARTNER_DOCS = [
  { key: 'IDENTIDADE_SOCIO', label: 'Documento de Identidade' },
  { key: 'CPF', label: 'CPF' },
];

export const StepDocumentosPJ = ({ route, navigation }) => {
  const { solicitacaoId, socios } = route.params;
  const [documents, setDocuments] = useState({});
  const [uploading, setUploading] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const pickImage = useCallback(async (sectionId, docKey, useCamera) => {
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
      [`${sectionId}_${docKey}`]: {
        base64: asset.base64,
        uri: asset.uri,
        fileName: `${docKey}_${Date.now()}.jpg`,
        sectionId,
        docKey,
      },
    }));
  }, []);

  const removeDocument = (id) => {
    setDocuments((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const entries = Object.entries(documents);
    let success = 0;
    for (const [id, doc] of entries) {
      setUploading((prev) => ({ ...prev, [id]: true }));
      try {
        await onboardingService.uploadDocumento(
          solicitacaoId,
          doc.docKey,
          doc.fileName,
          doc.base64,
          'PJ'
        );
        success++;
      } catch (e) {
        Alert.alert('Erro', `Falha ao enviar ${doc.docKey}: ${e.message}`);
      }
      setUploading((prev) => ({ ...prev, [id]: false }));
    }
    setSubmitting(false);
    if (success > 0) {
      navigation.replace('SuccessScreen', { protocolo: `DOCS-${solicitacaoId}` });
    }
  };

  const renderDocItem = (sectionId, docKey, label) => {
    const docId = `${sectionId}_${docKey}`;
    const doc = documents[docId];
    return (
      <View key={docId} style={styles.docItem}>
        <Text style={styles.docLabel}>{label}</Text>
        {doc ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: doc.uri }} style={styles.preview} />
            <View style={styles.previewActions}>
              <TouchableOpacity onPress={() => pickImage(sectionId, docKey, true)} style={styles.smallBtn}>
                <Text style={styles.smallBtnText}>Recapturar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeDocument(docId)} style={styles.removeBtn}>
                <Text style={styles.removeBtnText}>Remover</Text>
              </TouchableOpacity>
            </View>
            {uploading[docId] && <ActivityIndicator size="small" color={Colors.primary} />}
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => pickImage(sectionId, docKey, true)} style={styles.captureBtn}>
              <Text style={styles.btnText}>📷 Capturar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage(sectionId, docKey, false)} style={styles.galleryBtn}>
              <Text style={styles.btnText}>🖼 Galeria</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const sections = [
    { title: 'Documentos da Empresa', data: COMPANY_DOCS, sectionId: 'empresa' },
    ...(socios || []).map((socio, idx) => ({
      title: `Sócio: ${socio}`,
      data: PARTNER_DOCS,
      sectionId: `socio_${idx}`,
    })),
  ];

  const totalDocKeys = sections.reduce((acc, section) => acc + section.data.length, 0);
  const allUploaded = Object.keys(documents).length === totalDocKeys;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Envio de Documentos</Text>
      <Text style={styles.subtitle}>Anexe os documentos da empresa e dos sócios</Text>

      {sections.map((section) => (
        <View key={section.sectionId} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.data.map((doc) => renderDocItem(section.sectionId, doc.key, doc.label))}
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
          <Text style={styles.submitBtnText}>Enviar Todos</Text>
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
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: 8 },
  docItem: { backgroundColor: Colors.surface, borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
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
