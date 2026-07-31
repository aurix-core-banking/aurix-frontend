import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import apiService from '../services/apiService';

const CartoesScreen = ({ navigation }) => {
  const [cartoes, setCartoes] = useState([]);
  const [faturaSelecionada, setFaturaSelecionada] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadCartoes(); }, []);

  const loadCartoes = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCartoes(1);
      setCartoes(data);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao carregar cartões');
    } finally { setLoading(false); }
  };

  const loadFaturas = async (cartaoId) => {
    try {
      const data = await apiService.getFaturas(cartaoId);
      setFaturaSelecionada(data.length > 0 ? data[0] : null);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao carregar faturas');
    }
  };

  const handlePagarFatura = async (faturaId) => {
    try {
      await apiService.pagarFatura(faturaId, faturaSelecionada.valorTotal);
      Alert.alert('Sucesso', 'Fatura paga com sucesso');
      loadCartoes();
    } catch (err) {
      Alert.alert('Erro', 'Falha ao pagar fatura');
    }
  };

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const renderCartao = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => loadFaturas(item.id)}>
      <LinearGradient colors={item.tipo === 'Crédito' ? Colors.gradientCredit : Colors.gradientDark} style={styles.cardGradient}>
        <View style={styles.cardRow}>
          <Icon name="credit-card" size={28} color={Colors.white} />
          <Text style={styles.cardNumber}>{item.numero}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardType}>{item.tipo}</Text>
          <Text style={styles.cardLimit}>Limite: {formatCurrency(item.limite)}</Text>
          <Text style={styles.cardUsed}>Utilizado: {formatCurrency(item.utilizado)}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientCredit} style={styles.header}>
        <Text style={styles.headerTitle}>Cartões</Text>
      </LinearGradient>
      <FlatList data={cartoes} keyExtractor={i => String(i.id)} renderItem={renderCartao} contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadCartoes} colors={[Colors.primary]} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum cartão encontrado</Text>} />
      {faturaSelecionada && (
        <View style={styles.faturaContainer}>
          <Text style={styles.faturaTitle}>Fatura Atual</Text>
          <Text style={styles.faturaValor}>Valor: {formatCurrency(faturaSelecionada.valorTotal)}</Text>
          <Text style={styles.faturaVencimento}>Vencimento: {new Date(faturaSelecionada.vencimento).toLocaleDateString('pt-BR')}</Text>
          <TouchableOpacity style={styles.pagarButton} onPress={() => handlePagarFatura(faturaSelecionada.id)}>
            <Text style={styles.pagarButtonText}>Pagar Fatura</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 48, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  list: { padding: 16, gap: 12 },
  card: { borderRadius: 14, overflow: 'hidden', elevation: 4 },
  cardGradient: { padding: 20, minHeight: 160 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardNumber: { fontSize: 18, color: Colors.white, fontWeight: 'bold' },
  cardInfo: { marginTop: 16 },
  cardType: { fontSize: 14, color: Colors.white, opacity: 0.8 },
  cardLimit: { fontSize: 14, color: Colors.white, marginTop: 4 },
  cardUsed: { fontSize: 14, color: Colors.white, marginTop: 2 },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: 40, fontSize: 16 },
  faturaContainer: { padding: 16, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  faturaTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  faturaValor: { fontSize: 20, fontWeight: 'bold', color: Colors.error, marginTop: 4 },
  faturaVencimento: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  pagarButton: { backgroundColor: Colors.success, borderRadius: 8, padding: 14, marginTop: 12, alignItems: 'center' },
  pagarButtonText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});

export default CartoesScreen;