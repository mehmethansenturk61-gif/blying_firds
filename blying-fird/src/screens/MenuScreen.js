import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Backdrop, Button, Logo, SoundControls } from '../components/UI';
import { BirdIcon } from '../components/Birds';
import { useFrame } from '../components/FrameContext';
import { TOP_INSET } from '../constants/config';

export default function MenuScreen({ profile, go }) {
  const { h } = useFrame();
  return (
    <View style={{ flex: 1 }}>
      <Backdrop themeId={profile.background} />
      <ScrollView contentContainerStyle={[styles.content, { minHeight: h, paddingTop: TOP_INSET + 58 }]} showsVerticalScrollIndicator={false}>
        <Logo />
        <BirdIcon type={profile.character} size={110} />
        <View style={styles.chip}><Text style={styles.chipText}>Merhaba, {profile.nickname}!</Text></View>
        <View style={{ width: '100%', marginTop: 18 }}>
          <Button title="Oyna" color="green" onPress={() => go('mode')} />
          <Button title="Karakter Seç" color="blue" onPress={() => go('character')} />
          <Button title="Arka Plan Seç" color="purple" onPress={() => go('background')} />
          <Button title="Skor Tablosu" color="orange" onPress={() => go('leaderboard')} />
          <Button title="Ayarlar" color="gray" onPress={() => go('settings')} />
        </View>
      </ScrollView>
      <SoundControls style={{ position: 'absolute', right: 14, top: TOP_INSET + 4 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 100 },
  chip: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 6, marginTop: 4 },
  chipText: { fontSize: 18, fontWeight: '800', color: '#3b2a5a' },
});
