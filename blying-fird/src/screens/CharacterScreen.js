import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Backdrop, Button } from '../components/UI';
import { BirdIcon } from '../components/Birds';
import { CHARACTERS } from '../constants/characters';
import { TOP_INSET } from '../constants/config';

export default function CharacterScreen({ profile, onSelect, onBack }) {
  return (
    <View style={{ flex: 1 }}>
      <Backdrop themeId={profile.background} dim={0.25} />
      <View style={[styles.content, { paddingTop: TOP_INSET + 20 }]}>
        <Text style={styles.title}>Karakter Seç</Text>
        <View style={styles.grid}>
          {CHARACTERS.map((c) => {
            const active = profile.character === c.id;
            return (
              <Pressable key={c.id} onPress={() => onSelect(c.id)} style={[styles.card, active && styles.cardActive]}>
                <BirdIcon type={c.id} size={96} />
                <Text style={styles.name}>{c.name}</Text>
                {active ? <Text style={styles.badge}>Seçili</Text> : null}
              </Pressable>
            );
          })}
        </View>
        <Button title="Geri" color="gray" onPress={onBack} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 38, fontWeight: '900', color: '#fff', marginBottom: 16, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  card: { width: '48%', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 22, paddingVertical: 14, alignItems: 'center', marginBottom: 14, borderWidth: 4, borderColor: 'transparent' },
  cardActive: { borderColor: '#2ecc71', backgroundColor: '#fff' },
  name: { fontSize: 22, fontWeight: '900', color: '#3b2a5a', marginTop: 4 },
  badge: { marginTop: 4, color: '#fff', backgroundColor: '#2ecc71', fontWeight: '800', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
});
