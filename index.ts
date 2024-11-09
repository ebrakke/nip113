import { ActivityBuilder } from './lib/activity'
import { ActivityData } from './lib/types'
import { generateSecretKey } from 'nostr-tools/pure'

// Generate a secret key for signing the event
const secretKey = generateSecretKey()

// Create sample activity data
const activityData: ActivityData = {
  type: 'run',
  title: 'Morning Run',
  recordedAt: new Date().getTime(),
  description: 'Nice morning run around the park',
  activityFileUrl: 'https://example.com/run-file.gpx',
  metrics: {
    distance: 5200, // meters
    duration: 1800, // seconds (30 minutes)
    average_speed: 10.4, // meters/second
    max_speed: 12.5, // meters/second
    elevation_gain: 100, // meters
    elevation_loss: 50 // meters
  },
  images: [
    {
      url: 'https://example.com/run-photo.jpg',
      width: 1200,
      height: 800,
    }
  ]
}

// Create a public activity event
const publicEvent = ActivityBuilder.createPublicEvent(activityData, secretKey)
console.log('Public Activity Event:', publicEvent)

// Create a private activity event (encrypted)
const privateEvent = ActivityBuilder.createPrivateEvent(activityData, secretKey)
console.log('Private Activity Event:', privateEvent)
