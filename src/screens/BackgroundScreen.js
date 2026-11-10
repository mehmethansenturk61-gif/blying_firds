import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Backdrop, Button, hoverFx } from '../components/UI';
import { SceneBack, SceneGround } from '../components/Scenes';
import { useFrame } from '../components/FrameContext';
import { THEMES } from '../constants/themes';
import { TOP_INSET } from '../constants/config';

export default function BackgroundScreen({ profile, onSelect, onBack }) {
  const { w, h } = useFrame();
  const cw = (w - 40 - 14) / 2;
  const ch = Math.min(cw * 1.5, (h - TOP_INSET - 260) / 2);
  return (
    <View style={{ flex: 1 }}>
      <Backdrop themeId={profile.background} dim={0.3} />
      <View style={[styles.content, { paddingTop: TOP_INSET + 20 }]}>
        <Text style={styles.title}>Arka Plan Seç</Text>
        <View style={styles.grid}>
          {THEMES.map((t) => {
            const active = profile.background === t.id;
            return (
              <Pressable key={t.id} onPress={() => onSelect(t.id)} style={({ pressed, hovered }) => [styles.card, { width: cw }, active && styles.cardActive, hoverFx(hovered, pressed, 5)]}>
                <View style={{ width: cw - 12, height: ch, borderRadius: 14, overflow: 'hidden' }}>
                  <SceneBack theme={t} w={cw - 12} h={ch} />
                  <SceneGround theme={t} w={cw - 12} h={ch} />
                </View>
                <Text style={styles.name}>{t.name}</Text>
              </Pressable>
            );
          })}
        </View>
        <Button title="Geri" color="gray" onPress={onBack} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 36, fontWeight: '900', color: '#fff', marginBottom: 14, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  card: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, padding: 6, alignItems: 'center', marginBottom: 14, borderWidth: 4, borderColor: 'transparent' },
  cardActive: { borderColor: '#2ecc71', backgroundColor: '#fff' },
  name: { fontSize: 16, fontWeight: '900', color: '#3b2a5a', marginVertical: 6, textAlign: 'center' },
});
