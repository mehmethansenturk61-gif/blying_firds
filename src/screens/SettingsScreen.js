import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, PanResponder, Platform, StyleSheet } from 'react-native';
import { Backdrop, Button, Panel } from '../components/UI';
import { useFrame } from '../components/FrameContext';
import { TOP_INSET } from '../constants/config';
import { useSoundSettings, setMusicLevel, setSfxLevel, playFlap, MAX_LEVEL } from '../audio/sound';

const R = 17;        // sürgü noktasının yarıçapı
const TRACK_H = 14;  // çubuğun kalınlığı
// Çubuk doldukça renk açıktan koyuya geçer (her kademe bir ton daha koyu)
const LEVEL_COLORS = ['#ffd45e', '#ffb347', '#ff9020', '#f2661a', '#d9381e'];
const dotColor = (n) => (n === 0 ? '#9aa3ad' : LEVEL_COLORS[n - 1]);

// Kademeli ses çubuğu (0..MAX_LEVEL): noktayı sürükleyebilir ya da çubuğa dokunup doğrudan o kademeye gidebilirsin.
function LevelSlider({ value, onChange }) {
  const [width, setWidth] = useState(0);
  const [dragPos, setDragPos] = useState(null); // sürüklerken akıcı konum (0..MAX_LEVEL)
  const live = useRef({});
  live.current.width = width;
  live.current.value = value;
  live.current.onChange = onChange;

  const apply = (x) => {
    const L = live.current.width - 2 * R;
    if (L <= 0) return;
    const pos = Math.max(0, Math.min(MAX_LEVEL, ((x - R) / L) * MAX_LEVEL));
    setDragPos(pos);
    const lvl = Math.round(pos);
    if (lvl !== live.current.value) { live.current.value = lvl; live.current.onChange(lvl); }
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false, // kaydırırken ScrollView araya girmesin
      onPanResponderGrant: (e) => { live.current.startX = e.nativeEvent.locationX; apply(live.current.startX); },
      onPanResponderMove: (e, g) => apply(live.current.startX + g.dx),
      onPanResponderRelease: () => setDragPos(null),
      onPanResponderTerminate: () => setDragPos(null),
    })
  ).current;

  const pos = dragPos !== null ? dragPos : value;
  const lvl = Math.round(pos);
  const L = Math.max(width - 2 * R, 0);
  const xOf = (n) => R + (L * n) / MAX_LEVEL;

  return (
    <View
      {...pan.panHandlers}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.slider, Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'pointer' } : null]}
    >
      {/* İçindeki her şey dokunuşu geçirir; böylece konum hep çubuğun kendisine göre hesaplanır */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.track, { left: R, width: L }]} />
        <View style={[styles.fill, { left: R, width: (L * pos) / MAX_LEVEL }]}>
          {LEVEL_COLORS.map((c, i) => (
            <View key={i} style={{ width: L / MAX_LEVEL, height: TRACK_H, backgroundColor: c, flexShrink: 0 }} />
          ))}
        </View>
        {Array.from({ length: MAX_LEVEL + 1 }).map((_, n) => (
          <View key={n} style={[styles.notch, { left: xOf(n) - 3, backgroundColor: n <= pos ? 'rgba(255,255,255,0.75)' : '#b8bec6' }]} />
        ))}
        <View style={[styles.thumb, { left: xOf(pos) - R, borderColor: dotColor(lvl) }]} />
        {Array.from({ length: MAX_LEVEL + 1 }).map((_, n) => (
          <Text key={n} style={[styles.tick, { left: xOf(n) - 12 }, n === lvl && styles.tickOn]}>{n}</Text>
        ))}
      </View>
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
          <Button title="Takma Adı Değiştir" color="blue" onPress={onChangeNickname} style={{ marginBottom: 0 }} />
        </Panel>

        <Panel style={styles.panel}>
          <Text style={styles.heading}>Ses</Text>
          <Text style={styles.label}>Müzik</Text>
          <LevelSlider value={musicLevel} onChange={setMusicLevel} />
          <Text style={[styles.label, { marginTop: 10 }]}>Efektler (Kanat Sesi)</Text>
          <LevelSlider value={sfxLevel} onChange={(n) => { setSfxLevel(n); playFlap(); }} />
          <Text style={styles.hint}>0 = sessiz, {MAX_LEVEL} = en yüksek. Noktayı kaydır ya da bir kademeye dokun. Sağ üstteki düğmelerle sesi tamamen açıp kapatabilirsin.</Text>
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
  label: { alignSelf: 'flex-start', fontSize: 16, fontWeight: '800', color: '#555', marginBottom: 4 },
  slider: { width: '100%', height: 2 * R + 26 },
  track: { position: 'absolute', top: R - TRACK_H / 2, height: TRACK_H, borderRadius: TRACK_H / 2, backgroundColor: '#e3e6ea' },
  fill: { position: 'absolute', top: R - TRACK_H / 2, height: TRACK_H, borderRadius: TRACK_H / 2, overflow: 'hidden', flexDirection: 'row' },
  notch: { position: 'absolute', top: R - 3, width: 6, height: 6, borderRadius: 3 },
  thumb: { position: 'absolute', top: 0, width: 2 * R, height: 2 * R, borderRadius: R, backgroundColor: '#fff', borderWidth: 5, elevation: 4, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  tick: { position: 'absolute', top: 2 * R + 6, width: 24, textAlign: 'center', fontSize: 13, fontWeight: '800', color: '#9aa3ad' },
  tickOn: { color: '#3b2a5a', fontSize: 15 },
  hint: { marginTop: 12, fontSize: 13, fontWeight: '700', color: '#888', textAlign: 'center' },
});
