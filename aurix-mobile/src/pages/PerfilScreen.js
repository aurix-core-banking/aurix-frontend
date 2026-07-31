import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import apiService from '../services/apiService';

const PerfilScreen = ({ navigation }) => {
  const [perfil, setPerfil] = useState({ nome: '', email: '', telefone: '', cpf: '' });
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [senhaForm, setSenhaForm] = useState({ atual: '', nova: '', confirmar: '' });

  useEffect(() => { loadPerfil(); }, []);

  const loadPerfil = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPerfil();
      setPerfil(data);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao carregar perfil');
    } finally { setLoading(false); }
  };

  const handleSalvar = async () => {
    try {
      await apiService.atualizarPerfil({ nome: perfil.nome, telefone: perfil.telefone });
      setEditando(false);
      Alert.alert('Sucesso', 'Perfil atualizado');
    } catch (err) {
      Alert.alert('Erro', 'Falha ao atualizar perfil');
    }
  };

  const handleAlterarSenha = async () => {
    if (senhaForm.nova !== senhaForm.confirmar) {
      Alert.alert('Erro', 'Senhas não conferem');
      return;
    }
    try {
      await apiService.alterarSenha({ senhaAtual: senhaForm.atual, novaSenha: senhaForm.nova });
      Alert.alert('Sucesso', 'Senha alterada com sucesso');
      setShowSenha(false);
      setSenhaForm({ atual: '', nova: '', confirmar: '' });
    } catch (err) {
      Alert.alert('Erro', 'Falha ao alterar senha');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="person" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.headerTitle}>{perfil.nome || 'Meu Perfil'}</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={perfil.nome} editable={editando} onChangeText={v => setPerfil({ ...perfil, nome: v })} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={perfil.email} editable={false} />

        <Text style={styles.label}>CPF</Text>
        <TextInput style={styles.input} value={perfil.cpf} editable={false} />

        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} value={perfil.telefone} editable={editando} keyboardType="phone-pad" onChangeText={v => setPerfil({ ...perfil, telefone: v })} />

        {editando ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => { setEditando(false); loadPerfil(); }}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setEditando(true)}>
            <Icon name="edit" size={18} color={Colors.white} />
            <Text style={styles.editText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.senhaButton} onPress={() => setShowSenha(!showSenha)}>
          <Icon name="lock" size={18} color={Colors.primary} />
          <Text style={styles.senhaText}>Alterar Senha</Text>
        </TouchableOpacity>

        {showSenha && (
          <View style={styles.senhaForm}>
            <TextInput style={styles.input} placeholder="Senha atual" secureTextEntry value={senhaForm.atual} onChangeText={v => setSenhaForm({ ...senhaForm, atual: v })} />
            <TextInput style={styles.input} placeholder="Nova senha" secureTextEntry value={senhaForm.nova} onChangeText={v => setSenhaForm({ ...senhaForm, nova: v })} />
            <TextInput style={styles.input} placeholder="Confirmar nova senha" secureTextEntry value={senhaForm.confirmar} onChangeText={v => setSenhaForm({ ...senhaForm, confirmar: v })} />
            <TouchableOpacity style={styles.salvarSenhaButton} onPress={handleAlterarSenha}>
              <Text style={styles.salvarSenhaText}>Alterar Senha</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 48, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.white },
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, marginTop: 16 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 14, fontSize: 16, backgroundColor: Colors.surface },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelButton: { flex: 1, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  cancelText: { color: Colors.textSecondary, fontSize: 16, fontWeight: '600' },
  saveButton: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: Colors.success, alignItems: 'center' },
  saveText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, marginTop: 24 },
  editText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  senhaButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, padding: 12 },
  senhaText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  senhaForm: { marginTop: 12, gap: 8 },
  salvarSenhaButton: { backgroundColor: Colors.warning, borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  salvarSenhaText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});

export default PerfilScreen;