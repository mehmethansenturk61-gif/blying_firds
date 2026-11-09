import React, { memo } from 'react';
import { G, Rect, Polygon, Circle, Ellipse } from 'react-native-svg';

// OPTİMİZASYON: Dal, sabit uzunlukta (LEN) ve ucu y=0'da olacak şekilde BİR KEZ çizilir.
// Hareketli engellerde dalın şekli/uzunluğu değişmez; sadece konumu (transform) değişir.
// Böylece her karede yüzlerce SVG parçası yeniden üretilmez, dikenler dalla birlikte sabit kalır.
const LEN = 560;

const BranchArt = memo(({ colors }) => {
  const parts = [];
  let i = 0;
  for (let y = -38; y > -(LEN - 30); y -= 44, i++) {
    const left = i % 2 === 0;
    parts.push(
      <Polygon key={`t${i}`} points={left ? `20,${y + 9} 3,${y - 4} 20,${y - 9}` : `50,${y + 9} 67,${y - 4} 50,${y - 9}`} fill={colors.thorn} />,
      <Circle key={`l${i}`} cx={left ? 12 : 58} cy={y + 12} r={5} fill={colors.leaf} />,
      <Ellipse key={`k${i}`} cx={35} cy={y - 20} rx={3} ry={5} fill={colors.dark} />
    );
  }
  return (
    <G>
      <Rect x={20} y={-LEN} width={30} height={LEN - 6} rx={6} fill={colors.bark} />
      <Rect x={20} y={-LEN} width={9} height={LEN - 6} rx={4} fill={colors.dark} />
      {parts}
      <Polygon points="18,-22 52,-22 35,0" fill={colors.thorn} />
    </G>
  );
});

// y = dalın boşluğa bakan ucunun konumu. flip=true: alttaki dal (aşağı doğru uzanır).
export default function Branch({ x, y, flip, colors }) {
  return (
    <G transform={flip ? `translate(${x} ${y}) scale(1 -1)` : `translate(${x} ${y})`}>
      <BranchArt colors={colors} />
    </G>
  );
}
