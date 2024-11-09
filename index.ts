import { Activity } from './lib/types'
import { 
  createPublicActivityEvent, 
  createPrivateActivityEvent, 
  parseActivityEvent 
} from './lib/activity'
import { generateSecretKey } from 'nostr-tools'

// Example 1: Creating and parsing a public running activity
const runningActivity: Activity = {
  title: "Morning Run in Central Park",
  activityType: "run",
  recordedAt: Date.now(),
  metrics: {
    distance: 5200,  // meters
    duration: 1800,  // seconds
    average_speed: 2.93,  // meters/second
    max_speed: 3.5,     // meters/second
    elevation_gain: 100, // meters
    elevation_loss: 50  // meters
  },
  images: [
    {
      url: "https://example.com/run-selfie.jpg",
      width: 1200,
      height: 800,
      imeta: "Running selfie at the park entrance"
    }
  ],
  activityFileUrl: "https://example.com/run-data.gpx"
}

// Create a public event from the activity
const publicEvent = createPublicActivityEvent(runningActivity)
console.log('Public Event:', publicEvent)

// Parse the event back to an activity
const parsedPublicActivity = parseActivityEvent({
  ...publicEvent,
  id: 'dummy-id',
  pubkey: 'dummy-pubkey',
  sig: 'dummy-sig'
} as Event)
console.log('Parsed Public Activity:', parsedPublicActivity)

// Example 2: Creating and parsing a private cycling activity
const cyclingActivity: Activity = {
  title: "Evening Bike Ride",
  activityType: "ride",
  recordedAt: Date.now(),
  metrics: {
    distance: 15000,    // meters
    duration: 2700,     // seconds
    average_speed: 20.0,     // meters/second
    max_speed: 35.2,     // meters/second
    elevation_gain: 245, // meters
    elevation_loss: 245  // meters
  },
  images: [
    {
      url: "https://example.com/bike-sunset.jpg",
      width: 1920,
      height: 1080
    }
  ]
}

// Create a private event from the activity
const privateKey = generateSecretKey()
const privateEvent = createPrivateActivityEvent(cyclingActivity, privateKey)
console.log('Private Event:', privateEvent)

// Parse the private event back to an activity
const parsedPrivateActivity = parseActivityEvent({
  ...privateEvent,
  id: 'dummy-id',
  pubkey: 'dummy-pubkey',
  sig: 'dummy-sig'
}, privateKey)
console.log('Parsed Private Activity:', parsedPrivateActivity)
