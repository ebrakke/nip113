import { 
  Activity,
  ActivityEvent,
  PrivateActivityContent,
  EventTemplate,
} from './types'
import { encrypt, decrypt } from 'nostr-tools/nip44'

/**
 * Creates an unsigned public activity event (kind 30100)
 */
export function createPublicActivityEvent(activity: Activity): EventTemplate {
  const tags = [
    ['d', activity.recordedAt.toString()],
    ['activity', activity.activityType],
  ]

  if (activity.activityFileUrl) {
    tags.push(['r', activity.activityFileUrl])
  }

  if (activity.images?.length) {
    activity.images.forEach(img => {
      const imgTag = ['image', img.url]
      if (img.width && img.height) {
        imgTag.push(img.width.toString(), img.height.toString())
      }
      if (img.imeta) {
        imgTag.push(img.imeta)
      }
      tags.push(imgTag)
    })
  }

  return {
    kind: 30100,
    created_at: Math.floor(Date.now() / 1000),
    tags,
    content: JSON.stringify({
      title: activity.title,
      metrics: activity.metrics
    })
  }
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
      images: activity.images
    }
  }

  if (activity.activityFileUrl) {
    privateContent.sensitive_tags.r = activity.activityFileUrl
  }

  // Encrypt the content using NIP-44
  const encryptedContent = encrypt(
    JSON.stringify(privateContent),
    privateKey
  )

  return {
    kind: 30102,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ['d', activity.recordedAt.toString()],
      ['activity', activity.activityType],
    ],
    content: encryptedContent
  }
}

/**
 * Parses an activity event back into an Activity object
 */
export function parseActivityEvent(
  event: ActivityEvent, 
  privateKey?: Uint8Array
): Activity {
  let content: any
  
  if (event.kind === 30102) {
    if (!privateKey) {
      throw new Error('Private key required to decrypt private activity event')
    }
    // Decrypt the content for private events
    const decryptedContent = decrypt(
      event.content,
      privateKey,
    )
    content = JSON.parse(decryptedContent)
  } else {
    content = JSON.parse(event.content)
  }
  
  const activity: Activity = {
    title: event.kind === 30100 ? content.title : content.sensitive_tags.title,
    activityType: event.tags.find(t => t[0] === 'activity')?.[1] as Activity['activityType'],
    recordedAt: parseInt(event.tags.find(t => t[0] === 'd')?.[1] || '0'),
    metrics: event.kind === 30100 ? content.metrics : content.metrics,
  }

  // Handle images
  if (event.kind === 30100) {
    const imageTags = event.tags.filter(t => t[0] === 'image')
    if (imageTags.length > 0) {
      activity.images = imageTags.map(tag => ({
        url: tag[1],
        ...(tag[2] ? {
          width: parseInt(tag[2]),
          height: parseInt(tag[3])
        } : {}),
        ...(tag[4] ? { imeta: tag[4] } : {})
      }))
    }
  } else if (event.kind === 30102) {
    activity.images = content.sensitive_tags.images
  }

  // Handle activity file URL
  if (event.kind === 30100) {
    const rTag = event.tags.find(t => t[0] === 'r')
    if (rTag) {
      activity.activityFileUrl = rTag[1]
    }
  } else if (event.kind === 30102) {
    activity.activityFileUrl = content.sensitive_tags.r
  }

  return activity
} 