import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const ConfiguracoesScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Configuracoes</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  title: { fontSize: 18, color: Colors.text },
});

export default ConfiguracoesScreen;
