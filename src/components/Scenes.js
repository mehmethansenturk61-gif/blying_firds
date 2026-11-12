import React, { memo, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Platform } from 'react-native';
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
    <Path d={`M${x - 23 * sc} ${y + 5 * sc} Q${x} ${y + 12 * sc} ${x + 23 * sc} ${y + 5 * sc}`} stroke="#fff" strokeWidth={2.4 * sc} fill="none" opacity={0.4} />
    <Path d={`M${x - 18 * sc} ${y + 17 * sc} Q${x} ${y + 23 * sc} ${x + 18 * sc} ${y + 17 * sc}`} stroke={c2} strokeWidth={1.6 * sc} fill="none" opacity={0.6} />
    <Ellipse cx={x - 12 * sc} cy={y - 10 * sc} rx={4 * sc} ry={11 * sc} fill="#fff" opacity={0.25} />
    <Path d={`M${x + 24 * sc} ${y} C${x + 24 * sc} ${y + 18 * sc} ${x + 7 * sc} ${y + 30 * sc} ${x + 6 * sc} ${y + 36 * sc} L${x + 1 * sc} ${y + 36 * sc} C${x + 14 * sc} ${y + 28 * sc} ${x + 20 * sc} ${y + 14 * sc} ${x + 18 * sc} ${y - 6 * sc}Z`} fill="#000" opacity={0.1} />
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

// Model A: modern motor yacht (3 katlı, beyaz-lacivert)
const egeYacht = (x, y, sc, k) => (
  <G key={k}>
    <Ellipse cx={x + 6 * sc} cy={y + 13 * sc} rx={78 * sc} ry={3.4 * sc} fill="#0e6f96" opacity={0.3} />
    <Path d={`M${x - 74 * sc} ${y + 12 * sc} Q${x - 120 * sc} ${y + 14 * sc} ${x - 150 * sc} ${y + 16 * sc} L${x - 150 * sc} ${y + 10 * sc} Q${x - 120 * sc} ${y + 8 * sc} ${x - 74 * sc} ${y + 6 * sc} Z`} fill="#ffffff" opacity={0.6} />
    <Path d={`M${x - 64 * sc} ${y - 2 * sc} Q${x + 20 * sc} ${y - 1 * sc} ${x + 86 * sc} ${y - 10 * sc} L${x + 68 * sc} ${y + 11 * sc} L${x - 58 * sc} ${y + 11 * sc} Q${x - 64 * sc} ${y + 7 * sc} ${x - 64 * sc} ${y - 2 * sc} Z`} fill="#1d3557" />
    <Path d={`M${x - 64 * sc} ${y + 1 * sc} Q${x + 20 * sc} ${y + 2 * sc} ${x + 82 * sc} ${y - 6 * sc} L${x + 80 * sc} ${y - 3.5 * sc} Q${x + 20 * sc} ${y + 5 * sc} ${x - 64 * sc} ${y + 3.5 * sc} Z`} fill="#ffffff" />
    <Rect x={x - 46 * sc} y={y - 17 * sc} width={88 * sc} height={15 * sc} rx={3 * sc} fill="#ffffff" />
    <Rect x={x - 40 * sc} y={y - 14 * sc} width={76 * sc} height={5 * sc} rx={2 * sc} fill="#2b4a66" />
    <Rect x={x - 32 * sc} y={y - 31 * sc} width={58 * sc} height={14 * sc} rx={3 * sc} fill="#f4f6f8" />
    <Rect x={x - 26 * sc} y={y - 28 * sc} width={46 * sc} height={5 * sc} rx={2 * sc} fill="#2b4a66" />
    <Rect x={x - 38 * sc} y={y - 32 * sc} width={70 * sc} height={2.4 * sc} rx={1} fill="#1d3557" />
    <Rect x={x - 16 * sc} y={y - 42 * sc} width={30 * sc} height={11 * sc} rx={3 * sc} fill="#ffffff" />
    <Rect x={x - 12 * sc} y={y - 40 * sc} width={22 * sc} height={4 * sc} rx={1.5 * sc} fill="#2b4a66" />
    <Rect x={x - 1 * sc} y={y - 54 * sc} width={1.8} height={12 * sc} fill="#7a8794" />
    <Rect x={x - 7 * sc} y={y - 51 * sc} width={14 * sc} height={1.8} fill="#7a8794" />
    <Circle cx={x + 40 * sc} cy={y - 21 * sc} r={2 * sc} fill="#e74c3c" />
    <Rect x={x + 50 * sc} y={y - 16 * sc} width={1.4} height={14 * sc} fill="#7a8794" />
    <Polygon points={`${x + 51 * sc},${y - 16 * sc} ${x + 62 * sc},${y - 13 * sc} ${x + 51 * sc},${y - 10 * sc}`} fill="#e74c3c" />
  </G>
);

// Yelkenli: lüks yelkenli yat (sloop, lacivert gövde, ana yelken + genoa)
const egeSail = (x, y, sc, k) => (
  <G key={k}>
    <Ellipse cx={x} cy={y + 13 * sc} rx={62 * sc} ry={3.2 * sc} fill="#0e6f96" opacity={0.3} />
    <Path d={`M${x - 58 * sc} ${y + 12 * sc} Q${x - 100 * sc} ${y + 14 * sc} ${x - 130 * sc} ${y + 16 * sc} L${x - 130 * sc} ${y + 10 * sc} Q${x - 100 * sc} ${y + 8 * sc} ${x - 58 * sc} ${y + 6 * sc} Z`} fill="#ffffff" opacity={0.55} />
    <Rect x={x - 1} y={y - 92 * sc} width={2.2} height={90 * sc} fill="#8a95a0" />
    <Rect x={x - 46 * sc} y={y - 10 * sc} width={46 * sc} height={2} fill="#8a95a0" />
    <Polygon points={`${x - 2.5},${y - 88 * sc} ${x - 2.5},${y - 12 * sc} ${x - 46 * sc},${y - 12 * sc}`} fill="#ffffff" />
    <Path d={`M${x - 2.5} ${y - 62 * sc} L${x - 31 * sc} ${y - 12 * sc}`} stroke="#d7dde3" strokeWidth={1.2} />
    <Polygon points={`${x + 3},${y - 84 * sc} ${x + 3},${y - 8 * sc} ${x + 58 * sc},${y - 8 * sc}`} fill="#f4ead2" />
    <Path d={`M${x + 3} ${y - 50 * sc} L${x + 34 * sc} ${y - 8 * sc}`} stroke="#e3d6b8" strokeWidth={1.2} />
    <Path d={`M${x - 3} ${y - 92 * sc} L${x + 11 * sc} ${y - 89 * sc} L${x - 3} ${y - 86 * sc} Z`} fill="#f5b700" />
    <Path d={`M${x - 60 * sc} ${y - 4 * sc} Q${x + 10 * sc} ${y - 3 * sc} ${x + 70 * sc} ${y - 10 * sc} L${x + 52 * sc} ${y + 10 * sc} L${x - 50 * sc} ${y + 10 * sc} Q${x - 60 * sc} ${y + 6 * sc} ${x - 60 * sc} ${y - 4 * sc} Z`} fill="#10243f" />
    <Path d={`M${x - 60 * sc} ${y - 1 * sc} Q${x + 10 * sc} ${y} ${x + 67 * sc} ${y - 7 * sc} L${x + 65 * sc} ${y - 4.5 * sc} Q${x + 10 * sc} ${y + 2.5 * sc} ${x - 60 * sc} ${y + 1.5 * sc} Z`} fill="#d9a441" />
    <Rect x={x - 22 * sc} y={y - 10 * sc} width={26 * sc} height={7 * sc} rx={2 * sc} fill="#f6f6f6" />
    <Rect x={x - 18 * sc} y={y - 8.5 * sc} width={18 * sc} height={2.6 * sc} rx={1} fill="#2b4a66" />
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

/* ---- İstanbul Boğazı için yardımcılar ---- */
const isMinaret = (x, base, h, fill, k) => (
  <G key={k}>
    <Rect x={x - 2.4} y={base - h} width={4.8} height={h + 2} fill={fill} />
    <Rect x={x - 4.2} y={base - h * 0.7} width={8.4} height={2.6} fill={fill} />
    <Polygon points={`${x - 3},${base - h} ${x},${base - h - 13} ${x + 3},${base - h}`} fill={fill} />
  </G>
);
const isDome = (cx, base, rx, ry, fill, k) => (
  <G key={k}>
    <Path d={`M${cx - rx} ${base} A${rx} ${ry} 0 0 1 ${cx + rx} ${base} Z`} fill={fill} />
    <Rect x={cx - 0.9} y={base - ry - 6} width={1.8} height={7} fill={fill} />
  </G>
);
const isMosque = (cx, base, sc, minarets, fill, k) => (
  <G key={k}>
    <Rect x={cx - 38 * sc} y={base - 18 * sc} width={76 * sc} height={20 * sc} fill={fill} />
    {isDome(cx, base - 18 * sc, 31 * sc, 27 * sc, fill, 'c')}
    {isDome(cx - 35 * sc, base - 15 * sc, 15 * sc, 13 * sc, fill, 'l')}
    {isDome(cx + 35 * sc, base - 15 * sc, 15 * sc, 13 * sc, fill, 'r')}
    {minarets.map(([dx, h], i) => isMinaret(cx + dx * sc, base, h * sc, fill, `m${i}`))}
  </G>
);
const isCable = (x) => { const t = (x - 100) / 400; return (1 - t) * (1 - t) * 340 + 2 * t * (1 - t) * 780 + t * t * 340; };
const isWin = (x, y, k) => (<Rect key={k} x={x} y={y} width={3} height={4.5} rx={1} fill="#ffd77a" opacity={0.85} />);

/* ---- Vapur (Şehir Hatları tarzı) ---- */
const isVapur = (x, y, sc, k) => (
  <G key={k} transform={`translate(${x} ${y}) scale(${sc})`}>
    <Ellipse cx={4} cy={4} rx={96} ry={3.4} fill="#ffffff" opacity={0.55} />
    <Ellipse cx={92} cy={1} rx={12} ry={3} fill="#ffffff" opacity={0.7} />
    <Ellipse cx={-6} cy={9} rx={70} ry={2.2} fill="#ffd9a6" opacity={0.35} />
    <Ellipse cx={-34} cy={-102} rx={10} ry={6} fill="#efe4ee" opacity={0.6} />
    <Ellipse cx={-52} cy={-112} rx={14} ry={7} fill="#efe4ee" opacity={0.42} />
    <Ellipse cx={-76} cy={-118} rx={18} ry={8} fill="#efe4ee" opacity={0.26} />
    <Path d="M-84 -20 L94 -20 L98 -26 L104 -26 L88 0 L-70 0 Z" fill="#1d2142" />
    <Path d="M-86 -27 L98 -27 L104 -26 L98 -20 L-84 -20 Z" fill="#f6f1e8" />
    <Rect x={-70} y={-42} width={126} height={15} fill="#f6f1e8" />
    {range(0, 13).map((i) => (<Rect key={`w1${i}`} x={-64 + i * 9.4} y={-38} width={5} height={6} rx={1.4} fill={i % 3 === 1 ? '#ffd77a' : '#34506e'} />))}
    <Rect x={-70} y={-43} width={126} height={2} fill="#d9d0bf" />
    <Rect x={-52} y={-57} width={92} height={15} fill="#efe7da" />
    {range(0, 9).map((i) => (<Rect key={`w2${i}`} x={-46 + i * 9.6} y={-53} width={5} height={6} rx={1.4} fill={i % 2 ? '#ffd77a' : '#34506e'} />))}
    <Rect x={-52} y={-58} width={92} height={2} fill="#d9d0bf" />
    <Rect x={18} y={-70} width={26} height={13} fill="#f6f1e8" />
    <Rect x={21} y={-66} width={20} height={5} rx={1.5} fill="#34506e" />
    <Rect x={16} y={-72} width={30} height={3} fill="#c9bfae" />
    <Path d="M-20 -57 L-14 -90 L4 -90 L10 -57 Z" fill="#e9e1d2" />
    <Path d="M-17.6 -72 L-16 -80 L6 -80 L7.6 -72 Z" fill="#c0392b" />
    <Path d="M-14 -90 L-13 -97 L3 -97 L4 -90 Z" fill="#1b1b1f" />
    <Rect x={48} y={-92} width={1.8} height={34} fill="#6b6b78" />
    <Polygon points="49.8,-92 62,-89 49.8,-86" fill="#f5b700" />
    <Rect x={-76} y={-56} width={1.6} height={30} fill="#6b6b78" />
    <Rect x={-75.4} y={-56} width={14} height={9} fill="#d62d20" />
    <Circle cx={-70} cy={-51.5} r={2.6} fill="#ffffff" />
    <Ellipse cx={-30} cy={-59} rx={5} ry={2.4} fill="#e8793a" />
    <Ellipse cx={30} cy={-59} rx={5} ry={2.4} fill="#e8793a" />
    {range(0, 7).map((i) => (<Circle key={`pt${i}`} cx={-62 + i * 18} cy={-14} r={2.1} fill="#ffd77a" opacity={0.9} />))}
  </G>
);

/* ---- Kapadokya yardımcıları ---- */
const kRng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const kPath = (base, comps, bottom = H, step = 20) => {
  let d = '';
  for (let x = 0; x <= 1800; x += step) {
    let y = base;
    comps.forEach(([a, k, ph]) => { y += a * Math.sin((2 * Math.PI * k * x) / 1800 + ph); });
    d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
  }
  return bottom === null ? d : `${d}L1800 ${bottom} L0 ${bottom} Z`;
};
const kY = (base, comps, x) => comps.reduce((y, [a, k, ph]) => y + a * Math.sin((2 * Math.PI * k * x) / 1800 + ph), base);
const kCone = (x, h, w, k) => (
  <G key={k}>
    <Ellipse cx={x + w * 0.12} cy={GY + 9} rx={w * 0.62} ry={4} fill="#6b3a22" opacity={0.2} />
    <Path d={`M${x - w / 2} ${GY + 8} Q${x - w * 0.26} ${GY - h * 0.55} ${x - w * 0.05} ${GY - h} Q${x + w * 0.05} ${GY - h - 4} ${x + w * 0.1} ${GY - h + 2} Q${x + w * 0.26} ${GY - h * 0.55} ${x + w / 2} ${GY + 8}Z`} fill={K('chim')} />
    <Path d={`M${x + w * 0.04} ${GY - h + 2} Q${x + w * 0.26} ${GY - h * 0.55} ${x + w / 2} ${GY + 8} L${x + w * 0.06} ${GY + 8}Z`} fill="#6b3a22" opacity={0.18} />
    <Path d={`M${x - 4} ${GY - h * 0.28} L${x - 4} ${GY - h * 0.28 - 8} A4 4 0 0 1 ${x + 4} ${GY - h * 0.28 - 8} L${x + 4} ${GY - h * 0.28}Z`} fill="#5a321f" opacity={0.7} />
    <Rect x={x - 1.5} y={GY - h * 0.62} width={4} height={6} rx={2} fill="#ffcf7a" opacity={0.9} />
    <Path d={`M${x - w * 0.2} ${GY - h * 0.5} Q${x} ${GY - h * 0.54} ${x + w * 0.18} ${GY - h * 0.5}`} stroke="#fbe0c0" strokeWidth={1.6} fill="none" opacity={0.3} />
    <Path d={`M${x - w * 0.13} ${GY - h * 0.74} Q${x} ${GY - h * 0.77} ${x + w * 0.1} ${GY - h * 0.74}`} stroke="#fbe0c0" strokeWidth={1.4} fill="none" opacity={0.28} />
    <Path d={`M${x - w / 2 + w * 0.05} ${GY + 4} Q${x - w * 0.24} ${GY - h * 0.55} ${x - w * 0.05} ${GY - h + 4}`} stroke="#fff1dc" strokeWidth={1.6} fill="none" opacity={0.35} />
  </G>
);
const kTwin = (x, h, w, k) => (<G key={k}>{kCone(x - w * 0.22, h, w * 0.72, 'a')}{kCone(x + w * 0.26, h * 0.7, w * 0.62, 'b')}</G>);
const kCastle = (x, w, h, k) => {
  const r = kRng(77);
  return (
    <G key={k}>
      <Path d={`M${x} ${GY + 8} Q${x + w * 0.04} ${GY - h * 0.55} ${x + w * 0.28} ${GY - h * 0.82} Q${x + w * 0.42} ${GY - h * 1.08} ${x + w * 0.58} ${GY - h * 0.86} Q${x + w * 0.88} ${GY - h * 0.6} ${x + w} ${GY + 8}Z`} fill={K('mesa')} />
      <Path d={`M${x + w * 0.58} ${GY - h * 0.86} Q${x + w * 0.88} ${GY - h * 0.6} ${x + w} ${GY + 8} L${x + w * 0.66} ${GY + 8}Z`} fill="#000" opacity={0.11} />
      {range(0, 17).map((i) => { const wx = x + w * (0.2 + r() * 0.6); const wy = GY - h * (0.12 + r() * 0.62); return (<Path key={`cw${i}`} d={`M${wx - 3} ${wy + 8} L${wx - 3} ${wy + 3} A3 3 0 0 1 ${wx + 3} ${wy + 3} L${wx + 3} ${wy + 8}Z`} fill="#5a321f" opacity={0.7} />); })}
      {[0.3, 0.5, 0.7].map((f, i) => (<Line key={`cl${i}`} x1={x + w * (0.12 + 0.2 * f)} y1={GY - h * f} x2={x + w * (0.9 - 0.2 * f)} y2={GY - h * f} stroke="#f2b88e" strokeWidth={2} opacity={0.35} />))}
    </G>
  );
};
const kTree = (x, y, h, k) => (<G key={k}><Rect x={x - 1} y={y - 4} width={2} height={6} fill="#5a3a22" /><Ellipse cx={x} cy={y - h * 0.5} rx={h * 0.2} ry={h * 0.5} fill="#6a8040" /><Ellipse cx={x + h * 0.06} cy={y - h * 0.46} rx={h * 0.1} ry={h * 0.36} fill="#7b9250" opacity={0.7} /></G>);
const kBoulder = (x, y, w, h, k) => (
  <G key={k}>
    <Path d={`M${x - w} ${y + 2} Q${x - w * 0.9} ${y - h} ${x - w * 0.1} ${y - h * 1.1} Q${x + w * 0.8} ${y - h} ${x + w} ${y + 2}Z`} fill="#c98558" />
    <Path d={`M${x + w * 0.1} ${y - h * 1.05} Q${x + w * 0.8} ${y - h} ${x + w} ${y + 2} L${x + w * 0.1} ${y + 2}Z`} fill="#6b3a22" opacity={0.22} />
    <Path d={`M${x - w * 0.7} ${y - h * 0.4} Q${x - w * 0.4} ${y - h * 0.85} ${x} ${y - h * 0.9}`} stroke="#f6d2b0" strokeWidth={1.4} fill="none" opacity={0.45} />
  </G>
);
const kVillage = (x, k) => (
  <G key={k}>
    <Ellipse cx={x + 90} cy={GY + 9} rx={110} ry={5} fill="#6b3a22" opacity={0.2} />
    {[[0, 34, 26], [30, 40, 34], [66, 30, 22], [94, 44, 38], [130, 32, 26]].map(([dx, w, h], i) => (
      <G key={`h${i}`}>
        <Rect x={x + dx} y={GY + 8 - h} width={w} height={h} fill={i % 2 ? '#ecc29a' : '#e0ab82'} />
        <Rect x={x + dx} y={GY + 8 - h} width={w} height={3} fill="#f9e0c0" />
        <Rect x={x + dx + w * 0.7} y={GY + 8 - h} width={w * 0.3} height={h} fill="#6b3a22" opacity={0.14} />
        <Path d={`M${x + dx + w * 0.2} ${GY + 8} L${x + dx + w * 0.2} ${GY + 1} A${w * 0.1} ${w * 0.1} 0 0 1 ${x + dx + w * 0.4} ${GY + 1} L${x + dx + w * 0.4} ${GY + 8}Z`} fill="#5a321f" opacity={0.8} />
        <Rect x={x + dx + w * 0.55} y={GY + 8 - h * 0.65} width={5} height={7} rx={2} fill="#ffcf7a" opacity={0.95} />
      </G>
    ))}
    <Rect x={x + 170} y={GY - 62} width={7} height={70} fill="#f0d2b0" />
    <Rect x={x + 167} y={GY - 40} width={13} height={3} fill="#c99870" />
    <Path d={`M${x + 167} ${GY - 62} L${x + 173.5} ${GY - 84} L${x + 180} ${GY - 62}Z`} fill="#b86a4a" />
  </G>
);
const kMistList = [[160, 540, 140, 16], [520, 575, 170, 18], [900, 530, 120, 14], [1250, 590, 160, 18], [1600, 548, 130, 15]];
const RIDGE1 = [[38, 3, 0.3], [22, 7, 1.2], [10, 13, 2.1]];
const RIDGE2 = [[24, 4, 1], [13, 9, 0.4], [6, 17, 2.4]];
const kClouds = [[110, 150, 1.2], [380, 95, 1], [620, 230, 0.9], [860, 130, 1.3], [1130, 200, 1], [1370, 85, 1.1], [1580, 170, 0.9], [1730, 250, 0.8]];
const KB_BALLOONS = [
  // x, y, ölçek, renk1, renk2, yön(-1 yukarı, 1 aşağı), genlik, süre(ms)
  [120, 150, 0.36, '#e74c3c', '#ffe08a', -1, 26, 6200],
  [330, 260, 0.3, '#2e86de', '#ffffff', 1, 22, 7400],
  [560, 110, 0.4, '#f39c12', '#c0392b', 1, 30, 8600],
  [790, 215, 0.28, '#27ae60', '#ffd166', -1, 18, 5600],
  [1010, 120, 0.34, '#8e44ad', '#f7dc6f', -1, 24, 7000],
  [1240, 270, 0.3, '#e84393', '#ffeaa7', 1, 26, 6800],
  [1440, 160, 0.42, '#16a085', '#fdcb6e', -1, 30, 9200],
  [1650, 230, 0.27, '#d35400', '#ffffff', 1, 18, 5200],
  [1760, 90, 0.32, '#0984e3', '#fab1a0', -1, 22, 7800],
  // uzaktaki küçük balonlar (derinlik)
  [240, 335, 0.17, '#ff7675', '#ffeaa7', -1, 12, 9800],
  [690, 330, 0.15, '#74b9ff', '#ffffff', 1, 10, 10400],
  [1130, 345, 0.16, '#a29bfe', '#ffeaa7', -1, 12, 9000],
  [1540, 338, 0.15, '#55efc4', '#fdcb6e', 1, 10, 11000],
];
const BalloonSprite = memo(({ b, s }) => {
  const [, , sc0, c1, c2, dir, amp, dur] = b;
  const sc = sc0 * 1.3;
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = (to, d) => Animated.timing(v, { toValue: to, duration: d, easing: Easing.inOut(Easing.sin), useNativeDriver: true });
    const loop = Animated.loop(Animated.sequence([t(dir * amp * s, dur), t(-dir * amp * s, dur * 2), t(0, dur)]));
    loop.start();
    return () => loop.stop();
  }, [s]);
  return (
    <Animated.View style={{ transform: [{ translateY: v }] }}>
      <Svg width={80 * sc * s} height={110 * sc * s} viewBox="0 0 80 110">
        <Circle cx={40} cy={34} r={36} fill="#ffd9a0" opacity={0.14} />
        {balloon(40, 40, 1, c1, c2, 'bl')}
        <Circle cx={40} cy={77} r={6} fill="#ffb347" opacity={0.1} />
        <Ellipse cx={40} cy={76} rx={1.7} ry={3.6} fill="#ffb347" opacity={0.3} />
      </Svg>
    </Animated.View>
  );
});
const BalloonField = memo(({ s, scroll }) => (
  <View pointerEvents="none" style={[{ position: 'absolute', left: 0, top: 0, transform: [{ translateX: -((scroll * 0.2) % 1800) * s }] }, WEB_LAYER]}>
    {[0, 1].map((cp) => KB_BALLOONS.map((b, i) => (
      <View key={`${cp}-${i}`} style={{ position: 'absolute', left: (b[0] + cp * 1800) * s, top: b[1] * s }}>
        <BalloonSprite b={b} s={s} />
      </View>
    )))}
  </View>
));

/* ---- Peribacası: tüf gövde + daha sade taş başlık ---- */
const kCap = (x, h, w, k) => {
  const nk = GY - h * 0.84; // boyun/başlık hizası
  const cw = w * 0.5;
  return (
    <G key={k}>
      <Ellipse cx={x + w * 0.14} cy={GY + 9} rx={w * 0.62} ry={4} fill="#6b3a22" opacity={0.2} />
      <Path d={`M${x - w / 2} ${GY + 8} Q${x - w * 0.32} ${GY - h * 0.4} ${x - w * 0.15} ${nk} L${x + w * 0.15} ${nk} Q${x + w * 0.32} ${GY - h * 0.4} ${x + w / 2} ${GY + 8}Z`} fill={K('chim')} />
      <Path d={`M${x + w * 0.03} ${nk} Q${x + w * 0.32} ${GY - h * 0.4} ${x + w / 2} ${GY + 8} L${x + w * 0.08} ${GY + 8}Z`} fill="#6b3a22" opacity={0.16} />
      <Path d={`M${x - cw / 2} ${nk + 2} Q${x - cw * 0.56} ${nk - cw * 0.32} ${x - cw * 0.1} ${nk - cw * 0.4} Q${x + cw * 0.5} ${nk - cw * 0.42} ${x + cw / 2} ${nk + 2}Z`} fill="#a86a45" />
      <Path d={`M${x - cw * 0.3} ${nk - cw * 0.2} Q${x - cw * 0.05} ${nk - cw * 0.36} ${x + cw * 0.25} ${nk - cw * 0.26}`} stroke="#d49a70" strokeWidth={2} fill="none" opacity={0.7} />
      <Rect x={x - w * 0.2} y={nk - 2} width={w * 0.4} height={5} fill="#6b3a22" opacity={0.2} />
      <Path d={`M${x - w * 0.24} ${GY - h * 0.52} Q${x} ${GY - h * 0.56} ${x + w * 0.22} ${GY - h * 0.52}`} stroke="#fbe0c0" strokeWidth={1.5} fill="none" opacity={0.28} />
      <Path d={`M${x - w * 0.18} ${GY - h * 0.32} Q${x} ${GY - h * 0.35} ${x + w * 0.2} ${GY - h * 0.32}`} stroke="#fbe0c0" strokeWidth={1.4} fill="none" opacity={0.24} />
      <Path d={`M${x - 4} ${GY - h * 0.2} L${x - 4} ${GY - h * 0.2 - 9} A4 4 0 0 1 ${x + 4} ${GY - h * 0.2 - 9} L${x + 4} ${GY - h * 0.2}Z`} fill="#5a321f" opacity={0.65} />
    </G>
  );
};
/* ---- Uçhisar tarzı kaya: sert hatlı, birkaç sıra pencere ---- */
const kRock = (x, w, h, k) => {
  const P = [[0, 8], [0.03, -0.35], [0.12, -0.5], [0.2, -0.72], [0.3, -0.7], [0.36, -0.95], [0.46, -1], [0.55, -0.84], [0.66, -0.9], [0.74, -0.62], [0.86, -0.5], [0.95, -0.2], [1, 8]];
  const pts = P.map(([fx, fy]) => `${x + w * fx},${fy > 0 ? GY + fy : GY + fy * h}`).join(' ');
  return (
    <G key={k}>
      <Polygon points={pts} fill={K('mesa')} />
      <Polygon points={`${x + w * 0.46},${GY - h} ${x + w * 0.55},${GY - h * 0.84} ${x + w * 0.66},${GY - h * 0.9} ${x + w * 0.74},${GY - h * 0.62} ${x + w * 0.86},${GY - h * 0.5} ${x + w * 0.95},${GY - h * 0.2} ${x + w},${GY + 8} ${x + w * 0.62},${GY + 8}`} fill="#000" opacity={0.12} />
      {[[0.3, 0.55, 3], [0.4, 0.55, 3], [0.5, 0.55, 3], [0.36, 0.38, 3], [0.48, 0.38, 3], [0.6, 0.38, 3], [0.28, 0.2, 3], [0.4, 0.2, 3], [0.52, 0.2, 3], [0.64, 0.2, 3], [0.46, 0.72, 2]].map(([fx, fy], i) => (
        <Path key={`rw${i}`} d={`M${x + w * fx - 3} ${GY - h * fy + 8} L${x + w * fx - 3} ${GY - h * fy + 3} A3 3 0 0 1 ${x + w * fx + 3} ${GY - h * fy + 3} L${x + w * fx + 3} ${GY - h * fy + 8}Z`} fill="#5a321f" opacity={0.72} />
      ))}
      <Rect x={x + w * 0.3} y={GY - h * 0.17} width={w * 0.38} height={2} fill="#f2b88e" opacity={0.4} />
      {[[0.4, 0.55], [0.48, 0.38], [0.52, 0.2], [0.46, 0.72]].map(([fx, fy], i) => (
        <Circle key={`lw${i}`} cx={x + w * fx} cy={GY - h * fy + 6} r={2} fill="#ffcf7a" opacity={0.85} />
      ))}
    </G>
  );
};

/* ================= NEMRUT DAĞI ================= */
const NM = (n) => `url(#g-nemrut-${n})`;
const N_SUN = '#ffd9a0'; // gün doğumu kenar ışığı

// Periyodik (1800 birim) sivri dağ silüeti: kenarlarda kesintisiz birleşir (k tam sayı olmalı)
const nPts = (base, comps, jit, seed) => {
  const r = kRng(seed);
  const pts = [];
  for (let x = 0; x <= 1800; x += 15) {
    let y = base;
    comps.forEach(([a, k, ph]) => { y += a * Math.abs(Math.sin((Math.PI * k * x) / 1800 + ph)); });
    if (x > 0 && x < 1800) y += (r() - 0.5) * jit;
    pts.push([x, y]);
  }
  return pts;
};
const nFill = (pts) => `M0 ${H} ${pts.map(([x, y]) => `L${x} ${y.toFixed(1)}`).join(' ')} L1800 ${H} Z`;
const nLine = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y.toFixed(1)}`).join(' ');
// Zirvelerde kar lekeleri
const nSnow = (pts, limit, key) => pts.map(([x, y], i) => {
  if (i === 0 || i === pts.length - 1 || y > limit) return null;
  if (y > pts[i - 1][1] || y > pts[i + 1][1]) return null;
  return <Polygon key={`${key}${i}`} points={`${x - 15},${y + 17} ${x - 4},${y + 6} ${x},${y} ${x + 5},${y + 7} ${x + 15},${y + 17} ${x + 4},${y + 13} ${x - 3},${y + 15}`} fill="#fbe3dc" opacity={0.4} />;
});
// Yıldızlar (renk tonlu, parlaklara ışıltı; aşağı doğru sönükleşir)
const nStars = () => {
  const r = kRng(9);
  return range(0, 130).map((i) => {
    const x = r() * 1800, y = r() * 330, big = r() < 0.12, op = (0.95 - y / 380) * (0.4 + r() * 0.6), tn = r();
    const f = tn < 0.2 ? '#cfd8ff' : tn < 0.35 ? '#ffe8d0' : '#fff';
    return (<G key={`st${i}`}><Circle cx={x} cy={y} r={big ? 1.9 : 0.8 + r() * 0.6} fill={f} opacity={op} />{big ? (<G opacity={op * 0.55}><Rect x={x - 5} y={y - 0.4} width={10} height={0.8} fill={f} /><Rect x={x - 0.4} y={y - 5} width={0.8} height={10} fill={f} /></G>) : null}</G>);
  });
};
// Sırt yüzey gölgeleri: her zirvenin sağ yamacı (ışık soldan gelir), gerçek sırt çizgisini izler
const nFacets = (pts, limit, key, op) => pts.map(([x, y], i) => {
  if (i === 0 || i === pts.length - 1 || y > limit) return null;
  if (y > pts[i - 1][1] || y > pts[i + 1][1]) return null;
  let j = i; while (j < pts.length - 1 && pts[j + 1][1] >= pts[j][1]) j++;
  const vy = pts[j][1]; if (vy - y < 25) return null;
  const poly = [...pts.slice(i, j + 1), [x, vy]].map(([px, py]) => `${px},${py.toFixed(1)}`).join(' ');
  return <Polygon key={`${key}${i}`} points={poly} fill="#2a1d4a" opacity={op} />;
});

// Tümülüs: ezilmiş taş yığını, konik, tırtıklı siluet, ışık/gölge yüzü ve taş kırıntıları
const nMound = (cx, w, h, k) => {
  const r = kRng(Math.round(cx) + 3);
  const hw = (t) => (w / 2) * Math.pow(1 - t, 1.12) * (1 - 0.12 * Math.pow(t, 3));
  const yAt = (t) => GY + 8 - (h + 8) * t;
  const L = [], R = [];
  for (let i = 0; i <= 14; i++) {
    const t = (i / 14) * 0.965;
    L.push([cx - hw(t) + (i ? (r() - 0.5) * 8 : 0), yAt(t)]);
    R.push([cx + hw(t) + (i ? (r() - 0.5) * 8 : 0), yAt(t)]);
  }
  const outline = [...L, ...[...R].reverse()].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const shade = [[cx, yAt(0.965)], ...[...R].reverse(), [cx, GY + 8]].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const strata = range(1, 6).map((j) => { const t = j / 7, xl = cx - hw(t), xr = cx + hw(t), y = yAt(t); return (<G key={`s${j}`}><Path d={`M${xl.toFixed(1)} ${y.toFixed(1)} Q${cx} ${(y + 5).toFixed(1)} ${xr.toFixed(1)} ${y.toFixed(1)}`} stroke="#5f4f3f" strokeWidth={1.2} fill="none" opacity={0.16} /><Path d={`M${xl.toFixed(1)} ${(y + 2).toFixed(1)} Q${cx} ${(y + 7).toFixed(1)} ${xr.toFixed(1)} ${(y + 2).toFixed(1)}`} stroke="#fff2d0" strokeWidth={0.9} fill="none" opacity={0.12} /></G>); });
  const chips = range(0, Math.round(w / 4)).map((i) => {
    const t = 0.04 + r() * 0.9, u = (r() * 2 - 1) * 0.88;
    const x = cx + u * hw(t), y = yAt(t) + r() * 4, s = 2.5 + r() * 4.5 * (1 - t * 0.5), dark = r() < (u > 0 ? 0.6 : 0.35);
    return <Polygon key={`c${i}`} points={`${x.toFixed(1)},${y.toFixed(1)} ${(x + s).toFixed(1)},${(y + s * 0.4).toFixed(1)} ${(x + s * 0.4).toFixed(1)},${(y + s * 0.9).toFixed(1)}`} fill={dark ? '#5f4f3f' : '#e6d6b9'} opacity={dark ? 0.34 : 0.42} />;
  });
  return (
    <G key={k}>
      <Ellipse cx={cx + w * 0.08} cy={GY + 9} rx={w * 0.56} ry={5} fill="#2a1d2c" opacity={0.2} />
      <Polygon points={outline} fill={NM('mound')} />
      <Polygon points={shade} fill="#2a1d2c" opacity={0.2} />
      <Path d={L.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')} stroke={N_SUN} strokeWidth={2.2} fill="none" opacity={0.55} />
      {strata}{chips}
    </G>
  );
};

// Oturan dev heykel: taht, gövde, sakallı yüz, farklı başlıklar (v: 0 konik tiara, 1 yuvarlak, 2 çentikli)
const nSeat = (x, base, sc, v, k) => {
  const s = sc;
  const cap = [
    `M${x - 9 * s} ${base - 79 * s} L${x - 6 * s} ${base - 104 * s} Q${x} ${base - 113 * s} ${x + 6 * s} ${base - 104 * s} L${x + 9 * s} ${base - 79 * s}Z`,
    `M${x - 10 * s} ${base - 79 * s} Q${x - 11 * s} ${base - 96 * s} ${x} ${base - 99 * s} Q${x + 11 * s} ${base - 96 * s} ${x + 10 * s} ${base - 79 * s}Z`,
    `M${x - 9 * s} ${base - 79 * s} L${x - 9 * s} ${base - 96 * s} L${x - 4 * s} ${base - 92 * s} L${x} ${base - 108 * s} L${x + 4 * s} ${base - 92 * s} L${x + 9 * s} ${base - 96 * s} L${x + 9 * s} ${base - 79 * s}Z`,
  ][v % 3];
  return (
    <G key={k}>
      <Polygon points={`${x - 23 * s},${base} ${x + 23 * s},${base} ${x + 95 * s},${base + 9} ${x + 49 * s},${base + 9}`} fill="#2a1d2c" opacity={0.14} />
      <Rect x={x - 15 * s} y={base - 88 * s} width={30 * s} height={24 * s} fill="#85715a" />
      <Rect x={x - 17 * s} y={base - 90 * s} width={34 * s} height={3 * s} fill="#b9a58a" />
      <Rect x={x - 23 * s} y={base - 66 * s} width={46 * s} height={66 * s} fill="#9a8466" />
      <Rect x={x - 25 * s} y={base - 24 * s} width={50 * s} height={24 * s} fill="#ad9778" />
      <Rect x={x - 25 * s} y={base - 24 * s} width={50 * s} height={3 * s} fill="#c9b494" />
      <Rect x={x - 15 * s} y={base - 62 * s} width={30 * s} height={40 * s} fill="#c4b094" />
      <Rect x={x - 11 * s} y={base - 55 * s} width={22 * s} height={3.5 * s} fill="#ad9778" />
      <Rect x={x - 11 * s} y={base - 47 * s} width={22 * s} height={3.5 * s} fill="#ad9778" />
      <Rect x={x - 17 * s} y={base - 31 * s} width={34 * s} height={9 * s} fill="#cdb99d" />
      <Rect x={x - 16 * s} y={base - 23 * s} width={12 * s} height={23 * s} fill="#bba886" />
      <Rect x={x + 4 * s} y={base - 23 * s} width={12 * s} height={23 * s} fill="#bba886" />
      <Rect x={x - 21 * s} y={base - 54 * s} width={7 * s} height={26 * s} fill="#bfab8e" />
      <Rect x={x + 14 * s} y={base - 54 * s} width={7 * s} height={26 * s} fill="#bfab8e" />
      <Rect x={x - 4 * s} y={base - 68 * s} width={8 * s} height={8 * s} fill="#b9a58a" />
      <Ellipse cx={x} cy={base - 73 * s} rx={9 * s} ry={11 * s} fill="#d3c0a4" />
      <Path d={`M${x - 7 * s} ${base - 71 * s} Q${x} ${base - 50 * s} ${x + 7 * s} ${base - 71 * s}Z`} fill="#b39d7e" opacity={0.9} />
      <Rect x={x - 1 * s} y={base - 77 * s} width={2 * s} height={7 * s} fill="#a8946f" />
      <Rect x={x - 6 * s} y={base - 77 * s} width={4 * s} height={1.8 * s} fill="#7a6650" />
      <Rect x={x + 2 * s} y={base - 77 * s} width={4 * s} height={1.8 * s} fill="#7a6650" />
      <Path d={cap} fill="#b9a58a" />
      <Rect x={x - 10 * s} y={base - 82 * s} width={20 * s} height={3.2 * s} fill="#8d7962" />
      <Rect x={x + 3 * s} y={base - 66 * s} width={20 * s} height={66 * s} fill="#000" opacity={0.13} />
      <Rect x={x - 23 * s} y={base - 66 * s} width={2.5 * s} height={66 * s} fill={N_SUN} opacity={0.35} />
      <Rect x={x - 28 * s} y={base - 3 * s} width={56 * s} height={3 * s} fill="#c9b494" />
      <Ellipse cx={x - 9.4 * s} cy={base - 73 * s} rx={1.6 * s} ry={3 * s} fill="#b9a58a" />
      <Ellipse cx={x + 9.4 * s} cy={base - 73 * s} rx={1.6 * s} ry={3 * s} fill="#a8946f" />
      {[-5, 0, 5].map((dx, j) => (<Circle key={`o${j}`} cx={x + dx * s} cy={base - 80.4 * s} r={0.9 * s} fill="#e6d6b9" />))}
      <Path d={`M${x - 9 * s} ${base - 60 * s} Q${x} ${base - 50 * s} ${x + 9 * s} ${base - 60 * s}`} stroke="#e6d6b9" strokeWidth={1.6 * s} fill="none" opacity={0.8} />
      <Circle cx={x} cy={base - 52 * s} r={2.2 * s} fill="#e6d6b9" opacity={0.75} />
      <Rect x={x - 22 * s} y={base - 30 * s} width={9 * s} height={5 * s} fill="#d3c0a4" />
      <Rect x={x + 13 * s} y={base - 30 * s} width={9 * s} height={5 * s} fill="#c4b094" />
    </G>
  );
};

// Kayıp başlar: yere düşmüş, hafif yatık, sakallı ve tiaralı
const nHead = (x, base, sc, rot, k) => {
  const s = sc;
  return (
    <G key={k} transform={`rotate(${rot} ${x} ${base})`}>
      <Ellipse cx={x} cy={base - 11 * s} rx={11 * s} ry={12 * s} fill="#c9b69a" />
      <Path d={`M${x - 8 * s} ${base - 9 * s} Q${x} ${base + 6 * s} ${x + 8 * s} ${base - 9 * s}Z`} fill="#b39d7e" />
      <Path d={`M${x - 9 * s} ${base - 19 * s} L${x - 6 * s} ${base - 38 * s} Q${x} ${base - 44 * s} ${x + 6 * s} ${base - 38 * s} L${x + 9 * s} ${base - 19 * s}Z`} fill="#b39d7e" />
      <Rect x={x - 9.5 * s} y={base - 21 * s} width={19 * s} height={3 * s} fill="#8d7962" />
      <Rect x={x - 1 * s} y={base - 15 * s} width={2 * s} height={6 * s} fill="#a8946f" />
      <Rect x={x - 6 * s} y={base - 16 * s} width={4 * s} height={1.7 * s} fill="#7a6650" />
      <Rect x={x + 2 * s} y={base - 16 * s} width={4 * s} height={1.7 * s} fill="#7a6650" />
      <Ellipse cx={x + 5 * s} cy={base - 10 * s} rx={5 * s} ry={9 * s} fill="#000" opacity={0.1} />
    </G>
  );
};

// Çömelmiş aslan (dir: 1 sağa, -1 sola bakar)
const nLion = (x, base, sc, dir, k) => {
  const s = sc;
  const rc = (dx, dy, w, h, fill, key) => <Rect key={key} x={dir > 0 ? x + dx * s : x - (dx + w) * s} y={base + dy * s} width={w * s} height={h * s} fill={fill} />;
  const X = (dx) => x + dir * dx * s;
  return (
    <G key={k}>
      {rc(-22, -3, 44, 4, '#8d7962', 'pl')}
      <Ellipse cx={X(0)} cy={base - 10 * s} rx={17 * s} ry={8 * s} fill="#a8946f" />
      <Ellipse cx={X(-9)} cy={base - 11 * s} rx={9 * s} ry={9 * s} fill="#9c8767" />
      <Ellipse cx={X(11)} cy={base - 14 * s} rx={7 * s} ry={8 * s} fill="#b09a7a" />
      {rc(9, -12, 5, 11, '#b9a58a', 'l1')}
      {rc(15, -12, 4, 11, '#b9a58a', 'l2')}
      <Ellipse cx={X(16)} cy={base - 21 * s} rx={9 * s} ry={9 * s} fill="#7f6b55" />
      <Ellipse cx={X(18)} cy={base - 20 * s} rx={6 * s} ry={6.5 * s} fill="#c4b094" />
      {rc(21, -19, 3, 2, '#6d5c4a', 'ns')}
      <Path d={`M${X(-17)} ${base - 9 * s} Q${X(-27)} ${base - 14 * s} ${X(-22)} ${base - 25 * s}`} stroke="#8d7962" strokeWidth={2.4 * s} fill="none" />
    </G>
  );
};

// Kartal heykeli: kaide üstünde yarı açık kanatlı (dir: gagasının yönü)
const nEagle = (x, base, sc, dir, k) => {
  const s = sc;
  return (
    <G key={k}>
      <Rect x={x - 8 * s} y={base - 26 * s} width={16 * s} height={26 * s} fill="#9c8767" />
      <Rect x={x - 10 * s} y={base - 29 * s} width={20 * s} height={4 * s} fill="#b9a58a" />
      <Path d={`M${x - 4 * s} ${base - 46 * s} L${x - 17 * s} ${base - 54 * s} L${x - 14 * s} ${base - 34 * s} L${x - 4 * s} ${base - 31 * s}Z`} fill="#a8946f" />
      <Path d={`M${x + 4 * s} ${base - 46 * s} L${x + 17 * s} ${base - 54 * s} L${x + 14 * s} ${base - 34 * s} L${x + 4 * s} ${base - 31 * s}Z`} fill="#9c8767" />
      <Ellipse cx={x} cy={base - 40 * s} rx={6 * s} ry={11 * s} fill="#b9a58a" />
      <Circle cx={x} cy={base - 55 * s} r={4.2 * s} fill="#cdb99d" />
      <Polygon points={`${x + dir * 3 * s},${base - 56 * s} ${x + dir * 9 * s},${base - 53.5 * s} ${x + dir * 3 * s},${base - 52 * s}`} fill="#8d7962" />
    </G>
  );
};

// Teras: ayrı kesme taş blokları (kademeli derz), merdiven, üst kenar ve taban gölgesi
const nTerrace = (x0, x1) => {
  const top = GY - 30, r = kRng(77), bl = [];
  [0, 1, 2].forEach((row) => {
    let x = x0 - (row % 2) * 20;
    while (x < x1) {
      const w = 34 + r() * 22, a = Math.max(x, x0), b = Math.min(x + w, x1), q = r();
      if (b > a) bl.push(<Rect key={`b${row}_${bl.length}`} x={a} y={top + 8 + row * 7.6} width={Math.max(1, b - a - 1.2)} height={7} fill={q < 0.4 ? '#c4b094' : q < 0.75 ? '#a8946f' : '#7a6650'} opacity={0.22 + r() * 0.18} />);
      x += w;
    }
  });
  const cx = (x0 + x1) / 2;
  return (
    <G>
      <Rect x={x0} y={top} width={x1 - x0} height={GY + 8 - top} fill="#8f7b5f" />
      <Rect x={x0} y={top} width={x1 - x0} height={5} fill="#c4b094" />
      <Rect x={x0} y={top + 5} width={x1 - x0} height={3} fill="#000" opacity={0.1} />
      {bl}
      {[top + 15.4, top + 23, top + 30.6].map((y) => (<Rect key={`h${y}`} x={x0} y={y} width={x1 - x0} height={1.2} fill="#5f4f3f" opacity={0.4} />))}
      <Polygon points={`${cx - 62},${GY + 8} ${cx + 62},${GY + 8} ${cx + 36},${top + 4} ${cx - 36},${top + 4}`} fill="#a8946f" />
      {[0, 1, 2].map((i) => (<G key={`stp${i}`}><Rect x={cx - 58 + i * 8} y={top + 8 + i * 7.6} width={116 - i * 16} height={1.6} fill="#e6d6b9" opacity={0.55} /><Rect x={cx - 58 + i * 8} y={top + 9.6 + i * 7.6} width={116 - i * 16} height={2.4} fill="#000" opacity={0.16} /></G>))}
      <Rect x={x0} y={GY + 4} width={x1 - x0} height={4} fill="#000" opacity={0.15} />
    </G>
  );
};
const nRock = (x, y, w, h, k) => (
  <G key={k}>
    <Polygon points={`${x - w},${y} ${x - w * 0.8},${y - h * 0.6} ${x - w * 0.3},${y - h} ${x + w * 0.35},${y - h * 0.92} ${x + w * 0.85},${y - h * 0.45} ${x + w},${y}`} fill="#6b5a48" />
    <Polygon points={`${x - w * 0.8},${y - h * 0.6} ${x - w * 0.3},${y - h} ${x + w * 0.35},${y - h * 0.92} ${x + w * 0.1},${y - h * 0.5}`} fill="#8d7962" />
    <Path d={`M${x - w * 0.8} ${y - h * 0.6} L${x - w * 0.3} ${y - h} L${x + w * 0.35} ${y - h * 0.92}`} stroke={N_SUN} strokeWidth={1.4} fill="none" opacity={0.4} />
  </G>
);

const ART = {
  kapadokya: {
    tile: 1800,
    grads: [['far', '#d98a7a', '#f6c3a0'], ['mesa', '#e3a273', '#b26a42'], ['chim', '#f3c8a2', '#c98558'], ['hill', '#d69262', '#b9693f']],
    layers: [
      { factor: 0.05, draw: () => (<G>
        <Rect x={0} y={420} width={1800} height={260} fill="#ffd9a8" opacity={0.14} />
        <Rect x={0} y={480} width={1800} height={200} fill="#ffc8a0" opacity={0.16} />
        {[120, 520, 900, 1280, 1620].map((bx, i) => (<Polygon key={`bm${i}`} points={`${bx},0 ${bx + 70},0 ${bx + 330},680 ${bx + 120},680`} fill="#fff2d0" opacity={0.06} />))}
        {kClouds.map(([x, y, sc], i) => cloud(x, y, sc, i % 2 ? '#ffd2ab' : '#ffe3c4', 0.62, i, 1.4))}
      </G>) },
      { factor: 0.1, draw: () => { const r = kRng(11); const far = []; for (let x = 30; x < 1780; x += 18 + r() * 40) { const hh = 16 + r() * 24; const y = kY(560, RIDGE2, x) + 4; far.push(<Path key={`f${x.toFixed(0)}`} d={`M${x - 6} ${y} Q${x - 2} ${y - hh * 0.6} ${x} ${y - hh} Q${x + 2} ${y - hh * 0.6} ${x + 6} ${y}Z`} fill="#d98f7c" opacity={0.8} />); } return (<G>
        <Path d="M1150 540 L1290 440 L1370 380 L1420 352 L1470 382 L1550 442 L1700 540Z" fill="#c9858a" opacity={0.85} />
        <Path d="M1370 380 L1420 352 L1470 382 L1448 398 L1428 386 L1408 404 L1392 390Z" fill="#fbe3dc" opacity={0.9} />
        <Path d="M1420 352 L1470 382 L1550 442 L1700 540 L1500 540Z" fill="#8a4a60" opacity={0.18} />
        <Path d={kPath(500, RIDGE1)} fill={K('far')} />
        <Path d={kPath(560, RIDGE2)} fill="#e7a98b" opacity={0.9} />
        {far}
        <Path d={kPath(578, [[16, 4, 1], [7, 11, 0]])} fill="#f4c6aa" opacity={0.92} />
        <Path d={kPath(596, [[16, 4, 1.4], [8, 10, 0.6]])} fill="#e49a82" />
        <Path d={kPath(614, [[14, 5, 2], [6, 12, 1]])} fill="#c8715e" opacity={0.95} />
        <Path d={kPath(632, [[10, 6, 0.3], [5, 14, 2]])} fill="#a85a52" opacity={0.9} />
      </G>); } },
      { factor: 0.22, draw: () => (<G>{mist(kMistList, 0.34)}</G>) },
      { factor: 0.35, draw: () => { const r = kRng(5); const trees = []; for (let x = 40; x < 1780; x += 30 + r() * 70) trees.push(kBoulder(x, kY(648, [[10, 5, 0.5], [6, 13, 1]], x) + 16, 8 + r() * 12, 7 + r() * 9, `t${x.toFixed(0)}`)); return (<G>
        <Path d={kPath(648, [[10, 5, 0.5], [6, 13, 1]])} fill="#d49a70" />
        {mesa(90, 110, 80, 'm1')}{mesa(760, 90, 62, 'm2')}{mesa(1010, 150, 118, 'm3')}{mesa(1380, 100, 72, 'm4')}{mesa(1640, 80, 56, 'm5')}
        {kRock(300, 230, 185, 'castle')}
        {kRock(1180, 190, 140, 'rock2')}
        {kVillage(560, 'vil')}
        {trees}
      </G>); } },
      { factor: 0.55, draw: () => { const r = kRng(23); const items = []; let x = 50; while (x < 1740) { const q = r(); const h = 55 + r() * 120; const w = Math.max(36, h * (0.4 + r() * 0.12)); const key = `c${items.length}`;
        if (q < 0.3) items.push(kCap(x, Math.min(h, w * 3.1), w, key)); else if (q < 0.52) items.push(kCone(x, h * 0.9, w * 1.1, key)); else if (q < 0.7) items.push(kTwin(x, h, w * 1.3, key)); else if (q < 0.86) items.push(<G key={key} transform={`rotate(${r() < 0.5 ? -3 : 3} ${x} ${GY + 8})`}>{kCap(x, Math.min(h * 0.9, w * 3), w, 't')}</G>); else items.push(kCone(x, h * 0.6, w * 0.9, key));
        x += w * 0.8 + 18 + r() * (r() < 0.3 ? 40 : 150); }
        return (<G>
          <Path d={kPath(668, [[12, 3, 1], [6, 11, 0.5]])} fill={K('hill')} />
          {items}
        </G>); } },
    ],
    ground: () => (<G>
      <Rect x={0} y={GY} width={1800} height={H - GY} fill="#cf8656" />
      <Rect x={0} y={GY} width={1800} height={12} fill="#f0b27a" />
      {range(-1, 36).map((i) => (<Polygon key={i} points={`${i * 50},${GY + 12} ${i * 50 + 22},${GY + 12} ${i * 50 + 6},${H} ${i * 50 - 16},${H}`} fill="#bf7646" />))}
      {range(0, 28).map((i) => (<Ellipse key={`p${i}`} cx={25 + i * 62} cy={GY + 36 + (i % 3) * 16} rx={5} ry={3} fill="#a5633a" opacity={0.7} />))}
      {range(0, 17).map((i) => (<Path key={`st${i}`} d={`M${i * 100 + 10} ${GY + 26 + (i % 2) * 20} q30 -5 62 0`} stroke="#e0a070" strokeWidth={2} fill="none" opacity={0.35} />))}
      {range(0, 15).map((i) => { const gx = 40 + i * 113; const gy = GY + 40 + (i % 3) * 14; return (<G key={`sn${i}`}><Ellipse cx={gx} cy={gy} rx={9} ry={4.5} fill="#b06a42" opacity={0.8} /><Ellipse cx={gx - 2} cy={gy - 1.5} rx={5} ry={2} fill="#e3a574" opacity={0.6} /></G>); })}
    </G>),
  },

  nemrut: {
    tile: 1800,
    grads: [['far', '#6a4a8c', '#d49aa8'], ['far2', '#8a5f94', '#eaa3a2'], ['mound', '#d2c1a4', '#8d7962'], ['hill', '#9a8068', '#6f5c49'], ['far0', '#4a3672', '#b184a4']],
    layers: [
      { factor: 0.05, draw: () => (<G>
        {nStars()}
        {[[120, 130, 130, 5], [520, 95, 160, 5], [900, 190, 120, 4], [1280, 120, 150, 5], [1620, 210, 110, 4]].map(([x, y, rx, ry], i) => (<Ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#ffc9a0" opacity={0.5} />))}
        {[[300, 260, 150, 6], [760, 300, 130, 5], [1140, 270, 170, 6], [1520, 320, 120, 5]].map(([x, y, rx, ry], i) => (<Ellipse key={`q${i}`} cx={x} cy={y} rx={rx} ry={ry} fill="#f7a6a8" opacity={0.4} />))}
        {[[200, 360, 260, 7], [680, 400, 300, 8], [1100, 350, 280, 7], [1500, 420, 240, 7], [400, 460, 220, 5], [1300, 480, 260, 6]].map(([x, y, rx, ry], i) => (<Path key={`sk${i}`} d={`M${x - rx} ${y} Q${x} ${y - ry} ${x + rx} ${y} Q${x} ${y + ry * 0.35} ${x - rx} ${y}Z`} fill={i % 2 ? '#ffc9a0' : '#f7a6a8'} opacity={0.32} />))}
        {[[900, 590, 760, 36, 0.1], [900, 600, 520, 22, 0.12], [900, 606, 300, 12, 0.16]].map(([x, y, rx, ry, op], i) => (<Ellipse key={`hz${i}`} cx={x} cy={y} rx={rx} ry={ry} fill="#ffd9a0" opacity={op} />))}
      </G>) },
      { factor: 0.1, draw: () => { const p1 = nPts(470, [[78, 3, 0.5], [32, 7, 1.3], [14, 13, 0.2]], 12, 3); const p0 = nPts(418, [[46, 2, 0.2], [24, 5, 0.9], [12, 11, 1.6]], 9, 13); const p2 = nPts(556, [[50, 4, 1], [22, 9, 0.4], [9, 17, 2]], 8, 5); return (<G>
        <Path d={nFill(p0)} fill={NM('far0')} opacity={0.7} />{nSnow(p0, 450, 'sz')}<Path d={nFill(p1)} fill={NM('far')} />{nFacets(p1, 520, 'fa', 0.2)}
        {nSnow(p1, 505, 'sn')}
        <Path d={nLine(p1)} stroke={N_SUN} strokeWidth={1.6} fill="none" opacity={0.35} />
        <Path d={nFill(p2)} fill={NM('far2')} opacity={0.96} />{nFacets(p2, 600, 'fb', 0.14)}
        <Path d={nLine(p2)} stroke={N_SUN} strokeWidth={1.2} fill="none" opacity={0.18} />
      </G>); } },
      { factor: 0.22, draw: () => (<G>
        <Rect x={0} y={575} width={1800} height={120} fill="#f7b6b0" opacity={0.12} />
        {mist([[200, 600, 150, 14], [700, 620, 180, 16], [1150, 598, 140, 13], [1560, 616, 160, 15], [430, 640, 130, 10], [1350, 646, 150, 10], [60, 590, 120, 9], [980, 640, 200, 9], [1700, 600, 130, 10]], 0.3)}
      </G>) },
      { factor: 0.35, draw: () => { const hill = nPts(642, [[22, 2, 0.5], [10, 5, 1.1], [5, 11, 0.3]], 6, 7); return (<G>
        <Path d={nFill(hill)} fill={NM('hill')} />
        <Path d={nLine(hill)} stroke={N_SUN} strokeWidth={1.2} fill="none" opacity={0.18} />
        {hill.filter((_, i) => i > 0 && i % 6 === 3).map(([x, y], i) => (<Polygon key={`jt${i}`} points={`${x - 4},${y + 3} ${x},${y - 16 - (i % 3) * 5} ${x + 4},${y + 3}`} fill="#5b4a3a" opacity={0.75} />))}
        <Ellipse cx={900} cy={GY - 150} rx={430} ry={110} fill={N_SUN} opacity={0.07} />
        {nMound(230, 210, 70, 'm2')}{nMound(1570, 280, 95, 'm3')}
        {nMound(900, 780, 250, 'main')}
        {nTerrace(560, 1240)}
        {nEagle(592, GY - 30, 1.0, 1, 'eL')}{nLion(640, GY - 30, 1.05, 1, 'lL')}
        {nLion(1160, GY - 30, 1.05, -1, 'lR')}{nEagle(1208, GY - 30, 1.0, -1, 'eR')}
        {[0, 1, 2, 3, 4].map((i) => nSeat(720 + i * 90, GY - 30, 1.02, i, `st${i}`))}
        {nHead(742, GY - 2, 0.85, -12, 'h1')}{nHead(850, GY - 1, 0.75, 10, 'h2')}{nHead(1010, GY - 2, 0.8, -8, 'h3')}{nHead(1120, GY - 1, 0.7, 14, 'h4')}
      </G>); } },
      { factor: 0.55, draw: () => { const r = kRng(41); const o = []; for (let x = 30; x < 1770; x += 38 + r() * 100) { const q = r(); const y = GY + 6; const key = `f${x.toFixed(0)}`;
        if (q < 0.34) { const w = 12 + r() * 20; o.push(nRock(x, y, w, w * (0.7 + r() * 0.3), key)); }
        else if (q < 0.66) o.push(<G key={key}>{[-8, -3, 2, 8].map((dx, j) => (<Polygon key={j} points={`${x + dx - 2.5},${y} ${x + dx + (j % 2 ? 3 : -3)},${y - 14 - r() * 9} ${x + dx + 2.5},${y}`} fill={j % 2 ? '#a8a050' : '#c0b060'} />))}</G>);
        else if (q < 0.82) o.push(<G key={key}>{[-14, -6, 0, 7, 13].map((ang, j) => (<Line key={j} x1={x} y1={y} x2={x + ang} y2={y - 16 - (j % 3) * 4} stroke="#54463a" strokeWidth={1.6} />))}{[-14, 0, 13].map((ang, j) => (<Circle key={`l${j}`} cx={x + ang} cy={y - 17 - (j % 2) * 4} r={2.4} fill="#a8a050" />))}</G>);
        else o.push(<G key={key}><Rect x={x - 11} y={y - 10} width={22} height={11} fill="#a8946f" /><Rect x={x - 8} y={y - 19} width={16} height={9} fill="#b9a58a" /><Rect x={x - 11} y={y - 10} width={22} height={2} fill={N_SUN} opacity={0.3} /></G>); }
        const sh = range(0, 15).map((i) => { const x = 25 + i * 112 + r() * 50, w = 13 + r() * 16, y = GY + 8; return (<G key={`sh${i}`}><Ellipse cx={x} cy={y - w * 0.3} rx={w} ry={w * 0.5} fill="#6f6a3a" /><Ellipse cx={x - w * 0.3} cy={y - w * 0.45} rx={w * 0.6} ry={w * 0.38} fill="#8a8446" /><Ellipse cx={x - w * 0.45} cy={y - w * 0.58} rx={w * 0.25} ry={w * 0.13} fill="#c0b060" opacity={0.6} /></G>); });
        const fl = range(0, 46).map((i) => { const x = r() * 1800, y = GY + 3 + r() * 5, c = r(); return <Circle key={`fl${i}`} cx={x} cy={y} r={1.3 + r()} fill={c < 0.4 ? '#f0e6a0' : c < 0.7 ? '#e7a0b0' : '#fff'} opacity={0.85} />; });
        return (<G><Path d={kPath(704, [[8, 3, 0.4], [4, 11, 1]])} fill="#7a6650" />{sh}{o}{fl}</G>); } },
    ],
    ground: () => (<G>
      <Rect x={0} y={GY} width={1800} height={H - GY} fill="#a88f70" />
      <Rect x={0} y={GY} width={1800} height={12} fill="#c9b494" />
      <Rect x={0} y={GY + 12} width={1800} height={3} fill="#000" opacity={0.08} />
      {range(0, 11).map((i) => (<Rect key={`sl${i}`} x={20 + i * 160 + (i % 2) * 24} y={GY + 22 + (i % 3) * 16} width={70 + (i % 3) * 14} height={18} rx={4} fill="#b9a384" opacity={0.45} />))}
      {range(0, 40).map((i) => (<Ellipse key={`p${i}`} cx={20 + i * 45 + (i % 3) * 7} cy={GY + 30 + (i % 4) * 14} rx={5 + (i % 3) * 2} ry={3} fill="#8d7962" opacity={0.7} />))}
      {range(0, 22).map((i) => (<Rect key={`l${i}`} x={30 + i * 82} y={GY + 24 + (i % 3) * 18} width={30} height={2.4} rx={1} fill="#c9b494" opacity={0.5} />))}
      {range(0, 70).map((i) => (<Ellipse key={`pb${i}`} cx={(i * 97) % 1800} cy={GY + 20 + ((i * 53) % 100)} rx={2 + (i % 4)} ry={1.4 + (i % 3) * 0.4} fill={i % 3 ? '#c9b494' : '#6f5c49'} opacity={0.45} />))}
      {range(0, 14).map((i) => (<Path key={`cr${i}`} d={`M${60 + i * 124} ${GY + 34 + (i % 4) * 22} l9 -3 l8 4 l10 -2`} stroke="#5f4f3f" strokeWidth={1.2} fill="none" opacity={0.3} />))}
      <Rect x={0} y={H - 56} width={1800} height={56} fill="#2a1d2c" opacity={0.12} />
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
        {/* ortada küçük ada */}
        <Ellipse cx={1010} cy={598} rx={44} ry={5} fill="#ffffff" opacity={0.55} />
        <Path d="M974 598 Q990 578 1012 580 Q1034 582 1046 598 Z" fill={EG('hill')} />
        {/* aynalanmış ikinci tepe (sağda) */}
      </G>) },
      { factor: 0.5, draw: () => (<G>
        {/* denizde: tekneler, gulet, jet-ski, yüzenler */}
        {egeGulet(150, 612, 1, 'g1')}{egeBoat(335, 640, 0.9, 'b1')}{egeBoat(500, 604, 0.6, 'b2')}
        {egeJet(690, 652, 1, '#e74c3c', SKIN[0], 'j1')}
        {egeSwimmer(850, 656, SKIN[1], 'sw1')}{egeSwimmer(905, 668, SKIN[0], 'sw2')}
        {egeBoat(1010, 620, 0.7, 'b3')}
        {egeYacht(612, 606, 1.1, 'yacht')}
        {egeSail(1300, 608, 1, 'sail')}
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

  istanbul: {
    grads: [['far', '#8c9fc9', '#d1c2d8'], ['far2', '#7b8dba', '#bdb4d0'], ['hag', '#8a84ad', '#625e8c'], ['water', '#3f93d6', '#173f78'], ['bay', '#e9a98f', '#3d78b8']],
    layers: [
      { factor: 0.05, draw: () => (<G>
        {[[110, 250, 120, 8], [430, 205, 150, 8], [560, 300, 90, 6], [250, 345, 130, 6]].map(([x, y, rx, ry], i) => (<Ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#ffc9a0" opacity={0.65} />))}
        {[[60, 150, 90, 5], [340, 120, 120, 5], [520, 175, 70, 4]].map(([x, y, rx, ry], i) => (<Ellipse key={`p${i}`} cx={x} cy={y} rx={rx} ry={ry} fill="#fff1e0" opacity={0.5} />))}
      </G>) },
      { factor: 0.18, draw: () => (<G>{gull(90, 120, 1)}{gull(135, 152, 2)}{gull(380, 90, 3)}{gull(470, 185, 4)}{gull(545, 110, 5)}</G>) },
      { factor: 0.1, draw: () => (<G>
        <Path d={ridge([[0, 600], [110, 570], [240, 588], [370, 560], [490, 584], [600, 600]])} fill={S2('far')} />
        <Path d={ridge([[0, 618], [130, 598], [260, 612], [400, 592], [520, 610], [600, 618]])} fill={S2('far2')} />
        {range(0, 29).map((i) => (<Rect key={i} x={i * 20 + 3} y={620 + ((i * 7) % 12)} width={10} height={GY - 620} fill="#9a9bc0" opacity={0.7} />))}
      </G>) },
      { factor: 0.22, draw: () => (<G>
        <Rect x={0} y={640} width={TILE} height={GY - 640} fill={S2('bay')} />
        {/* eski şehir: Ayasofya + Süleymaniye + Galata */}
        <Rect x={0} y={632} width={TILE} height={10} fill={S2('hag')} />
        {range(0, 29).map((i) => (<Rect key={`b${i}`} x={i * 20 + 1} y={612 + ((i * 13) % 18)} width={17} height={34} fill={S2('hag')} />))}
        {isMosque(160, 634, 1.2, [[-52, 80], [52, 80], [-60, 62], [60, 62]], '#6f6a98', 'aya')}
        {isMosque(330, 634, 1.0, [[-56, 92], [56, 92], [-64, 68], [64, 68]], '#6f6a98', 'sul')}
        <Rect x={470} y={560} width={22} height={76} fill="#8a82ad" />
        <Rect x={466} y={556} width={30} height={7} fill="#8e86ab" />
        <Rect x={470} y={534} width={22} height={24} fill="#8a82ad" />
        <Polygon points="467,534 495,534 481,500" fill="#6a678f" />
        <Rect x={480.2} y={486} width={1.6} height={16} fill="#6a678f" />
        {[546, 570, 594, 618].map((y) => (<Rect key={y} x={478.5} y={y} width={5} height={9} rx={2.5} fill="#ffd77a" opacity={0.85} />))}
        {range(0, 9).map((i) => isWin(14 + i * 62, 642 + (i % 3) * 5, `w${i}`))}
        {/* Kız Kulesi */}
        <Ellipse cx={560} cy={652} rx={24} ry={5} fill="#7d7aa3" />
        <Rect x={553} y={632} width={14} height={20} fill="#f2e6dc" />
        <Rect x={550} y={630} width={20} height={4} fill="#d8c8bc" />
        <Path d="M553 630 A7 7 0 0 1 567 630 Z" fill="#b9594a" />
        <Rect x={559} y={617} width={2} height={7} fill="#b9594a" />
        <Rect x={558} y={638} width={4} height={6} rx={2} fill="#ffd77a" opacity={0.9} />
      </G>) },
      { factor: 0.4, draw: () => (<G>
        {/* köprü */}
        <Line x1={100} y1={340} x2={0} y2={585} stroke="#2f3b63" strokeWidth={3} />
        <Line x1={500} y1={340} x2={600} y2={585} stroke="#2f3b63" strokeWidth={3} />
        <Path d="M100 340 Q300 780 500 340" stroke="#2f3b63" strokeWidth={3.4} fill="none" />
        {range(0, 24).map((i) => { const x = 100 + i * 16.7; return (<Line key={i} x1={x} y1={isCable(x)} x2={x} y2={585} stroke="#2f3b63" strokeWidth={1.3} />); })}
        {[100, 500].map((x) => (<G key={x}>
          <Rect x={x - 8} y={330} width={5} height={330} fill="#2a3560" />
          <Rect x={x + 3} y={330} width={5} height={330} fill="#2a3560" />
          {[380, 450, 520].map((y) => (<Rect key={y} x={x - 8} y={y} width={16} height={4} fill="#2a3560" />))}
          <Rect x={x - 10} y={326} width={20} height={6} fill="#c0392b" />
        </G>))}
        <Rect x={0} y={583} width={TILE} height={9} fill="#2a3560" />
        <Rect x={0} y={592} width={TILE} height={3} fill="#4b5a94" />
        {range(0, 29).map((i) => (<Circle key={`l${i}`} cx={10 + i * 20} cy={581} r={1.8} fill="#ffe08a" />))}
        {[[30, '#ffffff'], [190, '#ff6b5a'], [350, '#ffffff'], [540, '#ff6b5a']].map(([x, c]) => (<Rect key={x} x={x} y={577} width={8} height={4} rx={1.5} fill="#1f2750" />))}
      </G>) },
      { factor: 0.7, draw: () => (<G>
        {isVapur(175, 712, 1.0, 'vp')}
        <Polygon points="446,646 446,702 492,702" fill="#f4e4d0" />
        <Polygon points="442,654 442,702 420,702" fill="#e8cfb4" />
        <Rect x={445} y={640} width={2} height={64} fill="#6b4a2a" />
        <Path d="M412 704 L498 704 L488 714 L424 714 Z" fill="#2b3558" />
        <Path d="M530 702 L584 702 L578 714 L536 714 Z" fill="#7a3b3b" />
        <Polygon points="556,680 556,702 578,702" fill="#f4e4d0" />
      </G>) },
    ],
    ground: () => (<G>
      <Rect x={0} y={GY} width={TILE} height={H - GY} fill={S2('water')} />
      <Rect x={0} y={GY} width={TILE} height={6} fill="#7cc4f2" opacity={0.7} />
      {range(0, 8).map((i) => (<Rect key={`sr${i}`} x={14 + i * 72 + (i % 2) * 14} y={GY + 14 + (i % 4) * 15} width={32 + (i % 3) * 12} height={3.2} rx={1.6} fill="#ffd9a6" opacity={0.55} />))}
      <Path d={wave(GY + 28, 4, 6, 0, null)} stroke="#8fd0f5" strokeWidth={3} fill="none" />
      <Path d={wave(GY + 56, 4, 5, 1.5, null)} stroke="#6fb7e8" strokeWidth={3} fill="none" />
      <Path d={wave(GY + 78, 3, 7, 0.7, null)} stroke="#5aa6dd" strokeWidth={2.5} fill="none" />
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

// WEB OPTİMİZASYONU: willChange, tarayıcıya katmanı ayrı bir GPU yüzeyi olarak tutmasını söyler;
// böylece kaydırırken binlerce SVG öğesi her karede yeniden boyanmaz, sadece yüzey kaydırılır.
const WEB_LAYER = Platform.OS === 'web' ? { willChange: 'transform', backfaceVisibility: 'hidden' } : null;

const Layer = ({ id, index, ground, factor, s, scroll }) => (
  <View
    pointerEvents="none"
    style={[
      { position: 'absolute', left: 0, top: 0, transform: [{ translateX: -((scroll * factor) % (ART[id].tile || TILE)) * s }] },
      WEB_LAYER,
    ]}
  >
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
      {ART[theme.id].layers.map((l, i) => (
        <React.Fragment key={i}>
          <Layer id={theme.id} index={i} factor={l.factor} s={s} scroll={scroll} />
          {theme.id === 'kapadokya' && i === 2 ? <BalloonField s={s} scroll={scroll} /> : null}
        </React.Fragment>
      ))}
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
