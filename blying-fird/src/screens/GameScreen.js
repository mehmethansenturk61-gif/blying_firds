import React, { useEffect, useReducer, useRef, useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import Svg, { G } from 'react-native-svg';
import { SceneBack, SceneGround } from '../components/Scenes';
import Branch from '../components/Branch';
import { BirdArt } from '../components/Birds';
import { Button, Hearts, Panel } from '../components/UI';
import { useFrame } from '../components/FrameContext';
import { BALANCE as B, LAYOUT as L, MODES, WORLD_H, TOP_INSET } from '../constants/config';
import { createGame, update, flap, gapCenter } from '../game/engine';
import { saveResult, getScores } from '../storage/storage';

export default function GameScreen({ mode, character, theme, onExit, onRestart }) {
  const { w, h } = useFrame();
  const s = h / WORLD_H;
  const W = (WORLD_H * w) / h;
  const g = useRef(null);
  if (!g.current) g.current = createGame(W, mode);
  const [, force] = useReducer((x) => x + 1, 0);
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(0);
  const saved = useRef(false);

  // Oyun döngüsü: requestAnimationFrame + delta time
  useEffect(() => {
    let raf, last = null, alive = true;
    const finish = () => {
      if (saved.current) return;
      saved.current = true;
      saveResult(mode, { score: g.current.score, character }).then(setResult);
    };
    const loop = (ts) => {
      if (!alive) return;
      if (last === null) last = ts;
      const dt = Math.min((ts - last) / 1000, L.MAX_DT);
      last = ts;
      update(g.current, dt);
      force();
      if (g.current.phase === 'over') { finish(); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, []);

  // Bu moddaki mevcut rekor (sağ üstte gösterilir)
  useEffect(() => { getScores(mode).then((r) => setBest(r.best)); }, []);

  // Masaüstü: Boşluk / Yukarı ok tuşu
  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!e.repeat) flap(g.current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const game = g.current;
  const b = game.bird;
  const blink = game.invincible > 0 && Math.floor(game.t * 12) % 2 === 0;
  const flapping = game.flapTimer > 0;
  const wing = Math.sin(game.t * (flapping ? 28 : 8)) * (flapping ? 40 : 14);
  const maxLives = MODES[mode].lives;
  const over = game.phase === 'over';

  return (
    <Pressable style={[styles.root, Platform.OS === 'web' ? { touchAction: 'manipulation', userSelect: 'none' } : null]} onPressIn={() => flap(g.current)}>
      <SceneBack theme={theme} w={w} h={h} scroll={game.scroll} />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Svg width={w} height={h} viewBox={`0 0 ${W} ${WORLD_H}`}>
          {game.obstacles.map((o) => {
            const c = gapCenter(o);
            const half = B.GAP_SIZE / 2;
            return (
              <React.Fragment key={o.id}>
                <Branch x={o.x} y={c - half} colors={theme.branch} />
                <Branch x={o.x} y={c + half} flip colors={theme.branch} />
              </React.Fragment>
            );
          })}
          <G transform={`translate(${b.x} ${b.y}) rotate(${b.angle}) scale(${L.BIRD_SCALE})`} opacity={blink ? 0.3 : 1}>
            <BirdArt type={character} wing={game.phase === 'dead' ? 20 : wing} />
          </G>
        </Svg>
      </View>
      <SceneGround theme={theme} w={w} h={h} scroll={game.scroll} />

      {/* HUD */}
      <View pointerEvents="none" style={[styles.hud, { top: TOP_INSET }]}>
        <Text style={styles.score}>{game.score}</Text>
      </View>
      <View pointerEvents="none" style={[styles.right, { top: TOP_INSET + 4 }]}>
        <Text style={styles.record}>Rekor: {Math.max(best, game.score)}</Text>
        {maxLives > 1 ? <View style={{ marginTop: 4 }}><Hearts lives={game.lives} max={maxLives} size={26} /></View> : null}
      </View>
      <Pressable onPress={onExit} style={[styles.exit, { top: TOP_INSET + 4 }]}>
        <Text style={styles.exitText}>✕</Text>
      </Pressable>

      {game.phase === 'ready' ? (
        <View pointerEvents="none" style={styles.hint}>
          <Text style={styles.hintText}>Başlamak için dokun</Text>
          {Platform.OS === 'web' ? <Text style={styles.hintSub}>(Boşluk tuşu veya fare tıklaması)</Text> : null}
        </View>
      ) : null}

      {over && result ? (
        <View style={styles.overlay}>
          <Panel style={{ maxWidth: 360 }}>
            <Text style={styles.overTitle}>Oyun Bitti</Text>
            <Text style={styles.label}>Skor</Text>
            <Text style={styles.big}>{game.score}</Text>
            <Text style={styles.recordBig}>Rekor ({MODES[mode].name}): {result.best}</Text>
            {result.isNewRecord ? <Text style={styles.newRecord}>Yeni Rekor!</Text> : null}
            <View style={{ width: '100%', marginTop: 14 }}>
              <Button title="Tekrar Oyna" color="green" onPress={onRestart} />
              <Button title="Ana Menü" color="blue" onPress={onExit} style={{ marginBottom: 0 }} />
            </View>
          </Panel>
        </View>
      ) : null}
    </Pressable>
  );
}

const shadow = { textShadowColor: 'rgba(0,0,0,0.45)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 3 };
const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  hud: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  score: { fontSize: 64, fontWeight: '900', color: '#fff', ...shadow },
  right: { position: 'absolute', right: 14, alignItems: 'flex-end' },
  record: { fontSize: 15, fontWeight: '900', color: '#fff', ...shadow },
  exit: { position: 'absolute', left: 14, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  exitText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  hint: { position: 'absolute', left: 0, right: 0, top: '58%', alignItems: 'center' },
  hintText: { fontSize: 26, fontWeight: '900', color: '#fff', ...shadow },
  hintSub: { fontSize: 15, fontWeight: '700', color: '#fff', marginTop: 4, ...shadow },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  overTitle: { fontSize: 34, fontWeight: '900', color: '#c0392b' },
  label: { fontSize: 16, fontWeight: '800', color: '#777', marginTop: 8 },
  big: { fontSize: 64, fontWeight: '900', color: '#3b2a5a', lineHeight: 70 },
  recordBig: { fontSize: 20, fontWeight: '800', color: '#e67e22' },
  newRecord: { fontSize: 26, fontWeight: '900', color: '#27ae60', marginTop: 6 },
});
