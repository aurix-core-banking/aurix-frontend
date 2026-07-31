import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Colors } from '../constants/Colors';
import apiService from '../services/apiService';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [saldo, setSaldo] = useState(15750.50);
  const [transacoes, setTransacoes] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [investimentos, setInvestimentos] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const contas = await apiService.getContas();
      const total = contas.reduce((sum, c) => sum + (c.saldo || 0), 0);
      setSaldo(total);

      const transacoesData = await apiService.getTransacoes(1, {});
      setTransacoes(transacoesData.slice(0, 5));

      try {
        const cartoesData = await apiService.getCartoes(1);
        setCartoes(cartoesData);
      } catch (e) { /* cartoes podem nao existir */ }

      try {
        const investimentosData = await apiService.getInvestimentos(1);
        setInvestimentos(investimentosData);
      } catch (e) { /* investimentos podem nao existir */ }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (tipo) => {
    switch (tipo) {
      case 'PIX': return 'pix';
      case 'TED': return 'account-balance';
      case 'DOC': return 'description';
      default: return 'payment';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluida': return Colors.success;
      case 'processando': return Colors.warning;
      case 'erro': return Colors.error;
      default: return Colors.gray;
    }
  };

  const quickActions = [
    {
      id: 1,
      title: 'PIX',
      icon: 'pix',
      color: Colors.pixGreen,
      onPress: () => navigation.navigate('PIX')
    },
    {
      id: 2,
      title: 'QR Code',
      icon: 'qr-code-scanner',
      color: Colors.primary,
      onPress: () => navigation.navigate('QRCodeScanner')
    },
    {
      id: 3,
      title: 'Transferir',
      icon: 'swap-horiz',
      color: Colors.secondary,
      onPress: () => navigation.navigate('Transferencia')
    },
    {
      id: 4,
      title: 'Pagar',
      icon: 'payment',
      color: Colors.accent,
      onPress: () => navigation.navigate('Pagamento')
    },
  ];

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity
      style={[styles.quickActionButton, { backgroundColor: item.color }]}
      onPress={item.onPress}
    >
      <Icon name={item.icon} size={24} color={Colors.white} />
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Icon name={getTransactionIcon(item.tipo)} size={20} color={Colors.primary} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription} numberOfLines={1}>
          {item.descricao}
        </Text>
        <Text style={styles.transactionDate}>{formatDate(item.data)}</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text
          style={[
            styles.transactionValue,
            { color: item.valor > 0 ? Colors.success : Colors.error }
          ]}
        >
          {item.valor > 0 ? '+' : ''}{formatCurrency(item.valor)}
        </Text>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) }
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadData} />
      }
    >
      {/* Saldo Card */}
      <LinearGradient colors={Colors.gradientCard} style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Saldo Disponível</Text>
          <TouchableOpacity onPress={loadData}>
            <Icon name="refresh" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceAmount}>{formatCurrency(saldo)}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardNumber}>Conta: 12345-6</Text>
          <Text style={styles.cardNumber}>Agência: 0001</Text>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <FlatList
          data={quickActions}
          renderItem={renderQuickAction}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsList}
        />
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transações Recentes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transacoes')}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionsList}>
          {transacoes.slice(0, 5).map(item => (
            <View key={item.id}>
              {renderTransaction({ item })}
            </View>
          ))}
        </View>
      </View>

      {/* Cards Summary */}
      {cartoes.length > 0 && (
        <View style={styles.cardsContainer}>
          <Text style={styles.sectionTitle}>Cartões</Text>
          {cartoes.map(cartao => (
            <View key={cartao.id} style={styles.cardSummary}>
              <LinearGradient colors={Colors.gradientCredit} style={styles.cardMini}>
                <Text style={styles.cardType}>{cartao.tipo}</Text>
                <Text style={styles.cardNumber}>{cartao.numero}</Text>
              </LinearGradient>
              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>Disponível</Text>
                <Text style={styles.cardAmount}>
                  {formatCurrency(cartao.limite - cartao.utilizado)}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(cartao.utilizado / cartao.limite) * 100}%` }
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Investments Summary */}
      {investimentos.length > 0 && (
        <View style={styles.investmentsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Investimentos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Investimentos')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {investimentos.map(investimento => (
            <View key={investimento.id} style={styles.investmentItem}>
              <Icon name="trending-up" size={20} color={Colors.success} />
              <View style={styles.investmentDetails}>
                <Text style={styles.investmentName}>{investimento.nome}</Text>
                <Text style={styles.investmentAmount}>
                  {formatCurrency(investimento.valor)}
                </Text>
              </View>
              <View style={styles.investmentGain}>
                <Text style={styles.investmentPercentage}>
                  +{investimento.percentual}%
                </Text>
                <Text style={styles.investmentValue}>
                  +{formatCurrency(investimento.rendimento)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  balanceCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    color: Colors.white,
    fontSize: 16,
    opacity: 0.9,
  },
  balanceAmount: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardNumber: {
    color: Colors.white,
    fontSize: 14,
    opacity: 0.8,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  quickActionsList: {
    paddingRight: 20,
  },
  quickActionButton: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickActionText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsList: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardSummary: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardMini: {
    width: 60,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardType: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    marginTop: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  investmentsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  investmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  investmentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  investmentName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  investmentAmount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  investmentGain: {
    alignItems: 'flex-end',
  },
  investmentPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.success,
  },
  investmentValue: {
    fontSize: 12,
    color: Colors.success,
    marginTop: 2,
  },
});

export default DashboardScreen;
