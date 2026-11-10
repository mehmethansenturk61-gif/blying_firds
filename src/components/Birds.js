import React from 'react';
import Svg, { G, Ellipse, Circle, Polygon, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import useTicker from '../hooks/useTicker';

// Yerel koordinat: kuş (0,0) merkezli, sağa bakar, yaklaşık 80x50 birim.
// Ölü göz: çarpı işareti
const Cross = ({ cx, cy, s = 4, w = 2.2 }) => (
  <Path d={`M${cx - s} ${cy - s} L${cx + s} ${cy + s} M${cx + s} ${cy - s} L${cx - s} ${cy + s}`} stroke="#1b1b1b" strokeWidth={w} strokeLinecap="round" fill="none" />
);

export function BirdArt({ type, wing = 0, dead = false }) {
  switch (type) {
    case 'owl':
      return (
        <G>
          <Defs>
            <LinearGradient id="owBody" gradientUnits="userSpaceOnUse" x1="0" y1="-26" x2="0" y2="24">
              <Stop offset="0" stopColor="#b99470" />
              <Stop offset="0.5" stopColor="#8f6b49" />
              <Stop offset="1" stopColor="#5a3d27" />
            </LinearGradient>
            <LinearGradient id="owBelly" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#fff3da" />
              <Stop offset="0.6" stopColor="#f0d9ad" />
              <Stop offset="1" stopColor="#d9b67f" />
            </LinearGradient>
            <LinearGradient id="owFace" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#fffbf1" />
              <Stop offset="1" stopColor="#f2dfbb" />
            </LinearGradient>
          </Defs>
          {/* Kuyruk: üç yelpaze tüy, enine çizgili */}
          <Ellipse cx={-28} cy={6} rx={13} ry={4.6} fill="#4a321f" transform="rotate(-14 -16 6)" />
          <Ellipse cx={-30} cy={7} rx={14} ry={4.8} fill="#5d4129" transform="rotate(2 -16 6)" />
          <Ellipse cx={-28} cy={8} rx={13} ry={4.6} fill="#4a321f" transform="rotate(18 -16 6)" />
          <Path d="M-27 2.5 L-27 11.5 M-33 3 L-33 12 M-39 4.5 L-38 11" stroke="#a07c57" strokeWidth={1.3} strokeLinecap="round" fill="none" opacity={0.7} />
          {/* Pençeler */}
          <Path d="M-2 20 L-2 25 M-2 25 L-6 28.5 M-2 25 L-2 29 M-2 25 L2 28.5 M10 21 L10 26 M10 26 L6 29.5 M10 26 L10 30 M10 26 L14 29.5" stroke="#f2a31b" strokeWidth={2.2} strokeLinecap="round" fill="none" />
          {/* Kulak tüyleri */}
          <Path d="M-4 -15 Q-4 -29 4 -34 Q7 -26 11 -19 Z" fill="#5a3d27" />
          <Path d="M-1 -17 Q0 -26 4 -30 Q6 -24 8 -19 Z" fill="#a98262" />
          <Path d="M19 -19 Q24 -29 33 -33 Q34 -23 31 -12 Z" fill="#5a3d27" />
          <Path d="M22 -18 Q26 -26 31 -29 Q31 -22 29 -15 Z" fill="#a98262" />
          {/* Gövde */}
          <Ellipse cx={4} cy={0} rx={26} ry={23} fill="url(#owBody)" />
          <Path d="M-14 -8 q3 -2 6 0 M-18 0 q3 -2 6 0 M-14 8 q3 -2 6 0 M-20 -14 q3 -2 6 0" stroke="#5a3d27" strokeWidth={1.6} strokeLinecap="round" fill="none" opacity={0.5} />
          {/* Göğüs: krem renk, tüy pulları */}
          <Ellipse cx={10} cy={11} rx={15} ry={12.5} fill="url(#owBelly)" />
          <Path d="M2 7 q3.5 3.5 7 0 M10 7 q3.5 3.5 7 0 M-1 13.5 q3.5 3.5 7 0 M6 13.5 q3.5 3.5 7 0 M13 13.5 q3.5 3.5 7 0 M3 20 q3.5 3 7 0 M10 20 q3.5 3 7 0" stroke="#b98a58" strokeWidth={1.4} strokeLinecap="round" fill="none" opacity={0.75} />
          {/* Yüz diski */}
          <Circle cx={9} cy={-8} r={11.5} fill="url(#owFace)" stroke="#c9a073" strokeWidth={1.5} />
          <Circle cx={26} cy={-8} r={11.5} fill="url(#owFace)" stroke="#c9a073" strokeWidth={1.5} />
          <Circle cx={9} cy={-8} r={11} fill="url(#owFace)" />
          {/* Gözler: sarı iris, büyük gözbebeği */}
          <Circle cx={9} cy={-8} r={7.4} fill="#ffb800" />
          <Circle cx={26} cy={-8} r={7.4} fill="#ffb800" />
          {dead ? (
            <>
              <Cross cx={9} cy={-8} s={4.6} w={2.6} />
              <Cross cx={26} cy={-8} s={4.6} w={2.6} />
            </>
          ) : (
            <>
              <Circle cx={9.6} cy={-8} r={4.4} fill="#111" />
              <Circle cx={26.6} cy={-8} r={4.4} fill="#111" />
              <Circle cx={11.4} cy={-10} r={1.7} fill="#fff" />
              <Circle cx={28.4} cy={-10} r={1.7} fill="#fff" />
              <Circle cx={8} cy={-6} r={0.9} fill="#fff" opacity={0.8} />
              <Circle cx={25} cy={-6} r={0.9} fill="#fff" opacity={0.8} />
            </>
          )}
          {/* Kaşlar: hafif sert bakış */}
          <Path d="M0 -15.5 Q8 -20.5 16 -14" stroke="#4a3220" strokeWidth={2.4} strokeLinecap="round" fill="none" />
          <Path d="M18 -14 Q26 -20.5 34 -15.5" stroke="#4a3220" strokeWidth={2.4} strokeLinecap="round" fill="none" />
          {/* Gaga */}
          <Path d="M13.5 -3 Q17.5 -5.5 21.5 -3 L17.5 8.5 Z" fill="#f5a623" />
          <Path d="M17.5 -4.2 L17.5 8.5 L21.5 -3 Z" fill="#dc8a0c" />
          <Path d="M15.2 -2.8 Q17 -3.8 18.6 -3.4" stroke="#ffe08a" strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.8} />
          {/* Kanat: uzun tüyler + örtü tüyleri + benekler */}
          <G transform={`translate(-2 3) rotate(${wing})`}>
            <Ellipse cx={-25} cy={0} rx={13} ry={3.8} fill="#3d2916" transform="rotate(-15)" />
            <Ellipse cx={-27} cy={0} rx={14} ry={3.9} fill="#4a321f" transform="rotate(-5)" />
            <Ellipse cx={-27} cy={0} rx={14} ry={3.9} fill="#3d2916" transform="rotate(5)" />
            <Ellipse cx={-25} cy={0} rx={13} ry={3.8} fill="#4a321f" transform="rotate(15)" />
            <Ellipse cx={-10} cy={-1} rx={17} ry={9.3} fill="#6e4d33" />
            <Ellipse cx={-9} cy={-3.2} rx={12} ry={4.4} fill="#a98262" opacity={0.75} />
            <Circle cx={-14} cy={0.5} r={1.4} fill="#e8d3ad" />
            <Circle cx={-8} cy={2} r={1.4} fill="#e8d3ad" />
            <Circle cx={-2} cy={0.5} r={1.4} fill="#e8d3ad" />
            <Path d="M-22 1.5 Q-12 6 -1 3" stroke="#e8d3ad" strokeWidth={1.6} strokeLinecap="round" fill="none" opacity={0.75} />
          </G>
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
          {dead ? (
            <Cross cx={21} cy={-9} s={3.6} w={2} />
          ) : (
            <>
              <Circle cx={21.8} cy={-9} r={2.2} fill="#111" />
              <Circle cx={22.6} cy={-10} r={0.9} fill="#fff" />
            </>
          )}
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
          <Defs>
            <LinearGradient id="glBody" gradientUnits="userSpaceOnUse" x1="0" y1="-18" x2="0" y2="20">
              <Stop offset="0" stopColor="#ffffff" />
              <Stop offset="0.6" stopColor="#f1f5f8" />
              <Stop offset="1" stopColor="#cfdae2" />
            </LinearGradient>
            <LinearGradient id="glHead" gradientUnits="userSpaceOnUse" x1="0" y1="-19" x2="0" y2="6">
              <Stop offset="0" stopColor="#ffffff" />
              <Stop offset="1" stopColor="#e9eff3" />
            </LinearGradient>
          </Defs>
          {/* Kuyruk: beyaz tüyler, ucu siyah bantlı */}
          <Path d="M-18 -4 L-44 -11 Q-48 -6 -44 -2 L-18 3 Z" fill="#eef3f6" />
          <Path d="M-18 0 L-46 -1 Q-49 4 -45 7 L-18 6 Z" fill="#ffffff" />
          <Path d="M-18 3 L-44 11 Q-47 15 -42 16 L-17 9 Z" fill="#e1e9ee" />
          {/* Bacaklar ve perdeli ayaklar */}
          <Path d="M-3 15 L-3 24 M-3 24 L-9 27 M-3 24 L-3 28 M-3 24 L3 27 M8 16 L8 25 M8 25 L2 28 M8 25 L8 29 M8 25 L14 28" stroke="#ff8a3d" strokeWidth={2} strokeLinecap="round" fill="none" />
          {/* Gövde ve kafa */}
          <Ellipse cx={0} cy={1} rx={25} ry={17} fill="url(#glBody)" />
          <Path d="M-16 8 q4 3 8 0 M-6 12 q4 3 8 0 M4 8 q4 3 8 0 M-10 15 q4 3 8 0 M8 13 q4 3 8 0" stroke="#c5d2db" strokeWidth={1.4} strokeLinecap="round" fill="none" opacity={0.7} />
          <Ellipse cx={9} cy={-5} rx={14} ry={11} fill="url(#glHead)" />
          <Circle cx={16} cy={-7} r={12} fill="url(#glHead)" />
          {/* Göz: sarı iris, kırmızı göz çevresi */}
          <Circle cx={20} cy={-9} r={4.8} fill="#ffe27a" stroke="#e5533d" strokeWidth={1.2} />
          {dead ? (
            <Cross cx={20} cy={-9} s={3.6} w={2} />
          ) : (
            <>
              <Circle cx={20.6} cy={-9} r={2.6} fill="#111" />
              <Circle cx={21.5} cy={-10} r={0.9} fill="#fff" />
            </>
          )}
          <Path d="M13 -14 Q19 -16.5 25 -13" stroke="#b7c4cd" strokeWidth={1.4} strokeLinecap="round" fill="none" />
          {/* Gaga: hafif kıvrık, alt gagada kırmızı benek */}
          <Path d="M26 -8 Q37 -8 42 -2 Q41 0 38 0 Q33 -1 26 0 Z" fill="#ffd23a" />
          <Path d="M26 0 Q33 1 38 1.5 Q34 5 26 3.6 Z" fill="#f2b705" />
          <Circle cx={36.5} cy={1.4} r={1.8} fill="#e53935" />
          <Ellipse cx={31} cy={-5} rx={1.3} ry={0.8} fill="#a97b00" />
          <Path d="M28 -7 Q34 -7.5 39 -4" stroke="#fff3b5" strokeWidth={1.1} strokeLinecap="round" fill="none" opacity={0.8} />
          {/* Kanat: gri örtü tüyleri, uzun birincil tüyler siyah uçlu */}
          <G transform={`translate(-2 3) rotate(${wing})`}>
            <Ellipse cx={-28} cy={0} rx={16} ry={3.8} fill="#d3dde4" transform="rotate(-16)" />
            <Path d="M-34 -3.4 Q-42 -2.6 -45 0 Q-42 2.6 -34 3.4 Z" fill="#263238" transform="rotate(-16)" />
            <Ellipse cx={-28} cy={0} rx={16} ry={3.9} fill="#c4d0d8" transform="rotate(-6)" />
            <Path d="M-35 -3.5 Q-44 -2.6 -47 0 Q-44 2.6 -35 3.5 Z" fill="#263238" transform="rotate(-6)" />
            <Ellipse cx={-28} cy={0} rx={16} ry={3.9} fill="#d3dde4" transform="rotate(4)" />
            <Path d="M-35 -3.5 Q-44 -2.6 -47 0 Q-44 2.6 -35 3.5 Z" fill="#263238" transform="rotate(4)" />
            <Ellipse cx={-28} cy={0} rx={16} ry={3.8} fill="#c4d0d8" transform="rotate(14)" />
            <Path d="M-34 -3.4 Q-42 -2.6 -45 0 Q-42 2.6 -34 3.4 Z" fill="#263238" transform="rotate(14)" />
            <Ellipse cx={-11} cy={-1} rx={17} ry={9.5} fill="#9db0bb" />
            <Ellipse cx={-9} cy={-3.2} rx={12} ry={4.6} fill="#c9d6de" opacity={0.85} />
            <Path d="M-22 1.5 Q-12 5.5 -1 3" stroke="#ffffff" strokeWidth={1.6} strokeLinecap="round" fill="none" opacity={0.85} />
          </G>
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
          {dead ? (
            <Cross cx={17} cy={-7.6} s={4.2} w={2.4} />
          ) : (
            <>
              <Circle cx={17.6} cy={-7.6} r={3.9} fill="#16213a" />
              <Circle cx={19} cy={-9.2} r={1.5} fill="#ffffff" />
              <Circle cx={16.4} cy={-5.8} r={0.8} fill="#ffffff" opacity={0.8} />
            </>
          )}
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

export function BirdIcon({ type, size = 80, animate = true, dead = false }) {
  const t = useTicker(24, animate);
  const wing = animate ? Math.sin(t * 14) * 35 : 0;
  return (
    <Svg width={size} height={size * 0.75} viewBox="-50 -36 100 75">
      <BirdArt type={type} wing={wing} dead={dead} />
    </Svg>
  );
}
