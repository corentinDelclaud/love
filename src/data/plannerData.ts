export const ACTIVITY_OPTIONS = {
  restaurant: ['Sushi', 'Pizza', 'Burgers', 'Ramen', 'Tacos'],
  cinema: ['Romance', 'Comedy', 'Action', 'Animation', 'Thriller'],
  walk: ['Park', 'Beach', 'City lights', 'Garden', 'Lookout point'],
  arcade: ['Racing', 'Dance', 'Air hockey', 'Claw machine', 'Pinball'],
} as const

export type Activity = keyof typeof ACTIVITY_OPTIONS
