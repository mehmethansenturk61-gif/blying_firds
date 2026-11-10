import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Örnek bir yönlendirme veya tema seçici
const GameScreen = ({ theme }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mevcut Tema: {theme}</Text>
      {/* Oyun motoru ve sahneler buraya gelecek */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#87CEEB' },
  text: { fontSize: 24, fontWeight: 'bold' }
});

export default GameScreen;
