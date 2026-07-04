export const ACTIVITY_OPTIONS = {
  '🍽️ Restaurant': [
    { name: '🍣 Sushi', defaultPlace: 'King Long' },
    { name: '🍕 Pizza' },
    { name: '🍔 Hamburgers' },
    { name: '🍜 Ramen' },
    { name: '🥙 Kebab', defaultPlace: 'Les Délices du Bosphore' },
    { name: '😋 Chic', defaultPlace: '' },
    { name: '🍗 Poulet', defaultPlace: 'KFC' },
  ],
  '🎬 Cinéma': [
    { name: '💘 Romance' },
    { name: '😂 Comédie' },
    { name: '💥 Action' },
    { name: '🔪 Thriller' },
  ],
  '🌳 Balade': [
    { name: '🌊 Océan', defaultPlace: 'île d\'Oléron' },
    { name: '🏞️ Forêt' },
    { name: '🏙️ en ville' },
    { name: '🐟 Aquarium', defaultPlace: 'Aquarium de Limoges' },
    { name: '🦁 Zoo' },
    { name: '🌳 Parc' },
  ],
  '🏋️ Sportif': [
    { name: '🏀 Basketball', defaultPlace: 'BeauBlanc' },
    { name: '⚽ Football' },
    { name: '🏊 Natation' },
    { name: '🧗 Escalade', defaultPlace: 'Climb Up Limoges'},
    { name: '🚴 Vélo' },
    { name: '🌲 Accrobranche' },
    { name: '🪓 Lancer de haches', defaultPlace: 'Target Experience' },
    { name: '⛸️ Patinoire', defaultPlace: 'Patinoire de Limoges' },
    { name: '💪 Salle de Sport', defaultPlace: 'Basic-fit Limoges Nord' },
  ],
  '🎯 Activités': [
    { name: '🔐 Escape Game', defaultPlace: 'KURIOSCAPE' },
    { name: '🕶️ VR' },
    { name: '🎳 Bowling' },
    { name: '🎯 Laser Game', defaultPlace: 'Target Experience' },
    { name: '🛍️ Shopping', defaultPlace: 'Alors là je sais pas mais je te suit (bientôt le relooking hihi)' },
  ],
} as const

export type Activity = keyof typeof ACTIVITY_OPTIONS
export type ActivityOption = {
  name: string
  defaultPlace?: string
}
