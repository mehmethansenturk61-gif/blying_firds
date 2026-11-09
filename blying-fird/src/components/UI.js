import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useFrame } from './FrameContext';
import useTicker from '../hooks/useTicker';
import { SceneBack, SceneGround } from './Scenes';
import { getTheme } from '../constants/themes';
import { useSoundSettings, toggleMusic, toggleSfx } from '../audio/sound';

export const COLORS = {
  orange: ['#ff9f1c', '#c46a00'],
  green: ['#2ecc71', '#1c8f4f'],
  blue: ['#3498db', '#1f6fa5'],
  purple: ['#9b59b6', '#6c3483'],
  red: ['#ff5d73', '#b02a3f'],
  gray: ['#95a5a6', '#5f6f70'],
};

export function Button({ title, onPress, color = 'orange', small, style }) {
  const [bg, dark] = COLORS[color] || COLORS.orange;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        small && styles.btnSmall,
        { backgroundColor: bg, borderBottomColor: dark, borderBottomWidth: pressed ? 3 : 7, marginTop: pressed ? 4 : 0 },
        style,
      ]}
    >
      <Text style={[styles.btnText, small && { fontSize: 18 }]}>{title}</Text>
    </Pressable>
  );
}

export function Panel({ children, style }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export function Logo({ size = 54 }) {
  const base = { fontSize: size, fontWeight: '900', letterSpacing: 2, textShadowColor: '#4a1f6e', textShadowOffset: { width: 0, height: 5 }, textShadowRadius: 0 };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[base, { color: '#ffd23f' }]}>Blying</Text>
      <Text style={[base, { color: '#ff5d73', marginTop: -size * 0.18 }]}>Fird</Text>
    </View>
  );
}

export function Heart({ size = 26, filled = true }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 21s-7.5-4.8-10-9.6C0.4 8 2.4 4.5 6.2 4.5c2.1 0 3.8 1.2 5.8 3.2 2-2 3.7-3.2 5.8-3.2 3.8 0 5.8 3.5 4.2 6.9C19.5 16.2 12 21 12 21z"
        fill={filled ? '#ff3b5c' : 'rgba(0,0,0,0.35)'} stroke="#fff" strokeWidth={1.5}
      />
    </Svg>
  );
}

export function Hearts({ lives, max, size = 26 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: max }).map((_, i) => (
        <View key={i} style={{ marginLeft: 3 }}><Heart size={size} filled={i < lives} /></View>
      ))}
    </View>
  );
}

// Yuvarlak ses düğmesi: kind='music' (müzik) veya 'sfx' (kanat sesi vb. efektler). Kapalıyken üstü çizilir.
export function SoundButton({ kind, on, onPress, size = 40 }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} style={[styles.round, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" opacity={on ? 1 : 0.7}>
        {kind === 'music' ? (
          <>
            <Path d="M9 18V6l11-2v12" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
            <Circle cx={6.5} cy={18} r={3} fill="#fff" />
            <Circle cx={17.5} cy={16} r={3} fill="#fff" />
          </>
        ) : (
          <>
            <Path d="M4 9v6h4l5 4V5L8 9z" fill="#fff" />
            <Path d="M16 9.5a4 4 0 010 5M18.5 7a7.5 7.5 0 010 10" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
          </>
        )}
        {!on ? <Path d="M3 3L21 21" stroke="#ff5d73" strokeWidth={2.8} strokeLinecap="round" /> : null}
      </Svg>
    </Pressable>
  );
}

// Müzik + efekt düğmeleri (ayarlar telefonda hatırlanır)
export function SoundControls({ vertical, style }) {
  const { music, sfx } = useSoundSettings();
  return (
    <View style={[{ flexDirection: vertical ? 'column' : 'row' }, style]}>
      <SoundButton kind="music" on={music} onPress={toggleMusic} />
      <View style={{ width: 8, height: 8 }} />
      <SoundButton kind="sfx" on={sfx} onPress={toggleSfx} />
    </View>
  );
}

// Kayan arka plan (menü ekranları için)
export function Backdrop({ themeId, dim = 0.12 }) {
  const { w, h } = useFrame();
  const t = useTicker(24);
  const theme = getTheme(themeId);
  const scroll = t * 45;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <SceneBack theme={theme} w={w} h={h} scroll={scroll} />
      <SceneGround theme={theme} w={w} h={h} scroll={scroll} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(0,0,0,${dim})` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  round: { backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  btn: { width: '100%', paddingVertical: 15, borderRadius: 20, alignItems: 'center', marginBottom: 12 },
  btnSmall: { paddingVertical: 10, borderRadius: 16 },
  btnText: { color: '#fff', fontSize: 22, fontWeight: '800', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 2 },
  panel: { width: '100%', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: 18, alignItems: 'center' },
});
