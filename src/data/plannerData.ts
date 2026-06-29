export const ACTIVITY_OPTIONS = {
  '🍽️ Restaurant': ['🍣 Sushi', '🍕 Pizza', '🍔 Hamburgers', '🍜 Ramen', '🌮 Tacos', '🍽️ Chic', '🍗 Poulet'],
  '🎬 Cinéma': ['💘 Romance', '😂 Comédie', '💥 Action', '🔪 Thriller'],
  '🌳 Balade': ['🌊 Océan', '🌳 Parc', '🏙️ en ville', '🐟 Aquarium', '🦁 Zoo'],
  '🏋️ Sportif': ['🏀 Basketball', '⚽ Football', '🏊 Natation', '🧗 Escalade', '🚴 Vélo', '🌲 Accrobranche', '🪓 Lancer de haches', '⛸️ Patinoire', '💪 Salle de Sport'],
  '🎯 Activités': ['🔐 Escape Game', '🕶️ VR', '🎳 Bowling', '🎯 Laser Game', '⛳ Mini Golf', '🛍️ Shopping'],
} as const

export type Activity = keyof typeof ACTIVITY_OPTIONS
