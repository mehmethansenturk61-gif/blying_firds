export const THEMES = [
  {
    id: 'kapadokya', name: 'Kapadokya',
    sky: ['#ff8a5b', '#ffb877', '#ffe2a8', '#fff3d6'],
    sun: { x: 0.78, y: 0.22, r: 40, color: '#fff6c8' },
    branch: { bark: '#8a5a3b', dark: '#5e3a22', thorn: '#4a2c1a', leaf: '#d9a441' },
    dust: ['#e2b48a', '#a8643c'], // toprak: açık + koyu parçacık
  },
  {
    id: 'ege', name: 'Ege Sahili',
    sky: ['#2f9fe0', '#6cc6ee', '#b5e6f5', '#fff0cc'],
    sun: { x: 0.2, y: 0.16, r: 36, color: '#fffbe0' },
    branch: { bark: '#a8825a', dark: '#7a5a3a', thorn: '#5a4129', leaf: '#2f9e6a' },
    dust: ['#f6e5b2', '#d8b36c'], // kum
  },
  {
    id: 'sumela', name: 'Sümela Manastırı',
    sky: ['#9fb4ad', '#c3d3cc', '#dfe8e3', '#f1f5f1'],
    sun: { x: 0.75, y: 0.12, r: 34, color: '#ffffff', opacity: 0.6 },
    branch: { bark: '#5a4632', dark: '#3a2c1e', thorn: '#2a1f15', leaf: '#3f7d3a' },
    dust: ['#9c7a52', '#4f7a3a'], // toprak + yaprak parçaları
  },
  {
    id: 'istanbul', name: 'İstanbul Boğazı',
    sky: ['#3d6fb6', '#7aa6d8', '#f3b184', '#ffd9a6'],
    sun: { x: 0.7, y: 0.42, r: 44, color: '#fff0b5' },
    branch: { bark: '#7b5a47', dark: '#503728', thorn: '#3b2a1f', leaf: '#c0392b' },
  },
];
export const getTheme = (id) => THEMES.find((t) => t.id === id) || THEMES[0];
