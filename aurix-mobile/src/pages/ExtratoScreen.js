import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import apiService from '../services/apiService';

const ExtratoScreen = ({ route, navigation }) => {
  const contaId = route?.params?.contaId || 1;
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => { loadExtrato(); }, []);

  const loadExtrato = async () => {
    setLoading(true);
    try {
      const data = await apiService.getExtrato(contaId, {});
      setTransacoes(data.transacoes || data);
      setSaldo(data.saldo || 0);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao carregar extrato');
    } finally { setLoading(false); }
  };

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(v));
  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemDesc} numberOfLines={1}>{item.descricao || item.tipoTransacao}</Text>
        <Text style={styles.itemDate}>{formatDate(item.dataTransacao)}</Text>
      </View>
      <Text style={[styles.itemValor, { color: item.valor > 0 ? Colors.success : Colors.error }]}>
        {item.valor > 0 ? '+' : '-'}{formatCurrency(item.valor)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
        <Text style={styles.headerTitle}>Extrato</Text>
        <Text style={styles.headerSaldo}>Saldo: {formatCurrency(saldo)}</Text>
      </LinearGradient>
      <FlatList data={transacoes} keyExtractor={i => String(i.id)} renderItem={renderItem} contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadExtrato} colors={[Colors.primary]} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma movimentação</Text>} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 48, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  headerSaldo: { fontSize: 18, color: Colors.white, marginTop: 4, opacity: 0.9 },
  list: { paddingHorizontal: 16 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  itemLeft: { flex: 1 },
  itemDesc: { fontSize: 15, color: Colors.text, fontWeight: '500' },
  itemDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  itemValor: { fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: 40, fontSize: 16 },
});

export default ExtratoScreen;