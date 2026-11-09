import React, { useEffect, useState } from 'react';
import { View, StatusBar, ActivityIndicator, useWindowDimensions } from 'react-native';
import { FrameContext } from './src/components/FrameContext';
import { LAYOUT } from './src/constants/config';
import { getTheme } from './src/constants/themes';
import { loadProfile, saveProfileField } from './src/storage/storage';
import { initAudio } from './src/audio/sound';
import NicknameScreen from './src/screens/NicknameScreen';
import MenuScreen from './src/screens/MenuScreen';
import ModeScreen from './src/screens/ModeScreen';
import CharacterScreen from './src/screens/CharacterScreen';
import BackgroundScreen from './src/screens/BackgroundScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import GameScreen from './src/screens/GameScreen';

export default function App() {
  const { width, height } = useWindowDimensions();
  // Masaüstünde oyun alanı dikey (portre) bir çerçeveye sığdırılır
  const frame = { w: Math.min(width, height * LAYOUT.MAX_FRAME_ASPECT), h: height };

  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState('menu');
  const [mode, setMode] = useState('single');
  const [runId, setRunId] = useState(0);

  useEffect(() => { initAudio(); }, []);

  useEffect(() => {
    loadProfile().then((p) => {
      setProfile(p);
      setScreen(p.nickname ? 'menu' : 'nickname');
    });
  }, []);

  const update = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
    saveProfileField(field, value);
  };
  const toMenu = () => setScreen('menu');

  let content = <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />;
  if (profile) {
    switch (screen) {
      case 'nickname':
        content = (
          <NicknameScreen
            profile={profile}
            editing={!!profile.nickname}
            onSave={(n) => { update('nickname', n); toMenu(); }}
            onCancel={toMenu}
          />
        );
        break;
      case 'mode':
        content = <ModeScreen profile={profile} onBack={toMenu} onStart={(m) => { setMode(m); setRunId((r) => r + 1); setScreen('game'); }} />;
        break;
      case 'character':
        content = <CharacterScreen profile={profile} onSelect={(c) => update('character', c)} onBack={toMenu} />;
        break;
      case 'background':
        content = <BackgroundScreen profile={profile} onSelect={(b) => update('background', b)} onBack={toMenu} />;
        break;
      case 'leaderboard':
        content = <LeaderboardScreen profile={profile} onBack={toMenu} />;
        break;
      case 'game':
        content = (
          <GameScreen
            key={runId}
            mode={mode}
            character={profile.character}
            theme={getTheme(profile.background)}
            onExit={toMenu}
            onRestart={() => setRunId((r) => r + 1)}
          />
        );
        break;
      default:
        content = <MenuScreen profile={profile} go={setScreen} />;
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0b1020', alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar hidden />
      <FrameContext.Provider value={frame}>
        <View style={{ width: frame.w, height: frame.h, overflow: 'hidden', backgroundColor: '#5aa9e6' }}>{content}</View>
      </FrameContext.Provider>
    </View>
  );
}
