import { type Event } from 'nostr-tools'
import { finalizeEvent } from 'nostr-tools/pure'
import * as nip44 from 'nostr-tools/nip44'
import { ActivityData } from './types'
import cuid from 'cuid'

export class ActivityBuilder {
  private static readonly PUBLIC_KIND = 30100
  private static readonly PRIVATE_KIND = 30102

  /**
   * Creates a public activity event
   */
  static createPublicEvent(data: ActivityData, secretKey: Uint8Array): Event {
    return this.createEvent(data, this.PUBLIC_KIND, secretKey)
  }

  /**
   * Creates an encrypted private activity event
   */
  static createPrivateEvent(data: ActivityData, secretKey: Uint8Array): Event {
    const event = this.createEvent(data, this.PRIVATE_KIND, secretKey)
    
    // For private events, encrypt all metrics as content
    const encryptedContent = nip44.encrypt(
      JSON.stringify({
        distance: data.metrics.distance,
        duration: data.metrics.duration,
        elevation_gain: data.metrics.elevation_gain,
        elevation_loss: data.metrics.elevation_loss,
        average_speed: data.metrics.average_speed,
        max_speed: data.metrics.max_speed
      }),
      secretKey,
    )
    event.content = encryptedContent
    
    return event
  }

  private static createEvent(
    data: ActivityData,
    kind: number,
    secretKey: Uint8Array
  ): Event {
    const tags: string[][] = [
      ['d', this.generateIdentifier()],
      ['t', data.type],
      ['title', data.title],
      ['recorded_at', data.recordedAt.toString()]
    ]

    // Add metrics as tags for public events
    if (kind === this.PUBLIC_KIND) {
      if (data.metrics.distance) tags.push(['distance', data.metrics.distance.toString()])
      if (data.metrics.duration) tags.push(['duration', data.metrics.duration.toString()])
      if (data.metrics.elevation_gain) tags.push(['elevation_gain', data.metrics.elevation_gain.toString()])
      if (data.metrics.elevation_loss) tags.push(['elevation_loss', data.metrics.elevation_loss.toString()])
      if (data.metrics.average_speed) tags.push(['avg_speed', data.metrics.average_speed.toString()])
      if (data.metrics.max_speed) tags.push(['max_speed', data.metrics.max_speed.toString()])
    }

    if (data.description) {
      tags.push(['desc', data.description])
    }

    if (data.activityFileUrl) {
      tags.push(['r', data.activityFileUrl])
    }

    if (data.images) {
      data.images.forEach(img => {
        const imageTag = ['image', img.url]
        if (img.width) imageTag.push(img.width.toString())
        if (img.height) imageTag.push(img.height.toString())
        tags.push(imageTag)
      })
    }

    const eventTemplate = {
      kind,
      created_at: Math.floor(Date.now() / 1000),
      tags,
      content: data.description || '' // Use description as content for public events
    }

    return finalizeEvent(eventTemplate, secretKey)
  }

  private static generateIdentifier(): string {
    return cuid()
  }
} 