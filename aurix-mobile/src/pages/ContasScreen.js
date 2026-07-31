import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import apiService from '../services/apiService';

const ContasScreen = ({ navigation }) => {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saldoTotal, setSaldoTotal] = useState(0);

  useEffect(() => { loadContas(); }, []);

  const loadContas = async () => {
    setLoading(true);
    try {
      const data = await apiService.getContas();
      setContas(data);
      setSaldoTotal(data.reduce((sum, c) => sum + (c.saldo || 0), 0));
    } catch (err) {
      Alert.alert('Erro', 'Falha ao carregar contas');
    } finally { setLoading(false); }
  };

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const tipoContaLabel = (t) => {
    const m = { CORRENTE: 'Conta Corrente', POUPANCA: 'Poupança', SALARIO: 'Conta Salário', EMPRESARIAL: 'Empresarial' };
    return m[t] || t;
  };

  const renderConta = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Extrato', { contaId: item.id, numeroConta: item.numeroConta })}>
      <LinearGradient colors={Colors.gradientCard} style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>{tipoContaLabel(item.tipoConta)}</Text>
          <Text style={styles.cardNumber}>Conta {item.numeroConta}</Text>
        </View>
      </LinearGradient>
      <View style={styles.cardBody}>
        <Text style={styles.saldoLabel}>Saldo disponível</Text>
        <Text style={styles.saldoValue}>{formatCurrency(item.saldo || 0)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Contas</Text>
        <Text style={styles.headerSubtitle}>Saldo total: {formatCurrency(saldoTotal)}</Text>
      </LinearGradient>
      <FlatList data={contas} keyExtractor={i => String(i.id)} renderItem={renderConta} contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadContas} colors={[Colors.primary]} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma conta encontrada</Text>} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 48, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  headerSubtitle: { fontSize: 16, color: Colors.white, marginTop: 4, opacity: 0.9 },
  list: { padding: 16, gap: 12 },
  card: { borderRadius: 12, overflow: 'hidden', backgroundColor: Colors.surface, elevation: 3 },
  cardHeader: { padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.white },
  cardNumber: { fontSize: 13, color: Colors.white, opacity: 0.8, marginTop: 2 },
  cardBody: { padding: 16 },
  saldoLabel: { fontSize: 12, color: Colors.textSecondary },
  saldoValue: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginTop: 4 },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: 40, fontSize: 16 },
});

export default ContasScreen;