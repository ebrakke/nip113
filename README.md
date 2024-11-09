# nostr-activity

A simple SDK for creating and managing physical activity events on Nostr (NIP-113).

## Usage

```typescript
import { ActivityManager } from 'nostr-activity'

// Initialize
const pool = new SimplePool()
const activityManager = new ActivityManager(pool, privateKey)

// Create a public activity
const publicActivity = await activityManager.createPublicActivity(
  '2024-01-15-morning-run',
  {
    distance: 5280,
    duration: 1800,
    elevation_gain: 42,
    elevation_loss: 42,
    average_speed: 2.93,
    max_speed: 3.5
  },
  {
    title: 'Morning Park Run',
    activityType: 'run',
    recordedAt: 1705312800,
    activityFileUrl: 'https://example.com/activities/run1234.gpx',
    images: [
      {
        url: 'https://storage.example.com/activity1234/photo1.jpg',
        width: 1200,
        height: 800
      }
    ]
  }
)

// Publish the activity
await activityManager.publishActivity(publicActivity)

// Create a private activity
const privateActivity = await activityManager.createPrivateActivity(
  '2024-01-15-morning-run',
  metrics,
  options
)

// Publish private activity
await activityManager.publishActivity(privateActivity)

// Decrypt a private activity
const decryptedActivity = await activityManager.decryptPrivateActivity(privateActivity)
```

## License

MIT
