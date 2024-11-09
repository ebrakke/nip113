# nostr-physical-activity

A TypeScript library for creating and parsing physical activity events on Nostr (NIP-113).

## Overview

This library provides a minimal implementation for creating and parsing activity events on Nostr, following the NIP-113 specification. It supports both public (kind:30100) and private (kind:30102) activity events.

## Usage

### Creating Activities

```typescript
import { createPublicActivityEvent, createPrivateActivityEvent } from 'nostr-activity'

// Create a public activity
const activity = {
  id: '2024-01-15-morning-run',
  title: 'Morning Park Run',
  type: 'run',
  recordedAt: 1705312800,
  activityFileUrl: 'https://example.com/activities/run1234.gpx',
  images: [
    'https://storage.example.com/activity1234/photo1.jpg',
    'https://storage.example.com/activity1234/photo2.jpg'
  ],
  metrics: {
    distance: 5280,        // meters
    duration: 1800,        // seconds
    elevation_gain: 42,    // meters
    elevation_loss: 42,    // meters
    average_speed: 2.93,   // meters/second
    max_speed: 3.5        // meters/second
  }
}

// Create public event
const publicEvent = createPublicActivityEvent(activity)

// Create private event (requires NIP-44 private key)
const privateEvent = createPrivateActivityEvent(activity, privateKey)
```

### Parsing Activities

```typescript
import { parseActivityEvent } from 'nostr-activity'

// Parse public event
const activity = parseActivityEvent(event)

// Parse private event (requires NIP-44 private key)
const privateActivity = parseActivityEvent(event, privateKey)
```

## Features

- Create and parse both public (kind:30100) and private (kind:30102) activity events
- NIP-44 encryption for private activities
- Support for activity files and images
- TypeScript types for all activity data
- Follows NIP-113 specification

## License

MIT