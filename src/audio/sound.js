import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Asset } from 'expo-asset';

// Ses dosyaları: assets/sounds/music.wav (döngü müzik) ve flap.wav (kanat çırpma)
const MUSIC_FILE = require('../../assets/sounds/music.wav');
// Birbirinden hafif farklı 3 kanat sesi: art arda çırpınca aynı ses tekrar etmez, daha doğal durur
const FLAP_FILES = [
  require('../../assets/sounds/flap.wav'),
  require('../../assets/sounds/flap2.wav'),
  require('../../assets/sounds/flap3.wav'),
];

const STORE_KEY = 'bf:sound';
const MUSIC_VOLUME = 0.45; // seviye 5'teki gerçek ses (0-1)
const FLAP_VOLUME = 0.8;   // seviye 5'teki gerçek ses (0-1)
const FLAP_POOL = FLAP_FILES.length; // her ses için bir oynatıcı; art arda dokunuşlarda üst üste binebilir
export const MAX_LEVEL = 5; // manuel ses seviyesi: 0 (sessiz) ... 5 (en yüksek)

// music/sfx: sağ üstteki aç-kapa düğmeleri, musicLevel/sfxLevel: Ayarlar'daki 0-5 seviyesi
const settings = { music: true, sfx: true, musicLevel: MAX_LEVEL, sfxLevel: MAX_LEVEL };
const listeners = new Set();
let music = null;
let flaps = [];
let flapIdx = 0;
let started = false;
let appActive = true;

// WEB: Kanat sesi için Web Audio API. <audio> öğesinde seekTo(0)+play() mobil tarayıcıda ana
// thread'i kilitleyip kare düşürüyordu. Sesler bir kez çözülür (AudioBuffer), her çırpışta
// sadece hafif bir kaynak düğümü başlatılır.
let webCtx = null;
let webGain = null;
let webBuffers = [];
const webFlapVolume = () => (FLAP_VOLUME * settings.sfxLevel) / MAX_LEVEL;

async function initWebFlaps() {
  try {
    const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (!AC) return;
    webCtx = new AC();
    webGain = webCtx.createGain();
    webGain.gain.value = webFlapVolume();
    webGain.connect(webCtx.destination);
    webBuffers = await Promise.all(FLAP_FILES.map(async (f) => {
      const res = await fetch(Asset.fromModule(f).uri);
      const arr = await res.arrayBuffer();
      return new Promise((ok, fail) => webCtx.decodeAudioData(arr, ok, fail));
    }));
  } catch (e) {
    webCtx = null; webGain = null; webBuffers = []; // olmazsa eski yönteme düşer
  }
}

// Ses ile ilgili hiçbir hata oyunu çökertmesin
const safe = (fn) => { try { return fn(); } catch (e) { return undefined; } };
const emit = () => listeners.forEach((l) => l({ ...settings }));
const persist = () => { AsyncStorage.setItem(STORE_KEY, JSON.stringify(settings)).catch(() => {}); };
const clampLevel = (n) => Math.max(0, Math.min(MAX_LEVEL, Math.round(Number(n))));
const musicAudible = () => settings.music && settings.musicLevel > 0;

function applyVolumes() {
  if (music) safe(() => { music.volume = (MUSIC_VOLUME * settings.musicLevel) / MAX_LEVEL; });
  flaps.forEach((p) => safe(() => { p.volume = (FLAP_VOLUME * settings.sfxLevel) / MAX_LEVEL; }));
  if (webGain) safe(() => { webGain.gain.value = webFlapVolume(); });
}

function applyMusic() {
  if (!music) return;
  if (musicAudible() && appActive) safe(() => music.play());
  else safe(() => music.pause());
}

export async function initAudio() {
  if (started) return;
  started = true;
  try {
    const raw = await AsyncStorage.getItem(STORE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (typeof saved.music === 'boolean') settings.music = saved.music;
      if (typeof saved.sfx === 'boolean') settings.sfx = saved.sfx;
      // Eski kayıtlarda seviye yoktur; o zaman varsayılan (5) kalır
      if (Number.isFinite(Number(saved.musicLevel))) settings.musicLevel = clampLevel(saved.musicLevel);
      if (Number.isFinite(Number(saved.sfxLevel))) settings.sfxLevel = clampLevel(saved.sfxLevel);
    }
    emit();
  } catch (e) {}
  try {
    await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false });
  } catch (e) {}
  if (Platform.OS === 'web') initWebFlaps();
  try {
    music = createAudioPlayer(MUSIC_FILE);
    music.loop = true;
    flaps = FLAP_FILES.map((f) => createAudioPlayer(f));
    applyVolumes();
  } catch (e) {
    return; // ses yüklenemezse oyun sessiz çalışmaya devam eder
  }

  // Uygulama arka plana gidince müzik durur, dönünce devam eder
  AppState.addEventListener('change', (st) => { appActive = st === 'active'; applyMusic(); });

  if (Platform.OS === 'web') {
    // Tarayıcılar, kullanıcı sayfaya ilk dokunana/tıklayana kadar sesi engeller
    if (typeof document !== 'undefined') {
      const unlock = () => {
        if (webCtx && webCtx.state === 'suspended') safe(() => webCtx.resume());
        if (musicAudible() && appActive && !safe(() => music.playing)) safe(() => music.play());
      };
      ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'].forEach((ev) =>
        document.addEventListener(ev, unlock, { passive: true })
      );
    }
  } else {
    applyMusic();
  }
}

// Kanat çırpma sesi (efektler kapalıysa veya seviye 0 ise çalmaz)
export function playFlap() {
  if (!settings.sfx || settings.sfxLevel === 0) return;
  if (Platform.OS === 'web' && webCtx && webBuffers.length) {
    safe(() => {
      if (webCtx.state === 'suspended') webCtx.resume();
      const src = webCtx.createBufferSource();
      src.buffer = webBuffers[flapIdx];
      flapIdx = (flapIdx + 1) % webBuffers.length;
      src.connect(webGain);
      src.start(0);
    });
    return;
  }
  if (!flaps.length) return;
  const p = flaps[flapIdx];
  flapIdx = (flapIdx + 1) % flaps.length;
  safe(() => {
    const r = p.seekTo(0);
    p.play();
    if (r && r.catch) r.catch(() => {});
  });
}

// Sağ üstteki aç/kapa düğmeleri. Seviye 0 iken açarsak en yükseğe getirir, yoksa ses gelmezdi.
export function setMusicOn(on) {
  settings.music = on;
  if (on && settings.musicLevel === 0) settings.musicLevel = MAX_LEVEL;
  applyVolumes(); applyMusic(); persist(); emit();
}
export function setSfxOn(on) {
  settings.sfx = on;
  if (on && settings.sfxLevel === 0) settings.sfxLevel = MAX_LEVEL;
  applyVolumes(); persist(); emit();
}
export const toggleMusic = () => setMusicOn(!(settings.music && settings.musicLevel > 0));
export const toggleSfx = () => setSfxOn(!(settings.sfx && settings.sfxLevel > 0));

// Ayarlar ekranındaki 0-5 manuel seviye
export function setMusicLevel(n) {
  settings.musicLevel = clampLevel(n);
  if (settings.musicLevel > 0) settings.music = true;
  applyVolumes(); applyMusic(); persist(); emit();
}
export function setSfxLevel(n) {
  settings.sfxLevel = clampLevel(n);
  if (settings.sfxLevel > 0) settings.sfx = true;
  applyVolumes(); persist(); emit();
}

// Bileşenlerde: const { music, sfx, musicLevel, sfxLevel } = useSoundSettings();
export function useSoundSettings() {
  const [s, setS] = useState({ ...settings });
  useEffect(() => {
    listeners.add(setS);
    setS({ ...settings });
    return () => { listeners.delete(setS); };
  }, []);
  return s;
}
