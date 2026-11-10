export const CHARACTERS = [
  { id: 'owl', name: 'Baykuş' },
  { id: 'bird', name: 'Kuş' },
  { id: 'eagle', name: 'Kartal' },
  { id: 'gull', name: 'Martı' },
  { id: 'canary', name: 'Kanarya' },
  { id: 'vulture', name: 'Akbaba' },
];
export const getCharacter = (id) => CHARACTERS.find((c) => c.id === id) || CHARACTERS[1];
