import { Activity } from './lib/types'
import { 
  createPublicActivityEvent, 
  createPrivateActivityEvent, 
  parseActivityEvent 
} from './lib/activity'
import { finalizeEvent, generateSecretKey } from 'nostr-tools'
import cuid from 'cuid'

const sk = generateSecretKey()

// Example 1: Creating and parsing a public running activity
const runningActivity: Activity = {
  id: cuid(),
  title: "Morning Run in Central Park",
  type: "run",
  recordedAt: Date.now(),
  metrics: {
    distance: 5200,  // meters
    duration: 1800,  // seconds
    average_speed: 2.93,  // meters/second
    max_speed: 3.5,     // meters/second
    elevation_gain: 100, // meters
    elevation_loss: 50  // meters
  },
  activityFileUrl: "https://example.com/run-data.gpx",
  images: [
    "https://example.com/run-selfie.jpg",
  ]
}

// Create a public event from the activity
const publicEvent = createPublicActivityEvent(runningActivity)
const signedPublicEvent = finalizeEvent(publicEvent, sk)
console.log('Public Event:', publicEvent)
// Parse the event back to an activity
const parsedPublicActivity = parseActivityEvent(signedPublicEvent)
console.log('Parsed Public Activity:', parsedPublicActivity)

// Example 2: Creating and parsing a private cycling activity
const cyclingActivity: Activity = {
  id: cuid(),
  title: "Evening Bike Ride",
  type: "ride",
  recordedAt: Date.now(),
  metrics: {
    distance: 15000,    // meters
    duration: 2700,     // seconds
    average_speed: 20.0,     // meters/second
    max_speed: 35.2,     // meters/second
    elevation_gain: 245, // meters
    elevation_loss: 245  // meters
  },
  activityFileUrl: "https://example.com/bike-data.gpx",
  images: [
    "https://example.com/bike-sunset.jpg"
  ]
}

// Create a private event from the activity
const privateEvent = createPrivateActivityEvent(cyclingActivity, sk)
const signedPrivateEvent = finalizeEvent(privateEvent, sk)
console.log('Private Event:', signedPrivateEvent)

// Parse the private event back to an activity
const parsedPrivateActivity = parseActivityEvent(signedPrivateEvent, sk)
console.log('Parsed Private Activity:', parsedPrivateActivity)
