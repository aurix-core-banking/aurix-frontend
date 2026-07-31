import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import apiService from '../services/apiService';

const NotificacoesScreen = ({ navigation }) => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadNotificacoes(); }, []);

  const loadNotificacoes = async () => {
    setLoading(true);
    try {
      const data = await apiService.getNotificacoes();
      setNotificacoes(data);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao carregar notificações');
    } finally { setLoading(false); }
  };

  const handleMarcarLida = async (id) => {
    try {
      await apiService.marcarNotificacaoLida(id);
      setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    } catch (err) {
      Alert.alert('Erro', 'Falha ao marcar notificação');
    }
  };

  const formatDate = (d) => {
    const dt = new Date(d);
    const now = new Date();
    const diff = now - dt;
    if (diff < 3600000) return `Há ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Há ${Math.floor(diff / 3600000)}h`;
    return dt.toLocaleDateString('pt-BR');
  };

  const getIcon = (tipo) => {
    const m = { PIX: 'pix', TRANSACAO: 'payment', CARTAO: 'credit-card', SEGURANCA: 'security', PROMOCAO: 'star', SISTEMA: 'info' };
    return m[tipo] || 'notifications';
  };

  const renderNotificacao = ({ item }) => (
    <TouchableOpacity style={[styles.item, !item.lida && styles.itemNaoLida]} onPress={() => handleMarcarLida(item.id)}>
      <View style={[styles.iconContainer, { backgroundColor: item.lida ? Colors.grayLight : Colors.primaryLight }]}>
        <Icon name={getIcon(item.tipo)} size={20} color={item.lida ? Colors.gray : Colors.primary} />
      </View>
      <View style={styles.details}>
        <Text style={styles.titulo} numberOfLines={2}>{item.titulo || item.mensagem}</Text>
        <Text style={styles.data}>{formatDate(item.dataCriacao || item.data)}</Text>
      </View>
      {!item.lida && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
        <Text style={styles.headerTitle}>Notificações</Text>
      </LinearGradient>
      <FlatList data={notificacoes} keyExtractor={i => String(i.id)} renderItem={renderNotificacao} contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadNotificacoes} colors={[Colors.primary]} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma notificação</Text>} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 48, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  list: { paddingHorizontal: 16 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  itemNaoLida: { backgroundColor: 'rgba(25,118,210,0.05)' },
  iconContainer: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  details: { flex: 1 },
  titulo: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  data: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: 40, fontSize: 16 },
});

export default NotificacoesScreen;