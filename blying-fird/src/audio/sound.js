import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

// Ses dosyaları: assets/sounds/music.wav (döngü müzik) ve flap.wav (kanat çırpma)
const MUSIC_FILE = require('../../assets/sounds/music.wav');
const FLAP_FILE = require('../../assets/sounds/flap.wav');

const STORE_KEY = 'bf:sound';
const MUSIC_VOLUME = 0.45; // 0-1
const FLAP_VOLUME = 0.9;   // 0-1
const FLAP_POOL = 3;       // art arda dokunuşlarda sesler üst üste binebilsin diye birkaç oynatıcı

const settings = { music: true, sfx: true };
const listeners = new Set();
let music = null;
let flaps = [];
let flapIdx = 0;
let started = false;
let appActive = true;

// Ses ile ilgili hiçbir hata oyunu çökertmesin
const safe = (fn) => { try { return fn(); } catch (e) { return undefined; } };
const emit = () => listeners.forEach((l) => l({ ...settings }));
const persist = () => { AsyncStorage.setItem(STORE_KEY, JSON.stringify(settings)).catch(() => {}); };

function applyMusic() {
  if (!music) return;
  if (settings.music && appActive) safe(() => music.play());
  else safe(() => music.pause());
}

export async function initAudio() {
  if (started) return;
  started = true;
  try {
    const raw = await AsyncStorage.getItem(STORE_KEY);
    if (raw) Object.assign(settings, JSON.parse(raw));
    emit();
  } catch (e) {}
  try {
    await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false });
  } catch (e) {}
  try {
    music = createAudioPlayer(MUSIC_FILE);
    music.loop = true;
    music.volume = MUSIC_VOLUME;
    flaps = Array.from({ length: FLAP_POOL }, () => {
      const p = createAudioPlayer(FLAP_FILE);
      p.volume = FLAP_VOLUME;
      return p;
    });
  } catch (e) {
    return; // ses yüklenemezse oyun sessiz çalışmaya devam eder
  }

  // Uygulama arka plana gidince müzik durur, dönünce devam eder
  AppState.addEventListener('change', (st) => { appActive = st === 'active'; applyMusic(); });

  if (Platform.OS === 'web') {
    // Tarayıcılar, kullanıcı sayfaya ilk dokunana/tıklayana kadar sesi engeller
    if (typeof document !== 'undefined') {
      const unlock = () => {
        if (settings.music && appActive && !safe(() => music.playing)) safe(() => music.play());
      };
      ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'].forEach((ev) =>
        document.addEventListener(ev, unlock, { passive: true })
      );
    }
  } else {
    applyMusic();
  }
}

// Kanat çırpma sesi (efektler kapalıysa çalmaz)
export function playFlap() {
  if (!settings.sfx || !flaps.length) return;
  const p = flaps[flapIdx];
  flapIdx = (flapIdx + 1) % flaps.length;
  safe(() => {
    const r = p.seekTo(0);
    p.play();
    if (r && r.catch) r.catch(() => {});
  });
}

export function setMusicOn(on) { settings.music = on; applyMusic(); persist(); emit(); }
export function setSfxOn(on) { settings.sfx = on; persist(); emit(); }
export const toggleMusic = () => setMusicOn(!settings.music);
export const toggleSfx = () => setSfxOn(!settings.sfx);

// Bileşenlerde: const { music, sfx } = useSoundSettings();
export function useSoundSettings() {
  const [s, setS] = useState({ ...settings });
  useEffect(() => {
    listeners.add(setS);
    setS({ ...settings });
    return () => { listeners.delete(setS); };
  }, []);
  return s;
}
