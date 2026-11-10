import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Ellipse, Path, Polygon, G, Line } from 'react-native-svg';
import { WORLD_H as H, LAYOUT } from '../constants/config';

export const TILE = 600; // tekrar eden arka plan parçasının genişliği (mantıksal birim)
const GY = H - LAYOUT.GROUND_H; // zemin üst çizgisi

/* ---------- ortak yardımcılar ---------- */
// TILE içinde tam periyotlu dalga (kenarlarda kesintisiz birleşir). bottom=null -> sadece çizgi
const wave = (base, amp, k, ph = 0, bottom = H, step = 20) => {
  let d = '';
  for (let x = 0; x <= TILE; x += step) {
    const y = base + amp * Math.sin((2 * Math.PI * k * x) / TILE + ph);
    d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
  }
  return bottom === null ? d : `${d}L${TILE} ${bottom} L0 ${bottom} Z`;
};
// Sivri tepeli sıradağ (ilk ve son y aynı olmalı)
const ridge = (pts) => `M0 ${H} ${pts.map(([x, y]) => `L${x} ${y}`).join(' ')} L${TILE} ${H} Z`;
// Çam ormanı gibi tırtıklı sırt
const jag = (base, amp, k, ph, j) => {
  let d = `M0 ${H} `;
  for (let i = 0; i <= 60; i++) {
    const x = i * 10;
    d += `L${x} ${(base + amp * Math.sin((2 * Math.PI * k * x) / TILE + ph) - (i % 2 ? j : 0)).toFixed(1)} `;
  }
  return `${d}L${TILE} ${H} Z`;
};
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const cloud = (x, y, sc, fill, op, k, tall = 1) => (
  <G key={k} opacity={op}>
    <Ellipse cx={x} cy={y} rx={50 * sc} ry={11 * sc * tall} fill={fill} />
    <Ellipse cx={x - 28 * sc} cy={y + 6 * sc} rx={34 * sc} ry={9 * sc * tall} fill={fill} />
    <Ellipse cx={x + 30 * sc} cy={y + 7 * sc} rx={38 * sc} ry={9 * sc * tall} fill={fill} />
  </G>
);
const groundBase = (top, body, topH = 12) => (
  <G>
    <Rect x={0} y={GY} width={TILE} height={H - GY} fill={body} />
    <Rect x={0} y={GY} width={TILE} height={topH} fill={top} />
  </G>
);

/* ================= KAPADOKYA ================= */
const K = (n) => `url(#g-kapadokya-${n})`;
const balloon = (x, y, sc, c1, c2, k) => (
  <G key={k}>
    <Path d={`M${x - 24 * sc} ${y} C${x - 24 * sc} ${y - 34 * sc} ${x + 24 * sc} ${y - 34 * sc} ${x + 24 * sc} ${y} C${x + 24 * sc} ${y + 18 * sc} ${x + 7 * sc} ${y + 30 * sc} ${x + 6 * sc} ${y + 36 * sc} L${x - 6 * sc} ${y + 36 * sc} C${x - 7 * sc} ${y + 30 * sc} ${x - 24 * sc} ${y + 18 * sc} ${x - 24 * sc} ${y}Z`} fill={c1} />
    <Path d={`M${x - 10 * sc} ${y - 2 * sc} C${x - 10 * sc} ${y - 33 * sc} ${x + 10 * sc} ${y - 33 * sc} ${x + 10 * sc} ${y - 2 * sc} C${x + 10 * sc} ${y + 16 * sc} ${x + 4 * sc} ${y + 30 * sc} ${x + 3 * sc} ${y + 36 * sc} L${x - 3 * sc} ${y + 36 * sc} C${x - 4 * sc} ${y + 30 * sc} ${x - 10 * sc} ${y + 16 * sc} ${x - 10 * sc} ${y - 2 * sc}Z`} fill={c2} />
    <Ellipse cx={x - 12 * sc} cy={y - 10 * sc} rx={4 * sc} ry={11 * sc} fill="#fff" opacity={0.25} />
    <Line x1={x - 6 * sc} y1={y + 36 * sc} x2={x - 5 * sc} y2={y + 52 * sc} stroke="#5b3a29" strokeWidth={1.4} />
    <Line x1={x + 6 * sc} y1={y + 36 * sc} x2={x + 5 * sc} y2={y + 52 * sc} stroke="#5b3a29" strokeWidth={1.4} />
    <Rect x={x - 6 * sc} y={y + 52 * sc} width={12 * sc} height={9 * sc} rx={2} fill="#7a4a2b" />
  </G>
);
const mesa = (x, w, h, k) => (
  <G key={k}>
    <Path d={`M${x} ${GY + 8} L${x + w * 0.08} ${GY - h} L${x + w * 0.92} ${GY - h} L${x + w} ${GY + 8}Z`} fill={K('mesa')} />
    {[0.25, 0.5, 0.75].map((f, i) => (
      <Line key={i} x1={x + w * 0.08 * f} y1={GY - h * f} x2={x + w - w * 0.08 * f} y2={GY - h * f} stroke="#f2b88e" strokeWidth={2} opacity={0.45} />
    ))}
    <Path d={`M${x + w * 0.62} ${GY - h} L${x + w * 0.92} ${GY - h} L${x + w} ${GY + 8} L${x + w * 0.72} ${GY + 8}Z`} fill="#000" opacity={0.1} />
    <Ellipse cx={x + w * 0.3} cy={GY - h * 0.6} rx={3.5} ry={5} fill="#5a321f" opacity={0.65} />
    <Ellipse cx={x + w * 0.55} cy={GY - h * 0.4} rx={3.5} ry={5} fill="#5a321f" opacity={0.65} />
    <Ellipse cx={x + w * 0.72} cy={GY - h * 0.72} rx={3} ry={4.5} fill="#5a321f" opacity={0.65} />
  </G>
);
const chimney = (x, h, w, k) => (
  <G key={k}>
    <Path d={`M${x - w / 2} ${GY + 8} Q${x - w * 0.2} ${GY - h * 0.5} ${x - w * 0.16} ${GY - h} L${x + w * 0.16} ${GY - h} Q${x + w * 0.2} ${GY - h * 0.5} ${x + w / 2} ${GY + 8}Z`} fill={K('chim')} />
    <Path d={`M${x + w * 0.02} ${GY - h} L${x + w * 0.16} ${GY - h} Q${x + w * 0.2} ${GY - h * 0.5} ${x + w / 2} ${GY + 8} L${x + w * 0.05} ${GY + 8}Z`} fill="#6b3a22" opacity={0.18} />
    <Path d={`M${x - w * 0.3} ${GY - h + 2} Q${x - w * 0.3} ${GY - h - w * 0.32} ${x} ${GY - h - w * 0.42} Q${x + w * 0.3} ${GY - h - w * 0.32} ${x + w * 0.3} ${GY - h + 2}Z`} fill="#7b4b33" />
    <Path d={`M${x - 5} ${GY - h * 0.15} L${x - 5} ${GY - h * 0.15 - 10} A5 5 0 0 1 ${x + 5} ${GY - h * 0.15 - 10} L${x + 5} ${GY - h * 0.15}Z`} fill="#5a321f" />
    <Ellipse cx={x} cy={GY - h * 0.55} rx={3} ry={4.5} fill="#5a321f" opacity={0.7} />
  </G>
);

/* ================= EGE SAHİLİ (Muğla / Antalya esinli) ================= */
const EG = (n) => `url(#g-ege-${n})`;
const egePine = (x, y, sc, k) => (
  <G key={k}>
    <Rect x={x - 1.5 * sc} y={y - 5 * sc} width={3 * sc} height={7 * sc} fill="#4a3322" />
    <Polygon points={`${x - 13 * sc},${y - 3 * sc} ${x + 13 * sc},${y - 3 * sc} ${x},${y - 30 * sc}`} fill="#2b6b45" />
    <Polygon points={`${x - 10 * sc},${y - 18 * sc} ${x + 10 * sc},${y - 18 * sc} ${x},${y - 44 * sc}`} fill="#357d52" />
  </G>
);
// 1800 birimlik periyotta dalga (Ege haritası için)
const waveT = (base, amp, k, ph = 0, bottom = H, step = 20) => {
  let d = '';
  for (let x = 0; x <= 1800; x += step) {
    d += `${x === 0 ? 'M' : 'L'}${x} ${(base + amp * Math.sin((2 * Math.PI * k * x) / 1800 + ph)).toFixed(1)} `;
  }
  return bottom === null ? d : `${d}L1800 ${bottom} L0 ${bottom} Z`;
};
// Çam kaplı, beyaz evli tepe
const egeHill = (k) => (
  <G key={k}>
    <Path d="M320 596 Q350 522 410 506 Q470 490 520 514 Q562 540 582 596 Z" fill={EG('hill')} />
    <Ellipse cx={452} cy={597} rx={136} ry={5} fill="#ffffff" opacity={0.6} />
    {[[408, 548], [430, 538], [455, 530], [482, 534], [506, 548], [470, 552], [440, 558]].map(([x, y], i) => (<G key={`h${i}`}><Rect x={x - 6} y={y - 8} width={12} height={9} fill="#ffffff" /><Polygon points={`${x - 8},${y - 8} ${x + 8},${y - 8} ${x},${y - 15}`} fill="#d9653b" /></G>))}
    {[[352, 578, 0.55], [372, 556, 0.5], [392, 540, 0.45], [540, 560, 0.5], [558, 580, 0.55], [524, 530, 0.4]].map(([x, y, sc], i) => egePine(x, y, sc, `p${i}`))}
  </G>
);
const egeBoat = (x, y, sc, k) => (
  <G key={k}>
    <Ellipse cx={x} cy={y + 12 * sc} rx={26 * sc} ry={2.6 * sc} fill="#0e6f96" opacity={0.3} />
    <Rect x={x - 1} y={y - 46 * sc} width={2} height={46 * sc} fill="#7a6a5a" />
    <Polygon points={`${x + 2},${y - 44 * sc} ${x + 2},${y - 4 * sc} ${x + 24 * sc},${y - 4 * sc}`} fill="#ffffff" />
    <Polygon points={`${x - 2},${y - 38 * sc} ${x - 2},${y - 4 * sc} ${x - 20 * sc},${y - 4 * sc}`} fill="#ffe9c8" />
    <Path d={`M${x - 28 * sc} ${y} L${x + 28 * sc} ${y} L${x + 19 * sc} ${y + 10 * sc} L${x - 19 * sc} ${y + 10 * sc} Z`} fill="#f6f6f6" />
    <Path d={`M${x - 26 * sc} ${y + 3 * sc} L${x + 26 * sc} ${y + 3 * sc} L${x + 24 * sc} ${y + 5.5 * sc} L${x - 24 * sc} ${y + 5.5 * sc} Z`} fill="#2f7fd1" />
  </G>
);
const egeGulet = (x, y, sc, k) => (
  <G key={k}>
    <Ellipse cx={x} cy={y + 12 * sc} rx={40 * sc} ry={3 * sc} fill="#0e6f96" opacity={0.3} />
    <Rect x={x - 14 * sc} y={y - 38 * sc} width={1.8} height={38 * sc} fill="#6b4a2a" />
    <Rect x={x + 12 * sc} y={y - 32 * sc} width={1.8} height={32 * sc} fill="#6b4a2a" />
    <Polygon points={`${x - 12 * sc},${y - 36 * sc} ${x - 12 * sc},${y - 4 * sc} ${x + 8 * sc},${y - 4 * sc}`} fill="#f4ead2" />
    <Polygon points={`${x + 14 * sc},${y - 30 * sc} ${x + 14 * sc},${y - 4 * sc} ${x + 30 * sc},${y - 4 * sc}`} fill="#f4ead2" />
    <Rect x={x - 8 * sc} y={y - 10 * sc} width={26 * sc} height={9 * sc} fill="#ffffff" />
    <Path d={`M${x - 40 * sc} ${y - 2 * sc} L${x + 38 * sc} ${y - 2 * sc} Q${x + 34 * sc} ${y + 10 * sc} ${x + 22 * sc} ${y + 10 * sc} L${x - 30 * sc} ${y + 10 * sc} Q${x - 38 * sc} ${y + 6 * sc} ${x - 40 * sc} ${y - 2 * sc} Z`} fill="#9a6a3a" />
    <Rect x={x - 36 * sc} y={y + 1 * sc} width={72 * sc} height={2} fill="#6b4524" />
  </G>
);
const egePalm = (x, y, sc, k) => {
  const tx = x + 2 * sc, ty = y - 58 * sc;
  return (
    <G key={k}>
      <Path d={`M${x} ${y} Q${x + 7 * sc} ${y - 30 * sc} ${tx} ${ty}`} stroke="#8a6038" strokeWidth={5 * sc} strokeLinecap="round" fill="none" />
      {[-150, -110, -70, -30, 10, 40, 140, 172].map((a, i) => (
        <Ellipse key={i} cx={tx + 21 * sc} cy={ty} rx={22 * sc} ry={4.8 * sc} fill={i % 2 ? '#3fb36a' : '#2f9a55'} transform={`rotate(${a} ${tx} ${ty})`} />
      ))}
      <Circle cx={tx - 2 * sc} cy={ty + 4 * sc} r={3 * sc} fill="#6b4524" />
      <Circle cx={tx + 3 * sc} cy={ty + 5 * sc} r={3 * sc} fill="#7a5230" />
    </G>
  );
};
const egeParasol = (x, y, sc, c, k) => (
  <G key={k}>
    <Rect x={x - 1} y={y - 56 * sc} width={2} height={56 * sc} fill="#8a6a4a" />
    <Path d={`M${x - 30 * sc} ${y - 50 * sc} Q${x} ${y - 86 * sc} ${x + 30 * sc} ${y - 50 * sc} Z`} fill={c} />
    <Path d={`M${x - 10 * sc} ${y - 50 * sc} Q${x - 6 * sc} ${y - 74 * sc} ${x} ${y - 74 * sc} Q${x + 6 * sc} ${y - 74 * sc} ${x + 10 * sc} ${y - 50 * sc} Z`} fill="#ffffff" opacity={0.9} />
  </G>
);
const SKIN = ['#f1c9a0', '#c98f62', '#8d5a3a'];
// Şezlong: arkalığı yatık, çizgili havlulu
const egeLounger = (x, y, sc, c, k) => (
  <G key={k}>
    <Rect x={x - 15 * sc} y={y - 4 * sc} width={2.4 * sc} height={4 * sc} fill="#9a8a78" />
    <Rect x={x + 13 * sc} y={y - 4 * sc} width={2.4 * sc} height={4 * sc} fill="#9a8a78" />
    <Path d={`M${x - 17 * sc} ${y - 8 * sc} L${x + 16 * sc} ${y - 8 * sc} L${x + 18 * sc} ${y - 4 * sc} L${x - 17 * sc} ${y - 4 * sc} Z`} fill="#ffffff" />
    <Polygon points={`${x - 17 * sc},${y - 8 * sc} ${x - 26 * sc},${y - 22 * sc} ${x - 19 * sc},${y - 24 * sc} ${x - 10 * sc},${y - 8 * sc}`} fill="#ffffff" />
    <Rect x={x - 8 * sc} y={y - 8.6 * sc} width={4 * sc} height={4.6 * sc} fill={c} />
    <Rect x={x + 2 * sc} y={y - 8.6 * sc} width={4 * sc} height={4.6 * sc} fill={c} />
  </G>
);
// Ayakta insan (kollar aşağı ya da yukarı)
const egePerson = (x, y, sc, skin, top, bottom, armsUp, k) => (
  <G key={k}>
    <Rect x={x - 5 * sc} y={y - 15 * sc} width={3.6 * sc} height={15 * sc} rx={1.5} fill={skin} />
    <Rect x={x + 1.4 * sc} y={y - 15 * sc} width={3.6 * sc} height={15 * sc} rx={1.5} fill={skin} />
    <Rect x={x - 6 * sc} y={y - 20 * sc} width={12 * sc} height={8 * sc} rx={2} fill={bottom} />
    <Rect x={x - 6 * sc} y={y - 34 * sc} width={12 * sc} height={16 * sc} rx={4} fill={top} />
    {armsUp ? (
      <Path d={`M${x - 6 * sc} ${y - 31 * sc} L${x - 10 * sc} ${y - 46 * sc} M${x + 6 * sc} ${y - 31 * sc} L${x + 10 * sc} ${y - 46 * sc}`} stroke={skin} strokeWidth={3.4 * sc} strokeLinecap="round" />
    ) : (
      <Path d={`M${x - 6 * sc} ${y - 31 * sc} L${x - 9 * sc} ${y - 19 * sc} M${x + 6 * sc} ${y - 31 * sc} L${x + 9 * sc} ${y - 19 * sc}`} stroke={skin} strokeWidth={3.4 * sc} strokeLinecap="round" />
    )}
    <Circle cx={x} cy={y - 40 * sc} r={5.4 * sc} fill={skin} />
    <Path d={`M${x - 5.6 * sc} ${y - 40 * sc} A5.6 5.6 0 0 1 ${x + 5.6 * sc} ${y - 40 * sc} Z`} fill="#3b2a1e" />
  </G>
);
// Şezlongda güneşlenen insan
const egeSunbather = (x, y, sc, skin, suit, k) => (
  <G key={k}>
    <Rect x={x - 12 * sc} y={y - 17 * sc} width={20 * sc} height={8 * sc} rx={3} fill={suit} transform={`rotate(-12 ${x} ${y - 12 * sc})`} />
    <Rect x={x + 6 * sc} y={y - 15 * sc} width={18 * sc} height={4.4 * sc} rx={2} fill={skin} />
    <Circle cx={x - 20 * sc} cy={y - 21 * sc} r={5 * sc} fill={skin} />
    <Path d={`M${x - 25 * sc} ${y - 21 * sc} A5 5 0 0 1 ${x - 15 * sc} ${y - 21 * sc} Z`} fill="#2a1f16" />
    <Rect x={x - 28 * sc} y={y - 27 * sc} width={16 * sc} height={2.4 * sc} rx={1.2} fill="#ffffff" opacity={0.9} />
  </G>
);
// Suda yüzen insan
const egeSwimmer = (x, y, skin, k) => (
  <G key={k}>
    <Ellipse cx={x} cy={y + 4} rx={16} ry={3} fill="#ffffff" opacity={0.55} />
    <Path d={`M${x + 2} ${y} Q${x + 16} ${y - 14} ${x + 26} ${y - 2}`} stroke={skin} strokeWidth={3.6} strokeLinecap="round" fill="none" />
    <Circle cx={x} cy={y - 3} r={5.4} fill={skin} />
    <Path d={`M${x - 5.4} ${y - 3} A5.4 5.4 0 0 1 ${x + 5.4} ${y - 3} Z`} fill="#3b2a1e" />
  </G>
);
// Jet-ski: sağa doğru hızla gider, arkasında köpük izi
const egeJet = (x, y, sc, c, skin, k) => (
  <G key={k}>
    <Path d={`M${x - 28 * sc} ${y + 4 * sc} Q${x - 70 * sc} ${y + 7 * sc} ${x - 130 * sc} ${y + 11 * sc} L${x - 130 * sc} ${y + 5 * sc} Q${x - 70 * sc} ${y + 1 * sc} ${x - 28 * sc} ${y - 1 * sc} Z`} fill="#ffffff" opacity={0.65} />
    {[[-40, 2], [-56, 0], [-72, 3], [-90, 1]].map(([dx, dy], i) => (<Circle key={i} cx={x + dx * sc} cy={y + dy * sc - 4 * sc} r={(3 - i * 0.4) * sc} fill="#ffffff" opacity={0.8} />))}
    <Path d={`M${x - 28 * sc} ${y} Q${x - 22 * sc} ${y - 9 * sc} ${x - 2 * sc} ${y - 10 * sc} L${x + 22 * sc} ${y - 10 * sc} Q${x + 34 * sc} ${y - 8 * sc} ${x + 40 * sc} ${y - 1 * sc} L${x + 32 * sc} ${y + 5 * sc} L${x - 26 * sc} ${y + 5 * sc} Z`} fill={c} />
    <Rect x={x - 24 * sc} y={y + 1 * sc} width={58 * sc} height={2 * sc} fill="#ffffff" opacity={0.9} />
    <Rect x={x - 14 * sc} y={y - 14 * sc} width={26 * sc} height={5 * sc} rx={2} fill="#2b2f3a" />
    <Polygon points={`${x + 12 * sc},${y - 10 * sc} ${x + 20 * sc},${y - 22 * sc} ${x + 24 * sc},${y - 22 * sc} ${x + 24 * sc},${y - 10 * sc}`} fill="#bfe9ff" opacity={0.85} />
    <Rect x={x - 12 * sc} y={y - 28 * sc} width={9 * sc} height={14 * sc} rx={3} fill="#f5b700" />
    <Path d={`M${x - 4 * sc} ${y - 24 * sc} L${x + 16 * sc} ${y - 18 * sc}`} stroke={skin} strokeWidth={3 * sc} strokeLinecap="round" />
    <Circle cx={x - 8 * sc} cy={y - 33 * sc} r={5 * sc} fill={skin} />
    <Path d={`M${x - 13 * sc} ${y - 33 * sc} A5 5 0 0 1 ${x - 3 * sc} ${y - 33 * sc} Z`} fill="#e74c3c" />
  </G>
);
// Voleybol filesi: direkler, ağ, ağ üstü bant + havadaki top
const egeNet = (x, y, k) => (
  <G key={k}>
    <Rect x={x - 38} y={y - 56} width={3.4} height={56} fill="#8a6a4a" />
    <Rect x={x + 35} y={y - 56} width={3.4} height={56} fill="#8a6a4a" />
    <Rect x={x - 36} y={y - 52} width={74} height={22} fill="#ffffff" opacity={0.22} />
    {range(0, 12).map((i) => (<Rect key={`v${i}`} x={x - 36 + i * 6.2} y={y - 52} width={0.8} height={22} fill="#ffffff" opacity={0.7} />))}
    {range(0, 3).map((i) => (<Rect key={`h${i}`} x={x - 36} y={y - 50 + i * 7} width={74} height={0.8} fill="#ffffff" opacity={0.7} />))}
    <Rect x={x - 37} y={y - 54} width={76} height={3.4} fill="#ffffff" />
    <Circle cx={x + 6} cy={y - 92} r={6} fill="#ffffff" stroke="#e74c3c" strokeWidth={1.6} />
    <Path d={`M${x} ${y - 92} Q${x + 6} ${y - 97} ${x + 12} ${y - 92}`} stroke="#2f86d6" strokeWidth={1.4} fill="none" />
  </G>
);

/* ================= SÜMELA ================= */
const S = (n) => `url(#g-sumela-${n})`;
const pine = (x, h, k, fill) => (
  <G key={k}>
    <Rect x={x - 2.5} y={GY - 6} width={5} height={14} fill="#3d2c1f" />
    <Polygon points={`${x - 20},${GY - 4} ${x},${GY - h * 0.62} ${x + 20},${GY - 4}`} fill={fill || S('tree')} />
    <Polygon points={`${x - 16},${GY - h * 0.36} ${x},${GY - h * 0.82} ${x + 16},${GY - h * 0.36}`} fill={fill || S('tree')} />
    <Polygon points={`${x - 11},${GY - h * 0.62} ${x},${GY - h} ${x + 11},${GY - h * 0.62}`} fill={fill || S('tree')} />
  </G>
);
const mist = (list, op) => list.map(([x, y, rx, ry], i) => <Ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#fff" opacity={op} />);

/* ================= İSTANBUL ================= */
const gull = (x, y, k) => (
  <Path key={k} d={`M${x - 14} ${y + 4} Q${x - 7} ${y - 6} ${x} ${y} Q${x + 7} ${y - 6} ${x + 14} ${y + 4}`} stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
);
const bldg = (x, w, h, fill, k) => (
  <G key={k}>
    <Rect x={x} y={GY - h} width={w} height={h + 6} fill={fill} />
    {range(0, Math.floor(h / 16) - 1).flatMap((r) =>
      range(0, Math.floor(w / 10) - 1).map((c) =>
        (r * 7 + c * 3 + k) % 3 === 0 ? <Rect key={`${r}-${c}`} x={x + 4 + c * 10} y={GY - h + 8 + r * 16} width={4} height={6} fill="#ffd77a" opacity={0.85} /> : null
      )
    )}
  </G>
);
const cableY = (x) => {
  const t = (x - 100) / 400;
  return (1 - t) * (1 - t) * 380 + 2 * t * (1 - t) * 740 + t * t * 380;
};
const tower = (x) => (
  <G>
    <Rect x={x - 8} y={380} width={7} height={240} fill="#2f3b63" />
    <Rect x={x + 1} y={380} width={7} height={240} fill="#2f3b63" />
    <Rect x={x - 8} y={420} width={16} height={5} fill="#2f3b63" />
    <Rect x={x - 8} y={500} width={16} height={5} fill="#2f3b63" />
    <Rect x={x - 8} y={570} width={16} height={5} fill="#2f3b63" />
  </G>
);

const ART = {
  kapadokya: {
    grads: [['far', '#d98a7a', '#f6c3a0'], ['mesa', '#e3a273', '#b26a42'], ['chim', '#e8b087', '#c27e55'], ['hill', '#d69262', '#b9693f']],
    layers: [
      { factor: 0.05, draw: () => (<G>{cloud(90, 150, 1.2, '#ffe3c4', 0.7, 1)}{cloud(380, 100, 1, '#ffe3c4', 0.6, 2)}{cloud(520, 230, 0.9, '#ffd2ab', 0.6, 3)}</G>) },
      { factor: 0.1, draw: () => (<G>
        <Path d={ridge([[0, 520], [90, 470], [170, 380], [230, 450], [300, 430], [380, 490], [450, 455], [520, 500], [600, 520]])} fill={K('far')} />
        <Path d={wave(565, 22, 3, 0.8)} fill="#e7a98b" opacity={0.85} />
      </G>) },
      { factor: 0.2, draw: () => (<G>
        {balloon(90, 190, 1.1, '#e74c3c', '#ffe08a', 1)}
        {balloon(250, 120, 0.8, '#2e86de', '#ffffff', 2)}
        {balloon(380, 280, 1.3, '#f39c12', '#c0392b', 3)}
        {balloon(520, 160, 0.9, '#27ae60', '#ffd166', 4)}
        {balloon(200, 340, 0.7, '#8e44ad', '#f7dc6f', 5)}
      </G>) },
      { factor: 0.35, draw: () => (<G>
        <Path d={wave(640, 12, 3, 0.5)} fill="#d49a70" />
        {mesa(30, 120, 95, 1)}{mesa(250, 80, 65, 2)}{mesa(380, 150, 125, 3)}
      </G>) },
      { factor: 0.55, draw: () => (<G>
        <Path d={wave(662, 12, 3, 1)} fill={K('hill')} />
        {[[55, 150, 50], [105, 105, 42], [160, 72, 36], [395, 175, 56], [455, 118, 44], [515, 84, 38], [560, 60, 30]].map(([x, h, w], i) => chimney(x, h, w, i))}
      </G>) },
    ],
    ground: () => (<G>
      {groundBase('#f0b27a', '#cf8656')}
      {range(-1, 12).map((i) => (<Polygon key={i} points={`${i * 50},${GY + 12} ${i * 50 + 22},${GY + 12} ${i * 50 + 6},${H} ${i * 50 - 16},${H}`} fill="#bf7646" />))}
      {range(0, 9).map((i) => (<Ellipse key={`p${i}`} cx={25 + i * 60} cy={GY + 36 + (i % 3) * 16} rx={5} ry={3} fill="#a5633a" opacity={0.7} />))}
    </G>),
  },

  ege: {
    tile: 1800, // 3 kat uzun: sahne geç tekrar eder
    grads: [['far', '#86b4cc', '#cfe6ef'], ['sea', '#58d3dc', '#1a86b4'], ['hill', '#5f9f5b', '#2d6a47']],
    layers: [
      { factor: 0.05, draw: () => (<G>
        {[[100, 110, 1.3], [390, 60, 1], [520, 190, 1.1], [760, 90, 1.2], [1020, 170, 1], [1250, 60, 1.4], [1480, 130, 1.1], [1680, 200, 1], [1700, 70, 0.9]].map(([x, y, sc], i) => cloud(x, y, sc, '#fff', 0.88, i, 1.5))}
      </G>) },
      { factor: 0.1, draw: () => (<G>
        {[
          [[0, 520], [70, 480], [150, 505], [230, 455], [320, 500], [400, 470], [490, 510], [560, 490], [600, 520]],
          [[0, 520], [90, 495], [180, 450], [260, 485], [350, 440], [430, 480], [520, 500], [600, 520]],
          [[0, 520], [100, 500], [190, 478], [300, 505], [380, 465], [470, 490], [540, 470], [600, 520]],
        ].map((pts, i) => (<Path key={`a${i}`} d={`M${i * 600} ${H} ${pts.map(([x, y]) => `L${i * 600 + x} ${y}`).join(' ')} L${i * 600 + 600} ${H} Z`} fill={EG('far')} />))}
        {[0, 1, 2].map((i) => (<Path key={`b${i}`} d={`M${i * 600} ${H} L${i * 600} 548 Q${i * 600 + 150} ${524 + i * 6} ${i * 600 + 300} 546 Q${i * 600 + 450} ${526 + i * 4} ${i * 600 + 600} 548 L${i * 600 + 600} ${H} Z`} fill="#a9cde0" />))}
      </G>) },
      { factor: 0.25, draw: () => (<G>
        <Rect x={0} y={560} width={1800} height={H - 560} fill={EG('sea')} />
        <Rect x={0} y={560} width={1800} height={16} fill="#a6eef0" opacity={0.5} />
        {range(0, 27).map((i) => (<Rect key={`sp${i}`} x={30 + i * 66} y={596 + ((i * 37) % 90)} width={30 + ((i * 13) % 34)} height={2.4} rx={1.2} fill="#ffffff" opacity={0.45} />))}
        {/* çam kaplı tepe (solda) */}
        {egeHill('hA')}
        {/* ortada küçük ada */}
        <Ellipse cx={1010} cy={598} rx={78} ry={9} fill="#ffffff" opacity={0.55} />
        <Path d="M944 598 Q972 546 1014 550 Q1056 554 1078 598 Z" fill={EG('hill')} />
        {egePine(985, 566, 0.5, 'i1')}{egePine(1015, 556, 0.6, 'i2')}{egePine(1045, 570, 0.45, 'i3')}
        {/* aynalanmış ikinci tepe (sağda) */}
        <G transform="translate(2100 0) scale(-1 1)">{egeHill('hB')}</G>
      </G>) },
      { factor: 0.5, draw: () => (<G>
        {/* denizde: tekneler, gulet, jet-ski, yüzenler */}
        {egeGulet(150, 612, 1, 'g1')}{egeBoat(335, 640, 0.9, 'b1')}{egeBoat(500, 604, 0.6, 'b2')}
        {egeJet(690, 652, 1, '#e74c3c', SKIN[0], 'j1')}
        {egeSwimmer(850, 656, SKIN[1], 'sw1')}{egeSwimmer(905, 668, SKIN[0], 'sw2')}
        {egeBoat(1010, 620, 0.7, 'b3')}
        {egeGulet(1190, 610, 0.85, 'g2')}
        {egeJet(1380, 646, 1, '#2f86d6', SKIN[2], 'j2')}
        {egeBoat(1520, 636, 0.85, 'b4')}{egeSwimmer(1640, 660, SKIN[1], 'sw3')}{egeBoat(1730, 606, 0.55, 'b5')}
        {/* dalga köpüğü + kumsal */}
        <Path d={waveT(664, 4, 15, 1, null)} stroke="#ffffff" strokeWidth={4} fill="none" opacity={0.85} />
        <Path d={waveT(668, 5, 9, 0, H)} fill="#f8e7b8" />
        <Path d={waveT(668, 5, 9, 0, null)} stroke="#e9c985" strokeWidth={2} fill="none" opacity={0.6} />
        {/* palmiyeler */}
        {[38, 430, 770, 1130, 1480, 1740].map((x, i) => egePalm(x, 700 + (i % 2) * 2, 0.9 + (i % 3) * 0.08, `pl${i}`))}
        {/* şemsiye + şezlong grupları */}
        {[[120, '#e74c3c'], [330, '#2f86d6'], [560, '#f39c12'], [1200, '#e74c3c'], [1420, '#1abc9c'], [1640, '#2f86d6']].map(([x, c], i) => (<G key={`u${i}`}>{egeParasol(x, 706, 0.9, c, 'p')}{egeLounger(x - 26, 706, 0.85, c, 'l1')}{egeLounger(x + 28, 706, 0.85, c, 'l2')}</G>))}
        {/* güneşlenenler */}
        {egeSunbather(94, 706, 0.85, SKIN[0], '#e74c3c', 'sb1')}{egeSunbather(1174, 706, 0.85, SKIN[1], '#2f86d6', 'sb2')}{egeSunbather(1614, 706, 0.85, SKIN[2], '#f39c12', 'sb3')}
        {/* voleybol sahası: file + oyuncular */}
        {egeNet(930, 706, 'net')}
        {egePerson(880, 706, 0.9, SKIN[0], '#2f86d6', '#2b2f3a', true, 'v1')}
        {egePerson(985, 700, 0.9, SKIN[2], '#f39c12', '#1f6f5a', true, 'v2')}
        {egePerson(1030, 706, 0.9, SKIN[1], '#e74c3c', '#2b2f3a', false, 'v3')}
        {/* gezenler */}
        {egePerson(690, 706, 0.9, SKIN[1], '#9b59b6', '#f5f5f5', false, 'w1')}
        {egePerson(1300, 706, 0.9, SKIN[0], '#1abc9c', '#2b2f3a', false, 'w2')}
      </G>) },
    ],
    ground: () => (<G>
      <Rect x={0} y={GY} width={1800} height={H - GY} fill="#e6c680" />
      <Rect x={0} y={GY} width={1800} height={12} fill="#f3dca2" />
      {range(0, 17).map((i) => (<Ellipse key={i} cx={50 + i * 105} cy={GY + 40 + (i % 2) * 16} rx={14} ry={4} fill="#d8b26a" opacity={0.7} />))}
      {range(0, 22).map((i) => (<Circle key={`d${i}`} cx={20 + i * 78} cy={GY + 66 - (i % 3) * 10} r={2.2} fill="#d4ad62" />))}
      {range(0, 8).map((i) => (<G key={`s${i}`}><Path d={`M${90 + i * 215} ${GY + 26} q6 -10 12 0 z`} fill="#fff1ea" /><Path d={`M${96 + i * 215} ${GY + 26} l0 -8 M${92 + i * 215} ${GY + 26} l1 -6 M${100 + i * 215} ${GY + 26} l-1 -6`} stroke="#e9b7a3" strokeWidth={1} /></G>))}
    </G>),
  },

  sumela: {
    grads: [['far', '#6d8e85', '#a8c2b8'], ['far2', '#4f7566', '#86a596'], ['rock', '#948b7c', '#5a5348'], ['wall', '#ead9b2', '#c9b384'], ['tree', '#2e6b43', '#1c4a2e']],
    layers: [
      { factor: 0.05, draw: () => (<G>{mist([[110, 130, 130, 14], [380, 200, 160, 16], [540, 90, 90, 10]], 0.28)}</G>) },
      { factor: 0.1, draw: () => (<G><Path d={jag(470, 55, 2, 0.3, 8)} fill={S('far')} /><Path d={jag(535, 38, 3, 2, 6)} fill={S('far2')} /></G>) },
      { factor: 0.22, draw: () => (<G>{mist([[90, 520, 120, 20], [330, 560, 150, 24], [520, 500, 100, 18]], 0.4)}</G>) },
      { factor: 0.4, draw: () => (<G>
        <Path d={`M90 ${GY + 10} L120 520 L140 430 L175 400 L200 340 L260 330 L330 345 L420 335 L480 350 L510 420 L540 520 L560 ${GY + 10}Z`} fill={S('rock')} />
        <Path d={`M230 345 L238 ${GY} L254 ${GY}Z`} fill="#000" opacity={0.18} />
        <Path d={`M330 345 L322 ${GY} L340 ${GY}Z`} fill="#000" opacity={0.15} />
        <Path d={`M150 430 L160 ${GY} L178 ${GY}Z`} fill="#000" opacity={0.15} />
        <Path d="M455 352 C452 420 458 470 452 520 L458 520 C464 470 460 420 462 352Z" fill="#fff" opacity={0.8} />
        <Ellipse cx={455} cy={524} rx={24} ry={7} fill="#fff" opacity={0.5} />
        <Rect x={205} y={500} width={225} height={22} fill="#a89a82" />
        {range(0, 6).map((i) => (<Ellipse key={`a${i}`} cx={224 + i * 31} cy={515} rx={8} ry={10} fill="#4a3d30" />))}
        <Rect x={215} y={440} width={200} height={60} fill={S('wall')} />
        <Polygon points="209,440 315,418 421,440" fill="#9b4f33" />
        <Rect x={255} y={396} width={120} height={44} fill={S('wall')} />
        <Polygon points="249,396 315,370 381,396" fill="#8d4429" />
        {[235, 265, 295, 335, 365, 395].map((x) => (<Path key={x} d={`M${x - 5} 490 L${x - 5} 468 A5 5 0 0 1 ${x + 5} 468 L${x + 5} 490Z`} fill="#4a3828" />))}
        {[280, 315, 350].map((x) => (<Path key={x} d={`M${x - 5} 430 L${x - 5} 412 A5 5 0 0 1 ${x + 5} 412 L${x + 5} 430Z`} fill="#4a3828" />))}
        <Rect x={313} y={354} width={3} height={16} fill="#4a3828" />
        {pine(60, 100, 1)}{pine(100, 72, 2)}{pine(575, 90, 3)}
      </G>) },
      { factor: 0.65, draw: () => (<G>
        {[[30, 120], [75, 160], [130, 110], [190, 170], [250, 120], [330, 150], [400, 115], [455, 175], [520, 125], [570, 150]].map(([x, h], i) => pine(x, h, i))}
      </G>) },
      { factor: 0.85, draw: () => (<G>
        {pine(110, 210, 1, '#173d27')}{pine(450, 230, 2, '#173d27')}
        {mist([[120, 660, 120, 20], [400, 680, 140, 22], [560, 650, 70, 14]], 0.3)}
      </G>) },
    ],
    ground: () => (<G>
      {groundBase('#5e9a4a', '#2f5a2b', 14)}
      {range(0, 11).map((i) => (<Polygon key={i} points={`${i * 50 + 8},${GY} ${i * 50 + 15},${GY - 14} ${i * 50 + 22},${GY}`} fill="#6fb257" />))}
      {range(0, 7).map((i) => (<Ellipse key={`r${i}`} cx={30 + i * 80} cy={GY + 40 + (i % 3) * 14} rx={9} ry={5} fill="#6b6b60" opacity={0.75} />))}
    </G>),
  },

  istanbul: {
    grads: [['far', '#8c9fc9', '#cdbfd6'], ['hag', '#a9a3c1', '#7d7aa3'], ['water', '#3f93d6', '#1b4f86']],
    layers: [
      { factor: 0.05, draw: () => (<G>{[[120, 260, 110, 9], [400, 215, 140, 8], [540, 300, 90, 7], [250, 340, 120, 7]].map(([x, y, rx, ry], i) => (<Ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#ffc9a0" opacity={0.7} />))}</G>) },
      { factor: 0.18, draw: () => (<G>{gull(90, 120, 1)}{gull(135, 152, 2)}{gull(380, 90, 3)}{gull(470, 185, 4)}{gull(545, 110, 5)}</G>) },
      { factor: 0.1, draw: () => (<G>
        <Path d={ridge([[0, 600], [120, 575], [260, 590], [380, 570], [500, 588], [600, 600]])} fill={S2('far')} />
        {range(0, 29).map((i) => (<Rect key={i} x={i * 20 + 2} y={612 + ((i * 7) % 14)} width={14} height={GY - 612} fill="#9a9bc0" />))}
      </G>) },
      { factor: 0.2, draw: () => (<G>
        {[[70, 165], [330, 165]].map(([x, h], i) => (<G key={`m${i}`}><Rect x={x - 4} y={GY - h} width={8} height={h + 6} fill={S2('hag')} /><Rect x={x - 7} y={GY - h * 0.7} width={14} height={4} fill={S2('hag')} /><Polygon points={`${x - 5},${GY - h} ${x},${GY - h - 24} ${x + 5},${GY - h}`} fill="#6a678f" /></G>))}
        {[[97, 120], [303, 120]].map(([x, h], i) => (<G key={`n${i}`}><Rect x={x - 3.5} y={GY - h} width={7} height={h + 6} fill={S2('hag')} /><Polygon points={`${x - 4.5},${GY - h} ${x},${GY - h - 20} ${x + 4.5},${GY - h}`} fill="#6a678f" /></G>))}
        <Rect x={130} y={GY - 80} width={140} height={86} fill={S2('hag')} />
        <Path d={`M105 ${GY - 40} A30 30 0 0 1 165 ${GY - 40}Z`} fill={S2('hag')} />
        <Path d={`M235 ${GY - 40} A30 30 0 0 1 295 ${GY - 40}Z`} fill={S2('hag')} />
        <Path d={`M146 ${GY - 80} Q200 ${GY - 200} 254 ${GY - 80}Z`} fill="#b5aecb" />
        <Rect x={196} y={GY - 202} width={8} height={14} fill="#6a678f" />
        {range(0, 7).map((i) => (<Rect key={i} x={150 + i * 14} y={GY - 78} width={5} height={10} rx={2} fill="#ffd77a" opacity={0.8} />))}
        <Rect x={458} y={GY - 200} width={24} height={206} fill="#a39fbe" />
        <Rect x={452} y={GY - 206} width={36} height={8} fill="#6a678f" />
        <Polygon points={`454,${GY - 206} 470,${GY - 248} 486,${GY - 206}`} fill="#5d5a85" />
        {[GY - 170, GY - 130, GY - 90].map((y) => (<Rect key={y} x={467} y={y} width={6} height={10} rx={3} fill="#ffd77a" opacity={0.85} />))}
        {bldg(10, 36, 70, '#8e8fb3', 1)}{bldg(46, 30, 95, '#9798bb', 2)}{bldg(500, 36, 80, '#8e8fb3', 3)}{bldg(536, 32, 110, '#9798bb', 4)}{bldg(568, 26, 66, '#8e8fb3', 5)}
      </G>) },
      { factor: 0.4, draw: () => (<G>
        <Rect x={0} y={603} width={TILE} height={9} fill="#2f3b63" />
        {tower(100)}{tower(500)}
        <Path d="M100 380 Q300 740 500 380" stroke="#2f3b63" strokeWidth={3} fill="none" />
        <Line x1={100} y1={380} x2={0} y2={603} stroke="#2f3b63" strokeWidth={3} />
        <Line x1={500} y1={380} x2={600} y2={603} stroke="#2f3b63" strokeWidth={3} />
        {range(0, 18).map((i) => { const x = 120 + i * 20; return (<Line key={i} x1={x} y1={cableY(x)} x2={x} y2={603} stroke="#2f3b63" strokeWidth={1.4} />); })}
        {range(0, 23).map((i) => (<Circle key={`l${i}`} cx={12 + i * 25} cy={599} r={1.8} fill="#ffe08a" />))}
      </G>) },
      { factor: 0.7, draw: () => (<G>
        <Path d={`M120 696 L250 696 L240 712 L130 712Z`} fill="#2b3558" />
        <Rect x={150} y={678} width={72} height={18} fill="#39446e" />
        <Rect x={166} y={666} width={40} height={12} fill="#39446e" />
        <Rect x={198} y={654} width={8} height={14} fill="#c0392b" />
        {range(0, 5).map((i) => (<Rect key={i} x={156 + i * 11} y={684} width={5} height={5} fill="#ffd77a" opacity={0.9} />))}
        <Polygon points="430,640 430,700 472,700" fill="#f4e4d0" />
        <Polygon points="426,646 426,700 404,700" fill="#e8cfb4" />
        <Path d="M398 702 L478 702 L468 712 L408 712Z" fill="#2b3558" />
        <Path d="M520 700 L568 700 L562 712 L526 712Z" fill="#7a3b3b" />
        <Polygon points="544,678 544,700 566,700" fill="#f4e4d0" />
      </G>) },
    ],
    ground: () => (<G>
      <Rect x={0} y={GY} width={TILE} height={H - GY} fill={S2('water')} />
      <Rect x={0} y={GY} width={TILE} height={6} fill="#7cc4f2" opacity={0.7} />
      <Path d={wave(GY + 28, 4, 6, 0, null)} stroke="#8fd0f5" strokeWidth={3} fill="none" />
      <Path d={wave(GY + 56, 4, 5, 1.5, null)} stroke="#6fb7e8" strokeWidth={3} fill="none" />
      <Path d={wave(GY + 78, 3, 7, 0.7, null)} stroke="#5aa6dd" strokeWidth={2.5} fill="none" />
      {range(0, 9).map((i) => (<Line key={i} x1={20 + i * 60} y1={GY + 18 + (i % 4) * 16} x2={40 + i * 60} y2={GY + 18 + (i % 4) * 16} stroke="#fff" strokeWidth={2} opacity={0.5} />))}
    </G>),
  },
};
function S2(n) { return `url(#g-istanbul-${n})`; }

/* ---------- çizim bileşenleri ---------- */
const LayerArt = memo(({ id, index, ground, s }) => {
  const def = ART[id];
  const tile = def.tile || TILE; // Ege gibi uzun haritalar kendi genişliğini belirler
  const draw = ground ? def.ground : def.layers[index].draw;
  return (
    <Svg width={2 * tile * s} height={H * s} viewBox={`0 0 ${2 * tile} ${H}`}>
      <Defs>
        {def.grads.map(([n, a, b]) => (
          <LinearGradient key={n} id={`g-${id}-${n}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={a} />
            <Stop offset="1" stopColor={b} />
          </LinearGradient>
        ))}
      </Defs>
      <G>{draw()}</G>
      <G transform={`translate(${tile} 0)`}>{draw()}</G>
    </Svg>
  );
});

const Layer = ({ id, index, ground, factor, s, scroll }) => (
  <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateX: -((scroll * factor) % (ART[id].tile || TILE)) * s }] }}>
    <LayerArt id={id} index={index} ground={ground} s={s} />
  </View>
);

// OPTİMİZASYON: gökyüzü hiç değişmediği için memo ile her karede yeniden çizilmez
const Sky = memo(({ theme, w, h }) => {
  const s = h / H;
  const gid = `sky-${theme.id}`;
  const cx = w * theme.sun.x, cy = h * theme.sun.y, op = theme.sun.opacity == null ? 0.9 : theme.sun.opacity;
  return (
    <Svg width={w} height={h}>
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          {theme.sky.map((c, i) => (<Stop key={i} offset={i / (theme.sky.length - 1)} stopColor={c} />))}
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={w} height={h} fill={`url(#${gid})`} />
      <Circle cx={cx} cy={cy} r={theme.sun.r * s * 3} fill={theme.sun.color} opacity={0.15 * op} />
      <Circle cx={cx} cy={cy} r={theme.sun.r * s * 1.8} fill={theme.sun.color} opacity={0.25 * op} />
      <Circle cx={cx} cy={cy} r={theme.sun.r * s} fill={theme.sun.color} opacity={op} />
    </Svg>
  );
});

export function SceneBack({ theme, w, h, scroll = 0 }) {
  const s = h / H;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <Sky theme={theme} w={w} h={h} />
      {ART[theme.id].layers.map((l, i) => (<Layer key={i} id={theme.id} index={i} factor={l.factor} s={s} scroll={scroll} />))}
    </View>
  );
}

export function SceneGround({ theme, w, h, scroll = 0 }) {
  const s = h / H;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <Layer id={theme.id} ground factor={1} s={s} scroll={scroll} />
    </View>
  );
}
