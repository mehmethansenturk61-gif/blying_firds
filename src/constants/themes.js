export const THEMES = [
  {
    id: 'kapadokya', name: 'Kapadokya',
    sky: ['#ff8a5b', '#ffb877', '#ffe2a8', '#fff3d6'],
    sun: { x: 0.78, y: 0.22, r: 40, color: '#fff6c8' },
    branch: { bark: '#8a5a3b', dark: '#5e3a22', thorn: '#4a2c1a', leaf: '#d9a441' },
    dust: ['#e2b48a', '#a8643c'], // toprak: açık + koyu parçacık
  },
  {
    id: 'nemrut', name: 'Nemrut Dağı',
    sky: ['#2b2a63', '#7f4b95', '#ef8a63', '#ffd28d'],
    sun: { x: 0.5, y: 0.5, r: 42, color: '#ffe8b0', opacity: 0.95 },
    branch: { bark: '#7a6650', dark: '#54463a', thorn: '#3d322a', leaf: '#a8a050' },
    dust: ['#c9b79a', '#8a7660'], // taş tozu
  },
  {
    id: 'ege', name: 'Ege Sahili',
    sky: ['#2f9fe0', '#6cc6ee', '#b5e6f5', '#fff0cc'],
    sun: { x: 0.2, y: 0.16, r: 36, color: '#fffbe0' },
    branch: { bark: '#a8825a', dark: '#7a5a3a', thorn: '#5a4129', leaf: '#2f9e6a' },
    dust: ['#f6e5b2', '#d8b36c'], // kum
  },
  {
    id: 'istanbul', name: 'İstanbul Boğazı',
    sky: ['#3d6fb6', '#7aa6d8', '#f3b184', '#ffd9a6'],
    sun: { x: 0.7, y: 0.42, r: 44, color: '#fff0b5' },
    branch: { bark: '#7b5a47', dark: '#503728', thorn: '#3b2a1f', leaf: '#c0392b' },
  },
];
export const getTheme = (id) => THEMES.find((t) => t.id === id) || THEMES[0];
