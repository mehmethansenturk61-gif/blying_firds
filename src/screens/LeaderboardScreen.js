import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Backdrop, Button, hoverFx } from '../components/UI';
import { BirdIcon } from '../components/Birds';
import { getCharacter } from '../constants/characters';
import { MODES, TOP_INSET, TOP_LIMIT } from '../constants/config';
import { getScores } from '../storage/storage';

const fmt = (ts) => {
  if (!ts) return 'Kayıtlı rekor';
  const d = new Date(ts);
  return `${d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })} ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
};
const MEDAL = ['#f1c40f', '#bdc3c7', '#cd7f32'];

// Üstteki küçük sekme düğmesi (Solo/Trio ve En İyiler/Son Oyunlar)
function Tab({ label, active, onPress, color = '#ff9f1c' }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => [styles.tab, active && { backgroundColor: color }, !active && hovered ? styles.tabHover : null, hoverFx(hovered && !active, pressed, 1)]}
    >
      <Text style={[styles.tabText, active && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function LeaderboardScreen({ profile, onBack }) {
  const [tab, setTab] = useState('single');
  const [view, setView] = useState('top'); // top = en iyiler, recent = son oyunlar
  const [data, setData] = useState({ single: null, triple: null });
  useEffect(() => {
    Promise.all([getScores('single'), getScores('triple')]).then(([a, b]) => setData({ single: a, triple: b }));
  }, []);

  const d = data[tab];
  const best = d ? d.best : 0;
  // En iyiler: tüm zamanların en yüksek skorları (1. sıra = rekor). Son oyunlar: yeniden eskiye.
  const rows = d ? (view === 'top' ? d.top : d.history.slice(0, 15)) : [];
  const last = d && d.history[0] ? d.history[0].score : 0;

  return (
    <View style={{ flex: 1 }}>
      <Backdrop themeId={profile.background} dim={0.3} />
      <View style={[styles.content, { paddingTop: TOP_INSET + 16 }]}>
        <Text style={styles.title}>Skor Tablosu</Text>

        <View style={styles.tabs}>
          {Object.values(MODES).map((m) => (
            <Tab key={m.id} label={m.name} active={tab === m.id} onPress={() => setTab(m.id)} />
          ))}
        </View>

        {/* Rekor kartı */}
        <View style={styles.hero}>
          <BirdIcon type={profile.character} size={64} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.nick} numberOfLines={1}>{profile.nickname}</Text>
            <Text style={styles.heroLabel}>REKOR</Text>
            <Text style={styles.heroScore}>{best}</Text>
          </View>
        </View>
        <View style={styles.stats}>
          <Stat label="Oynanan oyun" value={d ? d.count : 0} />
          <Stat label="Ortalama" value={d ? d.average : 0} />
          <Stat label="Son skor" value={last} />
        </View>

        <View style={styles.panel}>
          <View style={styles.subTabs}>
            <Tab label="En İyiler" active={view === 'top'} onPress={() => setView('top')} color="#9b59b6" />
            <Tab label="Son Oyunlar" active={view === 'recent'} onPress={() => setView('recent')} color="#9b59b6" />
          </View>
          <Text style={styles.sub}>
            {view === 'top' ? `Tüm zamanların en yüksek ${TOP_LIMIT} skoru` : 'En son oynadığın maçlar (yeniden eskiye)'}
          </Text>
          <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
            {rows.length === 0 ? <Text style={styles.empty}>Henüz oyun oynamadın.</Text> : null}
            {rows.map((r, i) => {
              const isRecord = r.score > 0 && r.score === best;
              const pct = best > 0 ? Math.max(4, Math.round((r.score / best) * 100)) : 0;
              return (
                <View key={`${view}-${r.date}-${i}`} style={[styles.row, view === 'top' && i === 0 && styles.rowFirst]}>
                  {view === 'top' ? (
                    <View style={[styles.rank, { backgroundColor: MEDAL[i] || '#9b59b6' }]}><Text style={styles.rankText}>{i + 1}</Text></View>
                  ) : (
                    <View style={[styles.rank, { backgroundColor: isRecord ? '#f1c40f' : '#d8cdea' }]}><Text style={styles.rankText}>{isRecord ? '★' : '•'}</Text></View>
                  )}
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.rowTop}>
                      <Text style={styles.score}>{r.score}</Text>
                      {isRecord ? <Text style={styles.badge}>REKOR</Text> : null}
                    </View>
                    <View style={styles.bar}><View style={[styles.barFill, { width: `${pct}%`, backgroundColor: isRecord ? '#f1c40f' : '#b99be0' }]} /></View>
                    <Text style={styles.date}>{fmt(r.date)}{r.character ? ` · ${getCharacter(r.character).name}` : ''}</Text>
                  </View>
                  {r.character ? <BirdIcon type={r.character} size={44} animate={false} /> : null}
                </View>
              );
            })}
          </ScrollView>
        </View>
        <Button title="Geri" color="gray" onPress={onBack} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  title: { fontSize: 34, fontWeight: '900', color: '#fff', marginBottom: 10, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 3 },
  tabs: { flexDirection: 'row', width: '100%', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 18, padding: 4, marginBottom: 10 },
  subTabs: { flexDirection: 'row', width: '100%', backgroundColor: '#f1ebfa', borderRadius: 16, padding: 3 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 14, alignItems: 'center' },
  tabHover: { backgroundColor: 'rgba(155,89,182,0.14)' },
  tabText: { fontSize: 16, fontWeight: '900', color: '#3b2a5a' },
  hero: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 22, paddingVertical: 8, paddingHorizontal: 14, borderBottomWidth: 5, borderBottomColor: '#f1c40f' },
  nick: { fontSize: 20, fontWeight: '900', color: '#3b2a5a' },
  heroLabel: { fontSize: 12, fontWeight: '900', color: '#e67e22', letterSpacing: 2, marginTop: 2 },
  heroScore: { fontSize: 44, fontWeight: '900', color: '#e67e22', lineHeight: 48 },
  stats: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  stat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: 16, paddingVertical: 8, marginHorizontal: 3, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#3b2a5a' },
  statLabel: { fontSize: 11, fontWeight: '800', color: '#888', marginTop: 1 },
  panel: { flex: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 22, padding: 12, alignItems: 'center' },
  sub: { fontSize: 12, color: '#777', fontWeight: '700', marginVertical: 8, textAlign: 'center' },
  empty: { textAlign: 'center', color: '#888', marginTop: 20, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f1ff', borderRadius: 14, padding: 8, marginBottom: 8 },
  rowFirst: { backgroundColor: '#fff8dc', borderWidth: 2, borderColor: '#f1c40f' },
  rowTop: { flexDirection: 'row', alignItems: 'center' },
  rank: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  score: { fontSize: 26, fontWeight: '900', color: '#3b2a5a' },
  badge: { marginLeft: 8, fontSize: 11, fontWeight: '900', color: '#fff', backgroundColor: '#e67e22', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, overflow: 'hidden' },
  bar: { height: 6, borderRadius: 3, backgroundColor: '#e6dcf5', marginVertical: 3, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  date: { fontSize: 12, fontWeight: '700', color: '#777' },
});
