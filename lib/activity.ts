import type { Event, EventTemplate } from "nostr-tools";
import {
  Activity,
  PrivateActivityContent,
  ActivityType,
} from "./types";
import { encrypt, decrypt } from "nostr-tools/nip44";

/**
 * Creates an unsigned public activity event (kind 30100)
 */
export function createPublicActivityEvent(activity: Activity): EventTemplate {
  const tags = [
    ["d", activity.id],
    ["t", activity.type],
    ["title", activity.title],
  ];

  if (activity.activityFileUrl) {
    tags.push(["r", activity.activityFileUrl]);
  }

  if (activity.description) {
    tags.push(["description", activity.description]);
  }

  if (activity.images?.length) {
    activity.images.forEach((img) => {
      const imgTag = ["image", img];
      tags.push(imgTag);
    });
  }

  return {
    kind: 30100,
    created_at: Math.floor(Date.now() / 1000),
    tags,
    content: JSON.stringify(activity.metrics),
  };
}

/**
 * Creates an unsigned private activity event (kind 30102)
 */
export function createPrivateActivityEvent(
  activity: Activity,
  privateKey: Uint8Array
): EventTemplate {
  const privateContent: PrivateActivityContent = {
    metrics: activity.metrics,
    sensitive_tags: {
      title: activity.title,
      images: activity.images,
      r: activity.activityFileUrl,
    },
  };

  if (activity.activityFileUrl) {
    privateContent.sensitive_tags.r = activity.activityFileUrl;
  }

  if (activity.description) {
    privateContent.sensitive_tags.description = activity.description;
  }

  // Encrypt the content using NIP-44
  const encryptedContent = encrypt(JSON.stringify(privateContent), privateKey);

  return {
    kind: 30102,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["d", activity.id],
      ["t", activity.type],
      ["title", activity.title],
    ],
    content: encryptedContent,
  };
}

/**
 * Parses an activity event back into an Activity object
 */
export function parseActivityEvent(
  event: Event,
  privateKey?: Uint8Array
): Activity {
  let content: any;

  if (event.kind === 30102) {
    if (!privateKey) {
      throw new Error("Private key required to decrypt private activity event");
    }
    // Decrypt the content for private events
    const decryptedContent = decrypt(event.content, privateKey);
    content = JSON.parse(decryptedContent);
  } else {
    content = JSON.parse(event.content);
  }

  const activity: Activity = {
    id: event.tags.find((t) => t[0] === "d")?.[1]!,
    title: event.kind === 30100 ? event.tags.find((t) => t[0] === "title")?.[1] : content.sensitive_tags.title,
    type: event.tags.find((t) => t[0] === "t")?.[1] as ActivityType,
    description: event.kind === 30100 ? event.tags.find((t) => t[0] === "description")?.[1] : content.sensitive_tags.description,
    recordedAt: parseInt(
      event.tags.find((t) => t[0] === "recorded_at")?.[1] || "0"
    ),
    metrics: event.kind === 30100 ? JSON.parse(event.content) : content.metrics,
  };

  // Handle images
  if (event.kind === 30100) {
    const imageTags = event.tags.filter((t) => t[0] === "image");
    if (imageTags.length > 0) {
      activity.images = imageTags.map((tag) => tag[1]);
    }
  } else if (event.kind === 30102) {
    activity.images = content.sensitive_tags.images;
  }

  // Handle activity file URL
  if (event.kind === 30100) {
    const rTag = event.tags.find((t) => t[0] === "r");
    if (rTag) {
      activity.activityFileUrl = rTag[1];
    }
  } else if (event.kind === 30102) {
    activity.activityFileUrl = content.sensitive_tags.r;
  }

  return activity;
}
