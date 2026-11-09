export const CHARACTERS = [
  { id: 'owl', name: 'Baykuş' },
  { id: 'bird', name: 'Kuş' },
  { id: 'eagle', name: 'Kartal' },
  { id: 'gull', name: 'Martı' },
];
export const getCharacter = (id) => CHARACTERS.find((c) => c.id === id) || CHARACTERS[1];
