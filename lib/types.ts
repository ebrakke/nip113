export type ActivityType = 'run' | 'ride' | 'hike' | 'swim' | 'walk' | 'ski' | 'workout'

export interface ActivityMetrics {
  distance: number // meters
  duration: number // seconds
  elevation_gain: number // meters
  elevation_loss: number // meters
  average_speed: number // meters/second
  max_speed: number // meters/second
}

export interface Image {
  url: string
  width?: number
  height?: number
}

export interface ActivityData {
  type: ActivityType
  title: string
  description?: string
  recordedAt: number // unix timestamp
  metrics: ActivityMetrics
  activityFileUrl?: string
  images?: Image[]
}

export interface ActivityEvent {
  kind: 30100 | 30102
  content: string
  tags: string[][]
  created_at: number
  pubkey: string
  id: string
  sig: string
} 