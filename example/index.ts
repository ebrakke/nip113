import cuid from "cuid";
import { Activity, createPublicActivityEvent } from "../lib";
import { generateSecretKey } from "nostr-tools";
import { finalizeEvent, Event } from "nostr-tools";

export const sampleActivities: Activity[] = [
  {
    id: cuid(),
    title: "Morning Run in Central Park",
    type: "run",
    recordedAt: Date.now(),
    metrics: {
      distance: 5200,
      duration: 1800,
      elevation_gain: 100,
      elevation_loss: 50,
      average_speed: 2.93,
      max_speed: 3.5,
    },
    activityFileUrl: "https://example.com/run-data.gpx",
    images: ["https://placehold.co/600x400", "https://placehold.co/600x400"],
  },
  {
    id: cuid(),
    title: "Afternoon Bike Ride in Prospect Park",
    type: "ride",
    recordedAt: Date.now(),
    metrics: {
      distance: 15000,
      duration: 3600,
      elevation_gain: 100,
      elevation_loss: 50,
      average_speed: 2.93,
      max_speed: 3.5,
    },
    activityFileUrl: "https://example.com/bike-data.gpx",
    images: ["https://placehold.co/600x400", "https://placehold.co/600x400"],
  },
];

const sk = generateSecretKey()
const signedEvents: Event[] = []

for (const activity of sampleActivities) {
  const publicEvent = createPublicActivityEvent(activity)
  const signedPublicEvent = finalizeEvent(publicEvent, sk)
  signedEvents.push(signedPublicEvent)
}

