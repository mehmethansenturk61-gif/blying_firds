import AsyncStorage from '@react-native-async-storage/async-storage';
import { HISTORY_LIMIT, TOP_LIMIT } from '../constants/config';

const K = {
  nickname: 'bf:nickname',
  character: 'bf:character',
  background: 'bf:background',
  best: (m) => `bf:best:${m}`,
  hist: (m) => `bf:hist:${m}`,
  top: (m) => `bf:top:${m}`,
  count: (m) => `bf:count:${m}`,
  total: (m) => `bf:total:${m}`,
};

async function get(key, fallback) {
  try {
    const v = await AsyncStorage.getItem(key);
    return v == null ? fallback : JSON.parse(v);
  } catch (e) {
    return fallback;
  }
}
async function set(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

export async function loadProfile() {
  return {
    nickname: await get(K.nickname, ''),
    character: await get(K.character, 'bird'),
    background: await get(K.background, 'kapadokya'),
  };
}
export const saveProfileField = (field, value) => set(K[field], value);

// En iyi skorlar listesi. Eski sürümde yalnızca son oyunlar ve rekor saklanıyordu;
// rekor listedeki en yüksek skordan büyükse (eski kayıt) listeye "tarihsiz rekor" olarak eklenir,
// böylece Rekor ile 1. sıra her zaman aynı olur.
function buildTop(savedTop, hist, best) {
  const base = (savedTop && savedTop.length ? savedTop : hist).map((r) => ({ ...r }));
  const max = base.reduce((m, r) => Math.max(m, r.score), -1);
  if (best > max) base.push({ score: best, date: null, character: null });
  return base.sort((a, b) => b.score - a.score || (b.date || 0) - (a.date || 0)).slice(0, TOP_LIMIT);
}

export async function getScores(mode) {
  const best = await get(K.best(mode), 0);
  const history = await get(K.hist(mode), []);
  const top = buildTop(await get(K.top(mode), null), history, best);
  const count = await get(K.count(mode), history.length);
  const total = await get(K.total(mode), history.reduce((a, r) => a + r.score, 0));
  return { best, history, top, count, average: count ? Math.round((total / count) * 10) / 10 : 0 };
}

export async function saveResult(mode, { score, character }) {
  const prev = await getScores(mode);
  const isNewRecord = score > prev.best;
  const best = Math.max(prev.best, score);
  const entry = { score, date: Date.now(), character };
  if (isNewRecord) await set(K.best(mode), best);
  await set(K.hist(mode), [entry, ...prev.history].slice(0, HISTORY_LIMIT));
  await set(K.top(mode), buildTop([entry, ...prev.top], [], best));
  await set(K.count(mode), prev.count + 1);
  await set(K.total(mode), Math.round(prev.average * prev.count) + score);
  return { best, isNewRecord };
}
