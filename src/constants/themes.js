export const THEMES = [
  {
    id: 'kapadokya', name: 'Kapadokya',
    sky: ['#ff8a5b', '#ffb877', '#ffe2a8', '#fff3d6'],
    sun: { x: 0.78, y: 0.22, r: 40, color: '#fff6c8' },
    branch: { bark: '#8a5a3b', dark: '#5e3a22', thorn: '#4a2c1a', leaf: '#d9a441' },
  },
  {
    id: 'pamukkale', name: 'Pamukkale',
    sky: ['#3fb6f5', '#8fd8ff', '#d8f3ff', '#f4fcff'],
    sun: { x: 0.2, y: 0.14, r: 36, color: '#fffbe0' },
    branch: { bark: '#a07a5a', dark: '#6e4f37', thorn: '#58402e', leaf: '#2fc4c4' },
  },
  {
    id: 'sumela', name: 'Sümela Manastırı',
    sky: ['#9fb4ad', '#c3d3cc', '#dfe8e3', '#f1f5f1'],
    sun: { x: 0.75, y: 0.12, r: 34, color: '#ffffff', opacity: 0.6 },
    branch: { bark: '#5a4632', dark: '#3a2c1e', thorn: '#2a1f15', leaf: '#3f7d3a' },
  },
  {
    id: 'istanbul', name: 'İstanbul Boğazı',
    sky: ['#3d6fb6', '#7aa6d8', '#f3b184', '#ffd9a6'],
    sun: { x: 0.7, y: 0.42, r: 44, color: '#fff0b5' },
    branch: { bark: '#7b5a47', dark: '#503728', thorn: '#3b2a1f', leaf: '#c0392b' },
  },
];
export const getTheme = (id) => THEMES.find((t) => t.id === id) || THEMES[0];
