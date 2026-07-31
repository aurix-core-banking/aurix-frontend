import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import apiService from '../services/apiService';

const InvestimentosScreen = ({ navigation }) => {
  const [investimentos, setInvestimentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSimulador, setShowSimulador] = useState(false);
  const [simulacao, setSimulacao] = useState({ tipo: 'CDB', valor: '1000', taxa: '13.75', dias: '365' });
  const [resultadoSimulacao, setResultadoSimulacao] = useState(null);

  useEffect(() => { loadInvestimentos(); }, []);

  const loadInvestimentos = async () => {
    setLoading(true);
    try {
      const data = await apiService.getInvestimentos(1);
      setInvestimentos(data);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao carregar investimentos');
    } finally { setLoading(false); }
  };

  const handleSimular = async () => {
    try {
      const result = await apiService.simularInvestimento(simulacao.tipo, parseFloat(simulacao.valor), parseFloat(simulacao.taxa), parseInt(simulacao.dias));
      setResultadoSimulacao(result);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao simular investimento');
    }
  };

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const renderInvestimento = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="trending-up" size={24} color={Colors.investment} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text style={styles.cardSubtitle}>Rentabilidade: {item.percentual}%</Text>
        </View>
        <Text style={styles.cardValue}>{formatCurrency(item.valor)}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.rendimento}>+ {formatCurrency(item.rendimento)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientInvestment} style={styles.header}>
        <Text style={styles.headerTitle}>Investimentos</Text>
        <TouchableOpacity style={styles.simularButton} onPress={() => setShowSimulador(!showSimulador)}>
          <Icon name="calculate" size={20} color={Colors.white} />
          <Text style={styles.simularText}>Simular</Text>
        </TouchableOpacity>
      </LinearGradient>

      {showSimulador && (
        <View style={styles.simuladorContainer}>
          <Text style={styles.simuladorTitle}>Simulador de Rendimento</Text>
          <TextInput style={styles.input} placeholder="Valor (R$)" keyboardType="decimal-pad" value={simulacao.valor} onChangeText={v => setSimulacao({ ...simulacao, valor: v })} />
          <TextInput style={styles.input} placeholder="Taxa anual (%)" keyboardType="decimal-pad" value={simulacao.taxa} onChangeText={v => setSimulacao({ ...simulacao, taxa: v })} />
          <TextInput style={styles.input} placeholder="Dias" keyboardType="number-pad" value={simulacao.dias} onChangeText={v => setSimulacao({ ...simulacao, dias: v })} />
          <TouchableOpacity style={styles.calcularButton} onPress={handleSimular}>
            <Text style={styles.calcularText}>Calcular</Text>
          </TouchableOpacity>
          {resultadoSimulacao && (
            <View style={styles.resultado}>
              <Text style={styles.resultadoValor}>Valor bruto: {formatCurrency(resultadoSimulacao.valorBruto || 0)}</Text>
              <Text style={styles.resultadoValor}>Valor líquido: {formatCurrency(resultadoSimulacao.valorLiquido || 0)}</Text>
              <Text style={styles.resultadoValor}>Rendimento: {formatCurrency(resultadoSimulacao.rendimento || 0)}</Text>
            </View>
          )}
        </View>
      )}

      <FlatList data={investimentos} keyExtractor={i => String(i.id)} renderItem={renderInvestimento} contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadInvestimentos} colors={[Colors.primary]} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum investimento encontrado</Text>} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  simularButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: 10 },
  simularText: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  simuladorContainer: { padding: 16, backgroundColor: Colors.surface, margin: 12, borderRadius: 12, elevation: 2 },
  simuladorTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 12, marginBottom: 8, fontSize: 16 },
  calcularButton: { backgroundColor: Colors.investment, borderRadius: 8, padding: 14, alignItems: 'center' },
  calcularText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  resultado: { marginTop: 12, padding: 12, backgroundColor: Colors.lightGray, borderRadius: 8 },
  resultadoValor: { fontSize: 14, color: Colors.text, marginBottom: 4 },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: Colors.surface, borderRadius: 12, padding: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  cardSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  cardFooter: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  rendimento: { fontSize: 14, color: Colors.success, fontWeight: '600' },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: 40, fontSize: 16 },
});

export default InvestimentosScreen;