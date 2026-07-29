import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../constants/Colors';

const SuccessScreen = ({ navigation, route }) => {
  const { protocolo } = route.params || {};

  return (
    <LinearGradient colors={Colors.gradientSuccess} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="check" size={56} color={Colors.white} />
        </View>

        <Text style={styles.title}>Solicitação enviada!</Text>
        <Text style={styles.subtitle}>
          Sua solicitação foi recebida com sucesso e será analisada em breve.
        </Text>

        {protocolo && (
          <View style={styles.protocolBox}>
            <Text style={styles.protocolLabel}>Protocolo</Text>
            <Text style={styles.protocolNumber}>{protocolo}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28, fontWeight: 'bold', color: Colors.white, marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15, color: Colors.white, textAlign: 'center',
    opacity: 0.9, lineHeight: 22, marginBottom: 32,
  },
  protocolBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16, padding: 20, alignItems: 'center',
    marginBottom: 40, width: '100%',
  },
  protocolLabel: {
    fontSize: 13, color: Colors.white, opacity: 0.8, marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  protocolNumber: {
    fontSize: 22, fontWeight: 'bold', color: Colors.white,
    letterSpacing: 2,
  },
  primaryButton: {
    backgroundColor: Colors.white, borderRadius: 14,
    height: 54, justifyContent: 'center', alignItems: 'center',
    width: '100%', elevation: 4, shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5,
  },
  primaryButtonText: {
    color: Colors.success, fontSize: 17, fontWeight: 'bold',
  },
});

export default SuccessScreen;
