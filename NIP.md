# NIP-113
## Physical Activity Events
`draft` `optional`

This NIP defines two event kinds for sharing physical activity data (like runs, bike rides, hikes etc.) on Nostr.

### Events

#### Activity Event (`kind:30100`)
A parameterized replaceable event for public activities. The activity may include associated data files and photos.

The `content` field MUST contain a stringified JSON object with basic metrics:
```json
{
  "distance": "<meters>",
  "duration": "<seconds>", 
  "elevation_gain": "<meters>",
  "elevation_loss": "<meters>",
  "average_speed": "<meters/second>",
  "max_speed": "<meters/second>"
}
```

```json
{
  "kind": 30100,
  "created_at": "<unix timestamp when the event was posted>",
  "content": "<stringified metrics object>",
  "tags": [
    ["d", "<identifier>"],
    ["t", "<activity-type>"],
    ["title", "<activity title>"],
    ["recorded_at", "<unix timestamp when activity occurred>"],
    ["r", "<URL to activity file>"], // Optional
    ["image", "<URL>"], // Optional, image URL
    ["image", "<URL>"], // Optional, image URL
  ]
}
```

#### Private Activity Event (`kind:30102`) 
An encrypted version of the activity event, using NIP-44 encryption. The `content` field should contain the encrypted JSON of both the metrics and any sensitive tags:

```json
{
  "metrics": {
    "distance": "<meters>",
    "duration": "<seconds>",
    "elevation_gain": "<meters>",
    "elevation_loss": "<meters>",
    "average_speed": "<meters/second>",
    "max_speed": "<meters/second>"
  },
  "sensitive_tags": {
    "title": "<activity title>",
    "r": "<URL to activity file>",
    "images": ["<URL>", "<URL>"]
  }
}
```

Only minimal unencrypted tags should be included:
```json
{
  "kind": 30102,
  "created_at": "<unix timestamp when the event was posted>",
  "content": "<NIP-44 encrypted content>",
  "tags": [
    ["d", "<identifier>"],
    ["t", "<activity-type>"],
    ["recorded_at", "<unix timestamp when activity occurred>"]
  ]
}
```

For both event kinds, the `recorded_at` tag specifies when the activity actually occurred, which may be different from the event's `created_at` timestamp (when the activity was posted to Nostr). For example, a user might record a morning run at 7am (`recorded_at`) but not post it until noon (`created_at`).

All measurements MUST use metric units. Clients can convert to imperial units for display if desired.

### Activity Types
Activities MUST include a `t` tag with one of these types:
- run
- ride 
- hike
- swim
- walk
- ski
- workout

Additional activity types may be added to this NIP in the future.

### Photos
Activity events can include photos using the `image`. Multiple photos can be attached to a single activity by using multiple `image` tags.

For private activities (`kind:30102`), photos should be included in the encrypted content field instead of as tags.

### Privacy Considerations
Activity data often contains sensitive location information. Clients SHOULD:
- Allow users to trim/blur start/end points of routes
- Provide clear choice between public (`kind:30100`) and private (`kind:30102`) activities
- Clearly communicate what data will be public vs private
- Strip EXIF data from photos before uploading unless explicitly preserved by user choice
- Warn users if photos contain location metadata

### Extension Points
Rather than trying to standardize every possible activity metric or analysis, this NIP focuses on the core event structure. More specialized analysis and visualization can be built through:

1. Data Vending Machines (NIPs 90+) that analyze activity files and produce specialized metrics
2. Client-specific tags for additional metadata
3. Future NIPs for standardizing advanced features like segments, routes, and challenges

### Example - Public Activity
```json
{
  "kind": 30100,
  "created_at": 1705324800,
  "content": "{\"distance\":5280,\"duration\":1800,\"elevation_gain\":42,\"elevation_loss\":42,\"average_speed\":2.93,\"max_speed\":3.5}",
  "tags": [
    ["d", "2024-01-15-morning-run"],
    ["t", "run"], 
    ["title", "Morning Park Run"],
    ["recorded_at", "1705312800"],
    ["r", "https://example.com/activities/run1234.gpx"],
    ["image", "https://storage.example.com/activity1234/photo1.jpg"],
    ["image", "https://storage.example.com/activity1234/photo2.jpg"]
  ]
}
```

### Example - Private Activity
```json
{
  "kind": 30102,
  "created_at": 1705324800,
  "content": "<NIP-44 encrypted JSON containing metrics and sensitive tags>",
  "tags": [
    ["d", "2024-01-15-morning-run"],
    ["t", "run"],
    ["recorded_at", "1705312800"]
  ]
}
```