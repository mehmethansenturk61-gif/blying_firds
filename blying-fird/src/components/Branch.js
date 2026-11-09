import React, { memo } from 'react';
import { G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

// OPTİMİZASYON: Dal, sabit uzunlukta (LEN) ve ucu y=0'da olacak şekilde BİR KEZ çizilir.
// Hareketli engellerde dalın şekli/uzunluğu değişmez; sadece konumu (transform) değişir.
// Ayrıca aynı renkteki parçalar (dikenler, yapraklar, doku çizgileri...) TEK bir Path'te
// birleştirilir; böylece dal başına yalnızca ~10 SVG öğesi çizilir (eskiden ~40'tı).
const LEN = 560;

// "#rrggbb" renkleri karıştırır (t=0 → a, t=1 → b)
const toRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => {
  const A = toRgb(a), B = toRgb(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

// Gövdenin sol/sağ kenarı hafif dalgalıdır (düz bir kutu gibi durmasın)
const edgeL = (y) => 20 + Math.sin(y * 0.047) * 1.8 + Math.sin(y * 0.13) * 0.6;
const edgeR = (y) => 50 + Math.sin(y * 0.052 + 1.3) * 1.8 + Math.sin(y * 0.11 + 2) * 0.6;
const f = (n) => Math.round(n * 10) / 10;

// Dalın tüm geometrisi renkten bağımsızdır; bir kez hesaplanır.
function buildGeometry() {
  // Gövde: yukarıdan aşağı sol kenar, sivri uç, yukarı sağ kenar
  let trunk = `M${f(edgeL(-LEN))} ${-LEN}`;
  for (let y = -LEN + 14; y <= -22; y += 14) trunk += ` L${f(edgeL(y))} ${y}`;
  trunk += ` Q${f(edgeL(-22) + 11)} -9 35 0 Q${f(edgeR(-22) - 11)} -9 ${f(edgeR(-22))} -22`;
  for (let y = -36; y >= -LEN; y -= 14) trunk += ` L${f(edgeR(y))} ${y}`;
  trunk += ' Z';

  // Kırık ucun açık renk yüzü (sol yarı)
  const tipLight = `M${f(edgeL(-22) + 1)} -22 Q${f(edgeL(-22) + 11)} -9 35 0 Q34 -10 ${f(edgeL(-22) + 8)} -24 Z`;

  let bark = '', knots = '', rings = '', thorns = '', thornHi = '', leafA = '', leafB = '', veins = '';
  // Kabuk çizgileri (dikey, kısa, düzensiz)
  for (let i = 0, y = -34; y > -LEN + 10; y -= 23, i++) {
    const x1 = 25 + ((i * 53) % 17);
    const x2 = 33 + ((i * 37) % 13);
    bark += `M${x1} ${y} q${i % 2 ? 2 : -2} 7 0 15 `;
    bark += `M${x2} ${y - 10} q${i % 2 ? -2 : 2} 6 0 12 `;
  }
  // Boğumlar (budak) ve yosun lekeleri
  for (let i = 0, y = -92; y > -LEN + 30; y -= 150, i++) {
    const cx = i % 2 ? 41 : 29;
    knots += `M${cx - 4} ${y} a4 6.5 0 1 0 8 0 a4 6.5 0 1 0 -8 0 `;
    rings += `M${cx - 6.5} ${y} a6.5 9 0 1 0 13 0 a6.5 9 0 1 0 -13 0 `;
  }
  // Dikenler (kıvrık, ucu yukarı-dışa) ve karşı yüzde yapraklar
  for (let i = 0, y = -38; y > -(LEN - 30); y -= 44, i++) {
    const left = i % 2 === 0;
    const xl = edgeL(y) + 1, xr = edgeR(y) - 1;
    if (left) {
      thorns += `M${f(xl)} ${y + 11} Q${f(xl - 10)} ${y + 9} ${f(xl - 18)} ${y - 11} Q${f(xl - 8)} ${y - 7} ${f(xl)} ${y - 11} Z `;
      thornHi += `M${f(xl - 2)} ${y - 8} Q${f(xl - 9)} ${y - 5} ${f(xl - 15)} ${y - 10} `;
    } else {
      thorns += `M${f(xr)} ${y + 11} Q${f(xr + 10)} ${y + 9} ${f(xr + 18)} ${y - 11} Q${f(xr + 8)} ${y - 7} ${f(xr)} ${y - 11} Z `;
      thornHi += `M${f(xr + 2)} ${y - 8} Q${f(xr + 9)} ${y - 5} ${f(xr + 15)} ${y - 10} `;
    }
    // yaprak: dikenin karşı tarafında, biraz yukarıda
    const ly = y - 22;
    const leaf = left
      ? `M${f(edgeR(ly) - 1)} ${ly} Q${f(edgeR(ly) + 5)} ${ly - 11} ${f(edgeR(ly) + 16)} ${ly - 8} Q${f(edgeR(ly) + 9)} ${ly + 3} ${f(edgeR(ly) - 1)} ${ly} Z `
      : `M${f(edgeL(ly) + 1)} ${ly} Q${f(edgeL(ly) - 5)} ${ly - 11} ${f(edgeL(ly) - 16)} ${ly - 8} Q${f(edgeL(ly) - 9)} ${ly + 3} ${f(edgeL(ly) + 1)} ${ly} Z `;
    if (i % 2) leafB += leaf; else leafA += leaf;
    veins += left
      ? `M${f(edgeR(ly))} ${ly - 1} L${f(edgeR(ly) + 12)} ${ly - 6} `
      : `M${f(edgeL(ly))} ${ly - 1} L${f(edgeL(ly) - 12)} ${ly - 6} `;
  }
  return { trunk, tipLight, bark, knots, rings, thorns, thornHi, leafA, leafB, veins };
}
const GEO = buildGeometry();

const BranchArt = memo(({ colors }) => {
  const { bark, dark, thorn, leaf } = colors;
  const lit = mix(bark, '#ffffff', 0.22);
  const gid = `tg${bark.slice(1)}`;
  const leafDark = mix(leaf, '#000000', 0.22);
  return (
    <G>
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={dark} />
          <Stop offset="0.3" stopColor={lit} />
          <Stop offset="0.65" stopColor={bark} />
          <Stop offset="1" stopColor={dark} />
        </LinearGradient>
      </Defs>
      <Path d={GEO.trunk} fill={`url(#${gid})`} />
      <Path d={GEO.rings} fill="none" stroke={dark} strokeWidth={1.6} opacity={0.5} />
      <Path d={GEO.knots} fill={dark} opacity={0.85} />
      <Path d={GEO.bark} fill="none" stroke={mix(dark, bark, 0.25)} strokeWidth={1.7} strokeLinecap="round" opacity={0.55} />
      <Path d={GEO.thorns} fill={thorn} />
      <Path d={GEO.thornHi} fill="none" stroke={mix(thorn, bark, 0.55)} strokeWidth={1.6} strokeLinecap="round" />
      <Path d={GEO.leafA} fill={leaf} />
      <Path d={GEO.leafB} fill={leafDark} />
      <Path d={GEO.veins} fill="none" stroke={mix(leaf, '#000000', 0.38)} strokeWidth={1.1} strokeLinecap="round" />
      <Path d={GEO.tipLight} fill={mix(thorn, bark, 0.4)} />
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
