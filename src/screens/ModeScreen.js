import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Backdrop, Button, Hearts, hoverFx } from '../components/UI';
import { MODES, TOP_INSET } from '../constants/config';
import { getScores } from '../storage/storage';

export default function ModeScreen({ profile, onStart, onBack }) {
  const [best, setBest] = useState({ single: 0, triple: 0 });
  useEffect(() => {
    Promise.all([getScores('single'), getScores('triple')]).then(([a, b]) => setBest({ single: a.best, triple: b.best }));
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Backdrop themeId={profile.background} dim={0.25} />
      <View style={[styles.content, { paddingTop: TOP_INSET + 20 }]}>
        <Text style={styles.title}>Mod Seç</Text>
        {Object.values(MODES).map((m) => (
          <Pressable key={m.id} onPress={() => onStart(m.id)} style={({ pressed, hovered }) => [styles.card, hoverFx(hovered, pressed, 4), pressed && { transform: [{ translateY: 3 }] }]}>
            <Text style={styles.cardTitle}>{m.name}</Text>
            <Hearts lives={m.lives} max={m.lives} size={30} />
            <Text style={styles.desc}>{m.desc}</Text>
            <Text style={styles.best}>Rekor: {best[m.id]}</Text>
          </Pressable>
        ))}
        <Button title="Geri" color="gray" onPress={onBack} style={{ marginTop: 10 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24 },
  title: { fontSize: 38, fontWeight: '900', color: '#fff', marginBottom: 18, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 3 },
  card: { width: '100%', backgroundColor: 'rgba(255,255,255,0.93)', borderRadius: 24, padding: 18, alignItems: 'center', marginBottom: 16, borderBottomWidth: 6, borderBottomColor: '#c9b8e8' },
  cardTitle: { fontSize: 28, fontWeight: '900', color: '#3b2a5a', marginBottom: 6 },
  desc: { fontSize: 15, color: '#555', textAlign: 'center', marginTop: 8, fontWeight: '600' },
  best: { fontSize: 18, fontWeight: '800', color: '#e67e22', marginTop: 8 },
});
