import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import apiService from '../services/apiService';

const TransferenciaScreen = ({ navigation }) => {
  const [form, setForm] = useState({ tipo: 'PIX', chave: '', valor: '', descricao: '' });
  const [loading, setLoading] = useState(false);

  const handleTransferir = async () => {
    if (!form.chave || !form.valor) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      if (form.tipo === 'PIX') {
        await apiService.enviarPix({ chaveDestino: form.chave, valor: parseFloat(form.valor), descricao: form.descricao });
      } else {
        await apiService.fazerTransferencia({ destino: form.chave, valor: parseFloat(form.valor), tipo: form.tipo, descricao: form.descricao });
      }
      Alert.alert('Sucesso', 'Transferência realizada com sucesso');
      setForm({ tipo: 'PIX', chave: '', valor: '', descricao: '' });
    } catch (err) {
      Alert.alert('Erro', 'Falha ao realizar transferência');
    } finally { setLoading(false); }
  };

  const tipos = [
    { value: 'PIX', label: 'PIX', icon: 'pix', color: Colors.pixGreen },
    { value: 'TED', label: 'TED', icon: 'account-balance', color: Colors.primary },
    { value: 'DOC', label: 'DOC', icon: 'description', color: Colors.secondary },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
        <Text style={styles.headerTitle}>Transferência</Text>
      </LinearGradient>
      <View style={styles.form}>
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.tipoRow}>
          {tipos.map(t => (
            <TouchableOpacity key={t.value} style={[styles.tipoButton, form.tipo === t.value && { backgroundColor: t.color }]}
              onPress={() => setForm({ ...form, tipo: t.value })}>
              <Icon name={t.icon} size={18} color={form.tipo === t.value ? Colors.white : t.color} />
              <Text style={[styles.tipoText, form.tipo === t.value && { color: Colors.white }]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>{form.tipo === 'PIX' ? 'Chave PIX' : 'Conta destino'}</Text>
        <TextInput style={styles.input} placeholder="Chave ou conta" value={form.chave} onChangeText={v => setForm({ ...form, chave: v })} />
        <Text style={styles.label}>Valor</Text>
        <TextInput style={styles.input} placeholder="R$ 0,00" keyboardType="decimal-pad" value={form.valor} onChangeText={v => setForm({ ...form, valor: v })} />
        <Text style={styles.label}>Descrição (opcional)</Text>
        <TextInput style={styles.input} placeholder="Ex: Pagamento aluguel" value={form.descricao} onChangeText={v => setForm({ ...form, descricao: v })} />
        <TouchableOpacity style={styles.transferirButton} onPress={handleTransferir} disabled={loading}>
          <Icon name="send" size={20} color={Colors.white} />
          <Text style={styles.transferirText}>{loading ? 'Enviando...' : 'Transferir'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 48, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, marginTop: 16 },
  tipoRow: { flexDirection: 'row', gap: 8 },
  tipoButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, flex: 1, justifyContent: 'center' },
  tipoText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 14, fontSize: 16, backgroundColor: Colors.surface },
  transferirButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.success, borderRadius: 8, padding: 16, marginTop: 24 },
  transferirText: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
});

export default TransferenciaScreen;