import { type Event } from 'nostr-tools'
import * as nip44 from 'nostr-tools/nip44'
import { ActivityData, ActivityMetrics, ActivityType } from './types'

export class ActivityParser {
  static parseEvent(event: Event, secretKey?: Uint8Array): ActivityData {
    const type = event.tags.find(t => t[0] === 't')?.[1] as ActivityType
    const title = event.tags.find(t => t[0] === 'title')?.[1]
    const recordedAt = event.tags.find(t => t[0] === 'recorded_at')?.[1]
    const description = event.tags.find(t => t[0] === 'desc')?.[1] || event.content
    const activityFileUrl = event.tags.find(t => t[0] === 'r')?.[1]

    if (!type || !title || !recordedAt) {
      throw new Error('Invalid activity event: missing required tags')
    }

    const images = event.tags
      .filter(t => t[0] === 'image')
      .map(t => ({
        url: t[1],
        width: t[2] ? parseInt(t[2]) : undefined,
        height: t[3] ? parseInt(t[3]) : undefined,
      }))

    let metrics: ActivityMetrics

    if (event.kind === 30102 && secretKey) {
      // For private events, decrypt metrics from content
      const decrypted = nip44.decrypt(event.content, secretKey)
      metrics = JSON.parse(decrypted)
    } else {
      // For public events, read metrics from tags
      metrics = {
        distance: this.parseNumericTag(event.tags, 'distance') || 0,
        duration: this.parseNumericTag(event.tags, 'duration') || 0,
        elevation_gain: this.parseNumericTag(event.tags, 'elevation_gain') || 0,
        elevation_loss: this.parseNumericTag(event.tags, 'elevation_loss') || 0,
        average_speed: this.parseNumericTag(event.tags, 'avg_speed') || 0,
        max_speed: this.parseNumericTag(event.tags, 'max_speed') || 0
      }
    }

    return {
      type,
      title,
      recordedAt: parseInt(recordedAt),
      description,
      activityFileUrl,
      images,
      metrics
    }
  }

  private static parseNumericTag(tags: string[][], name: string): number | undefined {
    const value = tags.find(t => t[0] === name)?.[1]
    return value ? parseFloat(value) : undefined
  }
}
