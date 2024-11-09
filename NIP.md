# NIP-113
## Physical Activity Events
`draft` `optional`

This NIP defines two new event kinds for sharing physical activity data (like runs, bike rides, hikes etc.) on Nostr.

### Events

#### Activity Event (`kind:30100`)
A parameterized replaceable event representing a physical activity like a run, bike ride, or hike. The activity may include an associated data file (GPX, TCX, FIT etc.) and photos.

The event can have an optional content field for user notes/description about the activity.

```json
{
  "kind": 30100,
  "created_at": "<unix timestamp when the event was posted>",
  "content": "<optional user notes about the activity>",
  "tags": [
    ["d", "<identifier>"],
    ["t", "<activity-type>"],
    ["title", "<activity title>"],
    ["recorded_at", "<unix timestamp when activity occurred>"],
    ["distance", "<meters>"],
    ["duration", "<seconds>"],
    ["elevation_gain", "<meters>"],
    ["elevation_loss", "<meters>"],
    ["avg_speed", "<meters/second>"],
    ["max_speed", "<meters/second>"],
    ["r", "<URL to activity file>"], // Optional
    ["image", "<URL>", "<optional width>", "<optional height>"], // Can have multiple image tags
    ["imeta", "<inline metadata as per NIP-92>"] // Optional, helps with image handling
  ]
}
```

The `recorded_at` tag specifies when the activity actually occurred, which may be different from the event's `created_at` timestamp (when the activity was posted to Nostr). For example, a user might record a morning run at 7am (`recorded_at`) but not post it until noon (`created_at`).

All measurements in tags MUST use metric units. Clients can convert to imperial units for display if desired.

#### Private Activity Event (`kind:30102`) 
An encrypted version of the activity event, using NIP-44 encryption. Useful when users want to sync activities across their devices without making them public.

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
Activity events can include photos using the `image` tag as defined in NIP-23 and can optionally use the `imeta` tag from NIP-92 for richer image metadata. Multiple photos can be attached to a single activity by using multiple `image` tags.

Photos SHOULD be hosted using Blossom compliant file storage servers when possible.

### Privacy Considerations
Activity data often contains sensitive location information. Clients SHOULD:
- Allow users to trim/blur start/end points of routes
- Support publishing both public (`kind:30100`) and private (`kind:30102`) versions of activities
- Clearly communicate what data will be public vs private
- Allow users to control what metrics are included in tags
- Strip EXIF data from photos before uploading unless explicitly preserved by user choice
- Warn users if photos contain location metadata

### Extension Points
Rather than trying to standardize every possible activity metric or analysis, this NIP focuses on the core event structure. More specialized analysis and visualization can be built through:

1. Data Vending Machines (NIPs 90+) that analyze activity files and produce specialized metrics
2. Client-specific tags for additional metadata
3. Future NIPs for standardizing advanced features like segments, routes, and challenges

### Example
```json
{
  "kind": 30100,
  "created_at": 1705324800,
  "content": "Great morning run through the park!",
  "tags": [
    ["d", "2024-01-15-morning-run"],
    ["t", "run"], 
    ["title", "Morning Park Run"],
    ["recorded_at", "1705312800"],
    ["distance", "5280"],
    ["duration", "1800"],
    ["elevation_gain", "42"],
    ["elevation_loss", "42"],
    ["avg_speed", "2.93"],
    ["max_speed", "3.5"],
    ["r", "https://example.com/activities/run1234.gpx"],
    ["image", "https://storage.example.com/activity1234/photo1.jpg", "1200", "800"],
    ["image", "https://storage.example.com/activity1234/photo2.jpg", "1200", "800"]
  ]
}
```