import React from 'react';
import Svg, { G, Ellipse, Circle, Polygon, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import useTicker from '../hooks/useTicker';

// Yerel koordinat: kuş (0,0) merkezli, sağa bakar, yaklaşık 80x50 birim.
export function BirdArt({ type, wing = 0 }) {
  const wingG = (color, tip) => (
    <G transform={`translate(-2 3) rotate(${wing})`}>
      <Ellipse cx={-10} cy={0} rx={17} ry={8} fill={color} />
      {tip ? <Ellipse cx={-23} cy={0} rx={5} ry={4.5} fill={tip} /> : null}
    </G>
  );
  switch (type) {
    case 'owl':
      return (
        <G>
          <Polygon points="-18,6 -34,2 -32,17 -16,14" fill="#5d4631" />
          <Polygon points="-2,-17 3,-31 12,-19" fill="#6d4f35" />
          <Polygon points="18,-19 26,-31 30,-15" fill="#6d4f35" />
          <Ellipse cx={4} cy={0} rx={26} ry={23} fill="#8d6e4f" />
          <Ellipse cx={10} cy={10} rx={14} ry={12} fill="#ecd9b7" />
          <Circle cx={8} cy={-8} r={8.5} fill="#fff7e6" />
          <Circle cx={25} cy={-8} r={8.5} fill="#fff7e6" />
          <Circle cx={10} cy={-8} r={4} fill="#111" />
          <Circle cx={27} cy={-8} r={4} fill="#111" />
          <Circle cx={11.5} cy={-9.5} r={1.4} fill="#fff" />
          <Circle cx={28.5} cy={-9.5} r={1.4} fill="#fff" />
          <Polygon points="13,-1 21,-1 17,8" fill="#f5a623" />
          {wingG('#5d4631')}
        </G>
      );
    case 'eagle':
      return (
        <G>
          <Defs>
            <LinearGradient id="egBody" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#92602f" />
              <Stop offset="1" stopColor="#4a2913" />
            </LinearGradient>
            <LinearGradient id="egHead" gradientUnits="userSpaceOnUse" x1="0" y1="-23" x2="0" y2="8">
              <Stop offset="0" stopColor="#ffffff" />
              <Stop offset="1" stopColor="#e4dccb" />
            </LinearGradient>
          </Defs>
          {/* Kuyruk: beyaz, yelpaze gibi açılan tüyler */}
          <G>
            <Path d="M-18 -4 L-45 -12 Q-49 -7 -45 -3 L-18 3 Z" fill="#f1ebdd" />
            <Path d="M-18 0 L-47 -2 Q-50 3 -46 6 L-18 6 Z" fill="#ffffff" />
            <Path d="M-18 3 L-45 11 Q-48 15 -43 16 L-17 9 Z" fill="#e6dfce" />
            <Path d="M-24 -2 L-44 -8 M-24 3 L-45 2 M-24 6 L-42 12" stroke="#cfc6b2" strokeWidth={1.2} strokeLinecap="round" fill="none" />
          </G>
          {/* Pençeler */}
          <Path d="M-5 17 L-4 26 L-1 24 L1 27 L4 23 L8 25 L8 16 Z" fill="#f2b705" />
          <Path d="M-4 26 L-6 29.5 M1 27 L0 30.5 M8 25 L10 28.5" stroke="#3a2a10" strokeWidth={1.6} strokeLinecap="round" />
          {/* Gövde */}
          <Ellipse cx={0} cy={2} rx={27} ry={20} fill="url(#egBody)" />
          <Path d="M-14 6 q4 4 8 0 M-6 11 q4 4 8 0 M2 6 q4 4 8 0 M-10 14 q4 4 8 0 M6 12 q4 4 8 0" stroke="#b67e45" strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.55} />
          {/* Boyun + beyaz kafa */}
          <Ellipse cx={10} cy={-6} rx={15} ry={13} fill="url(#egHead)" />
          <Circle cx={17} cy={-9} r={13} fill="url(#egHead)" />
          {/* Sert bakış: kaş çıkıntısı + sarı göz */}
          <Path d="M11 -17 L26 -10.5 L25 -14.5 L14 -20.5 Z" fill="#d3cbb8" />
          <Circle cx={21} cy={-9} r={4.2} fill="#ffd23a" />
          <Circle cx={21.8} cy={-9} r={2.2} fill="#111" />
          <Circle cx={22.6} cy={-10} r={0.9} fill="#fff" />
          <Path d="M15 -15 L26 -9.5" stroke="#4a2c12" strokeWidth={2.4} strokeLinecap="round" />
          {/* Kıvrık sarı gaga */}
          <Path d="M27 -12 Q39 -15 44 -6 Q45 -1 41 2 Q41 -3 37 -4 Q31 -3 27 -2 Z" fill="#ffcc1f" />
          <Path d="M27 -2 Q34 -1 39 1.5 Q35 5 28 3 Z" fill="#dfa20c" />
          <Ellipse cx={32} cy={-8} rx={1.4} ry={1} fill="#9a6a00" />
          <Path d="M29 -11 Q36 -12.5 41 -8" stroke="#fff0a8" strokeWidth={1.2} strokeLinecap="round" fill="none" opacity={0.7} />
          {/* Kanat: uzun, parmaklı birincil tüyler + örtü tüyleri */}
          <G transform={`translate(-2 3) rotate(${wing})`}>
            <Ellipse cx={-27} cy={0} rx={17} ry={3.8} fill="#2f1a0b" transform="rotate(-17)" />
            <Ellipse cx={-29} cy={0} rx={18} ry={3.8} fill="#3a2110" transform="rotate(-8)" />
            <Ellipse cx={-30} cy={0} rx={18} ry={3.8} fill="#2f1a0b" transform="rotate(1)" />
            <Ellipse cx={-28} cy={0} rx={17} ry={3.8} fill="#3a2110" transform="rotate(10)" />
            <Ellipse cx={-24} cy={0} rx={14} ry={3.6} fill="#2f1a0b" transform="rotate(19)" />
            <Ellipse cx={-11} cy={-1} rx={17} ry={9.5} fill="#5a3418" />
            <Ellipse cx={-9} cy={-3} rx={12} ry={5} fill="#8a5a2e" opacity={0.75} />
            <Path d="M-22 -2 Q-12 -9 -1 -6" stroke="#c9985a" strokeWidth={1.4} strokeLinecap="round" fill="none" opacity={0.6} />
          </G>
        </G>
      );
    case 'gull':
      return (
        <G>
          <Polygon points="-20,-2 -38,-6 -38,9 -20,7" fill="#e3eaee" />
          <Ellipse cx={0} cy={0} rx={24} ry={16} fill="#ffffff" stroke="#cfd8dc" strokeWidth={1.5} />
          <Circle cx={15} cy={-6} r={11} fill="#ffffff" />
          <Polygon points="23,-6 40,-1 23,3" fill="#ffd54f" />
          <Circle cx={33} cy={0.5} r={1.8} fill="#e53935" />
          <Circle cx={17} cy={-8} r={2.6} fill="#111" />
          {wingG('#b0bec5', '#37474f')}
        </G>
      );
    case 'bird':
    default:
      return (
        <G>
          <Defs>
            <LinearGradient id="bdBody" gradientUnits="userSpaceOnUse" x1="0" y1="-26" x2="0" y2="22">
              <Stop offset="0" stopColor="#7dd0ff" />
              <Stop offset="0.55" stopColor="#3b97f0" />
              <Stop offset="1" stopColor="#1f6bd1" />
            </LinearGradient>
            <LinearGradient id="bdBelly" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#ffa95e" />
              <Stop offset="0.55" stopColor="#ffd9a8" />
              <Stop offset="1" stopColor="#fff6e4" />
            </LinearGradient>
          </Defs>
          {/* Kuyruk: üç yelpaze tüy */}
          <Ellipse cx={-33} cy={2} rx={15} ry={4.4} fill="#1a58b8" transform="rotate(-15 -18 2)" />
          <Ellipse cx={-34} cy={2} rx={16} ry={4.6} fill="#2272d6" transform="rotate(0 -18 2)" />
          <Ellipse cx={-33} cy={2} rx={15} ry={4.4} fill="#1a58b8" transform="rotate(15 -18 2)" />
          <Ellipse cx={-46} cy={2} rx={3.2} ry={3.2} fill="#cfeaff" />
          {/* Tepelik */}
          <Path d="M1 -17 Q-1 -31 10 -29 Q6 -25 10 -21 Z" fill="#2f86ea" />
          <Path d="M7 -19 Q8 -29 17 -26 Q13 -23 15 -19 Z" fill="#4aa3f5" />
          {/* Gövde ve kafa */}
          <Ellipse cx={0} cy={1} rx={25} ry={20} fill="url(#bdBody)" />
          <Circle cx={11} cy={-6} r={14.5} fill="url(#bdBody)" />
          {/* Göğüs/karın */}
          <Path d="M-10 10 Q-2 -2 14 4 Q22 12 14 18 Q2 24 -10 10 Z" fill="url(#bdBelly)" />
          {/* Göz */}
          <Circle cx={16} cy={-8} r={6.6} fill="#ffffff" />
          <Circle cx={17.6} cy={-7.6} r={3.9} fill="#16213a" />
          <Circle cx={19} cy={-9.2} r={1.5} fill="#ffffff" />
          <Circle cx={16.4} cy={-5.8} r={0.8} fill="#ffffff" opacity={0.8} />
          <Path d="M10 -13 Q16 -16 22 -12" stroke="#17408c" strokeWidth={1.8} strokeLinecap="round" fill="none" />
          {/* Gaga */}
          <Path d="M24 -6 Q33 -5.5 37 -0.5 Q30 0.5 24 -1 Z" fill="#ffb326" />
          <Path d="M24 -1 Q31 0.8 36 0.6 Q31 5.5 24 3.6 Z" fill="#ee8a00" />
          <Path d="M26 -5 Q31 -4.8 34 -2.4" stroke="#ffe08a" strokeWidth={1.1} strokeLinecap="round" fill="none" />
          {/* Kanat */}
          <G transform={`translate(-2 3) rotate(${wing})`}>
            <Ellipse cx={-22} cy={0} rx={12} ry={4.6} fill="#154aa0" transform="rotate(-13)" />
            <Ellipse cx={-23} cy={0} rx={13} ry={4.8} fill="#1a58b8" transform="rotate(-2)" />
            <Ellipse cx={-21} cy={0} rx={12} ry={4.6} fill="#154aa0" transform="rotate(9)" />
            <Ellipse cx={-9} cy={0} rx={17} ry={9.2} fill="#2c80e4" />
            <Ellipse cx={-8} cy={-2.6} rx={12} ry={4.2} fill="#8fd2ff" opacity={0.9} />
            <Path d="M-22 1.5 Q-12 5 -1 2.5" stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.85} />
          </G>
        </G>
      );
  }
}

export function BirdIcon({ type, size = 80, animate = true }) {
  const t = useTicker(24, animate);
  const wing = animate ? Math.sin(t * 14) * 35 : 0;
  return (
    <Svg width={size} height={size * 0.75} viewBox="-50 -36 100 75">
      <BirdArt type={type} wing={wing} />
    </Svg>
  );
}
