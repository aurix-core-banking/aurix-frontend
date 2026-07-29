import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const PerfilScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Meu Perfil</Text>
    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Configuracoes')}>
      <Text style={styles.btnText}>Configuracoes</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  title: { fontSize: 18, color: Colors.text, marginBottom: 16 },
  btn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 8 },
  btnText: { color: Colors.white },
});

export default PerfilScreen;
