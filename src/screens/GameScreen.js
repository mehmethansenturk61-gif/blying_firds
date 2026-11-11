import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Platform, Animated, AppState, StyleSheet } from 'react-native';
import Svg, { G, Circle, Ellipse, Path } from 'react-native-svg';
import { SceneBack, SceneGround } from '../components/Scenes';
import Branch from '../components/Branch';
import { BirdArt, BirdIcon } from '../components/Birds';
import { Button, Hearts, Panel, SoundControls, PauseIcon, FILL, hoverFx } from '../components/UI';
import { useFrame } from '../components/FrameContext';
import { BALANCE as B, LAYOUT as L, MODES, WORLD_H, TOP_INSET } from '../constants/config';
import { createGame, update, flap, gapCenter } from '../game/engine';
import { saveResult, getScores } from '../storage/storage';
import { playFlap } from '../audio/sound';

export default function GameScreen({ mode, character, theme, onExit, onRestart }) {
  const { w, h } = useFrame();
  const s = h / WORLD_H;
  const W = (WORLD_H * w) / h;
  const g = useRef(null);
  if (!g.current) g.current = createGame(W, mode, theme.id === 'istanbul');

  // Performans optimizasyonu için state'leri daralttık, hareketlileri ref'e taşıdık
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(0);
  const saved = useRef(false);

  // UI ve Faz durumları
  const [ui, setUi] = useState('none');
  const uiRef = useRef('none');
  uiRef.current = ui;
  const [count, setCount] = useState(3);
  const paused = useRef(false);
  const [phase, setPhase] = useState('ready');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MODES[mode].lives);

  // Doğrudan DOM/SVG güncellemesi için referanslar (Re-render kısı Fargo)
  const birdGroupRef = useRef(null);
  const obstaclesContainerRef = useRef(null);

  const askExit = () => {
    if (g.current.phase === 'over') { onExit(); return; }
    paused.current = true;
    setUi('confirm');
  };
  const cancelExit = () => { setCount(3); setUi('count'); };

  const askPause = () => {
    if (g.current.phase !== 'playing' || paused.current) return;
    paused.current = true;
    setUi('paused');
  };
  const resume = () => { setCount(3); setUi('count'); };

  useEffect(() => {
    if (ui !== 'count') return undefined;
    const id = setTimeout(() => {
      if (count > 1) setCount((c) => c - 1);
      else { setUi('none'); paused.current = false; }
    }, 1000);
    return () => clearTimeout(id);
  }, [ui, count]);

  const doFlap = () => {
    if (paused.current) return;
    flap(g.current);
    if (g.current.phase === 'playing') playFlap();
  };

  // Yüksek performanslı 60 FPS Oyun Döngüsü (requestAnimationFrame)
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

      if (!paused.current) {
        update(g.current, dt);

        const game = g.current;
        const b = game.bird;

        // Kuş pozisyonunu re-render yaratmadan doğrudan güncelle
        if (birdGroupRef.current) {
          const transformStr = `translate(${b.x}, ${b.y}) rotate(${b.angle}) scale(${L.BIRD_SCALE})`;
          if (Platform.OS === 'web') {
            birdGroupRef.current.setAttribute('transform', transformStr);
          } else {
            birdGroupRef.current.setNativeProps({
              transform: [{ translateX: b.x }, { translateY: b.y }, { rotate: `${b.angle}deg` }, { scale: L.BIRD_SCALE }]
            });
          }
        }

        // Skor ve can değişikliklerini hafifçe senkronize et
        if (game.score !== score) setScore(game.score);
        if (game.lives !== lives) setLives(game.lives);
        if (game.phase !== phase) setPhase(game.phase);
      }

      if (g.current.phase === 'over') {
        finish();
        if (!g.current.particles.length) return;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, [phase, score, lives]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => { if (st !== 'active') askPause(); });
    return () => sub.remove();
  }, []);

  useEffect(() => { getScores(mode).then((r) => setBest(r.best)); }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!e.repeat) doFlap();
      } else if ((e.code === 'KeyP' || e.code === 'Escape') && !e.repeat) {
        if (uiRef.current === 'paused') resume();
        else if (uiRef.current === 'none') askPause();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const game = g.current;
  const blink = game.invincible > 0 && Math.floor(game.t * 12) % 2 === 0;
  const flapping = game.flapTimer > 0;
  const wing = Math.sin(game.t * (flapping ? 28 : 8)) * (flapping ? 40 : 14);
  const maxLives = MODES[mode].lives;
  const over = game.phase === 'over';

  return (
    <Pressable style={[styles.root, Platform.OS === 'web' ? { touchAction: 'manipulation', userSelect: 'none' } : null]} onPressIn={doFlap}>
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
          <G ref={birdGroupRef} transform={`translate(${game.bird.x} ${game.bird.y}) rotate(${game.bird.angle}) scale(${L.BIRD_SCALE})`} opacity={blink ? 0.3 : 1}>
            <BirdArt type={character} wing={game.phase === 'dead' ? 20 : wing} dead={game.phase === 'dead' || over} />
          </G>
        </Svg>
      </View>
      <SceneGround theme={theme} w={w} h={h} scroll={game.scroll} />
      
      {game.particles.length ? (
        <View pointerEvents="none" style={FILL}>
          <Svg width={w} height={h} viewBox={`0 0 ${W} ${WORLD_H}`}>
            {game.particles.map((p) => <Particle key={p.id} p={p} colors={theme.dust || ['#e6d5b5', '#c9b48a']} />)}
          </Svg>
        </View>
      ) : null}

      {/* HUD */}
      <View pointerEvents="none" style={[styles.hud, { top: TOP_INSET }]}>
        <Text style={styles.score}>{score}</Text>
      </View>
      <View pointerEvents="none" style={[styles.right, { top: TOP_INSET + 4 }]}>
        <Text style={styles.record}>Rekor: {Math.max(best, score)}</Text>
        {maxLives > 1 ? <View style={{ marginTop: 4 }}><Hearts lives={lives} max={maxLives} size={26} /></View> : null}
      </View>
      <Pressable onPress={askExit} style={({ pressed, hovered }) => [styles.exit, { top: TOP_INSET + 4 }, hoverFx(hovered, pressed, 2)]}>
        <Text style={styles.exitText}>✕</Text>
      </Pressable>
      {game.phase === 'playing' && ui === 'none' ? (
        <Pressable onPress={askPause} style={({ pressed, hovered }) => [styles.exit, { top: TOP_INSET + 4, left: 62 }, hoverFx(hovered, pressed, 2)]}>
          <PauseIcon size={20} />
        </Pressable>
      ) : null}
      <SoundControls vertical style={{ position: 'absolute', left: 14, top: TOP_INSET + 52 }} />

      {game.phase === 'ready' ? (
        <View pointerEvents="none" style={styles.hint}>
          <Text style={styles.hintText}>Başlamak için dokun</Text>
          {Platform.OS === 'web' ? <Text style={styles.hintSub}>(Boşluk tuşu veya fare tıklaması)</Text> : null}
        </View>
      ) : null}

      {over && result ? (
        <View style={styles.overlay}>
          <Panel style={{ maxWidth: 360 }}>
            <BirdIcon type={character} size={72} animate={false} dead />
            <Text style={styles.overTitle}>Oyun Bitti</Text>
            <Text style={styles.label}>Skor</Text>
            <Text style={styles.big}>{score}</Text>
            <Text style={styles.recordBig}>Rekor ({MODES[mode].name}): {result.best}</Text>
            {result.isNewRecord ? <Text style={styles.newRecord}>Yeni Rekor!</Text> : null}
            <View style={{ width: '100%', marginTop: 14 }}>
              <Button title="Tekrar Oyna" color="green" onPress={onRestart} />
              <Button title="Ana Menü" color="blue" onPress={onExit} style={{ marginBottom: 0 }} />
            </View>
          </Panel>
        </View>
      ) : null}

      {ui === 'confirm' ? (
        <View style={styles.overlay}>
          <Panel style={{ maxWidth: 360 }}>
            <Text style={styles.confirmTitle}>Gerçekten çıkmak istiyor musunuz?</Text>
            <View style={styles.confirmRow}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Button title="Evet" color="red" onPress={onExit} style={{ marginBottom: 0 }} />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Button title="İptal Et" color="green" onPress={cancelExit} style={{ marginBottom: 0 }} />
              </View>
            </View>
          </Panel>
        </View>
      ) : null}

      {ui === 'paused' ? (
        <View style={styles.overlay}>
          <Panel style={{ maxWidth: 360 }}>
            <Text style={styles.pauseTitle}>Duraklatıldı</Text>
            <Text style={styles.pauseSub}>Skor: {score}</Text>
            <View style={{ width: '100%', marginTop: 14 }}>
              <Button title="Devam Et" color="green" onPress={resume} />
              <Button title="Ana Menü" color="blue" onPress={onExit} style={{ marginBottom: 0 }} />
            </View>
          </Panel>
        </View>
      ) : null}

      {ui === 'count' ? <Countdown value={count} /> : null}
    </Pressable>
  );
}

function Particle({ p, colors }) {
  if (p.age < 0) return null;
  const k = p.age / p.life;
  if (p.kind === 'ring') {
    const r = p.r + p.age * 95;
    return <Ellipse cx={p.x} cy={p.y} rx={r} ry={r * 0.26} fill="none" stroke="#eaf8ff" strokeWidth={2.4} opacity={(1 - k) * 0.85} />;
  }
  if (p.kind === 'drop') {
    return <Circle cx={p.x} cy={p.y} r={p.r * (1 - k * 0.4)} fill="#bfe8ff" stroke="#ffffff" strokeWidth={1} opacity={1 - k * 0.7} />;
  }
  if (p.kind === 'dring') {
    const r = p.r + p.age * 210;
    return <Ellipse cx={p.x} cy={p.y} rx={r} ry={r * 0.16} fill="none" stroke={colors[0]} strokeWidth={5 * (1 - k) + 1} opacity={(1 - k) * 0.8} />;
  }
  if (p.kind === 'grain') {
    return <Circle cx={p.x} cy={p.y} r={p.r} fill={colors[p.c]} opacity={k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1} />;
  }
  if (p.kind === 'feather') {
    return (
      <G transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`} opacity={k > 0.65 ? 1 - (k - 0.65) / 0.35 : 1}>
        <Ellipse cx={0} cy={0} rx={p.r} ry={p.r * 0.3} fill="#f7f1e6" stroke="#cfc3ae" strokeWidth={0.8} />
        <Path d={`M${-p.r} 0 L${p.r} 0`} stroke="#bfae94" strokeWidth={0.9} />
      </G>
    );
  }
  return <Circle cx={p.x} cy={p.y} r={p.r * (1 + k * 1.6)} fill={colors[0]} opacity={(1 - k) * 0.65} />;
}

const COUNT_COLORS = { 3: '#ffd23f', 2: '#ff9f1c', 1: '#2ecc71' };

function Countdown({ value }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    a.setValue(0);
    Animated.timing(a, { toValue: 1, duration: 900, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [value]);
  const scale = a.interpolate({ inputRange: [0, 0.25, 1], outputRange: [2.4, 1, 0.75] });
  const opacity = a.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 1, 1, 0] });
  return (
    <View pointerEvents="none" style={styles.countWrap}>
      <Animated.Text style={[styles.countText, { color: COUNT_COLORS[value] || '#fff', opacity, transform: [{ scale }] }]}>{value}</Animated.Text>
      <Text style={styles.countHint}>Hazır ol!</Text>
    </View>
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
  overlay: { ...FILL, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  confirmTitle: { fontSize: 24, fontWeight: '900', color: '#3b2a5a', textAlign: 'center', marginBottom: 18 },
  confirmRow: { flexDirection: 'row', width: '100%' },
  countWrap: { ...FILL, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 150, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.55)', textShadowOffset: { width: 0, height: 6 }, textShadowRadius: 4 },
  countHint: { fontSize: 22, fontWeight: '900', color: '#fff', marginTop: 4, ...shadow },
  pauseTitle: { fontSize: 34, fontWeight: '900', color: '#3b2a5a' },
  pauseSub: { fontSize: 20, fontWeight: '800', color: '#e67e22', marginTop: 4 },
  overTitle: { fontSize: 34, fontWeight: '900', color: '#c0392b' },
  label: { fontSize: 16, fontWeight: '800', color: '#777', marginTop: 8 },
  big: { fontSize: 64, fontWeight: '900', color: '#3b2a5a', lineHeight: 70 },
  recordBig: { fontSize: 20, fontWeight: '800', color: '#e67e22' },
  newRecord: { fontSize: 26, fontWeight: '900', color: '#27ae60', marginTop: 6 },
});