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
    description: "A nice morning run in Central Park",
    metrics: {
      distance: 5200,
      duration: 1800,
      elevation_gain: 100,
      elevation_loss: 50,
      average_speed: 2.93,
      max_speed: 3.5,
    },
    activityFileUrl: "https://example.com/run-data.gpx",
    images: [
      "https://image.nostr.build/e919fac51937d0fab3f91cd6907ca5a1c2161d336c7d5fe14afb0079d01f4c05.jpg",
      "https://image.nostr.build/4019f39301f620f7409d8b5806206ab981ae8c16cb3d326f3292702341e8dd98.jpg",
    ],
  },
  {
    id: cuid(),
    title: "Afternoon Bike Ride in Prospect Park",
    type: "ride",
    recordedAt: Date.now(),
    description: "A nice afternoon bike ride in Prospect Park",
    metrics: {
      distance: 15000,
      duration: 3600,
      elevation_gain: 100,
      elevation_loss: 50,
      average_speed: 2.93,
      max_speed: 3.5,
    },
    activityFileUrl: "https://example.com/bike-data.gpx",
    images: [
      "https://image.nostr.build/e919fac51937d0fab3f91cd6907ca5a1c2161d336c7d5fe14afb0079d01f4c05.jpg",
      "https://image.nostr.build/4019f39301f620f7409d8b5806206ab981ae8c16cb3d326f3292702341e8dd98.jpg",
    ],
  },
];

const sk = generateSecretKey();
const signedEvents: Event[] = [];

for (const activity of sampleActivities) {
  const publicEvent = createPublicActivityEvent(activity);
  const signedPublicEvent = finalizeEvent(publicEvent, sk);
  signedEvents.push(signedPublicEvent);
}
