import React from 'react';
import { Pressable, Text, View, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
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

// Tüm ekran kaplayan katmanlar için (StyleSheet.absoluteFillObject yeni React Native'de kaldırıldı)
export const FILL = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };

// Fare üstüne gelince (web/masaüstü) "tıklanabilir" hissi: el imleci, hafif yükselme, parlama ve gölge.
// Dokunmatik cihazlarda hovered hiç true olmaz, o yüzden mobilde bir şey değişmez.
const WEB = Platform.OS === 'web';
export function hoverFx(hovered, pressed, lift = 3) {
  if (!WEB) return null;
  return {
    cursor: 'pointer',
    transitionProperty: 'transform, filter, box-shadow',
    transitionDuration: '140ms',
    ...(hovered && !pressed ? { filter: 'brightness(1.08)', boxShadow: '0 8px 18px rgba(0,0,0,0.28)', transform: [{ translateY: -lift }] } : null),
  };
}

// Tüm düğmeler aynı boyutta ve aynı yazı büyüklüğünde: hap şeklinde, üstte ince ışık şeridi, altta koyu kenar.
// `small` parametresi eski çağrılar bozulmasın diye kabul edilir ama artık boyutu değiştirmez.
export function Button({ title, onPress, color = 'orange', style }) {
  const [bg, dark] = COLORS[color] || COLORS.orange;
  return (
    <Pressable onPress={onPress} style={[styles.btnWrap, style]}>
      {({ pressed, hovered }) => (
        <View
          style={[
            styles.btn,
            { backgroundColor: bg, borderBottomColor: dark, borderBottomWidth: pressed ? 2 : 6, transform: [{ translateY: pressed ? 4 : 0 }] },
            hoverFx(hovered, pressed, 2),
          ]}
        >
          <View pointerEvents="none" style={styles.shine} />
          <Text style={styles.btnText} numberOfLines={1}>{title}</Text>
        </View>
      )}
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
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed, hovered }) => [
        styles.round,
        { width: size, height: size, borderRadius: size / 2 },
        hoverFx(hovered, pressed, 2),
        hovered && WEB ? { backgroundColor: 'rgba(0,0,0,0.5)' } : null,
      ]}
    >
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

// Duraklat düğmesi ikonu
export function PauseIcon({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={5} y={4} width={5} height={16} rx={1.5} fill="#fff" />
      <Rect x={14} y={4} width={5} height={16} rx={1.5} fill="#fff" />
    </Svg>
  );
}

// Müzik + efekt düğmeleri (ayarlar telefonda hatırlanır)
export function SoundControls({ vertical, style }) {
  const { music, sfx, musicLevel, sfxLevel } = useSoundSettings();
  return (
    <View style={[{ flexDirection: vertical ? 'column' : 'row' }, style]}>
      <SoundButton kind="music" on={music && musicLevel > 0} onPress={toggleMusic} />
      <View style={{ width: 8, height: 8 }} />
      <SoundButton kind="sfx" on={sfx && sfxLevel > 0} onPress={toggleSfx} />
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
  btnWrap: { width: '100%', height: 64, marginBottom: 10 },
  btn: { height: 58, borderRadius: 29, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  shine: { position: 'absolute', top: 0, left: 0, right: 0, height: '48%', backgroundColor: 'rgba(255,255,255,0.18)' },
  btnText: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 0.6, textShadowColor: 'rgba(0,0,0,0.28)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  panel: { width: '100%', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: 18, alignItems: 'center' },
});
