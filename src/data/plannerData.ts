export const ACTIVITY_OPTIONS = {
  '🍽️ Restaurant': ['🍣 Sushi', '🍕 Pizza', '🍔 Hamburgers', '🍜 Ramen', '🌮 Tacos', '🍽️ Chic', '🍗 Poulet'],
  '🎬 Cinéma': ['💘 Romance', '😂 Comédie', '💥 Action', '🔪 Thriller'],
  '🌳 Balade': ['🌊 Océan', '🏞️ Forêt', '🏙️ en ville', '🐟 Aquarium', '🦁 Zoo', '🌳 Parc'],
  '🏋️ Sportif': ['🏀 Basketball', '⚽ Football', '🏊 Natation', '🧗 Escalade', '🚴 Vélo', '🌲 Accrobranche', '🪓 Lancer de haches', '⛸️ Patinoire', '💪 Salle de Sport'],
  '🎯 Activités': ['🔐 Escape Game', '🕶️ VR', '🎳 Bowling', '🎯 Laser Game', '⛳ Mini Golf', '🛍️ Shopping'],
} as const

export type Activity = keyof typeof ACTIVITY_OPTIONS
