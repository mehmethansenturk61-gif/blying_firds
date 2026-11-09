import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Backdrop, Button, Panel } from '../components/UI';
import { useFrame } from '../components/FrameContext';
import { TOP_INSET } from '../constants/config';
import { useSoundSettings, setMusicLevel, setSfxLevel, playFlap, MAX_LEVEL } from '../audio/sound';

// 0'dan MAX_LEVEL'e kadar yan yana düğmeler; seçili seviye vurgulanır
function LevelPicker({ value, onChange }) {
  return (
    <View style={styles.levels}>
      {Array.from({ length: MAX_LEVEL + 1 }).map((_, n) => {
        const selected = n === value;
        const filled = n > 0 && n <= value; // seçili seviyeye kadar olanlar dolu görünür
        return (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            style={[styles.pill, filled && styles.pillFilled, selected && styles.pillSelected]}
          >
            <Text style={[styles.pillText, (filled || selected) && { color: '#fff' }]}>{n}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SettingsScreen({ profile, onChangeNickname, onBack }) {
  const { h } = useFrame();
  const { musicLevel, sfxLevel } = useSoundSettings();
  return (
    <View style={{ flex: 1 }}>
      <Backdrop themeId={profile.background} />
      <ScrollView contentContainerStyle={[styles.content, { minHeight: h, paddingTop: TOP_INSET + 20 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Ayarlar</Text>

        <Panel style={styles.panel}>
          <Text style={styles.heading}>Takma Ad</Text>
          <Text style={styles.nick}>{profile.nickname}</Text>
          <Button title="Takma Adı Değiştir" color="blue" small onPress={onChangeNickname} style={{ marginBottom: 0 }} />
        </Panel>

        <Panel style={styles.panel}>
          <Text style={styles.heading}>Ses</Text>
          <Text style={styles.label}>Müzik</Text>
          <LevelPicker value={musicLevel} onChange={setMusicLevel} />
          <Text style={[styles.label, { marginTop: 14 }]}>Efektler (kanat sesi)</Text>
          <LevelPicker value={sfxLevel} onChange={(n) => { setSfxLevel(n); playFlap(); }} />
          <Text style={styles.hint}>0 = sessiz, {MAX_LEVEL} = en yüksek. Sağ üstteki düğmelerle sesi tamamen açıp kapatabilirsin.</Text>
        </Panel>

        <View style={{ width: '100%', marginTop: 4 }}>
          <Button title="Geri" color="gray" onPress={onBack} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 60 },
  title: { fontSize: 40, fontWeight: '900', color: '#fff', marginBottom: 14, textShadowColor: 'rgba(0,0,0,0.45)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 3 },
  panel: { marginBottom: 16 },
  heading: { fontSize: 22, fontWeight: '900', color: '#3b2a5a', marginBottom: 8 },
  nick: { fontSize: 22, fontWeight: '800', color: '#6c3483', marginBottom: 12 },
  label: { alignSelf: 'flex-start', fontSize: 16, fontWeight: '800', color: '#555', marginBottom: 6 },
  levels: { flexDirection: 'row', width: '100%' },
  pill: { flex: 1, height: 44, marginHorizontal: 3, borderRadius: 14, backgroundColor: '#e3e6ea', alignItems: 'center', justifyContent: 'center' },
  pillFilled: { backgroundColor: '#f7b267' },
  pillSelected: { backgroundColor: '#ff9f1c', borderBottomWidth: 4, borderBottomColor: '#c46a00' },
  pillText: { fontSize: 18, fontWeight: '900', color: '#6b7280' },
  hint: { marginTop: 12, fontSize: 13, fontWeight: '700', color: '#888', textAlign: 'center' },
});
