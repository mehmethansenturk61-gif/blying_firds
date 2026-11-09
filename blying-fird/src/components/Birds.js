import React from 'react';
import Svg, { G, Ellipse, Circle, Polygon, Path } from 'react-native-svg';
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
          <Polygon points="-20,-3 -42,-8 -42,10 -20,7" fill="#f3efe4" />
          <Ellipse cx={0} cy={2} rx={26} ry={19} fill="#6b4423" />
          <Ellipse cx={-2} cy={9} rx={14} ry={8} fill="#8a5a30" />
          <Circle cx={16} cy={-8} r={12} fill="#f7f3ea" />
          <Path d="M24 -10 L41 -5 Q38 6 28 1 Z" fill="#f4c20d" />
          <Circle cx={19} cy={-10} r={3} fill="#222" />
          <Path d="M11 -18 L24 -12" stroke="#3b2410" strokeWidth={2.5} strokeLinecap="round" />
          {wingG('#3f2710', '#f7f3ea')}
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
          <Polygon points="-18,0 -38,-9 -38,10 -18,7" fill="#1e6fd1" />
          <Polygon points="2,-16 8,-30 14,-16" fill="#1e6fd1" />
          <Ellipse cx={0} cy={0} rx={24} ry={19} fill="#3aa0ff" />
          <Ellipse cx={4} cy={8} rx={15} ry={9} fill="#cfe9ff" />
          <Polygon points="20,-6 37,0 20,6" fill="#ffb020" />
          <Circle cx={12} cy={-7} r={6.5} fill="#fff" />
          <Circle cx={14} cy={-7} r={3} fill="#111" />
          {wingG('#1e6fd1')}
        </G>
      );
  }
}

export function BirdIcon({ type, size = 80, animate = true }) {
  const t = useTicker(24, animate);
  const wing = animate ? Math.sin(t * 14) * 35 : 0;
  return (
    <Svg width={size} height={size * 0.8} viewBox="-44 -34 88 68">
      <BirdArt type={type} wing={wing} />
    </Svg>
  );
}
