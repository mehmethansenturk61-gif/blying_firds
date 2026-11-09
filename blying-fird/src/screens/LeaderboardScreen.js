import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Backdrop, Button } from '../components/UI';
import { BirdIcon } from '../components/Birds';
import { getCharacter } from '../constants/characters';
import { MODES, TOP_INSET } from '../constants/config';
import { getScores } from '../storage/storage';

const fmt = (ts) => {
  const d = new Date(ts);
  return `${d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })} ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
};
const MEDAL = ['#f1c40f', '#bdc3c7', '#cd7f32'];

export default function LeaderboardScreen({ profile, onBack }) {
  const [tab, setTab] = useState('single');
  const [data, setData] = useState({ single: null, triple: null });
  useEffect(() => {
    Promise.all([getScores('single'), getScores('triple')]).then(([a, b]) => setData({ single: a, triple: b }));
  }, []);
  const d = data[tab];
  const rows = d ? [...d.history].sort((a, b) => b.score - a.score || b.date - a.date) : [];

  return (
    <View style={{ flex: 1 }}>
      <Backdrop themeId={profile.background} dim={0.3} />
      <View style={[styles.content, { paddingTop: TOP_INSET + 16 }]}>
        <Text style={styles.title}>Skor Tablosu</Text>
        <View style={styles.tabs}>
          {Object.values(MODES).map((m) => (
            <Pressable key={m.id} onPress={() => setTab(m.id)} style={[styles.tab, tab === m.id && styles.tabActive]}>
              <Text style={[styles.tabText, tab === m.id && { color: '#fff' }]}>{m.name}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.panel}>
          <Text style={styles.nick}>{profile.nickname}</Text>
          <Text style={styles.best}>Rekor: {d ? d.best : 0}</Text>
          <Text style={styles.sub}>Son oynanan maçlar (skora göre)</Text>
          <ScrollView style={{ width: '100%' }}>
            {rows.length === 0 ? <Text style={styles.empty}>Henüz oyun oynamadın.</Text> : null}
            {rows.map((r, i) => (
              <View key={`${r.date}-${i}`} style={styles.row}>
                <View style={[styles.rank, { backgroundColor: MEDAL[i] || '#9b59b6' }]}><Text style={styles.rankText}>{i + 1}</Text></View>
                <Text style={styles.score}>{r.score}</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.date}>{fmt(r.date)}</Text>
                  <Text style={styles.char}>{getCharacter(r.character).name}</Text>
                </View>
                <BirdIcon type={r.character} size={44} animate={false} />
              </View>
            ))}
          </ScrollView>
        </View>
        <Button title="Geri" color="gray" onPress={onBack} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  title: { fontSize: 34, fontWeight: '900', color: '#fff', marginBottom: 12, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 3 },
  tabs: { flexDirection: 'row', width: '100%', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 18, padding: 4, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: 'center' },
  tabActive: { backgroundColor: '#ff9f1c' },
  tabText: { fontSize: 18, fontWeight: '900', color: '#3b2a5a' },
  panel: { flex: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.93)', borderRadius: 22, padding: 14, alignItems: 'center' },
  nick: { fontSize: 22, fontWeight: '900', color: '#3b2a5a' },
  best: { fontSize: 20, fontWeight: '800', color: '#e67e22', marginTop: 2 },
  sub: { fontSize: 13, color: '#777', fontWeight: '700', marginVertical: 8 },
  empty: { textAlign: 'center', color: '#888', marginTop: 20, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f1ff', borderRadius: 14, padding: 8, marginBottom: 8 },
  rank: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  score: { fontSize: 26, fontWeight: '900', color: '#3b2a5a', marginLeft: 12, minWidth: 44 },
  date: { fontSize: 14, fontWeight: '700', color: '#555' },
  char: { fontSize: 13, color: '#888', fontWeight: '700' },
});
