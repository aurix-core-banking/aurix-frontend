import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import apiService from '../services/apiService';

const ConfiguracoesScreen = ({ navigation }) => {
  const [config, setConfig] = useState({
    notificacoesPush: true,
    notificacoesEmail: true,
    notificacoesSMS: false,
    biometria: false,
    modoEscuro: false,
    compartilharDados: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadConfig(); }, []);

  const loadConfig = async () => {
    try {
      const data = await apiService.getConfiguracoes();
      if (data) setConfig(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.log('Configuracoes nao carregadas, usando defaults');
    }
  };

  const toggle = async (key) => {
    const newValue = !config[key];
    setConfig(prev => ({ ...prev, [key]: newValue }));
    try {
      await apiService.atualizarConfiguracoes({ [key]: newValue });
    } catch (err) {
      Alert.alert('Erro', 'Falha ao salvar configuração');
      setConfig(prev => ({ ...prev, [key]: !newValue }));
    }
  };

  const sections = [
    {
      title: 'Notificações',
      items: [
        { key: 'notificacoesPush', label: 'Push', icon: 'notifications-active', desc: 'Notificações instantâneas no celular' },
        { key: 'notificacoesEmail', label: 'Email', icon: 'email', desc: 'Alertas e extratos por email' },
        { key: 'notificacoesSMS', label: 'SMS', icon: 'sms', desc: 'Alertas de segurança por SMS' },
      ],
    },
    {
      title: 'Segurança',
      items: [
        { key: 'biometria', label: 'Biometria', icon: 'fingerprint', desc: 'Login com impressão digital ou Face ID' },
      ],
    },
    {
      title: 'Aparência',
      items: [
        { key: 'modoEscuro', label: 'Modo Escuro', icon: 'dark-mode', desc: 'Tema escuro para economia de bateria' },
      ],
    },
    {
      title: 'Privacidade',
      items: [
        { key: 'compartilharDados', label: 'Compartilhar Dados', icon: 'share', desc: 'Compartilhar dados com Open Finance' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </LinearGradient>

      {sections.map((section, idx) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map(item => (
            <TouchableOpacity key={item.key} style={styles.item} onPress={() => toggle(item.key)}>
              <View style={styles.itemLeft}>
                <Icon name={item.icon} size={22} color={Colors.primary} />
                <View style={styles.itemText}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Text style={styles.itemDesc}>{item.desc}</Text>
                </View>
              </View>
              <Switch value={config[item.key]} onValueChange={() => toggle(item.key)} trackColor={{ false: Colors.grayLight, true: Colors.primaryLight }} thumbColor={config[item.key] ? Colors.primary : Colors.gray} />
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={() => { Alert.alert('Sair', 'Tem certeza?', [{ text: 'Cancelar' }, { text: 'Sair', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Auth' }] }) }]); }}>
        <Icon name="logout" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Aurix Mobile v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 48, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', marginBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginBottom: 8 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  itemText: { flex: 1 },
  itemLabel: { fontSize: 16, fontWeight: '600', color: Colors.text },
  itemDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32, marginHorizontal: 16, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: Colors.error },
  logoutText: { color: Colors.error, fontSize: 16, fontWeight: '600' },
  version: { textAlign: 'center', color: Colors.gray, fontSize: 12, marginTop: 24, marginBottom: 40 },
});

export default ConfiguracoesScreen;