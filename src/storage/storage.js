import AsyncStorage from '@react-native-async-storage/async-storage';
import { HISTORY_LIMIT } from '../constants/config';

const K = {
  nickname: 'bf:nickname',
  character: 'bf:character',
  background: 'bf:background',
  best: (m) => `bf:best:${m}`,
  hist: (m) => `bf:hist:${m}`,
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

export async function getScores(mode) {
  return { best: await get(K.best(mode), 0), history: await get(K.hist(mode), []) };
}

export async function saveResult(mode, { score, character }) {
  const prevBest = await get(K.best(mode), 0);
  const isNewRecord = score > prevBest;
  const best = Math.max(prevBest, score);
  if (isNewRecord) await set(K.best(mode), best);
  const hist = await get(K.hist(mode), []);
  await set(K.hist(mode), [{ score, date: Date.now(), character }, ...hist].slice(0, HISTORY_LIMIT));
  return { best, isNewRecord };
}
