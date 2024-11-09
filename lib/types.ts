import { Event } from 'nostr-tools'

export type ActivityMetrics = {
  distance: number        // meters
  duration: number       // seconds
  elevation_gain: number // meters
  elevation_loss: number // meters
  average_speed: number  // meters/second
  max_speed: number     // meters/second
}

export type ActivityType = 'run' | 'ride' | 'hike' | 'swim' | 'walk' | 'ski' | 'workout'

export type ActivityOptions = {
  id: string
  title: string
  type: ActivityType
  recordedAt: number
  activityFileUrl?: string
  images?: string[]
}

// New type to represent a complete activity
export type Activity = ActivityOptions & {
  metrics: ActivityMetrics
}

export type PrivateActivityContent = {
  metrics: ActivityMetrics
  sensitive_tags: {
    title: string
    r?: string
    images?: string[]
  }
}

export type ActivityEvent = Event & {
  kind: 30100 | 30102
}

export { EventTemplate } from 'nostr-tools'