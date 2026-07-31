import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import apiService from '../services/apiService';

const TransacoesScreen = ({ route, navigation }) => {
  const contaId = route?.params?.contaId || 1;
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('');

  useEffect(() => { loadTransacoes(); }, []);

  const loadTransacoes = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTransacoes(contaId, {});
      setTransacoes(data);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao carregar transações');
    } finally { setLoading(false); }
  };

  const filtered = filtro ? transacoes.filter(t => t.descricao?.toLowerCase().includes(filtro.toLowerCase())) : transacoes;

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(v));

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getIcon = (tipo) => {
    const m = { PIX: 'pix', TED: 'account-balance', DOC: 'description', PAGAMENTO_BOLETO: 'receipt', SAQUE: 'money-off', DEPOSITO: 'arrow-downward' };
    return m[tipo] || 'payment';
  };

  const renderTransacao = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <View style={[styles.iconContainer, { backgroundColor: item.valor > 0 ? Colors.successLight : Colors.errorLight }]}>
        <Icon name={getIcon(item.tipoTransacao)} size={20} color={item.valor > 0 ? Colors.success : Colors.error} />
      </View>
      <View style={styles.details}>
        <Text style={styles.desc} numberOfLines={1}>{item.descricao || item.tipoTransacao}</Text>
        <Text style={styles.date}>{formatDate(item.dataTransacao)}</Text>
      </View>
      <Text style={[styles.valor, { color: item.valor > 0 ? Colors.success : Colors.error }]}>
        {item.valor > 0 ? '+' : '-'}{formatCurrency(item.valor)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
        <Text style={styles.headerTitle}>Transações</Text>
      </LinearGradient>
      <TextInput style={styles.searchInput} placeholder="Buscar transação..." value={filtro} onChangeText={setFiltro} />
      <FlatList data={filtered} keyExtractor={i => String(i.id)} renderItem={renderTransacao} contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTransacoes} colors={[Colors.primary]} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma transação encontrada</Text>} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 48, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  searchInput: { margin: 12, padding: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, fontSize: 16, backgroundColor: Colors.surface },
  list: { paddingHorizontal: 16 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  iconContainer: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  details: { flex: 1 },
  desc: { fontSize: 15, color: Colors.text, fontWeight: '500' },
  date: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  valor: { fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: 40, fontSize: 16 },
});

export default TransacoesScreen;